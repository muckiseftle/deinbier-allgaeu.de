export interface AnfrageVorlage {
  /** Betreffzeile, unkodiert. */
  betreff: string;
  /** Textzeilen, unkodiert. Ein leerer String erzeugt eine Leerzeile. */
  zeilen: string[];
}

/**
 * Baut einen vollstaendigen mailto-Link.
 *
 * Die Pruefung auf das @ ist Absicht. Die Altseite hat im Footer einen Link,
 * dem das mailto-Schema fehlt (href="info@deinbier-allgaeu.de"). Der Browser
 * macht daraus einen relativen Pfad, und der Besucher landet auf einer 404.
 * Dieser Fehler soll nicht wiederkehren koennen, deshalb bricht der Build,
 * sobald jemand eine kaputte Adresse einsetzt.
 */
export function mailtoLink(empfaenger: string, vorlage: AnfrageVorlage): string {
  if (!empfaenger.includes('@')) {
    throw new Error(`Keine gueltige E-Mail-Adresse: "${empfaenger}"`);
  }

  const betreff = encodeURIComponent(vorlage.betreff);
  const text = encodeURIComponent(vorlage.zeilen.join('\r\n'));

  return `mailto:${empfaenger}?subject=${betreff}&body=${text}`;
}
