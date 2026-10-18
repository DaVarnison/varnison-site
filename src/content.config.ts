import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const content = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/content' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['video', 'picture']).default('video'),
    youtube: z.string().optional(),
    thumbnail: z.string().optional(),
    image: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['mod', 'app', 'code']).default('app'),
    cover: z.string().optional(),
    downloadable: z.boolean().default(false),
    sample: z.boolean().default(false),
    updates: z.array(z.object({
      version: z.string(),
      date: z.coerce.date(),
      changelog: z.string().optional(),
      download: z.string().optional(),
    })).default([]),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/site' }),
  schema: z.object({ title: z.string().optional() }),
});

export const collections = { content, projects, site };
