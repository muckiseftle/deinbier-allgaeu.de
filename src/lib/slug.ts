/**
 * Umlaute werden ausgeschrieben, nicht entfernt.
 *
 * Eine reine Normalisierung ueber NFD wuerde aus "Faesschen" ein "fasschen"
 * machen, weil sie nur die Punkte abtrennt. Im Deutschen ist das falsch:
 * ae oe ue ss sind die richtigen Ersatzschreibungen.
 */
const ERSETZUNGEN: ReadonlyArray<readonly [RegExp, string]> = [
  [/ä/g, 'ae'],
  [/ö/g, 'oe'],
  [/ü/g, 'ue'],
  [/Ä/g, 'ae'],
  [/Ö/g, 'oe'],
  [/Ü/g, 'ue'],
  [/ß/g, 'ss'],
];

export function slugify(text: string): string {
  let ergebnis = text.trim().toLowerCase();

  for (const [suchen, ersetzen] of ERSETZUNGEN) {
    ergebnis = ergebnis.replace(suchen, ersetzen);
  }

  // Restliche Akzente abtrennen, etwa é aus Fremdwoertern.
  ergebnis = ergebnis.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Alles, was kein Buchstabe und keine Ziffer ist, wird zum Trenner.
  ergebnis = ergebnis.replace(/[^a-z0-9]+/g, '-');

  // Trenner an den Raendern weg.
  return ergebnis.replace(/^-+|-+$/g, '');
}
