const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;

interface Zerlegt {
  jahr: number;
  monat: number;
  tag: number;
}

/**
 * Zerlegt ein ISO-Datum, ohne es durch Date zu schicken.
 *
 * Date wuerde '2026-01-01' als UTC-Mitternacht lesen und in westlichen
 * Zeitzonen auf den 31.12.2025 zurueckrutschen. Bei einer Website, deren
 * Termine tagesgenau stimmen muessen, ist das nicht hinnehmbar.
 */
function zerlegen(iso: string): Zerlegt {
  const treffer = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!treffer) {
    throw new Error(`Kein gueltiges ISO-Datum: "${iso}"`);
  }

  const jahr = Number(treffer[1]);
  const monat = Number(treffer[2]);
  const tag = Number(treffer[3]);

  if (monat < 1 || monat > 12 || tag < 1 || tag > 31) {
    throw new Error(`Datum ausserhalb des gueltigen Bereichs: "${iso}"`);
  }

  return { jahr, monat, tag };
}

/** '2026-07-24' wird zu '24. Juli 2026'. */
export function formatDatum(iso: string): string {
  const { jahr, monat, tag } = zerlegen(iso);
  return `${tag}. ${MONATE[monat - 1]} ${jahr}`;
}

/** Fuer das datetime-Attribut von <time>. */
export function isoDatum(iso: string): string {
  const { jahr, monat, tag } = zerlegen(iso);
  const mm = String(monat).padStart(2, '0');
  const tt = String(tag).padStart(2, '0');
  return `${jahr}-${mm}-${tt}`;
}

/** Fuer die Jahresreiter auf der News-Uebersicht. */
export function jahrAus(iso: string): number {
  return zerlegen(iso).jahr;
}
