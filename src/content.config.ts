import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const magazine = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/magazine" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { magazine };
