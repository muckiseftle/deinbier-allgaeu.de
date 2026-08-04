# Veröffentlichung

Die Seite liegt auf **GitHub Pages**. Kein Server, keine Datenbank, kein
Wartungsvertrag: gebaut wird bei jedem Push auf `main`, veröffentlicht wird
das fertige Ergebnis.

---

## 1 · Der aktuelle Stand: Vorschau

**Adresse:** `https://muckiseftle.github.io/deinbier-allgaeu.de/`

Das ist bewusst **nicht** die eigene Domain. `deinbier-allgaeu.de` zeigt
weiterhin auf die alte WordPress-Seite (`85.13.143.148`); die bleibt
unangetastet online, bis Sie den Wechsel selbst auslösen.

Zwei Dinge unterscheiden die Vorschau von der späteren Live-Seite:

1. **Alle Pfade tragen den Unterordner.** GitHub Pages legt Projektseiten
   unter `/repo-name/` ab. Das erledigt `werkzeuge/unterordner.mjs` nach dem
   Bauen — es schreibt Links, Schriften, Masken, Favicons und die Sitemap um.
2. **Die Vorschau ist für Suchmaschinen gesperrt** (`noindex` auf jeder Seite
   plus `Disallow: /` in `robots.txt`). Solange die alte Seite online ist,
   wäre eine zweite auffindbare Fassung derselben Inhalte schädlich.

### Einmalig einzurichten

Im Repo unter **Settings → Pages**:

- **Source:** `GitHub Actions`

Mehr nicht. Danach läuft der Workflow bei jedem Push auf `main` und
veröffentlicht selbstständig. Der erste Lauf dauert etwa zwei bis drei
Minuten.

Der Workflow lässt sich unter **Actions → Seite bauen und veröffentlichen →
Run workflow** auch von Hand starten.

---

## 2 · Der Livegang auf die eigene Domain

**Erst wenn die Punkte in Abschnitt 4 erledigt sind.**

### Schritt 1: Am Projekt

1. `.github/workflows/deploy.yml`: den Schritt **„Auf den Unterordner
   umstellen"** löschen.
2. Datei `public/CNAME` anlegen mit genau einer Zeile:

   ```
   deinbier-allgaeu.de
   ```

3. Push auf `main`.

Am Quelltext ist sonst nichts zu ändern: `astro.config.mjs` steht bereits auf
`site: 'https://deinbier-allgaeu.de'`, und alle Pfade sind von Haus aus auf
die Wurzel geschrieben. Die Umstellung auf den Unterordner war nur eine
Nachbearbeitung des Ergebnisses — genau deshalb ist sie so leicht
zurückzunehmen.

### Schritt 2: Beim Domain-Anbieter

Für die **Hauptdomain** (`deinbier-allgaeu.de`) vier A-Einträge:

| Typ | Name | Wert |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Zusätzlich für `www`:

| Typ | Name | Wert |
|---|---|---|
| CNAME | `www` | `muckiseftle.github.io` |

**Alte Einträge auf `85.13.143.148` dabei entfernen.** In dem Moment, in dem
die neuen greifen, ist die alte Seite nicht mehr erreichbar.

### Schritt 3: Zurück im Repo

**Settings → Pages → Custom domain:** `deinbier-allgaeu.de` eintragen und
speichern. Danach **Enforce HTTPS** anhaken, sobald GitHub das Zertifikat
ausgestellt hat (dauert bis zu 24 Stunden).

### Schritt 4: Nachkontrolle

```
npm run build
node werkzeuge/qa-statisch.mjs
npm run preview      # in einem zweiten Fenster
node werkzeuge/qa-browser.mjs
```

Und an der Live-Seite:

- `https://deinbier-allgaeu.de/` lädt und zeigt das Schloss im Browser
- `https://www.deinbier-allgaeu.de/` leitet auf die Hauptdomain
- `https://deinbier-allgaeu.de/robots.txt` erlaubt wieder alles
- Eine alte Adresse, etwa `https://deinbier-allgaeu.de/home/kontakt/`,
  landet auf der neuen Seite
- Die Sitemap in der Google Search Console einreichen

---

## 3 · Wie der Wechsel rückgängig zu machen ist

Sollte nach dem Umschalten etwas Grundlegendes nicht stimmen: beim
Domain-Anbieter die A-Einträge zurück auf `85.13.143.148` setzen. Die alte
Seite läuft dort unverändert weiter. Der Rückweg dauert so lange, wie die
DNS-Werte zwischengespeichert sind — deshalb vor dem Wechsel die Gültigkeit
(TTL) auf einen kleinen Wert setzen, etwa 300 Sekunden.

---

## 4 · Was vor dem Livegang erledigt sein muss

| | Was | Wer |
|---|---|---|
| 🔴 | **Impressum und Datenschutz juristisch prüfen lassen.** Beide sind sorgfältig recherchierte Entwürfe, aber keine Rechtsberatung. | Betreiber |
| 🔴 | **Vier Angaben ergänzen:** Rechtsform, USt-IdNr., Zuständigkeit nach § 36 VSBG, Speicherdauer. Siehe OFFENE-FRAGEN 1–4. | Betreiber |
| 🔴 | **Lizenz der beiden Motive klären** (Hopfen, Gerste). Möglicherweise ist eine Namensnennung im Impressum Pflicht. Siehe OFFENE-FRAGEN 34. | Betreiber |
| 🔴 | **Logo als Vektordatei**, danach Favicon-Set neu erzeugen (`werkzeuge/favicons.ps1`). Derzeit ein 300-px-PNG. | Betreiber |
| 🟡 | Aktuelle Brauseminar-Termine. Ohne sie ist der wichtigste Anfrageweg eine Sackgasse. | Betreiber |
| 🟡 | Einverständnis für das Vorschaubild mit erkennbaren Personen. | Betreiber |

Die vollständige Liste steht in `OFFENE-FRAGEN.md`.

---

## 5 · Was der Workflow tut

`.github/workflows/deploy.yml`, ausgelöst bei jedem Push auf `main`:

1. Quelltext holen
2. Node 22 einrichten, Abhängigkeiten mit `npm ci` installieren — strikt nach
   `package-lock.json`, damit ein Deployment nicht von einer still
   geänderten Abhängigkeit abhängt
3. **Tests** (`npm test`). Schlagen sie fehl, wird nicht veröffentlicht.
4. Bauen (`npm run build`)
5. Auf den Unterordner umstellen (entfällt beim Livegang)
6. Ergebnis hochladen und veröffentlichen

Der Schritt mit den Tests ist Absicht: er ist die letzte Stelle, an der ein
Fehler auffällt, bevor er öffentlich ist.
