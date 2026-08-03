import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Die Datumsfelder sind bewusst geprueft Strings und kein z.coerce.date().
 * Date wuerde '2026-01-01' als UTC-Mitternacht lesen und in westlichen
 * Zeitzonen auf den Vortag zurueckrutschen. Die Formatierung uebernimmt
 * formatDatum aus src/lib/datum.ts.
 */
const DATUM = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format muss JJJJ-MM-TT sein');

const biere = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/biere' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** Eine Zeile fuer Karten und Uebersichten. */
      kurz: z.string(),
      saison: z.enum(['ganzjaehrig', 'sommer', 'winter', 'fruehjahr', 'herbst']),
      gebinde: z.array(z.string()),
      bild: image().optional(),
      bildAlt: z.string(),
      reihenfolge: z.number(),
      /** Etwa "Gebraut fuer die Erzabtei St. Ottilien". */
      besonderheit: z.string().optional(),
    }),
});

const produkte = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/produkte' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      kurz: z.string(),
      bild: image().optional(),
      bildAlt: z.string(),
      reihenfolge: z.number(),
      /** Bierbrand und Bierlikoer. */
      abAchtzehn: z.boolean().default(false),
    }),
});

const verkaufsstellen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/verkaufsstellen' }),
  schema: z.object({
    name: z.string(),
    strasse: z.string(),
    /** String, nicht Zahl: YAML wuerde fuehrende Nullen verschlucken. */
    plz: z.string(),
    ort: z.string(),
    region: z.string(),
    // z.url() statt des veralteten z.string().url()
    website: z.url().optional(),
    hinweis: z.string().optional(),
    abHof: z.boolean().default(false),
    reihenfolge: z.number().default(100),
  }),
});

const leihinventar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/leihinventar' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      gruppe: z.enum(['Überdachung', 'Sitzen und Stehen', 'Ausschank und Küche']),
      masse: z.array(z.string()).default([]),
      bild: image().optional(),
      bildAlt: z.string(),
      reihenfolge: z.number(),
    }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/news' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      datum: DATUM,
      anriss: z.string().max(200),
      bild: image().optional(),
      bildAlt: z.string().optional(),
      /**
       * Beitraege, deren Termin vorbei ist. Sie bleiben online, damit die
       * alten Adressen gueltig bleiben, werden aber nicht mehr angeteasert.
       */
      veraltet: z.boolean().default(false),
    }),
});

const termine = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/inhalte/termine' }),
  schema: z.object({
    titel: z.string(),
    datum: DATUM,
    uhrzeit: z.string().optional(),
    ort: z.string().default('Brauscheune Hausen'),
    art: z.enum(['brauseminar', 'biergarten', 'fest', 'markt']),
    hinweis: z.string().optional(),
    abgesagt: z.boolean().default(false),
  }),
});

export const collections = { biere, produkte, verkaufsstellen, leihinventar, news, termine };
