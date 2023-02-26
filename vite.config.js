import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

import path from 'path'

export default defineConfig({
	plugins: [sveltekit(), imagetools({ include: ['**/*.{png,jpg,svg,webp}?*'] })],
	manifest: false,
	// allows vite access to ./posts
	server: {
		fs: {
			allow: ['.']
		}
	},
	resolve: {
		alias: {
			'@lib': path.resolve('./src/lib'),
			'@config': path.resolve('./src/config'),
			'@components': path.resolve('./src/lib/components'),
			'@stores': path.resolve('./src/stores'),
			'@assets': path.resolve('./src/assets')
		}
	},
	optimizeDeps: {
		include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep']
	}
})
