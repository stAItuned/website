import { defineMDSveXConfig as defineConfig } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import relativeImages from 'mdsvex-relative-images'
import rehypeFigure from 'rehype-figure'
import rehypeKatexSvelte from 'rehype-katex-svelte'
import remarkMath from 'remark-math'
import { visit } from 'unist-util-visit'

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [remarkMath, relativeImages, videos],
	rehypePlugins: [rehypeKatexSvelte, rehypeSlug, rehypeAutolinkHeadings, rehypeFigure]
})
/**
 * Adds support to video files in markdown image links
 */
function videos() {
	const extensions = ['mp4', 'webm']
	return function transformer(tree) {
		visit(tree, 'image', (node) => {
			if (extensions.some((ext) => node.url.endsWith(ext))) {
				node.type = 'html'
				node.value = `
			  <video 
				src="${node.url}"
				autoplay
				muted
				playsinline
				loop
				title="${node.alt}"
			  />
			`
			}
		})
	}
}

export default config
