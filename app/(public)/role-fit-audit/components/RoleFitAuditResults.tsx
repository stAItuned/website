'use client'

import Link from 'next/link'
import type { AuditResult } from '../lib/scoring'
import { useRouter } from 'next/navigation'
import { useCareerOS } from '../../career-os/context/CareerOSContext'
import { trackRoleFitAuditCTAClicked } from '@/lib/analytics/trackEvent'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'

function MarkdownText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-[#F59E0B] font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

function MarkdownParagraph({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return (
    <p className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-[#F59E0B] font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}

interface Props {
  result: AuditResult
  locale: RoleFitLocale
}

export default function RoleFitAuditResults({ result, locale }: Props) {
  const t = roleFitAuditTranslations[locale].results
  const { openAuditModal } = useCareerOS()
  const router = useRouter()

  const handleApplyClick = () => {
    trackRoleFitAuditCTAClicked('apply', 'box')
    router.push('/career-os')
  }

  const handleAuditClick = () => {
    trackRoleFitAuditCTAClicked('learn_more', 'box')
    openAuditModal()
  }

  const { normalizedScores, archetype, roleRecommendation, topGaps, readinessLabel, oneLineDiagnosis, nextSteps } = result

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 45) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-1 text-sm font-medium text-green-700 dark:text-green-400 mb-4">
          ✓ {t.completed}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t.title}</h1>
      </div>

      <div className="bg-gradient-to-r from-[#FFF272]/30 to-[#F59E0B]/20 dark:from-[#FFF272]/10 dark:to-[#F59E0B]/10 rounded-2xl border border-[#F59E0B]/30 p-6 mb-4">
        <MarkdownParagraph text={oneLineDiagnosis} className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed" />
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 mb-8 flex items-center gap-3">
        <span className="text-2xl">📧</span>
        <p className="text-sm text-green-700 dark:text-green-400">{t.checkEmail}</p>
      </div>

      <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🎯</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{archetype.name}</h2>
            <p className="text-lg text-[#F59E0B] font-medium italic">
              "<MarkdownText text={archetype.tagline} />"
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.superpower}</p>
            <p className="text-slate-700 dark:text-slate-300"><MarkdownText text={archetype.superpower} /></p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.risk}</p>
            <p className="text-slate-700 dark:text-slate-300"><MarkdownText text={archetype.risk} /></p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.lever}</p>
            <p className="text-slate-700 dark:text-slate-300"><MarkdownText text={archetype.lever} /></p>
          </div>
        </div>

        {result.aiEnhancements?.whyThisArchetype && (
          <div className="mt-6 bg-slate-50 dark:bg-[#0F1117] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.archetypeWhy}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">"<MarkdownText text={result.aiEnhancements.whyThisArchetype} />"</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.scoreSnapshot}</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label: 'Code/Engineering', value: normalizedScores.code, icon: '⚙️' },
            { label: 'Data/ML', value: normalizedScores.data, icon: '📊' },
            { label: 'Product', value: normalizedScores.product, icon: '💡' },
            { label: 'GenAI Systems', value: normalizedScores.genai, icon: '🤖' },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{item.value}/100</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${getScoreColor(item.value)} transition-all duration-500`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t.readiness}</span>
            <span
              className={`px-4 py-1 rounded-full text-sm font-bold ${
                normalizedScores.readiness >= 75
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : normalizedScores.readiness >= 60
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : normalizedScores.readiness >= 45
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {readinessLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.recommendedRoles}</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-[#0F1117] rounded-xl p-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFF272]/50 text-[#1A1E3B] text-xs font-bold uppercase tracking-wider mb-3">NOW</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">{roleRecommendation.now}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.whyFit}</p>
            {result.aiEnhancements?.nowRationale ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"<MarkdownText text={result.aiEnhancements.nowRationale} />"</p>
            ) : (
              <ul className="space-y-1">
                {roleRecommendation.nowReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="text-[#F59E0B]">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-[#0F1117] rounded-xl p-6">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">NEXT</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">{roleRecommendation.next}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t.needsToReachNext}</p>
            {result.aiEnhancements?.nextRationale ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"<MarkdownText text={result.aiEnhancements.nextRationale} />"</p>
            ) : (
              <ul className="space-y-1">
                {roleRecommendation.requirements.map((req, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="text-[#F59E0B]">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {topGaps.length > 0 && (
        <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.topGaps}</h3>
          <div className="space-y-6">
            {topGaps.map((gap, i) => {
              const aiGap = result.aiEnhancements?.personalizedGaps?.find((g) => g.id === gap.id)
              return (
                <div key={gap.id} className="bg-slate-50 dark:bg-[#0F1117] rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white mb-1">{gap.title}</p>
                      {aiGap?.personalizedAnalysis ? (
                        <div className="mb-3 text-sm text-slate-600 dark:text-slate-400 italic bg-white dark:bg-[#151925] p-3 rounded-lg border-l-2 border-[#F59E0B]">
                          "<MarkdownText text={aiGap.personalizedAnalysis} />"
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{gap.whyBlocks}</p>
                      )}

                      <div className="bg-white dark:bg-[#151925] rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B] mb-1">{t.fixIn7Days}</p>
                        <MarkdownParagraph className="text-sm text-slate-700 dark:text-slate-300" text={aiGap?.personalizedFix || gap.fix7Days} />
                        {!aiGap && (
                          <p className="text-xs text-slate-500 mt-2">
                            <span className="font-medium">{t.output}:</span> {gap.output}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {result.aiEnhancements?.coachingNote && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💬</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.coachNote}</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">"<MarkdownText text={result.aiEnhancements.coachingNote} />"</p>
          {result.generatedBy === 'ai' && <p className="text-xs text-slate-400 mt-4 text-right">Powered by Gemini 3 Pro</p>}
        </div>
      )}

      <div className="bg-white dark:bg-[#151925] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.next7Days}</h3>
        <div className="space-y-4">
          {nextSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FFF272]/30 dark:bg-[#FFF272]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <MarkdownParagraph className="text-slate-700 dark:text-slate-300 pt-1" text={step} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1A1E3B] to-[#2A3050] rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">{t.ctaTitle}</h3>
        <p className="text-slate-300 mb-6 max-w-xl mx-auto">{t.ctaSubtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/career-os"
            onClick={handleApplyClick}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold hover:shadow-lg transition"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href="#"
            onClick={handleAuditClick}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">📬 {t.footer}</p>
    </div>
  )
}
