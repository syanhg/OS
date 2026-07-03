import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes every asset path relative, so the build works at
// https://<user>.github.io/<repo>/ without any basePath configuration.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
