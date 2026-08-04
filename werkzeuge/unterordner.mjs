/**
 * Baut das fertige Ergebnis auf einen Unterordner um.
 *
 * Gebraucht fuer die Vorschau auf GitHub Pages: dort liegt die Seite unter
 * `muckiseftle.github.io/deinbier-allgaeu.de/`, nicht auf einer eigenen
 * Domain. Alle Pfade, die mit einem Schraegstrich beginnen, zeigen sonst auf
 * die Wurzel von github.io und laufen ins Leere.
 *
 * Bewusst als Nachbearbeitung und NICHT ueber Astros `base`:
 *
 * - `base` erfasst nur, was Astro selbst erzeugt. Die von Hand geschriebenen
 *   Pfade — Navigation, Masken der Leitmotive, Favicons, Weiterleitungen —
 *   muesste man alle einzeln anfassen und zum Livegang wieder zuruecknehmen.
 * - So bleibt der Quelltext unveraendert. Fuer den Livegang auf die eigene
 *   Domain entfaellt schlicht dieser eine Schritt.
 *
 * Zusaetzlich wird die Vorschau auf "nicht indexieren" gestellt. Solange die
 * alte Seite unter der echten Domain online ist, waere eine zweite,
 * auffindbare Fassung derselben Inhalte schaedlich.
 *
 * Aufruf:  node werkzeuge/unterordner.mjs <unterordner> [--indexierbar]
 * Beispiel: node werkzeuge/unterordner.mjs /deinbier-allgaeu.de
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const BASIS = process.argv[2];
const INDEXIERBAR = process.argv.includes('--indexierbar');

if (!BASIS || !BASIS.startsWith('/') || BASIS.endsWith('/')) {
  console.error('Aufruf: node werkzeuge/unterordner.mjs /unterordner [--indexierbar]');
  process.exit(1);
}

const DOMAIN_ALT = 'https://deinbier-allgaeu.de';
const DOMAIN_NEU = `https://muckiseftle.github.io${BASIS}`;

/** Dateien, in denen Pfade stehen koennen. */
const ENDUNGEN = new Set(['.html', '.css', '.xml', '.webmanifest', '.json', '.txt']);

function* dateien(ordner) {
  for (const eintrag of readdirSync(ordner)) {
    const pfad = join(ordner, eintrag);
    if (statSync(pfad).isDirectory()) yield* dateien(pfad);
    else if (ENDUNGEN.has(extname(pfad))) yield pfad;
  }
}

/**
 * Setzt den Unterordner vor jeden Pfad, der an der Wurzel beginnt.
 *
 * Nicht angefasst werden: `//` (protokollrelativ), vollstaendige Adressen,
 * `mailto:`, `tel:`, Sprungmarken und eingebettete Daten. Sie beginnen
 * entweder nicht mit einem einzelnen Schraegstrich oder gar nicht mit einem.
 */
function umschreiben(text) {
  return (
    text
      /* Erst die vollstaendige Adresse: sie steckt in canonical, in den
         Vorschaubildern und in der Sitemap. */
      .replaceAll(DOMAIN_ALT, DOMAIN_NEU)
      /* href und src */
      .replace(/(\s(?:href|src)=")\/(?!\/)/g, `$1${BASIS}/`)
      /* srcset: mehrere Pfade, durch Kommas getrennt */
      .replace(
        /(\ssrcset=")([^"]*)"/g,
        (_, kopf, liste) => kopf + liste.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASIS}/`) + '"',
      )
      /* url() in Stylesheets */
      .replace(/url\((['"]?)\/(?!\/)/g, `url($1${BASIS}/`)
      /* url() in einem style-Attribut: dort sind die Anfuehrungszeichen
         maskiert, das obige Muster greift deshalb nicht. */
      .replace(/url\(&quot;\/(?!\/)/g, `url(&quot;${BASIS}/`)
      /* Pfade im Web-Manifest */
      .replace(/("(?:src|start_url|scope)":\s*")\/(?!\/)/g, `$1${BASIS}/`)
  );
}

let geaendert = 0;
let geprueft = 0;

for (const pfad of dateien('dist')) {
  geprueft++;
  const alt = readFileSync(pfad, 'utf8');
  let neu = umschreiben(alt);

  /* Vorschau nicht indexieren lassen. */
  if (!INDEXIERBAR && pfad.endsWith('.html') && neu.includes('</title>')) {
    neu = neu.replace(
      '</title>',
      '</title><meta name="robots" content="noindex, nofollow">',
    );
  }

  if (neu !== alt) {
    writeFileSync(pfad, neu);
    geaendert++;
  }
}

if (!INDEXIERBAR) {
  writeFileSync(
    'dist/robots.txt',
    [
      '# Vorschau auf GitHub Pages, bewusst nicht auffindbar.',
      '# Solange die alte Seite unter der echten Domain online ist, waere',
      '# eine zweite, auffindbare Fassung derselben Inhalte schaedlich.',
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n'),
  );
}

console.log(
  `Unterordner ${BASIS} gesetzt: ${geaendert} von ${geprueft} Dateien geaendert.` +
    (INDEXIERBAR ? '' : ' Indexierung gesperrt.'),
);
