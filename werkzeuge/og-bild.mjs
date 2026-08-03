/**
 * Erzeugt das Social-Preview-Bild aus werkzeuge/og-bild.html.
 *
 * Kein KI-Bild: die Vorlage nutzt das echte Logo, ein echtes Foto der
 * Brauerei sowie die Markenschriften und Markenfarben. PROJEKT.md Abschnitt 7
 * erlaubt erzeugte Bilder nur fuer Texturen und Platzhalter.
 *
 * Aufruf:
 *   node werkzeuge/og-bild.mjs
 *
 * Ergebnis: public/og-bild.jpg, 1200 x 630.
 */
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const VORLAGE = resolve('werkzeuge/og-bild.html');
const ZIEL = resolve('public/og-bild.jpg');

const browser = await chromium.launch({ channel: 'msedge' });
const kontext = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const seite = await kontext.newPage();

const fehler = [];
seite.on('console', (m) => {
  if (m.type() === 'error') fehler.push(m.text());
});
seite.on('requestfailed', (r) => fehler.push(`${r.url()} : ${r.failure()?.errorText}`));

await seite.goto(pathToFileURL(VORLAGE).href, { waitUntil: 'networkidle' });

// Schriften muessen geladen sein, sonst wird mit dem Systemersatz fotografiert.
await seite.evaluate(() => document.fonts.ready);
await seite.waitForTimeout(400);

await seite.screenshot({
  path: ZIEL,
  type: 'jpeg',
  quality: 88,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

if (fehler.length > 0) {
  console.log('Fehler beim Laden:');
  for (const f of fehler) console.log(`  ${f}`);
}

console.log(`Geschrieben: ${ZIEL}`);

await browser.close();
