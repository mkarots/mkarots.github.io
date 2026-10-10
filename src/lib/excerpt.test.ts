import { describe, expect, it } from 'vitest';
import {
	countWords,
	extractExcerptMarkdown,
	splitMarkdownBlocks,
	stripMdxPreamble,
} from './excerpt';

describe('stripMdxPreamble', () => {
	it('removes leading import lines and blank lines', () => {
		const body = [
			"import { Image } from 'astro:assets';",
			"import lsRefused from '../../assets/sandbox-01-ls-refused.png';",
			'',
			'I poked around the sandbox.',
		].join('\n');

		expect(stripMdxPreamble(body)).toBe('I poked around the sandbox.');
	});

	it('leaves ordinary markdown unchanged', () => {
		expect(stripMdxPreamble('Hello **world**.')).toBe('Hello **world**.');
	});
});

describe('splitMarkdownBlocks', () => {
	it('splits on blank lines', () => {
		expect(splitMarkdownBlocks('one\n\ntwo\n\nthree')).toEqual([
			'one',
			'two',
			'three',
		]);
	});
});

describe('countWords', () => {
	it('counts words in the body, ignoring MDX imports', () => {
		const body = "import x from './x';\n\nhello world from here";
		expect(countWords(body)).toBe(4);
	});

	it('returns zero for empty input', () => {
		expect(countWords('   \n')).toBe(0);
	});
});

describe('extractExcerptMarkdown', () => {
	it('returns the first paragraph and hasMore when more blocks exist', () => {
		const body = 'First paragraph with a [link](https://example.com).\n\nSecond paragraph.';
		expect(extractExcerptMarkdown(body)).toEqual({
			excerpt: 'First paragraph with a [link](https://example.com).',
			hasMore: true,
		});
	});

	it('uses the explicit HTML more marker', () => {
		const body = 'Keep this.\n\nAlso this.\n\n<!--more-->\n\nHidden.';
		expect(extractExcerptMarkdown(body)).toEqual({
			excerpt: 'Keep this.\n\nAlso this.',
			hasMore: true,
		});
	});

	it('uses the MDX more comment', () => {
		const body = 'Keep this.\n\nAlso this.\n\n{/* more */}\n\nHidden.';
		expect(extractExcerptMarkdown(body)).toEqual({
			excerpt: 'Keep this.\n\nAlso this.',
			hasMore: true,
		});
	});

	it('skips a leading heading so the excerpt is the first paragraph', () => {
		const body = '## Intro\n\nThe actual briefing.\n\nMore.';
		expect(extractExcerptMarkdown(body)).toEqual({
			excerpt: 'The actual briefing.',
			hasMore: true,
		});
	});

	it('does not claim there is more when the post is a single block', () => {
		expect(extractExcerptMarkdown('Just this.')).toEqual({
			excerpt: 'Just this.',
			hasMore: false,
		});
	});

	it('skips MDX imports before taking the first paragraph', () => {
		const body = [
			"import hero from './hero.png';",
			'',
			'Real opening sentence.',
			'',
			'The rest of the essay.',
		].join('\n');

		expect(extractExcerptMarkdown(body)).toEqual({
			excerpt: 'Real opening sentence.',
			hasMore: true,
		});
	});
});
