import { onMount } from 'svelte'

declare global {
	interface Window {
		hj: {
			q?: any[]
			_hjSettings: any
		}
	}
}

export function trackPageview(request: Request) {
	onMount(() => {
		if (typeof window !== 'undefined') {
			window.hj =
				window.hj ||
				function () {
					;(window.hj.q = window.hj.q || []).push(arguments)
				}
			window.hj.q?.push(['_setAccount', import.meta.env.VITE_HOTJAR_TRACKING_ID])
			window.hj._hjSettings = {
				hjid: import.meta.env.VITE_HOTJAR_TRACKING_ID,
				hjsv: 6
			}
			const { pathname, search } = new URL(import.meta.env.VITE_APP_URL + import.meta.url)
			const url = `${pathname}${search}`
			window.hj?.q?.push(['_trackPageview', url])
		}
	})
}
