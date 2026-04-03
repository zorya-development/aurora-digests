import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const snippetSchema = z.object({
  id: z.number(),
  article_id: z.number().nullable(),
  title: z.string(),
  body: z.string(),
  score: z.number().nullable(),
  reason: z.string().nullable(),
  article: z
    .object({
      url: z.string().nullable().optional(),
      content: z.string().nullable().optional(),
      source_identifier: z.string().nullable().optional(),
      source_type: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  merged_sources: z.array(
    z.object({
      url: z.string().nullable(),
      source_identifier: z.string().nullable(),
      source_type: z.string().nullable(),
      reason: z.string().nullable(),
    })
  ),
});

const sectionSchema = z.object({
  title: z.string(),
  items: z.array(snippetSchema),
});

const digests = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./data/digests" }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    summary: z.string(),
    sections: z.array(sectionSchema),
    daily: z.boolean(),
    status: z.string(),
    created_at: z.string(),
  }),
});

export const collections = { digests };
