import type { SvelteComponentDev } from 'svelte/internal'
import { Icons } from '@components/ui-core'

interface Social {
    name: string
    url: string
    icon: typeof SvelteComponentDev
}

const SOCIALS: Social[] = [
    {
        name: 'linkedin',
        url: 'https://www.linkedin.com/company/stai-tuned/',
        icon: Icons.Brands.LinkedIn
    },
    {
        name: 'instagram',
        url: 'https://www.instagram.com/stai.tuned/',
        icon: Icons.Brands.Instagram
    },
    { name: 'facebook', url: 'https://www.facebook.com/stAItuned', icon: Icons.Brands.Facebook },
    { name: 'tiktok', url: 'https://www.tiktok.com/@staituned?lang=en', icon: Icons.Brands.TikTok }
]

export default SOCIALS