import { describe, it, expect } from 'vitest';
import { mailtoLink } from '../../src/lib/mailto';

describe('mailtoLink', () => {
  it('baut Empfaenger, Betreff und Text zusammen', () => {
    const link = mailtoLink('info@deinbier-allgaeu.de', {
      betreff: 'Anfrage Verleih',
      zeilen: ['Hallo,', '', 'Datum:'],
    });
    expect(link.startsWith('mailto:info@deinbier-allgaeu.de?')).toBe(true);
    expect(link).toContain('subject=Anfrage%20Verleih');
  });

  it('trennt Zeilen mit CRLF, weil Mailprogramme das erwarten', () => {
    const link = mailtoLink('a@b.de', { betreff: 'X', zeilen: ['eins', 'zwei'] });
    expect(link).toContain('body=eins%0D%0Azwei');
  });

  it('kodiert Umlaute und Sonderzeichen', () => {
    const link = mailtoLink('a@b.de', {
      betreff: 'Anfrage Fässchen & Co',
      zeilen: ['Grüße'],
    });
    expect(link).toContain('subject=Anfrage%20F%C3%A4sschen%20%26%20Co');
    expect(link).toContain('body=Gr%C3%BC%C3%9Fe');
  });

  it('kommt mit einer leeren Zeilenliste zurecht', () => {
    const link = mailtoLink('a@b.de', { betreff: 'X', zeilen: [] });
    expect(link).toBe('mailto:a@b.de?subject=X&body=');
  });

  // Absicherung gegen genau den Fehler der Altseite: dort steht im Footer
  // href="info@deinbier-allgaeu.de" ohne mailto-Schema, sodass der Browser
  // einen relativen Pfad daraus macht und auf einer 404 landet.
  it('wirft bei einer Adresse ohne @', () => {
    expect(() => mailtoLink('kaputt', { betreff: 'X', zeilen: [] })).toThrow();
  });

  it('wirft bei leerer Adresse', () => {
    expect(() => mailtoLink('', { betreff: 'X', zeilen: [] })).toThrow();
  });
});
