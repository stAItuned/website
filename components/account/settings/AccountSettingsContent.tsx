import { User } from 'firebase/auth'
import { AccountOverviewSection } from '@/components/account/settings/AccountOverviewSection'
import { WriterWorkspaceSection } from '@/components/account/settings/WriterWorkspaceSection'
import { AccountArticlesSection } from '@/components/account/settings/AccountArticlesSection'
import { DataPrivacySection } from '@/components/account/settings/DataPrivacySection'
import { LegalAgreementSection } from '@/components/account/settings/LegalAgreementSection'
import { DangerZoneSection } from '@/components/account/settings/DangerZoneSection'
import { PersonalBadgeProgramSection } from '@/components/account/settings/PersonalBadgeProgramSection'

interface AccountSettingsContentProps {
  user: User
  memberSince?: Date | null
  bookmarksCount: number
  hasUserData: boolean
  isWriter: boolean | null
  onOpenAgreement: () => void
  onRequestDeleteData: () => void
  onRequestDeleteAccount: () => void
  agreementData?: unknown
}

/**
 * Main content sections for the account settings page.
 */
export function AccountSettingsContent({
  user,
  memberSince,
  bookmarksCount,
  hasUserData,
  isWriter,
  onOpenAgreement,
  onRequestDeleteData,
  onRequestDeleteAccount,
  agreementData,
}: AccountSettingsContentProps) {
  return (
    <div className="min-w-0 space-y-6">
      <AccountOverviewSection
        user={user}
        memberSince={memberSince}
        bookmarksCount={bookmarksCount}
        isWriter={isWriter}
      />
      <WriterWorkspaceSection isWriter={isWriter} />
      <PersonalBadgeProgramSection />
      <AccountArticlesSection userEmail={user.email} />
      <DataPrivacySection
        bookmarksCount={bookmarksCount}
        hasUserData={hasUserData}
        onRequestDeleteData={onRequestDeleteData}
      />
      <LegalAgreementSection onOpenAgreement={onOpenAgreement} agreementData={agreementData} />
      <DangerZoneSection onRequestDeleteAccount={onRequestDeleteAccount} />
    </div>
  )
}
