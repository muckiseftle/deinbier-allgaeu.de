/**
 * Stellt eine Vorlage und die eigene Zeichnung nebeneinander, gleich hoch,
 * auf eine Flaeche.
 *
 * Warum es dieses Werkzeug gibt: die Hopfendolde ist sechsmal entstanden, und
 * fuenfmal habe ich sie nur fuer sich betrachtet und fuer richtig gehalten.
 * Einzeln sieht fast jede Zeichnung "irgendwie passend" aus — das Auge
 * ergaenzt, was es erwartet. Erst nebeneinander wurde in Sekunden sichtbar,
 * was fehlte: runde Becher statt spitzer Blaetter, ein nach unten spitzes
 * Dreieck statt eines Eis, ein Mittelstreifen statt Reihen.
 *
 * Die Lehre gilt ueber die Dolde hinaus: bei allem, was einer Vorlage folgen
 * soll, nie einzeln beurteilen.
 *
 * Der Vorschauserver muss auf Port 4321 laufen.
 * Aufruf:  node werkzeuge/vergleich.mjs <zielordner> <vorlage.png> [motiv-nr]
 */
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const AUS = process.argv[2];
const VORLAGE = process.argv[3];
const NR = Number(process.argv[4] ?? 0);

if (!AUS || !VORLAGE) {
  console.log('Aufruf: node werkzeuge/vergleich.mjs <zielordner> <vorlage.png> [motiv-nr]');
  process.exit(1);
}

const daten = readFileSync(VORLAGE).toString('base64');

const browser = await chromium.launch({ channel: 'msedge' });
const kontext = await browser.newContext({
  viewport: { width: 1200, height: 760 },
  deviceScaleFactor: 2,
});
await kontext.addInitScript(() => {
  try {
    localStorage.setItem('db-alter-bestaetigt', 'ja');
  } catch {}
});
const seite = await kontext.newPage();
await seite.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

await seite.evaluate(
  ([bild, nr]) => {
    const motiv = document.querySelectorAll('.leitmotiv')[nr];
    if (!motiv) throw new Error(`Motiv ${nr} nicht gefunden`);

    const buehne = document.createElement('div');
    buehne.id = 'buehne';
    buehne.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:#fbf7ec;display:flex;' +
      'align-items:center;justify-content:center;gap:60px';

    const links = document.createElement('img');
    links.src = 'data:image/png;base64,' + bild;
    links.style.cssText = 'height:620px;width:auto;object-fit:contain';

    /* Kopie statt Original: das Motiv im Seitenzusammenhang ist gedreht,
       angeschnitten und blass. Zum Beurteilen der Form muss es aufrecht,
       vollstaendig und deckend sein. */
    const kopie = motiv.cloneNode(true);
    for (const [eig, wert] of Object.entries({
      position: 'relative',
      top: 'auto',
      right: 'auto',
      left: 'auto',
      transform: 'none',
      display: 'block',
    })) {
      kopie.style.setProperty(eig, wert);
    }
    /* Nicht cssText setzen: das wuerde die eigenen Eigenschaften des Motivs
       mitloeschen, und ohne --motiv-verhaeltnis hat es keine Breite mehr. */
    kopie.style.setProperty('--motiv-hoehe', '620px');
    kopie.querySelector('.leitmotiv-grund').style.opacity = '1';
    kopie.querySelector('.leitmotiv-licht')?.remove();

    buehne.append(links, kopie);
    document.body.appendChild(buehne);
  },
  [daten, NR],
);

await seite.waitForTimeout(400);
const ziel = `${AUS}/vergleich-${NR}.png`;
await seite.locator('#buehne').screenshot({ path: ziel });
console.log(ziel);
await browser.close();
