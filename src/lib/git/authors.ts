import { unified } from 'unified'
import parse from 'remark-parse'
import gfm from 'remark-gfm'
import frontmatter from 'remark-frontmatter'
import yaml from 'js-yaml'
import fs from 'fs'
import { CONFIG } from '@config'
import { join as pjoin } from 'path'
import type { Author } from './types'

const BASE_PATH = CONFIG.git.authorsPath
const parser = unified().use(parse).use(gfm).use(frontmatter, ['yaml'])

const validAuthorMetadata: Record<keyof Author, string> = {
	description: 'string',
	email: 'string',
	linkedin: 'string',
	name: 'string',
	propic: 'string',
	team: 'string[]',
	title: 'string'
}

function isValidAuthor(input: any): input is Author {
	const missing_keys = Object.keys(validAuthorMetadata).filter((key) => input[key] === undefined)
	if (missing_keys.length > 0) console.log(`a ${missing_keys}`)
	return missing_keys.length === 0
}

export async function getSingleAuthor(authorName: string) {
	const authorFolder = pjoin(BASE_PATH, authorName)
	if (!(await fs.promises.lstat(authorFolder)).isDirectory()) {
		console.log(`${authorFolder} is not a folder, aborting`)
		return null
	}
	const folderContent = await fs.promises.readdir(authorFolder)
	const propicPath = folderContent.filter((file) => file.startsWith('propic')).at(0) ?? ''
	const markdownFile = folderContent.filter((file) => file.endsWith('.md')).at(0)
	if (markdownFile === undefined) {
		console.log(`No markdown file inside ${authorFolder} folder, aborting`)
		return null
	}
	let tree = parser.parse(await fs.promises.readFile(pjoin(authorFolder, markdownFile)))
	let author: any
	if (tree.children.length > 0 && tree.children[0].type == 'yaml') {
		author = yaml.load(tree.children[0].value)
		author['propic'] = pjoin(CONFIG.git.authorImageBasePath, authorName, propicPath)
	}
	if (!isValidAuthor(author)) {
		console.log(
			`Author ${authorName} doesn't contain the necessary info in ${markdownFile}, aborting`
		)
		return null
	}
	return author
}

export async function getAllAuthors() {
	const authorFolders = (await fs.promises.readdir(BASE_PATH)).filter(
		async (item) =>
			(await fs.promises.lstat(pjoin(BASE_PATH, item))).isDirectory() && !item.startsWith('.')
	)
	// console.log( `Cartelle: ${article_folders}`)
	return Promise.all(authorFolders.map(async (folder) => await getSingleAuthor(folder)))
}
