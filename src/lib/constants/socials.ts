import Instagram from '@assets/footer/Instagram.svg'
import LinkedIn from '@assets/footer/LinkedIn.svg'
import Facebook from '@assets/footer/Facebook.svg'
import TikTok from '@assets/footer/Tiktok.svg'

interface Social {
    name: string,
    url: string,
    image: string
}

const SOCIALS: Social[] = [
    { name: "linkedin", url: "https://www.linkedin.com/company/stai-tuned/", image: LinkedIn },
    { name: "instagram", url: "https://www.instagram.com/stai.tuned/", image: Instagram },
    { name: "facebook", url: "https://www.facebook.com/stAItuned", image: Facebook },
    { name: "tiktok", url: "https://www.tiktok.com/@staituned?lang=en", image: TikTok },
]

export default SOCIALS