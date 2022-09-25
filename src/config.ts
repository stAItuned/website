export const CONFIG = {
	git: {
		postsPath: "./cms/articles" as const,
		authorsPath: "./cms/team" as const,
		// Probably this needs to end with a /
		articleImageBasePath: "/assets/cms/articles/",
		authorImageBasePath: "/assets/cms/team/"
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
