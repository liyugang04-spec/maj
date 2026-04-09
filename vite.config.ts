import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserOrOrgPages = repoName?.toLowerCase().endsWith(".github.io");
const defaultBase =
  process.env.GITHUB_ACTIONS === "true"
    ? repoName && !isUserOrOrgPages
      ? `/${repoName}/`
      : "/"
    : "/";
const base =
  process.env.VITE_BASE_PATH ??
  defaultBase;

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        sourcemap: false
      }
    })
  ]
});
