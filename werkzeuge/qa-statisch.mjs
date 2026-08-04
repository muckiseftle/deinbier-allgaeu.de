/**
 * Statische Pruefung des Builds gegen die Abnahme-Checkliste
 * (PROJEKT.md Abschnitt 9).
 *
 * Liest ausschliesslich dist/. Was hier gruen ist, ist am ausgelieferten
 * HTML belegt, nicht am Quellcode behauptet.
 *
 * Aufruf:  node werkzeuge/qa-statisch.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
let fehler = 0;
let warnungen = 0;

function ok(name, zusatz = '') {
  console.log(`  OK   ${name}${zusatz ? '  ' + zusatz : ''}`);
}
function fehl(name, zusatz = '') {
  console.log(`  FEHL ${name}${zusatz ? '  ' + zusatz : ''}`);
  fehler++;
}
function warn(name, zusatz = '') {
  console.log(`  WARN ${name}${zusatz ? '  ' + zusatz : ''}`);
  warnungen++;
}
function pruefe(bedingung, name, zusatz = '') {
  bedingung ? ok(name, zusatz) : fehl(name, zusatz);
}

/** Alle HTML-Dateien im Build. */
function htmlDateien(verzeichnis = DIST, gesammelt = []) {
  for (const eintrag of readdirSync(verzeichnis)) {
    const pfad = join(verzeichnis, eintrag);
    if (statSync(pfad).isDirectory()) htmlDateien(pfad, gesammelt);
    else if (eintrag.endsWith('.html')) gesammelt.push(pfad);
  }
  return gesammelt;
}

const alleHtml = htmlDateien();
const seiten = alleHtml
  .map((p) => ({ pfad: p, html: readFileSync(p, 'utf8') }))
  .filter((s) => !/http-equiv="refresh"/.test(s.html));
const weiterleitungen = alleHtml.length - seiten.length;

console.log(`\nGeprueft: ${seiten.length} Inhaltsseiten, ${weiterleitungen} Weiterleitungen\n`);

// ---------------------------------------------------------------------------
console.log('1 · Null externe Requests');
{
  const treffer = [];
  for (const s of seiten) {
    const m = s.html.match(
      /<(?:script|img|iframe|source|video|audio|embed|object)[^>]*(?:src|data)="https?:\/\/[^"]+"/g,
    );
    const css = s.html.match(/<link[^>]*rel="(?:stylesheet|preload|preconnect)"[^>]*href="https?:\/\/[^"]+"/g);
    const importe = s.html.match(/@import\s+url\(["']?https?:\/\//g);
    if (m || css || importe) treffer.push(relative(DIST, s.pfad));
  }
  pruefe(treffer.length === 0, 'Keine geladenen Ressourcen von fremden Hosts', treffer.join(', '));

  // Externe Links sind erlaubt, muessen aber abgesichert sein.
  let unsicher = 0;
  for (const s of seiten) {
    for (const tag of s.html.match(/<a[^>]*target="_blank"[^>]*>/g) ?? []) {
      if (!/rel="[^"]*noopener/.test(tag)) unsicher++;
    }
  }
  pruefe(unsicher === 0, 'Alle Links mit target=_blank haben rel=noopener', `${unsicher} ohne`);
}

// ---------------------------------------------------------------------------
console.log('\n2 · Schriften');
{
  const schriften = existsSync(join(DIST, 'schriften')) ? readdirSync(join(DIST, 'schriften')) : [];
  pruefe(schriften.length > 0, 'Schriften werden selbst ausgeliefert', schriften.join(', '));
  pruefe(
    schriften.every((f) => f.endsWith('.woff2')),
    'Ausschliesslich woff2',
  );
  pruefe(
    !schriften.some((f) => /cyrillic|greek|vietnamese|latin-ext/.test(f)),
    'Keine ungenutzten Subsets im Build',
  );

  const gesamt = schriften.reduce((s, f) => s + statSync(join(DIST, 'schriften', f)).size, 0);
  ok('Schriftgewicht gesamt', `${Math.round(gesamt / 1024)} KB`);

  const start = seiten.find((s) => relative(DIST, s.pfad) === 'index.html');

  /* Die @font-face-Regeln landen im gebuendelten CSS, nicht im HTML.
     Deshalb muessen beide Orte durchsucht werden. */
  const cssInhalt = existsSync(join(DIST, '_astro'))
    ? readdirSync(join(DIST, '_astro'))
        .filter((f) => f.endsWith('.css'))
        .map((f) => readFileSync(join(DIST, '_astro', f), 'utf8'))
        .join('\n')
    : '';
  const allesCss = cssInhalt + start.html;

  const fontFaces = (allesCss.match(/@font-face/g) ?? []).length;
  const swaps = (allesCss.match(/font-display:\s*swap/g) ?? []).length;
  pruefe(fontFaces > 0 && swaps >= fontFaces, 'font-display: swap bei jedem @font-face', `${swaps} swap / ${fontFaces} font-face`);
  pruefe(
    (start.html.match(/rel="preload"[^>]*as="font"/g) ?? []).length === 2,
    'Genau zwei Schriften vorgeladen',
  );
  pruefe(
    !/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(start.html),
    'Kein Google-Fonts-CDN',
  );
}

// ---------------------------------------------------------------------------
console.log('\n3 · Metadaten je Seite');
{
  const ohneBeschreibung = [];
  const ohneCanonical = [];
  const ohneLang = [];
  const ohneOgBild = [];
  const mitZoomsperre = [];
  const h1Fehler = [];

  for (const s of seiten) {
    const p = relative(DIST, s.pfad);
    if (!/<meta name="description"/.test(s.html)) ohneBeschreibung.push(p);
    if (!/rel="canonical"/.test(s.html)) ohneCanonical.push(p);
    if (!/<html lang="de">/.test(s.html)) ohneLang.push(p);
    if (!/property="og:image"/.test(s.html)) ohneOgBild.push(p);
    if (/maximum-scale|user-scalable/.test(s.html)) mitZoomsperre.push(p);
    const h1 = (s.html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) h1Fehler.push(`${p}:${h1}`);
  }

  pruefe(ohneBeschreibung.length === 0, 'Meta-Description auf jeder Seite', ohneBeschreibung.join(', '));
  pruefe(ohneCanonical.length === 0, 'Canonical auf jeder Seite', ohneCanonical.join(', '));
  pruefe(ohneLang.length === 0, 'lang=de auf jeder Seite', ohneLang.join(', '));
  pruefe(ohneOgBild.length === 0, 'OG-Bild auf jeder Seite', ohneOgBild.join(', '));
  pruefe(mitZoomsperre.length === 0, 'Kein gesperrter Zoom', mitZoomsperre.join(', '));
  pruefe(h1Fehler.length === 0, 'Genau eine h1 je Seite', h1Fehler.join(', '));

  const start = seiten.find((s) => relative(DIST, s.pfad) === 'index.html');
  pruefe(/"@type":"Brewery"/.test(start.html), 'JSON-LD Brewery auf der Startseite');
  const beitrag = seiten.find((s) => /news[\\/].+[\\/]index\.html/.test(s.pfad));
  pruefe(
    beitrag ? /"@type":"NewsArticle"/.test(beitrag.html) : false,
    'JSON-LD NewsArticle auf Beitragsseiten',
  );
}

// ---------------------------------------------------------------------------
console.log('\n4 · Bilder');
{
  let gesamt = 0;
  let ohneAlt = 0;
  let ohneMasse = 0;
  let adresseAlsAlt = 0;

  for (const s of seiten) {
    for (const tag of s.html.match(/<img[^>]*>/g) ?? []) {
      gesamt++;
      // Astro schreibt einen leeren Alt-Text als blosses alt ohne
      // Gleichheitszeichen. Laut HTML5 ist das gleichbedeutend mit alt=""
      // und damit korrekt fuer dekorative Bilder.
      if (!/\salt(=|[\s>])/.test(tag)) ohneAlt++;
      if (!/width="\d+"/.test(tag) || !/height="\d+"/.test(tag)) ohneMasse++;
      const alt = tag.match(/alt="([^"]*)"/)?.[1] ?? '';
      if (/Hausen 3|87665 Mauerstetten/.test(alt)) adresseAlsAlt++;
    }
  }

  ok('Bilder gesamt', `${gesamt}`);
  pruefe(ohneAlt === 0, 'Kein Bild ohne alt-Attribut', `${ohneAlt}`);
  pruefe(ohneMasse === 0, 'Alle Bilder mit Breite und Hoehe', `${ohneMasse} ohne`);
  pruefe(adresseAlsAlt === 0, 'Keine Firmenanschrift als Alt-Text', `${adresseAlsAlt}`);
}

// ---------------------------------------------------------------------------
console.log('\n5 · Pflichtangaben im Footer');
{
  const ohneImpressum = [];
  const ohneDatenschutz = [];
  const ohneHinweis = [];
  const kaputtesMailto = [];

  for (const s of seiten) {
    const p = relative(DIST, s.pfad);
    if (!/href="\/impressum\/"/.test(s.html)) ohneImpressum.push(p);
    if (!/href="\/datenschutz\/"/.test(s.html)) ohneDatenschutz.push(p);
    if (!/Kein Alkohol an Personen/.test(s.html)) ohneHinweis.push(p);
    // Der Fehler der Altseite: E-Mail-Adresse als href ohne mailto-Schema.
    if (/href="[^"]*@[^"]*"/.test(s.html.replace(/href="mailto:[^"]*"/g, ''))) {
      kaputtesMailto.push(p);
    }
  }

  pruefe(ohneImpressum.length === 0, 'Impressum von jeder Seite verlinkt', ohneImpressum.join(', '));
  pruefe(ohneDatenschutz.length === 0, 'Datenschutz von jeder Seite verlinkt', ohneDatenschutz.join(', '));
  pruefe(ohneHinweis.length === 0, 'Alkoholhinweis auf jeder Seite', ohneHinweis.join(', '));
  pruefe(kaputtesMailto.length === 0, 'Keine E-Mail-Adresse ohne mailto-Schema', kaputtesMailto.join(', '));
}

// ---------------------------------------------------------------------------
console.log('\n6 · mailto- und tel-Links');
{
  const mailtos = new Set();
  const tels = new Set();
  for (const s of seiten) {
    for (const m of s.html.match(/href="mailto:[^"]*"/g) ?? []) mailtos.add(m);
    for (const m of s.html.match(/href="tel:[^"]*"/g) ?? []) tels.add(m);
  }
  ok('Verschiedene mailto-Links', `${mailtos.size}`);
  ok('Verschiedene tel-Links', `${tels.size}`);

  const schlechteMail = [...mailtos].filter((m) => !/mailto:[^"@]+@[^"@]+\.[a-z]{2,}/.test(m));
  pruefe(schlechteMail.length === 0, 'Alle mailto-Adressen wohlgeformt', schlechteMail.join(', '));

  const schlechteTel = [...tels].filter((t) => !/tel:\+?[0-9]{6,}/.test(t));
  pruefe(schlechteTel.length === 0, 'Alle tel-Nummern wohlgeformt', schlechteTel.join(', '));
}

// ---------------------------------------------------------------------------
console.log('\n7 · Dateien, die es geben muss');
{
  const pflicht = [
    'index.html',
    '404.html',
    'sitemap-index.xml',
    'og-bild.jpg',
    'favicon.ico',
    'apple-touch-icon.png',
    'site.webmanifest',
    'impressum/index.html',
    'datenschutz/index.html',
  ];
  for (const d of pflicht) {
    pruefe(existsSync(join(DIST, d)), `vorhanden: ${d}`);
  }
  if (!existsSync(join(DIST, 'robots.txt'))) {
    warn('robots.txt fehlt noch', 'ist fuer Phase 9 vorgesehen');
  } else {
    ok('vorhanden: robots.txt');
  }
  if (!existsSync(join(DIST, 'CNAME'))) {
    warn('CNAME fehlt noch', 'ist fuer Phase 9 vorgesehen');
  } else {
    ok('vorhanden: CNAME');
  }
}

// ---------------------------------------------------------------------------
console.log('\n8 · Weiterleitungen alter Adressen');
{
  const erwartet = [
    'home/ueber-uns/index.html',
    'unsere-biere/index.html',
    'brauseminar-2/index.html',
    'events-service/leihinventar/index.html',
    'unsere-verkaufstellen/index.html',
    'home/impressum/index.html',
    'home/datenschutzvereinbarungen/index.html',
    '1523-2/index.html',
  ];
  const fehlend = erwartet.filter((d) => !existsSync(join(DIST, d)));
  pruefe(fehlend.length === 0, `${erwartet.length} Stichproben alter Adressen vorhanden`, fehlend.join(', '));
  ok('Weiterleitungsseiten gesamt', `${weiterleitungen}`);
}

// ---------------------------------------------------------------------------
console.log('\n9 · Groesse');
{
  const start = statSync(join(DIST, 'index.html')).size;
  ok('HTML der Startseite', `${(start / 1024).toFixed(1)} KB (Altseite: 281 KB)`);
  const cssDateien = existsSync(join(DIST, '_astro'))
    ? readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.css'))
    : [];
  const css = cssDateien.reduce((s, f) => s + statSync(join(DIST, '_astro', f)).size, 0);
  ok('CSS gesamt', `${(css / 1024).toFixed(1)} KB in ${cssDateien.length} Dateien`);
}

// ---------------------------------------------------------------------------
console.log(
  `\n${fehler === 0 ? 'Keine Fehler.' : fehler + ' Fehler.'} ${warnungen} Warnung(en).\n`,
);
process.exit(fehler === 0 ? 0 : 1);
