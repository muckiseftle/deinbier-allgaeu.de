/**
 * Kontrastmessung an gerenderten Bildpunkten.
 *
 * Wo Text auf einem Foto oder Verlauf liegt, laesst sich der Kontrast nicht
 * aus dem CSS ableiten: die Hintergrundfarbe ist dort das Bild selbst.
 * Dieses Werkzeug fotografiert den Bereich hinter dem Text und misst den
 * hellsten Bildpunkt darin, also den unguenstigsten Fall.
 *
 * Der Vorschauserver muss auf Port 4321 laufen.
 * Aufruf:  node werkzeuge/qa-bildpunkte.mjs
 */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const BASIS = 'http://localhost:4321';

/* Textstellen, die auf Bildern oder Verlaeufen liegen. */
const STELLEN = [
  { pfad: '/', auswahl: '.band-text h2', name: 'Bildband, Ueberschrift' },
  { pfad: '/', auswahl: '.band-text p', name: 'Bildband, Fliesstext' },
  { pfad: '/', auswahl: '.band-text a', name: 'Bildband, Link' },

  /* Text ueber den grossen Hintergrundmotiven der Startseite. Die Motive
     stehen an den Raendern und ragen unter den Textspalten hindurch; sie
     dunkeln die Cremeflaeche dort leicht ab. Ob der Text darueber noch AA
     erfuellt, laesst sich nur am gerenderten Bildpunkt entscheiden.
     Beim Ueberfahren wird der Grund noch etwas kraeftiger (0,085 auf 0,14),
     deshalb misst der Lauf weiter unten zusaetzlich im Hoverzustand. */
  { pfad: '/', auswahl: '.bento-nachsatz', name: 'Motiv Gerste, Nachsatz' },
  { pfad: '/', auswahl: '.bierkarte-quer h3', name: 'Motiv Gerste, Kartentitel' },
  { pfad: '/', auswahl: '.stellen-nachsatz', name: 'Motiv Hopfen, Nachsatz' },
  { pfad: '/', auswahl: '.stellen-gruppe h3', name: 'Motiv Hopfen, Ortsueberschrift' },

  /* Leiser Sekundaertext auf reiner Cremeflaeche. Das ist die Farbe mit dem
     knappsten Abstand im ganzen System, deshalb bleibt sie unter Beobachtung. */
  { pfad: '/kontakt/', auswahl: '.anfragen-hinweis', name: 'Creme, leiser Fliesstext' },
  { pfad: '/kontakt/', auswahl: '.social-hinweis', name: 'Creme, leiser Nebentext' },
  { pfad: '/datenschutz/', auswahl: '.rechtstext p', name: 'Creme, Fliesstext' },
  { pfad: '/verkaufsstellen/', auswahl: '.region-titel', name: 'Creme, Etikettenzeile' },
  { pfad: '/biere/', auswahl: '.bier-saison', name: 'Creme, Saisonhinweis' },

  /* Derselbe Text noch einmal, waehrend das Motiv ueberfahren wird: dann ist
     der Grund am kraeftigsten und das Goldlicht liegt zusaetzlich darauf.
     Das ist der wirklich unguenstigste Zustand. */
  {
    pfad: '/',
    auswahl: '.bento-nachsatz',
    ueberfahre: '.abschnitt-motiv .leitmotiv',
    name: 'Motiv Gerste beim Ueberfahren, Nachsatz',
  },
  {
    pfad: '/',
    auswahl: '.bierkarte-quer h3',
    ueberfahre: '.abschnitt-motiv .leitmotiv',
    name: 'Motiv Gerste beim Ueberfahren, Kartentitel',
  },
];

function leuchtdichte(r, g, b) {
  const f = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function kontrast(a, b) {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

const browser = await chromium.launch({ channel: 'msedge' });
const kontext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await kontext.addInitScript(() => {
  try {
    localStorage.setItem('db-alter-bestaetigt', 'ja');
  } catch {}
});
const seite = await kontext.newPage();

let fehler = 0;

for (const stelle of STELLEN) {
  await seite.goto(BASIS + stelle.pfad, { waitUntil: 'networkidle' });
  await seite.evaluate(() =>
    document.querySelectorAll('.einblenden').forEach((el) => el.classList.add('sichtbar')),
  );
  await seite.waitForTimeout(400);

  const el = seite.locator(stelle.auswahl).first();
  if ((await el.count()) === 0) {
    console.log(`  FEHL ${stelle.name}: Element nicht gefunden`);
    fehler++;
    continue;
  }

  const farbe = await el.evaluate((e) => getComputedStyle(e).color);
  const m = farbe.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const textLd = leuchtdichte(+m[1], +m[2], +m[3]);

  /* In den Sichtbereich scrollen: ausserhalb liegende Bereiche lassen sich
     nicht fotografieren. */
  await el.scrollIntoViewIfNeeded();
  await seite.waitForTimeout(250);

  /* Falls gefordert: ein anderes Element ueberfahren, damit dessen
     Hoverzustand im Bild landet.
     Bewusst nicht ueber `locator.hover()`: das scrollt das zu ueberfahrende
     Element in den Sichtbereich und schiebt damit die eigentliche Messstelle
     heraus. Stattdessen wird der Zeiger auf einen Punkt gesetzt, der im
     bereits gescrollten Zustand innerhalb des Fensters liegt. */
  if (stelle.ueberfahre) {
    const ziel = seite.locator(stelle.ueberfahre).first();
    const zk = await ziel.boundingBox();
    if (!zk) {
      console.log(`  FEHL ${stelle.name}: ${stelle.ueberfahre} nicht sichtbar`);
      fehler++;
      continue;
    }
    const px = Math.min(1435, Math.max(5, zk.x + zk.width * 0.5));
    const py = Math.min(895, Math.max(5, zk.y + zk.height * 0.5));
    await seite.mouse.move(px, py, { steps: 6 });
    await seite.waitForTimeout(700);
  } else {
    /* Zeiger aus dem Weg, sonst faerbt ein zufaelliger Hover das Bild. */
    await seite.mouse.move(1430, 890);
  }

  /* Den Bereich hinter dem Text fotografieren: Text unsichtbar schalten,
     damit nur der Hintergrund im Bild landet. */
  await el.evaluate((e) => (e.style.visibility = 'hidden'));
  const kasten = await el.boundingBox();
  const bild = await seite.screenshot({
    clip: { x: kasten.x, y: kasten.y, width: kasten.width, height: kasten.height },
  });
  await el.evaluate((e) => (e.style.visibility = ''));

  const png = PNG.sync.read(bild);
  let hellste = 0;
  let dunkelste = 1;
  for (let i = 0; i < png.data.length; i += 4) {
    const ld = leuchtdichte(png.data[i], png.data[i + 1], png.data[i + 2]);
    if (ld > hellste) hellste = ld;
    if (ld < dunkelste) dunkelste = ld;
  }

  /* Der unguenstigste Fall: heller Text auf dem hellsten Hintergrundpunkt,
     dunkler Text auf dem dunkelsten. */
  const schlimmster = textLd > 0.5 ? kontrast(textLd, hellste) : kontrast(textLd, dunkelste);

  const groesse = await el.evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  const gewicht = await el.evaluate((e) => parseInt(getComputedStyle(e).fontWeight, 10) || 400);
  const gross = groesse >= 24 || (groesse >= 18.66 && gewicht >= 700);
  const grenze = gross ? 3 : 4.5;

  const bestanden = schlimmster >= grenze;
  if (!bestanden) fehler++;
  console.log(
    `  ${bestanden ? 'OK  ' : 'FEHL'} ${stelle.name}` +
      `  ungünstigster Punkt ${schlimmster.toFixed(2)}:1 (nötig ${grenze}, ${Math.round(groesse)}px)`,
  );
}

await browser.close();
console.log(`\n${fehler === 0 ? 'Keine Fehler.' : fehler + ' Fehler.'}\n`);
process.exit(fehler === 0 ? 0 : 1);
