import { describe, expect, it } from 'vitest';
import {
	formatWordCount,
	groupByDay,
	projectChipsFromPosts,
	toStreamItem,
} from './stream';

describe('groupByDay', () => {
	it('groups consecutive items that share a UTC day', () => {
		const items = [
			{ id: 'a', pubDate: new Date('2026-07-07T08:00:00.000Z') },
			{ id: 'b', pubDate: new Date('2026-07-07T22:00:00.000Z') },
			{ id: 'c', pubDate: new Date('2026-05-25T12:00:00.000Z') },
		];

		const groups = groupByDay(items);
		expect(groups).toHaveLength(2);
		expect(groups[0].items.map((item) => item.id)).toEqual(['a', 'b']);
		expect(groups[1].items.map((item) => item.id)).toEqual(['c']);
	});

	it('returns an empty list for no items', () => {
		expect(groupByDay([])).toEqual([]);
	});
});

describe('toStreamItem', () => {
	it('uses the first paragraph as an HTML excerpt for entries', () => {
		const item = toStreamItem({
			id: 'tiny-shell-in-c-part-1',
			body: 'Build [tinysh](https://github.com/mkarots/tinysh) first.\n\nLater we add pipes.',
			data: {
				title: 'Writing a tiny shell in C',
				pubDate: new Date('2026-07-07T00:00:00.000Z'),
				project: 'tinysh',
				tags: ['c'],
			},
		});

		expect(item.type).toBe('entry');
		expect(item.href).toBe('/blog/tiny-shell-in-c-part-1/');
		expect(item.hasMore).toBe(true);
		expect(item.wordCount).toBe(7);
		expect(item.excerptHtml).toContain(
			'<a href="https://github.com/mkarots/tinysh">tinysh</a>',
		);
		expect(item.excerptHtml).not.toContain('Later we add pipes');
	});

	it('renders the full body for link posts', () => {
		const item = toStreamItem({
			id: 'mistral-cli',
			body: 'Useful table in the post.\n\nAlso see the plugin list.',
			data: {
				type: 'link',
				title: 'Many options for running Mistral',
				pubDate: new Date('2026-09-15T00:00:00.000Z'),
				linkUrl: 'https://example.com/mistral',
				viaUrl: 'https://example.com/via',
				viaTitle: 'LLM',
			},
		});

		expect(item.type).toBe('link');
		expect(item.hasMore).toBe(false);
		expect(item.linkUrl).toBe('https://example.com/mistral');
		expect(item.excerptHtml).toContain('Useful table in the post.');
		expect(item.excerptHtml).toContain('Also see the plugin list.');
	});
});

describe('formatWordCount', () => {
	it('pluralizes and adds a thousands separator', () => {
		expect(formatWordCount(1)).toBe('1 word');
		expect(formatWordCount(2974)).toBe('2,974 words');
	});
});

describe('projectChipsFromPosts', () => {
	it('returns unique projects in first-seen order', () => {
		const chips = projectChipsFromPosts(
			[
				{ data: { project: 'tinysh' } },
				{ data: { project: 'spek' } },
				{ data: { project: 'tinysh' } },
				{ data: {} },
			],
			[
				{ slug: 'tinysh', name: 'tinysh' },
				{ slug: 'spek', name: 'spek' },
			],
		);

		expect(chips).toEqual([
			{ slug: 'tinysh', name: 'tinysh' },
			{ slug: 'spek', name: 'spek' },
		]);
	});

	it('falls back to the slug when the project is unknown', () => {
		expect(
			projectChipsFromPosts([{ data: { project: 'mystery' } }], []),
		).toEqual([{ slug: 'mystery', name: 'mystery' }]);
	});
});
