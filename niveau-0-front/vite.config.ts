// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Importer le plugin Vuetify
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Activer l'auto-importation des composants
  ],
});
