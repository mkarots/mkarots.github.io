// Project definitions
// The slug should match the project field in blog posts
export const projects = [
	{
		slug: 'hookedllm',
		name: 'hookedllm',
		description: 'HookedLLM allows you to run hooks before and after LLM calls.',
		url: 'https://github.com/mkarots/hookedllm',
		language: 'Python',
	},
	{
		slug: 'grompt',
		name: 'grompt',
		description: 'Grompt is a tool for decoupling prompts from your code.',
		url: 'https://github.com/mkarots/grompt',
		language: 'Python',
	},
	{
		slug: 'noesis',
		name: 'noesis',
		description: "Noesis aims to make it simple for developers to deploy agentic applications with minimal effort.",
		url: 'https://github.com/mkarots/noesis',
		language: 'Python',
	},
	{
		slug: 'codii',
		name: 'codii.dev',
		description: 'Codii is an AI-powered code review assistant that helps you ship better code.',
		url: 'https://codii.dev',
		language: 'Python & TypeScript',
	},
	// {
	// 	slug: 'tinyrag',
	// 	name: 'TinyRAG',
	// 	description: 'TinyRAG is a tiny RAG library that makes it easy to build small scale RAG applications.',
	// 	url: 'https://github.com/mkarots/tinyrag',
	// 	language: 'Python',
	// },
] as const;

export type ProjectSlug = typeof projects[number]['slug'];
