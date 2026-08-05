/**
 * Handy-Pruefung.
 *
 * Drei Dinge, die sich nur am gerenderten Ergebnis auf einem schmalen
 * Bildschirm zeigen und die ein Bildschirmfoto leicht uebersieht:
 *
 * 1. Tippflaechen. Alles zum Antippen braucht rund 44 x 44 px, sonst trifft
 *    man mit dem Daumen daneben. Reine Textlinks im Fliesstext sind davon
 *    ausgenommen — sie stehen in einer Zeile und lassen sich nicht vergroessern,
 *    ohne den Zeilenabstand zu sprengen.
 * 2. Schriftgroesse. Unter 15 px wird auf einem Handy muehsam.
 * 3. Leerraum. Sehr grosse Abstaende zwischen zwei Bloecken lassen die Seite
 *    zerfallen; man scrollt durch Nichts.
 *
 * Der Vorschauserver muss auf Port 4321 laufen.
 * Aufruf:  node werkzeuge/qa-mobil.mjs
 */
import { chromium } from 'playwright-core';

const BASIS = 'http://localhost:4321';
const SEITEN = ['/', '/biere/', '/brauseminare/', '/kontakt/', '/verkaufsstellen/', '/news/'];
const MINDEST_TIPP = 44;
const MINDEST_SCHRIFT = 15;
const MAX_LUECKE = 180;

const browser = await chromium.launch({ channel: 'msedge' });
const kontext = await browser.newContext({
  viewport: { width: 390, height: 780 },
  deviceScaleFactor: 2,
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

for (const pfad of SEITEN) {
  await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
  await seite.evaluate(() =>
    document.querySelectorAll('.einblenden').forEach((el) => el.classList.add('sichtbar')),
  );
  await seite.waitForTimeout(300);

  const befund = await seite.evaluate(
    ([minTipp, minSchrift, maxLuecke]) => {
      const sichtbar = (el) => {
        const k = el.getBoundingClientRect();
        return k.width > 0 && k.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      };

      /* Tippflaechen: Knoepfe und Links, die als Flaeche auftreten. Links
         mitten im Fliesstext werden ausgenommen. */
      const klein = [];
      for (const el of document.querySelectorAll('a, button, [role="button"]')) {
        if (!sichtbar(el)) continue;
        const eltern = el.parentElement;
        const imFliesstext =
          eltern && ['P', 'LI', 'DD', 'SPAN'].includes(eltern.tagName) &&
          getComputedStyle(el).display === 'inline';
        if (imFliesstext) continue;
        const k = el.getBoundingClientRect();
        if (k.height < minTipp || k.width < minTipp) {
          klein.push(
            `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ` +
              `${Math.round(k.width)}x${Math.round(k.height)} "${(el.textContent || '').trim().slice(0, 24)}"`,
          );
        }
      }

      /* Schriftgroessen im sichtbaren Text. */
      const winzig = new Map();
      for (const el of document.querySelectorAll('p, li, a, dd, dt, span, small, figcaption')) {
        if (!sichtbar(el) || !el.textContent.trim()) continue;
        const g = parseFloat(getComputedStyle(el).fontSize);
        if (g < minSchrift) {
          const schluessel = `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ${g}px`;
          winzig.set(schluessel, (winzig.get(schluessel) ?? 0) + 1);
        }
      }

      /* Senkrechte Luecken zwischen aufeinanderfolgenden Abschnitten. */
      const luecken = [];
      const bloecke = [...document.querySelectorAll('main > *, main section, main .abschnitt')];
      for (let i = 1; i < bloecke.length; i++) {
        const oben = bloecke[i - 1].getBoundingClientRect();
        const unten = bloecke[i].getBoundingClientRect();
        const luecke = unten.top - oben.bottom;
        if (luecke > maxLuecke) {
          luecken.push(`${Math.round(luecke)} px zwischen ${bloecke[i - 1].className || bloecke[i - 1].tagName} und ${bloecke[i].className || bloecke[i].tagName}`);
        }
      }

      return { klein, winzig: [...winzig.entries()], luecken };
    },
    [MINDEST_TIPP, MINDEST_SCHRIFT, MAX_LUECKE],
  );

  const summe =
    befund.klein.length + befund.winzig.length + befund.luecken.length;
  console.log(`\n${pfad}`);
  if (summe === 0) {
    console.log('  OK   nichts zu beanstanden');
    continue;
  }
  fehler += summe;
  for (const t of befund.klein) console.log(`  TIPP    ${t}`);
  for (const [t, n] of befund.winzig) console.log(`  SCHRIFT ${t} (${n}x)`);
  for (const t of befund.luecken) console.log(`  LUECKE  ${t}`);
}

await browser.close();
console.log(`\n${fehler === 0 ? 'Keine Befunde.' : fehler + ' Befund(e).'}\n`);
process.exit(fehler === 0 ? 0 : 1);
