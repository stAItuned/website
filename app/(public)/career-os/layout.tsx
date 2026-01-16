import { RoleFitAuditCTA } from '@/components/ui/RoleFitAuditCTA'

export default function CareerOSLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <RoleFitAuditCTA variant="sticky" />
        </>
    )
}
