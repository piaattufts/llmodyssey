import path from "node:path";
import { defineConfig } from "vitest/config";


export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@content": path.resolve(import.meta.dirname, "./content"),
      "@config": path.resolve(import.meta.dirname, "./config"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
