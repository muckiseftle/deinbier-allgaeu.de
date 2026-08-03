import { mailtoLink, type AnfrageVorlage } from '../lib/mailto';
import { BETRIEB } from './betrieb';

/**
 * Vorbefuellte Anfragen. Es gibt kein Backend, also auch kein Formular.
 * Ein Eingabefeld, das nichts tut, waere eine Luege.
 *
 * Die Vorlagen fuellen Betreff und Text im Mailprogramm vor, sodass nur noch
 * die Luecken ausgefuellt werden muessen.
 */
export const VORLAGEN = {
  verleih: {
    betreff: 'Anfrage Verleih',
    zeilen: [
      'Hallo,',
      '',
      'ich würde gerne folgendes Inventar leihen:',
      '',
      'Gewünschtes Inventar:',
      'Datum der Veranstaltung:',
      'Anzahl der Gäste:',
      'Abholung oder Lieferung:',
      '',
      'Viele Grüße',
    ],
  },
  feier: {
    betreff: 'Anfrage Feier in der Brauerei',
    zeilen: [
      'Hallo,',
      '',
      'wir würden gerne bei Euch feiern.',
      '',
      'Anlass:',
      'Wunschtermin:',
      'Anzahl der Gäste:',
      'Brauereigarten oder Festraum:',
      'Catering gewünscht:',
      '',
      'Viele Grüße',
    ],
  },
  seminar: {
    betreff: 'Anfrage Brauseminar',
    zeilen: [
      'Hallo,',
      '',
      'wir hätten Interesse an einem Brauseminar.',
      '',
      'In der Brauerei oder bei uns vor Ort:',
      'Wunschtermin:',
      'Anzahl der Teilnehmer:',
      'Eigenes Etikett gewünscht:',
      '',
      'Viele Grüße',
    ],
  },
  ferienwohnung: {
    betreff: 'Anfrage Ferienwohnung',
    zeilen: [
      'Hallo,',
      '',
      'wir interessieren uns für die Ferienwohnung.',
      '',
      'Anreise:',
      'Abreise:',
      'Anzahl Erwachsene:',
      'Anzahl Kinder:',
      'Haustier:',
      '',
      'Viele Grüße',
    ],
  },
  allgemein: {
    betreff: 'Anfrage über die Website',
    zeilen: ['Hallo,', '', '', '', 'Viele Grüße'],
  },
} as const satisfies Record<string, AnfrageVorlage>;

export type AnfrageArt = keyof typeof VORLAGEN;

/** Fertiger mailto-Link fuer eine Anfrageart. */
export function anfrageLink(art: AnfrageArt): string {
  return mailtoLink(BETRIEB.email, VORLAGEN[art]);
}
