export type Variant = 'primary' | 'purpleToRose' | 'purpleToIndigo'

export interface CardCTAProps {
	label: string,
	title: string,
	href: string,
	variant?: Variant
}