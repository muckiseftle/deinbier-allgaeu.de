/**
 * Pruefung im echten Browser: Tastatur, Fokus, Kontraste, Responsivitaet.
 *
 * Was hier gruen ist, wurde am gerenderten Ergebnis gemessen, nicht am
 * Quellcode abgelesen.
 *
 * Der Vorschauserver muss auf Port 4321 laufen.
 * Aufruf:  node werkzeuge/qa-browser.mjs
 */
import { chromium } from 'playwright-core';

const BASIS = 'http://localhost:4321';

const SEITEN = [
  '/',
  '/brauerei/',
  '/biere/',
  '/brauseminare/',
  '/events-verleih/',
  '/ferienwohnung/',
  '/verkaufsstellen/',
  '/news/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
  '/404.html',
];

let fehler = 0;
const warnungen = 0;
const ok = (n, z = '') => console.log(`  OK   ${n}${z ? '  ' + z : ''}`);
const fehl = (n, z = '') => (console.log(`  FEHL ${n}${z ? '  ' + z : ''}`), fehler++);
const pruefe = (b, n, z = '') => (b ? ok(n, z) : fehl(n, z));

/** Relative Leuchtdichte nach WCAG 2.1. */
function leuchtdichte([r, g, b]) {
  const f = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function kontrast(a, b) {
  const la = leuchtdichte(a);
  const lb = leuchtdichte(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function rgb(s) {
  const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}

const browser = await chromium.launch({ channel: 'msedge' });
const kontext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
  locale: 'de-DE',
});
await kontext.addInitScript(() => {
  try {
    localStorage.setItem('db-alter-bestaetigt', 'ja');
  } catch {}
});
const seite = await kontext.newPage();

const konsolenfehler = [];
seite.on('console', (m) => m.type() === 'error' && konsolenfehler.push(m.text()));
seite.on('pageerror', (e) => konsolenfehler.push(String(e)));

// ---------------------------------------------------------------------------
console.log('\n1 · Tastaturbedienung und Fokus');
{
  await seite.goto(`${BASIS}/`, { waitUntil: 'networkidle' });

  await seite.keyboard.press('Tab');
  const erstes = await seite.evaluate(() => {
    const a = document.activeElement;
    return { text: a?.textContent?.trim() ?? '', href: a?.getAttribute('href') ?? '' };
  });
  pruefe(
    erstes.href === '#inhalt',
    'Erstes fokussierbares Element ist die Sprungmarke',
    erstes.text,
  );

  const sichtbar = await seite.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return { breite: s.outlineWidth, stil: s.outlineStyle };
  });
  pruefe(
    sichtbar.stil !== 'none' && parseFloat(sichtbar.breite) >= 2,
    'Fokusring sichtbar und mindestens 2 px',
    `${sichtbar.stil} ${sichtbar.breite}`,
  );

  // Durch die ganze Seite tabben und pruefen, dass nichts den Fokus verschluckt.
  let ohneUmriss = 0;
  let schritte = 0;
  for (let i = 0; i < 60; i++) {
    await seite.keyboard.press('Tab');
    schritte++;
    const zustand = await seite.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        marke: el.tagName,
        umriss: s.outlineStyle !== 'none' || s.boxShadow !== 'none',
      };
    });
    if (zustand && !zustand.umriss) ohneUmriss++;
  }
  pruefe(ohneUmriss === 0, `Fokus bei ${schritte} Tab-Schritten immer sichtbar`, `${ohneUmriss} ohne`);
}

// ---------------------------------------------------------------------------
console.log('\n2 · Kontraste am gerenderten Text');
{
  const messungen = [];
  for (const pfad of ['/', '/biere/', '/kontakt/', '/datenschutz/']) {
    await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    const werte = await seite.evaluate(() => {
      const ergebnis = [];
      const kandidaten = document.querySelectorAll(
        'p, li, h1, h2, h3, h4, a, dd, dt, figcaption, address, time',
      );
      // Text ueber Bildern und Verlaeufen wird hier ausgelassen und
      // stattdessen in qa-bildpunkte.mjs an echten Bildpunkten gemessen.
      const aufBildOderVerlauf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const s = getComputedStyle(n);
          if (s.backgroundImage && s.backgroundImage !== 'none') return true;
          n = n.parentElement;
        }
        return false;
      };
      const hintergrundVon = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(bg)) return bg;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      for (const el of kandidaten) {
        if (!el.textContent?.trim()) continue;
        if (aufBildOderVerlauf(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const s = getComputedStyle(el);
        ergebnis.push({
          vorne: s.color,
          hinten: hintergrundVon(el),
          groesse: parseFloat(s.fontSize),
          gewicht: parseInt(s.fontWeight, 10) || 400,
          text: el.textContent.trim().slice(0, 40),
        });
      }
      return ergebnis;
    });
    for (const w of werte) messungen.push({ ...w, pfad });
  }

  const durchgefallen = [];
  for (const m of messungen) {
    const v = rgb(m.vorne);
    const h = rgb(m.hinten);
    if (!v || !h) continue;
    const k = kontrast(v, h);
    // Grosser Text: ab 24 px, oder ab 18,66 px bei fett.
    const gross = m.groesse >= 24 || (m.groesse >= 18.66 && m.gewicht >= 700);
    const grenze = gross ? 3 : 4.5;
    if (k < grenze) durchgefallen.push(`${m.pfad} "${m.text}" ${k.toFixed(2)}:1 (noetig ${grenze})`);
  }

  ok('Textstellen gemessen', `${messungen.length}`);
  pruefe(durchgefallen.length === 0, 'Alle Textkontraste erfuellen WCAG AA', durchgefallen.slice(0, 6).join(' | '));
}

// ---------------------------------------------------------------------------
console.log('\n3 · Responsivitaet ab 360 px');
{
  const ueberstaende = [];
  for (const breite of [360, 390, 768, 1024, 1440]) {
    await seite.setViewportSize({ width: breite, height: 900 });
    for (const pfad of SEITEN) {
      // networkidle statt domcontentloaded: vor dem Laden der Bilder ist
      // das Layout noch nicht endgueltig und meldet falsche Ueberstaende.
      await seite.goto(BASIS + pfad, { waitUntil: 'networkidle' });
      const ueber = await seite.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (ueber > 0) ueberstaende.push(`${breite}px ${pfad}: ${ueber}px`);
    }
  }
  pruefe(
    ueberstaende.length === 0,
    `Kein waagerechter Ueberstand auf ${SEITEN.length} Seiten in 5 Breiten`,
    ueberstaende.slice(0, 5).join(' | '),
  );
}

// ---------------------------------------------------------------------------
console.log('\n4 · Speicher und Cookies');
{
  const frisch = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const s2 = await frisch.newPage();
  await s2.goto(`${BASIS}/`, { waitUntil: 'networkidle' });

  const cookies = await frisch.cookies();
  pruefe(cookies.length === 0, 'Keine Cookies gesetzt', `${cookies.length}`);

  const vorAntwort = await s2.evaluate(() => Object.keys(localStorage).length);
  pruefe(vorAntwort === 0, 'Kein Speicherzugriff vor der Antwort', `${vorAntwort} Eintrag/Eintraege`);

  await s2.locator('[data-alter-ja]').click();
  await s2.waitForTimeout(500);
  const nachAntwort = await s2.evaluate(() => Object.entries(localStorage));
  pruefe(
    nachAntwort.length === 1 && nachAntwort[0][0] === 'db-alter-bestaetigt',
    'Genau ein Speichereintrag nach der Antwort',
    JSON.stringify(nachAntwort),
  );

  const sitzung = await s2.evaluate(() => Object.keys(sessionStorage).length);
  pruefe(sitzung === 0, 'Kein sessionStorage benutzt', `${sitzung}`);

  await frisch.close();
}

// ---------------------------------------------------------------------------
console.log('\n5 · Netzwerk: wirklich keine fremden Hosts');
{
  const fremd = new Set();
  const s3 = await kontext.newPage();
  s3.on('request', (r) => {
    const url = new URL(r.url());
    if (url.hostname !== 'localhost') fremd.add(url.hostname);
  });
  await seite.setViewportSize({ width: 1440, height: 900 });
  for (const pfad of ['/', '/biere/', '/news/', '/kontakt/']) {
    await s3.goto(BASIS + pfad, { waitUntil: 'networkidle' });
    await s3.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 300));
    });
  }
  pruefe(fremd.size === 0, 'Kein einziger Aufruf an einen fremden Host', [...fremd].join(', '));
  await s3.close();
}

// ---------------------------------------------------------------------------
console.log('\n6 · Konsole');
{
  pruefe(konsolenfehler.length === 0, 'Keine Konsolenfehler', konsolenfehler.slice(0, 4).join(' | '));
}

await browser.close();
console.log(`\n${fehler === 0 ? 'Keine Fehler.' : fehler + ' Fehler.'} ${warnungen} Warnung(en).\n`);
process.exit(fehler === 0 ? 0 : 1);
