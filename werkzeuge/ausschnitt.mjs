/**
 * Ausschnitt in Originalgroesse fotografieren.
 *
 * Vollseiten-Bilder werden beim Betrachten so stark verkleinert, dass feine
 * Texturen unsichtbar werden. Fuer die Beurteilung von Mustern und
 * Feinheiten braucht es einen Ausschnitt bei 1:1.
 *
 * Aufruf:  node werkzeuge/ausschnitt.mjs <zielordner> <pfad> <y> [hoehe]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [ziel, pfad, yRoh, hoeheRoh] = process.argv.slice(2);
if (!ziel || !pfad) {
  console.error('Aufruf: node werkzeuge/ausschnitt.mjs <zielordner> <pfad> [y] [hoehe]');
  process.exit(1);
}
const y = Number(yRoh ?? 0);
const hoehe = Number(hoeheRoh ?? 700);

mkdirSync(ziel, { recursive: true });

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
await seite.goto('http://localhost:4321' + pfad, { waitUntil: 'networkidle' });
await seite.evaluate(() =>
  document.querySelectorAll('.einblenden').forEach((el) => el.classList.add('sichtbar')),
);
await seite.evaluate((yy) => window.scrollTo(0, yy), y);
await seite.waitForTimeout(500);

const name = `ausschnitt-${pfad.replace(/[^a-z0-9]/gi, '') || 'start'}-${y}.png`;
const datei = join(ziel, name);
await seite.screenshot({ path: datei, clip: { x: 0, y: 0, width: 1440, height: hoehe } });
console.log(datei);

await browser.close();
