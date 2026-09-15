import { countWords, extractExcerptMarkdown, stripMdxPreamble } from './excerpt';
import { renderMarkdown } from './markdown';

export type StreamPostType = 'entry' | 'link';

export interface StreamPostInput {
	id: string;
	body: string;
	data: {
		type?: StreamPostType;
		title: string;
		pubDate: Date;
		project?: string;
		tags?: string[];
		linkUrl?: string;
		viaUrl?: string;
		viaTitle?: string;
		draft?: boolean;
	};
}

export interface StreamItem {
	id: string;
	title: string;
	type: StreamPostType;
	pubDate: Date;
	project?: string;
	tags: string[];
	linkUrl?: string;
	viaUrl?: string;
	viaTitle?: string;
	excerptHtml: string;
	wordCount: number;
	hasMore: boolean;
	href: string;
}

export interface DayGroup<T extends { pubDate: Date }> {
	date: Date;
	items: T[];
}

export function isSameUtcDay(a: Date, b: Date): boolean {
	return (
		a.getUTCFullYear() === b.getUTCFullYear() &&
		a.getUTCMonth() === b.getUTCMonth() &&
		a.getUTCDate() === b.getUTCDate()
	);
}

export function groupByDay<T extends { pubDate: Date }>(items: T[]): DayGroup<T>[] {
	const groups: DayGroup<T>[] = [];

	for (const item of items) {
		const last = groups[groups.length - 1];
		if (last && isSameUtcDay(last.date, item.pubDate)) {
			last.items.push(item);
			continue;
		}
		groups.push({
			date: item.pubDate,
			items: [item],
		});
	}

	return groups;
}

export function toStreamItem(post: StreamPostInput): StreamItem {
	const type: StreamPostType = post.data.type ?? 'entry';
	const tags = post.data.tags ?? [];
	const wordCount = countWords(post.body);
	const body = stripMdxPreamble(post.body);

	const { excerpt, hasMore } =
		type === 'link'
			? { excerpt: body, hasMore: false }
			: extractExcerptMarkdown(post.body);

	return {
		id: post.id,
		title: post.data.title,
		type,
		pubDate: post.data.pubDate,
		project: post.data.project,
		tags,
		linkUrl: post.data.linkUrl,
		viaUrl: post.data.viaUrl,
		viaTitle: post.data.viaTitle,
		excerptHtml: renderMarkdown(excerpt),
		wordCount,
		hasMore,
		href: `/blog/${post.id}/`,
	};
}

export function formatWordCount(count: number): string {
	const formatted = count.toLocaleString('en-US');
	return `${formatted} word${count === 1 ? '' : 's'}`;
}

export function formatDayHeading(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	});
}

export function formatStreamDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	});
}

export interface ProjectChip {
	slug: string;
	name: string;
}

export function projectChipsFromPosts(
	posts: Array<{ data: { project?: string } }>,
	projects: ReadonlyArray<{ slug: string; name: string }>,
): ProjectChip[] {
	const names = new Map(projects.map((project) => [project.slug, project.name]));
	const seen = new Set<string>();
	const chips: ProjectChip[] = [];

	for (const post of posts) {
		const slug = post.data.project;
		if (!slug || seen.has(slug)) {
			continue;
		}
		seen.add(slug);
		chips.push({ slug, name: names.get(slug) ?? slug });
	}

	return chips;
}
