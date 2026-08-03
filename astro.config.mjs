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

  image: {
    // Sharp ist Standard; explizit setzen, damit es nicht still wechselt.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
