interface ImportMetaEnv {
	VITE_NOTION_API_KEY: string
}

declare module '@sveltejs/kit' {
	interface Request {
		query: Record<string, string>
	}
}
