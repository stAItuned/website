import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { imagetools } from 'vite-imagetools'

import path from 'path'

export default defineConfig({
	plugins: [sveltekit(), imagetools()],
	manifest: false,
	// allows vite access to ./posts
	server: {
		fs: {
			allow: ["."]
		}
	},
	resolve: {
		alias: {
			'@lib': path.resolve('./src/lib'),
			'@config': path.resolve('./src/config'),
			'@components': path.resolve('./src/components'),
			'@stores': path.resolve('./src/stores'),
			'@features': path.resolve('./src/features'),
		}
	},


})
