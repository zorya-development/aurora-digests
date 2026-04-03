import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const digests = (await getCollection("digests")).sort(
    (a, b) =>
      new Date(b.data.created_at).getTime() -
      new Date(a.data.created_at).getTime()
  );

  return rss({
    title: "Silicon Ore",
    description: "Архив дайджестов по AI, LLM и self-hosting",
    site: context.site ?? "https://digests.zorya.dev",
    items: digests.map((digest) => ({
      title: digest.data.title || new Date(digest.data.created_at).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" }),
      description: digest.data.summary ?? "",
      pubDate: new Date(digest.data.created_at),
      link: `/${digest.id}/`,
    })),
    customData: `<language>ru</language>`,
  });
}
