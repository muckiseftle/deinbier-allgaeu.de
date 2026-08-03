import { describe, it, expect } from 'vitest';
import { slugify } from '../../src/lib/slug';

describe('slugify', () => {
  it('macht Kleinbuchstaben und Bindestriche', () => {
    expect(slugify('Das kleine Fässchen')).toBe('das-kleine-faesschen');
  });

  it('schreibt Umlaute aus, statt sie zu entfernen', () => {
    expect(slugify('Öffentliches Brauseminar')).toBe('oeffentliches-brauseminar');
    expect(slugify('Grüße')).toBe('gruesse');
    expect(slugify('Straße')).toBe('strasse');
  });

  it('entfernt Satzzeichen', () => {
    expect(slugify('Bock auf Bock?')).toBe('bock-auf-bock');
    expect(slugify('10 Jahre DEIN BIER')).toBe('10-jahre-dein-bier');
  });

  it('fasst mehrfache Trenner zusammen', () => {
    expect(slugify('Hopfen  --  Malz')).toBe('hopfen-malz');
  });

  it('schneidet Trenner an den Raendern ab', () => {
    expect(slugify('  Weizen!  ')).toBe('weizen');
  });

  it('entfernt Akzente aus Fremdwoertern', () => {
    expect(slugify('Café Crème')).toBe('cafe-creme');
  });

  it('liefert bei leerer Eingabe einen leeren String', () => {
    expect(slugify('   ')).toBe('');
  });
});
