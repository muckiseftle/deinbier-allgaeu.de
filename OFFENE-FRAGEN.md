# OFFENE FRAGEN an den Betreiber

**Angelegt:** 03.08.2026 (Phase 0) · **Letzte Aktualisierung:** 03.08.2026

Diese Liste wächst über alle Phasen. Nichts hier wird erfunden — solange eine Frage offen ist,
steht an der betreffenden Stelle im Code ein `[PLATZHALTER: …]`.

**Legende:** 🔴 blockiert den Livegang · 🟡 wird für gute Qualität gebraucht · 🟢 Kür

---

## Rechtliches (Phase 7)

### 1. 🔴 Impressum — Rechtsform bestätigen
Die Altseite nennt „DEIN BIER M.Rink Brauerei, Inhaber des Unternehmens: Michael Rink“. Das deutet
auf ein **Einzelunternehmen** hin. Bitte bestätigen — oder die korrekte Rechtsform nennen
(e. K.? GbR? GmbH?). Bei Eintrag im Handelsregister zusätzlich: Registergericht und Registernummer.

### 2. 🔴 Umsatzsteuer-Identifikationsnummer
Ist eine USt-IdNr. nach § 27a UStG vorhanden? Wenn ja, wie lautet sie? (Wenn nein, entfällt die
Angabe ersatzlos — dann bitte kurz bestätigen, dass keine vorhanden ist.)

### 3. 🔴 Verbraucherschlichtung (§ 36 VSBG)
Üblich und für kleine Betriebe die Regel: „Wir sind nicht bereit und nicht verpflichtet, an
Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.“ Passt das, oder
besteht eine Teilnahmepflicht/-bereitschaft?

### 4. 🟡 Aufsichtsbehörde Lebensmittel-/Gewerberecht
Für Lebensmittelunternehmer wird gelegentlich die zuständige Aufsichtsbehörde im Impressum
genannt (hier vermutlich Landratsamt Ostallgäu). Soll das mit aufgenommen werden?

### 5. 🟡 Datenschutzerklärung — Speicherdauer von Anfragen
Wie lange werden E-Mail-Anfragen aufbewahrt, bevor sie gelöscht werden? Vorschlag als Platzhalter:
„bis zur vollständigen Bearbeitung der Anfrage, längstens jedoch 6 Monate; gesetzliche
Aufbewahrungsfristen bleiben unberührt“. Bitte bestätigen oder korrigieren.

---

## Inhalt und Preise

### 6. 🔴 Preise auf der Website — ja oder nein?
PROJEKT.md legt „keine Preise“ fest. Die **alte Seite veröffentlicht aber an vier Stellen Preise**:

| Fundstelle | Inhalt |
|---|---|
| PDF „Preisliste Leihinventar“ (verlinkt) | komplette Mietpreise |
| `/events-service/anfrage-verleihinventar/` | 12,50 € je angefangene Mitarbeiter-Viertelstunde, 3 € pro Glas/Krug, 45 € pro Tisch, 22,50 € pro Bank, 30 €/220 € Sonnenschirme, 25 € Spanngurt, 15 € CO₂-Pfand, 65 € Durchlaufkühler-Einstellung |
| `/ferienwohnung/1785-2/` | 86 € für 2 Personen pro Tag, jede weitere Person 15 €, Haustier 50 €, Endreinigung 50 € |
| News „Termine öffentliche Brauseminare 1. Halbjahr 2026“ | Brauseminar 53 € pro Person |

Einordnung: Bei **Bier** löst eine Preisangabe die Grundpreispflicht nach PAngV aus (€ pro Liter) —
deshalb dort bewusst keine Preise. Bei **Ferienwohnung, Seminaren und Verleih** ist eine
Preisangabe unproblematisch und für Gäste sogar hilfreich; bei der Ferienwohnung erwarten
Buchende sie geradezu.

**Empfehlung:** Bierpreise weglassen („im Brauereiverkauf"). Seminar-, Verleih- und
Ferienwohnungspreise übernehmen, sofern sie aktuell sind. **Bitte entscheiden — und falls
übernommen: sind die oben genannten Beträge noch gültig?**

### 7. 🔴 Öffnungszeiten Brauereiverkauf
Die Altseite nennt an zwei Stellen **Samstag 10:00–12:00 Uhr** sowie: „Samstags keine Zeit? Dann
kommt einfach vorbei, wenn es Euch passt, und klingelt an unserer Bierklingel.“ Ist das weiterhin
korrekt? Gibt es Ferien-/Feiertagsausnahmen? (Wird auch für das JSON-LD `openingHours` gebraucht.)

### 8. 🔴 Aktuelle Brauseminar-Termine
Die Seite `/termine-brauseminare/` ist leer, die letzten veröffentlichten Termine (09.05. und
04.07.2026) sind vorbei. **Welche Termine stehen für das 2. Halbjahr 2026 und für 2027 fest?**
Ohne Termine bleibt der wichtigste Conversion-Pfad der Seite eine Sackgasse.
Bitte außerdem bestätigen: Beginn 11 Uhr, Dauer 5–6 Stunden, Mindestteilnehmerzahl 5, Anmeldung
bis 3 Tage vorher, Getränke und Brotzeit inklusive, eigenes Bier nach 5–6 Wochen abholbar.

### 9. 🔴 Bierliste bestätigen
Die Altseite zeigt **fünf** Biere: Helles, **Klosterkeller** (für die Erzabtei St. Ottilien
gebraut), Weizen, Bock, Festbier. In PROJEKT.md fehlt der Klosterkeller. Zusätzlich in den News
erwähnt: **alkoholfreies Helles**, Starkbier zur Fastenzeit, Winterzicke, Glühbi.
**Welche Biere sind aktuell im Programm, welche saisonal, welche ausgelaufen?**
Und: Sollen **Stammwürze und Alkoholgehalt** je Bier angegeben werden? (Das wirkt fachlich stark,
ist aber keine Pflicht.)

### 10. 🟡 Nährwert- und Zutatenangaben
Seit Dezember 2023 gelten für alkoholische Getränke über 1,2 % vol EU-weit erweiterte
Kennzeichnungspflichten (Zutatenverzeichnis und Nährwertdeklaration). Für die **Etiketten** ist
das Pflicht — für die Website nicht. **Frage:** Sollen die Angaben trotzdem auf der Website
stehen (z. B. als PDF oder pro Bier)? Das wäre ein Vertrauensplus und würde einen echten
Mehrwert gegenüber der Altseite schaffen.

### 11. 🟡 Verkaufsstellen prüfen
- **„Ferienwohnung am Wiesenweg, Frankenried"** — der hinterlegte Link ist tot (404). Neue
  Adresse/Website? Oder Verkaufsstelle entfallen?
- **„Rosis Getränkemarkt in Frankenhofen"** — verlinkt derzeit auf eine **Käserei**
  (kaeswerkstatt.de). Richtige Website?
- **Edeka Drexel** und **reinspaziert.eu** antworten mit HTTP 403 (vermutlich Bot-Abwehr) —
  bitte kurz im Browser gegenprüfen.
- Sind alle 16 Verkaufsstellen noch aktiv? Sind neue dazugekommen?
- Schreibweise: „Edeka **Drexel**" oder „Edeka **Dexel**"? (Auf der Altseite beides.)

### 12. 🟡 Altersabfrage beibehalten?
Die Altseite blendet über das Plugin `age-gate` bei jedem Erstbesuch eine Altersabfrage ein.
Rechtlich ist das für eine Brauerei-Website **nicht zwingend**; der Deutsche Werberat verlangt
lediglich, dass Alkoholwerbung sich nicht an Minderjährige richtet. Eine Altersabfrage kostet
jeden Besucher einen Klick und lässt sich ohne Cookie technisch ohnehin nicht durchhalten
(und ein Cookie würde die cookiefreie Architektur brechen).
**Empfehlung:** weglassen, stattdessen der klare Hinweis im Footer („Kein Alkohol an Personen
unter 16 Jahren, Spirituosen erst ab 18"). **Bitte bestätigen.**

### 13. 🟡 Vereinsname bestätigen
Im Jubiläumsbeitrag steht „Verein Regional Genuß erleben (RGE)“. Korrekte Schreibweise des
Eigennamens? Gibt es eine Website des Vereins zum Verlinken?

### 14. 🟢 Ferienwohnung — Buchungsweg
Aktuell: Anfrageformular plus ein Link „zum Belegungsplan“. **Wie soll das neu laufen?**
Reicht eine `mailto:`-Anfrage? Gibt es einen Belegungskalender, der verlinkt werden kann?
Und: Ist die Ferienwohnung auf einem Buchungsportal gelistet (FeWo-direkt, Airbnb, Allgäu-Portal)?
Ein externer Link wäre datenschutzrechtlich unproblematisch, ein eingebetteter Kalender nicht.

---

## Material und Medien (Phase 5)

### 15. 🔴 Original-Fotos in hoher Auflösung
Das vorhandene Material reicht für einen modernen Auftritt nicht aus:

| Motiv | vorhanden | gebraucht |
|---|---|---|
| Hero Startseite | `startseite.png` 851 × 600 | ≥ 2400 px Breite |
| Brauscheune außen | 800 × 600 | ≥ 2000 px |
| Mobile Brauerei / Anhänger | 800 × 450 | ≥ 2000 px |
| Zirkuszelt | **300 × 200** (Thumbnail!) | ≥ 1600 px |
| Bierflaschen freigestellt | 147 × 598 | ≥ 1200 px Höhe |
| Michael & Marlene Rink | 1280 × 1538 ✅ | reicht |
| Ferienwohnung | 1600 × 1200 ✅ | reicht |
| Jubiläums-/Festfoto | 2560 × 1701 ✅ | reicht |

**Bitte die Originale aus der Kamera liefern** (JPG direkt vom Fotoapparat, ungeschnitten).
Besonders wichtig: **die mobile Brauerei auf dem Anhänger** — das ist der USP und der stärkste
Bildkandidat für den Hero.

### 16. 🔴 Logo als Vektordatei
Das runde Logo liegt nur als **PNG mit 300 × 298 px** vor. Für Favicon-Set, Druck und große
Darstellung wird eine **SVG-, AI- oder EPS-Datei** gebraucht. Existiert eine? Falls nicht: Wer hat
das Logo gestaltet, und liegt dort noch die Originaldatei?

### 17. 🟡 Video vorhanden?
Im Jubiläumsbeitrag ist von „einer Überraschung in bewegten Bildern“ die Rede. Gibt es Videomaterial
von der Brauerei oder von Seminaren? Randbedingung: Die Datei muss **unter 100 MB** bleiben
(GitHub-Limit) und wird selbst gehostet — kein YouTube-Einbettung.

### 18. 🟡 Etiketten-Motive
Die individuellen Bieretiketten (Hochzeitsbier, Vereinsbier, Firmenbier, „Bartaxt“, „Kraftstoff“,
„Physio“) sind ein starkes Markenfeature und ein Kandidat für das Signature-Element der neuen
Seite. **Gibt es die Etiketten in hoher Auflösung oder als Druckdatei?** Und: Dürfen die
Kundenetiketten öffentlich gezeigt werden (Einverständnis der jeweiligen Kunden)?

### 19. 🟢 Auszeichnungen und Mitgliedschaften
Auf der Ferienwohnungsseite tauchen **Blauer Gockel** und **Allgäuer GenussMacher** auf.
Gibt es weitere Mitgliedschaften, Prämierungen oder Zertifikate (z. B. Bio, regionale
Herkunftszeichen, Brauerbund)? Und dürfen die Logos verwendet werden?

---

## Technik und Betrieb (Phase 9)

### 20. 🔴 Domain und DNS
- Wo liegt die Domain `deinbier-allgaeu.de` aktuell (Registrar/Provider — vermutlich All-Inkl)?
- Bestehen dort **Zugangsdaten** für DNS-Änderungen, oder soll die Änderung angefordert werden?
- **Wann** soll umgestellt werden? (DNS-Propagation dauert bis zu 48 Stunden.)
- Kanonische Adresse: **`deinbier-allgaeu.de`** (ohne `www`) oder weiter mit `www`?
  Empfehlung: ohne `www`, `www` leitet weiter. Die Altseite läuft auf `www`.

### 21. 🔴 GitHub-Account und Repository
Der Code liegt unter `https://github.com/muckiseftle/deinbier-allgaeu.de`.
- Soll das Repository **öffentlich oder privat** sein? (GitHub Pages funktioniert bei beidem, im
  kostenlosen Plan aber nur mit öffentlichem Repo für eigene Domains — bitte prüfen.)
- Soll Michael Rink als Mitarbeiter Zugriff bekommen, damit er News selbst pflegen kann?

### 22. 🔴 E-Mail-Postfach
Alle Anfragen laufen künftig per `mailto:` an **info@deinbier-allgaeu.de**. Ist dieses Postfach
unabhängig vom All-Inkl-Hosting-Paket? **Wenn die E-Mail-Adresse am Hosting-Vertrag hängt, darf
der Vertrag nicht gekündigt werden, bevor das Postfach umgezogen ist.**

### 23. 🔴 Altes Hosting kündigen — wann?
Vorschlag: erst kündigen, wenn (a) die neue Seite live und über die Domain erreichbar ist,
(b) das E-Mail-Postfach gesichert oder umgezogen ist, (c) ein vollständiges Backup der alten
WordPress-Installation inklusive Mediathek existiert. Kündigungsfrist bei All-Inkl bitte prüfen.

### 24. 🟡 Wer pflegt die News künftig?
Ohne WordPress-Backend werden News als Markdown-Dateien gepflegt. Optionen:
**(a)** Michael Rink bearbeitet Dateien direkt auf github.com im Browser (kostenlos, etwas
technisch), **(b)** ein Git-basiertes Redaktions-Tool wie Decap CMS oder Pages CMS (komfortabel,
braucht aber einen Login und damit ggf. eine Datenschutz-Ergänzung), **(c)** Änderungen laufen
weiterhin über den Betreuer.
**Bitte entscheiden** — das beeinflusst die Struktur der Content Collections in Phase 3.

### 25. 🟡 Social Media
Facebook-Seite und Instagram-Profil sind vorhanden und werden im Footer verlinkt (reiner Link,
kein Embed, kein Pixel). Sind beide aktuell? Gibt es weitere Kanäle?

### 26. 🟢 Statistik
Standard ist: **kein Tracking, keine Analyse**. Falls doch Besucherzahlen gewünscht sind, ginge
das datenschutzfreundlich per serverseitigem Log oder einem selbst gehosteten Dienst — beides
erfordert allerdings zusätzliche Infrastruktur (GitHub Pages liefert keine Logs) und eine
Erweiterung der Datenschutzerklärung. **Bedarf vorhanden?**

---

## Erledigt

_(noch nichts — die Liste wird beim Beantworten fortgeschrieben)_
