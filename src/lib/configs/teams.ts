// @ts-ignore
import techLogo from '@assets/team/tech_large.png?h=512?webp'
// @ts-ignore
import marketingLogo from '@assets/team/marketing_large.png?h=512?webp'
// @ts-ignore
import writersLogo from '@assets/team/writers_large.png?h=512?webp'

export const NAMES = ["Tech", "Marketing", "Writers"] as const

export const LOGOS = {
    tech: techLogo,
    marketing: marketingLogo,
    writers: writersLogo,
}

export const TEAMS_DATA = [
    { name: "Tech", logo: techLogo },
    { name: "Marketing", logo: marketingLogo },
    { name: "Writers", logo: writersLogo }
] as const

export const TECH_ORDER = [
    'Daniele Moltisanti',
    'Francesco Di Salvo',
    'Davide Nardini',
    'Alex Buffa',
    'Francesco Di Gangi'
]

export const MARKETING_ORDER = [
    'Roberta Ghidini',
    'Alessandra Lo Chirco',
    'Alice Ghidini',
    'Davide Scurto',
    'Emanuele Migliore',
    'Francesca Cancelliere',
    'Gerarda Malanga',
    'Sofia Pedrini',
    'Valeria Tardio'
]