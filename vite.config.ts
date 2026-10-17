import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@designcodeio/threeui/style.css",
        replacement: path.resolve(__dirname, "src/shaders/threeui.css"),
      },
      {
        find: "@designcodeio/threeui",
        replacement: path.resolve(
          __dirname,
          "src/shaders/landing-pages/LandingPages.tsx",
        ),
      },
    ],
  },
  optimizeDeps: {
    entries: ["index.html"],
  },
});
