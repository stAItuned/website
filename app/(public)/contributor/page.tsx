import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import ContributorProgramClient from './ContributorProgramClient'

export const metadata: Metadata = {
    title: 'Contributor Program | stAI tuned',
    description: 'Unisciti a stAI tuned e condividi le tue conoscenze sull\'Intelligenza Artificiale. Scopri come diventare contributor.',
    openGraph: {
        title: 'Contributor Program | stAI tuned',
        description: 'Unisciti a stAI tuned e condividi le tue conoscenze sull\'Intelligenza Artificiale.',
        type: 'website',
    },
}

export default function ContributorProgramPage() {
    const itPath = path.join(process.cwd(), 'public/assets/staituned/contributors/contributor-program.it.md')
    const enPath = path.join(process.cwd(), 'public/assets/staituned/contributors/contributor-program.en.md')

    const contentIt = fs.readFileSync(itPath, 'utf8')
    const contentEn = fs.readFileSync(enPath, 'utf8')

    return (
        <ContributorProgramClient
            contentIt={contentIt}
            contentEn={contentEn}
        />
    )
}
