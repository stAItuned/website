import { CONFIG } from '@config'
import type { RequestEvent } from '@sveltejs/kit'
import fs from 'fs'
import { join as pjoin } from 'path'

export const get = (req: RequestEvent) => {
	// `params.id` comes from [id].js
	console.log
	const imageName = req.params.slug
	const imagePath = pjoin(CONFIG.git.postsPath, 'assets', imageName)
	console.log(`Searching image in ${imagePath}`)
	if (!fs.existsSync(imagePath) || !fs.lstatSync(imagePath).isFile()) {
		return new Response(JSON.stringify({ error: 'Image not found' }), {
			status: 404,
			statusText: 'Not Found',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	const imageBynary = fs.readFileSync(imagePath, { encoding: 'binary' })
	const arrayBuffer = new ArrayBuffer(imageBynary.length)
	const intArray = new Uint8Array(arrayBuffer)
	for (let i = 0; i < imageBynary.length; i++) {
		intArray[i] = imageBynary.charCodeAt(i)
	}
	const imageBlob = new Blob([intArray], { type: 'image/png' })
	const res = new Response(imageBlob, {
		status: 200,
		statusText: 'OK',
		headers: {
			'content-type': 'image/png',
		}
	})
	return res
}
