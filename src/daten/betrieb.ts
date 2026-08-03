/**
 * Stammdaten an genau einer Stelle.
 *
 * Alle Angaben sind aus der Altseite belegt und in AUDIT.md Abschnitt 4.1
 * nachgewiesen. Nichts hiervon ist geraten.
 */
export const BETRIEB = {
  name: 'DEIN BIER M. Rink Brauerei',
  kurzname: 'DEIN BIER',
  inhaber: 'Michael Rink',

  strasse: 'Hausen 3',
  plz: '87665',
  ort: 'Mauerstetten',
  land: 'DE',

  telefon: '+4915128776077',
  telefonAnzeige: '0151 28776077',
  email: 'info@deinbier-allgaeu.de',

  domain: 'https://deinbier-allgaeu.de',

  claim: 'Echt Bayrische Bierkultur, die verbindet',
  signatur: 'zu Hause(n) gebraut',
  gegruendet: '2016',

  verkaufszeiten: 'Samstag 10:00 bis 12:00 Uhr',
  verkaufszusatz:
    'Außerhalb der Zeiten einfach vorbeikommen und an der Bierklingel klingeln.',

  social: {
    facebook: 'https://www.facebook.com/Dein-Bier-326341181128402/',
    instagram: 'https://www.instagram.com/deinbier_allgaeu/',
  },
} as const;

/**
 * Geokoordinaten fehlen bewusst. Sie werden fuer das JSON-LD gebraucht,
 * sind aber nicht bestaetigt. Lieber keine Angabe als eine erfundene.
 * Siehe OFFENE-FRAGEN.md.
 */
export const GEO_KOORDINATEN: { breite: number; laenge: number } | null = null;
