# OFFENE FRAGEN an den Betreiber

**Angelegt:** 03.08.2026 (Phase 0) · **Letzte Aktualisierung:** 03.08.2026 (nach Phase 1)

Diese Liste wächst über alle Phasen. Nichts hier wird erfunden — solange eine Frage offen ist,
steht an der betreffenden Stelle im Code ein `[PLATZHALTER: …]`.

**Legende:** 🔴 blockiert den Livegang · 🟡 wird für gute Qualität gebraucht · 🟢 Kür

---

## Rechtliches (Phase 7)

> **Stand nach Phase 7 (04.08.2026):** Beide Rechtstexte sind ausformuliert und
> online. Es fehlen noch **vier Angaben**, die nur der Betreiber liefern kann:
> Nummer 1, 2, 3 und 5. Sie sind auf den Seiten als sichtbarer Platzhalter
> markiert, damit sie beim Livegang nicht übersehen werden.
>
> **Recherchiert und eingearbeitet:** Die EU-Plattform zur Online-Streitbeilegung
> wurde zum **20.07.2025 abgeschaltet**, die ODR-Verordnung ist durch die
> Verordnung (EU) 2024/3228 vollständig aufgehoben. Der früher pflichtige Link
> **darf nicht mehr auftauchen** und steht deshalb nirgends. Viele
> Impressum-Generatoren liefern ihn noch mit. Geprüft: er kommt auf keiner der
> 80 Seiten vor.
>
> Ebenfalls geprüft: **GitHub ist unter dem EU-U.S. Data Privacy Framework
> zertifiziert**, die Übermittlung in die USA hat damit eine tragfähige
> Grundlage. Der Status kann sich ändern und sollte bei größeren Änderungen
> erneut geprüft werden.

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

### 6. ✅ Preise auf der Website — **entschieden: nein** (03.08.2026)
→ siehe „Erledigt“ am Ende des Dokuments.

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

### 12. ✅ Altersabfrage — **entschieden: bleibt** (03.08.2026)
→ siehe „Erledigt“ am Ende des Dokuments. Eine Restfrage dazu ist offen: **Nr. 27**.

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

### 16. 🔴 Logo als Vektordatei — **vorhanden, wird gebraucht**
Bestätigt am 03.08.2026: Eine Vektordatei existiert. **Sie liegt noch nicht vor.**

Bitte die Datei ins Repository legen unter `assets/logo/` oder per Mail schicken.
Gebraucht wird: **SVG oder AI/EPS** des Volllogos, Pfade statt eingebetteter Rasterbilder,
Schrift in Kurven umgewandelt.

Daraus abgeleitet werden dann (das übernehme ich): reduzierte Fassung ohne Fußband,
Hopfen-Signet, Wagen-Signet, einfarbige Fassungen sowie das vollständige Favicon-Set
(`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192`, `icon-512`, `icon-512-maskable`).

**Warum das blockiert:** Das vorhandene PNG hat 300 × 298 px. Für die Kopfzeile auf einem
Retina-Display reicht das nicht — es würde unscharf. Phase 2 und 4 können mit dem PNG arbeiten,
der Livegang nicht. Details zur Logo-Analyse und den Verwendungsregeln: `BRAND.md` Abschnitt 2.

### 17. 🟡 Video vorhanden?
Im Jubiläumsbeitrag ist von „einer Überraschung in bewegten Bildern“ die Rede. Gibt es Videomaterial
von der Brauerei oder von Seminaren? Randbedingung: Die Datei muss **unter 100 MB** bleiben
(GitHub-Limit) und wird selbst gehostet — kein YouTube-Einbettung.

### 18. 🟡 Etiketten-Motive — **vorhanden, werden gebraucht**
Bestätigt am 03.08.2026: Die Etiketten liegen in hoher Auflösung vor. **Sie liegen noch nicht bei.**

Bitte die Dateien liefern (Druckdateien oder Bilder ab ca. 1600 px Kantenlänge) — gern auch
mehr als die sechs von der Altseite bekannten Motive (Hochzeitsbier, Vereinsbier, Dorfladen Waal,
Stockheimer, „Bartaxt“, „Kraftstoff“, „Physio“, Michelin).

**Eine Rückfrage bleibt:** Dürfen die **Kundenetiketten** öffentlich gezeigt werden — liegt für
Firmen- und Hochzeitsetiketten das Einverständnis der jeweiligen Kunden vor? Falls unklar, zeigen
wir nur eigene Motive und anonymisierte Beispiele.

Verwendung: Die Etiketten bekommen einen eigenen Abschnitt auf `/brauseminare/`. Als
Signature-Element der Gesamtseite wurden sie **nicht** gewählt — Begründung in `BRAND.md`
Abschnitt 8.

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

---

## Neu aus Phase 1 (Brandkit)

### 27. 🟡 Altersabfrage — ab welchem Alter, und was passiert bei „Nein“?
Die Altersabfrage bleibt (Entscheidung Nr. 12). Drei Details fehlen noch:

1. **Altersgrenze:** **16** (Bier) oder **18** (weil auch Bierbrand und Bierlikör im Sortiment
   sind)? Die Altseite ließ das im Dialogtext offen („Verify you are over %s years of age?“ —
   der Platzhalter wurde nie ersetzt). **Empfehlung: 16**, mit dem Hinweis, dass Spirituosen
   erst ab 18 abgegeben werden.
2. **Bei „Nein“:** Weiterleitung wohin? Üblich ist eine ruhige Hinweisseite („Schön, dass Du da
   warst — komm in ein paar Jahren wieder“) statt eines Rauswurfs auf eine fremde Seite.
   **Empfehlung: eigene Hinweisseite.**
3. **Abfrageart:** einfache Ja/Nein-Frage oder Geburtsdatumseingabe? **Empfehlung: Ja/Nein** —
   eine Geburtsdatumseingabe erhebt personenbezogene Daten und macht die Sache
   datenschutzrechtlich unnötig kompliziert.

### 28. 🟢 Claim: „Bayrische“ oder „Bairische“?
Der Claim lautet auf der Altseite und im Logo „Echt Bayrische Bierkultur die Verbindet“.
Sprachlich üblich wäre für den Dialekt „bairisch“, für den Bezug zum Bundesland „bayerisch“;
„bayrisch“ ist die umgangssprachliche Kurzform. Da die Schreibweise im **Logo festgeschrieben**
ist, würde ich sie **unverändert übernehmen** und nur die Kommasetzung korrigieren
(„Echt Bayrische Bierkultur, die verbindet“). **Bitte bestätigen.**

### 29. 🟢 Weitere Marken-Textbausteine
Vorschlag für wiederkehrende Zeilen, die aus dem Bestand abgeleitet sind:
**„Die Brauerei kommt zu Euch.“** (mobile Brauerei) und **„Ihr rührt mit.“** (Seminare).
Passt das zur Selbstwahrnehmung, oder klingt es zu forsch?
Die Signaturzeile **„zu Hause(n) gebraut“** stammt unverändert aus dem Logo und wird gesetzt.

---

## Neu aus Phase 5 (Bilder und Social-Preview)

### 30. 🔴 Social-Preview-Bild zeigt erkennbare Personen
Das Bild, das beim Teilen der Seite auf WhatsApp, Facebook und Co. erscheint
(`public/og-bild.jpg`), zeigt fünf Teilnehmerinnen und Teilnehmer eines
Brauseminars mit ihren Bierkenner-Diplomen. Es stammt von der alten Website.

**Warum ich nachfrage:** Auf der eigenen Website ist das Foto seit Jahren
öffentlich, ein Einverständnis liegt also vermutlich vor. Als Vorschaubild
bekommt es aber eine deutlich größere Reichweite: Es erscheint bei **jedem**
geteilten Link, auch in fremden Chats und Timelines. Das ist eine andere
Nutzungsintensität als eine Unterseite.

**Bitte bestätigen**, dass die abgebildeten Personen mit dieser Verwendung
einverstanden sind. Falls unklar oder unangenehm: Ich tausche das Foto in
zwei Minuten gegen eine Aufnahme ohne Gesichter (Vorschlag: die Gär- und
Lagertanks oder der Brauereigarten). Sagt einfach Bescheid.

### 31. 🟡 Video vorhanden?
PROJEKT.md sieht ein selbst gehostetes Video vor (Datei unter 100&nbsp;MB,
`preload="none"`, Posterbild, kein YouTube). **Es liegt kein Videomaterial
vor**, deshalb ist auf der Seite derzeit keines eingebunden. Im
Jubiläumsbeitrag ist von „einer Überraschung in bewegten Bildern“ die Rede,
also existiert womöglich etwas.

Falls Material vorhanden ist: gerne liefern, ich binde es ein. Falls nicht,
bleibt es dabei, und die Seite kommt gut ohne aus.

### 33. 🟡 Sechs Fotos fehlen noch konkret
Nach dem Einbau aller verfügbaren Bilder von der Altseite stehen **noch genau
sechs Stellen** auf `/events-verleih/` ohne Foto. Für diese Gegenstände gab es
auf der Altseite schlicht keine Aufnahme:

| # | Motiv | Wo es fehlt |
|---|---|---|
| 1 | Großer Sonnenschirm mit Standfuß | Leihinventar, Überdachung |
| 2 | Kleiner Sonnenschirm an einer Bierzeltgarnitur | Leihinventar, Überdachung |
| 3 | Partyfass mit Zapfhahn | Leihinventar, Ausschank |
| 4 | Profi-Gläserspülmaschine | Leihinventar, Ausschank |
| 5 | Tischschürze an einem Garniturentisch | Leihinventar, Ausschank |
| 6 | Spanngurte | Leihinventar, Ausschank |

**Das eilt nicht.** An diesen Stellen steht ein gestalteter Platzhalter, keine
kaputte Fläche. Aber sechs Handyfotos beim nächsten Aufbau würden die Seite
merklich vollständiger machen. Querformat genügt, ab etwa 1600&nbsp;px Breite.

Zwei weitere Motive wären ein Gewinn, sind aber kein Muss:
**der Anhänger im Einsatz bei einem Fest** (das vorhandene Foto ist nur
800&nbsp;× 450&nbsp;px) und **die Brauscheune von außen bei Abendlicht**
(vorhanden nur 800&nbsp;× 600&nbsp;px). Beide sind eingebaut, aber klein
gehalten, weil sie größer unscharf würden.

### 32. 🟡 Favicon-Set ist noch behelfsmäßig
Das Symbolset (`favicon.ico`, `apple-touch-icon.png`, `icon-192`, `icon-512`,
`icon-512-maskable`) ist aus dem 300-px-PNG erzeugt. Die Größen ab 192&nbsp;px
sind daher hochskaliert und nicht scharf.

Sobald die Vektordatei vorliegt (Nr. 16), erzeuge ich das Set neu; das Skript
dafür liegt fertig unter `werkzeuge/favicons.ps1`. Bis dahin gilt: Der
Browser-Tab zeigt ein erkennbares, aber leicht weiches Symbol.

---

## Neu aus Phase 4 (Hintergrundmotive)

### 34. 🔴 Lizenz der beiden Motivdateien ungeklärt

Am 04.08.2026 wurden zwei SVG-Dateien bereitgestellt:
`hop_5381095.svg` und `wheat_1748176.svg`. Sie sind jetzt die
Hintergrundmotive der Startseite und der sechs Themenseiten
(`public/motive/hopfen.svg`, `public/motive/gerste.svg`).

**Die Dateinamen tragen Kennnummern, wie sie Icon-Portale vergeben.** Bei
den gängigen Portalen gilt für die kostenlose Nutzung:

- Eine **Namensnennung** ist Pflicht, meist als Zeile im Impressum oder
  Footer („Icon von … über …").
- Das Icon darf **nicht als Hauptelement** auftreten und nicht
  weitergegeben werden.
- Mit einer bezahlten Lizenz entfällt die Namensnennung.

**Zu klären, vor dem Livegang:**

1. Woher stammen die beiden Dateien?
2. Liegt eine bezahlte Lizenz vor — dann bitte den Nachweis ablegen.
3. Falls nicht: Welcher Nennungstext ist gefordert? Ich setze ihn ins
   Impressum.

**Warum das blockiert:** Eine fehlende Namensnennung ist bei kommerzieller
Nutzung ein Abmahnrisiko. Der Aufwand für die Lösung ist klein — eine Zeile
im Impressum —, aber sie muss vor dem Livegang stehen.

---

## Erledigt

### ✅ 6 · Preise auf der Website — **nein** (entschieden 03.08.2026)

Auf der neuen Website erscheinen **keine Preise**. Das gilt für alle Bereiche: Biere,
Brauseminare, Leihinventar und Ferienwohnung.

**Was das konkret bedeutet:**

- Statt Preisen: „Preise im Brauereiverkauf“, „Preisliste auf Anfrage“, „Wir machen Euch gern
  ein Angebot“.
- Die **PDF-Preisliste Leihinventar** wird auf der neuen Seite **nicht** verlinkt.
- Die **Schadenspauschalen** von der Anfrageseite (12,50 €/Viertelstunde, 3 € pro Glas …)
  entfallen auf der Website. Sie gehören ohnehin in die Mietbedingungen, nicht ins Schaufenster —
  am besten als PDF, das bei einer konkreten Anfrage mitgeschickt wird.
- Die **Ferienwohnungspreise** (86 € für 2 Personen usw.) entfallen ebenfalls.
- Der **Seminarpreis** (53 € p. P.) entfällt.

Ein Hinweis, damit die Entscheidung bewusst bleibt: Bei der **Ferienwohnung** ist das die
spürbarste Folge — Gäste suchen dort erfahrungsgemäß zuerst nach dem Preis, und die Anfragen
werden mehr und unverbindlicher. Falls sich das im Betrieb als lästig erweist, lässt sich für
diese eine Seite später eine Preisangabe nachrüsten, ohne den Rest anzufassen. Als Kompromiss
ginge auch eine Spanne („ab … € pro Nacht“). Die Entscheidung bleibt bis auf Widerruf: keine Preise.

### ✅ 12 · Altersabfrage — **bleibt** (entschieden 03.08.2026)

Die neue Seite bekommt wieder eine Altersabfrage. Umsetzung ohne WordPress-Plugin, selbst gebaut.

**Technische Folge, die festgehalten werden muss:** Damit die Abfrage nicht bei jedem Seitenaufruf
erneut erscheint, muss die Antwort auf dem Gerät gespeichert werden. Verwendet wird
**`localStorage`** — kein Cookie, keine Übertragung an einen Server, kein Drittanbieter.

**Was das für den Datenschutz heißt:**

- **Ein Cookie-Banner wird weiterhin nicht nötig.** Es wird nichts übertragen, nichts
  ausgewertet, nichts an Dritte gegeben. Der Wert bleibt auf dem Gerät und enthält lediglich
  ein Ja.
- Die **Datenschutzerklärung bekommt einen kurzen eigenen Absatz** dazu (Phase 7).
- Die Abnahme-Checkliste in PROJEKT.md §9 fordert „**kein Storage-Zugriff**“. Das ist damit die
  **einzige bewusste Abweichung** vom ursprünglichen Plan. Sie wird in `QA.md` (Phase 8)
  ausdrücklich als solche vermerkt, nicht stillschweigend übergangen.

**Wie es gebaut wird:**

- Der Seiteninhalt steht **vollständig im HTML**, die Abfrage legt sich nur darüber. Damit
  bleibt die Seite für Suchmaschinen und für Nutzer ohne JavaScript vollständig lesbar.
- Der Dialog ist **tastaturbedienbar**, fängt den Fokus, lässt sich mit `Esc` nicht umgehen und
  meldet sich korrekt an Screenreader (`role="dialog"`, `aria-modal`, beschriftet).
- Er ist im Markenlook gestaltet, nicht als graues Standard-Overlay.

Offene Detailfragen dazu: **Nr. 27**.

### ✅ 16 · Logo als Vektordatei — **existiert** (bestätigt 03.08.2026)
Die Datei liegt noch nicht vor. Die Anforderung steht weiterhin oben unter Nr. 16.

### ✅ 18 · Etiketten in hoher Auflösung — **existieren** (bestätigt 03.08.2026)
Die Dateien liegen noch nicht vor. Die Anforderung steht weiterhin oben unter Nr. 18.
