export interface Gruppe<T> {
  name: string;
  eintraege: T[];
}

/**
 * Gruppiert Eintraege nach einem Schluessel und bringt die Gruppen in eine
 * vorgegebene Reihenfolge.
 *
 * Schluessel, die in der Reihenfolge nicht vorkommen, werden hinten
 * angehaengt statt verworfen. Sonst wuerde eine neu angelegte Verkaufsstelle
 * mit unbekannter Region stillschweigend von der Seite verschwinden, ohne
 * dass jemand es merkt.
 *
 * Innerhalb einer Gruppe bleibt die Eingabereihenfolge erhalten.
 */
export function nachSchluessel<T>(
  eintraege: T[],
  schluessel: (eintrag: T) => string,
  reihenfolge: string[],
): Gruppe<T>[] {
  const eimer = new Map<string, T[]>();

  for (const eintrag of eintraege) {
    const name = schluessel(eintrag);
    const vorhanden = eimer.get(name);
    if (vorhanden) {
      vorhanden.push(eintrag);
    } else {
      eimer.set(name, [eintrag]);
    }
  }

  const sortiert: Gruppe<T>[] = [];

  for (const name of reihenfolge) {
    const gefunden = eimer.get(name);
    if (gefunden && gefunden.length > 0) {
      sortiert.push({ name, eintraege: gefunden });
      eimer.delete(name);
    }
  }

  // Rest in Fundreihenfolge anhaengen.
  for (const [name, gefunden] of eimer) {
    sortiert.push({ name, eintraege: gefunden });
  }

  return sortiert;
}
