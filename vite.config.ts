import { copyFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "github-pages-spa-fallback",
      apply: "build",
      closeBundle() {
        const dist = path.resolve(import.meta.dirname, "dist");
        copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@content": path.resolve(import.meta.dirname, "./content"),
      "@config": path.resolve(import.meta.dirname, "./config"),
    },
  },
});
