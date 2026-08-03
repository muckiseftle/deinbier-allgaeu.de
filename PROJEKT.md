# PROJEKT.md — Website-Relaunch „DEIN BIER“ (deinbier-allgaeu.de)

> **Für Claude Code.** Diese Datei ist Briefing UND Arbeitsplan in einem.
> Skills werden über ihre Beschreibung getriggert — wenn ein Skill nicht automatisch lädt,
> explizit aufrufen: „Nutze jetzt den Skill `<name>`.“
> Mit 🔒 markierte Skills (`pick-ui-library`, `review-animations`) sind user-only und
> werden vom Betreiber selbst aufgerufen — nicht darauf warten, nur daran erinnern.

**Start-Prompt (für den Betreiber, Copy & Paste in Claude Code):**

```
Lies PROJEKT.md vollständig. Arbeite dann die Phasen 0–9 der Reihe nach ab und
nutze in jeder Phase exakt die dort genannten Skills (beim Namen aufrufen).
Stoppe am Ende jeder Phase mit einer kurzen Zusammenfassung + offenen Fragen
und warte auf mein OK, bevor du die nächste Phase startest.
Beginne jetzt mit Phase 0.
```

Alternativ für einzelne Phasen: `Führe Phase 4 aus PROJEKT.md aus.`

---

## 0 · Mission & harte Rahmenbedingungen

Neue Website für die Brauerei **DEIN BIER M. Rink** (Hausen bei Mauerstetten, Allgäu),
die das aktuelle WordPress/Divi-Setup vollständig ersetzt.

| Rahmenbedingung | Verbindlich |
|---|---|
| Hosting | **GitHub Pages**, Custom Domain `deinbier-allgaeu.de` |
| Backend | **Keins.** Rein statisch, keine Datenbank, kein Server-Code, kein CMS |
| Datenschutz | **DSGVO-konform by design**: keine Cookies, kein Tracking, keine externen CDNs, keine Google Fonts, keine Dritt-Embeds → **kein Cookie-Banner nötig** |
| Rechtstexte | Impressum + Datenschutzerklärung vollständig (siehe Abschnitt 6) |
| Sprache | Deutsch (Code/Commits gern Englisch) |
| Inhalte | Von der alten Seite übernehmen und verbessern. **Nichts erfinden.** Fehlendes als `[PLATZHALTER: …]` markieren und in `OFFENE-FRAGEN.md` sammeln |
| Externe Requests | **Null** im Produktivbetrieb. Fonts, Icons, Bilder, Video: alles selbst gehostet |

---

## 1 · Die Marke (Ist-Stand, von der alten Seite recherchiert)

**DEIN BIER M.Rink Brauerei** · Inhaber: Michael Rink · Hausen 3, 87665 Mauerstetten
Tel. +49 151 28776077 · info@deinbier-allgaeu.de · Facebook + Instagram vorhanden
Claim: „Echt Bayrische Bierkultur, die verbindet“ · 2026: **10-jähriges Jubiläum** (Fest 11.–13.09.2026)

**Das Besondere:** Kleine Brauwerkstatt in einer Scheune („Brauscheune“) — und die Brauerei ist
**mobil**: Sie passt auf einen Anhänger und kommt zu Festen und Firmen nach Hause.
Das ist der USP und muss auf der neuen Seite tragende Rolle spielen.

**Angebote (alle müssen abgebildet werden):**
1. **Biere:** Helles, Weizen (saisonal Sommer), Festbier, Bockbier · 5-l-Dose „Das kleine Fässchen“ · 16er Holzträger, 6er Träger (0,3 l) · Fassbier 10/20/30/50 l
2. **Weitere Produkte:** „Bruier-Fuier“ (Bierbrand aus Bockbier), Bierlikör (aus Festbier), Malzgelees
3. **Brauseminare** „Ihre Gäste werden Brauer“ — in der Brauerei oder mobil beim Kunden; individuelle Etiketten (Hochzeitsbier, Vereinsbier, Firmenbier)
4. **Feiern in der Brauerei:** Brauereigarten, Festraum, externes Catering möglich
5. **Leihinventar:** Zirkuszelt (12 m, 113 m²), Biergarnituren, Gläser/Krüge, Zapfanlage, Grill, Sonnenschirme, Kühler
6. **Ferienwohnung**
7. **Verkaufsstellen** (u. a. Reisach Früchtegarten Mauerstetten, Hofladen Erzabtei St. Ottilien, Stockheimer Landmarkt Bad Wörishofen, Dorfladen Waal, Edeka Drexel Stöttwang-Thalhofen — vollständige Liste in Phase 0 von der alten Seite ziehen)
8. **News / Veranstaltungen**

**Bekannte Probleme der alten Seite (in Phase 0 verifizieren und ergänzen):**
- Generischer Divi-Look, überladene, doppelt verschachtelte Navigation
- Divi-Platzhaltertext live sichtbar („Your content goes here…“)
- Keine Meta-Description, kein OG-Image, kein strukturiertes Markup
- Kaputter E-Mail-Link im Footer (rendert als relativer Pfad statt `mailto:`)
- Cookie-/DSGVO-Popup nötig wegen WordPress-Plugins — fällt beim Relaunch komplett weg
- Inkonsistente Anrede (mal „Sie“, mal „Ihr/Euch“), Tippfehler

---

## 2 · Tech-Stack (verbindlich, außer Phase 2 liefert harte Gegenargumente)

- **Astro** (statischer Output) · Content Collections für Biere, Produkte, News, Verkaufsstellen, Leihinventar
- **Styling:** Tailwind v4 **oder** natives CSS mit Design-Tokens — Entscheidung fällt in Phase 2 aus dem Design-Read. Eine Entscheidung, dann konsequent. (🔒 `pick-ui-library` kann der Betreiber hier optional selbst aufrufen.)
- **Animation:** CSS-/Scroll-driven zuerst; JS-Animation (Motion) nur in isolierten Astro-Islands, wenn CSS nicht reicht. `prefers-reduced-motion` immer respektieren
- **Fonts:** selbst gehostet via `@font-face`, `font-display: swap`, Subsetting (latin + de-Umlaute). **Niemals Google-Fonts-CDN** (DSGVO, LG München I)
- **Icons:** eine Familie (Phosphor bevorzugt), keine handgezeichneten SVG-Icons, `strokeWidth` global einheitlich
- **Bilder:** Astro-Image-Pipeline (AVIF/WebP + Fallback), echte Brauerei-Fotos bevorzugt, alle mit `alt`
- **Video:** selbst hosten (Datei < 100 MB, GitHub-Limit), `preload="none"`, Poster-Bild. Keine YouTube-Embeds
- **Karte/Anfahrt:** kein Google-Maps-Embed. Eigene SVG-Illustration/statische Grafik + externer Link „Route planen“
- **Formulare:** Es gibt kein Backend → **`mailto:`-Links mit vorbefülltem Betreff und Body** je Anfragetyp (Verleihinventar, Veranstaltung, Brauseminar, Ferienwohnung) + `tel:`-Link. Kein Drittanbieter-Formulardienst ohne ausdrückliches OK des Betreibers (würde AVV + Datenschutz-Erweiterung erfordern)
- **Kein** Analytics/Tracking. Wenn der Betreiber später Statistiken will: separat besprechen (Datenschutzerklärung müsste erweitert werden)

---

## 3 · Sitemap (neu, entschlackt)

| Route | Inhalt |
|---|---|
| `/` | Hero (mobile Brauerei / Handwerk als These), Story-Teaser, Biere, Brauseminare, Events & Verleih, Ferienwohnung-Teaser, Verkaufsstellen, News-Teaser |
| `/brauerei/` | Über uns, Michael Rink, die Brauscheune, die mobile Brauerei |
| `/biere/` | Alle Biere + weitere Produkte (Bierbrand, Likör, Gelees), Gebinde-Übersicht |
| `/brauseminare/` | Ablauf, Varianten (Brauerei / mobil), individuelle Etiketten, Termine, Anfrage (mailto) |
| `/events-verleih/` | Feiern in der Brauerei + komplettes Leihinventar, Anfrage (mailto) |
| `/ferienwohnung/` | Beschreibung, Bilder, Anfrage (mailto) |
| `/verkaufsstellen/` | Alle Verkaufsstellen mit Adresse + externem Link |
| `/news/` + `/news/<slug>/` | News aus Content Collection (10 Jahre, Weizen ist da, kleines Fässchen …) |
| `/kontakt/` | Kontakt, Anfahrt (statische Grafik + Link), Öffnungszeiten Brauereiverkauf `[PLATZHALTER]` |
| `/impressum/`, `/datenschutz/` | Rechtstexte (Abschnitt 6), aus dem Footer von jeder Seite verlinkt |
| `/404.html` | Eigene 404 im Markenlook |

Navigation: max. 7 Top-Level-Punkte, keine Zweifach-Verschachtelung mehr.

---

## 4 · Design-Richtung

**Vorbefüllter Design-Read für `design-taste-frontend`** (Lead-Skill, darf im Detail verfeinern, nicht umwerfen):

> „Reading this as: Marken-/Landingsite einer handwerklichen Allgäuer Dorfbrauerei für regionale
> Genießer, Festveranstalter und Firmen — warm, bodenständig, echt, mit ruhigem Selbstbewusstsein.
> Premium-Handwerk statt Craft-Beer-Hipster, statt Oktoberfest-Kitsch und statt Corporate."

**Dials:** `DESIGN_VARIANCE: 7 · MOTION_INTENSITY: 5 · VISUAL_DENSITY: 3`

**Materialwelt als Quelle für Palette & Typo:** Bier-Bernstein, Malz-Braun, Kupfer (Braukessel),
Hopfen-/Wiesengrün, Schaum-Creme, Scheunenholz. Farben und Schriften daraus ableiten —
**nicht** aus den üblichen LLM-Defaults (kein AI-Purple, kein Inter+Slate, kein Terrakotta-auf-Creme-Standard).

**Typografie:** Charaktervolle Display-Schrift mit Wärme + gut lesbare Textschrift.
**Keine Fraktur** (Kitsch-Falle), kein steriles Tech-Grotesk.

**Signature-Element** (eines wählen und richtig gut machen, Rest ruhig halten):
- die mobile Brauerei / der Anhänger als illustriertes Leitmotiv, oder
- Etiketten-Ästhetik (die individuellen Bieretiketten sind ein echtes Markenfeature), oder
- ein Hero, der Sudhaus/Handwerk atmosphärisch inszeniert (Foto/Video + Typo)

**Fotografie:** Echte Fotos schlagen alles. Vorhandene Bilder der alten Seite sind teils klein —
Originale beim Betreiber anfragen (→ `OFFENE-FRAGEN.md`).

**Tabu:** Brutalismus, Glassmorphism-Overkill, Stock-Foto-Optik, generische Drei-Karten-Feature-Reihen ohne Grund.

---

## 5 · Content & Tonalität

- Anrede: **konsequent „Ihr/Euch“** (passt zur Marke und zur Region) — Ausnahme Rechtstexte: „Sie“
- Kurze, konkrete, herzliche Sätze. Aktiv. Keine Marketing-Floskeln. Rechtschreibfehler der Altseite korrigieren
- Jeder CTA sagt, was passiert („Verleih anfragen“, „Seminar-Termin anfragen“), nicht „Absenden“
- **Keine Preise** auf der Website (sonst greift die PAngV inkl. Grundpreis €/Liter) → „im Brauereiverkauf“ / „auf Anfrage“. Falls der Betreiber Preise will: erst Preisangaben-Pflichten klären
- **Alkohol-Verantwortung:** Footer-Hinweis sinngemäß „Bitte genießt unser Bier verantwortungsvoll. Kein Alkohol an Personen unter 16 Jahren, Spirituosen (Bierbrand, Bierlikör) erst ab 18.“ Bildsprache nach Werberat-Regeln: keine Minderjährigen mit Alkohol, kein übermäßiger Konsum, keine Trinkaufforderung an Jugendliche

---

## 6 · Recht: Impressum & Datenschutz (DSGVO)

> ⚠️ **Regel:** Rechtstexte werden als fundierter **Entwurf** erstellt, sind aber **keine Rechtsberatung**.
> Am Ende von Phase 7 den Betreiber ausdrücklich darauf hinweisen, die Texte final prüfen zu
> lassen (Fachperson oder etablierter Generator). Keine Angaben erfinden — Platzhalter setzen.

### 6.1 Impressum (§ 5 DDG, § 18 Abs. 2 MStV)

- Anbieter: DEIN BIER M.Rink Brauerei, Inhaber Michael Rink (Einzelunternehmen — Rechtsform `[PLATZHALTER: bestätigen]`)
- Anschrift: Hausen 3, 87665 Mauerstetten
- Kontakt: Telefon + E-Mail (beides klickbar und **korrekt** als `tel:`/`mailto:` — Altseiten-Bug nicht wiederholen)
- USt-IdNr.: `[PLATZHALTER: vorhanden? Wenn ja, angeben]`
- Verantwortlich i. S. d. § 18 Abs. 2 MStV: Michael Rink, Anschrift wie oben (wegen News-Bereich)
- § 36 VSBG: Erklärung zur Verbraucherschlichtung (üblich: „nicht bereit und nicht verpflichtet“ — `[PLATZHALTER: bestätigen]`)
- **Kein Link zur EU-OS-Plattform** — die wurde Mitte 2025 eingestellt; alte Generator-Texte enthalten ihn noch. In Phase 7 per WebSearch den aktuellen Stand verifizieren

### 6.2 Datenschutzerklärung — Bausteine für genau diese statische Seite

1. **Verantwortlicher** (Daten wie Impressum)
2. **Hosting auf GitHub Pages** (GitHub, Inc., USA): Server-Logfiles inkl. IP-Adresse durch GitHub; Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherer Bereitstellung); Drittlandübermittlung USA → **per WebSearch verifizieren**, ob GitHub aktuell unter dem EU-U.S. Data Privacy Framework zertifiziert ist, und auf GitHubs Privacy Statement verweisen
3. **Keine Cookies, kein Tracking, keine Analyse-Tools** — ausdrücklich so benennen (das ist ein Vertrauens-Plus, ruhig selbstbewusst formulieren)
4. **Kontaktaufnahme** per E-Mail/Telefon: Verarbeitung zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO), Speicherdauer
5. **Externe Links** (Social Media, Verkaufsstellen, Routenplaner): Hinweis, dass beim Klick die Datenschutzbestimmungen der Zielseite gelten. Keine Social-Media-Embeds/Pixel auf der Seite selbst
6. **Betroffenenrechte:** Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerderecht — zuständige Aufsichtsbehörde: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Ansbach
7. **TLS/HTTPS**-Hinweis (GitHub Pages „Enforce HTTPS“ aktivieren)

### 6.3 Was die Architektur bereits erledigt

Keine Cookies, keine Einwilligungen nötig, keine externen Ressourcen, Fonts lokal, kein
Maps-/YouTube-Embed, Formulare als mailto. **Diese Eigenschaften sind Pflicht, nicht optional** —
jede Abweichung (z. B. Formulardienst) erfordert Rücksprache + Anpassung der Datenschutzerklärung.

---

## 7 · Phasenplan mit Skill-Mapping

> `full-output-enforcement` gilt **in allen Phasen**: immer vollständige Dateien liefern, nie „… Rest bleibt gleich“.
> `find-skills` nutzen, wenn unklar ist, welcher Skill passt. Bei Bugs: `superpowers:systematic-debugging`.

### Phase 0 — Audit & Content-Ernte
**Skills:** `redesign-existing-projects` (Audit-first!), `superpowers:brainstorming`
1. Alle Seiten der Altseite per WebFetch abrufen (Sitemap aus der Navigation in Abschnitt 1 ableiten, inkl. Unterseiten Verkaufsstellen, Leihinventar, Brauseminare, Ferienwohnung, News, Impressum, Datenschutz)
2. Sämtliche Texte, Bild-URLs, Fakten strukturiert nach `content/alt/` exportieren
3. `AUDIT.md` schreiben: Was funktioniert, was nicht, was wird übernommen/verworfen; bekannte Probleme aus Abschnitt 1 verifizieren
4. `OFFENE-FRAGEN.md` anlegen (erste Einträge: siehe Abschnitt 11)
**Review-Stopp.**

### Phase 1 — Brandkit
**Skills:** `brandkit`, `ui-ux-pro-max:brand`
Logo-Analyse (rundes Logo der Altseite), Farbwelt aus Abschnitt 4 konkretisieren, Schrift-Kandidaten
(lizenzfrei selbst hostbar, z. B. via Fontsource), Ton & Stimme festhalten → `BRAND.md` + `tokens` (CSS Custom Properties).

### Phase 2 — Design-Richtung & Wireframes
**Skills:** `design-taste-frontend` (**Lead**), `high-end-visual-design`, `ui-ux-pro-max:design`, `ui-ux-pro-max:design-system`
Design-Read + Dials aus Abschnitt 4 bestätigen/verfeinern, Token-System, Typo-Paar, Layoutkonzept
mit ASCII-Wireframes je Seitentyp, **ein** Signature-Element festlegen und begründen.
Selbstkritik-Pass: Würde dieses Konzept auch bei jedem anderen Brauerei-Brief entstehen? Dann überarbeiten.
→ `DESIGN.md`. **Review-Stopp — hier entscheidet der Betreiber mit.**

### Phase 3 — Umsetzungsplan
**Skills:** `superpowers:writing-plans`
Astro-Projektstruktur, Content-Collection-Schemata, Komponentenliste, Reihenfolge, Testbarkeit → `PLAN.md`.

### Phase 4 — Build
**Skills:** `superpowers:executing-plans`, `superpowers:subagent-driven-development` (bei Parallelarbeit zusätzlich `dispatching-parallel-agents` + `using-git-worktrees`), `emil-design-eng`, `ui-ux-pro-max:ui-styling`, `superpowers:test-driven-development` (für Utilities/Build-Skripte, z. B. Slug-/Datums-Helper), `image-to-code` (nur falls Screenshots/Mockups als Vorlage dienen)
Plan exakt umsetzen. Semantisches HTML, sichtbarer Fokus, responsive ab 360 px, CSS-Spezifität sauber halten.
Feature-Branches + aussagekräftige Commits.

### Phase 5 — Bilder, Medien, Social-Preview
**Skills:** `imagegen-frontend-web`, `imagegen-frontend-mobile` (beide **nur** für Texturen, Hintergründe, Platzhalter — niemals für „echte“ Brauerei-/Produktfotos, Authentizität geht vor), `ui-ux-pro-max:banner-design` (OG-Image / Social-Banner)
Bildpipeline (AVIF/WebP, Größenvarianten, alt-Texte), Video lokal einbinden, OG-/Twitter-Meta komplett.

### Phase 6 — Animation
**Skills:** `animation-vocabulary` → `find-animation-opportunities` → `improve-animations`
Ein orchestrierter Moment (z. B. Hero-Einstieg) schlägt zehn verstreute Effekte. Scroll-Reveals sparsam,
Hover-Mikrointeraktionen gezielt, alles hinter `prefers-reduced-motion`-Guard.
Danach den Betreiber bitten, 🔒 `review-animations` selbst aufzurufen.

### Phase 7 — Rechtstexte
**Skills:** keine — sorgfältige Handarbeit nach Abschnitt 6
Impressum + Datenschutzerklärung als Seiten umsetzen. **Pflicht:** per WebSearch aktuellen Stand
verifizieren (DDG-Pflichtangaben, Status OS-Plattform, GitHub-DPF-Zertifizierung) und Quellen in
einem Kommentar im Frontmatter notieren. Platzhalter in `OFFENE-FRAGEN.md` eintragen.
Abschließen mit dem Hinweis an den Betreiber: final juristisch prüfen lassen.

### Phase 8 — Qualitätssicherung
**Skills:** `superpowers:verification-before-completion`, `superpowers:requesting-code-review` + `receiving-code-review`
Komplette Checkliste aus Abschnitt 9 abarbeiten und Ergebnis dokumentieren (`QA.md`).
Falls ein Browser-/Playwright-Tool verfügbar ist: Screenshots Desktop + Mobile jeder Seite anfertigen und selbstkritisch bewerten.

### Phase 9 — Deployment
**Skills:** `superpowers:finishing-a-development-branch`
GitHub-Actions-Workflow für Astro → Pages (`.github/workflows/deploy.yml`), `CNAME`-Datei,
`sitemap.xml` + `robots.txt`, 404-Seite, JSON-LD (`schema.org/Brewery` mit Adresse, Geo, Öffnungszeiten).
`DEPLOY.md` für den Betreiber schreiben: Repo-Einstellungen (Pages → GitHub Actions, Enforce HTTPS),
DNS-Umstellung der Domain (A/ALIAS auf GitHub Pages, `www`-CNAME), Hinweis auf DNS-Propagation,
und was mit dem alten WordPress-Hosting passieren soll (kündigen erst nach erfolgreichem Umzug).

---

## 8 · Skill-Matrix

| Skill / Plugin | Phase | Rolle |
|---|---|---|
| `redesign-existing-projects` | 0 | Audit-first-Workflow für den Relaunch |
| `superpowers:brainstorming` | 0 | Konzept-Exploration |
| `brandkit`, `ui-ux-pro-max:brand` | 1 | Markenkern, Farben, Schriften, Tokens |
| `design-taste-frontend` | 2 | **Lead-Design-Skill** (Design-Read, Dials, Anti-Slop) |
| `high-end-visual-design` | 2 | Qualitätsanspruch/Feinschliff der Richtung |
| `ui-ux-pro-max:design`, `:design-system` | 2 | Systematisierung, Konsistenz |
| `superpowers:writing-plans` | 3 | Umsetzungsplan |
| `superpowers:executing-plans`, `:subagent-driven-development`, `:dispatching-parallel-agents`, `:using-git-worktrees` | 4 | Abarbeitung, ggf. parallel |
| `emil-design-eng`, `ui-ux-pro-max:ui-styling` | 4 | Design-Engineering, Styling-Qualität |
| `superpowers:test-driven-development` | 4 | Nur für Utilities/Build-Skripte |
| `image-to-code` | 4 | Nur bei Screenshot-/Mockup-Vorlagen |
| `imagegen-frontend-web`, `imagegen-frontend-mobile` | 5 | Nur Texturen/Hintergründe/Platzhalter |
| `ui-ux-pro-max:banner-design` | 5 | OG-/Social-Banner |
| `animation-vocabulary`, `find-animation-opportunities`, `improve-animations` | 6 | Animationskonzept + Umsetzung |
| 🔒 `review-animations` | 6 | Vom Betreiber selbst aufrufen |
| 🔒 `pick-ui-library` | 2 | Optional vom Betreiber bei der Stack-Entscheidung |
| `superpowers:verification-before-completion`, `:requesting-code-review`, `:receiving-code-review` | 8 | QS |
| `superpowers:systematic-debugging` | alle | Bei jedem Bug |
| `superpowers:finishing-a-development-branch` | 9 | Sauberer Abschluss |
| `full-output-enforcement` | alle | Immer vollständige Dateien |
| `find-skills` | alle | Wenn unklar, welcher Skill passt |

**Für dieses Projekt bewusst ruhen lassen** (nicht laden, im Skill-Panel idealerweise deaktivieren):

| Skill / Tool | Warum |
|---|---|
| `design-taste-frontend-v1` | Altes Duplikat des Lead-Skills — zwei Versionen gleichzeitig erzeugen Widersprüche |
| `gpt-taste`, `stitch-design-taste`, `minimalist-ui` | Konkurrierende Taste-Skills. Mehrere Geschmäcker gleichzeitig = Einheitsbrei. Ein Lead-Skill reicht |
| `industrial-brutalist-ui` | Brutalismus passt nicht zu einer herzlichen Allgäuer Handwerksbrauerei |
| `ui-ux-pro-max:slides` | Keine Präsentationen im Scope |
| `superpowers:writing-skills` | Erst nach dem Projekt relevant (siehe Empfehlungen) |
| Plugin `rust-analyzer-lsp` | Kein Rust im Projekt |
| Replit MCP | Nicht nötig — Hosting läuft über GitHub Pages |

---

## 9 · Definition of Done (Abnahme-Checkliste, Phase 8)

- [ ] **0 externe Requests** (Netzwerk-Tab leer bis auf eigene Domain), keine Cookies, kein Storage-Zugriff
- [ ] Fonts lokal + subsetted, `font-display: swap`
- [ ] Lighthouse ≥ 95 in Performance, Accessibility, Best Practices, SEO (mobil + Desktop)
- [ ] WCAG-Basics: Kontraste AA, sichtbarer Fokus, sinnvolle Überschriften-Hierarchie, alle Bilder mit `alt`, Tastatur-Navigation
- [ ] `prefers-reduced-motion` respektiert
- [ ] Responsive ab 360 px, keine horizontalen Scrollbalken
- [ ] Alle `mailto:`/`tel:`-Links korrekt (Altseiten-Bug!), alle internen + externen Links valide
- [ ] Impressum + Datenschutz von **jeder** Seite im Footer erreichbar
- [ ] Alkohol-Verantwortungshinweis im Footer
- [ ] Meta-Description je Seite, OG-Image, `sitemap.xml`, `robots.txt`, JSON-LD `Brewery`, `lang="de"`, Canonical
- [ ] Eigene 404-Seite
- [ ] `OFFENE-FRAGEN.md` aktuell und an den Betreiber übergeben
- [ ] `DEPLOY.md` vollständig (inkl. DNS-Anleitung)

---

## 10 · Offene Fragen an den Betreiber (Startbestand für `OFFENE-FRAGEN.md`)

1. Impressum: Rechtsform bestätigen, USt-IdNr. vorhanden?, § 36 VSBG-Erklärung bestätigen
2. Öffnungszeiten Brauereiverkauf (für Kontaktseite + JSON-LD)
3. Original-Fotos in hoher Auflösung (Brauerei, Biere, Seminare, Feste, Ferienwohnung)
4. Logo als Vektordatei (SVG/AI) vorhanden?
5. Aktuelle Bierliste + Beschreibungen bestätigen (Stammwürze/Alkoholgehalt angeben?)
6. Preise auf der Website ja/nein (Standard: nein, siehe Abschnitt 5)
7. Ferienwohnung: Ausstattung, Belegungsanfrage-Ablauf, ggf. Verweis auf Buchungsportal?
8. Zugriff/Zeitplan DNS-Umstellung der Domain, altes Hosting kündigen wann?

---

## 11 · Arbeitsregeln für Claude Code

1. Phasen strikt in Reihenfolge, Review-Stopps einhalten (mindestens nach Phase 0 und 2)
2. Skills beim Namen aufrufen, wenn sie nicht automatisch triggern
3. Niemals Fakten, Rechtsangaben oder Markendetails erfinden → `[PLATZHALTER]` + `OFFENE-FRAGEN.md`
4. Immer vollständige Dateien ausgeben (`full-output-enforcement`)
5. Jede Abweichung von Abschnitt 2 (Stack) oder 6.3 (Datenschutz-Architektur) nur nach Rückfrage
6. Vor „fertig“: `superpowers:verification-before-completion` — behaupte nichts, was du nicht geprüft hast
