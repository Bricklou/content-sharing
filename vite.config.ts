import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "/static/" : "http://localhost:5173/";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, __dirname);

  return {
    base: BASE_URL,
    root: "./webapp/resources",

    build: {
      manifest: true, // add a manifest.json
      rollupOptions: {
        input: [
          path.resolve(__dirname, "./webapp/resources/main.ts"),
          path.resolve(__dirname, "./webapp/resources/noscript.pcss"),
        ],
      },
      outDir: path.resolve(__dirname, "./webapp/static"), // puts the manifest.json in webapp/static/
      assetsDir: "webapp", // puts the assets files in webapp/static/webapp
      write: true,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./webapp/resources/"),
      },
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
  };
});
