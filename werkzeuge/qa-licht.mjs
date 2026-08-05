/**
 * Prueft den Lichtpunkt an den Leitmotiven — und zwar dort, wo er wirkt:
 * in der Maske der Goldlage, nicht am Motiv selbst.
 *
 * Genau daran ist die Pruefung einmal vorbeigegangen. Gemessen wurde
 * `--licht-y` am Motiv; der Wert wanderte sauber. Die Goldlage eine Ebene
 * tiefer bekam ihn aber gar nicht, weil die Eigenschaft mit
 * `inherits: false` angemeldet war. Der Effekt war tot, die Messung gruen.
 *
 * Der Vorschauserver muss auf Port 4321 laufen.
 * Aufruf:  node werkzeuge/qa-licht.mjs
 */
import { chromium } from 'playwright-core';

const BASIS = 'http://localhost:4321';
const browser = await chromium.launch({ channel: 'msedge' });
let fehler = 0;

const pruefe = (name, ok, hinweis = '') => {
  if (!ok) fehler++;
  console.log(`  ${ok ? 'OK  ' : 'FEHL'} ${name}${hinweis ? '  ' + hinweis : ''}`);
};

/** Liest den Mittelpunkt der Lichtmaske so, wie der Browser ihn benutzt. */
const maskenOrt = (seite) =>
  seite.evaluate(() => {
    const licht = document.querySelector('.leitmotiv-licht');
    const cs = getComputedStyle(licht);
    const maske = cs.maskImage || cs.webkitMaskImage;
    /* Aus "radial-gradient(... at 123px 456px, ...)" den Ort holen. */
    const treffer = maske.match(/at\s+([^,]+),/);
    return treffer ? treffer[1].trim() : maske.slice(0, 60);
  });

/* --- Zeigergeraet --- */
console.log('\n1 · Mit Zeiger (Ueberfahren)');
{
  const k = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await k.addInitScript(() => {
    try {
      localStorage.setItem('db-alter-bestaetigt', 'ja');
    } catch {}
  });
  const s = await k.newPage();
  await s.goto(BASIS + '/', { waitUntil: 'networkidle' });
  await s.waitForTimeout(400);

  const m = s.locator('.leitmotiv').first();
  const kasten = await m.boundingBox();

  await s.mouse.move(kasten.x + kasten.width * 0.3, kasten.y + kasten.height * 0.3, { steps: 6 });
  await s.waitForTimeout(400);
  const a = await maskenOrt(s);

  await s.mouse.move(kasten.x + kasten.width * 0.7, kasten.y + kasten.height * 0.75, { steps: 6 });
  await s.waitForTimeout(400);
  const b = await maskenOrt(s);

  pruefe('Maske folgt dem Zeiger', a !== b, `${a}  ->  ${b}`);
  await k.close();
}

/* --- Geraet ohne Zeiger --- */
console.log('\n2 · Ohne Zeiger (Scrollen)');
{
  const k = await browser.newContext({
    viewport: { width: 390, height: 780 },
    isMobile: true,
    hasTouch: true,
  });
  await k.addInitScript(() => {
    try {
      localStorage.setItem('db-alter-bestaetigt', 'ja');
    } catch {}
  });
  const s = await k.newPage();
  await s.goto(BASIS + '/', { waitUntil: 'networkidle' });
  await s.waitForTimeout(500);

  const deckkraft = await s.evaluate(
    () => getComputedStyle(document.querySelector('.leitmotiv-licht')).opacity,
  );
  pruefe('Goldlage ist sichtbar', Number(deckkraft) > 0.9, `Deckkraft ${deckkraft}`);

  const orte = [];
  for (const y of [0, 150, 300, 450]) {
    await s.evaluate((v) => window.scrollTo(0, v), y);
    await s.waitForTimeout(350);
    orte.push(await maskenOrt(s));
  }
  const wandert = new Set(orte).size > 2;
  pruefe('Maske wandert beim Scrollen', wandert, orte.join('  |  '));
  await k.close();
}

await browser.close();
console.log(`\n${fehler === 0 ? 'Keine Fehler.' : fehler + ' Fehler.'}\n`);
process.exit(fehler === 0 ? 0 : 1);
