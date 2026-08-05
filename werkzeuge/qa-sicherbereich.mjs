/**
 * Prueft die Kopfzeile im Sicherheitsbereich — dem Streifen unter der
 * Dynamic Island, der Notch oder der Statusleiste.
 *
 * Kein Emulator hier liefert echte Werte fuer `env(safe-area-inset-top)`.
 * Deshalb liest die Kopfzeile den Wert nicht direkt aus `env()`, sondern aus
 * `--kopf-sicher` — und dieser Test setzt die Eigenschaft auf die 59 px eines
 * iPhone mit Dynamic Island. Ohne dieses Nachstellen waere die Regel nur
 * behauptet und nie geprueft.
 *
 * Geprueft wird dreierlei:
 * 1. Die Flaeche der Kopfzeile reicht bis an den oberen Bildschirmrand.
 * 2. Sie ist dort durchscheinend, nicht deckend. Dafuer wird an einem
 *    Bildpunkt im Streifen gemessen, ob dunkler Seiteninhalt, der darunter
 *    durchscrollt, die Farbe veraendert.
 * 3. Kein `theme-color` im Dokument. Mit einer solchen Angabe malt der
 *    Browser den Streifen deckend zu, und Punkt 2 waere hinfaellig.
 *
 * Der Vorschauserver muss auf Port 4321 laufen.
 * Aufruf:  node werkzeuge/qa-sicherbereich.mjs
 */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const BASIS = 'http://localhost:4321';
const INSEL = 59; // iPhone 15/16 Pro, oberer Sicherheitsbereich in px

const browser = await chromium.launch({ channel: 'msedge' });
const kontext = await browser.newContext({
  viewport: { width: 390, height: 780 },
  isMobile: true,
  hasTouch: true,
});
await kontext.addInitScript(() => {
  try {
    localStorage.setItem('db-alter-bestaetigt', 'ja');
  } catch {}
});
const seite = await kontext.newPage();

let fehler = 0;
const pruefe = (name, ok, hinweis = '') => {
  if (!ok) fehler++;
  console.log(`  ${ok ? 'OK  ' : 'FEHL'} ${name}${hinweis ? '  ' + hinweis : ''}`);
};

await seite.goto(BASIS + '/', { waitUntil: 'networkidle' });

/* --- 1 · Kein theme-color --- */
const themeColor = await seite.evaluate(
  () => document.querySelector('meta[name="theme-color"]')?.content ?? null,
);
pruefe(
  'Kein theme-color gesetzt',
  themeColor === null,
  themeColor ? `gefunden: ${themeColor}` : 'keins',
);

/* --- Sicherheitsbereich nachstellen --- */
await seite.addStyleTag({ content: `:root { --kopf-sicher: ${INSEL}px; }` });
await seite.waitForTimeout(300);

/* --- 2 · Flaeche reicht bis ganz oben --- */
const kasten = await seite.evaluate(() => {
  const k = document.querySelector('.kopfzeile').getBoundingClientRect();
  const innen = document.querySelector('.kopfzeile-innen').getBoundingClientRect();
  return { oben: Math.round(k.top), unten: Math.round(k.bottom), innenOben: Math.round(innen.top) };
});
pruefe(
  'Kopfzeile beginnt am oberen Rand',
  kasten.oben === 0,
  `oben ${kasten.oben}, unten ${kasten.unten}`,
);
pruefe(
  'Inhalt beginnt unter dem Sicherheitsbereich',
  kasten.innenOben >= INSEL,
  `Inhalt ab ${kasten.innenOben} px, Bereich ${INSEL} px`,
);

/* --- 3 · Durchscheinend im Streifen --- */
const punkt = { x: 40, y: Math.round(INSEL / 2) };

const farbeBei = async () => {
  const bild = PNG.sync.read(
    await seite.screenshot({ clip: { x: punkt.x, y: punkt.y, width: 4, height: 4 } }),
  );
  return [bild.data[0], bild.data[1], bild.data[2]];
};

await seite.evaluate(() => window.scrollTo(0, 0));
await seite.waitForTimeout(300);
const hell = await farbeBei();

/* Eine dunkle Flaeche gezielt HINTER die Kopfzeile legen.

   Ein erster Versuch scrollte stattdessen zu einem dunklen Abschnitt. Das
   taugte nichts: beim Abwaertsscrollen faehrt die Kopfzeile weg, und unter
   dem Streifen lag dann helles Bild statt dunklem Text. Gemessen wurde also
   gar nicht die Durchscheinbarkeit. So ist der Fall eindeutig. */
await seite.evaluate((hoehe) => {
  const probe = document.createElement('div');
  probe.id = 'probe-dunkel';
  probe.style.cssText =
    `position:fixed;top:0;left:0;right:0;height:${hoehe}px;background:#000;z-index:1`;
  document.body.appendChild(probe);
}, INSEL);
await seite.waitForTimeout(300);
const dunkel = await farbeBei();

const unterschied =
  Math.abs(hell[0] - dunkel[0]) + Math.abs(hell[1] - dunkel[1]) + Math.abs(hell[2] - dunkel[2]);

pruefe(
  'Streifen ist durchscheinend',
  unterschied > 12,
  `rgb(${hell}) ueber hellem, rgb(${dunkel}) ueber dunklem Inhalt — Unterschied ${unterschied}`,
);

await browser.close();
console.log(`\n${fehler === 0 ? 'Keine Fehler.' : fehler + ' Fehler.'}\n`);
process.exit(fehler === 0 ? 0 : 1);
