# content/alt — Rohabzug der alten Website

Vollständiger Inhaltsabzug von `www.deinbier-allgaeu.de` (WordPress/Divi), abgerufen am **03.08.2026**.
Grundlage: alle 97 URLs aus `https://www.deinbier-allgaeu.de/wp-sitemap.xml`.

**Dieser Ordner ist ein Archiv, keine Quelle für den Build.** Er dient dazu, beim Neuschreiben der
Texte nichts zu verlieren und jede Faktenangabe belegen zu können. Die fertigen Inhalte entstehen in
Phase 4 als Astro Content Collections unter `src/content/`.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `seiten/` | 24 statische Seiten |
| `news/` | 46 News-Beiträge |
| `termine/` | 24 Termin-Objekte aus dem Events-Manager-Plugin (überwiegend vergangen) |
| `locations/` | 3 Veranstaltungsorte aus dem Plugin (inhaltsleer) |
| `_bilder.csv` | alle Bildeinbindungen mit Quellseite, URL und Alt-Text |
| `_links.csv` | alle Links mit Quellseite, Linktext, Ziel und intern/extern |
| `dateien/` | verlinkte PDFs und das Logo im Original |

Jede Markdown-Datei trägt im Frontmatter die Quell-URL, den ursprünglichen `<title>`, die
Meta-Description (meist `FEHLT`), das OG-Bild sowie Veröffentlichungs- und Änderungsdatum.

> Hinweis zu den Datumsangaben: Die Altseite zeigt auf **Einzelbeiträgen** durchgehend das
> falsche Jahr `2626` (Theme-Bug, siehe AUDIT.md N2). Verlässlich ist das Feld `veroeffentlicht`
> im Frontmatter, das aus den Open-Graph-Metadaten stammt.

## seiten

| Titel | Datei | Quelle | Veröffentlicht |
|---|---|---|---|
| Brauerei News | `1523-2.md` | https://www.deinbier-allgaeu.de/1523-2/ | 2022-09-25 09:26:40 |
| Brauereiseminare | `brauseminar-2.md` | https://www.deinbier-allgaeu.de/brauseminar-2/ | 2021-03-14 14:56:04 |
| Anfrage Veranstaltung | `events-service_anfrage-veranstaltung.md` | https://www.deinbier-allgaeu.de/events-service/anfrage-veranstaltung/ | 2022-02-13 17:54:36 |
| Anfrage Verleihinventar | `events-service_anfrage-verleihinventar.md` | https://www.deinbier-allgaeu.de/events-service/anfrage-verleihinventar/ | 2022-02-01 20:27:58 |
| Leihinventar | `events-service_leihinventar.md` | https://www.deinbier-allgaeu.de/events-service/leihinventar/ | 2022-02-01 21:42:32 |
| Events & Service | `events-service.md` | https://www.deinbier-allgaeu.de/events-service/ | 2021-04-20 08:15:06 |
| Ferienwohnung weitere Infos | `ferienwohnung_1785-2.md` | https://www.deinbier-allgaeu.de/ferienwohnung/1785-2/ | 2023-03-05 16:55:36 |
| Anfrage Ferienwohnung | `ferienwohnung_1813-2.md` | https://www.deinbier-allgaeu.de/ferienwohnung/1813-2/ | 2023-03-05 18:01:58 |
| Ferienwohnung | `ferienwohnung.md` | https://www.deinbier-allgaeu.de/ferienwohnung/ | 2023-03-05 10:15:29 |
| Datenschutzvereinbarungen | `home_datenschutzvereinbarungen.md` | https://www.deinbier-allgaeu.de/home/datenschutzvereinbarungen/ | 2021-03-11 18:22:32 |
| Impressum | `home_impressum.md` | https://www.deinbier-allgaeu.de/home/impressum/ | 2021-03-11 18:34:42 |
| Kontakt | `home_kontakt.md` | https://www.deinbier-allgaeu.de/home/kontakt/ | 2021-03-13 15:37:53 |
| Über uns | `home_ueber-uns.md` | https://www.deinbier-allgaeu.de/home/ueber-uns/ | 2022-01-28 09:20:48 |
| Dein Bier – Echte Bayrische Bierkultur die Verbindet | `index.md` | https://www.deinbier-allgaeu.de/ |  |
| News | `news.md` | https://www.deinbier-allgaeu.de/news/ | 2026-07-24 15:48:29 |
| Termine Brauseminare | `termine-brauseminare.md` | https://www.deinbier-allgaeu.de/termine-brauseminare/ | 2022-10-03 11:24:29 |
| Weitere Produkte | `unsere-biere_weitere-produkte.md` | https://www.deinbier-allgaeu.de/unsere-biere/weitere-produkte/ | 2021-02-16 12:07:50 |
| Unsere Biere | `unsere-biere.md` | https://www.deinbier-allgaeu.de/unsere-biere/ | 2023-02-24 15:25:55 |
| Unsere Verkaufstellen | `unsere-verkaufstellen.md` | https://www.deinbier-allgaeu.de/unsere-verkaufstellen/ | 2021-03-14 15:11:02 |
| Kategorien | `veranstaltungen_kategorien.md` | https://www.deinbier-allgaeu.de/veranstaltungen/kategorien/ | 2021-05-13 09:58:19 |
| Meine Buchungen | `veranstaltungen_meine-buchungen.md` | https://www.deinbier-allgaeu.de/veranstaltungen/meine-buchungen/ | 2021-05-13 09:58:19 |
| Schlagwörter | `veranstaltungen_schlagwoerter.md` | https://www.deinbier-allgaeu.de/veranstaltungen/schlagwoerter/ | 2021-05-13 09:58:19 |
| Veranstaltungsorte | `veranstaltungen_veranstaltungsorte.md` | https://www.deinbier-allgaeu.de/veranstaltungen/veranstaltungsorte/ | 2021-05-13 09:58:19 |
| Veranstaltungen | `veranstaltungen.md` | https://www.deinbier-allgaeu.de/veranstaltungen/ | 2021-05-13 09:58:19 |

## news

| Titel | Datei | Quelle | Veröffentlicht |
|---|---|---|---|
| 10 Jahre DEIN BIER | `10-jahre-dein-bier.md` | https://www.deinbier-allgaeu.de/10-jahre-dein-bier/ | 2026-07-24 15:48:29 |
| Adventmärkte | `adventmaerkte.md` | https://www.deinbier-allgaeu.de/adventmaerkte/ | 2023-11-12 14:54:52 |
| Adventsmärkte | `adventsmaerkte.md` | https://www.deinbier-allgaeu.de/adventsmaerkte/ | 2022-11-07 15:20:16 |
| Alles für die Party | `alles-fuer-die-party.md` | https://www.deinbier-allgaeu.de/alles-fuer-die-party/ | 2024-06-11 10:01:02 |
| Biergarten 28.Juni 2025 | `biergarten-28-juni-2025.md` | https://www.deinbier-allgaeu.de/biergarten-28-juni-2025/ | 2025-06-22 11:40:38 |
| Bierpreiserhöhung nötig ?? | `bierpreiserhoehung-noetig.md` | https://www.deinbier-allgaeu.de/bierpreiserhoehung-noetig/ | 2024-02-17 13:34:51 |
| Bock auf Bock? | `bock-auf-bock-2.md` | https://www.deinbier-allgaeu.de/bock-auf-bock-2/ | 2026-02-27 14:31:25 |
| Bockbieranstich | `bockbieranstich.md` | https://www.deinbier-allgaeu.de/bockbieranstich/ | 2025-03-25 15:20:31 |
| Brauseminare 2026 | `brauseminare-2026.md` | https://www.deinbier-allgaeu.de/brauseminare-2026/ | 2025-11-07 16:53:34 |
| Brauseminare für Gruppen | `brauseminare-fuer-gruppen.md` | https://www.deinbier-allgaeu.de/brauseminare-fuer-gruppen/ | 2024-06-11 10:08:33 |
| Brauseminare | `brauseminare.md` | https://www.deinbier-allgaeu.de/brauseminare/ | 2025-06-22 12:42:41 |
| Danke an alle Teilnehmer | `danke-an-alle-teilnehmer.md` | https://www.deinbier-allgaeu.de/danke-an-alle-teilnehmer/ | 2024-06-11 10:13:16 |
| Das Beste zum Feste | `das-beste-zum-feste.md` | https://www.deinbier-allgaeu.de/das-beste-zum-feste/ | 2025-12-11 17:50:39 |
| Das kleine Fässchen | `das-kleine-faesschen.md` | https://www.deinbier-allgaeu.de/das-kleine-faesschen/ | 2026-06-17 19:11:19 |
| DEIN BIER gibt`s hier | `dein-bier-gibts-hier.md` | https://www.deinbier-allgaeu.de/dein-bier-gibts-hier/ | 2025-03-13 12:03:27 |
| DEIN BIER Hell alkoholfrei | `dein-bier-hell-alkoholfrei.md` | https://www.deinbier-allgaeu.de/dein-bier-hell-alkoholfrei/ | 2025-06-22 11:56:09 |
| Endlich wieder eigenes Bier brauen (lernen) ! | `endlich-wieder-eigenes-bier-brauen-lernen.md` | https://www.deinbier-allgaeu.de/endlich-wieder-eigenes-bier-brauen-lernen/ | 2022-07-11 10:52:54 |
| Fastenzeit ist Starkbierzeit | `fastenzeit-ist-starkbierzeit.md` | https://www.deinbier-allgaeu.de/fastenzeit-ist-starkbierzeit/ | 2024-02-17 12:48:37 |
| Freie Plätze Brauseminar am 08.06.2024 | `freie-plaetze-brauseminar-am-08-06-2024.md` | https://www.deinbier-allgaeu.de/freie-plaetze-brauseminar-am-08-06-2024/ | 2024-05-30 12:22:22 |
| Frohe Weihnachten | `frohe-weihnachten.md` | https://www.deinbier-allgaeu.de/frohe-weihnachten/ | 2023-12-24 13:13:06 |
| Genussbiergartenzeit | `genussbiergartenzeit.md` | https://www.deinbier-allgaeu.de/genussbiergartenzeit/ | 2026-06-17 16:21:34 |
| Geschenkideen | `geschenkideen-2.md` | https://www.deinbier-allgaeu.de/geschenkideen-2/ | 2024-11-15 11:46:03 |
| Geschenkideen | `geschenkideen.md` | https://www.deinbier-allgaeu.de/geschenkideen/ | 2023-11-12 16:06:30 |
| Heuer keine Weihnachtsmärkte | `heuer-keine-weihnachtsmaerkte.md` | https://www.deinbier-allgaeu.de/heuer-keine-weihnachtsmaerkte/ | 2024-11-12 19:27:19 |
| Hurra unser Festbier ist da! | `hurra-unser-festbier-ist-da.md` | https://www.deinbier-allgaeu.de/hurra-unser-festbier-ist-da/ | 2025-12-04 17:38:31 |
| Letztes öffentliches Brauseminar 2025 | `letztes-oeffentliches-brauseminar-2025.md` | https://www.deinbier-allgaeu.de/letztes-oeffentliches-brauseminar-2025/ | 2025-10-19 11:40:23 |
| Macht mal Auszeit | `macht-mal-auszeit.md` | https://www.deinbier-allgaeu.de/macht-mal-auszeit/ | 2023-05-14 15:27:15 |
| Musik am Stockerberg | `musik-am-stockerberg.md` | https://www.deinbier-allgaeu.de/musik-am-stockerberg/ | 2023-09-12 10:43:31 |
| Neu im Sortiment | `neu-im-sortiment.md` | https://www.deinbier-allgaeu.de/neu-im-sortiment/ | 2024-06-18 16:25:12 |
| öffentliches Brauseminar im September abgesagt | `oeffentliches-brauseminar-im-september-abgesagt.md` | https://www.deinbier-allgaeu.de/oeffentliches-brauseminar-im-september-abgesagt/ | 2025-09-08 14:22:58 |
| Öffentliches Brauseminar | `oeffentliches-brauseminar.md` | https://www.deinbier-allgaeu.de/oeffentliches-brauseminar/ | 2022-09-06 06:59:53 |
| Regionaler Adventskalender 2025 | `regionaler-adventskalender-2025.md` | https://www.deinbier-allgaeu.de/regionaler-adventskalender-2025/ | 2025-11-07 16:23:21 |
| Sommerzeit „Party-Fässer“ Zeit | `sommerzeit-party-faesser-zeit.md` | https://www.deinbier-allgaeu.de/sommerzeit-party-faesser-zeit/ | 2022-07-13 12:00:48 |
| Starkbierfest in der Brauscheune in Hausen | `starkbierfest-in-der-brauscheune-in-hausen.md` | https://www.deinbier-allgaeu.de/starkbierfest-in-der-brauscheune-in-hausen/ | 2026-02-27 14:26:38 |
| Termin für nächstes Brauseminar | `termin-fuer-naechstes-brauseminar.md` | https://www.deinbier-allgaeu.de/termin-fuer-naechstes-brauseminar/ | 2023-09-12 09:56:43 |
| Termine öffentliche Bauseminare 2025 | `termine-oeffentliche-bauseminare-2025.md` | https://www.deinbier-allgaeu.de/termine-oeffentliche-bauseminare-2025/ | 2025-01-02 16:38:40 |
| Termine öffentliche Brauseminare 1. Halbjahr 2026 | `termine-oeffentliche-brauseminare-1-halbjahr-2026.md` | https://www.deinbier-allgaeu.de/termine-oeffentliche-brauseminare-1-halbjahr-2026/ | 2026-02-27 14:17:36 |
| Termine öffentliche Brauseminare | `termine-oeffentliche-brauseminare.md` | https://www.deinbier-allgaeu.de/termine-oeffentliche-brauseminare/ | 2024-02-17 14:07:54 |
| Weihnachtsbrauerei | `weihnachtsbrauerei.md` | https://www.deinbier-allgaeu.de/weihnachtsbrauerei/ | 2022-11-07 15:52:13 |
| Weihnachtszauber bei DEIN BIER | `weihnachtszauber-bei-dein-bier.md` | https://www.deinbier-allgaeu.de/weihnachtszauber-bei-dein-bier/ | 2022-12-20 11:26:33 |
| Weizenbier ist wieder da | `weizenbier-ist-wieder-da.md` | https://www.deinbier-allgaeu.de/weizenbier-ist-wieder-da/ | 2026-06-17 16:29:42 |
| Wieder da: Glühbi und Winterzicke | `wieder-da-gluehbi-und-winterzicke.md` | https://www.deinbier-allgaeu.de/wieder-da-gluehbi-und-winterzicke/ | 2023-11-12 16:10:51 |
| Winterspezialitäten | `winterspezialitaeten.md` | https://www.deinbier-allgaeu.de/winterspezialitaeten/ | 2024-11-12 12:59:48 |
| Winterzauber | `winterzauber.md` | https://www.deinbier-allgaeu.de/winterzauber/ | 2025-01-02 11:35:27 |
| Winterzeit Glühbi und Zicken Zeit | `winterzeit-gluehbi-und-zicken-zeit.md` | https://www.deinbier-allgaeu.de/winterzeit-gluehbi-und-zicken-zeit/ | 2025-11-07 16:45:35 |
| Winterzeit Spezialitätenzeit! | `winterzeit-spezialitaetenzeit.md` | https://www.deinbier-allgaeu.de/winterzeit-spezialitaetenzeit/ | 2022-01-31 15:17:29 |

## termine

| Titel | Datei | Quelle | Veröffentlicht |
|---|---|---|---|
| Adventsmarkt St. Severin | `terminkalender_adventsmarkt-st-severin.md` | https://www.deinbier-allgaeu.de/terminkalender/adventsmarkt-st-severin/ | 2022-09-29 10:00:13 |
| Biergarten | `terminkalender_biergarten-2.md` | https://www.deinbier-allgaeu.de/terminkalender/biergarten-2/ | 2025-06-22 11:27:35 |
| Biergarten im Brauereihof | `terminkalender_biergarten-im-brauereihof.md` | https://www.deinbier-allgaeu.de/terminkalender/biergarten-im-brauereihof/ | 2023-06-24 11:49:28 |
| Biergarten | `terminkalender_biergarten.md` | https://www.deinbier-allgaeu.de/terminkalender/biergarten/ | 2023-06-24 10:10:24 |
| Brauseminar | `terminkalender_brauseminar-2.md` | https://www.deinbier-allgaeu.de/terminkalender/brauseminar-2/ | 2022-04-09 18:51:47 |
| Brauseminar | `terminkalender_brauseminar.md` | https://www.deinbier-allgaeu.de/terminkalender/brauseminar/ | 2022-03-06 11:30:05 |
| Maibaumaufstellen Mauerstetten | `terminkalender_maibaumaufstellen-mauerstetten.md` | https://www.deinbier-allgaeu.de/terminkalender/maibaumaufstellen-mauerstetten/ | 2023-02-06 15:58:47 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-10.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-10/ | 2024-02-17 14:29:47 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-11.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-11/ | 2024-02-17 14:34:30 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-12.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-12/ | 2024-02-17 14:41:00 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-13.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-13/ | 2025-01-02 16:23:33 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-14.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-14/ | 2025-01-02 16:27:43 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-16.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-16/ | 2025-01-02 16:32:50 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-17.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-17/ | 2025-01-02 16:34:35 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-19.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-19/ | 2025-01-02 16:37:20 |
| Brauseminar öffentlich | `terminkalender_oeffentliches-brauseminar-2.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-2/ | 2022-09-06 06:54:16 |
| öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-3.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-3/ | 2023-01-27 11:52:03 |
| öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-4.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-4/ | 2023-01-27 11:53:53 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-5.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-5/ | 2023-02-11 10:40:06 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-6.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-6/ | 2023-06-24 11:56:06 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-7.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-7/ | 2023-06-24 12:01:39 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar-9.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar-9/ | 2024-02-17 14:23:35 |
| Öffentliches Brauseminar | `terminkalender_oeffentliches-brauseminar.md` | https://www.deinbier-allgaeu.de/terminkalender/oeffentliches-brauseminar/ | 2022-07-11 11:08:47 |
| Winterzauber in den Rauhnächten | `terminkalender_winterzauber-in-den-rauhnaechten.md` | https://www.deinbier-allgaeu.de/terminkalender/winterzauber-in-den-rauhnaechten/ | 2024-11-28 18:47:59 |

## locations

| Titel | Datei | Quelle | Veröffentlicht |
|---|---|---|---|
| Abtei St. Severin | `locations_abtei-st-severin.md` | https://www.deinbier-allgaeu.de/locations/abtei-st-severin/ | 2022-09-29 10:45:46 |
| DEIN BIER | `locations_dein-bier.md` | https://www.deinbier-allgaeu.de/locations/dein-bier/ | 2022-03-08 08:24:34 |
| Dorfplatz Mauerstetten | `locations_dorfplatz-mauerstetten.md` | https://www.deinbier-allgaeu.de/locations/dorfplatz-mauerstetten/ | 2023-02-06 15:58:17 |

