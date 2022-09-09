import { toVFile, readSync } from 'to-vfile'
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
	tags: 'array'
}

function isValidMetadata(input: any): input is ArticleMetadata {
	return Object.keys(validMetadata).filter((key) => input[key] === undefined).length === 0
}

/*
Folder structure
- Root/
    - assets/
        - [Article-Slug]/
            - images...
    - [Article-Slug]
        - filename.md (where the article is, the relative images are inside /assets/Article-Slug/...)
*/

export const getSingleArticle = (folderName: string): Article | undefined => {
	const folderPath = pjoin(BASE_PATH, folderName)

	if (!fs.lstatSync(folderPath).isDirectory()) {
		console.log(`${folderName} is not a folder`)
		return undefined
	}
	const markdown_file = fs
		.readdirSync(folderPath)
		.filter((file) => file.endsWith('.md'))
		.at(0)
	if (markdown_file === undefined) {
		console.log(`${folderName} does not contain a markdown file`)
		return
	}
	let tree = parser.parse(readSync(pjoin(folderPath, markdown_file)))
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
	const article: Article = {
		slug: folderName,
		metadata: metadata,
		content: content
	}
	return article
}

export const getAllArticles = (): Article[] => {
	const article_folders = fs
		.readdirSync(BASE_PATH)
		.filter((item) => fs.lstatSync(pjoin(BASE_PATH, item)).isDirectory() && !item.startsWith('.'))
	console.log(article_folders)
	return article_folders
		.map((folder) => getSingleArticle(folder))
		.filter((art) => art !== undefined) as Article[]
}
