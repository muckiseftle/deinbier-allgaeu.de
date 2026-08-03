export interface NaviPunkt {
  name: string;
  pfad: string;
}

/**
 * Genau sieben Punkte, keine Verschachtelung (PROJEKT.md Abschnitt 3).
 *
 * Die Altseite hatte acht Punkte, davon fuenf mit Untermenue, und "Home"
 * als Menuepunkt mit Unterpunkt. Impressum, Datenschutz und Kontakt lagen
 * als Unterseiten unter /home/.
 */
export const NAVIGATION: readonly NaviPunkt[] = [
  { name: 'Brauerei', pfad: '/brauerei/' },
  { name: 'Biere', pfad: '/biere/' },
  { name: 'Brauseminare', pfad: '/brauseminare/' },
  { name: 'Events & Verleih', pfad: '/events-verleih/' },
  { name: 'Ferienwohnung', pfad: '/ferienwohnung/' },
  { name: 'Verkaufsstellen', pfad: '/verkaufsstellen/' },
  { name: 'News', pfad: '/news/' },
] as const;

/** Fusszeile: Kontakt und Rechtstexte. */
export const RECHTLICHES: readonly NaviPunkt[] = [
  { name: 'Kontakt', pfad: '/kontakt/' },
  { name: 'Impressum', pfad: '/impressum/' },
  { name: 'Datenschutz', pfad: '/datenschutz/' },
] as const;
