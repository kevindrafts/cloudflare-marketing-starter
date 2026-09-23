import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
if (existsSync(".env")) loadEnvFile(".env");
export default defineConfig({
  site: process.env.SITE_URL || "https://example.com",
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
