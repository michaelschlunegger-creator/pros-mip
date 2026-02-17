import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/pros-mip/", // IMPORTANT: repo name for GitHub Pages project site
});
