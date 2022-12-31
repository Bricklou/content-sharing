import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "/static/" : "http://localhost:5173/";
// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  root: "./resources",

  build: {
    manifest: true, // add a manifest.json
    rollupOptions: {
      input: [path.resolve(__dirname, "./resources/main.ts")],
    },
    outDir: "../static", // puts the manifest.json in webapp/static/
    assetsDir: "webapp", // puts the assets files in webapp/static/webapp
    write: true,
    emptyOutDir: true,
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: BASE_URL,
          includeAbsolute: false,
        },
      },
    }),
  ],
  server: {
    open: false,
  },
});
