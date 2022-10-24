import { defineMDSveXConfig as defineConfig } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import relativeImages from 'mdsvex-relative-images'
import rehypeFigure from 'rehype-figure'
import rehypeKatexSvelte from 'rehype-katex-svelte'
import remarkMath from 'remark-math'
import remarkGFM from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import { visit } from 'unist-util-visit'
import imageLazyLoading from 'rehype-plugin-image-native-lazy-loading'
import {h, s} from 'hastscript';

/** @type {import('rehype-autolink-headings').Options}  */
const autoLinkConfig = {
	behavior: 'append',
	properties: {
		class: 'autolink-header',
		ariaHidden: true,
		tabIndex: -1,
	},
	content: [
		s(
			'svg.autolink-svg',
			{
				style: "display: inline-block; margin-left: 4px;",
				xmlns: 'http://www.w3.org/2000/svg',
				width: 30,
				height: 30,
				fill: 'currentColor',
				viewBox: '0 0 30 30'
			},
			s('path', {
				d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z'
			})
		)
	]
}

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [remarkMath, relativeImages, videos, remarkGFM],
	rehypePlugins: [
		rehypeKatexSvelte,
		rehypeSlug,
		[rehypeAutolinkHeadings, autoLinkConfig],
		rehypeFigure,
		[rehypeExternalLinks, { rel: ['nofollow', "ugc"] }],
		imageLazyLoading
	]
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
