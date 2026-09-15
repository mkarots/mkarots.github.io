import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function uniqueTags(posts: CollectionEntry<'blog'>[]): string[] {
	const tags = new Set<string>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			tags.add(tag);
		}
	}
	return [...tags].sort();
}
