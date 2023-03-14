import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { imagetools } from 'vite-imagetools'

import path from 'path'

export default defineConfig({
	plugins: [sveltekit(), imagetools({ include: ['**\/*.{png,jpg,svg,webp}?*'] })],
	manifest: false,
	// allows vite access to ./posts
	server: {
		fs: {
			allow: ["."]
		},
	},
	resolve: {
		alias: {
			'@lib': path.resolve('./src/lib'),
			'@shared/components': path.resolve('./src/lib/components'),
			'@blog/components': path.resolve('./src/routes/(blog)/components'),
			'@auth/components': path.resolve('./src/routes/(auth)/components'),
			'@protected/components': path.resolve('./src/routes/(protected)/components'),
			'@config': path.resolve('./src/config'),
			'@assets': path.resolve('./src/assets'),
		}
	},
})
