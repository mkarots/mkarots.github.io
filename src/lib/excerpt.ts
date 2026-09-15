const MORE_MARKER = '<!--more-->';

export function stripMdxPreamble(body: string): string {
	const lines = body.split('\n');
	let i = 0;

	while (i < lines.length && lines[i].trim() === '') {
		i += 1;
	}

	while (i < lines.length) {
		const line = lines[i];
		if (/^import\s/.test(line) || /^export\s/.test(line)) {
			i += 1;
			continue;
		}
		break;
	}

	while (i < lines.length && lines[i].trim() === '') {
		i += 1;
	}

	return lines.slice(i).join('\n');
}

export function splitMarkdownBlocks(markdown: string): string[] {
	return markdown
		.split(/\n[ \t]*\n/)
		.map((block) => block.trim())
		.filter(Boolean);
}

export function countWords(markdown: string): number {
	const words = stripMdxPreamble(markdown)
		.trim()
		.split(/\s+/)
		.filter(Boolean);
	return words.length;
}

export function extractExcerptMarkdown(body: string): {
	excerpt: string;
	hasMore: boolean;
} {
	const cleaned = stripMdxPreamble(body).trim();
	if (!cleaned) {
		return { excerpt: '', hasMore: false };
	}

	const moreIndex = cleaned.indexOf(MORE_MARKER);
	if (moreIndex !== -1) {
		return {
			excerpt: cleaned.slice(0, moreIndex).trim(),
			hasMore: true,
		};
	}

	const blocks = splitMarkdownBlocks(cleaned);
	let start = 0;
	while (start < blocks.length && /^#{1,6}\s/.test(blocks[start])) {
		start += 1;
	}

	const excerpt = blocks[start] ?? blocks[0] ?? '';
	const hasMore = start + 1 < blocks.length;
	return { excerpt, hasMore };
}
