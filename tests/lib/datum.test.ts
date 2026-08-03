import { describe, it, expect } from 'vitest';
import { formatDatum, isoDatum, jahrAus } from '../../src/lib/datum';

describe('formatDatum', () => {
  it('formatiert ein ISO-Datum deutsch', () => {
    expect(formatDatum('2026-07-24')).toBe('24. Juli 2026');
  });

  it('laesst die fuehrende Null im Tag weg', () => {
    expect(formatDatum('2026-06-01')).toBe('1. Juni 2026');
  });

  it('verschiebt nicht ueber die Zeitzone', () => {
    // Ein naives new Date('2026-01-01') wird als UTC-Mitternacht gelesen und
    // rutscht in westlichen Zeitzonen auf den 31.12. zurueck.
    expect(formatDatum('2026-01-01')).toBe('1. Januar 2026');
    expect(formatDatum('2026-12-31')).toBe('31. Dezember 2026');
  });

  it('vertraegt einen Zeitanteil', () => {
    expect(formatDatum('2026-07-24 15:48:29')).toBe('24. Juli 2026');
    expect(formatDatum('2026-07-24T15:48:29Z')).toBe('24. Juli 2026');
  });

  it('wirft bei unbrauchbarer Eingabe', () => {
    expect(() => formatDatum('irgendwas')).toThrow();
  });

  it('wirft bei einem Monat ausserhalb des Bereichs', () => {
    expect(() => formatDatum('2026-13-01')).toThrow();
  });
});

describe('isoDatum', () => {
  it('gibt das Datum fuer das datetime-Attribut zurueck', () => {
    expect(isoDatum('2026-07-24 15:48:29')).toBe('2026-07-24');
  });

  it('fuellt einstellige Werte auf', () => {
    expect(isoDatum('2026-06-01')).toBe('2026-06-01');
  });
});

describe('jahrAus', () => {
  it('liest das Jahr', () => {
    expect(jahrAus('2024-03-16')).toBe(2024);
  });
});
