# Blog operating manual

The homepage is a chronological **river**. Visitors scroll a mixed timeline of essays and annotated links. The feed is the reading surface: each item shows a useful slice of the post with live HTML (links, code, lists). Opening the permalink is only required when someone wants the rest of an essay.

Posts live in `src/content/blog/` as Markdown or MDX.

## Choose a type

| Type | Use for | What the river shows | Title points to |
| --- | --- | --- | --- |
| `entry` (default) | An essay, walkthrough, or series chapter | First markdown block, or everything before `<!--more-->`, plus `[... N words]` | Local permalink `/blog/<slug>/` |
| `link` | An annotated URL | The **full** body | `linkUrl` (the source). The date in the footer is the local permalink |

If you found something worth pointing at, write a **link** post. Do not wait until it is an essay. The river only feels like Simon’s once short annotated links mix with longer entries.

### Entry

```yaml
---
title: "Writing a tiny shell in C — Part 1"
description: "SEO / RSS summary. Not shown in the river."
pubDate: 2026-07-07
project: tinysh
tags: [c, shells]
---
```

### Link

```yaml
---
type: link
title: "Many options for running Mistral in your terminal"
linkUrl: https://example.com/the-thing
viaUrl: https://someone-who-sent-it.example
viaTitle: LLM
pubDate: 2026-09-15
project: hookedllm
tags: [llms, cli]
---

A few sentences of commentary. Nested links, lists, and code stay live in the feed.
```

`linkUrl` is required for `type: link`. `viaUrl` / `viaTitle` are optional attribution.

## First paragraph is the product

For **entries**, the opening is the homepage. Write it as a briefing, not a teaser:

- Name the thing
- Say why it matters
- Put real links in that slice

Do not open with a hook that only makes sense after a click.

`description` is SEO and RSS only. It does not appear in the river.

### `<!--more-->`

By default the river takes the first markdown block (stop at the first blank line, skip a leading heading). If that block is a series disclaimer or otherwise weak, put `<!--more-->` after a better slice:

```markdown
*This is Part 1 of a series...*

We're building **tinysh**, a small shell that can run `ls -la | grep tiny`.
Source: [github.com/mkarots/tinysh](https://github.com/mkarots/tinysh).

<!--more-->

## The mental model
```

Everything above the marker is the river excerpt. The word count still covers the whole post.

## `project` vs `tags`

| Field | What it is | Rules | Where it shows |
| --- | --- | --- | --- |
| `project` | At most **one** slug from `src/projects.config.ts` | Only when the post is about that repo. Omit it otherwise | Homepage “On” chips, stream footer, `/blog/project/<slug>` |
| `tags` | Extra topics | Lowercase, hyphenated. Two or three. Do not repeat the project slug | Stream footer, `/blog/tag/<tag>` |

Current project slugs: `hookedllm`, `grompt`, `noesis`, `codii`, `raglet`, `spek`, `tinysh`.

Examples:

- Tiny-shell series → `project: tinysh`, maybe `tags: [c]`
- Evals essay with no matching repo → no `project`, maybe `tags: [evals, llms]`
- Link about someone else’s CLI that you tried with hookedllm → `project: hookedllm`, `tags: [llms, cli]`

Adding a new project: add it to `src/projects.config.ts` first, then use that slug on posts. The homepage chip appears once at least one published post uses it.

## File names and permalinks

- File: `src/content/blog/my-post-slug.md` (or `.mdx`)
- Local URL: `/blog/my-post-slug/`
- Link posts still get a local slug. The river title goes out to `linkUrl`; the footer date stays on-site

Set `draft: true` to keep a post off the homepage, `/blog`, and RSS.

## MDX

MDX is fine for entries that need imported images. Leading `import` / `export` lines are stripped before the excerpt is taken, so they will not leak into the river.

Prefer plain Markdown for **link** posts. The river renders link bodies with a smaller Markdown pipeline (no MDX components).

## Cadence

- **Link** whenever you would otherwise dump a URL in Slack or a notes app
- **Entry** when you have an argument, a walkthrough, or a series chapter
- Bias toward shipping links. Four truncated essays is a card index; a mix of links and essays is a river

## Checklist before publish

1. Type is `entry` or `link` (and `linkUrl` is set if `link`)
2. Opening slice is useful on its own, with links if they matter
3. `<!--more-->` is in the right place if the first block is not the briefing
4. `project` matches a slug in `projects.config.ts`, or is omitted
5. Tags are sparse, lowercase, hyphenated
6. `description` exists if you care about search / RSS cards
