import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedPosts } from '../lib/posts';
import { toStreamItem } from '../lib/stream';

export async function GET(context) {
	const posts = await getPublishedPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => {
			const item = toStreamItem(post);
			return {
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description ?? item.excerptHtml,
				content: item.excerptHtml,
				link: `/blog/${post.id}/`,
				categories: [
					...(post.data.project ? [post.data.project] : []),
					...post.data.tags,
				],
			};
		}),
	});
}
