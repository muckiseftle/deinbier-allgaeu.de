import { describe, it, expect } from 'vitest';
import { nachSchluessel } from '../../src/lib/gruppieren';

interface Stelle {
  name: string;
  region: string;
}

const stellen: Stelle[] = [
  { name: 'Dorfladen Waal', region: 'Ostallgäu' },
  { name: 'Stockheimer Landmarkt', region: 'Unterallgäu' },
  { name: 'Reisach Früchtegarten', region: 'Ostallgäu' },
  { name: 'Brauereiverkauf', region: 'Ab Hof' },
];

describe('nachSchluessel', () => {
  it('gruppiert nach dem Schluessel', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region, [
      'Ab Hof',
      'Ostallgäu',
      'Unterallgäu',
    ]);
    expect(gruppen).toHaveLength(3);
    expect(gruppen[0].name).toBe('Ab Hof');
    expect(gruppen[1].eintraege).toHaveLength(2);
  });

  it('haelt die vorgegebene Reihenfolge ein, nicht die Fundreihenfolge', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region, [
      'Unterallgäu',
      'Ab Hof',
      'Ostallgäu',
    ]);
    expect(gruppen.map((g) => g.name)).toEqual(['Unterallgäu', 'Ab Hof', 'Ostallgäu']);
  });

  it('laesst leere Gruppen weg', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region, [
      'Ab Hof',
      'Ostallgäu',
      'Unterallgäu',
      'Oberallgäu',
    ]);
    expect(gruppen.map((g) => g.name)).not.toContain('Oberallgäu');
  });

  // Wenn jemand spaeter eine Verkaufsstelle mit neuer Region anlegt, darf sie
  // nicht stillschweigend von der Seite verschwinden.
  it('haengt unbekannte Schluessel hinten an, statt sie zu verschlucken', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region, ['Ab Hof']);
    expect(gruppen).toHaveLength(3);
    expect(gruppen[0].name).toBe('Ab Hof');
    expect(gruppen.map((g) => g.name)).toContain('Ostallgäu');
    expect(gruppen.map((g) => g.name)).toContain('Unterallgäu');
  });

  it('behaelt die Reihenfolge innerhalb einer Gruppe bei', () => {
    const gruppen = nachSchluessel(stellen, (s) => s.region, ['Ostallgäu']);
    expect(gruppen[0].eintraege.map((s) => s.name)).toEqual([
      'Dorfladen Waal',
      'Reisach Früchtegarten',
    ]);
  });

  it('kommt mit einer leeren Liste zurecht', () => {
    expect(nachSchluessel([] as Stelle[], (s) => s.region, ['Ab Hof'])).toEqual([]);
  });
});
