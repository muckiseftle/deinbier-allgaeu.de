# Animation: Befunde und Umsetzung

**Phase 6** · Stand 04.08.2026 · Skills `animation-vocabulary`, `find-animation-opportunities`,
`improve-animations`.

`MOTION_INTENSITY: 5` aus `DESIGN.md` Abschnitt 2: konzentriert statt verteilt.
Ein orchestrierter Moment, danach sparsame Rückmeldungen.

---

## 1 · Bestandsaufnahme

Was sich heute bewegt:

| Wo | Was | Dauer | Kurve |
|---|---|---|---|
| Hero | Die Einfahrt des Wagens, einmalig | 900 ms | Feder, leichtes Nachwippen |
| je Abschnitt | Scroll-Einblendung, einmalig, gestaffelt | 420 ms | Standard |
| Knöpfe | Anheben bei Hover, Senken bei Druck | 180 / 100 ms | Standard |
| Links | Unterstrich wandert heran und wird dicker | 180 ms | Standard |
| Bierkarten | Bild skaliert auf 1,03 | 260 ms | Standard |
| Mobiles Menü | Gestaffelter Eintritt, 70 ms Versatz | 260 ms | Standard |
| Kopfzeile | Verschwindet beim Abwärtsscrollen | 260 ms | Standard |
| Anfragekarten | Anheben, Pfeil wandert | 180 ms | Standard |

Alles bewegt ausschließlich `transform` und `opacity`, alles liegt hinter
`prefers-reduced-motion`, kein einziger Scroll-Ereignishörer im Projekt.

**Bewertung:** Die vorhandene Bewegung ist im Kern richtig. Kein einziger
HIGH-Befund. Keine falsche Kurve, kein `ease-in` auf Bedienelementen, kein
`scale(0)`, keine Animation auf einer tastaturgetriebenen Aktion, keine
Endlosschleife.

---

## 2 · Befunde

| # | Schwere | Ort | Befund | Behebung |
|---|---|---|---|---|
| 1 | MITTEL | `kontakt.astro` | Die vier Anfragekarten sind vollflächig anklickbar und heben sich beim Überfahren, geben beim **Drücken** aber keine Rückmeldung. | `:active` mit `scale(0.985)`, 100 ms |
| 2 | MITTEL | `Kopfzeile.astro` | Der Menüknopf ist auf dem Handy das meistgedrückte Element der Seite und hat **gar keine** Rückmeldung. | `:active` mit `scale(0.92)`, 100 ms |
| 3 | MITTEL | `Kopfzeile.astro` | Das mobile Menü tritt gestaffelt ein und **verschwindet schlagartig**. Ein bildschirmfüllendes Feld, das ohne Übergang verschwindet, wirkt wie ein Fehler. | Ausblenden in 160 ms, schneller als der Eintritt |
| 4 | NIEDRIG | `Altersabfrage.astro` | Der Dialog verschwindet schlagartig. Das ist der **erste** Eindruck der Seite. | Ausblenden in 200 ms. Das Einblenden bleibt bewusst ohne Bewegung, sonst flackert es bei gespeicherter Antwort. |
| 5 | NIEDRIG | `index.astro`, `news/index.astro` | Bierkarten skalieren ihr Bild beim Überfahren, **News-Karten nicht**, obwohl beide anklickbar sind. Uneinheitlich. | Gleiche Regel übernehmen |

---

## 3 · Verworfene Kandidaten

Das ist der wichtigere Teil. Fünf Stellen, an denen Bewegung naheliegend
gewesen wäre und die ich bewusst **nicht** vorschlage:

- **Seitenübergänge** (View Transitions). *Verworfen: Kernnavigation.* `DESIGN.md`
  Abschnitt 10 schließt sie ausdrücklich aus, und sie brächten eine
  JavaScript-Abhängigkeit für einen Effekt, den man nach dem dritten Klick
  nicht mehr wahrnimmt.
- **Hochzählende Zahlen im Zahlenband** auf `/brauerei/` (2016, 9–11 °C,
  4 Wochen, 1516). *Verworfen: Das sind Angaben zum Lesen, keine Show.*
  Bewegung auf Daten, die jemand erfassen will, behindert.
- **Parallax im Bildband** der Startseite. *Verworfen: reine Dekoration*, und
  `DESIGN.md` verbietet es.
- **Der Wagen an jeder Wegstrecke** statt nur im Hero. *Verworfen: Das würde
  den einen orchestrierten Moment verwässern.* Ein Motiv, das dreimal fährt,
  fährt gar nicht mehr.
- **Hover auf Verkaufsstellen- und Inventarkarten.** *Verworfen: Die Karten
  sind nicht anklickbar.* Eine Hover-Reaktion würde eine Bedienbarkeit
  vortäuschen, die es nicht gibt.

---

## 4 · Verdikt

Die Oberfläche braucht **wenig** zusätzliche Bewegung, und sie ist nah dran.
Die fünf Befunde sind allesamt Rückmeldungen und Übergänge, keine Effekte:
drei schließen Lücken beim Drücken, zwei verhindern ein schlagartiges
Verschwinden.

Der Befund mit der größten Hebelwirkung ist **Nummer 3**, das mobile Menü.
Ein bildschirmfüllendes Feld, das ohne Übergang verschwindet, liest sich als
Fehler, nicht als Absicht — und auf dem Handy sieht das jeder Besucher.

**Alle fünf Befunde sind umgesetzt.** Abweichend von der Beraterrolle der
beiden Skills, weil PROJEKT.md für Phase 6 die Umsetzung verlangt.

---

## 5 · Was der Betreiber noch selbst tun kann

`DESIGN.md` und PROJEKT.md sehen vor, dass der Skill 🔒 `review-animations`
**vom Betreiber selbst** aufgerufen wird. Er prüft die Bewegung gegen einen
strengeren Maßstab, als ein Selbstcheck es kann.

Zwei Dinge lassen sich am Code nicht beurteilen und brauchen einen Blick auf
das echte Gerät:

1. **Fühlt sich die Einfahrt des Wagens richtig an?** 900 ms mit leichtem
   Nachwippen ist eine Setzung. Zu langsam wirkt behäbig, zu schnell nimmt
   den Moment weg.
2. **Ist die Staffelung der Scroll-Einblendungen zu spürbar?** 70 ms Versatz
   klingt wenig, kann bei fünf Karten nebeneinander aber schon nach Warten
   aussehen.

Am besten am nächsten Tag mit frischen Augen ansehen, und einmal in
Zeitlupe. Fehler, die bei voller Geschwindigkeit unsichtbar sind, fallen
dabei sofort auf.
