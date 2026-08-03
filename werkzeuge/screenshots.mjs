/**
 * Screenshots fuer die Sichtpruefung.
 *
 * Nutzt den installierten Edge statt einen eigenen Chromium herunterzuladen.
 * Setzt die Altersabfrage vorab auf "beantwortet", damit der Dialog die
 * Seiten nicht verdeckt.
 *
 * playwright-core statt playwright: das Kernpaket laedt keine Browser
 * herunter. Wir benutzen den auf dem System vorhandenen Edge.
 *
 * Aufruf:
 *   node werkzeuge/screenshots.mjs <zielordner> [pfad ...]
 *
 * Der Vorschauserver muss auf Port 4321 laufen (npm run preview).
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASIS = 'http://localhost:4321';

const ziel = process.argv[2];
if (!ziel) {
  console.error('Kein Zielordner angegeben.');
  process.exit(1);
}

const pfade = process.argv.slice(3);
if (pfade.length === 0) {
  console.error('Keine Pfade angegeben.');
  process.exit(1);
}

const ANSICHTEN = [
  { name: 'desktop', breite: 1440, hoehe: 900 },
  { name: 'mobil', breite: 390, hoehe: 844 },
];

mkdirSync(ziel, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });

for (const ansicht of ANSICHTEN) {
  const kontext = await browser.newContext({
    viewport: { width: ansicht.breite, height: ansicht.hoehe },
    deviceScaleFactor: 1,
    locale: 'de-DE',
  });

  // Altersabfrage vorab beantworten, damit sie die Seiten nicht verdeckt.
  await kontext.addInitScript(() => {
    try {
      localStorage.setItem('db-alter-bestaetigt', 'ja');
    } catch {
      /* Speicher gesperrt: dann eben mit Dialog. */
    }
  });

  const seite = await kontext.newPage();

  const fehler = [];
  seite.on('console', (m) => {
    if (m.type() === 'error') fehler.push(m.text());
  });
  seite.on('pageerror', (e) => fehler.push(String(e)));

  for (const pfad of pfade) {
    const url = BASIS + pfad;
    const dateiname = (pfad === '/' ? 'start' : pfad.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

    await seite.goto(url, { waitUntil: 'networkidle' });

    // Einblendungen beim Scrollen ausloesen, damit nichts unsichtbar bleibt.
    await seite.evaluate(() =>
      document.querySelectorAll('.einblenden').forEach((el) => el.classList.add('sichtbar')),
    );

    /* Einmal ganz durchscrollen und zurueck. Ohne das laedt loading="lazy"
       die Bilder unterhalb des ersten Bildschirms nicht, und der
       Vollseiten-Screenshot zeigt leere Flaechen.

       Die Schleife ist nach oben begrenzt, und das Warten auf die Bilder
       bekommt eine Zeitgrenze: ein Bild, das nie laedt, wuerde sonst
       endlos blockieren. */
    /* Zuverlaessiger als Scrollen: alle Bilder hart auf sofortiges Laden
       umstellen. Reines Scrollen laedt in der Praxis nur die naechsten ein
       bis zwei Bildschirme nach. */
    await seite.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((b) => {
        b.setAttribute('loading', 'eager');
        b.setAttribute('fetchpriority', 'high');
      });
      document.querySelectorAll('source[srcset]').forEach((q) => {
        // Neuzuweisung stoesst die Auswahl der Quelle erneut an.
        q.srcset = q.srcset;
      });
    });

    await seite.evaluate(async () => {
      const schritt = window.innerHeight;
      const hoehe = Math.min(document.body.scrollHeight, 40000);
      for (let y = 0; y < hoehe; y += schritt) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
    });

    await seite.evaluate(async () => {
      const wartenAufBild = (b) =>
        b.complete
          ? Promise.resolve()
          : new Promise((r) => {
              const fertig = () => r(undefined);
              b.addEventListener('load', fertig, { once: true });
              b.addEventListener('error', fertig, { once: true });
              setTimeout(fertig, 4000);
            });
      await Promise.all(Array.from(document.images).map(wartenAufBild));
    });

    /* Die klebende Kopfzeile wuerde beim Vollseiten-Bild mitten in der Seite
       auftauchen, wo sie beim Scrollen gerade stand. Fuer die Aufnahme
       einmalig loesen. */
    await seite.addStyleTag({
      content: '.kopfzeile { position: static !important; transform: none !important; }',
    });

    await seite.waitForTimeout(500);

    const datei = join(ziel, `${dateiname}-${ansicht.name}.png`);
    await seite.screenshot({ path: datei, fullPage: true });
    console.log(`${ansicht.name.padEnd(8)} ${pfad.padEnd(24)} -> ${datei}`);

    // Waagerechten Scrollbalken pruefen: darf es nirgends geben.
    const ueberbreite = await seite.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (ueberbreite > 0) {
      console.log(`  ACHTUNG waagerechter Ueberstand: ${ueberbreite}px bei ${pfad}`);
    }
  }

  if (fehler.length > 0) {
    console.log(`  Konsolenfehler (${ansicht.name}):`);
    for (const f of fehler) console.log(`    ${f}`);
  }

  await kontext.close();
}

await browser.close();
console.log('Fertig.');
