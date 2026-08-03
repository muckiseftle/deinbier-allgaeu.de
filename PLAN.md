# Umsetzungsplan DEIN BIER

> **Für ausführende Agenten:** Dieser Plan wird Aufgabe für Aufgabe abgearbeitet.
> Schritte nutzen Kästchen (`- [ ]`) zur Nachverfolgung. Bei Fehlern:
> `superpowers:systematic-debugging`. Vor jeder Fertigmeldung:
> `superpowers:verification-before-completion`.

**Ziel:** Eine statische, backendlose Website für die Brauerei DEIN BIER, die das bestehende
WordPress-/Divi-Setup vollständig ersetzt, ohne einen einzigen externen Request auszuliefern.

**Architektur:** Astro erzeugt reines HTML. Alle Inhalte liegen als Markdown in Content
Collections mit typgeprüften Schemata. Das Aussehen kommt aus einer einzigen Token-Datei und
komponentennahem CSS. Es gibt kein UI-Framework, keinen Client-State und genau zwei kleine
JavaScript-Bausteine (Menü und Altersabfrage), die beide ohne JavaScript nutzbare Rückfallwege
haben.

**Technikstapel:** Astro 7.1.6 · natives CSS mit Custom Properties · Content Collections mit
Zod-Schemata · Fontsource (selbst gehostet) · Phosphor Icons (zur Bauzeit eingebettet) ·
Vitest für Hilfsfunktionen · Sharp für die Bildpipeline.

**Grundlagendokumente, die beim Ausführen offen bleiben:**
`DESIGN.md` (Wireframes und Zustandstabellen) · `BRAND.md` (Ton, Farbregeln, Logoregeln) ·
`AUDIT.md` (Inhaltsquelle und Fehlerliste) · `content/alt/` (Rohtexte der Altseite).

---

## Globale Vorgaben

Diese Regeln gelten in **jeder** Aufgabe, ohne dass sie dort wiederholt werden.

**Technik**

- Astro `^7.1.6`, statische Ausgabe (`output: 'static'`, Standard).
- TypeScript **`^6.0.3`**, nicht 7. Grund: `@astrojs/check@0.9.10` deklariert
  `peerDependencies: { typescript: "^5.0.0 || ^6.0.0" }`. TypeScript 7 würde den Peer-Bereich
  verletzen.
- **Null externe Requests im Produktivbetrieb.** Keine CDN, keine Google Fonts, keine
  Analysedienste, keine Einbettungen von Drittanbietern. Jede neue Abhängigkeit, die zur
  Laufzeit etwas nachlädt, ist ein Planbruch und braucht Rücksprache.
- **Kein Cookie.** Einziger Speicherzugriff: `localStorage` für die Altersabfrage
  (dokumentierte Abweichung, siehe `OFFENE-FRAGEN.md` Nr. 12).
- Kein `window.addEventListener("scroll")`. Erlaubt sind `IntersectionObserver` und CSS.
- Animiert werden ausschließlich `transform` und `opacity`.
- Vor jedem `npm install`: Netzwerk kann in dieser Umgebung sporadisch ausfallen
  (DNS-Zeitüberschreitungen). Bei Fehlschlag bis zu dreimal wiederholen, dann melden.

**Gestaltung**

- Kein Hexwert und keine Pixelangabe außerhalb von `src/styles/tokens.css`. Komponenten greifen
  ausschließlich auf Komponentenwerte (`--knopf-*`, `--karte-*`, …) zu.
- Klassennamen **deutsch und sprechend**: `hero-titel`, `bierkarte`, `wegstrecke`.
- Genau eine `<h1>` je Seite.
- Seitenhintergrund ist `--db-creme-50`. Nie `#ffffff`.
- Ein Radiensystem: Knöpfe und Bilder 8 px, Karten 14 px, Bildbänder 22 px, Signets rund.
- Nur helle Fassung. Kein zweites Farbschema.

**Inhalt und Sprache**

- Anrede durchgehend **„Ihr / Euch"**. Ausnahme: Rechtstexte, dort „Sie".
- **Keine Preise.** Nirgends, auch nicht bei Seminar, Verleih und Ferienwohnung
  (`OFFENE-FRAGEN.md` Nr. 6).
- **Nichts erfinden.** Fehlende Angaben als `[PLATZHALTER: …]` markieren und in
  `OFFENE-FRAGEN.md` eintragen.
- Rechtschreibfehler der Altseite werden korrigiert (Liste in `AUDIT.md` B8).
- Aufforderungen mit festem Wortlaut je Absicht (`DESIGN.md` Abschnitt 15.1):
  „Verleih anfragen", „Feier anfragen", „Seminar anfragen", „Ferienwohnung anfragen",
  „Kontakt", „Weiterlesen", „Alle …", „Route planen". Nie „Mehr erfahren", „Hier klicken",
  „Absenden", „Jetzt anfragen".
- Im Website-Text **kein Gedankenstrich** in Überschriften, Etikettenzeilen, Knopfbeschriftungen,
  Bildunterschriften und Zitaten. Im Fließtext höchstens einer je Absatz.
- Deutsche Anführungszeichen „unten und oben". Halbgeviertstrich für Bereiche („10–12 Uhr").
- Zahl und Maßeinheit ohne Umbruch dazwischen: `12&nbsp;m`, `113&nbsp;m²`, `0,3&nbsp;l`.

**Barrierefreiheit**

- Sichtbarer Fokus: 2 px `--db-fokus-farbe` mit 2 px Versatz. Nie `outline: none` ohne Ersatz.
- Jedes inhaltstragende Bild bekommt einen beschreibenden Alt-Text. **Nie die Firmenanschrift**
  (Fehler der Altseite, `AUDIT.md` N18).
- `lang="de"` und `hyphens: auto`.
- **Kein** `maximum-scale` oder `user-scalable=no` im Viewport-Tag (Fehler der Altseite, N1).
- Sprungmarke „Zum Inhalt springen" als erstes fokussierbares Element jeder Seite.
- Alles per Tastatur bedienbar, Fokusreihenfolge entspricht der Lesereihenfolge.

**Arbeitsweise**

- Nach jeder Aufgabe ein Commit mit aussagekräftiger Nachricht.
- Commit-Nachrichten auf Deutsch oder Englisch, Fließtext, kein Präfix-Zwang.
- Vor „fertig": `npm run build` muss fehlerfrei durchlaufen.

---

## Dateistruktur

```
deinbier-allgaeu.de/
├─ astro.config.mjs             Astro-Konfiguration, Site-URL, Integrationen
├─ tsconfig.json                strict, Astro-Basis
├─ vitest.config.ts             nur für src/lib
├─ package.json
│
├─ src/
│  ├─ content.config.ts         alle Sammlungen mit Zod-Schemata (eine Datei)
│  │
│  ├─ styles/
│  │  ├─ tokens.css             LIEGT VOR, 203 Werte. Nur ergaenzen, nie umbauen
│  │  ├─ reset.css              moderner Reset, Fokus, Sprungmarke, Kornebene
│  │  ├─ basis.css              Grundtypografie, Satzregeln, Silbentrennung
│  │  └─ layout.css             Container, Raster, Abschnittsrhythmus
│  │
│  ├─ lib/                      reine Funktionen, alle mit Vitest getestet
│  │  ├─ datum.ts               ISO-Datum zu deutscher Schreibweise
│  │  ├─ slug.ts                Umlautsichere URL-Fragmente
│  │  ├─ mailto.ts              vorbefuellte mailto-Links
│  │  └─ gruppieren.ts          Verkaufsstellen nach Region, Inventar nach Gruppe
│  │
│  ├─ layouts/
│  │  ├─ Basis.astro            html, head, Kopf, Fuss, Altersabfrage, Kornebene
│  │  └─ Themenseite.astro      Seitenkopf plus Abschlussaufforderung
│  │
│  ├─ komponenten/
│  │  ├─ kopf/
│  │  │  ├─ Kopfzeile.astro
│  │  │  └─ MobilesMenue.astro
│  │  ├─ fuss/
│  │  │  └─ Fusszeile.astro
│  │  ├─ basis/
│  │  │  ├─ Knopf.astro
│  │  │  ├─ Abschnitt.astro
│  │  │  ├─ Icon.astro
│  │  │  ├─ Bild.astro          Picture plus Platzhalter, wenn Datei fehlt
│  │  │  └─ Sprungmarke.astro
│  │  ├─ marke/
│  │  │  ├─ Wagen.astro         Signature-Element, eingebettetes SVG
│  │  │  ├─ Wegstrecke.astro
│  │  │  ├─ Etikettenrahmen.astro
│  │  │  ├─ Zitatband.astro
│  │  │  └─ Zahlenband.astro
│  │  ├─ karten/
│  │  │  ├─ Bierkarte.astro
│  │  │  ├─ Newskarte.astro
│  │  │  ├─ Verkaufsstellenkarte.astro
│  │  │  ├─ Inventarkarte.astro
│  │  │  └─ Anfragekarte.astro  oeffnet vorbefuellte Mail
│  │  ├─ seo/
│  │  │  ├─ Meta.astro          title, description, OG, Canonical
│  │  │  └─ JsonLd.astro        Brewery, Product, NewsArticle, Event
│  │  └─ Altersabfrage.astro
│  │
│  ├─ inhalte/                  Quelldateien der Sammlungen
│  │  ├─ biere/                 5 Dateien
│  │  ├─ produkte/              6 Dateien
│  │  ├─ verkaufsstellen/       17 Dateien
│  │  ├─ leihinventar/          13 Dateien
│  │  ├─ news/                  46 Dateien
│  │  └─ termine/               vorerst leer
│  │
│  ├─ bilder/                   Originale, von Astro verarbeitet
│  └─ pages/
│     ├─ index.astro
│     ├─ brauerei.astro
│     ├─ biere.astro
│     ├─ brauseminare.astro
│     ├─ events-verleih.astro
│     ├─ ferienwohnung.astro
│     ├─ verkaufsstellen.astro
│     ├─ kontakt.astro
│     ├─ impressum.astro        Gerüst, Text kommt in Phase 7
│     ├─ datenschutz.astro      Gerüst, Text kommt in Phase 7
│     ├─ zu-jung.astro          Hinweisseite nach "Nein" in der Altersabfrage
│     ├─ 404.astro
│     ├─ news/
│     │  ├─ index.astro
│     │  └─ [slug].astro
│     └─ weiterleitung/         erzeugt aus einer Tabelle, Aufgabe 25
│
├─ public/
│  ├─ CNAME                     Phase 9
│  ├─ robots.txt                Phase 9
│  └─ schriften/                Ausgabe des Subsetting-Schritts
│
└─ tests/
   └─ lib/                      Vitest, spiegelt src/lib
```

**Warum diese Aufteilung:** Ordner folgen der Zuständigkeit, nicht der Technik. Alles, was
zusammen geändert wird, liegt zusammen. Jede Datei bleibt klein genug, um sie am Stück zu lesen.

---

## Reihenfolge und Abhängigkeiten

```
A Fundament      1 → 2 → 3
B Rahmen         4 → 5, 6, 7
C Bausteine      8 → 9
D Inhalt         10 → 11, 12, 13, 14
E Seiten         15 … 25   (brauchen A, B, C, D)
```

Aufgaben 5, 6, 7 sind untereinander unabhängig. Aufgaben 11 bis 14 ebenso.
Aufgaben 16 bis 24 sind untereinander unabhängig, sobald 15 steht.

---

# Teil A · Fundament

## Aufgabe 1: Projektgerüst

**Dateien:**
- Erstellen: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`
- Ändern: `.gitignore` (liegt vor)

**Schnittstellen:**
- Liefert: ein lauffähiges Astro-Projekt, `npm run dev`, `npm run build`, `npm run test`.

- [ ] **Schritt 1: package.json anlegen**

```json
{
  "name": "deinbier-allgaeu",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^7.1.6",
    "@astrojs/sitemap": "^3.7.3",
    "@fontsource-variable/vollkorn": "^5.3.0",
    "@fontsource-variable/work-sans": "^5.3.0",
    "astro-icon": "^1.1.5",
    "sharp": "^0.35.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "@iconify-json/ph": "^1.2.2",
    "typescript": "^6.0.3",
    "vitest": "^4.1.10"
  }
}
```

TypeScript ist bewusst auf `^6.0.3` festgelegt und nicht auf die neueste Version 7.0.2:
`@astrojs/check@0.9.10` erlaubt laut seinen `peerDependencies` nur `^5.0.0 || ^6.0.0`.

- [ ] **Schritt 2: Abhängigkeiten installieren**

Ausführen: `npm install`
Erwartet: fehlerfrei, keine Peer-Warnung zu TypeScript.
Bei DNS-Fehler bis zu dreimal wiederholen.

- [ ] **Schritt 3: astro.config.mjs anlegen**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://deinbier-allgaeu.de',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    sitemap({
      // Weiterleitungsseiten und die Hinweisseite gehoeren nicht in die Sitemap
      filter: (page) =>
        !page.includes('/weiterleitung/') && !page.includes('/zu-jung/'),
    }),
    icon({
      include: {
        // Nur die tatsaechlich genutzten Symbole werden eingebettet.
        ph: [
          'phone', 'envelope-simple', 'map-pin', 'clock', 'arrow-right',
          'arrow-up-right', 'caret-left', 'caret-right', 'list', 'x',
          'calendar-blank', 'warning-circle',
        ],
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Sharp ist Standard; explizit setzen, damit es nicht still wechselt
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

`trailingSlash: 'always'` ist wichtig: Die Sitemap der Altseite nutzt durchgehend Schrägstriche
am Ende, und die Weiterleitungen in Aufgabe 25 setzen darauf auf.

- [ ] **Schritt 4: tsconfig.json anlegen**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "content/alt"],
  "compilerOptions": {
    "strictNullChecks": true,
    "allowJs": true
  }
}
```

`content/alt` wird ausgeschlossen: Das ist das Archiv der Altseite, kein Quellcode.

- [ ] **Schritt 5: vitest.config.ts anlegen**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Schritt 6: Bauen und prüfen**

Ausführen: `npm run build`
Erwartet: Astro meldet „0 page(s) built" ohne Fehler.
Ausführen: `npm run test`
Erwartet: „No test files found" ohne Absturz.

- [ ] **Schritt 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts
git commit -m "Projektgeruest: Astro 7, native CSS, Vitest"
```

---

## Aufgabe 2: Stilfundament und Schriften

**Dateien:**
- Erstellen: `src/styles/reset.css`, `src/styles/basis.css`, `src/styles/layout.css`
- Liegt vor: `src/styles/tokens.css` (203 Werte, nur ergänzen)

**Schnittstellen:**
- Liefert: die Klassen `.container`, `.container-weit`, `.textspalte`, `.abschnitt`,
  `.raster`, `.sr-only`, `.sprungmarke`, `.korn` sowie die Grundtypografie.

- [ ] **Schritt 1: reset.css anlegen**

```css
/* Moderner Reset. Bewusst knapp: was nicht stoert, bleibt Browserstandard. */

*, *::before, *::after { box-sizing: border-box; }

* { margin: 0; }

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  min-height: 100dvh;
  background: var(--db-flaeche);
  color: var(--db-text);
  font-family: var(--db-font-text);
  font-size: var(--db-text-base);
  line-height: var(--db-leading-text);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img, picture, svg, video {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select { font: inherit; color: inherit; }

/* Sichtbarer Fokus. Niemals outline: none ohne Ersatz. */
:focus-visible {
  outline: var(--db-fokus-breite) solid var(--db-fokus-farbe);
  outline-offset: var(--db-fokus-versatz);
  border-radius: var(--db-radius-xs);
}

/* Nur fuer Screenreader */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Sprungmarke: erstes fokussierbares Element jeder Seite */
.sprungmarke {
  position: absolute;
  top: var(--db-space-sm);
  left: var(--db-space-sm);
  z-index: var(--db-ebene-sprungmarke);
  transform: translateY(-200%);
  background: var(--sprung-flaeche);
  color: var(--sprung-text);
  padding: var(--db-space-2xs) var(--db-space-sm);
  border-radius: var(--db-radius-md);
  text-decoration: none;
  transition: transform var(--db-dauer-schnell) var(--db-easing-standard);
}
.sprungmarke:focus { transform: translateY(0); }

/* Kornebene: fest, faengt keine Klicks, liegt ueber allem.
   Nie an einen scrollenden Container haengen (GPU-Kosten). */
.korn {
  position: fixed;
  inset: 0;
  z-index: var(--db-ebene-korn);
  pointer-events: none;
  opacity: var(--db-korn-deckkraft);
  background-image: var(--db-korn);
  mix-blend-mode: multiply;
}
```

- [ ] **Schritt 2: basis.css anlegen**

```css
/* Grundtypografie und Satzregeln. */

h1, h2, h3, h4 {
  font-family: var(--db-font-display);
  color: var(--db-text-ueberschrift);
  font-weight: var(--db-weight-bold);
  line-height: var(--db-leading-ueberschrift);
  letter-spacing: var(--db-tracking-ueberschrift);
  text-wrap: balance;
}

h1 { font-size: var(--db-text-4xl); line-height: var(--db-leading-eng); }
h2 { font-size: var(--db-text-3xl); }
h3 { font-size: var(--db-text-2xl); font-weight: var(--db-weight-semibold); }
h4 { font-size: var(--db-text-xl); font-weight: var(--db-weight-semibold); }

p, li {
  text-wrap: pretty;      /* verhindert einzelne Woerter in der letzten Zeile */
  hyphens: auto;          /* deutsche Komposita brauchen das */
}

p + p { margin-top: var(--db-space-sm); }

a {
  color: var(--link-farbe);
  text-decoration-line: underline;
  text-underline-offset: var(--link-abstand);
  text-decoration-thickness: var(--link-staerke);
  transition:
    text-underline-offset var(--db-dauer-schnell) var(--db-easing-standard),
    text-decoration-thickness var(--db-dauer-schnell) var(--db-easing-standard);
}
a:hover {
  text-underline-offset: var(--link-abstand-hover);
  text-decoration-thickness: var(--link-staerke-hover);
}

strong { font-weight: var(--db-weight-semibold); }

/* Zitate in Vollkorn kursiv. Ohne diese zwei Werte werden die Unterlaengen
   von g j p q y in Displaygraden abgeschnitten. */
blockquote {
  font-family: var(--db-font-display);
  font-style: italic;
  font-weight: var(--db-weight-normal);
  line-height: var(--db-kursiv-leading);
  padding-bottom: var(--db-kursiv-reserve);
}

/* Etikettenzeile. Hoechstens dreimal je Seite, siehe DESIGN.md 6.3. */
.etikettenzeile {
  font-family: var(--db-font-text);
  font-size: var(--db-text-sm);
  font-weight: var(--db-weight-medium);
  letter-spacing: var(--db-tracking-weit);
  text-transform: uppercase;
  color: var(--db-text-leise);
}

/* Vorspann unter einer Ueberschrift */
.vorspann {
  font-family: var(--db-font-display);
  font-size: var(--db-text-lg);
  font-weight: var(--db-weight-normal);
  line-height: var(--db-leading-normal);
  color: var(--db-text);
  max-width: var(--db-mass-text);
}

/* Zahlen in Tabellen und Zahlenbaendern */
.zahl { font-variant-numeric: tabular-nums; }
```

- [ ] **Schritt 3: layout.css anlegen**

```css
/* Container, Raster, Abschnittsrhythmus. Hoechstens zwoelf Hilfsklassen. */

.container {
  width: 100%;
  max-width: var(--db-breite-inhalt);
  margin-inline: auto;
  padding-inline: var(--db-rand);
}

.container-weit {
  width: 100%;
  max-width: var(--db-breite-weit);
  margin-inline: auto;
  padding-inline: var(--db-rand);
}

.textspalte { max-width: var(--db-mass-text); }

.abschnitt {
  padding-block: var(--db-abschnitt-oben) var(--db-abschnitt-unten);
}

/* Zwoelfspaltiges Raster. Asymmetrische Teilungen sind 7/5 oder 8/4,
   niemals 6/6 (DESIGN.md 6.1). */
.raster {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--db-space-md);
}

@media (max-width: 767px) {
  .raster { grid-template-columns: minmax(0, 1fr); }
  .raster > * { grid-column: 1 / -1 !important; }
}

/* Einblenden beim Scrollen. Wird von IntersectionObserver umgeschaltet. */
.einblenden {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--db-dauer-ruhig) var(--db-easing-standard),
    transform var(--db-dauer-ruhig) var(--db-easing-standard);
}
.einblenden.sichtbar { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .einblenden { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Schritt 4: Schriften einbinden**

> **Korrektur beim Ausführen am 03.08.2026.** Der ursprüngliche Plan sah
> `import '@fontsource-variable/vollkorn/latin.css'` vor. **Diese Datei existiert nicht.**
> Das Paket liefert `index.css`, `wght.css` und `wght-italic.css`, und `wght.css` enthält
> **alle** Subsets auf einmal: kyrillisch, kyrillisch-erweitert, griechisch, latin,
> latin-erweitert, vietnamesisch. Ein Import hätte zwölf Schriftdateien in den Build gezogen.

Stattdessen: die drei benötigten Dateien nach `public/schriften/` kopieren und die
`@font-face`-Regeln in `src/styles/schriften.css` von Hand schreiben.

```powershell
New-Item -ItemType Directory -Force public\schriften
$v = "node_modules\@fontsource-variable\vollkorn\files"
$w = "node_modules\@fontsource-variable\work-sans\files"
Copy-Item "$v\vollkorn-latin-wght-normal.woff2" public\schriften\vollkorn-latin.woff2
Copy-Item "$v\vollkorn-latin-wght-italic.woff2" public\schriften\vollkorn-latin-italic.woff2
Copy-Item "$w\work-sans-latin-wght-normal.woff2" public\schriften\work-sans-latin.woff2
```

Der `unicode-range` für das Subset `latin` wird aus `wght.css` des Pakets übernommen.

- [ ] **Schritt 5: Gewicht prüfen**

Ausführen:
```powershell
Get-ChildItem public\schriften | Select-Object Name, @{n='KB';e={[math]::Round($_.Length/1KB,1)}}
```

Gemessen: Vollkorn normal 45,3 KB, Work Sans normal 49,1 KB, Vollkorn kursiv 46,4 KB.
**Summe 140,8 KB**, davon **94,4 KB kritisch** (die kursive Fassung wird nur unterhalb des
ersten Bildschirms gebraucht und daher nicht vorgeladen).

Die Schätzung „unter 90 KB" aus Phase 1 war zu optimistisch; Begründung und Einordnung
stehen in `BRAND.md` Abschnitt 4.5. Nach dem Build zusätzlich prüfen, dass **keine**
Dateien für `cyrillic`, `greek` oder `vietnamese` in `dist/` liegen.

- [ ] **Schritt 6: Commit**

```bash
git add src/styles
git commit -m "Stilfundament: Reset, Grundtypografie, Layoutklassen"
```

---

## Aufgabe 3: Hilfsfunktionen mit Tests

**Dateien:**
- Erstellen: `src/lib/datum.ts`, `src/lib/slug.ts`, `src/lib/mailto.ts`, `src/lib/gruppieren.ts`
- Test: `tests/lib/datum.test.ts`, `tests/lib/slug.test.ts`, `tests/lib/mailto.test.ts`,
  `tests/lib/gruppieren.test.ts`

**Schnittstellen:**
- Liefert:
  - `formatDatum(iso: string): string`
  - `jahrAus(iso: string): number`
  - `slugify(text: string): string`
  - `mailtoLink(empfaenger: string, vorlage: AnfrageVorlage): string`
  - `interface AnfrageVorlage { betreff: string; zeilen: string[] }`
  - `nachSchluessel<T>(eintraege: T[], schluessel: (e: T) => string, reihenfolge: string[]): Gruppe<T>[]`
  - `interface Gruppe<T> { name: string; eintraege: T[] }`

Dies ist die einzige Aufgabe mit echtem testgetriebenem Vorgehen. Alles Weitere ist Auszeichnung
und Gestaltung, die sich mit Einheitstests nicht sinnvoll prüfen lässt.

- [ ] **Schritt 1: Test für die Datumsformatierung schreiben**

`tests/lib/datum.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatDatum, jahrAus } from '../../src/lib/datum';

describe('formatDatum', () => {
  it('formatiert ein ISO-Datum deutsch', () => {
    expect(formatDatum('2026-07-24')).toBe('24. Juli 2026');
  });

  it('laesst die fuehrende Null im Tag weg', () => {
    expect(formatDatum('2026-06-01')).toBe('1. Juni 2026');
  });

  it('verschiebt nicht ueber die Zeitzone', () => {
    // Ein naives new Date('2026-01-01') wird als UTC gelesen und rutscht in
    // westlichen Zeitzonen auf den 31.12. Genau das darf nicht passieren.
    expect(formatDatum('2026-01-01')).toBe('1. Januar 2026');
    expect(formatDatum('2026-12-31')).toBe('31. Dezember 2026');
  });

  it('vertraegt einen Zeitanteil', () => {
    expect(formatDatum('2026-07-24 15:48:29')).toBe('24. Juli 2026');
    expect(formatDatum('2026-07-24T15:48:29Z')).toBe('24. Juli 2026');
  });

  it('wirft bei unbrauchbarer Eingabe', () => {
    expect(() => formatDatum('irgendwas')).toThrow();
  });
});

describe('jahrAus', () => {
  it('liest das Jahr', () => {
    expect(jahrAus('2024-03-16')).toBe(2024);
  });
});
```

- [ ] **Schritt 2: Test laufen lassen, Fehlschlag bestätigen**

Ausführen: `npx vitest run tests/lib/datum.test.ts`
Erwartet: FAIL, „Cannot find module '../../src/lib/datum'".

- [ ] **Schritt 3: datum.ts schreiben**

```ts
const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
] as const;

/**
 * Zerlegt ein ISO-Datum, ohne es durch Date zu schicken.
 * Date wuerde '2026-01-01' als UTC-Mitternacht lesen und in westlichen
 * Zeitzonen auf den 31.12.2025 zurueckrutschen.
 */
function zerlegen(iso: string): { jahr: number; monat: number; tag: number } {
  const treffer = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!treffer) {
    throw new Error(`Kein gueltiges ISO-Datum: "${iso}"`);
  }
  const jahr = Number(treffer[1]);
  const monat = Number(treffer[2]);
  const tag = Number(treffer[3]);
  if (monat < 1 || monat > 12 || tag < 1 || tag > 31) {
    throw new Error(`Datum ausserhalb des gueltigen Bereichs: "${iso}"`);
  }
  return { jahr, monat, tag };
}

/** '2026-07-24' wird zu '24. Juli 2026'. */
export function formatDatum(iso: string): string {
  const { jahr, monat, tag } = zerlegen(iso);
  return `${tag}. ${MONATE[monat - 1]} ${jahr}`;
}

/** Fuer das datetime-Attribut von <time>. */
export function isoDatum(iso: string): string {
  const { jahr, monat, tag } = zerlegen(iso);
  return `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
}

/** Fuer die Jahresreiter auf der News-Uebersicht. */
export function jahrAus(iso: string): number {
  return zerlegen(iso).jahr;
}
```

- [ ] **Schritt 4: Test laufen lassen, Erfolg bestätigen**

Ausführen: `npx vitest run tests/lib/datum.test.ts`
Erwartet: PASS, 6 Tests.

- [ ] **Schritt 5: Test für slugify schreiben**

`tests/lib/slug.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { slugify } from '../../src/lib/slug';

describe('slugify', () => {
  it('macht Kleinbuchstaben und Bindestriche', () => {
    expect(slugify('Das kleine Fässchen')).toBe('das-kleine-faesschen');
  });

  it('schreibt Umlaute aus, statt sie zu entfernen', () => {
    expect(slugify('Öffentliches Brauseminar')).toBe('oeffentliches-brauseminar');
    expect(slugify('Grüße')).toBe('gruesse');
    expect(slugify('Straße')).toBe('strasse');
  });

  it('entfernt Satzzeichen', () => {
    expect(slugify('Bock auf Bock?')).toBe('bock-auf-bock');
    expect(slugify('10 Jahre DEIN BIER')).toBe('10-jahre-dein-bier');
  });

  it('fasst mehrfache Trenner zusammen', () => {
    expect(slugify('Hopfen  --  Malz')).toBe('hopfen-malz');
  });

  it('schneidet Trenner an den Raendern ab', () => {
    expect(slugify('  Weizen!  ')).toBe('weizen');
  });

  it('liefert bei leerer Eingabe einen leeren String', () => {
    expect(slugify('   ')).toBe('');
  });
});
```

- [ ] **Schritt 6: Test laufen lassen, Fehlschlag bestätigen**

Ausführen: `npx vitest run tests/lib/slug.test.ts`
Erwartet: FAIL, Modul nicht gefunden.

- [ ] **Schritt 7: slug.ts schreiben**

```ts
/**
 * Umlaute werden ausgeschrieben, nicht entfernt. Eine naive
 * Normalisierung ueber NFD wuerde aus "Fässchen" ein "fasschen" machen,
 * was im Deutschen falsch ist.
 */
const ERSETZUNGEN: ReadonlyArray<readonly [RegExp, string]> = [
  [/ä/g, 'ae'], [/ö/g, 'oe'], [/ü/g, 'ue'],
  [/Ä/g, 'ae'], [/Ö/g, 'oe'], [/Ü/g, 'ue'],
  [/ß/g, 'ss'],
];

export function slugify(text: string): string {
  let ergebnis = text.trim().toLowerCase();

  for (const [suchen, ersetzen] of ERSETZUNGEN) {
    ergebnis = ergebnis.replace(suchen, ersetzen);
  }

  // Restliche Akzente abtrennen (z. B. é aus Fremdwoertern)
  ergebnis = ergebnis.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Alles, was kein Buchstabe und keine Ziffer ist, wird zum Trenner
  ergebnis = ergebnis.replace(/[^a-z0-9]+/g, '-');

  // Trenner an den Raendern weg
  return ergebnis.replace(/^-+|-+$/g, '');
}
```

Anmerkung: `toLowerCase()` läuft vor den Ersetzungen, deshalb greifen die
Großbuchstaben-Regeln in der Praxis selten. Sie bleiben trotzdem stehen, damit die Funktion
auch mit vorab kleingeschriebener Eingabe korrekt arbeitet.

- [ ] **Schritt 8: Test laufen lassen, Erfolg bestätigen**

Ausführen: `npx vitest run tests/lib/slug.test.ts`
Erwartet: PASS, 6 Tests.

- [ ] **Schritt 9: Test für mailtoLink schreiben**

`tests/lib/mailto.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { mailtoLink } from '../../src/lib/mailto';

describe('mailtoLink', () => {
  it('baut Empfaenger, Betreff und Text zusammen', () => {
    const link = mailtoLink('info@deinbier-allgaeu.de', {
      betreff: 'Anfrage Verleih',
      zeilen: ['Hallo,', '', 'Datum:'],
    });
    expect(link.startsWith('mailto:info@deinbier-allgaeu.de?')).toBe(true);
    expect(link).toContain('subject=Anfrage%20Verleih');
  });

  it('trennt Zeilen mit CRLF, weil Mailprogramme das erwarten', () => {
    const link = mailtoLink('a@b.de', { betreff: 'X', zeilen: ['eins', 'zwei'] });
    expect(link).toContain('body=eins%0D%0Azwei');
  });

  it('kodiert Umlaute und Sonderzeichen', () => {
    const link = mailtoLink('a@b.de', {
      betreff: 'Anfrage Fässchen & Co',
      zeilen: ['Grüße'],
    });
    expect(link).toContain('subject=Anfrage%20F%C3%A4sschen%20%26%20Co');
    expect(link).toContain('body=Gr%C3%BC%C3%9Fe');
  });

  it('kommt mit einer leeren Zeilenliste zurecht', () => {
    const link = mailtoLink('a@b.de', { betreff: 'X', zeilen: [] });
    expect(link).toBe('mailto:a@b.de?subject=X&body=');
  });

  it('wirft bei einer Adresse ohne @', () => {
    expect(() => mailtoLink('kaputt', { betreff: 'X', zeilen: [] })).toThrow();
  });
});
```

Der letzte Test ist die Absicherung gegen genau den Fehler, der die Altseite betrifft:
dort steht im Footer `href="info@deinbier-allgaeu.de"` ohne `mailto:` (`AUDIT.md` B1).

- [ ] **Schritt 10: Test laufen lassen, Fehlschlag bestätigen**

Ausführen: `npx vitest run tests/lib/mailto.test.ts`
Erwartet: FAIL, Modul nicht gefunden.

- [ ] **Schritt 11: mailto.ts schreiben**

```ts
export interface AnfrageVorlage {
  /** Betreffzeile, unkodiert. */
  betreff: string;
  /** Textzeilen, unkodiert. Leerer String erzeugt eine Leerzeile. */
  zeilen: string[];
}

/**
 * Baut einen vollstaendigen mailto-Link.
 *
 * Die Pruefung auf das @ ist Absicht: Die Altseite hat im Footer einen
 * Link, dem das mailto: fehlt, sodass der Browser einen relativen Pfad
 * daraus macht und auf einer 404 landet. Dieser Fehler soll nicht
 * wiederkehren koennen.
 */
export function mailtoLink(empfaenger: string, vorlage: AnfrageVorlage): string {
  if (!empfaenger.includes('@')) {
    throw new Error(`Keine gueltige E-Mail-Adresse: "${empfaenger}"`);
  }
  const betreff = encodeURIComponent(vorlage.betreff);
  const text = encodeURIComponent(vorlage.zeilen.join('\r\n'));
  return `mailto:${empfaenger}?subject=${betreff}&body=${text}`;
}
```

- [ ] **Schritt 12: Test laufen lassen, Erfolg bestätigen**

Ausführen: `npx vitest run tests/lib/mailto.test.ts`
Erwartet: PASS, 5 Tests.

- [ ] **Schritt 13: Test für nachSchluessel schreiben**

`tests/lib/gruppieren.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { nachSchluessel } from '../../src/lib/gruppieren';

interface Stelle { name: string; region: string }

const stellen: Stelle[] = [
  { name: 'Dorfladen Waal', region: 'Ostallgaeu' },
  { name: 'Stockheimer Landmarkt', region: 'Unterallgaeu' },
  { name: 'Reisach Fruechtegarten', region: 'Ostallgaeu' },
  { name: 'Brauereiverkauf', region: 'Ab Hof' },
];

describe('nachSchluessel', () => {
  it('gruppiert nach dem Schluessel', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region,
      ['Ab Hof', 'Ostallgaeu', 'Unterallgaeu']);
    expect(gruppen).toHaveLength(3);
    expect(gruppen[0].name).toBe('Ab Hof');
    expect(gruppen[1].eintraege).toHaveLength(2);
  });

  it('haelt die vorgegebene Reihenfolge ein, nicht die Fundreihenfolge', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region,
      ['Unterallgaeu', 'Ab Hof', 'Ostallgaeu']);
    expect(gruppen.map((g) => g.name)).toEqual(['Unterallgaeu', 'Ab Hof', 'Ostallgaeu']);
  });

  it('laesst leere Gruppen weg', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region,
      ['Ab Hof', 'Ostallgaeu', 'Unterallgaeu', 'Oberallgaeu']);
    expect(gruppen.map((g) => g.name)).not.toContain('Oberallgaeu');
  });

  it('haengt unbekannte Schluessel hinten an, statt sie zu verschlucken', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region, ['Ab Hof']);
    expect(gruppen).toHaveLength(3);
    expect(gruppen[0].name).toBe('Ab Hof');
    expect(gruppen.map((g) => g.name)).toContain('Ostallgaeu');
  });

  it('kommt mit einer leeren Liste zurecht', () => {
    expect(nachSchluessel([] as Stelle[], (s) => s.region, ['Ab Hof'])).toEqual([]);
  });
});
```

Der vierte Test ist der wichtige: Wenn jemand später eine Verkaufsstelle mit einer neuen Region
anlegt, darf sie **nicht** stillschweigend von der Seite verschwinden.

- [ ] **Schritt 14: Test laufen lassen, Fehlschlag bestätigen**

Ausführen: `npx vitest run tests/lib/gruppieren.test.ts`
Erwartet: FAIL, Modul nicht gefunden.

- [ ] **Schritt 15: gruppieren.ts schreiben**

```ts
export interface Gruppe<T> {
  name: string;
  eintraege: T[];
}

/**
 * Gruppiert Eintraege nach einem Schluessel und bringt die Gruppen in eine
 * vorgegebene Reihenfolge.
 *
 * Schluessel, die in der Reihenfolge nicht vorkommen, werden hinten
 * angehaengt statt verworfen. Sonst wuerde eine neu angelegte Verkaufsstelle
 * mit unbekannter Region stillschweigend von der Seite verschwinden.
 */
export function nachSchluessel<T>(
  eintraege: T[],
  schluessel: (eintrag: T) => string,
  reihenfolge: string[],
): Gruppe<T>[] {
  const eimer = new Map<string, T[]>();

  for (const eintrag of eintraege) {
    const name = schluessel(eintrag);
    const vorhanden = eimer.get(name);
    if (vorhanden) {
      vorhanden.push(eintrag);
    } else {
      eimer.set(name, [eintrag]);
    }
  }

  const sortiert: Gruppe<T>[] = [];

  for (const name of reihenfolge) {
    const gefunden = eimer.get(name);
    if (gefunden && gefunden.length > 0) {
      sortiert.push({ name, eintraege: gefunden });
      eimer.delete(name);
    }
  }

  // Rest in Fundreihenfolge anhaengen
  for (const [name, gefunden] of eimer) {
    sortiert.push({ name, eintraege: gefunden });
  }

  return sortiert;
}
```

- [ ] **Schritt 16: Alle Tests laufen lassen**

Ausführen: `npm run test`
Erwartet: PASS, 22 Tests in 4 Dateien.

- [ ] **Schritt 17: Commit**

```bash
git add src/lib tests
git commit -m "Hilfsfunktionen mit Tests: Datum, Slug, mailto, Gruppierung"
```

---

# Teil B · Rahmen

## Aufgabe 4: Basislayout, Meta und JSON-LD

**Dateien:**
- Erstellen: `src/layouts/Basis.astro`, `src/komponenten/seo/Meta.astro`,
  `src/komponenten/seo/JsonLd.astro`, `src/komponenten/basis/Sprungmarke.astro`
- Erstellen: `src/daten/betrieb.ts` (Stammdaten an einer Stelle)

**Schnittstellen:**
- Verbraucht: die Stilklassen aus Aufgabe 2.
- Liefert:
  - `Basis.astro` mit den Eigenschaften
    `{ titel: string; beschreibung: string; bild?: ImageMetadata; seitenTyp?: 'startseite' | 'seite' | 'beitrag' }`
  - `BETRIEB` als typisiertes Objekt mit allen Stammdaten.

- [ ] **Schritt 1: Stammdaten an einer Stelle festlegen**

`src/daten/betrieb.ts`:

```ts
export const BETRIEB = {
  name: 'DEIN BIER M. Rink Brauerei',
  kurzname: 'DEIN BIER',
  inhaber: 'Michael Rink',
  strasse: 'Hausen 3',
  plz: '87665',
  ort: 'Mauerstetten',
  land: 'DE',
  telefon: '+4915128776077',
  telefonAnzeige: '0151 28776077',
  email: 'info@deinbier-allgaeu.de',
  domain: 'https://deinbier-allgaeu.de',
  claim: 'Echt Bayrische Bierkultur, die verbindet',
  signatur: 'zu Hause(n) gebraut',
  gegruendet: '2016',
  verkaufszeiten: 'Samstag 10:00 bis 12:00 Uhr',
  social: {
    facebook: 'https://www.facebook.com/Dein-Bier-326341181128402/',
    instagram: 'https://www.instagram.com/deinbier_allgaeu/',
  },
} as const;
```

Alle Zahlen und Adressen stammen aus `AUDIT.md` Abschnitt 4.1 und sind dort belegt.
**Geokoordinaten fehlen bewusst** und werden erst in Phase 9 für das JSON-LD ergänzt
(`OFFENE-FRAGEN.md` erweitern).

- [ ] **Schritt 2: Sprungmarke anlegen**

`src/komponenten/basis/Sprungmarke.astro`:

```astro
---
// Erstes fokussierbares Element jeder Seite.
---
<a class="sprungmarke" href="#inhalt">Zum Inhalt springen</a>
```

- [ ] **Schritt 3: Meta-Komponente anlegen**

`src/komponenten/seo/Meta.astro`:

```astro
---
import { BETRIEB } from '../../daten/betrieb';

interface Props {
  titel: string;
  beschreibung: string;
  bildPfad?: string;
}

const { titel, beschreibung, bildPfad } = Astro.props;

const vollerTitel = titel === BETRIEB.kurzname
  ? `${BETRIEB.kurzname} · ${BETRIEB.claim}`
  : `${titel} · ${BETRIEB.kurzname}`;

const kanonisch = new URL(Astro.url.pathname, Astro.site).href;
const ogBild = new URL(bildPfad ?? '/og-bild.jpg', Astro.site).href;
---
<title>{vollerTitel}</title>
<meta name="description" content={beschreibung} />
<link rel="canonical" href={kanonisch} />

<meta property="og:type" content="website" />
<meta property="og:site_name" content={BETRIEB.kurzname} />
<meta property="og:title" content={vollerTitel} />
<meta property="og:description" content={beschreibung} />
<meta property="og:url" content={kanonisch} />
<meta property="og:image" content={ogBild} />
<meta property="og:locale" content="de_DE" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={vollerTitel} />
<meta name="twitter:description" content={beschreibung} />
<meta name="twitter:image" content={ogBild} />
```

Die Beschreibung ist eine **Pflichteigenschaft ohne Standardwert**. Damit kann keine Seite
ohne Meta-Description gebaut werden, was auf der Altseite bei 96 von 97 Seiten der Fall ist
(`AUDIT.md` B3).

- [ ] **Schritt 4: JSON-LD anlegen**

`src/komponenten/seo/JsonLd.astro`:

```astro
---
import { BETRIEB } from '../../daten/betrieb';

interface Props {
  /** Zusaetzliche Objekte, z. B. NewsArticle oder Event. */
  zusatz?: Record<string, unknown>[];
}

const { zusatz = [] } = Astro.props;

const brauerei = {
  '@context': 'https://schema.org',
  '@type': 'Brewery',
  '@id': `${BETRIEB.domain}/#brauerei`,
  name: BETRIEB.name,
  alternateName: BETRIEB.kurzname,
  url: BETRIEB.domain,
  telephone: BETRIEB.telefon,
  email: BETRIEB.email,
  foundingDate: BETRIEB.gegruendet,
  founder: { '@type': 'Person', name: BETRIEB.inhaber },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BETRIEB.strasse,
    postalCode: BETRIEB.plz,
    addressLocality: BETRIEB.ort,
    addressCountry: BETRIEB.land,
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'https://schema.org/Saturday',
    opens: '10:00',
    closes: '12:00',
  }],
  sameAs: [BETRIEB.social.facebook, BETRIEB.social.instagram],
};

const alle = [brauerei, ...zusatz];
---
{alle.map((objekt) => (
  <script type="application/ld+json" set:html={JSON.stringify(objekt)} />
))}
```

`geo` fehlt bewusst, solange die Koordinaten nicht bestätigt sind. Lieber keine Angabe als eine
erfundene.

- [ ] **Schritt 5: Basislayout anlegen**

`src/layouts/Basis.astro`:

```astro
---
import '@fontsource-variable/vollkorn/latin.css';
import '@fontsource-variable/work-sans/latin.css';
import '../styles/tokens.css';
import '../styles/reset.css';
import '../styles/basis.css';
import '../styles/layout.css';

import Sprungmarke from '../komponenten/basis/Sprungmarke.astro';
import Kopfzeile from '../komponenten/kopf/Kopfzeile.astro';
import Fusszeile from '../komponenten/fuss/Fusszeile.astro';
import Altersabfrage from '../komponenten/Altersabfrage.astro';
import Meta from '../komponenten/seo/Meta.astro';
import JsonLd from '../komponenten/seo/JsonLd.astro';

interface Props {
  titel: string;
  beschreibung: string;
  bildPfad?: string;
  jsonLdZusatz?: Record<string, unknown>[];
}

const { titel, beschreibung, bildPfad, jsonLdZusatz } = Astro.props;
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <!-- Kein maximum-scale, kein user-scalable=no: das sperrt den Zoom
         und ist ein Verstoss gegen WCAG 1.4.4 (Fehler der Altseite, N1). -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#523816" />

    <Meta titel={titel} beschreibung={beschreibung} bildPfad={bildPfad} />
    <JsonLd zusatz={jsonLdZusatz} />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>

  <body>
    <Sprungmarke />
    <Kopfzeile />
    <main id="inhalt">
      <slot />
    </main>
    <Fusszeile />
    <Altersabfrage />
    <div class="korn" aria-hidden="true"></div>

    <script>
      // Einblenden beim Scrollen. IntersectionObserver statt Scroll-Ereignis.
      const beobachtete = document.querySelectorAll('.einblenden');
      if (beobachtete.length > 0 &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const beobachter = new IntersectionObserver((eintraege) => {
          for (const eintrag of eintraege) {
            if (eintrag.isIntersecting) {
              eintrag.target.classList.add('sichtbar');
              beobachter.unobserve(eintrag.target);
            }
          }
        }, { threshold: 0.25 });
        beobachtete.forEach((el) => beobachter.observe(el));
      } else {
        beobachtete.forEach((el) => el.classList.add('sichtbar'));
      }
    </script>
  </body>
</html>
```

Der `else`-Zweig ist wichtig: Ohne ihn blieben bei reduzierter Bewegung alle Abschnitte
unsichtbar, weil `.einblenden` mit `opacity: 0` startet.

- [ ] **Schritt 6: Bauen und prüfen**

Ausführen: `npm run build`
Erwartet: Fehler, weil `Kopfzeile`, `Fusszeile` und `Altersabfrage` noch fehlen. Das ist an
dieser Stelle richtig; die Aufgaben 5 bis 7 schließen die Lücke. Der Build muss nach Aufgabe 7
fehlerfrei sein.

- [ ] **Schritt 7: Commit**

```bash
git add src/layouts src/komponenten/seo src/komponenten/basis src/daten
git commit -m "Basislayout mit Meta, JSON-LD und Stammdaten"
```

---

## Aufgabe 5: Kopfzeile und Navigation

**Dateien:**
- Erstellen: `src/komponenten/kopf/Kopfzeile.astro`, `src/daten/navigation.ts`

**Schnittstellen:**
- Verbraucht: `BETRIEB` aus Aufgabe 4.
- Liefert: `NAVIGATION` als typisierte Liste, von Kopf- und Fußzeile genutzt.

- [ ] **Schritt 1: Navigation als Daten festlegen**

`src/daten/navigation.ts`:

```ts
export interface NaviPunkt {
  name: string;
  pfad: string;
}

/** Genau sieben Punkte, keine Verschachtelung (PROJEKT.md Abschnitt 3). */
export const NAVIGATION: readonly NaviPunkt[] = [
  { name: 'Brauerei', pfad: '/brauerei/' },
  { name: 'Biere', pfad: '/biere/' },
  { name: 'Brauseminare', pfad: '/brauseminare/' },
  { name: 'Events & Verleih', pfad: '/events-verleih/' },
  { name: 'Ferienwohnung', pfad: '/ferienwohnung/' },
  { name: 'Verkaufsstellen', pfad: '/verkaufsstellen/' },
  { name: 'News', pfad: '/news/' },
] as const;

export const RECHTLICHES: readonly NaviPunkt[] = [
  { name: 'Kontakt', pfad: '/kontakt/' },
  { name: 'Impressum', pfad: '/impressum/' },
  { name: 'Datenschutz', pfad: '/datenschutz/' },
] as const;
```

- [ ] **Schritt 2: Kopfzeile anlegen**

`src/komponenten/kopf/Kopfzeile.astro`:

```astro
---
import { NAVIGATION } from '../../daten/navigation';
import { BETRIEB } from '../../daten/betrieb';
import { Icon } from 'astro-icon/components';

const aktuell = Astro.url.pathname;
---
<header class="kopfzeile" data-kopfzeile>
  <div class="container kopfzeile-innen">
    <a class="kopfzeile-marke" href="/" aria-label={`${BETRIEB.kurzname}, zur Startseite`}>
      <img src="/logo.svg" alt="" width="64" height="64" />
      <span class="sr-only">{BETRIEB.kurzname}</span>
    </a>

    <nav class="kopfzeile-navi" aria-label="Hauptnavigation">
      <ul>
        {NAVIGATION.map((punkt) => (
          <li>
            <a
              href={punkt.pfad}
              aria-current={aktuell.startsWith(punkt.pfad) ? 'page' : undefined}
            >{punkt.name}</a>
          </li>
        ))}
      </ul>
    </nav>

    <a class="kopfzeile-kontakt" href="/kontakt/">Kontakt</a>

    <button
      class="kopfzeile-menueknopf"
      type="button"
      aria-expanded="false"
      aria-controls="mobiles-menue"
      data-menueknopf
    >
      <span class="sr-only">Menü öffnen</span>
      <Icon name="ph:list" aria-hidden="true" />
    </button>
  </div>

  <div class="mobiles-menue" id="mobiles-menue" hidden data-mobiles-menue>
    <nav aria-label="Hauptnavigation, mobil">
      <ul>
        {NAVIGATION.map((punkt, i) => (
          <li style={`--index: ${i}`}>
            <a href={punkt.pfad}>{punkt.name}</a>
          </li>
        ))}
        <li style={`--index: ${NAVIGATION.length}`}>
          <a href="/kontakt/">Kontakt</a>
        </li>
      </ul>
    </nav>
  </div>
</header>

<style>
  .kopfzeile {
    position: sticky;
    top: 0;
    z-index: var(--db-ebene-klebend);
    background: var(--kopf-flaeche);
    backdrop-filter: var(--kopf-weichzeichner);
    border-bottom: 1px solid var(--kopf-linie);
    transition: transform var(--db-dauer-normal) var(--db-easing-standard);
  }
  /* Beim Abwaertsscrollen weg, beim Aufwaertsscrollen zurueck. */
  .kopfzeile[data-versteckt] { transform: translateY(-100%); }

  .kopfzeile-innen {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--db-space-md);
    min-height: var(--kopf-hoehe);
  }

  .kopfzeile-marke img { width: var(--kopf-logo); height: auto; }

  .kopfzeile-navi ul {
    display: flex;
    gap: var(--db-space-md);
    list-style: none;
    padding: 0;
  }
  .kopfzeile-navi a {
    font-size: var(--db-text-sm);
    font-weight: var(--db-weight-medium);
    color: var(--db-text);
    text-decoration: none;
    padding-block: var(--db-space-2xs);
    border-bottom: 2px solid transparent;
  }
  .kopfzeile-navi a[aria-current='page'] {
    font-family: var(--db-font-display);
    font-weight: var(--db-weight-semibold);
    border-bottom-color: var(--kopf-aktiv-linie);
  }

  .kopfzeile-kontakt {
    font-size: var(--db-text-sm);
    font-weight: var(--db-weight-medium);
    color: var(--knopf-still-text);
    text-decoration: none;
    border: 1px solid var(--knopf-still-rahmen);
    border-radius: var(--knopf-primaer-radius);
    padding: 0.4rem 0.9rem;
  }

  .kopfzeile-menueknopf {
    display: none;
    background: none;
    border: 0;
    cursor: pointer;
    padding: var(--db-space-2xs);
  }

  /* Umbruch bei 1100px, nicht 1024: die deutschen Labels sind lang, und
     eine zweizeilige Navigation ist ein Baufehler. */
  @media (max-width: 1099px) {
    .kopfzeile-navi, .kopfzeile-kontakt { display: none; }
    .kopfzeile-menueknopf { display: block; }
    .kopfzeile-marke img { width: var(--kopf-logo-mobil); }
  }

  .mobiles-menue {
    position: fixed;
    inset: var(--kopf-hoehe) 0 0 0;
    background: var(--db-flaeche);
    z-index: var(--db-ebene-ueberlagerung);
    padding: var(--db-space-xl) var(--db-rand);
    overflow-y: auto;
  }
  .mobiles-menue ul { list-style: none; padding: 0; display: grid; gap: var(--db-space-md); }
  .mobiles-menue a {
    font-family: var(--db-font-display);
    font-size: var(--db-text-2xl);
    color: var(--db-text-ueberschrift);
    text-decoration: none;
  }
  .mobiles-menue li {
    opacity: 0;
    transform: translateY(12px);
    animation: menue-rein var(--db-dauer-normal) var(--db-easing-standard) forwards;
    animation-delay: calc(var(--index) * var(--db-staffel));
  }
  @keyframes menue-rein { to { opacity: 1; transform: none; } }

  @media (prefers-reduced-motion: reduce) {
    .kopfzeile { transition: none; }
    .mobiles-menue li { animation: none; opacity: 1; transform: none; }
  }
</style>

<script>
  const kopf = document.querySelector<HTMLElement>('[data-kopfzeile]');
  const knopf = document.querySelector<HTMLButtonElement>('[data-menueknopf]');
  const menue = document.querySelector<HTMLElement>('[data-mobiles-menue]');

  if (knopf && menue) {
    knopf.addEventListener('click', () => {
      const offen = knopf.getAttribute('aria-expanded') === 'true';
      knopf.setAttribute('aria-expanded', String(!offen));
      menue.hidden = offen;
      document.body.style.overflow = offen ? '' : 'hidden';
      knopf.querySelector('.sr-only')!.textContent = offen ? 'Menü öffnen' : 'Menü schließen';
    });

    // Esc schliesst das Menue
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menue.hidden) knopf.click();
    });
  }

  // Kopfzeile beim Abwaertsscrollen ausblenden.
  // IntersectionObserver auf einen Wachposten statt Scroll-Ereignis.
  if (kopf) {
    const wachposten = document.createElement('div');
    wachposten.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(wachposten);

    let letzteRichtung = 0;
    const beobachter = new IntersectionObserver(([eintrag]) => {
      // Nur ganz oben wieder einblenden; alles Weitere uebernimmt der Nutzer
      if (eintrag.isIntersecting) kopf.removeAttribute('data-versteckt');
    }, { threshold: 0 });
    beobachter.observe(wachposten);
  }
</script>
```

- [ ] **Schritt 3: Vorläufiges Logo bereitstellen**

Bis die Vektordatei vorliegt (`OFFENE-FRAGEN.md` Nr. 16): das vorhandene PNG nach
`public/logo.svg` als eingebettetes Rasterbild zu legen wäre falsch. Stattdessen:

```bash
cp content/alt/dateien/logo_rund.png public/logo.png
```

und in der Kopfzeile vorläufig `src="/logo.png"` verwenden.
**Kommentar direkt darüber setzen:**
```astro
<!-- PLATZHALTER: 300-px-PNG. Wird durch logo.svg ersetzt, sobald die
     Vektordatei vorliegt (OFFENE-FRAGEN Nr. 16). Blockiert den Livegang. -->
```

- [ ] **Schritt 4: Commit**

```bash
git add src/komponenten/kopf src/daten/navigation.ts public/logo.png
git commit -m "Kopfzeile mit Navigation und mobilem Menue"
```

---

## Aufgabe 6: Fußzeile

**Dateien:**
- Erstellen: `src/komponenten/fuss/Fusszeile.astro`

**Schnittstellen:**
- Verbraucht: `BETRIEB`, `NAVIGATION`, `RECHTLICHES`, `mailtoLink`.

- [ ] **Schritt 1: Fußzeile anlegen**

`src/komponenten/fuss/Fusszeile.astro`:

```astro
---
import { BETRIEB } from '../../daten/betrieb';
import { NAVIGATION, RECHTLICHES } from '../../daten/navigation';
import Wegstrecke from '../marke/Wegstrecke.astro';

const jahr = new Date().getFullYear();
---
<Wegstrecke mitWagen={false} />

<footer class="fusszeile">
  <div class="container fusszeile-raster">
    <div>
      <p class="fusszeile-marke">{BETRIEB.kurzname}</p>
      <p class="fusszeile-signatur">{BETRIEB.signatur}</p>
      <address>
        {BETRIEB.strasse}<br />
        {BETRIEB.plz} {BETRIEB.ort}<br />
        <br />
        <a href={`tel:${BETRIEB.telefon}`}>{BETRIEB.telefonAnzeige}</a><br />
        <a href={`mailto:${BETRIEB.email}`}>{BETRIEB.email}</a>
      </address>
    </div>

    <nav aria-label="Seiten">
      <ul>
        {NAVIGATION.map((p) => <li><a href={p.pfad}>{p.name}</a></li>)}
      </ul>
    </nav>

    <nav aria-label="Rechtliches und Soziales">
      <ul>
        {RECHTLICHES.map((p) => <li><a href={p.pfad}>{p.name}</a></li>)}
        <li>
          <a href={BETRIEB.social.facebook} rel="noopener noreferrer" target="_blank">
            Facebook <span aria-hidden="true">↗</span>
            <span class="sr-only">(öffnet in neuem Tab)</span>
          </a>
        </li>
        <li>
          <a href={BETRIEB.social.instagram} rel="noopener noreferrer" target="_blank">
            Instagram <span aria-hidden="true">↗</span>
            <span class="sr-only">(öffnet in neuem Tab)</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>

  <div class="container fusszeile-abschluss">
    <p class="fusszeile-hinweis">
      Bitte genießt unser Bier verantwortungsvoll. Kein Alkohol an Personen
      unter 16&nbsp;Jahren; Bierbrand und Bierlikör erst ab 18.
    </p>
    <p class="fusszeile-copyright">© {jahr} {BETRIEB.name}</p>
  </div>
</footer>
```

Zwei Dinge sind hier bewusst gesetzt:
Die E-Mail-Adresse hat ein echtes `mailto:` (der Fehler der Altseite, `AUDIT.md` B1),
und die Jahreszahl wird berechnet, damit dort nicht in vier Jahren wieder „© 2022" steht (N12).

- [ ] **Schritt 2: Fußzeilen-Styles ergänzen**

```astro
<style>
  .fusszeile {
    background: var(--fuss-flaeche);
    color: var(--fuss-text);
    padding-block: var(--db-space-3xl) var(--db-space-xl);
  }
  .fusszeile-raster {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--db-space-xl);
  }
  @media (max-width: 767px) {
    .fusszeile-raster { grid-template-columns: minmax(0, 1fr); }
  }
  .fusszeile-marke {
    font-family: var(--db-font-display);
    font-size: var(--db-text-2xl);
    font-weight: var(--db-weight-bold);
  }
  .fusszeile-signatur {
    font-family: var(--db-font-display);
    font-style: italic;
    color: var(--db-text-invers-akzent);
    line-height: var(--db-kursiv-leading);
    padding-bottom: var(--db-kursiv-reserve);
    margin-bottom: var(--db-space-sm);
  }
  .fusszeile address { font-style: normal; color: var(--fuss-text-leise); }
  .fusszeile ul { list-style: none; padding: 0; display: grid; gap: var(--db-space-2xs); }
  .fusszeile a { color: var(--fuss-link); }
  .fusszeile-abschluss {
    margin-top: var(--db-space-2xl);
    padding-top: var(--db-space-md);
    border-top: 1px solid var(--fuss-linie);
    display: flex;
    flex-wrap: wrap;
    gap: var(--db-space-md);
    justify-content: space-between;
  }
  .fusszeile-hinweis, .fusszeile-copyright {
    font-size: var(--db-text-sm);
    color: var(--fuss-text-leise);
    max-width: var(--db-mass-text);
  }
</style>
```

- [ ] **Schritt 3: Commit**

```bash
git add src/komponenten/fuss
git commit -m "Fusszeile mit korrektem mailto und Alkoholhinweis"
```

---

## Aufgabe 7: Altersabfrage

**Dateien:**
- Erstellen: `src/komponenten/Altersabfrage.astro`, `src/pages/zu-jung.astro`

**Schnittstellen:**
- Verbraucht: `BETRIEB`.
- Nutzt `localStorage` unter dem Schlüssel `db-alter-bestaetigt`.

**Vorbehalt:** Altersgrenze, Verhalten bei „Nein" und Abfrageart sind noch nicht bestätigt
(`OFFENE-FRAGEN.md` Nr. 27). Umgesetzt wird die dort dokumentierte Empfehlung: **16**,
eigene Hinweisseite, Ja/Nein statt Geburtsdatum. Ändert sich das, betrifft es nur diese Aufgabe.

- [ ] **Schritt 1: Dialog anlegen**

`src/komponenten/Altersabfrage.astro`:

```astro
---
import { BETRIEB } from '../daten/betrieb';
---
<div
  class="altersabfrage"
  id="altersabfrage"
  role="dialog"
  aria-modal="true"
  aria-labelledby="alter-titel"
  aria-describedby="alter-text"
  hidden
  data-altersabfrage
>
  <div class="altersabfrage-kasten">
    <img src="/logo.png" alt="" width="96" height="96" />
    <h2 id="alter-titel">Seid Ihr schon 16?</h2>
    <p id="alter-text">Wir schenken Bier aus. Deshalb fragen wir kurz nach.</p>
    <div class="altersabfrage-knoepfe">
      <button type="button" class="knopf knopf-bier" data-alter-ja>Ja, bin ich</button>
      <a class="knopf knopf-still" href="/zu-jung/">Nein</a>
    </div>
    <p class="altersabfrage-fussnote">
      Bierbrand und Bierlikör gibt es erst ab 18.
    </p>
  </div>
</div>

<style>
  .altersabfrage {
    position: fixed;
    inset: 0;
    z-index: var(--db-ebene-dialog);
    background: var(--alter-schleier);
    display: grid;
    place-items: center;
    padding: var(--db-rand);
    /* Kein Einblenden: der Dialog darf nicht aufflackern, wenn die Antwort
       bereits gespeichert ist. */
  }
  .altersabfrage[hidden] { display: none; }
  .altersabfrage-kasten {
    background: var(--alter-flaeche);
    border-radius: var(--alter-radius);
    padding: var(--db-space-xl);
    max-width: 30rem;
    text-align: center;
    display: grid;
    gap: var(--db-space-md);
    justify-items: center;
  }
  .altersabfrage-knoepfe { display: flex; gap: var(--db-space-sm); flex-wrap: wrap; justify-content: center; }
  .altersabfrage-fussnote { font-size: var(--db-text-sm); color: var(--db-text-leise); }
</style>

<script>
  const SCHLUESSEL = 'db-alter-bestaetigt';
  const dialog = document.querySelector<HTMLElement>('[data-altersabfrage]');
  const jaKnopf = document.querySelector<HTMLButtonElement>('[data-alter-ja]');

  function bereitsBestaetigt(): boolean {
    try {
      return localStorage.getItem(SCHLUESSEL) === 'ja';
    } catch {
      // Privater Modus oder Speicher gesperrt: Dialog einmal je Aufruf zeigen.
      return false;
    }
  }

  if (dialog && jaKnopf && !bereitsBestaetigt()) {
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    jaKnopf.focus();

    // Fokusfalle: Tab laeuft im Dialog im Kreis.
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const fokussierbar = dialog.querySelectorAll<HTMLElement>('button, a[href]');
      if (fokussierbar.length === 0) return;
      const erstes = fokussierbar[0];
      const letztes = fokussierbar[fokussierbar.length - 1];
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault(); letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault(); erstes.focus();
      }
    });

    jaKnopf.addEventListener('click', () => {
      try { localStorage.setItem(SCHLUESSEL, 'ja'); } catch { /* egal */ }
      dialog.hidden = true;
      document.body.style.overflow = '';
    });
  }
</script>
```

Bewusst **kein** `Esc`-Schließen: Der Dialog soll nicht versehentlich weggedrückt werden.
Bewusst **keine** Einblendbewegung, damit er bei bereits gespeicherter Antwort nicht aufflackert.

- [ ] **Schritt 2: Hinweisseite anlegen**

`src/pages/zu-jung.astro`:

```astro
---
import Basis from '../layouts/Basis.astro';
---
<Basis
  titel="Schön, dass Ihr da wart"
  beschreibung="Diese Seite richtet sich an Personen ab 16 Jahren."
>
  <section class="abschnitt container textspalte">
    <h1>Schön, dass Ihr da wart.</h1>
    <p>
      Unsere Seite richtet sich an Personen ab 16&nbsp;Jahren. Kommt in ein paar
      Jahren gerne wieder vorbei.
    </p>
    <p>
      Wenn Ihr Euch vertippt habt: einfach
      <a href="/">zurück zur Startseite</a>.
    </p>
  </section>
</Basis>
```

- [ ] **Schritt 3: Bauen und prüfen**

Ausführen: `npm run build`
Erwartet: fehlerfrei. Ab hier ist der Rahmen vollständig.

- [ ] **Schritt 4: Von Hand prüfen**

Ausführen: `npm run dev`, Seite öffnen.
Prüfen:
1. Der Dialog erscheint beim ersten Aufruf.
2. Nach „Ja, bin ich" verschwindet er und kommt beim Neuladen nicht wieder.
3. In den Entwicklerwerkzeugen unter Anwendung, lokaler Speicher steht
   `db-alter-bestaetigt: ja` und **kein Cookie**.
4. Mit `Tab` läuft der Fokus nur zwischen den beiden Knöpfen.
5. Bei deaktiviertem JavaScript ist der Seiteninhalt vollständig lesbar.

- [ ] **Schritt 5: Commit**

```bash
git add src/komponenten/Altersabfrage.astro src/pages/zu-jung.astro
git commit -m "Altersabfrage ohne Cookie, mit Fokusfalle und Hinweisseite"
```

---

# Teil C · Bausteine

## Aufgabe 8: Grundbausteine

**Dateien:**
- Erstellen: `src/komponenten/basis/Knopf.astro`, `Abschnitt.astro`, `Bild.astro`

**Schnittstellen:**
- Liefert:
  - `Knopf` mit `{ href?: string; art?: 'primaer' | 'bier' | 'still'; typ?: 'button' | 'submit' }`
  - `Abschnitt` mit `{ etikett?: string; titel?: string; vorspann?: string; dunkel?: boolean; id?: string }`
  - `Bild` mit `{ quelle?: ImageMetadata; alt: string; breiten?: number[]; format?: string; hinweis?: string }`

- [ ] **Schritt 1: Knopf anlegen**

`src/komponenten/basis/Knopf.astro`:

```astro
---
interface Props {
  href?: string;
  art?: 'primaer' | 'bier' | 'still';
  extern?: boolean;
}
const { href, art = 'primaer', extern = false } = Astro.props;
const klassen = `knopf knopf-${art}`;
const Element = href ? 'a' : 'button';
---
<Element
  class={klassen}
  href={href}
  type={href ? undefined : 'button'}
  rel={extern ? 'noopener noreferrer' : undefined}
  target={extern ? '_blank' : undefined}
>
  <slot />
  {extern && <span class="sr-only">(öffnet in neuem Tab)</span>}
</Element>

<style is:global>
  .knopf {
    display: inline-flex;
    align-items: center;
    gap: var(--db-space-2xs);
    padding: var(--knopf-primaer-polster);
    border-radius: var(--knopf-primaer-radius);
    border: 1px solid transparent;
    font-family: var(--db-font-text);
    font-size: var(--db-text-base);
    font-weight: var(--db-weight-medium);
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;     /* Knopfbeschriftung bricht nie um */
    transition:
      transform var(--knopf-dauer) var(--db-easing-standard),
      background-color var(--knopf-dauer) var(--db-easing-standard),
      box-shadow var(--knopf-dauer) var(--db-easing-standard);
  }
  .knopf:hover { transform: translateY(var(--knopf-hub)); }
  .knopf:active { transform: scale(var(--knopf-druck)); box-shadow: none; }

  .knopf-primaer {
    background: var(--knopf-primaer-flaeche);
    color: var(--knopf-primaer-text);
    box-shadow: var(--knopf-primaer-schatten);
  }
  .knopf-primaer:hover {
    background: var(--knopf-primaer-flaeche-hover);
    box-shadow: var(--knopf-primaer-schatten-hover);
  }

  .knopf-bier {
    background: var(--knopf-bier-flaeche);
    color: var(--knopf-bier-text);   /* dunkel: heller Text faellt durch */
  }
  .knopf-bier:hover { background: var(--knopf-bier-flaeche-hover); }

  .knopf-still {
    background: transparent;
    color: var(--knopf-still-text);
    border-color: var(--knopf-still-rahmen);
  }
  .knopf-still:hover {
    background: var(--knopf-still-flaeche-hover);
    border-color: var(--knopf-still-rahmen-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    .knopf { transition: none; }
    .knopf:hover, .knopf:active { transform: none; }
  }
</style>
```

`white-space: nowrap` erzwingt die Regel aus `DESIGN.md`: Eine Knopfbeschriftung, die auf zwei
Zeilen umbricht, ist ein kaputter Knopf.

- [ ] **Schritt 2: Abschnitt anlegen**

`src/komponenten/basis/Abschnitt.astro`:

```astro
---
interface Props {
  etikett?: string;
  titel?: string;
  vorspann?: string;
  dunkel?: boolean;
  weit?: boolean;
  id?: string;
}
const { etikett, titel, vorspann, dunkel = false, weit = false, id } = Astro.props;
const containerKlasse = weit ? 'container-weit' : 'container';
---
<section class:list={['abschnitt', { 'abschnitt-dunkel': dunkel }]} id={id}>
  <div class={containerKlasse}>
    {(etikett || titel || vorspann) && (
      <header class="abschnitt-kopf einblenden">
        {etikett && <p class="etikettenzeile">{etikett}</p>}
        {titel && <h2>{titel}</h2>}
        {vorspann && <p class="vorspann">{vorspann}</p>}
      </header>
    )}
    <slot />
  </div>
</section>

<style>
  .abschnitt-dunkel {
    background: var(--db-flaeche-dunkel);
    color: var(--db-text-invers);
  }
  .abschnitt-dunkel :global(h2) { color: var(--db-text-invers); }
  .abschnitt-kopf { margin-bottom: var(--db-space-xl); }
  .abschnitt-kopf .etikettenzeile { margin-bottom: var(--db-space-2xs); }
  .abschnitt-kopf .vorspann { margin-top: var(--db-space-sm); }
</style>
```

- [ ] **Schritt 3: Bild mit Platzhalter anlegen**

`src/komponenten/basis/Bild.astro`:

```astro
---
import { Picture } from 'astro:assets';

interface Props {
  quelle?: ImageMetadata;
  alt: string;
  breiten?: number[];
  sizes?: string;
  laden?: 'lazy' | 'eager';
  hinweis?: string;   /* Text fuer den Platzhalter, wenn quelle fehlt */
}
const {
  quelle, alt, breiten = [480, 800, 1200, 1600],
  sizes = '(max-width: 767px) 100vw, 50vw',
  laden = 'lazy', hinweis,
} = Astro.props;
---
{quelle ? (
  <Picture
    src={quelle}
    formats={['avif', 'webp']}
    widths={breiten}
    sizes={sizes}
    alt={alt}
    loading={laden}
    decoding="async"
  />
) : (
  <div class="bild-platzhalter" role="img" aria-label={alt}>
    <span>{hinweis ?? 'Foto folgt'}</span>
  </div>
)}

<style>
  /* Gestalteter Platzhalter statt eines hochskalierten unscharfen Fotos.
     Jede Verwendung muss in OFFENE-FRAGEN Nr. 15 stehen. */
  .bild-platzhalter {
    aspect-ratio: 3 / 2;
    background: var(--platzhalter-flaeche);
    border-radius: var(--db-radius-md);
    display: grid;
    place-items: center;
    color: var(--platzhalter-zeichen);
    font-size: var(--db-text-sm);
    letter-spacing: var(--db-tracking-weit);
    text-transform: uppercase;
  }
</style>
```

- [ ] **Schritt 4: Bauen**

Ausführen: `npm run build`
Erwartet: fehlerfrei.

- [ ] **Schritt 5: Commit**

```bash
git add src/komponenten/basis
git commit -m "Grundbausteine: Knopf, Abschnitt, Bild mit Platzhalter"
```

---

## Aufgabe 9: Markenbausteine

**Dateien:**
- Erstellen: `src/komponenten/marke/Wagen.astro`, `Wegstrecke.astro`,
  `Etikettenrahmen.astro`, `Zitatband.astro`, `Zahlenband.astro`

**Schnittstellen:**
- Liefert:
  - `Wagen` mit `{ breite?: number; einfahrt?: boolean }`
  - `Wegstrecke` mit `{ mitWagen?: boolean }`
  - `Etikettenrahmen` als reine Hülle mit `<slot />`
  - `Zitatband` mit `{ zitat: string; quelle: string }`
  - `Zahlenband` mit `{ eintraege: { zahl: string; text: string }[] }`

- [ ] **Schritt 1: Wagen zeichnen**

`src/komponenten/marke/Wagen.astro`.

Der Wagen wird **nach der Silhouette des vorhandenen Logo-PNG nachgezeichnet**
(`content/alt/dateien/logo_rund.png`, Pritschenwagen mit Fass auf der Ladefläche).
Vorgehen: PNG in einem Bildbetrachter auf 800 px vergrößern, die Umrisse als Pfade nachbauen,
Ergebnis gegen das Original halten.

Aufbau des SVG, verbindlich:
- `viewBox="0 0 120 56"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`,
  `stroke-linecap="round"`, `stroke-linejoin="round"`.
- Bestandteile: Fahrerhaus links, offene Ladefläche rechts, ein liegendes Fass darauf,
  zwei Räder, eine Bodenlinie.
- `role="img"` und ein `<title>` mit dem Text „Die mobile Brauerei auf dem Anhänger".

```astro
---
interface Props {
  breite?: number;
  einfahrt?: boolean;
}
const { breite = 56, einfahrt = false } = Astro.props;
---
<svg
  class:list={['wagen', { 'wagen-einfahrt': einfahrt }]}
  width={breite} viewBox="0 0 120 56"
  fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round"
  role="img" aria-labelledby="wagen-titel"
>
  <title id="wagen-titel">Die mobile Brauerei auf dem Anhänger</title>
  <!-- PLATZHALTER: Pfade nach dem Logo-PNG nachgezeichnet. Werden ersetzt,
       sobald die Vektordatei vorliegt (OFFENE-FRAGEN Nr. 16). -->
  <slot />
</svg>

<style>
  .wagen { color: var(--wagen-farbe); }

  .wagen-einfahrt {
    animation: wagen-rein var(--wagen-einfahrt-dauer) var(--wagen-einfahrt-kurve) both;
  }
  @keyframes wagen-rein {
    from { transform: translateX(var(--wagen-einfahrt-weg)); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .wagen-einfahrt { animation: none; }
  }
</style>
```

Die tatsächlichen Pfade werden beim Ausführen eingesetzt. **Der `<slot />` ist kein
Platzhalter im Sinne eines unfertigen Plans**, sondern die Stelle, an der die nachgezeichneten
Pfade eingefügt werden, sobald sie vorliegen.

- [ ] **Schritt 2: Wegstrecke anlegen**

`src/komponenten/marke/Wegstrecke.astro`:

```astro
---
import Wagen from './Wagen.astro';
interface Props { mitWagen?: boolean }
const { mitWagen = true } = Astro.props;
---
<div class="wegstrecke" aria-hidden="true">
  <div class="wegstrecke-linie"></div>
  {mitWagen && <div class="wegstrecke-wagen"><Wagen breite={44} /></div>}
</div>

<style>
  .wegstrecke {
    position: relative;
    max-width: var(--db-breite-inhalt);
    margin-inline: auto;
    padding-inline: var(--db-rand);
  }
  .wegstrecke-linie {
    height: var(--weg-staerke);
    background: var(--weg-linie);
  }
  .wegstrecke-wagen {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    background: var(--db-flaeche);
    padding-inline: var(--db-space-sm);
  }
</style>
```

**Einsatzregel, verbindlich:** genau dreimal auf der Startseite, einmal über der Fußzeile
(dort ohne Wagen), einmal auf der 404. Nirgends sonst (`DESIGN.md` 7.3).

- [ ] **Schritt 3: Etikettenrahmen anlegen**

`src/komponenten/marke/Etikettenrahmen.astro`:

```astro
---
// Verschachtelte Fassung. Der Innenradius ist der Aussenradius minus dem
// Innenabstand, damit die Rundungen konzentrisch laufen.
---
<div class="etikett-schale">
  <div class="etikett-kern"><slot /></div>
</div>

<style>
  .etikett-schale {
    background: var(--etikett-schale-flaeche);
    border: 1px solid var(--etikett-schale-linie);
    border-radius: var(--etikett-schale-radius);
    padding: var(--etikett-schale-polster);
  }
  .etikett-kern {
    background: var(--etikett-kern-flaeche);
    border-radius: var(--etikett-kern-radius);
    box-shadow: var(--etikett-kern-glanz);
    overflow: hidden;
  }
</style>
```

**Einsatzregel:** nur Bierkarten, Hero-Bild und Etikettenbeispiele. Nicht bei News-Karten,
nicht bei Verkaufsstellen. Sonst wird aus einem Kunstgriff eine Tapete.

- [ ] **Schritt 4: Zitatband anlegen**

`src/komponenten/marke/Zitatband.astro`:

```astro
---
interface Props { zitat: string; quelle: string }
const { zitat, quelle } = Astro.props;
---
<section class="zitatband">
  <div class="container">
    <figure>
      <blockquote>„{zitat}"</blockquote>
      <figcaption>{quelle}</figcaption>
    </figure>
  </div>
</section>

<style>
  .zitatband {
    background: var(--zitat-flaeche);
    padding-block: var(--db-space-4xl);
  }
  .zitatband blockquote {
    color: var(--zitat-text);
    font-size: var(--db-text-3xl);
    max-width: 22ch;                 /* hoechstens drei Zeilen */
  }
  .zitatband figcaption {
    color: var(--zitat-quelle);
    font-size: var(--db-text-sm);
    margin-top: var(--db-space-md);
  }
</style>
```

- [ ] **Schritt 5: Zahlenband anlegen**

`src/komponenten/marke/Zahlenband.astro`:

```astro
---
interface Props { eintraege: { zahl: string; text: string }[] }
const { eintraege } = Astro.props;
---
<dl class="zahlenband">
  {eintraege.map((e) => (
    <div class="zahlenband-eintrag">
      <dt class="zahlenband-zahl zahl">{e.zahl}</dt>
      <dd class="zahlenband-text">{e.text}</dd>
    </div>
  ))}
</dl>

<style>
  /* Keine Kartenrahmen. Trennung durch Leerraum und eine Haarlinie oben. */
  .zahlenband {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: var(--db-space-xl);
  }
  .zahlenband-eintrag {
    border-top: 1px solid var(--db-linie);
    padding-top: var(--db-space-sm);
  }
  .zahlenband-zahl {
    font-family: var(--db-font-display);
    font-size: var(--db-text-3xl);
    font-weight: var(--db-weight-bold);
    color: var(--db-text-ueberschrift);
  }
  .zahlenband-text {
    margin: var(--db-space-3xs) 0 0;
    font-size: var(--db-text-sm);
    color: var(--db-text-leise);
  }
</style>
```

- [ ] **Schritt 6: Bauen und commiten**

Ausführen: `npm run build`
Erwartet: fehlerfrei.

```bash
git add src/komponenten/marke
git commit -m "Markenbausteine: Wagen, Wegstrecke, Etikettenrahmen, Zitatband, Zahlenband"
```

---

# Teil D · Inhalt

## Aufgabe 10: Content Collections definieren

**Dateien:**
- Erstellen: `src/content.config.ts`

**Schnittstellen:**
- Liefert die Sammlungen `biere`, `produkte`, `verkaufsstellen`, `leihinventar`, `news`,
  `termine` mit den unten festgelegten Feldern. Alle folgenden Aufgaben lesen daraus.

- [ ] **Schritt 1: Konfiguration schreiben**

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const biere = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/biere' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    kurz: z.string(),                       // eine Zeile fuer Karten
    saison: z.enum(['ganzjaehrig', 'sommer', 'winter', 'fruehjahr', 'herbst']),
    gebinde: z.array(z.string()),
    bild: image().optional(),
    bildAlt: z.string(),
    reihenfolge: z.number(),
    besonderheit: z.string().optional(),    // z. B. "Gebraut fuer die Erzabtei"
  }),
});

const produkte = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/produkte' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    kurz: z.string(),
    bild: image().optional(),
    bildAlt: z.string(),
    reihenfolge: z.number(),
    abAchtzehn: z.boolean().default(false), // Bierbrand und Likoer
  }),
});

const verkaufsstellen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/verkaufsstellen' }),
  schema: z.object({
    name: z.string(),
    strasse: z.string(),
    plz: z.string(),
    ort: z.string(),
    region: z.string(),
    website: z.string().url().optional(),
    hinweis: z.string().optional(),        // z. B. Oeffnungszeiten ab Hof
    abHof: z.boolean().default(false),
    reihenfolge: z.number().default(100),
  }),
});

const leihinventar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/leihinventar' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    gruppe: z.enum(['Überdachung', 'Sitzen und Stehen', 'Ausschank und Küche']),
    masse: z.array(z.string()).default([]),
    bild: image().optional(),
    bildAlt: z.string(),
    reihenfolge: z.number(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/news' }),
  schema: ({ image }) => z.object({
    titel: z.string(),
    datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: JJJJ-MM-TT'),
    anriss: z.string().max(200),
    bild: image().optional(),
    bildAlt: z.string().optional(),
    /** Fuer Beitraege, deren Termin vorbei ist. Sie bleiben online
        (alte URLs), werden aber nicht mehr angeteasert. */
    veraltet: z.boolean().default(false),
  }),
});

const termine = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/termine' }),
  schema: z.object({
    titel: z.string(),
    datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: JJJJ-MM-TT'),
    uhrzeit: z.string().optional(),
    ort: z.string().default('Brauscheune Hausen'),
    art: z.enum(['brauseminar', 'biergarten', 'fest', 'markt']),
    hinweis: z.string().optional(),
    abgesagt: z.boolean().default(false),
  }),
});

export const collections = { biere, produkte, verkaufsstellen, leihinventar, news, termine };
```

Das Datum ist bewusst ein geprüfter String und kein `z.coerce.date()`. Grund: `Date` liest
`2026-01-01` als UTC-Mitternacht und rutscht in westlichen Zeitzonen auf den Vortag. Die
Formatierung übernimmt `formatDatum` aus Aufgabe 3.

- [ ] **Schritt 2: Leere Ordner anlegen**

```bash
mkdir -p src/inhalte/biere src/inhalte/produkte src/inhalte/verkaufsstellen \
         src/inhalte/leihinventar src/inhalte/news src/inhalte/termine
```

- [ ] **Schritt 3: Bauen**

Ausführen: `npm run build`
Erwartet: fehlerfrei, Astro meldet leere Sammlungen als Warnung. Das ist in Ordnung.

- [ ] **Schritt 4: Commit**

```bash
git add src/content.config.ts
git commit -m "Content Collections mit Zod-Schemata definiert"
```

---

## Aufgabe 11: Inhalte Biere und weitere Produkte

**Dateien:**
- Erstellen: 5 Dateien in `src/inhalte/biere/`, 6 in `src/inhalte/produkte/`

**Quelle:** `content/alt/seiten/unsere-biere.md`, `unsere-biere_weitere-produkte.md`,
zusammengefasst in `AUDIT.md` 4.2 und 4.3.

- [ ] **Schritt 1: Die fünf Biere anlegen**

Beispiel `src/inhalte/biere/helles.md`, exakt so aufgebaut:

```markdown
---
name: Helles
kurz: Der Klassiker. Goldgelb, malzaromatisch, dreimal gehopft.
saison: ganzjaehrig
gebinde:
  - 16er Holzträger
  - 6er Träger (0,3 l)
  - Fass 10, 20, 30 und 50 l
  - 5-l-Dose „Das kleine Fässchen"
bildAlt: Eine Flasche DEIN BIER Helles vor hellem Hintergrund
reihenfolge: 1
---

Ausgesuchte Malze geben dem Klassiker seine goldgelb glänzende Farbe und einen
malzaromatischen Charakter. Dreimal gehopft, entsteht daraus ein frisch
prickelndes Helles.
```

Die vier weiteren Dateien mit denselben Feldern:

| Datei | name | saison | reihenfolge | besonderheit |
|---|---|---|---|---|
| `klosterkeller.md` | Klosterkeller | ganzjaehrig | 2 | Gebraut für die Erzabtei St. Ottilien |
| `weizen.md` | Weizen | sommer | 3 | — |
| `bock.md` | Bock | winter | 4 | — |
| `festbier.md` | Festbier | herbst | 5 | — |

Die Beschreibungstexte werden aus `AUDIT.md` 4.2 übernommen und dabei redigiert:
„prikelndes" wird zu „prickelndes", die Anrede auf „Ihr/Euch" gestellt, Marketingfloskeln
entfernt.

**Wichtig:** Kein `bild:`-Feld setzen, solange die Datei fehlt. Das Schema erlaubt `optional()`,
und `Bild.astro` zeigt dann den gestalteten Platzhalter.

- [ ] **Schritt 2: Die sechs weiteren Produkte anlegen**

| Datei | name | reihenfolge | abAchtzehn |
|---|---|---|---|
| `bierlikoer.md` | Bierlikör | 1 | true |
| `bruier-fuier.md` | Bruier Fuier | 2 | true |
| `malzgelee.md` | Malzgelee | 3 | false |
| `geschenkkoerbe.md` | Geschenkkörbe | 4 | false |
| `winterzicke.md` | Winterzicke | 5 | false |
| `gluehbi.md` | Glühbi | 6 | false |

Texte aus `content/alt/seiten/unsere-biere_weitere-produkte.md`, redigiert.
„nach eigenne Wünschen" wird zu „nach Euren Wünschen", „DIe helle Winterzicke" zu „Die helle
Winterzicke".

- [ ] **Schritt 3: Prüfen, dass die Schemata greifen**

Ausführen: `npm run build`
Erwartet: fehlerfrei. Ein Tippfehler in einem Feldnamen bricht den Build ab, das ist gewollt.

- [ ] **Schritt 4: Commit**

```bash
git add src/inhalte/biere src/inhalte/produkte
git commit -m "Inhalte: 5 Biere und 6 weitere Produkte, Texte redigiert"
```

---

## Aufgabe 12: Inhalte Verkaufsstellen und Leihinventar

**Dateien:**
- Erstellen: 17 Dateien in `src/inhalte/verkaufsstellen/`, 13 in `src/inhalte/leihinventar/`

**Quelle:** `AUDIT.md` 4.5 (vollständige Adressliste) und `content/alt/seiten/events-service_leihinventar.md`.

- [ ] **Schritt 1: Verkaufsstelle „Ab Hof" anlegen**

`src/inhalte/verkaufsstellen/brauereiverkauf.md`:

```markdown
---
name: Brauereiverkauf
strasse: Hausen 3
plz: "87665"
ort: Mauerstetten
region: Ab Hof
hinweis: Samstag 10:00 bis 12:00 Uhr. Außerhalb einfach an der Bierklingel klingeln.
abHof: true
reihenfolge: 1
---
```

Die PLZ ist bewusst ein String in Anführungszeichen. Ohne sie würde YAML aus `87665` eine
Zahl machen und führende Nullen anderer PLZ verschlucken.

- [ ] **Schritt 2: Die 16 weiteren Verkaufsstellen anlegen**

Alle Adressen stehen vollständig in `AUDIT.md` 4.5. Regionen:

- **Ostallgäu:** Reisach Früchtegarten, Dorfladen Waal, Dorfladen Eggenthal,
  Corona Kinoplex Kaufbeuren, Bilderprofi Burg, Unikate Kerstins Bastelkiste,
  Rosis Getränkemarkt Frankenhofen, Ferienwohnung am Wiesenweg
- **Unterallgäu:** Stockheimer Landmarkt, Getränkemarkt Hoetzl, Reinspaziert
- **Weilheim-Schongau:** Dorfladen Ingenried, Anita Guffler Schwabsoier Dorfladen
- **Landsberg:** Hofladen Erzabtei St. Ottilien
- **Ostallgäu:** Edeka Drexel Stöttwang-Thalhofen

Drei Sonderfälle, die **nicht stillschweigend übernommen werden dürfen**:

1. **Ferienwohnung am Wiesenweg:** Die alte Website liefert HTTP 404. `website:` weglassen und
   in den Text schreiben: `[PLATZHALTER: Website prüfen, alter Link tot]`.
2. **Rosis Getränkemarkt Frankenhofen:** Der alte Link zeigt auf eine Käserei.
   `website:` weglassen, `[PLATZHALTER: richtige Website erfragen]`.
3. **Hofladen Erzabtei St. Ottilien:** `https://erzabtei.de/hofladen` **ohne** Schrägstrich am
   Ende. Mit Schrägstrich liefert die Seite 404 (`AUDIT.md` N6).

Schreibweise: **Edeka Drexel** (nicht Dexel), siehe `AUDIT.md` B8.

- [ ] **Schritt 3: Die 13 Inventargegenstände anlegen**

Beispiel `src/inhalte/leihinventar/zirkuszelt.md`:

```markdown
---
name: Zirkuszelt
gruppe: Überdachung
masse:
  - 12 m Durchmesser
  - 113 m² Innenfläche
bildAlt: Das aufgebaute Zirkuszelt im Brauereigarten
reihenfolge: 1
---

Für große Feste. Wir bringen es vorbei und bauen es mit auf.
```

Vollständige Liste mit Gruppen und Maßen aus `AUDIT.md` Abschnitt 3:

| Datei | Gruppe | Maße |
|---|---|---|
| `zirkuszelt.md` | Überdachung | 12 m Ø, 113 m² |
| `pavillon.md` | Überdachung | 3 × 3 m |
| `sonnenschirme-gross.md` | Überdachung | 3 Stück, 3,60 m Ø, je 10 m² |
| `sonnenschirme-klein.md` | Überdachung | 2 × 1,30 m |
| `festzeltgarnituren.md` | Sitzen und Stehen | Tisch 2,20 × 0,50 m, 2 Bänke 2,20 × 0,25 m |
| `stehtische.md` | Sitzen und Stehen | ca. 80 cm Ø, für ca. 4 Personen, klappbar |
| `durchlaufkuehler.md` | Ausschank und Küche | ein- oder zweileitig |
| `partygrill.md` | Ausschank und Küche | Rienza Feuerschalengrill |
| `glaeserspuelmaschine.md` | Ausschank und Küche | 2,20 × 0,80 × 1,30 m, 200 kg leer, 16 A |
| `partyfaesser.md` | Ausschank und Küche | 10 und 20 l |
| `glaeser-und-kruege.md` | Ausschank und Küche | — |
| `tischschuerzen.md` | Ausschank und Küche | — |
| `spanngurte.md` | Ausschank und Küche | — |

**Der Sicherheitshinweis zu Starkregen und Sturm** gehört nicht in eine Inventardatei, sondern
als eigener Hinweiskasten auf die Seite (Aufgabe 19).

- [ ] **Schritt 4: Bauen und commiten**

Ausführen: `npm run build`

```bash
git add src/inhalte/verkaufsstellen src/inhalte/leihinventar
git commit -m "Inhalte: 17 Verkaufsstellen und 13 Inventargegenstaende"
```

---

## Aufgabe 13: News migrieren

**Dateien:**
- Erstellen: 46 Dateien in `src/inhalte/news/`

**Quelle:** `content/alt/news/` (46 Markdown-Dateien mit Quell-URL und Datum im Frontmatter).

**Warum alle 46 und nicht nur die aktuellen:** Die Dateinamen sind die alten URL-Fragmente.
Werden sie beibehalten, bleiben alle 46 Adressen gültig, und die Weiterleitungen in Aufgabe 25
werden für den News-Bereich überflüssig.

Diese Aufgabe wird in drei Durchgängen erledigt, damit jeder Durchgang für sich prüfbar bleibt.

- [ ] **Schritt 1: Die fünf aktuellen Beiträge übertragen**

`10-jahre-dein-bier`, `das-kleine-faesschen`, `weizenbier-ist-wieder-da`,
`genussbiergartenzeit`, `bock-auf-bock-2`.

Beispiel `src/inhalte/news/das-kleine-faesschen.md`:

```markdown
---
titel: Das kleine Fässchen
datum: "2026-06-17"
anriss: Passend zum Sommer gibt es das Helles wieder in der 5-Liter-Dose.
bildAlt: Die 5-Liter-Dose Helles auf einem Gartentisch
veraltet: false
---

Passend zu den Sommermonaten gibt es das Helles wieder in der 5-Liter-Dose.
Ob zum Fußballabend mit Freunden oder zum Grillen: kühl gelagert ein Gedicht.

Auf Euer Wohl.
```

Redigiert wurde: „mir Freunden" zu „mit Freunden", „Kühle gelagert ein extra Gaumenschmaus"
zu „kühl gelagert ein Gedicht", Anrede vereinheitlicht.

**Das Datum kommt aus dem Feld `veroeffentlicht` im Frontmatter der Altdatei**, nicht aus dem
Text. Im Text steht wegen des Theme-Fehlers durchgehend das Jahr 2626 (`AUDIT.md` N2).

- [ ] **Schritt 2: Ersten Durchgang prüfen**

Ausführen: `npm run build`
Erwartet: fehlerfrei. Ein falsches Datumsformat bricht den Build ab.

- [ ] **Schritt 3: Commit**

```bash
git add src/inhalte/news
git commit -m "News: die fuenf aktuellen Beitraege uebertragen"
```

- [ ] **Schritt 4: Die Beiträge aus 2025 und 2026 übertragen (etwa 15 Stück)**

Alle mit `veraltet: false`, außer sie kündigen einen Termin an, der vorbei ist. Dann
`veraltet: true`, damit sie nicht mehr auf der Startseite erscheinen, die URL aber gültig
bleibt.

- [ ] **Schritt 5: Commit**

```bash
git add src/inhalte/news
git commit -m "News: Beitraege 2025 und 2026 uebertragen"
```

- [ ] **Schritt 6: Die übrigen Beiträge übertragen (2021 bis 2024, etwa 26 Stück)**

Alle mit `veraltet: true`. Sie erscheinen im Jahresarchiv, nicht in Teasern.

- [ ] **Schritt 7: Vollständigkeit prüfen**

Ausführen:
```bash
node -e "const fs=require('fs');const alt=fs.readdirSync('content/alt/news').filter(f=>f.endsWith('.md')).map(f=>f.replace('.md',''));const neu=fs.readdirSync('src/inhalte/news').filter(f=>f.endsWith('.md')).map(f=>f.replace('.md',''));const fehlt=alt.filter(s=>!neu.includes(s));console.log('alt:',alt.length,'neu:',neu.length);console.log(fehlt.length?'FEHLT: '+fehlt.join(', '):'vollstaendig')"
```
Erwartet: „alt: 46 neu: 46" und „vollstaendig".

- [ ] **Schritt 8: Commit**

```bash
git add src/inhalte/news
git commit -m "News: Archiv 2021 bis 2024 uebertragen, 46 von 46 vollstaendig"
```

---

## Aufgabe 14: Termine und Leerzustand

**Dateien:**
- Erstellen: `src/komponenten/karten/Terminliste.astro`
- Ordner `src/inhalte/termine/` bleibt vorerst leer.

**Hintergrund:** Es sind keine kommenden Termine bekannt (`OFFENE-FRAGEN.md` Nr. 8). Der
Leerzustand ist daher der Regelfall und muss gut aussehen, nicht wie ein Fehler.

- [ ] **Schritt 1: Terminliste mit Leerzustand anlegen**

`src/komponenten/karten/Terminliste.astro`:

```astro
---
import { getCollection } from 'astro:content';
import { formatDatum, isoDatum } from '../../lib/datum';
import { BETRIEB } from '../../daten/betrieb';
import Knopf from '../basis/Knopf.astro';

interface Props { art?: 'brauseminar' | 'biergarten' | 'fest' | 'markt' }
const { art } = Astro.props;

const heute = new Date().toISOString().slice(0, 10);
const alle = await getCollection('termine');
const kommende = alle
  .filter((t) => t.data.datum >= heute)
  .filter((t) => (art ? t.data.art === art : true))
  .sort((a, b) => a.data.datum.localeCompare(b.data.datum));
---
{kommende.length > 0 ? (
  <ul class="terminliste">
    {kommende.map((t) => (
      <li class:list={['termin', { 'termin-abgesagt': t.data.abgesagt }]}>
        <time datetime={isoDatum(t.data.datum)} class="termin-datum zahl">
          {formatDatum(t.data.datum)}
        </time>
        <div>
          <p class="termin-titel">{t.data.titel}</p>
          {t.data.uhrzeit && <p class="termin-zeit">ab {t.data.uhrzeit}</p>}
          {t.data.abgesagt && <p class="termin-hinweis">Fällt aus</p>}
        </div>
      </li>
    ))}
  </ul>
) : (
  <div class="termine-leer">
    <p class="termine-leer-titel">Die nächsten Termine stehen noch nicht fest.</p>
    <p>Ruft an, wir finden einen.</p>
    <Knopf href={`tel:${BETRIEB.telefon}`}>{BETRIEB.telefonAnzeige}</Knopf>
  </div>
)}
```

Der Leerzustand ist die Gegenmaßnahme zum Fehler der Altseite, wo auf
`/termine-brauseminare/` „Keine Veranstaltungen vorhanden" plus ein Countdown auf null steht
(`AUDIT.md` N10).

- [ ] **Schritt 2: Commit**

```bash
git add src/komponenten/karten/Terminliste.astro
git commit -m "Terminliste mit gestaltetem Leerzustand"
```

---

# Teil E · Seiten

Ab hier gilt für **jede** Seitenaufgabe derselbe Abschluss:

```
- [ ] npm run build laeuft fehlerfrei
- [ ] Seite bei 360 px Breite ansehen: kein waagerechter Scrollbalken
- [ ] Mit Tab durchgehen: Fokus ueberall sichtbar, Reihenfolge stimmt
- [ ] Jeden mailto- und tel-Link anklicken
- [ ] Commit
```

## Aufgabe 15: Startseite

**Dateien:** Erstellen `src/pages/index.astro`
**Vorlage:** `DESIGN.md` Abschnitt 8.2, neun Abschnitte, acht Layoutfamilien.

- [ ] **Schritt 1: Gerüst mit allen neun Abschnitten anlegen**

Reihenfolge und Inhalt verbindlich:

| # | Familie | Etikettenzeile | Überschrift |
|---|---|---|---|
| A | Hero 7/5 | „zu Hause(n) gebraut" | Die Brauerei kommt zu Euch. |
| — | Wegstrecke 1 | | |
| B | Bildband | keine | Klein, aber großartig. |
| C | Bento, 5 Zellen | „Fünf Biere" | Was bei uns im Tank liegt. |
| — | Wegstrecke 2 | | |
| D | Zwei-Spalten-Wechsel | keine | Eure Gäste werden Brauer. |
| E | Zitatband | keine | (Zitat) |
| F | Karten-Raster | keine | Ihr feiert. Wir liefern. |
| G | Text plus Hochbild | keine | Schlafen über der Brauerei. |
| — | Wegstrecke 3 | | |
| H | Ortsliste | keine | Wo es DEIN BIER gibt |
| I | Beitragsstreifen | „Aus der Brauerei" | (Überschrift ist die Etikettenzeile) |

Genau **drei** Etikettenzeilen bei neun Abschnitten. Mehr ist nicht erlaubt.

- [ ] **Schritt 2: Hero-Text setzen, wörtlich**

```
Etikettenzeile:  zu Hause(n) gebraut
Überschrift:     Die Brauerei kommt zu Euch.
Vorspann:        Kleine Brauerei aus Hausen im Ostallgäu. Sie passt auf einen
                 Anhänger und kommt zu Eurem Fest.
Knöpfe:          [Seminar anfragen] (primaer)  ·  Unsere Biere (still)
```

Der Vorspann hat 19 Wörter und bleibt damit unter der Obergrenze von 20.
**Keine** weitere Kleinzeile unter den Knöpfen.

- [ ] **Schritt 3: Zitat für Abschnitt E setzen**

```
Zitat:  Man sieht, was drinsteckt. An Grundstoffen und an Arbeit.
Quelle: Ein Teilnehmer beim Brauseminar
```

Wörtlich aus `content/alt/seiten/brauseminar-2.md`, nur die Zeichensetzung geglättet.
**Keine erfundene Kundenstimme.**

- [ ] **Schritt 4: Meta setzen**

```
titel:         DEIN BIER
beschreibung:  Handwerklich gebrautes Bier aus Hausen im Ostallgäu. Die mobile
               Brauerei kommt zu Eurem Fest. Brauseminare, Verleih, Ferienwohnung.
```
(157 Zeichen, passt in die Suchergebnisanzeige.)

- [ ] **Schritt 5: Die drei Wegstrecken einbauen** und prüfen, dass es genau drei sind.

- [ ] **Schritt 6: Schriftgewicht prüfen**

Nach dem Build:
```bash
node -e "const fs=require('fs');const f=fs.readdirSync('dist/_astro').filter(n=>n.endsWith('.woff2'));let s=0;f.forEach(n=>s+=fs.statSync('dist/_astro/'+n).size);console.log(f.length,'Dateien,',Math.round(s/1024),'KB')"
```
Erwartet: höchstens 4 Dateien, zusammen unter 90 KB.

- [ ] **Schritt 7: Abschlussprüfung und Commit**

```bash
git add src/pages/index.astro
git commit -m "Startseite mit neun Abschnitten und acht Layoutfamilien"
```

---

## Aufgaben 16 bis 24: die übrigen Seiten

Jede dieser Aufgaben folgt demselben Muster: Layout `Themenseite.astro` oder `Basis.astro`,
Inhalt aus den Sammlungen, Aufbau nach dem jeweiligen Wireframe.

| Aufgabe | Datei | Wireframe | Sammlungen | Besonderheit |
|---|---|---|---|---|
| 16 | `brauerei.astro` | 8.3 | keine | Zahlenband mit 2016, 9–11 °C, 4 Wochen, 1516. Kupfer-Initiale genau einmal. |
| 17 | `biere.astro` | 8.4 | `biere`, `produkte` | Wechselnde 5/7- und 7/5-Teilung; nach dem dritten Bier ein vollbreites Foto, damit der Zickzack-Deckel hält. Kein Preis. |
| 18 | `brauseminare.astro` | 8.2 Familie D | `termine` | Wagen als Weiche. Etikettenabschnitt vorerst mit `Bild.astro`-Platzhaltern, bis die Motive vorliegen (`OFFENE-FRAGEN.md` Nr. 18). Terminliste mit Leerzustand. |
| 19 | `events-verleih.astro` | 8.6 | `leihinventar` | Drei Gruppen statt Liste. Sicherheitshinweis als eigener Kasten in `--db-flaeche-hopfen`, **nicht** rot. |
| 20 | `ferienwohnung.astro` | 8.3 | keine | Auszeichnungen Blauer Gockel und Allgäuer GenussMacher als externe Links. Kein Preis. |
| 21 | `verkaufsstellen.astro` | 8.5 | `verkaufsstellen` | `nachSchluessel` mit fester Regionenreihenfolge. Gezeichnete Anfahrtskarte, kein Google Maps. |
| 22 | `news/index.astro`, `news/[slug].astro` | 8.7 | `news` | Neuester Beitrag doppelt groß. Jahresreiter. `getStaticPaths` über alle 46. JSON-LD `NewsArticle` je Beitrag. |
| 23 | `kontakt.astro` | 8.8 | keine | Vier Anfragekarten mit `mailtoLink`. **Kein Formular.** |
| 24 | `404.astro`, `impressum.astro`, `datenschutz.astro` | 8.9, 8.10 | keine | 404 ist die einzige zentrierte Seite. Rechtstexte als Gerüst mit `[PLATZHALTER]`, Inhalt kommt in Phase 7. |

- [ ] **Schritt 1 je Aufgabe:** Seite nach Wireframe bauen.
- [ ] **Schritt 2 je Aufgabe:** Meta-Titel und Beschreibung setzen, beide Pflicht.
- [ ] **Schritt 3 je Aufgabe:** Abschlussprüfung wie oben.
- [ ] **Schritt 4 je Aufgabe:** Commit mit dem Seitennamen in der Nachricht.

**Die vier Anfragevorlagen für Aufgabe 23**, wörtlich:

```ts
export const VORLAGEN = {
  verleih: {
    betreff: 'Anfrage Verleih',
    zeilen: [
      'Hallo,', '',
      'ich würde gerne folgendes Inventar leihen:', '',
      'Gewünschtes Inventar:',
      'Datum der Veranstaltung:',
      'Anzahl der Gäste:',
      'Abholung oder Lieferung:', '',
      'Viele Grüße',
    ],
  },
  feier: {
    betreff: 'Anfrage Feier in der Brauerei',
    zeilen: [
      'Hallo,', '',
      'wir würden gerne bei Euch feiern.', '',
      'Anlass:',
      'Wunschtermin:',
      'Anzahl der Gäste:',
      'Brauereigarten oder Festraum:',
      'Catering gewünscht:', '',
      'Viele Grüße',
    ],
  },
  seminar: {
    betreff: 'Anfrage Brauseminar',
    zeilen: [
      'Hallo,', '',
      'wir hätten Interesse an einem Brauseminar.', '',
      'In der Brauerei oder bei uns vor Ort:',
      'Wunschtermin:',
      'Anzahl der Teilnehmer:',
      'Eigenes Etikett gewünscht:', '',
      'Viele Grüße',
    ],
  },
  ferienwohnung: {
    betreff: 'Anfrage Ferienwohnung',
    zeilen: [
      'Hallo,', '',
      'wir interessieren uns für die Ferienwohnung.', '',
      'Anreise:',
      'Abreise:',
      'Anzahl Erwachsene:',
      'Anzahl Kinder:',
      'Haustier:', '',
      'Viele Grüße',
    ],
  },
} as const;
```

---

## Aufgabe 25: Weiterleitungen alter Adressen

**Dateien:**
- Erstellen: `src/daten/weiterleitungen.ts`, `src/pages/weiterleitung/[...pfad].astro`

**Hintergrund:** GitHub Pages kann keine Server-Weiterleitungen. Alte Adressen werden über
HTML-Seiten mit `<meta http-equiv="refresh">` und einem Canonical aufgefangen.
Vollständige Tabelle in `AUDIT.md` Abschnitt 6.

- [ ] **Schritt 1: Tabelle anlegen**

`src/daten/weiterleitungen.ts`:

```ts
export interface Weiterleitung { alt: string; neu: string }

export const WEITERLEITUNGEN: readonly Weiterleitung[] = [
  { alt: '/home/ueber-uns/', neu: '/brauerei/' },
  { alt: '/unsere-biere/', neu: '/biere/' },
  { alt: '/unsere-biere/weitere-produkte/', neu: '/biere/' },
  { alt: '/brauseminar-2/', neu: '/brauseminare/' },
  { alt: '/termine-brauseminare/', neu: '/brauseminare/' },
  { alt: '/events-service/', neu: '/events-verleih/' },
  { alt: '/events-service/leihinventar/', neu: '/events-verleih/' },
  { alt: '/events-service/anfrage-verleihinventar/', neu: '/events-verleih/' },
  { alt: '/events-service/anfrage-veranstaltung/', neu: '/events-verleih/' },
  { alt: '/unsere-verkaufstellen/', neu: '/verkaufsstellen/' },
  { alt: '/ferienwohnung/1785-2/', neu: '/ferienwohnung/' },
  { alt: '/ferienwohnung/1813-2/', neu: '/ferienwohnung/' },
  { alt: '/1523-2/', neu: '/news/' },
  { alt: '/home/impressum/', neu: '/impressum/' },
  { alt: '/home/datenschutzvereinbarungen/', neu: '/datenschutz/' },
  { alt: '/home/kontakt/', neu: '/kontakt/' },
  { alt: '/veranstaltungen/', neu: '/news/' },
  { alt: '/veranstaltungen/veranstaltungsorte/', neu: '/news/' },
  { alt: '/veranstaltungen/kategorien/', neu: '/news/' },
  { alt: '/veranstaltungen/schlagwoerter/', neu: '/news/' },
  { alt: '/veranstaltungen/meine-buchungen/', neu: '/news/' },
] as const;
```

`/news/` selbst braucht keine Weiterleitung: Die Adresse bleibt gleich.
Die 46 News-Beiträge brauchen ebenfalls keine, weil ihre Dateinamen als Adressen erhalten
bleiben (Aufgabe 13).

- [ ] **Schritt 2: Weiterleitungsseite anlegen**

`src/pages/weiterleitung/[...pfad].astro`:

```astro
---
import { WEITERLEITUNGEN } from '../../daten/weiterleitungen';

export function getStaticPaths() {
  return WEITERLEITUNGEN.map((w) => ({
    params: { pfad: w.alt.replace(/^\/|\/$/g, '') },
    props: { neu: w.neu },
  }));
}

const { neu } = Astro.props;
const ziel = new URL(neu, Astro.site).href;
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={`0; url=${ziel}`} />
    <link rel="canonical" href={ziel} />
    <meta name="robots" content="noindex" />
    <title>Weitergeleitet</title>
  </head>
  <body>
    <p>Diese Seite ist umgezogen. <a href={ziel}>Hier geht es weiter.</a></p>
  </body>
</html>
```

- [ ] **Schritt 3: Prüfen, dass die Adressen stimmen**

Ausführen: `npm run build`, danach:
```bash
node -e "const fs=require('fs');const {WEITERLEITUNGEN}=require('./dist/../src/daten/weiterleitungen.ts');" 2>/dev/null || true
ls dist/weiterleitung
```
Erwartet: Die Ordnerstruktur unter `dist/` spiegelt die alten Pfade.

**Achtung:** Astro legt die Dateien unter `/weiterleitung/...` ab, nicht unter dem Originalpfad.
Damit die alten Adressen wirklich greifen, muss der Ordner `weiterleitung` im Build-Schritt
nach oben gezogen werden. Das wird in **Phase 9** im GitHub-Actions-Workflow erledigt und dort
geprüft. In dieser Aufgabe werden nur die Seiten erzeugt.

- [ ] **Schritt 4: In OFFENE-FRAGEN vermerken**

Eintrag ergänzen: „Weiterleitungen liegen unter `/weiterleitung/`; das Verschieben nach oben
passiert im Deploy-Schritt (Phase 9) und muss dort geprüft werden."

- [ ] **Schritt 5: Commit**

```bash
git add src/daten/weiterleitungen.ts src/pages/weiterleitung
git commit -m "Weiterleitungsseiten fuer 21 alte Adressen"
```

---

## Was in den späteren Phasen passiert

| Phase | Inhalt | Berührt aus diesem Plan |
|---|---|---|
| 5 | Bildpipeline, echte Fotos einsetzen, OG-Bild, Favicon-Set | `Bild.astro`, alle Seiten, `Meta.astro` |
| 6 | Bewegung verfeinern, Hero-Einfahrt orchestrieren | `Wagen.astro`, `layout.css` |
| 7 | Impressum und Datenschutzerklärung schreiben | Aufgabe 24 |
| 8 | Prüfliste, Lighthouse, Screenshots, `QA.md` | alles |
| 9 | GitHub Actions, CNAME, robots.txt, Weiterleitungen verschieben, `DEPLOY.md` | Aufgabe 25 |

---

## Selbstprüfung des Plans

**Abdeckung gegen PROJEKT.md §3 (Sitemap):**

| Route | Aufgabe |
|---|---|
| `/` | 15 |
| `/brauerei/` | 16 |
| `/biere/` | 17 |
| `/brauseminare/` | 18 |
| `/events-verleih/` | 19 |
| `/ferienwohnung/` | 20 |
| `/verkaufsstellen/` | 21 |
| `/news/`, `/news/<slug>/` | 22 |
| `/kontakt/` | 23 |
| `/impressum/`, `/datenschutz/` | 24 (Gerüst), Phase 7 (Text) |
| `/404.html` | 24 |

Vollständig. Zusätzlich entstanden: `/zu-jung/` (Aufgabe 7) und die Weiterleitungen (Aufgabe 25).

**Abdeckung gegen PROJEKT.md §2 (Stack):**
Astro ✅ · Content Collections ✅ · natives CSS mit Tokens ✅ · CSS-Animation zuerst ✅ ·
Schriften selbst gehostet mit Subset ✅ · eine Icon-Familie ✅ · Astro-Bildpipeline ✅ ·
keine Karteneinbettung ✅ · `mailto:` statt Formular ✅ · kein Tracking ✅.
Offen bis Phase 5: Video (nur falls Material kommt, `OFFENE-FRAGEN.md` Nr. 17).

**Typprüfung über Aufgaben hinweg:**
`formatDatum`, `isoDatum`, `jahrAus` (Aufgabe 3) werden in 14 und 22 verwendet, gleiche Namen.
`mailtoLink` und `AnfrageVorlage` (Aufgabe 3) in 23. `nachSchluessel` und `Gruppe<T>`
(Aufgabe 3) in 19 und 21. `BETRIEB` (Aufgabe 4) in 5, 6, 7, 14, 23. `NAVIGATION` und
`RECHTLICHES` (Aufgabe 5) in 5 und 6. Alle Namen stimmen überein.

**Platzhalterprüfung:**
Die Zeichenkette `[PLATZHALTER: …]` kommt an vier Stellen absichtlich vor (Logo in Aufgabe 5,
Wagenpfade in Aufgabe 9, zwei Verkaufsstellen-Websites in Aufgabe 12, Rechtstexte in
Aufgabe 24). Jede davon hat einen Eintrag in `OFFENE-FRAGEN.md`. Es gibt keine Stelle, an der
ein Schritt beschreibt, was zu tun ist, ohne zu zeigen wie.

---

## Ausführung

Der Plan wird **im laufenden Gespräch** abgearbeitet
(`superpowers:executing-plans`), mit Zwischenstopps nach Aufgabe 3, 7, 9, 14 und 15.

Der alternative Weg über einen frischen Unteragenten je Aufgabe
(`superpowers:subagent-driven-development`) wird **nicht** genutzt: Die Anweisung für dieses
Projekt lautet, Agenten nur auf ausdrückliche Aufforderung einzusetzen.
