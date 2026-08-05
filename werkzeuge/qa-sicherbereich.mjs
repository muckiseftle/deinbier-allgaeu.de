/**
 * Prueft die Kopfzeile im Sicherheitsbereich — dem Streifen unter der
 * Dynamic Island, der Notch oder der Statusleiste.
 *
 * Kein Emulator hier liefert echte Werte fuer `env(safe-area-inset-top)`.
 * Dieser Test stellt deshalb das ERGEBNIS nach: er setzt den Innenabstand der
 * Kopfzeile auf die 59 px eines iPhone mit Dynamic Island. Ohne dieses
 * Nachstellen waere die Regel nur behauptet und nie geprueft.
 *
 * Bewusst nicht ueber eine eigene Eigenschaft: ein frueherer Stand fuehrte
 * den Wert ueber `--kopf-sicher: env(...)`. Das liess sich bequem
 * nachstellen, war aber genau die Stelle, an der Safari aussteigt — faellt
 * die Ersetzung aus, wird der Innenabstand 0 und die Leiste beginnt erst
 * unterhalb der Insel. Die Pruefung war gruen, das Geraet zeigte etwas
 * anderes. Ein Test darf den Weg, den er pruefen soll, nicht selbst
 * begradigen.
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
/* Nachgestellt wird der INNENABSTAND, nicht eine Variable.

   Ein frueherer Stand fuehrte den Wert ueber `--kopf-sicher: env(...)`. Das
   liess sich zwar bequem nachstellen, war aber genau die Stelle, an der
   Safari aussteigt: faellt die Ersetzung aus, ist der ganze Wert ungueltig
   und der Innenabstand wird 0 — die Leiste beginnt dann erst unterhalb der
   Insel. Die Pruefung war gruen, das Geraet zeigte etwas anderes.

   Jetzt steht `env()` direkt in der Regel, und hier wird nur das Ergebnis
   nachgestellt. */
await seite.addStyleTag({
  content: `.kopfzeile { padding-top: ${INSEL}px !important; }
            .kopf-holen { height: ${INSEL + 22}px !important; }`,
});
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

/* --- 4 · Traegt der Text die Durchlaessigkeit? ---

   Je durchlaessiger die Leiste, desto mehr schlaegt dunkler Inhalt darunter
   durch — und desto knapper wird der Kontrast der Bedienelemente. Gemessen
   wird deshalb der unguenstigste Fall: eine schwarze Flaeche hinter der
   ganzen Leiste. Ohne diese Messung waere jede Erhoehung der Durchlaessigkeit
   ein Blindflug. */
await seite.evaluate(() => {
  document.querySelector('#probe-dunkel').style.height = '160px';
});
await seite.waitForTimeout(300);

const leuchtdichte = (r, g, b) => {
  const f = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const knopf = seite.locator('[data-menueknopf]');
const kk = await knopf.boundingBox();

/* Die Flaeche hinter dem Knopf fotografieren: dafuer den Knopf unsichtbar
   schalten, sonst misst man ihn selbst. */
await knopf.evaluate((e) => (e.style.visibility = 'hidden'));
const hinter = PNG.sync.read(
  await seite.screenshot({ clip: { x: kk.x, y: kk.y, width: kk.width, height: kk.height } }),
);
await knopf.evaluate((e) => (e.style.visibility = ''));

let dunkelste = 1;
for (let i = 0; i < hinter.data.length; i += 4) {
  const ld = leuchtdichte(hinter.data[i], hinter.data[i + 1], hinter.data[i + 2]);
  if (ld < dunkelste) dunkelste = ld;
}

const farbe = await knopf.evaluate((e) => getComputedStyle(e).color);
const teile = farbe.match(/\d+/g).map(Number);
const textLd = leuchtdichte(teile[0], teile[1], teile[2]);
const kontrast =
  (Math.max(textLd, dunkelste) + 0.05) / (Math.min(textLd, dunkelste) + 0.05);

pruefe(
  'Menueknopf bleibt lesbar, auch mit schwarzer Flaeche darunter',
  kontrast >= 3,
  `${kontrast.toFixed(2)}:1 (noetig 3 fuer Bedienelemente)`,
);

await browser.close();
console.log(`\n${fehler === 0 ? 'Keine Fehler.' : fehler + ' Fehler.'}\n`);
process.exit(fehler === 0 ? 0 : 1);
