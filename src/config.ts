export const CONFIG = {
	git: {
		postsPath: "./content/articles" as const,
		authorsPath: "./content/team" as const,
		// Probably this needs to end with a /
		articleImageBasePath: "/assets/content/articles/",
		authorImageBasePath: "/assets/content/team/"
	},
	navigation: {
		pages: [
			{ name: 'Meet us', path: '/meet' },
			{ name: 'Learn', path: '/learn' },
			/*{ name: 'Integrate', path: '/integrate' },*/
			{ name: 'Keep in touch', path: '/keepintouch' }
		]
	}
}
