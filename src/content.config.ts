import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z
			.object({
				type: z.enum(['entry', 'link']).default('entry'),
				title: z.string(),
				description: z.string().optional(),
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				heroImage: image().optional(),
				project: z.string().optional(),
				tags: z.array(z.string()).default([]),
				linkUrl: z.string().url().optional(),
				viaUrl: z.string().url().optional(),
				viaTitle: z.string().optional(),
				draft: z.boolean().default(false),
			})
			.refine((data) => data.type !== 'link' || Boolean(data.linkUrl), {
				message: 'link posts require linkUrl',
				path: ['linkUrl'],
			}),
});

export const collections = { blog };
