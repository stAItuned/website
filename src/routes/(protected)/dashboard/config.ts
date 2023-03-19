import type { CardCTAProps } from '@protected/components/dashboard-blocks/types'

export interface CallToAction {
	props: CardCTAProps,
	action: string,
	promo: string
}

export const callToActions: CallToAction[] = [
	{
		props: {
			label: 'Draft',
			title: 'See all your draft articles',
			href: '/articles/draft',
			variant: 'purpleToIndigo'
		},
		action: 'Let\'s start writing your own content!',
		promo: 'Sharing your knowledge has never been easier!'
	},
	{
		props: {
			label: 'Published',
			title: 'See all your published articles',
			href: '/articles/published',
			variant: 'purpleToRose'
		},
		action: 'Let\'s start writing your own content!',
		promo: 'Sharing your knowledge has never been easier!'
	},
	{
		props: {
			label: 'Blog',
			title: 'Go to the blog',
			href: '/',
			variant: 'primary'
		},
		action: 'Let\'s start writing your own content!',
		promo: 'Sharing your knowledge has never been easier!'
	}
]