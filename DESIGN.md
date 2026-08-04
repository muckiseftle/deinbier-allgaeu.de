# DESIGN.md — Gestaltungsrichtung DEIN BIER

**Phase 2** · Stand 03.08.2026 · Lead-Skill `design-taste-frontend`, ergänzt um
`high-end-visual-design`, `ui-ux-pro-max:design`, `ui-ux-pro-max:design-system`.
Grundlage: `AUDIT.md`, `BRAND.md`, PROJEKT.md §2–§4.

> **Dies ist der Review-Stopp, an dem der Betreiber mitentscheidet.**
> Abschnitt 14 listet die vier Punkte, die eine Entscheidung brauchen.

---

## 1 · Design Read

> **Reading this as:** Marken- und Landingsite einer handwerklichen Allgäuer Dorfbrauerei
> für regionale Genießer, Festveranstalter und Firmen, mit einer *Editorial-Heritage*-Sprache,
> leaning toward natives CSS mit Design-Tokens, einer altmodisch-warmen Serifenschrift
> und einem einzigen orchestrierten Bewegungsmoment.

**Modus:** Redesign, Variante **Overhaul**. Die visuelle Sprache wird vollständig neu gebaut,
Inhalt und Fakten kommen zu 100 % aus dem Altbestand. Die Informationsarchitektur ändert sich
bewusst (PROJEKT.md §3 gibt die neue Sitemap vor); der Verlust an Suchmaschinenrang wird über
Weiterleitungen aufgefangen (AUDIT.md §6).

**Der Ist-Zustand als Ausgangspunkt** (aus dem Audit abgelesen):
Die Altseite läuft ungefähr auf `DESIGN_VARIANCE 3 / MOTION_INTENSITY 2 / VISUAL_DENSITY 6`.
Symmetrische Divi-Raster, kaum Bewegung, viel gestapelter Text ohne Luft.

---

## 2 · Dials

PROJEKT.md §4 gibt vor: `DESIGN_VARIANCE: 7 · MOTION_INTENSITY: 5 · VISUAL_DENSITY: 3`.
**Nach dem Design-Read bestätigt, mit einer Präzisierung.**

| Dial | Wert | Begründung |
|---|---|---|
| `DESIGN_VARIANCE` | **7** | Bestätigt. Asymmetrie ja, Chaos nein. Eine Brauerei, die Vertrauen verkauft, darf nicht wirken, als hätte eine Agentur sich ausgetobt. 7 heißt: versetzte Ränder, ungleiche Spalten (7/5 statt 6/6), unterschiedliche Bildformate, großzügige Leerzonen. Keine Masonry-Wände, keine gedrehten Elemente. |
| `MOTION_INTENSITY` | **5** | Bestätigt, aber **konzentriert statt verteilt**. Ein einziger orchestrierter Moment (die Einfahrt im Hero), danach sparsame Scroll-Einblendungen und gezielte Hover-Reaktionen. Kein Parallax, kein Scroll-Hijack, keine Endlosschleifen. Siehe Abschnitt 10. |
| `VISUAL_DENSITY` | **3** | Bestätigt. Die Altseite erstickt an Dichte. Abschnittsabstände von 3,5 rem mobil bis 8 rem am Desktop. Der teuerste Gestaltungsstoff ist hier Leere. |

**Konsequenz aus `VARIANCE 7`:** Zentrierte Hero-Anordnungen sind ausgeschlossen. Der Hero wird
asymmetrisch geteilt.

---

## 3 · Stack-Entscheidung: natives CSS mit Tokens

PROJEKT.md §2 lässt Tailwind v4 **oder** natives CSS zu und verlangt eine Entscheidung.

### Empfehlung: **natives CSS mit Design-Tokens**, keine Utility-Bibliothek

**Warum:**

1. **Die Tokens existieren bereits.** `src/styles/tokens.css` hält 144 Custom Properties. Mit
   Tailwind würden wir sie ein zweites Mal als Theme abbilden und dann in den Vorlagen
   überwiegend als beliebige Werte (`[--db-...]`) wieder herausschreiben. Zwei Wahrheiten, eine
   Fehlerquelle.
2. **Astro liefert die Kapselung frei Haus.** `<style>` in einer `.astro`-Datei ist automatisch
   auf die Komponente begrenzt. Das ist genau der Vorteil, den Utility-Klassen erkaufen sollen,
   nur ohne die Klassenketten im Markup.
3. **Das Design ist eigenwillig, nicht komponentenförmig.** Etikettenrahmen, Wegstrecke,
   Wagen-Motiv, Bierdeckel-Karten. Nichts davon fällt aus einer Utility-Bibliothek heraus.
4. **Weniger Abhängigkeiten, weniger Bauwerk.** Kein PostCSS-Plugin, keine Tailwind-Version, die
   in zwei Jahren einen Umstieg erzwingt. Für eine Seite, die ein Brauer sechs Jahre lang mit
   drei Änderungen pro Jahr pflegen soll, zählt das mehr als Tippgeschwindigkeit.
5. **Zielwert Lighthouse ≥ 95:** Handgeschriebenes CSS für zehn Seiten landet realistisch bei
   14 bis 20 KB. Das ist gut genug, um sich um alles andere keine Sorgen machen zu müssen.

**Was dagegen spricht (ehrlich benannt):** Tailwind wäre beim Schreiben schneller, und die
Aufräumfunktion liefert ebenfalls kleine Dateien. Wer die Seite später erweitert und Tailwind
gewohnt ist, findet sich dort schneller zurecht. Bei einer Seite mit zehn Routen und einer
Handvoll wiederkehrender Bausteine wiegt das die vier Punkte oben nicht auf.

### Was stattdessen gebaut wird

```
src/styles/
  tokens.css        Grundwerte, semantische Werte, Komponentenwerte (drei Ebenen)
  reset.css         moderner Reset, Fokus-Sichtbarkeit, Sprungmarke
  base.css          Grundtypografie, Satzregeln, deutsche Silbentrennung
  layout.css        Container, Raster, Abschnittsrhythmus, Hilfsklassen (max. 12 Stück)
```

Alles Weitere lebt in den jeweiligen Astro-Komponenten.

### Abweichungen von den Skill-Vorgaben, bewusst und begründet

| Skill-Vorgabe | Hier | Warum |
|---|---|---|
| `design-taste-frontend` §3.A: React/Next + Tailwind + Motion | **Astro + natives CSS** | PROJEKT.md §2 legt Astro fest. Nutzeranweisung schlägt Skill-Standard. Motion (die Bibliothek) wird nicht gebraucht, weil kein Bewegungsmoment JavaScript-Physik benötigt. |
| `design-taste-frontend` §6.C: Dark Mode verpflichtend | **nur helle Fassung** | Zur Entscheidung gestellt, siehe Abschnitt 14.2. |
| `high-end-visual-design` §4.B: Knöpfe als volle Pillen | **Radius 8 px** | Volle Pillen sind die Formensprache von SaaS-Produkten. Ein Stempel mit leicht gebrochenen Ecken passt zu einer Brauerei mit Etiketten und Bierdeckeln. Die Formkonsistenz bleibt gewahrt (Abschnitt 6.4). |
| `design-taste-frontend` §9.G: Gedankenstrich vollständig verboten | **im Website-Text übernommen, in dieser Dokumentation eingeschränkt** | Die Regel zielt auf den englischen Em-Dash als KI-Manierismus. Im Deutschen ist der Halbgeviertstrich als Gedankenstrich orthografisch korrekt; ihn durch einen Bindestrich zu ersetzen wäre schlicht falsch gesetzt. **Auf der Website gilt:** kein Gedankenstrich in Überschriften, Etiketten, Knopfbeschriftungen, Bildunterschriften und Zitaten, im Fließtext höchstens einer je Absatz und nur, wo Komma oder Punkt nicht tragen. |

---

## 4 · Typografie: endgültige Festlegung

### Entscheidung: **Vollkorn Variable** (Display) + **Work Sans Variable** (Text)

Beide gegen die Fontsource-Registry und die Fontsource-API geprüft:

| Rolle | Schrift | Paket | Lizenz | Achsen |
|---|---|---|---|---|
| Display | **Vollkorn** | `@fontsource-variable/vollkorn` v5.3.0 | OFL-1.1 | `wght` 400–900, normal + kursiv |
| Text | **Work Sans** | `@fontsource-variable/work-sans` v5.3.0 | OFL-1.1 | `wght` 100–900, normal + kursiv |

Beide bringen den Subset `latin` mit, der ä ö ü Ä Ö Ü ß vollständig enthält.

### Warum Vollkorn und nicht die Empfehlung aus Phase 1

Phase 1 hatte **Fraunces** vorgeschlagen. Der Lead-Skill führt Fraunces zusammen mit
Instrument Serif ausdrücklich als die beiden Serifenschriften, zu denen Sprachmodelle
reflexhaft greifen, und verbietet sie als Standardwahl. Das ist ein berechtigter Einwand:
Fraunces steckt inzwischen unter jeder zweiten „handwerklichen" Marke.

**Vollkorn ist die bessere Wahl, und zwar nicht nur als Ausweichlösung:**

1. **Der Name.** Vollkorn. Bei einer Brauerei, deren Rohstoff gemälztes Getreide ist und deren
   Chefin Malzgelee herstellt, ist das keine Spielerei, sondern eine Passung.
2. **Die Bauart.** Vollkorn ist eine kräftige, leicht raue Renaissance-Antiqua mit spürbarem
   Strichkontrast und massiven Serifen. Genau das Skelett, das die Wortmarke im Logo hat,
   ohne sie nachzubauen.
3. **Sie hält großen Grad aus.** Bei 104 px im Hero bleibt sie fest und ruhig, statt wie eine
   Didone dünn zu werden.
4. **Sie ist kein Standardgriff.** Weder in der KI-Modeliste noch in der Schriftmode der
   Craft-Beer-Szene.
5. **Der Gewichtsbereich beginnt bei 400.** Keine dünnen Schnitte, die man ohnehin nicht
   verwenden dürfte. Genutzt werden 600 und 700 für Überschriften, 400 kursiv für Zitate.

Work Sans darunter bleibt wie in Phase 1: humanistisch, leicht schmal, freundlich, tritt zurück.
Kein Inter, kein Geist. Ein Tech-Grotesk würde die Wärme wieder herausziehen, die Vollkorn
hereinbringt.

**Vollkorn ist keine Fließtextschrift.** Sie bekommt Überschriften, Vorspänne, Zitate,
Zahlenauszeichnungen und die Signaturzeile. Alles andere ist Work Sans.

### Auszeichnung im Fließtext

Betonung erfolgt **kursiv oder fett in derselben Familie**, nie durch Wechsel zwischen Vollkorn
und Work Sans mitten in einer Zeile. Gemischte Familien innerhalb einer Überschrift sind das
sicherste Erkennungszeichen für Laienarbeit.

**Kursive Unterlängen:** Vollkorn kursiv hat ausgeprägte Unterlängen bei `g j p q y`. In
Displaygraden gilt daher `line-height: 1.12` als Minimum und zusätzlich `padding-bottom: 0.08em`
am umschließenden Element. Wörter wie „gebraut" oder „Genuss" kursiv in einer Zeile mit
`line-height: 1` würden unten abgeschnitten.

---

## 5 · Token-Architektur: drei Ebenen

`ui-ux-pro-max:design-system` verlangt Grundwert → semantischer Wert → Komponentenwert.
Die ersten beiden Ebenen stehen seit Phase 1. Phase 2 ergänzt die dritte.

```
Grundwert        --db-malz-700: #523816
      ↓
Semantik         --db-aktion-flaeche: var(--db-malz-700)
      ↓
Komponente       --knopf-primaer-flaeche: var(--db-aktion-flaeche)
```

**Regel:** Komponenten greifen **ausschließlich** auf Komponentenwerte zu. Kein Hexwert und
keine Pixelangabe steht irgendwo außerhalb von `tokens.css`.

Die Komponentenebene deckt ab: Kopfzeile, Knopf (drei Ausprägungen), Karte, Etikettenrahmen,
Bierkarte, Terminzeile, Fußzeile, Altersabfrage, Sprungmarke. Umgesetzt in `tokens.css`,
Abschnitt 11.

---

## 6 · Layoutsystem

### 6.1 Raster und Container

| Wert | Größe |
|---|---|
| Inhaltsbreite | `72rem` (1152 px) |
| Breites Band | `84rem` (1344 px), für Bildbänder |
| Textspalte | `34rem` (544 px), rund 68 Zeichen |
| Seitenrand | `clamp(1.25rem, 0.9rem + 1.8vw, 2.5rem)` |
| Raster | 12 Spalten, Rinne `1.5rem` |
| Bruchpunkte | 480 · 768 · 1024 · 1100 · 1280 |

**CSS Grid, nirgends Flexbox-Prozentrechnung.** Asymmetrische Teilungen sind **7/5** oder
**8/4**, niemals 6/6. Das ist der sichtbare Unterschied zwischen `VARIANCE 3` und `VARIANCE 7`.

### 6.2 Abschnittsrhythmus

Oben `clamp(3.5rem, 2.5rem + 5vw, 7rem)`, unten `clamp(4rem, 2.8rem + 6vw, 8rem)`.
Unten bewusst mehr als oben: optisch gleicher Abstand verlangt unten etwas mehr, sonst wirkt
der Abschnitt kopflastig.

### 6.3 Abschnittsfamilien

Der Lead-Skill verlangt: keine Layoutfamilie zweimal, mindestens vier verschiedene auf acht
Abschnitten. Die Startseite hat neun Abschnitte und nutzt **acht** Familien:

| # | Familie | Wo |
|---|---|---|
| A | Asymmetrischer Hero, 7/5 | Hero |
| B | Vollbreites Bildband, Text im unteren Drittel | Die Brauerei |
| C | Bento mit exakter Zellenzahl | Die Biere (5 Biere, 5 Zellen) |
| D | Zwei-Spalten-Wechsel | Brauseminare (in der Brauerei / bei Euch daheim) |
| E | Dunkles Zitatband, vollflächig | Zitat aus dem Seminarbericht |
| F | Karten-Raster mit Bild, 2 Spalten | Events & Verleih |
| G | Textspalte mit versetztem Hochformatbild | Ferienwohnung |
| H | Gruppierte Ortsliste, 3 Spalten | Verkaufsstellen |
| I | Waagerechter Beitragsstreifen, 3 Karten | News |

**Zickzack-Deckel eingehalten:** Familie D ist die einzige Bild-Text-Wechselstrecke und
erscheint genau einmal. Familie G ist ein einzelner versetzter Block, keine Wechselstrecke.

**Etikettenzeilen (Eyebrows):** neun Abschnitte erlauben höchstens drei. Vergeben an
**Hero** („zu Hause(n) gebraut"), **Die Biere** („Fünf Biere") und **News** („Aus der Brauerei").
Alle übrigen Abschnitte beginnen direkt mit der Überschrift.

### 6.4 Formkonsistenz

Eine dokumentierte Regel, überall gleich:

| Element | Radius |
|---|---|
| Knöpfe, Eingabefelder, kleine Marken | `8px` |
| Bilder, Bildkacheln | `8px` |
| Karten, Etikettenrahmen | `14px` |
| Große Bildbänder, Hero-Bild | `22px` |
| Signet, runde Marken | voll rund |

Keine Pillen. Keine gemischten Systeme außerhalb dieser Tabelle.

### 6.5 Der Etikettenrahmen (verschachtelte Fassung)

`high-end-visual-design` verlangt für hochwertige Karten eine doppelte Fassung statt einer
flachen Fläche. Das trifft sich hier mit der Marke: Ein Bieretikett *ist* ein Rahmen im Rahmen.

```
┌─────────────────────────────────────┐  Aussenschale
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  Fläche  --db-sand-200
│ ░ ┌───────────────────────────────┐ │  Haarlinie 1px --db-holz-500 (32 % Deckkraft)
│ ░ │                               │ │  Radius 14px, Innenabstand 6px
│ ░ │   Innenkern                   │ │
│ ░ │   Fläche  --db-creme-50       │ │  Radius 8px = 14px minus 6px
│ ░ │   Innenglanz oben 1px         │ │  konzentrische Rundung
│ ░ │                               │ │
│ ░ └───────────────────────────────┘ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────┘
```

Eingesetzt bei: Bierkarten, dem Hero-Bild, den Etikettenbeispielen auf `/brauseminare/`.
**Nicht** bei News-Karten und nicht bei den Verkaufsstellen. Sonst wird aus einem Kunstgriff
eine Tapete.

---

## 7 · Das Signature-Element: die Wegstrecke und der Wagen

Aus `BRAND.md` §8 übernommen und hier ausgearbeitet.

### 7.1 Was es ist

Der **Pritschenwagen mit dem Fass**, freigelegt aus dem Logo, als Strichzeichnung. Dazu die
**Wegstrecke**: eine feine waagerechte Linie, auf der der Wagen steht.

### 7.2 Warum genau dieses

| Prüffrage | Antwort |
|---|---|
| Stammt es aus dieser Marke? | Ja. Seit 2016 im Logo. Nicht erfunden, sondern freigelegt. |
| Beschreibt es das Geschäftsmodell? | Ja. Die mobile Brauerei ist der USP. Eine ortsfeste Brauerei könnte den Wagen nicht verwenden, ohne zu lügen. |
| Trägt es über die ganze Seite? | Ja. Er fährt (Hero), er steht am Weg (Abschnittswechsel), er ist leer (404), er zeigt die Richtung (Seminare in der Brauerei oder bei Euch). |
| Funktioniert es ohne die fehlenden Fotos? | Ja. Es ist eine Zeichnung. Es funktioniert ab dem ersten Tag. |

### 7.3 Wo es auftritt, und wo nicht

**Auftritt (fünfmal auf der ganzen Seite, nicht öfter):**

1. **Hero:** der Wagen fährt einmal von links herein und hält. Der eine orchestrierte Moment.
2. **Abschnittswechsel Startseite:** die Wegstrecke als Haarlinie, der Wagen als kleines Zeichen
   darauf. Genau **dreimal** auf der Startseite, nicht zwischen jedem Abschnitt.
3. **`/brauseminare/`:** der Wagen als Weiche zwischen „in der Brauerei" und „bei Euch daheim".
4. **404:** der Wagen mit leerer Ladefläche.
5. **Fußzeile:** die Wegstrecke als oberer Abschluss, ohne Wagen.

**Kein Auftritt:** auf Rechtstexten, in News-Beiträgen, auf `/verkaufsstellen/`, als
Aufzählungszeichen, als Ladeanzeige, als Cursor.

### 7.4 Umsetzung

Als **eingebettetes SVG** in `--db-malz-700`, aus der Logo-Vektordatei abgeleitet.
Bis diese vorliegt (offene Frage 16), wird eine vereinfachte Fassung **nach der Silhouette des
PNG nachgezeichnet** und beim Eintreffen der Originaldatei ersetzt.

Das ist ausdrücklich der einzige handgezeichnete Vektor im Projekt. Der Lead-Skill verbietet
selbst gezeichnete SVGs als Regel; die Ausnahme greift hier, weil es sich nicht um eine
Illustration handelt, sondern um ein Markenzeichen des Kunden. Alle übrigen Symbole kommen aus
Phosphor Icons, Strichstärke durchgehend 1,5 px.

---

## 8 · Wireframes

Zeichenlegende: `▓` Bild · `░` getönte Fläche · `▬` Knopf · `···` Haarlinie ·
`≈` Wegstrecke · `⌂` Wagen-Signet

### 8.1 Kopfzeile (auf jeder Seite)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ◉ DEIN BIER    Brauerei  Biere  Brauseminare  Events & Verleih            │
│  64px Logo       Ferienwohnung  Verkaufsstellen  News          [ Kontakt ] │
└────────────────────────────────────────────────────────────────────────────┘
   Höhe 72px · eine Zeile ab 1100px · darunter Menüknopf
   Nicht klebend beim Abwärtsscrollen, erscheint beim Aufwärtsscrollen wieder
   Aktive Seite: Vollkorn 600 + 2px Unterstrich in --db-hopfen-700
```

Sieben Punkte, keine Verschachtelung. Der Menüknopf greift bei **1100 px**, nicht erst bei
1024 px: Die deutschen Labels sind lang, und eine zweizeilige Navigation ist ein Baufehler.

Mobiles Menü: vollflächige Überlagerung in `--db-creme-50`, Einträge blenden gestaffelt ein
(70 ms Versatz), Menüsymbol verwandelt sich fließend in ein Kreuz.

### 8.2 Startseite

```
╔════════════════════════════════════════════════════════════════════════════╗
║  A · HERO                                              7 Spalten / 5       ║
║                                                                            ║
║   zu Hause(n) gebraut                       ┌────────────────────────┐     ║
║   ─────────────────────                     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     ║
║                                             │▓ Anhänger mit der    ▓│     ║
║   Die Brauerei                              │▓ Brauanlage,         ▓│     ║
║   kommt zu Euch.                            │▓ aufgebaut auf       ▓│     ║
║   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                         │▓ einem Fest          ▓│     ║
║   Vollkorn 700, 104px                       │▓ 1400 × 1050         ▓│     ║
║                                             │▓ Etikettenrahmen     ▓│     ║
║   Kleine Brauerei aus Hausen im             └────────────────────────┘     ║
║   Ostallgäu. Sie passt auf einen                                           ║
║   Anhänger und kommt zu Eurem Fest.          warmes Bernsteinlicht         ║
║   (19 Wörter, 3 Zeilen)                      radial dahinter               ║
║                                                                            ║
║   ▬ Seminar anfragen ▬   Unsere Biere                                      ║
║                                                                            ║
║   ⌂ fährt einmal von links herein und hält                                 ║
╚════════════════════════════════════════════════════════════════════════════╝

  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈⌂≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   Wegstrecke 1 von 3

┌────────────────────────────────────────────────────────────────────────────┐
│  B · DIE BRAUEREI                                     vollbreites Band     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ▓  Brauscheune von aussen, Abendlicht, 2400 × 1000                     ▓ │
│  ▓                                                                      ▓ │
│  ▓   Klein, aber grossartig.                        Text im unteren     ▓ │
│  ▓   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                          Drittel, auf einer  ▓ │
│  ▓   Wer in Hausen die Brauscheune betritt,         Abdunklung aus      ▓ │
│  ▓   könnte sich für einen Moment in                --db-nacht-900      ▓ │
│  ▓   Düsentriebs Entenhausen wähnen.                bei 72 %            ▓ │
│  ▓                                                                      ▓ │
│  ▓   Mehr über uns  →                                                   ▓ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  C · DIE BIERE                              Bento, 5 Inhalte = 5 Zellen    │
│                                                                            │
│  Fünf Biere                                                                │
│  Was bei uns im Tank liegt.                                                │
│                                                                            │
│  ┌──────────────────────────┐ ┌────────────┐ ┌────────────┐                │
│  │ ░ ┌──────────────────┐ ░ │ │ ░┌───────┐░│ │ ░┌───────┐░│                │
│  │ ░ │ ▓ Helles         │ ░ │ │ ░│▓Weizen│░│ │ ░│▓ Bock │░│                │
│  │ ░ │ ▓ Flasche gross  │ ░ │ │ ░│▓      │░│ │ ░│▓      │░│                │
│  │ ░ │   Der Klassiker  │ ░ │ │ ░│Sommer │░│ │ ░│       │░│                │
│  │ ░ └──────────────────┘ ░ │ │ ░└───────┘░│ │ ░└───────┘░│                │
│  └──────────────────────────┘ └────────────┘ └────────────┘                │
│         6 Spalten                 3              3                         │
│  ┌────────────────┐ ┌────────────────────────────────────────┐             │
│  │ ░┌───────────┐░│ │ ░┌────────────────────────────────────┐░│            │
│  │ ░│▓Festbier  │░│ │ ░│▓ Klosterkeller                     │░│            │
│  │ ░│▓          │░│ │ ░│  Gebraut für die Erzabtei          │░│            │
│  │ ░└───────────┘░│ │ ░│  St. Ottilien                      │░│            │
│  └────────────────┘ └────────────────────────────────────────┘             │
│         4 Spalten                  8 Spalten                               │
│                                                                            │
│  Dazu Bierbrand, Likör und Malzgelee.  Alle Produkte  →                    │
└────────────────────────────────────────────────────────────────────────────┘
   Genau 5 Zellen für 5 Biere. Keine leere Kachel. Ungleiche Grössen.
   Zwei Zellen tragen ein Foto, drei eine getönte Fläche mit Flaschengrafik.

  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈⌂≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   Wegstrecke 2 von 3

┌────────────────────────────────────────────────────────────────────────────┐
│  D · BRAUSEMINARE                                     Zwei-Spalten-Wechsel │
│                                                                            │
│  Eure Gäste werden Brauer.                                                 │
│                                                                            │
│  ┌───────────────────────────┐        ┌───────────────────────────┐        │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │        │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │        │
│  │ ▓ Seminar in der Scheune ▓ │        │ ▓ Anhänger beim Kunden  ▓ │        │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │        │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │        │
│  │                           │        │                           │        │
│  │ In der Brauerei           │   ⌂    │ Oder bei Euch daheim      │        │
│  │ Fünf bis sechs Stunden,   │  Weiche│ Wir brauchen Kraftstrom,  │        │
│  │ mindestens fünf Leute,    │        │ Wasser, Abfluss und       │        │
│  │ Brotzeit ist dabei.       │        │ 15 Quadratmeter.          │        │
│  └───────────────────────────┘        └───────────────────────────┘        │
│                                                                            │
│                     ▬ Seminar anfragen ▬                                   │
└────────────────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════════════════╗
║  E · ZITATBAND                     vollflächig dunkel --db-nacht-900       ║
║                                                                            ║
║        „Man sieht, was drinsteckt.                                         ║
║         An Grundstoffen und an Arbeit."                                    ║
║        ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                                  ║
║        Vollkorn 400 kursiv, --db-stroh-300, 3 Zeilen max.                  ║
║                                                                            ║
║        Ein Teilnehmer beim Brauseminar                                     ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
   Der einzige dunkle Abschnitt der Seite. Vollflächig und grosszügig,
   damit er als Zäsur gelesen wird und nicht als Kopierfehler.

┌────────────────────────────────────────────────────────────────────────────┐
│  F · EVENTS & VERLEIH                             Karten-Raster 2 Spalten  │
│                                                                            │
│  Ihr feiert. Wir liefern.                                                  │
│                                                                            │
│  ┌────────────────────────────┐   ┌────────────────────────────┐           │
│  │ ▓▓▓▓ Zirkuszelt ▓▓▓▓▓▓▓▓▓▓ │   │ ▓▓▓▓ Brauereigarten ▓▓▓▓▓▓ │           │
│  │                            │   │                            │           │
│  │ Leihinventar               │   │ Feiern in der Brauerei     │           │
│  │ Zelt mit 12 Metern         │   │ Brauereigarten, Festraum,  │           │
│  │ Durchmesser, Garnituren,   │   │ externes Catering möglich. │           │
│  │ Zapfanlage, Grill.         │   │                            │           │
│  │                            │   │                            │           │
│  │ ▬ Verleih anfragen ▬       │   │ ▬ Feier anfragen ▬         │           │
│  └────────────────────────────┘   └────────────────────────────┘           │
│      Knöpfe unten bündig, unabhängig von der Textlänge                     │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  G · FERIENWOHNUNG                        Textspalte + versetztes Hochbild │
│                                                                            │
│                              ┌──────────────────┐  Bild ragt 3rem über     │
│   Schlafen über              │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  den Abschnittsrand      │
│   der Brauerei.              │▓ Ferienwohnung  ▓│  hinaus (negativer       │
│   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔            │▓ Balkon, 4:5    ▓│  Aussenabstand)          │
│                              │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                          │
│   Landhof Eselblick.         │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                          │
│   Drei Schlafzimmer,         └──────────────────┘                          │
│   Sichtdachstuhl, Blick                                                    │
│   in die Allgäuer Alpen.                                                   │
│                                                                            │
│   Zur Ferienwohnung  →                                                     │
└────────────────────────────────────────────────────────────────────────────┘

  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈⌂≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   Wegstrecke 3 von 3

┌────────────────────────────────────────────────────────────────────────────┐
│  H · VERKAUFSSTELLEN                     gruppierte Ortsliste, 3 Spalten   │
│                                                                            │
│  Wo es DEIN BIER gibt                                                      │
│                                                                            │
│  ┌ Ab Hof ────────────┐ ┌ Ostallgäu ─────────┐ ┌ Unterallgäu ───────┐      │
│  │ Hausen 3           │ │ Reisach Früchte-   │ │ Stockheimer        │      │
│  │ Samstag 10 bis 12  │ │ garten             │ │ Landmarkt          │      │
│  │                    │ │ Dorfladen Waal     │ │ Getränke Hoetzl    │      │
│  │ ▬ Route planen ▬   │ │ Dorfladen Eggenthal│ │ Reinspaziert       │      │
│  │                    │ │ Corona Kinoplex    │ │ ...                │      │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘      │
│                                                                            │
│  Alle 16 Verkaufsstellen  →                                                │
└────────────────────────────────────────────────────────────────────────────┘
   Gruppiert nach Region statt 16 Zeilen mit Haarlinie darunter.
   Auf der Startseite nur die Gruppen, die volle Liste auf der Unterseite.

┌────────────────────────────────────────────────────────────────────────────┐
│  I · NEWS                                   waagerechter Streifen, 3 Karten│
│                                                                            │
│  Aus der Brauerei                                          Alle News  →    │
│                                                                            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                   │
│  │ 24. Juli 2026 │  │ 17. Juni 2026 │  │ 17. Juni 2026 │                   │
│  │ 10 Jahre      │  │ Das kleine    │  │ Weizenbier    │                   │
│  │ DEIN BIER     │  │ Fässchen      │  │ ist wieder da │                   │
│  │               │  │               │  │               │                   │
│  │ Weiterlesen   │  │ Weiterlesen   │  │ Weiterlesen   │                   │
│  └───────────────┘  └───────────────┘  └───────────────┘                   │
└────────────────────────────────────────────────────────────────────────────┘
```

**Mobil (unter 768 px):** Jeder Abschnitt fällt auf eine Spalte. Das Bento wird zu fünf
gestapelten Karten, der Zwei-Spalten-Wechsel zu zwei Blöcken untereinander (die Weiche
verschwindet), das versetzte Hochbild verliert den negativen Aussenabstand, der Beitragsstreifen
wird zu einer waagerecht wischbaren Reihe mit Einrastpunkten.

### 8.3 Themenseite (`/brauerei/`, `/brauseminare/`, `/ferienwohnung/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  SEITENKOPF                                              8 Spalten / 4     │
│                                                                            │
│  Die Brauerei                        ┌──────────────────────┐              │
│  ▔▔▔▔▔▔▔▔▔▔▔▔                        │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│              │
│  Vollkorn 700, 53px                  │▓  Leitbild 4:3      ▓│              │
│                                      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│              │
│  Ein Satz Vorspann, der die          └──────────────────────┘              │
│  Seite in einem Atemzug erklärt.                                           │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  FLIESSTEXT                                     Textspalte 34rem, versetzt │
│                                                                            │
│      Historie                                                              │
│      Als gelernter Brauer und Braumeister hat sich bei mir beruflich       │
│      schon immer alles um das Thema Bier gedreht. …                        │
│                                                                            │
│      ┌────────────────────────────────────────────┐                        │
│      │ Kupfer-Initiale am Absatzanfang der        │  ein gestalterisches   │
│      │ Anekdote. Genau einmal je Seite.           │  Ereignis, nicht mehr  │
│      └────────────────────────────────────────────┘                        │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  ZAHLENBAND                                          4 Spalten, ohne Karten│
│                                                                            │
│   2016            9 bis 11 °C        4 Wochen         1516                 │
│   ▔▔▔▔            ▔▔▔▔▔▔▔▔▔▔         ▔▔▔▔▔▔▔▔         ▔▔▔▔                 │
│   Brauereigebäude Gärtemperatur      Mindestlagerung  Reinheitsgebot       │
│   eröffnet                                                                 │
│                                                                            │
│   Vollkorn 700 für die Zahl, Work Sans 400 für die Erklärung.              │
│   Keine Kartenrahmen. Trennung durch Leerraum und eine Haarlinie oben.     │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  BILDREIHE                                    versetzte Höhen, 3 Bilder    │
│  ┌────────┐        ┌────────┐                                              │
│  │▓▓▓▓▓▓▓▓│        │▓▓▓▓▓▓▓▓│   ┌────────┐   Verschiedene Seitenverhält-   │
│  │▓ 4:5  ▓│        │▓ 1:1  ▓│   │▓▓▓▓▓▓▓▓│   nisse und Höhenversätze,      │
│  │▓▓▓▓▓▓▓▓│        │▓▓▓▓▓▓▓▓│   │▓ 3:2  ▓│   statt drei gleicher Kacheln   │
│  └────────┘        └────────┘   │▓▓▓▓▓▓▓▓│                                 │
│                                 └────────┘                                 │
│  Bildunterschriften stehen UNTER dem Bild, nie darüber gelegt.             │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  ABSCHLUSS-AUFFORDERUNG                                     Fläche sand-200│
│                                                                            │
│      Fragen? Ruft an.                                                      │
│      ▬ 0151 28776077 ▬     ▬ Seminar anfragen ▬                            │
│      Telefon direkt          vorbefüllte E-Mail                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Katalogseite (`/biere/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  SEITENKOPF                                                                │
│  Unsere Biere                                                              │
│  Fünf Sorten, dazu Bierbrand, Likör und Malzgelee.                         │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  BIER 1 von 5                                       abwechselnd 5/7 und 7/5│
│  ┌──────────────┐                                                          │
│  │ ░┌─────────┐░│   Helles                                                 │
│  │ ░│ ▓       │░│   ▔▔▔▔▔▔                                                 │
│  │ ░│ ▓Flasche│░│   Dem Klassiker verleihen ausgesuchte Malze eine         │
│  │ ░│ ▓  4:5  │░│   goldgelb glänzende Farbe und einen malzaromatischen    │
│  │ ░└─────────┘░│   Charakter. Dreimal gehopft, frisch und prickelnd.      │
│  └──────────────┘                                                          │
│   Etikettenrahmen   ┌ Gebinde ──────────────────────────────────┐          │
│                     │ 16er Holzträger · 6er Träger 0,3 l ·      │          │
│                     │ Fass 10 / 20 / 30 / 50 l · 5-l-Dose       │          │
│                     └───────────────────────────────────────────┘          │
│                     Marken in --db-sand-200, Radius 8px, kein Preis        │
└────────────────────────────────────────────────────────────────────────────┘
   … Bier 2 spiegelverkehrt, Bier 3 wie Bier 1, und so fort.
   Nach dem dritten Bier bricht ein vollbreites Foto die Wechselstrecke auf,
   damit der Zickzack-Deckel eingehalten bleibt.

┌────────────────────────────────────────────────────────────────────────────┐
│  WEITERE PRODUKTE                                    Bento, 6 Inhalte      │
│  Bierlikör · Bruier Fuier · Malzgelee · Geschenkkörbe · Winterzicke · Glühbi│
│  Genau 6 Zellen, zwei davon doppelt breit.                                 │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  HINWEIS                                                                   │
│  Preise im Brauereiverkauf. Samstag 10 bis 12 Uhr, Hausen 3.               │
│  ▬ Verkaufsstellen ▬                                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

### 8.5 Verkaufsstellen (`/verkaufsstellen/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Wo es DEIN BIER gibt                                                      │
│  Sechzehn Verkaufsstellen im Allgäu, dazu der Verkauf ab Hof.              │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  AB HOF                                            hervorgehoben, 8 Spalten│
│  ┌──────────────────────────────────────────────────────────┐             │
│  │ ░  Brauereiverkauf                                        │             │
│  │ ░  Hausen 3, 87665 Mauerstetten                           │             │
│  │ ░  Samstag 10:00 bis 12:00 Uhr                            │             │
│  │ ░  Ausserhalb: einfach an der Bierklingel klingeln.       │             │
│  │ ░  ▬ Route planen ▬   ▬ 0151 28776077 ▬                   │             │
│  └──────────────────────────────────────────────────────────┘             │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  NACH ORT GRUPPIERT                              Kartenraster, 3 Spalten   │
│                                                                            │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│  │ Reisach          │ │ Dorfladen Waal   │ │ Stockheimer      │            │
│  │ Früchtegarten    │ │                  │ │ Landmarkt        │            │
│  │ Alpenweg 16      │ │ Marktplatz 3a    │ │ Dorfstrasse 39   │            │
│  │ 87665            │ │ 86875 Waal       │ │ 86825 Bad        │            │
│  │ Mauerstetten     │ │                  │ │ Wörishofen       │            │
│  │                  │ │                  │ │                  │            │
│  │ Website ↗        │ │ Website ↗        │ │ Website ↗        │            │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘            │
│  … 16 Karten, 3 Spalten Desktop, 2 Tablet, 1 Handy                         │
└────────────────────────────────────────────────────────────────────────────┘
   Karten statt Liste. Sechzehn Zeilen mit Haarlinie darunter wären die
   schlechteste Möglichkeit, die es gibt.

┌────────────────────────────────────────────────────────────────────────────┐
│  ANFAHRT                                       eigene SVG-Karte, kein Maps │
│  ┌──────────────────────────────────────────────────────────┐             │
│  │  Gezeichnete Umgebungskarte: Kaufbeuren, Mauerstetten,   │             │
│  │  Hausen, die wichtigsten Strassen. Markenfarben.         │             │
│  │  ⌂ steht auf Hausen.                                     │             │
│  └──────────────────────────────────────────────────────────┘             │
│  ▬ Route planen ▬   führt auf OpenStreetMap, öffnet in neuem Tab           │
└────────────────────────────────────────────────────────────────────────────┘
```

### 8.6 Events & Verleih (`/events-verleih/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Ihr feiert. Wir liefern.                                                  │
│  Zelt, Garnituren, Zapfanlage, Grill. Oder Ihr feiert gleich bei uns.      │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  FEIERN IN DER BRAUEREI                                     Bildband 21:9  │
│  ▓▓▓ Brauereigarten mit Festzelt ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  Brauereigarten · Festraum · externes Catering möglich                     │
│  ▬ Feier anfragen ▬                                                        │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  LEIHINVENTAR                        3 Gruppen, Kartenraster je Gruppe     │
│                                                                            │
│  ── Überdachung ──────────────────────────────────────────────────────     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                  │
│  │▓ Zirkuszelt   ▓│ │▓ Pavillon     ▓│ │▓ Sonnenschirme▓│                  │
│  │ 12 m Ø         │ │ 3 × 3 m        │ │ 3,6 m Ø        │                  │
│  │ 113 m² innen   │ │                │ │ und 2 × 1,30 m │                  │
│  └────────────────┘ └────────────────┘ └────────────────┘                  │
│                                                                            │
│  ── Sitzen und Stehen ────────────────────────────────────────────────     │
│  ┌────────────────┐ ┌────────────────┐                                     │
│  │▓ Garnituren   ▓│ │▓ Stehtische   ▓│                                     │
│  │ Tisch 2,20 ×   │ │ 80 cm Ø        │                                     │
│  │ 0,50 m         │ │ für 4 Personen │                                     │
│  └────────────────┘ └────────────────┘                                     │
│                                                                            │
│  ── Ausschank und Küche ──────────────────────────────────────────────     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                  │
│  │▓ Durchlauf-   ▓│ │▓ Partygrill   ▓│ │▓ Gläserspül-  ▓│                  │
│  │  kühler        │ │ Feuerschale    │ │  maschine      │                  │
│  └────────────────┘ └────────────────┘ └────────────────┘                  │
│                                                                            │
│  Dazu Partyfässer 10 und 20 l, Gläser, Krüge, Tischschürzen.               │
│                                                                            │
│  ┌ Hinweis ────────────────────────────────────────────────────┐           │
│  │ Bei Starkregen und Sturm sind die Schirme sofort zu          │           │
│  │ schliessen und zu verzurren.                                 │           │
│  └──────────────────────────────────────────────────────────────┘          │
│  Fläche --db-flaeche-hopfen, Kupfer-Symbol, kein roter Alarmkasten          │
│                                                                            │
│  ▬ Verleih anfragen ▬                                                      │
└────────────────────────────────────────────────────────────────────────────┘
   Dreizehn Gegenstände als drei benannte Gruppen statt einer 13-Zeilen-Liste.
```

### 8.7 News-Übersicht und News-Beitrag

```
ÜBERSICHT                                    BEITRAG
┌──────────────────────────────┐             ┌──────────────────────────────┐
│ Aus der Brauerei             │             │ 24. Juli 2026                │
│                              │             │                              │
│ ┌──────────────────────────┐ │             │ 10 Jahre DEIN BIER           │
│ │▓ neuester Beitrag gross ▓│ │             │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔            │
│ │▓ 8 Spalten, Bild 16:9   ▓│ │             │                              │
│ │ 24. Juli 2026            │ │             │ ┌──────────────────────────┐ │
│ │ 10 Jahre DEIN BIER       │ │             │ │▓ Leitbild 16:9          ▓│ │
│ │ Weiterlesen              │ │             │ └──────────────────────────┘ │
│ └──────────────────────────┘ │             │                              │
│                              │             │   Textspalte 34rem,          │
│ ┌───────────┐ ┌───────────┐  │             │   Work Sans 18px,            │
│ │▓ Beitrag ▓│ │▓ Beitrag ▓│  │             │   Zeilenhöhe 1,65            │
│ │ 4 Spalten │ │ 4 Spalten │  │             │                              │
│ └───────────┘ └───────────┘  │             │   Programmpunkte als          │
│ ┌───────────┐ ┌───────────┐  │             │   Terminliste mit Datum      │
│ │▓ Beitrag ▓│ │▓ Beitrag ▓│  │             │   in Vollkorn 700            │
│ └───────────┘ └───────────┘  │             │                              │
│                              │             │ ─── Haarlinie ────────────── │
│ Jahresfilter als Reiter:     │             │ ← Zurück zu allen News       │
│ [2026] [2025] [2024] …       │             │   Nächster Beitrag →         │
└──────────────────────────────┘             └──────────────────────────────┘
```

Der neueste Beitrag ist doppelt so groß wie die übrigen. Kein gleichförmiges Raster.
Jahresreiter statt einer endlosen Liste aus 46 Einträgen.

### 8.8 Kontakt (`/kontakt/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Kontakt                                                    7 Spalten / 5  │
│                                                                            │
│  Ruft an oder schreibt.              ┌────────────────────────────┐        │
│  Wir melden uns zurück.              │  Gezeichnete Anfahrtskarte │        │
│                                      │  ⌂ steht auf Hausen        │        │
│  Telefon                             └────────────────────────────┘        │
│  ▬ 0151 28776077 ▬                   ▬ Route planen ▬                      │
│                                                                            │
│  E-Mail                              Brauereiverkauf                       │
│  ▬ info@deinbier-allgaeu.de ▬        Samstag 10:00 bis 12:00 Uhr           │
│                                      Ausserhalb an der Bierklingel         │
│  Anschrift                           klingeln.                             │
│  DEIN BIER M. Rink Brauerei                                                │
│  Hausen 3                                                                  │
│  87665 Mauerstetten                                                        │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  ANFRAGE NACH THEMA                            4 Karten, vorbefüllte Mails │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │ Verleih  │ │ Feier    │ │ Seminar  │ │ Ferien-  │                       │
│  │ anfragen │ │ anfragen │ │ anfragen │ │ wohnung  │                       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                       │
│  Jede Karte öffnet das Mailprogramm mit passendem Betreff und einem         │
│  vorbereiteten Text, in dem nur noch die Lücken gefüllt werden.             │
└────────────────────────────────────────────────────────────────────────────┘
```

**Kein Formular, kein Formularersatz, der wie ein Formular aussieht.** Es gibt kein Backend;
ein Feld, das nichts tut, wäre eine Lüge. Die vier Karten sind ehrlich beschriftet.

### 8.9 Rechtstexte (`/impressum/`, `/datenschutz/`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Impressum                                                                 │
│                                                                            │
│  Reine Textspalte, 34rem, linksbündig.                                     │
│  Zwischenüberschriften Vollkorn 600, 24px.                                 │
│  Kein Bild, kein Wagen, keine Zierlinie, keine Bewegung.                   │
│                                                                            │
│  Bei der Datenschutzerklärung zusätzlich ein Inhaltsverzeichnis mit         │
│  Sprungmarken, weil der Text lang wird.                                    │
│                                                                            │
│  Anrede hier: „Sie". Überall sonst: „Ihr".                                 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 8.10 Fehlerseite (`/404.html`)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                          ⌂  Wagen mit leerer Ladefläche                    │
│                    ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈                                   │
│                                                                            │
│                    Hier ist nix.                                           │
│                    Das Fass ist woanders.                                  │
│                                                                            │
│                    Die Seite gibt es nicht mehr oder sie hiess             │
│                    schon immer anders.                                     │
│                                                                            │
│                    ▬ Zur Startseite ▬    Unsere Biere    Kontakt           │
└────────────────────────────────────────────────────────────────────────────┘
```

Der einzige zentrierte Aufbau der ganzen Seite. Bei einer Fehlerseite ist die Botschaft die
Gestaltung, deshalb greift hier die Ausnahme von der Regel gegen zentrierte Anordnungen.

### 8.11 Fußzeile (auf jeder Seite)

```
  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
╔════════════════════════════════════════════════════════════════════════════╗
║  --db-nacht-900                                                            ║
║                                                                            ║
║  ◉ DEIN BIER            Brauerei          Kontakt                          ║
║  zu Hause(n) gebraut    Biere             Impressum                        ║
║                         Brauseminare      Datenschutz                      ║
║  Hausen 3               Events & Verleih                                   ║
║  87665 Mauerstetten     Ferienwohnung     Facebook ↗                       ║
║                         Verkaufsstellen   Instagram ↗                      ║
║  0151 28776077          News                                               ║
║  info@deinbier-allgaeu.de                                                  ║
║      ↑ echtes mailto:, nicht der Fehler der alten Seite                     ║
║                                                                            ║
║  ─── Haarlinie --db-linie-invers ───────────────────────────────────────   ║
║                                                                            ║
║  Bitte geniesst unser Bier verantwortungsvoll. Kein Alkohol an Personen    ║
║  unter 16 Jahren; Bierbrand und Bierlikör erst ab 18.                      ║
║                                                                            ║
║  © 2026 DEIN BIER M. Rink Brauerei          Jahreszahl automatisch          ║
╚════════════════════════════════════════════════════════════════════════════╝
```

Drei Spalten statt vier. Kein Baujahr, keine Ortsangabe mit Uhrzeit, keine Wetteranzeige.

### 8.12 Altersabfrage

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Überlagerung --db-nacht-900 bei 96 %, Fokusfalle, role="dialog"           │
│                                                                            │
│                        ◉  Logo, 96px                                       │
│                                                                            │
│                   Seid Ihr schon 16?                                       │
│                   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                                        │
│                   Wir schenken Bier aus. Deshalb fragen wir kurz nach.     │
│                                                                            │
│                   ▬ Ja, bin ich ▬        Nein                              │
│                    Fläche bernstein       Textknopf                        │
│                                                                            │
│                   Bierbrand und Bierlikör gibt es erst ab 18.              │
└────────────────────────────────────────────────────────────────────────────┘
```

- Der Seiteninhalt steht **vollständig im HTML** darunter. Suchmaschinen und Nutzer ohne
  JavaScript sehen die Seite ungehindert.
- Die Antwort liegt in `localStorage`. Kein Cookie, keine Übertragung.
- Bei „Nein": eigene ruhige Hinweisseite, kein Rauswurf auf eine fremde Domain.
- Tastatur: Fokus wird gefangen, `Tab` läuft im Kreis, erster Knopf ist beim Öffnen fokussiert.
- Der Dialog erscheint **ohne Einblendbewegung**, damit er nicht flackert, wenn die Antwort
  bereits gespeichert ist.

**Zu klären:** Altersgrenze 16 oder 18, Verhalten bei „Nein", Ja/Nein statt Geburtsdatum.
Siehe OFFENE-FRAGEN Nr. 27. Der Entwurf oben zeigt meine Empfehlung.

---

## 9 · Komponenten und Zustände

`ui-ux-pro-max:design-system` verlangt für jede Komponente eine vollständige Zustandstabelle.

### 9.1 Knopf, primär

| Eigenschaft | Ruhe | Hover | Aktiv | Fokus | Deaktiviert |
|---|---|---|---|---|---|
| Fläche | `malz-700` | `malz-800` | `malz-800` | `malz-700` | `holz-400` |
| Text | `creme-50` | `creme-50` | `creme-50` | `creme-50` | `creme-100` |
| Versatz | 0 | `translateY(-1px)` | `translateY(0) scale(0.98)` | 0 | 0 |
| Schatten | `xs` | `md` | keiner | `xs` | keiner |
| Umriss | keiner | keiner | keiner | 2 px `hopfen-700`, 2 px Versatz | keiner |

Kontrast Text auf Fläche: **10,13 : 1**.

### 9.2 Knopf, Bier-Aktion

| Eigenschaft | Ruhe | Hover | Aktiv | Fokus |
|---|---|---|---|---|
| Fläche | `bernstein-500` | `bernstein-600` | `bernstein-600` | `bernstein-500` |
| Text | `nacht-900` | `nacht-900` | `nacht-900` | `nacht-900` |

Kontrast: **4,97 : 1**. Heller Text darauf ergäbe 3,26 : 1 und ist deshalb ausgeschlossen.

### 9.3 Knopf, still

| Eigenschaft | Ruhe | Hover | Aktiv | Fokus |
|---|---|---|---|---|
| Fläche | keine | `creme-100` | `creme-100` | keine |
| Rahmen | 1 px `holz-500` | 1 px `malz-700` | 1 px `malz-700` | 1 px `holz-500` |
| Text | `malz-800` | `malz-800` | `malz-800` | `malz-800` |

### 9.4 Textlink

Ruhe: `hopfen-700`, unterstrichen, Unterstrichabstand `0.18em`, Stärke `1px`.
Hover: Unterstrich wird `2px` und wandert auf `0.12em` heran. Farbe bleibt.
Kein Farbwechsel beim Überfahren; die Bewegung des Unterstrichs reicht als Rückmeldung.

### 9.5 Bierkarte

| Eigenschaft | Ruhe | Hover | Fokus |
|---|---|---|---|
| Aussenschale | `sand-200` | `sand-200` | `sand-200` |
| Innenkern | `creme-50` | `creme-50` | `creme-50` |
| Bild | `scale(1)` | `scale(1.03)` | `scale(1)` |
| Schatten | `sm` | `md` | `sm` |
| Umriss | keiner | keiner | 2 px `hopfen-700` um die Aussenschale |

Das Bild skaliert innerhalb eines Elements mit `overflow: hidden`. Die Karte selbst bewegt sich
nicht; sonst zittert das Raster.

### 9.6 Kopfzeile

Nicht dauerhaft klebend. Sie verschwindet beim Abwärtsscrollen und kommt beim Aufwärtsscrollen
zurück. Grund: Auf einem Handy im Hochformat frisst eine dauerhaft sichtbare Leiste ein Zehntel
der Fläche, und dies ist eine Seite zum Lesen, nicht zum Bedienen.

Beim Erscheinen über Inhalt: `--db-creme-50` bei 92 % mit `backdrop-filter: blur(12px)` und
einer Haarlinie unten. Der Weichzeichner liegt auf einem festen Element, nicht auf scrollendem
Inhalt.

### 9.7 Zustände, die es hier nicht gibt

Die Seite ist statisch. Es gibt **keine** Ladezustände, **keine** Leerzustände und **keine**
Fehlerzustände im Sinne einer Anwendung, weil nichts nachgeladen wird und kein Formular
abgeschickt wird. Die einzigen Sonderfälle:

- **Keine Termine vorhanden:** ein gestalteter Hinweis statt einer leeren Fläche. Der Fehler
  der Altseite („Keine Veranstaltungen vorhanden" plus ein Countdown auf null) wird nicht
  wiederholt. Stattdessen: „Die nächsten Termine stehen noch nicht fest. Ruft an, wir finden
  einen." mit Telefonknopf.
- **Bild fehlt noch:** eine getönte Fläche in `sand-200` mit dem Hopfen-Signet, nicht ein
  hochskaliertes unscharfes Foto.
- **404:** siehe 8.10.

---

## 10 · Bewegungskonzept

`MOTION_INTENSITY 5`. Jede Bewegung braucht einen Grund. Die Regel des Lead-Skills lautet:
Wer die Bewegung nicht in einem Satz begründen kann, lässt sie weg.

| Bewegung | Wo | Begründung in einem Satz | Dauer |
|---|---|---|---|
| **Die Einfahrt** | Hero, einmal beim Laden | Der Wagen fährt herein und macht in drei Sekunden begreiflich, was die Firma anders macht als jede andere Brauerei. | 900 ms |
| Überschrift steigt auf | Hero, gestaffelt nach der Einfahrt | Führt das Auge vom Bild zur Aussage. | 600 ms, 70 ms Versatz |
| Einblenden beim Scrollen | je Abschnitt, einmalig | Zeigt, dass ein neuer Gedanke beginnt. | 600 ms, `translateY(16px)` |
| Knopf hebt sich | Hover | Sagt „hier kann man drücken". | 180 ms |
| Knopf senkt sich | Aktiv | Bestätigt den Druck haptisch. | 100 ms |
| Bild in der Bierkarte | Hover | Zeigt, dass die Karte als Ganzes anklickbar ist. | 260 ms |
| Menü klappt auf | mobil | Räumliche Herkunft des Menüs. | 260 ms, 70 ms Versatz je Eintrag |
| Unterstrich wächst | Link-Hover | Rückmeldung ohne Farbwechsel. | 180 ms |

**Ausdrücklich nicht:** Parallax, Scroll-Hijack, waagerechtes Scrollen, Laufschrift,
Endlosschleifen, Zähler, die hochlaufen, eigener Mauszeiger, Seitenübergänge.

**Technik:** Ausschließlich CSS. Einblendungen über `IntersectionObserver` oder, wo verfügbar,
`animation-timeline: view()`. **Kein** `window.addEventListener("scroll")`. Bewegt werden
ausschließlich `transform` und `opacity`.

**Kurven:** `--db-easing-standard: cubic-bezier(0.2, 0, 0.1, 1)` für alles, was ankommt.
`--db-easing-feder` mit leichtem Überschwingen ausschließlich für die Einfahrt, weil ein
Fahrzeug beim Halten leicht nachwippt.

**Reduzierte Bewegung:** `prefers-reduced-motion: reduce` setzt alle Dauern auf 1 ms. Der Wagen
steht dann von Anfang an am Ziel, alle Abschnitte sind sofort sichtbar. Abgeschaltet, nicht
verkürzt.

---

## 11 · Bildbedarf

Jede Bildstelle mit Zielmaß. Was fehlt, bekommt einen gestalteten Platzhalter, kein
hochskaliertes Foto.

| # | Seite | Motiv | Zielmaß | Status |
|---|---|---|---|---|
| 1 | Start | **Anhänger mit Brauanlage im Einsatz** | 2400 × 1800 | **fehlt** |
| 2 | Start | Brauscheune aussen, Abendlicht | 2400 × 1000 | vorhanden 800 × 600, **zu klein** |
| 3 | Start | Seminar in der Scheune | 1600 × 1200 | vorhanden 1600 × 720 |
| 4 | Start | Zirkuszelt aufgebaut | 1600 × 1067 | vorhanden **300 × 200**, unbrauchbar |
| 5 | Start | Brauereigarten mit Festzelt | 1600 × 900 | vorhanden, Maß prüfen |
| 6 | Start | Ferienwohnung Balkon | 1200 × 1500 | vorhanden 1600 × 1200 |
| 7 | Biere | 5 Flaschen freigestellt | je 900 × 1200 | vorhanden 147 × 598, **zu klein** |
| 8 | Brauerei | Michael Rink bei der Arbeit | 1600 × 2000 | vorhanden 1280 × 1538 als Paarfoto |
| 9 | Brauerei | Malz, Hopfen, Sudpfanne, Tanks | je 1200 × 1500 | vorhanden 1920 × 1280 |
| 10 | Seminare | Etikettenbeispiele | je 1200 × 1200 | zugesagt, **fehlt** |
| 11 | alle | Logo als Vektor | SVG | zugesagt, **fehlt** |
| 12 | Kontakt | Umgebungskarte | eigenes SVG | wird gezeichnet |

**Bildpipeline:** Astro-Bildverarbeitung, AVIF und WebP mit JPEG-Rückfall, `srcset` in vier
Stufen, `loading="lazy"` außer beim Hero-Bild, `decoding="async"`, Breite und Höhe immer gesetzt,
damit nichts springt.

**Keine Etiketten auf Bildern.** Keine überlagerten Marken, keine erfundenen Bildnachweise,
keine Nummerierungen wie „01 / 4". Bildunterschriften stehen unter dem Bild.

---

## 12 · Selbstkritik-Pass

PROJEKT.md §7 verlangt die Prüffrage: *Würde dieses Konzept auch bei jedem anderen
Brauerei-Auftrag entstehen?*

**Bei drei Dingen lautet die Antwort klar nein:**

1. **Der Wagen.** Er stammt aus diesem Logo und beschreibt dieses Geschäftsmodell. Eine
   ortsfeste Brauerei könnte ihn nicht verwenden.
2. **Die Farben.** Sie sind aus der Logodatei gemessen, nicht aus einer Palettenliste gewählt.
   Eine andere Brauerei hätte andere Werte.
3. **Vollkorn.** Eine Schrift, die „Vollkorn" heißt, für einen Betrieb, der Getreide vermälzt.
   Das ist keine austauschbare Entscheidung.

**Bei zwei Dingen lautet die Antwort ehrlicherweise jein:**

4. **Der Bento-Aufbau der Bierübersicht** ist eine Standardlösung für „mehrere Produkte zeigen".
   Er ist hier vertretbar, weil die Zellenzahl exakt der Produktzahl entspricht und die
   Größenverteilung eine Aussage trifft (das Helles ist das meistverkaufte Bier und bekommt
   sechs Spalten, der Klosterkeller acht, weil seine Geschichte die interessanteste ist).
   Wäre die Verteilung gleichmäßig, wäre es Schablone.
5. **Das dunkle Zitatband.** Ein bekannter Kunstgriff. Gerettet wird es davon, dass das Zitat
   echt ist und aus dem Seminarbericht der Altseite stammt, nicht aus einer erfundenen
   Kundenstimme. Ein „Sarah M., zufriedene Kundin" hätte hier nichts verloren.

**Was ich beim zweiten Durchsehen geändert habe:**

- **Die Wegstrecke lief ursprünglich zwischen jedem Abschnitt.** Das kippt in Dekoration und
  fällt unter das Verbot von Zierlinien ohne Funktion. Jetzt: genau dreimal auf der Startseite.
- **Der Hero hatte eine Zeile unter den Knöpfen** („Seit 2016 in Hausen"). Das ist genau die
  Kleinzeile, die den Hero überlädt. Gestrichen; die Information steht im Abschnitt „Die
  Brauerei".
- **Es gab fünf Etikettenzeilen.** Erlaubt sind bei neun Abschnitten drei. Zwei gestrichen.
- **Die Verkaufsstellen waren eine Liste mit Trennlinien.** Sechzehn Zeilen mit Haarlinie
  darunter sind die schlechteste denkbare Lösung. Jetzt Kartenraster, nach Region gruppiert.
- **Das Leihinventar war eine Aufzählung mit dreizehn Punkten.** Jetzt drei benannte Gruppen.
- **Die Knöpfe waren volle Pillen** (Vorgabe aus `high-end-visual-design`). Pillen sind die
  Formensprache von SaaS-Produkten. Jetzt 8 px, wie ein Etikett.

**Was ich bewusst nicht getan habe:**

- **Kein Bierschaum als Hintergrundvideo.** Naheliegend, aber austauschbar.
- **Keine Hopfenranke am Seitenrand.** Die Dolde ist im Logo, das reicht.
- **Kein Fasszähler und keine Statistikleiste.** Die Zahlen dieser Brauerei sind klein, und
  das ist ihre Stärke. „5000 Liter im Jahr" gegen einen Konzern auszuspielen wäre der falsche
  Wettbewerb.

---

## 13 · Pre-Flight-Prüfung

Die Prüfliste des Lead-Skills, auf das Konzept angewandt.

| Punkt | Ergebnis |
|---|---|
| Design Read erklärt | ✅ Abschnitt 1 |
| Dials begründet, nicht stillschweigend übernommen | ✅ Abschnitt 2 |
| Redesign-Modus erkannt, Audit vorhanden | ✅ Overhaul, `AUDIT.md` |
| Gedankenstrich im Website-Text | ✅ verboten, Ausnahme dokumentiert (Abschnitt 3) |
| Ein Farbschema für die ganze Seite | ✅ hell, ein dunkler Abschnitt als bewusste Zäsur |
| Eine Akzentfarbe durchgehend | ✅ Hopfengrün Bedienung, Bernstein Produkt, geregelt |
| Ein Radiensystem | ✅ Abschnitt 6.4 |
| Knopfkontrast geprüft | ✅ 10,13 und 4,97 |
| Knopfbeschriftung einzeilig | ✅ längste ist „Ferienwohnung anfragen", 21 Zeichen |
| Serifendisziplin | ✅ Vollkorn, weder Fraunces noch Instrument Serif |
| Palette nicht die Beige-Messing-Standardmischung | ✅ aus dem Logo gemessen, Grün trägt mit |
| Kursive Unterlängen | ✅ `line-height` 1,12 plus Reserve, Abschnitt 4 |
| Hero passt in den Bildschirm | ✅ Überschrift 2 Zeilen, Vorspann 19 Wörter, 3 Zeilen |
| Hero-Abstand oben | ✅ höchstens 6 rem |
| Hero höchstens 4 Textelemente | ✅ Etikettenzeile, Überschrift, Vorspann, Knöpfe |
| Etikettenzeilen gezählt | ✅ 3 bei 9 Abschnitten, Höchstwert ist 3 |
| Kein geteilter Abschnittskopf | ✅ Überschrift und Vorspann stehen untereinander |
| Zickzack höchstens zweimal | ✅ einmal (Abschnitt D) |
| Keine doppelte Aufforderungsabsicht | ✅ Tabelle in Abschnitt 15 |
| Bento mit exakter Zellenzahl | ✅ 5 Biere, 5 Zellen; 6 Produkte, 6 Zellen |
| Bento-Zellen visuell verschieden | ✅ 2 Fotozellen, 3 getönte Flächen |
| Navigation einzeilig, höchstens 80 px | ✅ 72 px, Menüknopf ab 1100 px |
| Mindestens 4 Layoutfamilien | ✅ 8 bei 9 Abschnitten |
| Lange Listen als passende Bausteine | ✅ Verkaufsstellen als Karten, Leihinventar in 3 Gruppen |
| Echte Bilder, keine Div-Attrappen | ✅ Abschnitt 11, Fehlendes ausgewiesen |
| Keine Marken auf Bildern | ✅ |
| Keine erfundenen Bildnachweise | ✅ |
| Keine Baunummern im Fußbereich | ✅ |
| Keine Kleinsätze unter Etikettenzeilen | ✅ |
| Kein Zierstreifen unter dem Hero | ✅ |
| Kein schwebender Text oben rechts | ✅ |
| Keine Fortschrittsbalken als Vergleich | ✅ |
| Keine Ortsangabe mit Uhrzeit und Wetter | ✅ |
| Keine Scroll-Aufforderung | ✅ |
| Keine Versionsangaben im Hero | ✅ |
| Keine nummerierten Etikettenzeilen | ✅ |
| Keine Zierpunkte | ✅ |
| Keine Trennlinie über und unter jeder Zeile | ✅ |
| Zitate höchstens 3 Zeilen, Zuschreibung sauber | ✅ Abschnitt 8.2, Familie E |
| Bewegung behauptet gleich Bewegung gezeigt | ✅ Abschnitt 10 |
| Kein `window.addEventListener("scroll")` | ✅ IntersectionObserver oder CSS |
| Reduzierte Bewegung berücksichtigt | ✅ auf 1 ms, abgeschaltet |
| Dunkles Farbschema | ⚠️ **zur Entscheidung, Abschnitt 14.2** |
| Mobiler Umbruch je Abschnitt festgelegt | ✅ Abschnitt 8.2 unten |
| `dvh` statt `vh` | ✅ Token `--db-hoehe-voll` |
| Karten nur wo Hierarchie es verlangt | ✅ Etikettenrahmen nur an 3 Stellen |
| Symbole aus einer erlaubten Familie | ✅ Phosphor, 1,5 px, plus die zwei Markenzeichen |
| Keine KI-Erkennungsmerkmale | ✅ kein Inter, kein KI-Violett, keine drei gleichen Karten, keine erfundenen Namen |
| Ladezeit-Ziele erreichbar | ✅ Abschnitt 3, Zielwert 14 bis 20 KB CSS |
| Ein Gestaltungssystem | ✅ natives CSS mit Tokens |

**Ein Punkt offen:** das dunkle Farbschema. Alles Übrige ist abgehakt.

---

## 14 · Entscheidungen für den Betreiber

### 14.1 ✅ Stack: **natives CSS mit Tokens** (entschieden 03.08.2026)

Kein Tailwind, keine Utility-Bibliothek. Begründung in Abschnitt 3.

Das einzige Gegenargument war die spätere Übergabe an eine Agentur, für die Tailwind die
verbreitetere Sprache wäre. Der Betreiber hat entschieden, dass die Seite bei ihm und beim
Betreuer bleibt. Damit gilt die Klassenbenennung aus Abschnitt 3: **deutsche, sprechende
Klassennamen** (`hero-titel`, `bierkarte`, `wegstrecke`), damit der Code auch in zwei Jahren
noch von jemandem gelesen werden kann, der nur Grundkenntnisse hat.

### 14.2 ✅ Dunkles Farbschema: **nein** (entschieden 03.08.2026)

Die Seite bekommt **nur die helle Fassung**. Kein zweiter Satz semantischer Werte, keine
doppelte Kontrastprüfung. Der Kontrast entsteht über das dunkle Zitatband und die dunkle
Fußzeile, beides aus `--db-nacht-900`.

Nutzer mit Systemeinstellung „dunkel" bekommen dieselbe helle Seite. Das ist eine Entscheidung,
keine Auslassung, und wird in `QA.md` (Phase 8) als solche vermerkt, weil der Lead-Skill
`design-taste-frontend` §6.C beide Fassungen verlangt.

*Ursprüngliche Fragestellung, zur Nachvollziehbarkeit:*

Der Lead-Skill verlangt für Seiten mit Publikumsverkehr beide Fassungen. `BRAND.md` empfiehlt
nur die helle.

**Meine Empfehlung: nur hell.** Die Marke *ist* die warme Cremefläche. Invertiert wird aus dem
Bernstein Neon, und die Wärme, die den ganzen Auftritt trägt, geht verloren. Ein dunkler
Abschnitt als Zäsur (das Zitatband) und die dunkle Fußzeile bringen den Kontrast, ohne das
System zu verdoppeln.

**Was ein dunkles Schema kosten würde:** ein zweiter Satz semantischer Werte, doppelte
Kontrastprüfung, jede Seite zweimal ansehen, und die Bilder brauchen andere Abdunklungen.
Grob geschätzt ein Viertel mehr Aufwand in Phase 4 und 8.

**Wenn Ihr es wollt**, baue ich es sauber. Dann bitte jetzt sagen, nicht später.

### 14.3 ✅ Schriftpaarung: **Vollkorn + Work Sans** (entschieden 03.08.2026)

Vollkorn für Überschriften, Vorspänne, Zitate und Zahlen. Work Sans für alles zum Lesen.
Begründung in Abschnitt 4.

**Vorbehalt, ausdrücklich zugesagt:** Phase 4 baut zuerst die Startseite. Dort sieht der
Betreiber die Schriften an echtem Text. Gefallen sie dann nicht, kostet der Wechsel **zwei
Zeilen** in `tokens.css` (`--db-font-display` und `--db-font-text`) plus den Austausch der
Schriftdateien. Genau dafür liegen die Schriftnamen in Tokens und nirgends sonst.

### 14.4 ✅ Der Wagen als Leitmotiv: **ja** (entschieden 03.08.2026)

Der Pritschenwagen mit dem Fass wird das Signature-Element, mit den Einsatzregeln aus
Abschnitt 7: genau fünf Auftritte, Wegstrecke dreimal auf der Startseite.

Bis die Logo-Vektordatei vorliegt (OFFENE-FRAGEN Nr. 16), wird er nach der Silhouette des
vorhandenen 300-px-PNG nachgezeichnet. Die endgültige Fassung entsteht erst aus dem Original,
und bis dahin ist jede Darstellung eine Näherung.

---

## 15 · Festlegungen, die ab jetzt gelten

### 15.1 Aufforderungen: ein Wortlaut je Absicht

| Absicht | Wortlaut, überall gleich |
|---|---|
| Verleih anfragen | **Verleih anfragen** |
| Feier in der Brauerei anfragen | **Feier anfragen** |
| Brauseminar anfragen | **Seminar anfragen** |
| Ferienwohnung anfragen | **Ferienwohnung anfragen** |
| Allgemeiner Kontakt | **Kontakt** |
| Anrufen | **0151 28776077** (die Nummer selbst ist die Beschriftung) |
| Weiter zu einem Beitrag | **Weiterlesen** |
| Zu einer Übersichtsseite | **Alle …** (Alle News, Alle Produkte, Alle Verkaufsstellen) |
| Zur Anfahrt | **Route planen** |

Nie: „Mehr erfahren", „Hier klicken", „Absenden", „Jetzt anfragen", „Lesen Sie mehr".

### 15.2 Verbindliche Regeln für Phase 4

1. Genau eine `<h1>` je Seite.
2. Hintergrund ist `--db-creme-50`. Nie `#ffffff`.
3. Jedes Bild hat einen beschreibenden Alt-Text. Nie die Firmenanschrift.
4. Jeder `mailto:` und `tel:` wird nach dem Bauen einzeln angeklickt und geprüft.
5. Kein Text als Bild. Produktnamen stehen als Text im HTML.
6. Sprungmarke „Zum Inhalt springen" als erstes fokussierbares Element.
7. `lang="de"` und `hyphens: auto`, sonst brechen die Komposita falsch.
8. Alle Zahlen mit Maßeinheit ohne Umbruch dazwischen (`12&nbsp;m`, `113&nbsp;m²`).
9. Keine Preise. Siehe OFFENE-FRAGEN Nr. 6.
10. Jede Abweichung von diesem Dokument wird in `QA.md` vermerkt, nicht stillschweigend gemacht.

---

## 16 · Nachtrag: Hintergrundmotive auf der Startseite (04.08.2026)

Nachträglich zu diesem Dokument, auf Wunsch des Betreibers: die Cremefläche war ihm zu
leer. Der Nachtrag hält fest, was daraus wurde und was verworfen wurde, damit der Weg
später nachvollziehbar ist.

### 16.1 Verworfen: das gekachelte Muster

Der erste Versuch war ein kleines Muster aus Hopfendolde und Gerstenähre, als
`background-image` über die ganze Seite gekachelt. Es hat die Fläche zwar gefüllt, aber
wie eine Tapete: die Wiederholung zieht das Auge auf das Raster statt auf den Inhalt, und
auf langen Textseiten wird sie unruhig. Der Betreiber hat es genau so benannt
(„nicht so einen Tapeteneffekt") und damit die Änderung ausgelöst.

Das Muster hinterlässt eine bleibende Spur im Farbsystem: es hat `--db-holz-500` von
`#7c6844` auf `#6b5836` gedrückt. Der alte Wert lag mit 5,00:1 auf reiner Cremefläche zu
knapp; sobald etwas den Untergrund abdunkelte, fiel er auf 4,43:1 und damit unter AA. Der
dunklere Wert bleibt, obwohl das Muster weg ist — er ist schlicht der bessere Wert.

### 16.2 Umgesetzt: einzelne, sehr große Motive

Statt vieler kleiner Kacheln stehen auf der Startseite große Motive, jedes am
Rand angeschnitten:

| Abschnitt | Motiv | Lage | Größe |
|---|---|---|---|
| Hero, **ganz oben** | Gerstenähre **und** Hopfendolde nebeneinander | rechts unten, hinter dem Foto | 520 px / 400 px |
| Die Biere | Gerstenähre | rechts | 780 px |
| Verkaufsstellen | Hopfendolde | rechts | 520 px |

Vier Entscheidungen dahinter:

**Oben stehen beide Pflanzen, nebeneinander.** Auf Wunsch des Betreibers.
Gerste und Hopfen sind die zwei Zutaten, aus denen das Bier kommt; sie
zusammen zu zeigen ist inhaltlich richtiger als eine allein. Sie sind **am Fuß
ausgerichtet und überschneiden sich leicht** — zwei Pflanzen wachsen aus einem
Boden, sie schweben nicht auf gleicher Höhe nebeneinander. Ein Zwischenschritt
legte die Dolde in das Hero-Foto: technisch sauber, aber sie ging in den
Bilddetails unter, und der Betreiber hat sie schlicht nicht gefunden. Auf der
ruhigen Fläche trägt die Form.

**Angeschnitten, nicht vollständig.** Ein Motiv, das über den Rand hinausragt,
wirkt wie ein Ausschnitt aus etwas Größerem. Ein vollständig sichtbares wirkt
wie ein aufgeklebtes Bild. Wie weit, steuert `ueberstand` — voreingestellt
26 % der eigenen Breite. Für Paare gibt es `seite="frei"`: dann positioniert
sich die Komponente gar nicht selbst, das übernimmt die Seite.

**Nur die Startseite.** Auf Unterseiten würde dasselbe Mittel zur Manier. Die
Startseite darf großzügig sein, eine Rechtstextseite nicht.

**Ab 900 px aufwärts.** Darunter gibt es keinen Rand, an dem ein großes Motiv
stehen könnte — es läge hinter dem Text statt daneben. Unter 900 px ist es
abgeschaltet, ebenso bei `prefers-contrast: more`.

### 16.3 Die Zeichnungen

Die Dolde ist dreimal entstanden. Der Betreiber hat die Zwischenstände klar
benannt — „sieht nicht gut aus", dann „sieht aus wie eine Karotte" — und als
Vorlage ein Strichsymbol geschickt. Drei Einsichten daraus, in der
Reihenfolge, in der sie aufgefallen sind:

**Eine Dolde hat keine glatte Außenlinie.** Das war der erste Fehler.
Zeichnet man erst ein Ei und legt dann Schuppen hinein, kommt eine Karotte
heraus — der Umriss stammt dann vom Ei und nicht von der Pflanze. Der Umriss
muss aus den äußersten Deckblättern selbst entstehen.

**Die vorderen Blätter müssen die hinteren verdecken.** Ohne Verdeckung
kreuzen sich alle Umrisse und es wird ein Liniengitter. Die Blätter sind
deshalb mit der Farbe der Seitenfläche gefüllt und werden von hinten nach
vorn gezeichnet. Das ist auch der Grund, warum ein Motiv auf eine ruhige
Fläche gehört und nicht auf ein Foto: die Füllung müsste sonst die Farbe des
Fotos haben.

**Wenige und große Deckblätter.** Das war der letzte und entscheidende Punkt.
Frühere Fassungen hatten sechs Lagen mit bis zu drei kleinen Schuppen — eine
Struktur, die man erst beim Heranzoomen liest und die aus der Entfernung ein
Muster ergibt statt einer Pflanze. Die Vorlage des Betreibers zeigt fünf Lagen
mit höchstens zwei Blättern, jedes fast so breit wie die halbe Dolde, dazu ein
einzelnes Kopfblatt über die volle Breite und einen geschwungenen Stiel. Das
Profil läuft von oben rund nach unten spitz; gleichmäßig schmaler werdende
Lagen ergeben dagegen einen Tannenzapfen.

**Die Ähre lebt von den Grannen.** Ohne die langen Borsten sieht sie aus wie
ein Grashalm. Sieben Kornpaare, jedes mit einer Granne, die etwa doppelt so
lang ist wie das Korn. Die mittleren Paare sind am größten, oben und unten
läuft die Ähre aus — sonst wirkt sie wie ein Rechteck. Die beiden Kanten
eines Korns müssen dabei deutlich auseinanderlaufen: liegen sie zu eng, bleibt
zwischen zwei Strichen von 2 px fast nichts frei und das Korn wirkt wie ein
massiver dunkler Keil statt wie eine Spindel.

### 16.4 Der Zeiger ist ein Lichtpunkt

Die erste Fassung ließ ein goldenes Segment an der Kontur entlanglaufen,
ausgelöst durch `:hover`. Das war eine Animation, keine Beleuchtung: sie lief
immer gleich ab, egal wo der Zeiger stand. Der Betreiber wollte etwas anderes —
Licht, das dort ist, wo die Maus ist.

Umgesetzt als radiale Maske. Die Zeichnung liegt zweimal übereinander: unten
der blasse Grund, darüber eine goldene Kopie, deren umgebendes Element mit
einem `radial-gradient` maskiert ist. Zwei eigene Eigenschaften — `--licht-x`
und `--licht-y` — führen den Mittelpunkt dem Zeiger nach.

Vier Details, ohne die es nicht funktioniert:

- **Die Maske sitzt an einem HTML-Element**, nicht an einer SVG-Gruppe. CSS-
  Masken auf SVG-Kindern greifen je nach Browser unterschiedlich.
- **Sechs Farbstopps statt zwei.** Mit nur zwei entsteht ein harter Kreisrand,
  der wie ein Loch aussieht statt wie Licht.
- **Rücktransformation der Zeigerposition.** Die Motive sind gedreht; die Maske
  liegt im gedrehten Raum. Ohne Umrechnung säße das Licht schief zum Zeiger.
- **Nur die Kanten leuchten.** Stiel, Schultern, Spitze und die äußerste
  Schuppe jeder Lage bekommen den Goldstrich; was innen liegt, bleibt bei
  45 % Strichdeckung. Leuchtet alles gleich stark, geht die Form darin unter.
- **Der Hof ist eine eigene, weichgezeichnete Lage** und kein `drop-shadow`.
  Ein Schlagschatten nimmt die Deckkraft der ganzen Form; bei gefüllten
  Blättern ergäbe er einen verwaschenen Klecks in Doldenform statt eines
  Scheins entlang der Linien. Die Hof-Lage ist ungefüllt, 7 px breit und mit
  7 px weichgezeichnet — dass sich die Umrisse dort kreuzen, sieht man nach
  dem Weichzeichnen nicht mehr.

**Die Stärke ist zweimal nachjustiert worden.** Die erste Fassung ging in der
Maske bis 1,0 Deckkraft, hatte 3,4 px Goldstrich und drei kräftige Schatten.
Das sah aus wie eine Leuchtreklame; der Betreiber nannte es „zu stark". Jetzt
gilt:

| | zu stark | jetzt |
|---|---|---|
| Maske am Zeiger | 1,0 | **0,62** |
| Lichtradius | 175 px | **240 px** |
| Goldstrich | #ffd257, 3,4 px | **#edc169, 2,6 px** |
| Schein | 3 Schatten, bis 0,95 | **2 Schatten, bis 0,5** |
| Einblenden / Ausblenden | 420 ms / 420 ms | **420 ms / 760 ms** |

Zwei Gedanken dahinter. Erstens: der Strich der Lichtkopie ist **nicht breiter**
als der der Grundzeichnung. Er soll die Linie zum Glimmen bringen, nicht
verdicken. Zweitens: die Maske erreicht nirgends volle Deckung. Dadurch bleibt
das Gold immer durchscheinend statt aufgemalt — das ist der Unterschied
zwischen edel und grell. Das Ausblenden dauert fast doppelt so lang wie das
Einblenden: das Licht soll verlöschen wie eine weggetragene Lampe, nicht
abgeschaltet werden.

Die Zeigerposition wird über `requestAnimationFrame` gedrosselt und **direkt am
Motiv** gesetzt, nicht weiter oben im Baum: eine eigene Eigenschaft an einem
Elternelement zwingt alle Nachfahren zur Neuberechnung.

Bei `prefers-reduced-motion` bleibt das Licht in der Mitte stehen. Der Effekt
ist dann eine ruhige Aufhellung beim Überfahren, kein wanderndes Objekt.

### 16.5 Zwei Fallen, die zugeschnappt sind

**`z-index: -1`.** Damit liegt das Motiv hinter der Fläche des Abschnitts, ist
für den Zeiger gar nicht erreichbar, und das Licht konnte nie ausgelöst
werden — sichtbar war das nur mit `elementFromPoint`, nicht auf einem
Bildschirmfoto. Richtig ist `z-index: 0` am Motiv und `z-index: 1` am Inhalt.

**Prozenthöhe mal Seitenverhältnis.** Die Breite wurde zunächst als
`calc(hoehe * verhaeltnis)` gerechnet. Das funktioniert für Pixelwerte, aber
nicht für Prozente: ein Prozentwert in einer Breitenangabe bezieht sich auf die
**Breite** des Bezugsrahmens, nicht auf dessen Höhe. Bei `hoehe="132%"` kam so
eine Breite von 328 px heraus, wo 151 px richtig gewesen wären. Jetzt liefert
`aspect-ratio` die Breite, und der Überstand kommt aus `translateX` mit einem
Prozentwert — der bezieht sich auf die eigene Breite des Elements.

---

## 17 · Nachtrag: Kopfzeile (04.08.2026)

Ebenfalls nachträglich, auf Wunsch des Betreibers. Er hat zwei Dinge benannt:
der Kopf auf dem Handy passe nicht, und auf dem Desktop solle das Logo mittig
stehen und leicht aus der Leiste herausragen.

### 17.1 Das Siegel

Das Logo sitzt jetzt in einem runden Siegel, mittig, und hängt zu **30 %
seiner Höhe** unter der Leiste heraus. Drei Punkte dazu:

**Die Fläche des Siegels ist deckend**, anders als die der Leiste (die ist zu
92 % deckend mit Weichzeichner dahinter). Nur so verschwindet die Unterkante
der Leiste hinter dem Siegel, statt mitten hindurchzulaufen.

**Die Mitte ist wirklich die Mitte**, ohne eine einzige ausgerechnete Zahl:
zwischen den beiden Navigationshälften steht ein Platzhalter in genau
Siegelbreite, und beide Hälften sind `flex: 1`. Damit sitzt das Siegel exakt
mittig, egal wie lang die Beschriftungen sind.

**Die sieben Punkte teilen sich vier links und drei rechts.** Rechts steht
zusätzlich der Kontaktknopf, dadurch sind beide Seiten am Ende etwa gleich
breit.

Der Umbruch zur Handyfassung liegt jetzt bei 1150 px statt 1100: die
deutschen Beschriftungen sind lang und das Siegel braucht in der Mitte
zusätzlich Platz.

Auf dem Handy bleibt derselbe Aufbau — Siegel mittig, Menüknopf rechts —, nur
kleiner. Die Listenpunkte werden dort ausgeblendet, **nicht die Listen
selbst**: die leeren Hälften bleiben als gleich große Platzhalter stehen und
halten das Siegel weiter in der Mitte.

### 17.2 Das Menü lag im falschen Bezugsrahmen

Ein echter Fehler, siehe QA.md 3.7. Das Menü lag innerhalb der Kopfzeile.
Deren `backdrop-filter` macht sie — wie `filter` und `transform` — zum
Bezugsrahmen für `position: fixed`. Das `inset: var(--kopf-hoehe) 0 0 0`
bezog sich damit auf die Leiste statt auf das Fenster: das Menü war
**390 × 96 px** groß statt bildschirmfüllend.

Es liegt jetzt außerhalb der Kopfzeile und deckt mit `inset: 0` das ganze
Fenster ab. Seine Ebene liegt **eine Stufe unter** der Kopfzeile, damit Siegel
und Menüknopf sichtbar und bedienbar bleiben, während es offen ist.

Dazu wechselt der Knopf sein Symbol: Burger zu Kreuz. Bleibt er ein Burger,
während ein bildschirmfüllendes Menü davorliegt, fehlt der offensichtliche Weg
zurück.
