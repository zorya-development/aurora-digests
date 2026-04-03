import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://digests.zorya.dev",
  output: "static",
  integrations: [sitemap()],
  server: { port: 4906 },
});
