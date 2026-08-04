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
