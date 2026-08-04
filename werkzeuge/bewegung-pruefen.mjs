/**
 * Funktionspruefung der Bewegungen, die JavaScript brauchen.
 *
 * Ein Uebergang, der ein Element ausblendet und danach aus dem Baum nimmt,
 * kann auf zwei Arten kaputtgehen: das Element bleibt sichtbar, oder es
 * verschwindet, ohne je wieder aufzutauchen. Beides faellt bei einem
 * Screenshot nicht auf.
 *
 * Aufruf:  node werkzeuge/bewegung-pruefen.mjs
 */
import { chromium } from 'playwright-core';

const BASIS = 'http://localhost:4321';
const browser = await chromium.launch({ channel: 'msedge' });

let fehler = 0;
function pruefe(name, bedingung, zusatz = '') {
  const zeichen = bedingung ? 'OK  ' : 'FEHL';
  if (!bedingung) fehler++;
  console.log(`${zeichen} ${name}${zusatz ? '  (' + zusatz + ')' : ''}`);
}

// --- Altersabfrage: erscheint, blendet aus, kommt nicht wieder ---------------
{
  // reducedMotion ausdruecklich setzen: sonst erbt der Testbrowser die
  // Systemeinstellung, und die Uebergaenge werden uebersprungen.
  const kontext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
  });
  const seite = await kontext.newPage();
  await seite.goto(`${BASIS}/`, { waitUntil: 'networkidle' });

  const dialog = seite.locator('[data-altersabfrage]');
  pruefe('Altersabfrage erscheint beim ersten Aufruf', await dialog.isVisible());

  await seite.locator('[data-alter-ja]').click();
  await seite.waitForTimeout(120);
  const waehrend = await dialog.evaluate((el) => el.hasAttribute('data-schliesst'));
  pruefe('Altersabfrage blendet aus statt zu verschwinden', waehrend);

  await seite.waitForTimeout(600);
  pruefe('Altersabfrage ist danach weg', !(await dialog.isVisible()));

  await seite.reload({ waitUntil: 'networkidle' });
  await seite.waitForTimeout(200);
  pruefe('Altersabfrage kommt nach dem Neuladen nicht wieder', !(await dialog.isVisible()));

  const cookies = await kontext.cookies();
  pruefe('Kein Cookie gesetzt', cookies.length === 0, `${cookies.length} gefunden`);

  await kontext.close();
}

// --- Mobiles Menue: oeffnet, schliesst, laesst sich erneut oeffnen -----------
{
  const kontext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  });
  await kontext.addInitScript(() => {
    try {
      localStorage.setItem('db-alter-bestaetigt', 'ja');
    } catch {}
  });
  const seite = await kontext.newPage();
  await seite.goto(`${BASIS}/`, { waitUntil: 'networkidle' });

  const knopf = seite.locator('[data-menueknopf]');
  const menue = seite.locator('[data-mobiles-menue]');

  pruefe('Menue ist anfangs zu', !(await menue.isVisible()));

  await knopf.click();
  await seite.waitForTimeout(150);
  pruefe('Menue oeffnet', await menue.isVisible());
  pruefe(
    'aria-expanded steht auf true',
    (await knopf.getAttribute('aria-expanded')) === 'true',
  );

  /* Nicht nur "sichtbar", sondern "deckt wirklich ab".
     Das Menue lag lange innerhalb der Kopfzeile. Deren `backdrop-filter`
     macht sie — wie `filter` und `transform` — zum Bezugsrahmen fuer
     `position: fixed`, also bezog sich das `inset` des Menues auf die Leiste
     statt auf das Fenster: es war 390 x 96 px gross und liess die Seite
     durchscheinen. `isVisible()` war dabei die ganze Zeit wahr. */
  const abdeckung = await menue.evaluate((el) => {
    const k = el.getBoundingClientRect();
    return (k.width * k.height) / (window.innerWidth * window.innerHeight);
  });
  pruefe(
    'Menue deckt das Fenster ab',
    abdeckung >= 0.95,
    `${Math.round(abdeckung * 100)} % der Fensterflaeche`,
  );

  /* Der Knopf muss waehrend des offenen Menues sichtbar und anklickbar
     bleiben, sonst gibt es keinen Weg zurueck. */
  pruefe('Menueknopf bleibt erreichbar', await knopf.isVisible());
  pruefe(
    'Menueknopf zeigt das Schliesskreuz',
    await knopf.evaluate(
      (el) => getComputedStyle(el.querySelector('.symbol-zu')).display !== 'none',
    ),
  );

  await knopf.click();
  await seite.waitForTimeout(80);
  pruefe(
    'Menue blendet aus statt zu verschwinden',
    await menue.evaluate((el) => el.hasAttribute('data-schliesst')),
  );

  await seite.waitForTimeout(500);
  pruefe('Menue ist danach zu', !(await menue.isVisible()));
  pruefe(
    'aria-expanded steht wieder auf false',
    (await knopf.getAttribute('aria-expanded')) === 'false',
  );

  // Der haeufigste Fehler bei diesem Muster: beim zweiten Mal geht nichts mehr.
  await knopf.click();
  await seite.waitForTimeout(200);
  pruefe('Menue laesst sich ein zweites Mal oeffnen', await menue.isVisible());

  // Escape muss ebenfalls schliessen.
  await seite.keyboard.press('Escape');
  await seite.waitForTimeout(500);
  pruefe('Escape schliesst das Menue', !(await menue.isVisible()));

  await kontext.close();
}

// --- Reduzierte Bewegung: alles sofort, nichts bleibt haengen ----------------
{
  const kontext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const seite = await kontext.newPage();
  await seite.goto(`${BASIS}/`, { waitUntil: 'networkidle' });

  await seite.locator('[data-alter-ja]').click();
  await seite.waitForTimeout(60);
  pruefe(
    'Bei reduzierter Bewegung schliesst die Altersabfrage sofort',
    !(await seite.locator('[data-altersabfrage]').isVisible()),
  );

  const knopf = seite.locator('[data-menueknopf]');
  await knopf.click();
  await seite.waitForTimeout(60);
  await knopf.click();
  await seite.waitForTimeout(60);
  pruefe(
    'Bei reduzierter Bewegung schliesst das Menue sofort',
    !(await seite.locator('[data-mobiles-menue]').isVisible()),
  );

  // Abschnitte duerfen bei reduzierter Bewegung nicht unsichtbar bleiben.
  const unsichtbar = await seite.evaluate(
    () =>
      Array.from(document.querySelectorAll('.einblenden')).filter(
        (el) => getComputedStyle(el).opacity === '0',
      ).length,
  );
  pruefe('Keine unsichtbaren Abschnitte bei reduzierter Bewegung', unsichtbar === 0, `${unsichtbar}`);

  await kontext.close();
}

await browser.close();
console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Pruefung(en) fehlgeschlagen.`);
process.exit(fehler === 0 ? 0 : 1);
