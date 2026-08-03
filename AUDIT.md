# AUDIT — Altseite deinbier-allgaeu.de

**Stand:** 03.08.2026 · **Methode:** vollständiger Abzug aller 97 URLs aus `wp-sitemap.xml`,
statische Analyse des ausgelieferten HTML, Prüfung aller 70 externen Linkziele per HTTP-Request.
**Rohdaten:** `content/alt/` (Texte als Markdown), `content/alt/_bilder.csv`, `content/alt/_links.csv`.

---

## 1 · Technischer Ist-Stand

| Merkmal | Befund |
|---|---|
| CMS | WordPress mit Theme **Divi 4.27.7** (`<meta name="generator" content="Divi v.4.27.7">`) |
| Hosting | **ALL-INKL.COM – Neue Medien Münnich**, Friedersdorf (laut Datenschutzerklärung) |
| Aktive Plugins (im HTML nachweisbar) | `age-gate` (Altersabfrage), `carousel-for-divi`, `events-manager`, `popups-for-divi`, `shapepress-dsgvo` (Cookie-/Consent-Banner) |
| Seitengewicht Startseite | **281 KB reines HTML** (ohne CSS/JS/Bilder) — Divi-Shortcode-Overhead |
| Sprache | `<html lang="de">` korrekt gesetzt |
| Canonical | vorhanden |
| Externe Domains im Quelltext | facebook.com, instagram.com, google.com (reCAPTCHA), all-inkl.com + Verkaufsstellen-Links |
| Struktur | 24 Seiten, 46 News-Beiträge, 24 Termin-Objekte (Events-Manager), 3 „Locations“ |

**Konsequenz für den Relaunch:** Der komplette Consent-/Cookie-Apparat (`shapepress-dsgvo`) existiert
nur, weil Google reCAPTCHA und die WordPress-Infrastruktur Cookies setzen. Mit statischem Astro,
lokalen Fonts und `mailto:`-Anfragen entfällt der Grund — und damit das Banner.

---

## 2 · Verifizierte Fehler und Mängel

Die in PROJEKT.md Abschnitt 1 vermuteten Probleme wurden geprüft. Ergebnis:

### 2.1 Bestätigt

| # | Befund | Beleg |
|---|---|---|
| B1 | **Kaputter E-Mail-Link im Footer.** Der Link rendert als `href="info@deinbier-allgaeu.de"` — ohne `mailto:`. Der Browser interpretiert das als relativen Pfad und landet auf einer 404. | Footer jeder Seite |
| B2 | **Divi-Platzhaltertext live sichtbar.** „Your content goes here. Edit or remove this text inline or in the module Content settings…“ steht im Abschnitt Leihinventar auf der **Startseite**. | `/` |
| B3 | **Keine Meta-Description.** 96 von 97 Seiten haben keine `<meta name="description">`. | alle Seiten |
| B4 | **Kein OG-Image auf der Startseite**, `og:description` ist leer. Beim Teilen auf WhatsApp/Facebook erscheint nur der Titel. | `/` |
| B5 | **Kein strukturiertes Markup.** Auf keiner einzigen der 97 Seiten existiert JSON-LD (`application/ld+json`). Kein `Brewery`, kein `LocalBusiness`, keine `Event`-Daten. | alle Seiten |
| B6 | **Cookie-/Consent-Popup nötig** wegen Google reCAPTCHA (Datenübermittlung USA, Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO). | Datenschutzerklärung |
| B7 | **Inkonsistente Anrede.** Startseite mischt innerhalb weniger Absätze: „wie schmeckt **Ihr** Lieblingsbier?“ / „**Ihre** Gäste werden Brauer“ / „Für **EUER** Grillfest“ / „Sprecht **uns** an“. Ferienwohnung durchgehend „Sie“, Kontaktseite durchgehend „Ihr/Euch“. | `/`, `/ferienwohnung/`, `/home/kontakt/` |
| B8 | **Tippfehler.** Auswahl: „prikelndes“ (3×, statt prickelndes), „Verkaufstellen“ (durchgängig, statt Verkaufsstellen), „mir Freunden“ (statt mit), „Genussbierartenwochenende“ (statt Genussbiergarten-), „Life Musik“ (statt Live-Musik), „underschönen“, „Braueiführung“, „wietere Fragen“, „nach eigenne Wünschen“, „DIe helle Winterzicke“, „Edeka **Dexel**“ vs. „Edeka **Drexel**“ (dieselbe Verkaufsstelle, zwei Schreibweisen auf zwei Seiten), „Verein Regional Genuß erleben“ (Eigenname — bitte bestätigen). | diverse |
| B9 | **Überladene, doppelt verschachtelte Navigation.** 8 Top-Level-Punkte, davon 5 mit Untermenü; „Home“ hat ein Untermenü „Über uns“, Impressum/Datenschutz/Kontakt liegen als Unterseiten unter `/home/`. | Hauptmenü |

### 2.2 Zusätzlich gefunden (in PROJEKT.md nicht gelistet)

| # | Befund | Warum das zählt |
|---|---|---|
| N1 | **Zoom ist gesperrt:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">`. Sehbehinderte Nutzer können auf dem Smartphone nicht zoomen. | Verstoß gegen WCAG 1.4.4 (Resize Text) — harter Accessibility-Fehler |
| N2 | **Datumsfehler auf allen Einzelbeiträgen:** Jeder News-Beitrag zeigt als Datum das Jahr **2626** („17.06.2626“, „27.02.2626“, „24.07.2626“). In der Übersichtsliste ist das Datum korrekt. Systematischer Theme-Bug. | 46 Beiträge betroffen |
| N3 | **Die Biernamen existieren nicht als Text.** Auf `/unsere-biere/` sind „Helles“, „Klosterkeller“, „Weizen“, „Bock“, „Festbier“ ausschließlich als Bild-Grafiken vorhanden. Im HTML steht nur die Geschmacksbeschreibung. | Screenreader lesen die Produktnamen nicht vor; Google indexiert sie nicht. Größter SEO-Verlust der Seite |
| N4 | **Kaputte Überschriften-Hierarchie:** Startseite **6× `<h1>`**, „Über uns“ 4× `<h1>`, Ferienwohnung 3× `<h1>`. Umgekehrt haben `/unsere-verkaufstellen/`, `/home/impressum/` und `/home/kontakt/` **gar keine `<h1>`** — dort werden `<h4>` als optische Überschriften missbraucht. | Verstoß gegen WCAG 1.3.1; Google kann die Seitenhierarchie nicht lesen |
| N5 | **SEO-Datenleck in `og:description`:** Auf `/unsere-biere/` und `/ferienwohnung/` steht statt eines Textes der rohe Divi-Shortcode, inklusive einer fremden Bild-URL `https://www.bier.frankenried.i…` (offenbar eine alte Domain). Das ist der Text, den Facebook & Co. beim Teilen anzeigen. | Peinlich beim Teilen, verrät interne Struktur |
| N6 | **Toter Link Startseite → Hofladen St. Ottilien:** `https://erzabtei.de/hofladen/` (mit Schrägstrich) liefert **HTTP 404**. Auf `/unsere-verkaufstellen/` ist derselbe Link ohne Schrägstrich hinterlegt und funktioniert. | Kunde landet auf Fehlerseite |
| N7 | **Toter Link Verkaufsstellen → „Ferienwohnung am Wiesenweg, Frankenried“:** `https://www.hotelgasthof-schwanen.de/de/ferienwohnung-allgaeu.html` liefert **HTTP 404**. | s. o. |
| N8 | **Falsches Linkziel:** „Rosis Getränkemarkt in Frankenhofen“ verlinkt auf `https://www.kaeswerkstatt.de/kaeserei` — eine Käserei, nicht der Getränkemarkt. | Nutzer landen beim falschen Betrieb |
| N9 | **Zwei Verkaufsstellen-Links antworten mit HTTP 403** (Edeka Drexel, reinspaziert.eu). Das ist typisch für Bot-Abwehr und muss **manuell im Browser** gegengeprüft werden — nicht automatisch als kaputt werten. | Prüfpunkt |
| N10 | **Terminseiten sind leer.** `/termine-brauseminare/` zeigt „Keine Veranstaltungen vorhanden“ plus einen auf 0 stehenden Countdown. `/veranstaltungen/` und `/events-service/` zeigen einen leeren Monatskalender. Die einzigen 2026er Seminartermine (09.05. und 04.07.2026) stehen nur in einem News-Beitrag — und sind beide bereits vorbei. | Der wichtigste Conversion-Pfad (Seminar buchen) führt ins Leere |
| N11 | **Doppelter Textblock** auf `/brauseminar-2/`: Die beiden Absätze „Die Brauerei DEIN BIER hat sich auf den ganz persönlichen Biergenuss spezialisiert…“ und „Selber brauen mit den Profis!…“ stehen zweimal wortgleich untereinander. | Wirkt unfertig |
| N12 | **Footer-Copyright „© 2022“** — vier Jahre alt. | Wirkt verlassen |
| N13 | **Drei Anfrageformulare + ein Kontaktformular** senden über WordPress und sind durch Google reCAPTCHA geschützt (Einwilligung, US-Übermittlung, 2 Jahre Speicherdauer auf dem Endgerät). Ohne Einwilligung ist **kein Formular nutzbar**. | Der einzige Grund für den Consent-Banner |
| N14 | **Altersabfrage (`age-gate`-Plugin)** blendet auf jeder Seite ein Dialog-Overlay ein. Rechtlich für eine Bier-Website nicht zwingend, kostet aber jeden Erstbesucher einen Klick. | Entscheidung für den Relaunch nötig (→ OFFENE-FRAGEN Nr. 12) |
| N15 | **Preise stehen an mehreren Stellen im Netz:** PDF-Preisliste Leihinventar (verlinkt), Schadenspauschalen auf der Anfrageseite (12,50 €/Viertelstunde, 3 € pro Glas, 45 € pro Tisch …), Ferienwohnung 86 €/Tag + 15 €/Person + 50 € Haustier + 50 € Endreinigung, Brauseminar 53 € p. P. | Widerspricht der Vorgabe „keine Preise“ aus PROJEKT.md §5 → Klärung nötig (→ OFFENE-FRAGEN Nr. 6) |
| N16 | **Bildmaterial ist überwiegend zu klein.** Das Hero-Bild `startseite.png` misst 851 × 600 px, das Zirkuszelt existiert nur als 300 × 200-px-Thumbnail, Brauerei-Fotos 800 × 600 px. Nur wenige Aufnahmen sind groß genug (`DSC_4172` 2560 × 1701, `Die_Macher` 1280 × 1538, Ferienwohnung 1600 × 1200). | Für Hero-Flächen und Retina-Displays reicht das nicht |
| N17 | **Logo nur als 300 × 298-px-PNG.** Keine Vektordatei auffindbar. | Für Print, Favicon-Set und große Darstellung zu wenig |
| N18 | **Alt-Texte fehlen oder sind falsch.** Von 215 erfassten Bildeinbindungen haben viele ein leeres `alt`. Andere tragen als Alt-Text die Firmenadresse („DEIN BIER, Hausen 3, 87665 Mauerstetten“) statt einer Bildbeschreibung. Vier verschiedene Bierkisten-Bilder tragen alle denselben Alt-Text „16er Bierkiste Klosterkeller“. | WCAG 1.1.1 |
| N19 | **Nicht auffindbare Inhalte:** `/1523-2/`, `/news/`, `/ferienwohnung/1785-2/`, `/ferienwohnung/1813-2/`, `/brauseminar-2/` — URLs aus WordPress-IDs statt sprechender Pfade. Zusätzlich existieren `/news/` **und** `/1523-2/` mit demselben News-Inhalt (Duplicate Content). | SEO + Vertrauen |
| N20 | **Leichenseiten aus dem Events-Manager-Plugin:** `/veranstaltungen/veranstaltungsorte/`, `/veranstaltungen/kategorien/`, `/veranstaltungen/schlagwoerter/`, `/veranstaltungen/meine-buchungen/` sowie 3 `/locations/`-Seiten sind öffentlich und in der Sitemap, aber inhaltsleer. | Verwässert die Sitemap |

---

## 3 · Was funktioniert und übernommen wird

Die Substanz der Seite ist **inhaltlich stark** — das Problem ist die Verpackung, nicht der Text.

**Uneingeschränkt übernehmen (nur behutsam redigieren):**

- **Die Brauerei-Erzählung** („Wer in Hausen die Brauscheune von Michael Rink betritt, könnte sich
  für einen Moment in Düsentriebs Entenhausen wähnen…“). Das ist der beste Text der ganzen Seite —
  konkret, warm, ohne Marketing-Sprech. Gehört auf die Startseite.
- **Die Historie** („Beim ersten Sud wurde die Maische in einem großen Kochtopf angesetzt,
  anschließend diente die Bohrmaschine als Rührer. Durch die hohe Drehzahl wurde die Küche
  allerdings etwas mit Maische ausgekleidet. Zum großen Leidwesen der Hausfrau.“) — Gold.
- **Der Brauseminar-Bericht** in Reportageform (Hopfenfee, Trebermeister, Taschenlampe am
  Läuterbottich). Lang, aber lebendig.
- **Die Bierbeschreibungen** (5 Biere, sensorisch sauber formuliert).
- **Weitere Produkte** vollständig: Bierlikör, Bruier Fuier, Malzgelee (Natur/Chili/Zimt/Orange),
  Geschenkkörbe, Winterzicke, Glühbi.
- **Leihinventar** mit allen Maßen (Zirkuszelt 12 m/113 m², Faltpavillon 3 × 3 m, Garnituren
  2,20 × 0,50 m, Stehtische Ø 80 cm, Durchlaufkühler ein-/zweileitig, Rienza-Feuerschalengrill,
  Profi-Gläserspülmaschine 2,20 × 0,80 × 1,30 m/200 kg/16 A, 3 Großschirme Ø 3,60 m, Kleinschirme
  2 × 1,30 m, Partyfässer 10/20 l, Gläser, Krüge, Tischschürzen) inklusive Sicherheitshinweis zu
  Starkregen/Sturm.
- **Ferienwohnung „Landhof Eselblick“** komplett: Beschreibung, Ausstattungsliste, Umgebung,
  Auszeichnungen **Blauer Gockel** und **Allgäuer GenussMacher**.
- **16 Verkaufsstellen** mit vollständigen Adressen (siehe Abschnitt 4).
- **Mobile Brauerei — die technischen Anforderungen:** 32-A-Kraftstrom, Wasseranschluss, Abfluss,
  ca. 15 m² ebenerdige Stellfläche, indoor oder outdoor. Das ist der USP, konkret gemacht.
- **Handwerksdetails:** Reinheitsgebot 1516, Allgäuer Wasser, Malz aus einer Memminger Mälzerei,
  Hopfen aus der Hallertau, Sudpfanne elektrisch beheizt mit **Strom aus der eigenen
  Photovoltaikanlage**, Maischen von Hand gerührt, zylindrokonische Edelstahltanks, Gärung
  9–11 °C über 7–10 Tage, **mindestens 4 Wochen Lagerung**, Fassabfüllung vor Ort,
  Flaschenabfüllung extern.
- **Die Menschen:** Michael Rink (Diplom-Braumeister, TU München/Weihenstephan, zuvor freier
  Dienstleister in der Brauereiwirtschaft, Produktentwicklung und Qualitätskontrolle),
  Marlene Rink (Malzgelee-Kreationen), 3 Kinder, Hoftiere (Esel, Zwergzebus, Hühner, Katzen, Hund).
- **Gründungsgeschichte:** Brauereigebäude im **September 2016** eröffnet (deckt sich mit dem
  10-jährigen Jubiläum 2026); Mitgründer Julius Brzoska schied im Dezember 2021 aus.
- **Brauereiverkauf: Samstag 10:00–12:00 Uhr**, plus „Bierklingel“ außerhalb der Zeiten.

**Verwerfen:**

- Divi-Platzhaltertext, Copyright „© 2022“, doppelte Absätze.
- Der leere Events-Manager-Kalender inklusive aller `/locations/`- und Taxonomie-Seiten.
  Ersatz: eine gepflegte Terminliste aus einer Content Collection.
- Alle vier WordPress-Formulare samt reCAPTCHA → ersetzt durch vorbefüllte `mailto:`-Links.
- Der Countdown-Timer auf `/termine-brauseminare/` (steht auf 0).
- Doppelte News-Startseite (`/news/` **und** `/1523-2/`).
- Alle abgelaufenen Termine als eigene Seiten (Archiv-Charakter, kein Nutzen).

---

## 4 · Geerntete Fakten (vollständig, für den Neubau)

### 4.1 Stammdaten

| Feld | Wert |
|---|---|
| Firma | DEIN BIER M.Rink Brauerei |
| Inhaber / verantwortlich | Michael Rink |
| Anschrift | Hausen 3, 87665 Mauerstetten, Deutschland |
| Telefon | +49 151 28776077 (auf der Altseite als `tel:+4915128776077` korrekt hinterlegt) |
| E-Mail | info@deinbier-allgaeu.de |
| Facebook | https://www.facebook.com/Dein-Bier-326341181128402/ |
| Instagram | https://www.instagram.com/deinbier_allgaeu/ |
| Claim | „Echt Bayrische Bierkultur die Verbindet“ |
| Brauereiverkauf | Samstag 10:00–12:00 Uhr |
| Gründung Brauereigebäude | September 2016 |

### 4.2 Biere (5)

| Bier | Beschreibung (Altseite, wörtlich) |
|---|---|
| Helles | „Dem Klassiker verleihen ausgesuchte Malze eine goldgelb glänzende Farbe und einen malzaromatischen Charakter. Abgerundet durch dreimalige Hopfenzugabe, entsteht ein frisch prikelndes Helles Bier.“ |
| Klosterkeller | „Gebraut für die Erzabtei St. Ottilien… Malzaromatisch mit einem feinen Hopfenbitter, ein prikelndes Erlebnis wie aus dem Klosterkeller.“ |
| Weizen (Sommer) | „Mit einer kräftigen Schaumkrone ist unser naturtrübes, bernsteinfarbenes Weizen ein sommerlicher Genuss. Würzig, spritzig, fein prickelnd…“ |
| Bock | „Mit speziellen Malzen gebraut, glänzt unser heller Bock goldbraun aus dem Glas… Malzbetont und stark im Antrunk…“ |
| Festbier | „Bestes Röstmalz verleiht dem Bier sein bernsteinfarbenes Aussehen und sein malzig karamelliges Aroma.“ |

Ergänzend aus den News belegt: **alkoholfreies Helles** (Beitrag „Dein Bier hell alkoholfrei“),
**Starkbier** zur Fastenzeit, **5-l-Dose „Das kleine Fässchen“** (Helles).

Der Klosterkeller taucht in PROJEKT.md Abschnitt 1 nicht auf — er gehört ergänzt.

### 4.3 Weitere Produkte

Bierlikör (aus Festbier) · Bruier Fuier (Bierbrand aus Bockbier, Holzfasslagerung, Vanille- und
Holznoten) · Malzgelee (Natur, Chili, Zimt, Orange) · Geschenkkörbe · Winterzicke (Bockbier in der
1-l-Flasche, Winter) · Glühbi (Märzenbier mit Kirschsaft und Weihnachtsgewürzen, heiß zu genießen).

### 4.4 Gebinde

16er Holzträger · 6er Träger (0,3 l) · Fassbier 10, 20, 30, 50 l · Partyfässer 10 und 20 l ·
5-l-Dose.

### 4.5 Verkaufsstellen (16 + Direktverkauf)

| Verkaufsstelle | Adresse | Link | Status |
|---|---|---|---|
| Direktverkauf ab Hof | Hausen 3, 87665 Hausen — Samstag 10:00–12:00 | — | — |
| Stockheimer Landmarkt | Dorfstraße 39, 86825 Bad Wörishofen-Stockheim | stockheimer-landmarkt.de | OK |
| Dorfladen Waal | Marktplatz 3a, 86875 Waal | dorfladen-waal.de | OK |
| Ferienwohnung am Wiesenweg, Frankenried | Paul-Gaupp-Straße 1, 87665 Mauerstetten-Frankenried | hotelgasthof-schwanen.de | **404** |
| Getränkemarkt Hoetzl | Langwiesenweg 5, 86807 Buchloe | getraenke-hoetzl.de | OK |
| Dorfladen Ingenried | Welfenstraße 16, 86980 Ingenried | dorfladen-ingenried.de | OK |
| Reisach Früchtegarten | Alpenweg 16, 87665 Mauerstetten | reisach-fruechtegarten.de | OK |
| Dorfladen Eggenthal | Keltenstraße 10, 87653 Eggenthal | dorfladen.eggenthal.de | OK |
| Corona Kinoplex Kaufbeuren | Daniel-Kohler-Straße 1, 87600 Kaufbeuren | corona-kinoplex.de | OK |
| Hofladen Erzabtei St. Ottilien | Erzabtei 1, 86941 St. Ottilien | erzabtei.de/hofladen | OK (ohne Slash!) |
| Anita Guffler Schwabsoier Dorfladen | Kaufbeurer Straße 14, 86987 Schwabsoien | schwabsoien.de | OK |
| Edeka Drexel | Reutweg 2, 87677 Stöttwang-Thalhofen | edeka.de | 403, prüfen |
| Rosis Getränkemarkt Frankenhofen | Hauptstraße 65, 87662 Kaltental | **falsches Ziel** | prüfen |
| Reinspaziert | Amberger Straße 4, 86879 Wiedergeltingen | reinspaziert.eu | 403, prüfen |
| Bilderprofi Burg im Buroncenter | Josef-Landes-Straße 38, 87600 Kaufbeuren | facebook.com/DerBilderprofi | OK |
| Unikate Kerstins Bastelkiste Steinholz | Birkenfeldstraße 8, 87665 Mauerstetten | kerstinsbastelkiste.de | OK |

### 4.6 News-Bestand

46 Beiträge, vollständig gesichert unter `content/alt/news/`. Aktuellste fünf:
10 Jahre DEIN BIER (24.07.2026) · Das kleine Fässchen (17.06.2026) · Weizenbier ist wieder da
(17.06.2026) · Genussbiergartenzeit (17.06.2026) · Bock auf Bock? (27.02.2026).

**Jubiläumsprogramm 11.–13.09.2026** (aus dem Beitrag, ungekürzt):
Freitag ab 16 Uhr Biergarten mit „einer Überraschung in bewegten Bildern“ · Samstag 15–19 Uhr
Schmankerlmarkt und Kunsthandwerkermarkt, 16–18 Uhr Geiselschnalzer und Alphornbläser, ab 19 Uhr
Live-Musik · Sonntag 10:15 Uhr Festgottesdienst mit Gospelchor St. Martin und Männerchor
Liederkranz MOD, anschließend Frühschoppen mit Blasmusik, Kaffee und Kuchen, Schmankerlmarkt ·
Samstag und Sonntag Kinderprogramm. Partner: Verein Regional Genuss erleben (RGE).

Das ist der wichtigste Termin des Jahres — er gehört prominent auf die neue Startseite.

---

## 5 · Bewertung der Navigation

**Alt (8 Top-Level, 5 mit Untermenü, Rechtstexte unter „Home“ vergraben):**

```
Home ▸ Über uns
Unsere Biere ▸ Weitere Produkte
Events & Service ▸ Leihinventar · Anfrage Verleihinventar · Anfrage Veranstaltung
Brauereiseminare ▸ Termine Brauseminare
Verkaufstellen
Veranstaltungen
Ferienwohnung ▸ weitere Infos · Anfrage
News
```

Probleme: „Home“ als Menüpunkt mit Unterpunkt ist ein Widerspruch. Anfrageseiten sind eigene
Menüeinträge statt Aktionen auf der jeweiligen Seite. „Events & Service“ und „Veranstaltungen“
sind für Besucher nicht unterscheidbar. Impressum, Datenschutz und Kontakt liegen unter `/home/`.

**Neu (7 Top-Level, keine Verschachtelung — deckt sich mit PROJEKT.md §3):**
Brauerei · Biere · Brauseminare · Events & Verleih · Ferienwohnung · Verkaufsstellen · News.
Kontakt, Impressum und Datenschutz in den Footer. Anfragen werden zu `mailto:`-Aktionen auf der
jeweiligen Inhaltsseite statt zu Menüpunkten.

---

## 6 · Redirect-Bedarf (für Phase 9)

GitHub Pages kann keine Server-Redirects. Alte URLs mit Rang müssen daher über HTML-Weiterleitungs-
seiten (`<meta http-equiv="refresh">` + Canonical) aufgefangen werden:

| Alt | Neu |
|---|---|
| `/home/ueber-uns/` | `/brauerei/` |
| `/unsere-biere/`, `/unsere-biere/weitere-produkte/` | `/biere/` |
| `/brauseminar-2/`, `/termine-brauseminare/` | `/brauseminare/` |
| `/events-service/`, `/events-service/leihinventar/`, `/events-service/anfrage-verleihinventar/`, `/events-service/anfrage-veranstaltung/` | `/events-verleih/` |
| `/unsere-verkaufstellen/` | `/verkaufsstellen/` |
| `/ferienwohnung/1785-2/`, `/ferienwohnung/1813-2/` | `/ferienwohnung/` |
| `/1523-2/`, `/news/` | `/news/` |
| `/home/impressum/` | `/impressum/` |
| `/home/datenschutzvereinbarungen/` | `/datenschutz/` |
| `/home/kontakt/` | `/kontakt/` |
| 46 News-Beiträge | `/news/<slug>/` (Slugs bleiben erhalten) |
| `/veranstaltungen/*`, `/terminkalender/*`, `/locations/*` | `/news/` bzw. entfallen |

Zusätzlich: Die Altseite läuft auf **`www.`**. Die neue Seite braucht eine Entscheidung für eine
kanonische Variante (Empfehlung: `deinbier-allgaeu.de` ohne `www`, `www` per DNS-CNAME auf die
Apex-Domain) — siehe DEPLOY.md in Phase 9.

---

## 7 · Was der Relaunch strukturell gewinnt

| | Alt | Neu (Ziel) |
|---|---|---|
| Externe Requests | Google reCAPTCHA, Facebook, Instagram | **0** |
| Cookies | reCAPTCHA + Consent-Speicher | **0**, kein Banner |
| HTML-Gewicht Startseite | 281 KB | Zielwert < 40 KB |
| Meta-Description | 1 von 97 Seiten | jede Seite |
| JSON-LD | keins | `Brewery` + `Event` + `Product` |
| `<h1>` je Seite | 0 bis 6 | genau 1 |
| Zoom auf dem Handy | gesperrt | erlaubt |
| Produktnamen | nur als Bild | als Text |
| Formulare | 4 × WordPress + reCAPTCHA | vorbefüllte `mailto:`-Links |
| Wartung | WordPress + 6 Plugins aktualisieren | Markdown-Datei bearbeiten, Push |

---

## 8 · Quellenlage

- 97 HTML-Seiten abgerufen am 03.08.2026, Text als Markdown unter `content/alt/` abgelegt.
- `content/alt/_bilder.csv`: 215 Bildeinbindungen mit Quellseite, URL und Alt-Text.
- `content/alt/_links.csv`: 384 Links mit Quellseite, Linktext, Ziel und Klassifizierung.
- `content/alt/dateien/`: Preisliste Leihinventar (PDF), AGB Ferienwohnung (PDF), Logo (PNG 300 × 298).
- Alle 70 externen Linkziele per HTTP-Request geprüft.
