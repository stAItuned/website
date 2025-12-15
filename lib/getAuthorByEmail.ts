import { allTeams } from '@/lib/contentlayer'

/**
 * reliable way to match a logged-in user (by email) to a content author
 * @param email user email from firebase auth
 * @returns author name or null if not found
 */
export function getAuthorByEmail(email: string | null | undefined): string | null {
    if (!email) return null

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Find team member with matching email
    const teamMember = allTeams.find((member: any) =>
        member.email?.toLowerCase().trim() === normalizedEmail
    )

    return teamMember?.name || null
}
