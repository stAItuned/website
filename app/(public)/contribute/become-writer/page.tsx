import { redirect } from 'next/navigation'

type LegacyPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LegacyBecomeWriterPage({ searchParams }: LegacyPageProps) {
  const params = (await searchParams) ?? {}
  const nextParam = params.next
  const nextValue = Array.isArray(nextParam) ? nextParam[0] : nextParam

  if (typeof nextValue === 'string' && nextValue.startsWith('/')) {
    redirect(`/become-writer?next=${encodeURIComponent(nextValue)}`)
  }

  redirect('/become-writer')
}
