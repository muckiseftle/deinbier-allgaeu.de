import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://deinbier-allgaeu.de',

  // Die Altseite nutzt durchgehend Schraegstriche am Ende. Die
  // Weiterleitungen (Aufgabe 25) setzen darauf auf.
  trailingSlash: 'always',

  output: 'static',

  integrations: [
    sitemap({
      // Weiterleitungsseiten und die Hinweisseite gehoeren nicht in die Sitemap.
      filter: (page) =>
        !page.includes('/weiterleitung/') && !page.includes('/zu-jung/'),
    }),
    icon({
      // Nur die tatsaechlich genutzten Symbole werden eingebettet.
      // Eine Familie: Phosphor. Strichstaerke global 1,5 px.
      include: {
        ph: [
          'phone',
          'envelope-simple',
          'map-pin',
          'clock',
          'arrow-right',
          'arrow-up-right',
          'caret-left',
          'caret-right',
          'list',
          'x',
          'calendar-blank',
          'warning-circle',
        ],
      },
    }),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      /* Zielbrowser fuer die CSS-Verarbeitung.
         Ohne Angabe entfernt der Bauvorgang Herstellerpraefixe, die er fuer
         seine Zielbrowser nicht mehr braucht — darunter
         `-webkit-backdrop-filter`. Auf iOS Safari vor Version 18 wirkt aber
         nur die praefixierte Form: das Milchglas der Kopfzeile fiel dort
         ersatzlos aus. Im Emulator hier faellt das nicht auf, weil Chromium
         die Eigenschaft ohne Praefix kennt.

         Mit dieser Angabe bleiben die geschriebenen Praefixe stehen, und
         esbuild ergaenzt sogar fehlende. Geprueft wird das am gebauten CSS
         von `qa-statisch.mjs`, Abschnitt 9. */
      cssTarget: ['safari14', 'chrome87', 'firefox78', 'edge88'],
    },
  },

  image: {
    // Sharp ist Standard; explizit setzen, damit es nicht still wechselt.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
