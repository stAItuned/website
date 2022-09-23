import { browser } from '$app/environment'

if (browser) {
	throw new Error(`posts can only be imported server-side`)
}
import { unified } from 'unified'
import parse from 'remark-parse'
import gfm from 'remark-gfm'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import frontmatter from 'remark-frontmatter'
import highlight from 'rehype-highlight'
import yaml from 'js-yaml'
import fs from 'fs'
import { CONFIG } from '@config'
import { join as pjoin } from 'path'
import type { ArticleMetadata, Article } from './types'

const BASE_PATH = CONFIG.git.postsPath

const parser = unified().use(parse).use(gfm).use(frontmatter, ['yaml'])
const converter = unified().use(remark2rehype).use(highlight).use(rehypeStringify)

const validMetadata: Record<keyof ArticleMetadata, string> = {
	author: 'string',
	title: 'string',
	date: 'string',
	topics: 'array',
	meta: 'string',
	target: 'string',
	cover: 'string',
	language: 'string'
}

function isValidMetadata(input: any): input is ArticleMetadata {
	const missing_keys = Object.keys(validMetadata).filter((key) => input[key] === undefined)
	if (missing_keys.length > 0) console.log(missing_keys)
	return missing_keys.length === 0
}
function isValidUrl(url: string): boolean {
	try {
		new URL(url)
	} catch {
		return false
	}
	return true
}

function prependBasePathToImages(html: string, slug: string): string {
	const imgregex = /<img[^>]+src="([^">]+)[^>]+?alt="([^">]*)"?>/gi
	const imageBasePath = CONFIG.git.articleImageBasePath.endsWith('/')
		? CONFIG.git.articleImageBasePath
		: CONFIG.git.articleImageBasePath + '/'
	const matches = html.matchAll(imgregex)
	for (const match of matches) {
		const imgUrl = match[1]
		if (isValidUrl(imgUrl)) {
			continue
		}
		const new_url = imageBasePath + slug + '/' + imgUrl
		let imageMatch = match[0]
		imageMatch = imageMatch.replace(imgUrl, new_url)
		html = html.replaceAll(match[0], imageMatch)
	}
	return html
}

/*
Folder structure
- Root/
    - assets/
        - [Article-Slug]/
            - images...
    - [Article-Slug]
        - filename.md (the article, the relative images are inside /assets/Article-Slug/...)
*/

const getSingleArticle = async (folderName: string): Promise<Article | undefined> => {
	const folderPath = pjoin(BASE_PATH, folderName)

	if (!fs.lstatSync(folderPath).isDirectory()) {
		console.log(`${folderName} is not a folder`)
		return undefined
	}
	const markdown_file = (await fs.promises.readdir(folderPath))
		.filter((file) => file.endsWith('.md'))
		.at(0)
	if (markdown_file === undefined) {
		console.log(`${folderName} does not contain a markdown file`)
		return
	}
	let tree = parser.parse(await fs.promises.readFile(pjoin(folderPath, markdown_file)))
	let temporary_metadata = null
	if (tree.children.length > 0 && tree.children[0].type == 'yaml') {
		temporary_metadata = yaml.load(tree.children[0].value)
		tree.children = tree.children.slice(1, tree.children.length)
		// metadata.date = dayjs(metadata.date).format("MMM D, YYYY");
	}

	let content = converter.stringify(converter.runSync(tree))
	let metadata: ArticleMetadata
	if (!isValidMetadata(temporary_metadata)) {
		console.log(`${folderName} has no valid metadata`)
		return
	}
	metadata = temporary_metadata
	if (!isValidUrl(metadata.cover)) {
		metadata.cover = CONFIG.git.articleImageBasePath + folderName + '/' + metadata.cover
	}
	const article: Article = {
		slug: folderName,
		metadata: metadata,
		content: prependBasePathToImages(content, folderName)
	}
	return article
}

const getAllArticles = async (): Promise<(Article | undefined)[]> => {
	const article_folders = (await fs.promises.readdir(BASE_PATH)).filter(
		async (item) =>
			(await fs.promises.lstat(pjoin(BASE_PATH, item))).isDirectory() && !item.startsWith('.')
	)
	// console.log( `Cartelle: ${article_folders}`)
	return Promise.all(article_folders.map(async (folder) => await getSingleArticle(folder)))
}
const articles = (await getAllArticles()).filter((a) => a !== undefined) as Article[]

export default articles
