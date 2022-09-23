import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'

export default defineConfig({
	plugins: [sveltekit()],
	// allows vite access to ./posts
	// server: {
	// 	fs: {
	// 		allow: ["."]
	// 	}
	// },
	resolve: {
		alias: {
			'@lib': path.resolve('./src/lib'),
			'@config': path.resolve('./src/config'),
			'@components': path.resolve('./src/components'),
			'@stores': path.resolve('./src/stores'),
			'@features': path.resolve('./src/features'),
			// '@posts': path.resolve('./posts')
		}
	}
})
