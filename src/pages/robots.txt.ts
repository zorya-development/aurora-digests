import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL("https://digests.zorya.dev");
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap-index.xml\n`,
    { headers: { "Content-Type": "text/plain" } }
  );
};
