import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  pubDate: z.coerce.date(),
});

const magazine = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/magazine" }),
  schema: articleSchema,
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: articleSchema,
});

export const collections = { magazine, guides };
