import type { Metadata } from 'next'
import Link from 'next/link'
import { Download, Lock } from 'lucide-react'
import { db } from '@/lib/firebase/admin'
import {
  AI_EU_ACT_DEFAULT_LOCALE,
  AI_EU_ACT_QUERY_PARAM,
  normalizeAiEuActLocale,
} from '@/lib/i18n/ai-eu-act-translations'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com'
const LEGACY_TOKEN_FALLBACK_TTL_DAYS = 30

function isTokenActive(record: Record<string, unknown>, now: Date): boolean {
  const expiryRaw = record.accessTokenExpiresAt ?? record.access_token_expires_at
  if (typeof expiryRaw === 'string') {
    const expiryDate = new Date(expiryRaw)
    if (!Number.isNaN(expiryDate.getTime())) {
      return expiryDate.getTime() > now.getTime()
    }
  }

  // Backward compatibility for legacy records without explicit expiry.
  const createdRaw = record.createdAt ?? record.created_at
  if (typeof createdRaw !== 'string') return true

  const createdDate = new Date(createdRaw)
  if (Number.isNaN(createdDate.getTime())) return true

  const maxMs = LEGACY_TOKEN_FALLBACK_TTL_DAYS * 24 * 60 * 60 * 1000
  return (createdDate.getTime() + maxMs) > now.getTime()
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[AI_EU_ACT_QUERY_PARAM])
    ? params[AI_EU_ACT_QUERY_PARAM][0]
    : params[AI_EU_ACT_QUERY_PARAM]
  const locale = normalizeAiEuActLocale(langParam ?? AI_EU_ACT_DEFAULT_LOCALE)

  const title = locale === 'en' ? 'EU AI Act resources | stAItuned' : 'Risorse AI EU Act | stAItuned'
  const description =
    locale === 'en'
      ? 'EU AI Act operational toolkit: playbook, Italian compliance roadmap, and AI inventory template.'
      : 'Toolkit operativo AI EU Act: playbook, roadmap italiana di adeguamento e template di mappatura AI.'

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/ai-eu-act/risorse`,
      languages: {
        it: `${SITE_URL}/ai-eu-act/risorse?lang=it`,
        en: `${SITE_URL}/ai-eu-act/risorse?lang=en`,
      },
    },
  }
}

export default async function AiEuActResourcesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const langParam = Array.isArray(params[AI_EU_ACT_QUERY_PARAM])
    ? params[AI_EU_ACT_QUERY_PARAM][0]
    : params[AI_EU_ACT_QUERY_PARAM]
  const locale = normalizeAiEuActLocale(langParam ?? AI_EU_ACT_DEFAULT_LOCALE)

  const token = Array.isArray(params.token) ? params.token[0] : params.token
  const hasToken = typeof token === 'string' && token.trim().length > 0
  let hasValidAccess = false

  if (hasToken) {
    try {
      const querySnapshot = await db()
        .collection('leads_ai_act_tools')
        .where('access_token', '==', token)
        .limit(1)
        .get()
      const now = new Date()
      hasValidAccess = querySnapshot.docs.some((docSnap) =>
        isTokenActive((docSnap.data() ?? {}) as Record<string, unknown>, now),
      )
    } catch (error) {
      console.error('AI EU Act resources token validation error:', error)
    }
  }

  const labels =
    locale === 'en'
      ? {
        title: 'EU AI Act resources',
        subtitle: 'Download the operational toolkit and start execution.',
        resources: [
          {
            title: 'AI Act Operational Playbook (PDF)',
            description: 'Operational guide with timeline, roles, obligations, and execution checklist.',
            href: '/assets/ai-eu-act/AI_Act_Operational_Playbook.pdf',
          },
          {
            title: 'Italian AI Compliance Roadmap (PDF)',
            description: 'Step-by-step roadmap designed for the Italian regulatory context.',
            href: '/assets/ai-eu-act/Italian_AI_Compliance_Roadmap.pdf',
          },
          {
            title: 'AI Inventory Risk Triage Template (Excel)',
            description: 'Template to map AI systems and define compliance priorities.',
            href: '/assets/ai-eu-act/AI_Inventory_Risk_Triage_Template%20stAItuned.xlsx',
          },
        ],
        warningTitle: 'Locked resources',
        warningBody: 'Submit the lead form first to unlock complete downloads.',
        invalidTitle: 'Invalid token',
        invalidBody: 'This token is not valid or expired. Submit the form again to receive a new access link.',
        cta: 'Go to landing page',
        download: 'Download',
        lockedCta: 'Unlock with lead form',
      }
      : {
        title: 'Risorse AI EU Act',
        subtitle: 'Scarica il toolkit operativo e avvia il piano di adeguamento.',
        resources: [
          {
            title: 'Playbook operativo AI Act (PDF)',
            description: 'Guida operativa con timeline, ruoli, obblighi e checklist applicativa.',
            href: '/assets/ai-eu-act/AI_Act_Operational_Playbook.pdf',
          },
          {
            title: 'Roadmap italiana di adeguamento AI (PDF)',
            description: 'Percorso operativo passo-passo pensato per il contesto italiano.',
            href: '/assets/ai-eu-act/Italian_AI_Compliance_Roadmap.pdf',
          },
          {
            title: 'Template mappatura AI e triage rischio (Excel)',
            description: 'Template per mappare i sistemi AI e definire priorita di adeguamento.',
            href: '/assets/ai-eu-act/AI_Inventory_Risk_Triage_Template%20stAItuned.xlsx',
          },
        ],
        warningTitle: 'Risorse bloccate',
        warningBody: 'Compila prima il form di accesso per sbloccare i download completi.',
        invalidTitle: 'Token non valido',
        invalidBody: 'Questo token non e valido o e scaduto. Compila di nuovo il form di accesso per ricevere un nuovo link.',
        cta: 'Vai alla landing page',
        download: 'Download',
        lockedCta: 'Sblocca con il form di accesso',
      }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Mini dark header — consistent with landing */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900 px-4 py-14 text-white sm:px-6">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute right-1/4 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-3 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            stAItuned · AI EU Act
          </p>
          <h1 className="text-3xl font-black text-white">{labels.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{labels.subtitle}</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {!hasValidAccess ? (
          <div className="mb-8 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5">
            <h2 className="text-sm font-semibold text-amber-500">{hasToken ? labels.invalidTitle : labels.warningTitle}</h2>
            <p className="mt-1 text-sm text-slate-200">{hasToken ? labels.invalidBody : labels.warningBody}</p>
            <Link
              href={`/ai-eu-act?lang=${locale}`}
              className="mt-3 inline-flex rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-slate-900 transition hover:from-amber-400 hover:via-amber-300 hover:to-amber-400"
            >
              {labels.cta}
            </Link>
          </div>
        ) : null}

        <div className="space-y-4">
          {labels.resources.map((resource) => (
            <article
              key={resource.href}
              className="group rounded-2xl border border-white/15 bg-slate-900/70 p-5 shadow-xl backdrop-blur transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-amber-500/20"
            >
              <h2 className="text-lg font-semibold text-white">{resource.title}</h2>
              <p className="mt-1 text-sm text-slate-200">{resource.description}</p>
              <a
                href={hasValidAccess ? resource.href : `/ai-eu-act?lang=${locale}#lead-form`}
                target={hasValidAccess ? '_blank' : undefined}
                rel={hasValidAccess ? 'noopener noreferrer' : undefined}
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-sm transition ${hasValidAccess
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 hover:-translate-y-0.5 hover:from-amber-400 hover:via-amber-300 hover:to-amber-400'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
              >
                {hasValidAccess ? (
                  <><Download className="h-4 w-4" /> {labels.download}</>
                ) : (
                  <><Lock className="h-4 w-4" /> {labels.lockedCta}</>
                )}
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
