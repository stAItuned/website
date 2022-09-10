import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		vite: {
			server: {
				fs: {
					allow: "./static"
				}
			},
			resolve: {
				alias: {
					'@lib': path.resolve('./src/lib'),
					'@config': path.resolve('./src/config'),
					'@components': path.resolve('./src/components'),
					'@stores': path.resolve('./src/stores'),
					'@features': path.resolve('./src/features'),
					'@posts': path.resolve('./posts')
				}
			}
		},
		
	}
}

export default config
