# QA — Abnahme der Website

**Phase 8** · Geprüft am 04.08.2026 · Commit-Stand siehe Git-Verlauf
Skill: `superpowers:verification-before-completion`

> **Grundregel dieser Prüfung:** Kein Häkchen ohne Beleg. Jede Zeile unten ist
> das Ergebnis eines Befehls, der am **gebauten Ergebnis** gemessen hat, nicht
> am Quellcode abgelesen. Die Werkzeuge liegen unter `werkzeuge/` und lassen
> sich jederzeit erneut ausführen.

---

## 1 · Die Abnahme-Checkliste aus PROJEKT.md § 9

| Punkt | Ergebnis | Beleg |
|---|---|---|
| **0 externe Requests**, keine Cookies, kein Storage | ✅ mit dokumentierter Ausnahme | Netzwerkmitschnitt über 4 Seiten: kein einziger Aufruf an einen fremden Host. 0 Cookies. `localStorage` enthält genau einen Eintrag, und zwar erst **nach** der Altersabfrage. `sessionStorage` leer. |
| Fonts lokal + subsetted, `font-display: swap` | ✅ | 3 Dateien, ausschließlich `woff2`, nur Subset `latin`, 141 KB. Kein `cyrillic`, `greek`, `vietnamese` oder `latin-ext` im Build. `font-display: swap` bei allen 3 `@font-face`. Kein Google-Fonts-CDN. |
| **Lighthouse ≥ 95** in allen vier Kategorien, mobil und Desktop | ✅ **niedrigster Wert 98** | 6 Seiten × 2 Modi, siehe Tabelle in Abschnitt 2 |
| WCAG: Kontraste AA | ✅ | 447 Textstellen am gerenderten Ergebnis gemessen, alle ≥ AA. Text auf Fotos zusätzlich an echten Bildpunkten gemessen (Abschnitt 3). |
| WCAG: sichtbarer Fokus | ✅ | 60 Tab-Schritte durchlaufen, bei jedem ein sichtbarer Umriss. Ring 2 px, durchgezogen. |
| WCAG: Überschriften-Hierarchie | ✅ | Genau eine `<h1>` auf jeder der 59 Inhaltsseiten. Auf der Altseite waren es 0 bis 6. |
| WCAG: alle Bilder mit `alt` | ✅ | 275 Bilder, keines ohne `alt`. Keines trägt die Firmenanschrift als Alt-Text (Fehler der Altseite). |
| WCAG: Tastatur-Navigation | ✅ | Erstes fokussierbares Element ist die Sprungmarke „Zum Inhalt springen“. Menü per Tastatur bedienbar, `Escape` schließt. Altersabfrage mit Fokusfalle. |
| `prefers-reduced-motion` respektiert | ✅ | Eigene Prüfung: Menü und Altersabfrage schließen sofort, kein Abschnitt bleibt unsichtbar hängen. |
| Responsive ab 360 px, keine waagerechten Scrollbalken | ✅ | 12 Seiten × 5 Breiten (360, 390, 768, 1024, 1440): kein Überstand. |
| Alle `mailto:`/`tel:`-Links korrekt | ✅ | 5 verschiedene `mailto:`, 1 `tel:`, alle wohlgeformt. Gegenprobe auf den Altseiten-Fehler (E-Mail-Adresse als `href` ohne Schema): kein Treffer. |
| Impressum + Datenschutz von **jeder** Seite im Footer | ✅ | Auf allen 59 Inhaltsseiten verlinkt. |
| Alkohol-Verantwortungshinweis im Footer | ✅ | Auf allen 59 Inhaltsseiten. |
| Meta-Description je Seite | ✅ | Alle 59. Auf der Altseite fehlte sie bei 96 von 97. |
| OG-Image | ✅ | `og-bild.jpg`, 1200 × 630, auf jeder Seite referenziert. |
| `sitemap.xml` | ✅ | `sitemap-index.xml` wird erzeugt, ohne Weiterleitungen und Hinweisseite. |
| `robots.txt` | ⏳ **offen** | Für Phase 9 vorgesehen. |
| JSON-LD `Brewery` | ✅ | Auf jeder Seite. Zusätzlich `NewsArticle` je Beitrag, `Product` je Bier, `LodgingBusiness` für die Ferienwohnung. Auf der Altseite gab es auf keiner von 97 Seiten strukturiertes Markup. |
| `lang="de"` | ✅ | Alle 59 Seiten. |
| Canonical | ✅ | Alle 59 Seiten. |
| Eigene 404-Seite | ✅ | `404.html` im Markenlook. |
| `OFFENE-FRAGEN.md` aktuell | ✅ | 33 Fragen, nach Dringlichkeit sortiert, Erledigtes dokumentiert. |
| `DEPLOY.md` vollständig | ⏳ **offen** | Phase 9. |

**Zwei Punkte offen, beide gehören planmäßig in Phase 9.**

---

## 2 · Lighthouse

Gemessen gegen den Produktionsbuild über `astro preview`, mit Edge im
Headless-Betrieb. Mobil mit der Standarddrosselung von Lighthouse.

| Seite | Modus | Performance | Barrierefreiheit | Best Practices | SEO |
|---|---|---|---|---|---|
| Startseite | mobil | **98** | 100 | 100 | 100 |
| Startseite | Desktop | **100** | 100 | 100 | 100 |
| Biere | mobil | **98** | 100 | 100 | 100 |
| Biere | Desktop | **100** | 100 | 100 | 100 |
| News | mobil | **98** | 100 | 100 | 100 |
| News | Desktop | **100** | 100 | 100 | 100 |
| Brauseminare | mobil | **98** | 100 | 100 | 100 |
| Brauseminare | Desktop | **100** | 100 | 100 | 100 |
| Kontakt | mobil | **99** | 100 | 100 | 100 |
| Kontakt | Desktop | **100** | 100 | 100 | 100 |
| Datenschutz | mobil | **99** | 100 | 100 | 100 |
| Datenschutz | Desktop | **100** | 100 | 100 | 100 |

**Niedrigster Einzelwert: 98.** Ziel war 95.

**Nachgemessen am 04.08.2026**, nach dem Einbau der Hintergrundmotive
(DESIGN.md § 16) und nach jeder ihrer beiden Überarbeitungen. Die Motive bringen
`overflow: hidden`, neue Stapelkontexte und ein Stück JavaScript mit; alles
drei kann Überlauf-, Kontrast- und Performancewerte kippen.
Startseite mobil 98 / Desktop 100, LCP 2,3 s mobil und 0,5 s Desktop, CLS 0,
Blockierzeit 0 ms — alles unverändert. Die vier Prüfläufe (`qa-statisch`,
`qa-browser`, `qa-bildpunkte`, `bewegung-pruefen`) liefen ohne Fehler durch.

Das HTML der Startseite liegt bei **55,8 KB**, übertragen **9,5 KB**. Die
Motive kosten dort nichts mehr: sie liegen als zwei Dateien unter
`public/motive/` und werden einmal geladen (je 1,8 KB übertragen), statt auf
jeder Seite erneut im Quelltext zu stehen. Ein Zwischenstand mit inline
eingebetteten Pfaden lag bei 86,5 KB roh und kostete 0,2 s auf den größten
Inhalt — messbar an Lighthouse: 97 statt 98, zweimal reproduziert.

Der Lichteffekt ist objektiv nachgemessen, indem goldene Bildpunkte im
Motivbereich gezählt werden. An der Hopfendolde im Hero: **585 in Ruhe, 5754
unter dem Zeiger** — Faktor 10. An der Gerstenähre 8951 zu 18854; dort ist der
Ruhewert höher, weil die Ähre viel mehr Linie auf der Fläche hat. Vor der
Abschwächung lag die Ähre bei 38034 unter dem Zeiger.

---

## 3 · Was die Prüfung gefunden hat

Sieben echte Fehler, alle behoben. Sie stehen hier vollständig, weil eine
QA-Dokumentation ohne Fundstellen wertlos ist.

### 3.1 Text auf dem Foto war zu kontrastarm

Auf der Startseite liegt die Überschrift „Klein, aber großartig.“ über einem
Foto der Gärtanks. Der Verlauf dahinter war **oben durchsichtig**, die
Überschrift saß also fast ungeschützt auf einem hellen Edelstahlbild.

Aufgefallen ist das nur, weil die Kontrastmessung am **gerenderten Bildpunkt**
erfolgt und nicht am CSS: Aus dem Stylesheet allein lässt sich der Kontrast
über einem Foto nicht ableiten.

**Behoben:** Der Verlauf deckt jetzt über dem gesamten Textbereich mindestens
0,82 ab und blendet erst oberhalb des Textes aus.
**Nachgemessen am ungünstigsten Bildpunkt:** Überschrift 4,54 : 1 (nötig 3),
Fließtext 11,75 : 1, Link 7,91 : 1.

### 3.2 Eine Überschrift schob die ganze Seite zur Seite

`<h1>Datenschutzerklärung</h1>` misst bei 360 px Fensterbreite rund 375 px bei
318 px verfügbarem Platz. Ein einzelnes Wort erzeugte 36 px waagerechten
Überstand.

Ursache: Ich hatte `hyphens: auto` nur auf Fließtext gelegt, nicht auf
Überschriften. Bei deutschen Komposita ist das ein **systematischer** Fehler,
kein Einzelfall.

**Behoben:** `hyphens: auto` und `overflow-wrap: break-word` auf allen
Überschriften. Zusammen mit `lang="de"` trennt der Browser an den richtigen
Stellen.

### 3.3 Das Logo war der größte Download der Seite

`public/logo.png` mit **101 KB** wurde auf jeder Seite in voller Größe geladen
und dann auf 44 bis 64 Pixel gezeichnet. Es lag in `public/` und lief damit an
der Bildpipeline vorbei.

**Behoben:** Das Logo liegt jetzt unter `src/bilder/` und läuft durch die
Pipeline, mit AVIF und WebP in 64 und 128 px.
**Wirkung:** Performance mobil **93 → 98**, LCP **3,2 s → 2,3 s**. Das Logo
taucht unter den größten Übertragungen nicht mehr auf.

### 3.4 Ein Link ohne aussagekräftigen Text

Auf `/news/` führte „Weiterlesen“ zu SEO 92: Der Linktext allein sagt nicht,
wohin er führt.

**Behoben:** Der sichtbare Text bleibt „Weiterlesen“ (ein Wortlaut je Absicht,
`DESIGN.md` 15.1), ergänzt um einen nur für Screenreader und Suchmaschinen
sichtbaren Zusatz mit dem Beitragstitel. **SEO 92 → 100.**

### 3.5 Das Goldlicht konnte gar nicht auslösen

**Gefunden von:** einer Instrumentierung mit `elementFromPoint`, nachträglich
zur Abnahme, beim Einbau der Hintergrundmotive (DESIGN.md § 16).

Die Motive lagen auf `z-index: -1`. Damit liegen sie hinter der Fläche des
Abschnitts: `elementFromPoint` über der Hopfendolde lieferte `SECTION.hero`,
nicht das SVG. Der Zeiger erreichte das Motiv nie, `:hover` griff nie, das
Licht war unerreichbar.

Auf einem Bildschirmfoto sah alles richtig aus — das blasse Motiv stand an
seinem Platz. Nur eine Zeigermessung konnte das finden.

**Behoben:** `z-index: 0` am Motiv, `z-index: 1` am Inhalt.
**Belegt:** `elementFromPoint` liefert jetzt `svg` bzw. `path`.

### 3.6 Das Motiv war doppelt so breit wie berechnet

Die Breite des Motivs wurde als `calc(hoehe * seitenverhaeltnis)` gerechnet.
Für Pixelwerte stimmt das. Für die Dolde im Hero-Bild, die mit `hoehe="132%"`
am Foto hängt, nicht: **ein Prozentwert in einer Breitenangabe bezieht sich auf
die Breite des Bezugsrahmens, nicht auf dessen Höhe.**

Gemessen: 328 px breit statt der richtigen 151 px. Sichtbar war das nicht
direkt — das SVG behält sein Seitenverhältnis bei und stand einfach mittig in
einem viel zu breiten Kasten. Spürbar war es beim Überstand, der aus der
Breite gerechnet wird und dadurch weit danebenlag.

Gefunden durch Nachmessen der `getBoundingClientRect` aller beteiligten
Kästen, nachdem der Bildausschnitt „irgendwie falsch" aussah.

**Behoben:** `aspect-ratio` liefert die Breite, `translateX` mit Prozentwert
den Überstand. Beide beziehen sich auf die tatsächliche Größe des Elements.
**Nachgemessen:** 197 × 279 px Umriss bei 11° Drehung — das passt zu 151 × 255
px unrotiert.

### 3.7 Das mobile Menü war 390 × 96 px statt bildschirmfüllend

**Der schwerwiegendste Fund der ganzen Abnahme**, und er hat alle bisherigen
Prüfungen überstanden.

Das Menü lag innerhalb der Kopfzeile. Deren `backdrop-filter: blur(12px)`
macht sie — genau wie `filter` und `transform` — zum **Bezugsrahmen für
`position: fixed`**. Das `inset: var(--kopf-hoehe) 0 0 0` bezog sich damit
nicht auf das Fenster, sondern auf die 73 px hohe Leiste. Ergebnis: ein
Streifen von **390 × 96 px** direkt unter dem Logo, durch den die Startseite
hindurchschien.

Warum es niemand gefunden hat: `isVisible()` war die ganze Zeit wahr,
`aria-expanded` stimmte, das Ein- und Ausblenden funktionierte, und der
**geschlossene** Zustand sah auf jedem Bildschirmfoto richtig aus. Die
Bewegungsprüfung testete den Zustand, nicht die Geometrie. Gefunden wurde es
erst, als der Betreiber „der Header mit dem Menü passt auch noch nicht"
schrieb und ich die Kästen nachgemessen habe.

**Behoben:** Das Menü liegt außerhalb der Kopfzeile und deckt mit `inset: 0`
das ganze Fenster ab. Seine Ebene liegt eine Stufe unter der Kopfzeile, damit
Siegel und Menüknopf bedienbar bleiben.

**Regressionstest ergänzt** in `bewegung-pruefen.mjs`: das offene Menü muss
mindestens 95 % der Fensterfläche einnehmen. Gemessen vorher 12 %, jetzt
100 %. Dazu zwei weitere Prüfungen: der Menüknopf bleibt erreichbar und zeigt
das Schließkreuz.

**Die Lehre:** „sichtbar" ist keine brauchbare Zusage. Eine Prüfung, die
Zustände abfragt statt Geometrie zu messen, übersieht genau die Fehler, die
ein Bildschirmfoto auch übersieht.

---

## 4 · Was die Prüfwerkzeuge selbst falsch gemacht haben

Drei Fehlalarme. Sie stehen hier, weil ein Prüfwerkzeug, dem man blind glaubt,
gefährlicher ist als keines.

| Fehlalarm | Ursache | Korrektur |
|---|---|---|
| „`font-display: swap` fehlt“ | Gesucht wurde nur im HTML. Die `@font-face`-Regeln landen im gebündelten CSS. | Beide Orte durchsuchen |
| „36 px Überstand“ beim ersten Lauf | Gemessen bei `domcontentloaded`, bevor die Bilder Platz belegten | `networkidle` abwarten. **Der Befund war beim zweiten Lauf trotzdem echt** (siehe 3.2). |
| „118 Bilder ohne `alt`“ | Astro schreibt einen leeren Alt-Text als bloßes `alt` ohne Gleichheitszeichen. Laut HTML5 gleichbedeutend mit `alt=""`. | Prüfmuster erweitert |

---

## 4b · Was ich selbst falsch beurteilt habe

Die Hopfendolde ist **sechsmal** entstanden. Fünfmal habe ich sie gerendert,
angesehen und für richtig gehalten; fünfmal hat der Betreiber widersprochen
(„sieht nicht gut aus", „wie eine Karotte", „immer noch schlecht",
„Katastrophe").

Das Werkzeug war nie das Problem — Bildschirmfotos entstanden bei jeder
Fassung. Das Problem war die **Art des Hinsehens**: ich habe die Zeichnung
immer nur für sich betrachtet. Einzeln sieht fast jede Zeichnung „irgendwie
passend" aus, weil das Auge ergänzt, was es erwartet.

Beim sechsten Mal habe ich Vorlage und eigene Zeichnung nebeneinander auf eine
Fläche gelegt. Drei Fehler waren in Sekunden sichtbar, alle drei grundlegend:
runde Becher statt spitzer Blätter, ein nach unten spitzes Dreieck statt eines
Eis, ein Mittelstreifen statt Reihen.

**Werkzeug ergänzt:** `werkzeuge/vergleich.mjs` stellt eine Vorlage und ein
Motiv gleich hoch nebeneinander. Aufwand: 15 Zeilen. Ersparnis, hätte es das
vorher gegeben: fünf Durchgänge.

---

## 5 · Bewusste Abweichungen von den Vorgaben

Drei Stellen weichen von PROJEKT.md ab. Alle sind hier festgehalten, keine
stillschweigend.

### 5.1 `localStorage` statt „kein Storage-Zugriff“

PROJEKT.md § 9 fordert „kein Storage-Zugriff“. Die Altersabfrage nutzt
`localStorage`, weil der Betreiber am 03.08.2026 entschieden hat, sie
beizubehalten (`OFFENE-FRAGEN.md` Nr. 12).

**Ein Einwilligungsbanner wird dadurch nicht nötig:** kein Cookie, keine
Übertragung, kein Drittanbieter, keine personenbezogene Auswertung.
Gespeichert wird ausschließlich, *dass* die Frage beantwortet wurde.
Die Datenschutzerklärung hat dafür einen eigenen Abschnitt.

**Belegt:** 0 Cookies, 0 Einträge vor der Antwort, genau 1 Eintrag danach.

### 5.2 Kein dunkles Farbschema

Der Lead-Skill `design-taste-frontend` verlangt für Seiten mit
Publikumsverkehr beide Fassungen. Der Betreiber hat sich für **nur hell**
entschieden (`DESIGN.md` 14.2). Begründung: Die Marke *ist* die warme
Cremefläche; invertiert wird aus dem Bernstein Neon.

### 5.3 Gedankenstrich im Website-Text

Der Lead-Skill verbietet ihn vollständig. Im Deutschen ist der
Halbgeviertstrich als Gedankenstrich orthografisch korrekt. Übernommen wurde
die Regel für Überschriften, Etikettenzeilen, Knopfbeschriftungen,
Bildunterschriften und Zitate; im Fließtext höchstens einer je Absatz
(`DESIGN.md` Abschnitt 3).

---

## 6 · Sichtprüfung

24 Bilder erzeugt: 12 Seiten in Desktop- und Handybreite, jeweils die volle
Seitenhöhe. Dabei wurden zusätzlich Konsolenfehler und waagerechter Überstand
mitgeprüft. Kein Fund.

Geprüfte Seiten: Startseite · Brauerei · Biere · Brauseminare · Events &
Verleih · Ferienwohnung · Verkaufsstellen · News-Übersicht · ein News-Beitrag ·
Kontakt · Impressum · Datenschutz.

**Was auf den Bildern bewusst noch fehlt:** sechs Platzhalter beim
Leihinventar. Für diese Gegenstände existiert auf der Altseite kein Foto; die
Liste steht in `OFFENE-FRAGEN.md` Nr. 33. Sie zeigen einen gestalteten
Platzhalter, keine kaputte Fläche.

---

## 7 · Vergleich mit der Altseite

| | Altseite | Neu |
|---|---|---|
| HTML der Startseite | 281 KB | **55,8 KB** (9,5 KB komprimiert) |
| Externe Requests | Google reCAPTCHA, Facebook, Instagram | **0** |
| Cookies | reCAPTCHA + Consent-Speicher | **0** |
| Einwilligungsbanner | nötig | **nicht nötig** |
| Meta-Description | 1 von 97 Seiten | **59 von 59** |
| Strukturiertes Markup | keins | **auf jeder Seite** |
| `<h1>` je Seite | 0 bis 6 | **genau 1** |
| Zoom auf dem Handy | gesperrt | **erlaubt** |
| Produktnamen | nur als Bild | **als Text** |
| Datum auf Beiträgen | Jahr 2626 | **korrekt** |
| Tote Links | 3 | **0** |

---

## 8 · Werkzeuge

Alle unter `werkzeuge/`, jederzeit wiederholbar. Der Vorschauserver muss für
die letzten drei laufen (`npm run preview`).

| Werkzeug | Prüft |
|---|---|
| `qa-statisch.mjs` | Das gebaute HTML: externe Requests, Metadaten, Bilder, Footer-Pflichtangaben, `mailto`/`tel`, Pflichtdateien, Weiterleitungen, Größen |
| `qa-browser.mjs` | Im echten Browser: Tastatur, Fokus, Kontraste, Responsivität in 5 Breiten, Speicher, Netzwerk, Konsole |
| `qa-bildpunkte.mjs` | Kontrast von Text auf Fotos, gemessen am ungünstigsten gerenderten Bildpunkt |
| `bewegung-pruefen.mjs` | Die JavaScript-gestützten Bewegungen: 16 Funktionsprüfungen |
| `screenshots.mjs` | Vollseiten-Bilder in zwei Breiten, meldet Überstand und Konsolenfehler |

Dazu: `npm run test` (28 Vitest-Fälle) und `npx astro check`
(0 Fehler, 0 Warnungen, 0 Hinweise).

---

## 9 · Was vor dem Livegang noch fehlt

**Blockierend:**

1. **Logo als Vektordatei** (`OFFENE-FRAGEN.md` Nr. 16). Das Logo ist überall
   noch das 300-px-PNG. Auf guten Bildschirmen sichtbar weich. Das Skript zum
   Neuerzeugen des Favicon-Sets liegt fertig unter `werkzeuge/favicons.ps1`.
2. **Vier Angaben in den Rechtstexten** (Nr. 1, 2, 3, 5): Rechtsform,
   USt-IdNr., § 36 VSBG, Speicherdauer. Als sichtbarer Platzhalter markiert.
3. **Rechtstexte juristisch prüfen lassen.** Sie sind ein recherchierter
   Entwurf, keine Rechtsberatung.
4. **Phase 9:** `robots.txt`, `CNAME`, Deployment-Workflow, `DEPLOY.md`.

**Nicht blockierend, aber offen:**

- Einverständnis für das Vorschaubild mit erkennbaren Personen (Nr. 30)
- Sechs Fotos für das Leihinventar (Nr. 33)
- Aktuelle Brauseminar-Termine (Nr. 8) — der wichtigste Conversion-Pfad bleibt
  sonst eine Sackgasse
- Zwei Verkaufsstellen mit unklarem Link (Nr. 11)

**Vom Betreiber selbst aufzurufen:** 🔒 `review-animations` (Phase 6).
Zwei Dinge lassen sich am Code nicht beurteilen: ob sich die Einfahrt des
Wagens richtig anfühlt und ob die Staffelung der Scroll-Einblendungen zu
spürbar ist.
