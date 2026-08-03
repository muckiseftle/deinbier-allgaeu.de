export interface Weiterleitung {
  alt: string;
  neu: string;
}

/**
 * GitHub Pages kann keine Server-Weiterleitungen. Alte Adressen werden
 * deshalb ueber HTML-Seiten mit meta refresh und Canonical aufgefangen.
 *
 * Die 46 News-Beitraege brauchen keinen Eintrag: ihre Dateinamen sind die
 * alten Adressfragmente, die Adressen bleiben also unveraendert gueltig.
 * /news/ ebenfalls nicht, die Adresse bleibt gleich.
 *
 * Vollstaendige Herleitung: AUDIT.md Abschnitt 6.
 */
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
