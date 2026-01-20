// This is a React component file for PDF generation, NOT a Server Action
// The actual PDF generation happens in generatePDF.ts

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Link,
    Image,
} from '@react-pdf/renderer'
import type { AuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'

// =============================================================================
// Font Registration
// =============================================================================

import path from 'path'

// Helper to get font path server-side
const getFontPath = (fontFile: string) => {
    return path.resolve(process.cwd(), 'public/fonts', fontFile)
}

// Helper to get asset path server-side
const getAssetPath = (assetFile: string) => {
    return path.resolve(process.cwd(), 'public/assets', assetFile)
}

// Register Montserrat font from local file system
Font.register({
    family: 'Montserrat-V2',
    fonts: [
        {
            src: getFontPath('Montserrat-Regular.ttf'),
            fontWeight: 400,
        },
        {
            src: getFontPath('Montserrat-SemiBold.ttf'),
            fontWeight: 600,
        },
        {
            src: getFontPath('Montserrat-Bold.ttf'),
            fontWeight: 700,
        },
    ],
})

// =============================================================================
// Color Palette (stAItuned branding)
// =============================================================================

const colors = {
    primary: '#1A1E3B',
    accent: '#F59E0B',
    accentLight: '#FFF272',
    text: '#1e293b',
    textMuted: '#64748b',
    white: '#ffffff',
    bgLight: '#f8fafc',
    bgCard: '#f1f5f9',
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
    border: '#e2e8f0',
    indigoLight: '#e0e7ff',
    indigo: '#4f46e5',
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Montserrat-V2',
        fontSize: 10,
        color: colors.text,
        backgroundColor: colors.white,
    },
    // Deep Dive Styles
    deepDiveSection: {
        marginBottom: 20,
    },
    deepDiveTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.primary,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 4,
    },
    deepDiveText: {
        fontSize: 10,
        lineHeight: 1.6,
        color: colors.text,
        textAlign: 'justify',
    },
    deepDiveBox: {
        backgroundColor: colors.bgCard,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: colors.accentLight,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 700,
        color: colors.primary,
    },
    logoAccent: {
        color: colors.accent,
    },
    headerDate: {
        fontSize: 9,
        color: colors.textMuted,
    },
    // Title section
    titleSection: {
        marginBottom: 25,
        textAlign: 'center',
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 11,
        color: colors.textMuted,
    },
    // Diagnosis box
    diagnosisBox: {
        backgroundColor: '#fef3c7',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.accent,
    },
    diagnosisText: {
        fontSize: 11,
        lineHeight: 1.6,
        color: colors.text,
    },
    diagnosisBold: {
        fontWeight: 700,
        color: colors.accent,
    },
    // Archetype section
    archetypeSection: {
        backgroundColor: colors.bgCard,
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    archetypeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    archetypeEmoji: {
        fontSize: 28,
        marginRight: 12,
    },
    archetypeName: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.primary,
    },
    archetypeTagline: {
        fontSize: 11,
        color: colors.accent,
        marginTop: 2,
    },
    archetypeGrid: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    archetypeColumn: {
        flex: 1,
    },
    archetypeLabel: {
        fontSize: 8,
        textTransform: 'uppercase',
        color: colors.textMuted,
        marginBottom: 4,
        fontWeight: 700,
    },
    archetypeValue: {
        fontSize: 10,
        lineHeight: 1.4,
    },
    // Scores
    scoresSection: {
        marginBottom: 25,
        padding: 15,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.primary,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    scoreRow: {
        flexDirection: 'column',
        gap: 10,
    },
    scoreItem: {
        marginBottom: 8,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    scoreLabel: {
        fontSize: 10,
        fontWeight: 600,
        color: colors.text,
    },
    scoreValue: {
        fontSize: 10,
        fontWeight: 700,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    // Readiness
    readinessBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    readinessBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        fontWeight: 700,
        fontSize: 9,
        textTransform: 'uppercase',
    },
    // Roles
    rolesSection: {
        marginBottom: 20,
    },
    rolesGrid: {
        flexDirection: 'row',
        gap: 15,
    },
    roleCard: {
        flex: 1,
        backgroundColor: colors.bgCard,
        borderRadius: 8,
        padding: 12,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 8,
    },
    roleBadgeNow: {
        backgroundColor: 'rgba(255, 242, 114, 0.5)',
    },
    roleBadgeNext: {
        backgroundColor: '#e2e8f0',
    },
    roleBadgeText: {
        fontSize: 8,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    roleTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: colors.primary,
        marginBottom: 6,
    },
    roleReasonLabel: {
        fontSize: 8,
        fontWeight: 700,
        color: colors.textMuted,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    roleReason: {
        fontSize: 9,
        marginBottom: 2,
        color: colors.text,
        lineHeight: 1.3,
    },
    // Gaps
    gapsSection: {
        marginBottom: 20,
    },
    gapCard: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: colors.bgCard,
        padding: 10,
        borderRadius: 8,
    },
    gapNumber: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    gapNumberText: {
        color: colors.red,
        fontSize: 10,
        fontWeight: 700,
    },
    gapContent: {
        flex: 1,
    },
    gapTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: colors.primary,
        marginBottom: 2,
    },
    gapWhy: {
        fontSize: 10,
        color: colors.textMuted,
        marginBottom: 6,
    },
    gapFixBox: {
        backgroundColor: colors.white,
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    gapFixLabel: {
        fontSize: 8,
        fontWeight: 700,
        color: colors.accent,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    gapFixText: {
        fontSize: 9,
        color: colors.text,
        marginBottom: 2,
    },
    gapOutput: {
        fontSize: 8,
        color: colors.textMuted,
    },
    // Steps
    stepsSection: {
        marginBottom: 20,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    stepNumber: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(255, 242, 114, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    stepNumberText: {
        fontSize: 9,
        fontWeight: 700,
        color: colors.accent,
    },
    stepText: {
        fontSize: 10,
        flex: 1,
        lineHeight: 1.4,
    },
    // CTA
    ctaSection: {
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    ctaTitle: {
        color: colors.white,
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 4,
    },
    ctaText: {
        color: '#cbd5e1',
        fontSize: 9,
        textAlign: 'center',
        marginBottom: 10,
    },
    ctaButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        textDecoration: 'none',
    },
    ctaButtonText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 700,
    },
    // Footer
    footer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: colors.textMuted,
    },
    footerLink: {
        fontSize: 8,
        color: colors.primary,
        textDecoration: 'none',
    },
})

// =============================================================================
// Helper Components
// =============================================================================

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <View style={styles.scoreItem}>
            <View style={styles.scoreHeader}>
                <Text style={styles.scoreLabel}>{label}</Text>
                <Text style={[styles.scoreValue, { color }]}>{value}/100</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${value}%`, backgroundColor: color }]} />
            </View>
        </View>
    )
}

function DiagnosisText({ text }: { text: string }) {
    // Basic bold parsing for **text**
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return (
        <Text style={styles.diagnosisText}>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <Text key={i} style={styles.diagnosisBold}>
                        {part}
                    </Text>
                ) : (
                    part
                )
            )}
        </Text>
    )
}

// =============================================================================
// Main Document Component
// =============================================================================

interface PDFProps {
    result: AuditResult
    name?: string
}

export function RoleFitAuditPDFDocument({ result, name }: PDFProps) {
    const {
        normalizedScores,
        archetype,
        roleRecommendation,
        topGaps,
        readinessLabel,
        oneLineDiagnosis,
        nextSteps,
    } = result

    const pdfAnalysis = result.aiEnhancements?.pdfAnalysis

    const getScoreColor = (score: number) => {
        if (score >= 70) return colors.green
        if (score >= 45) return colors.yellow
        return colors.red
    }

    const readinessColor =
        normalizedScores.readiness >= 75
            ? { bg: '#dcfce7', text: '#15803d' }
            : normalizedScores.readiness >= 60
                ? { bg: '#dbeafe', text: '#1d4ed8' }
                : normalizedScores.readiness >= 45
                    ? { bg: '#fef9c3', text: '#a16207' }
                    : { bg: '#fee2e2', text: '#b91c1c' }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Image
                            src={getAssetPath('general/logo-text-dark.png')}
                            style={{ width: 120, height: 'auto', marginBottom: 4 }}
                        />
                        <Text style={styles.headerDate}>
                            {new Date().toLocaleDateString('it-IT')}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 9, color: colors.textMuted }}>
                        Report Personale per {name || 'Te'}
                    </Text>
                </View>

                {/* Main Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Il tuo Role Fit Audit</Text>
                    <Text style={styles.subtitle}>
                        Analisi di compatibilità per ruoli AI & GenAI
                    </Text>
                </View>

                {/* One Line Diagnosis */}
                <View style={styles.diagnosisBox}>
                    <DiagnosisText text={oneLineDiagnosis} />
                </View>

                <View style={styles.archetypeSection}>
                    <View style={styles.archetypeHeader}>
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: colors.white, fontSize: 14, fontWeight: 700 }}>A</Text>
                        </View>
                        <View>
                            <Text style={styles.archetypeName}>{archetype.name}</Text>
                            <Text style={styles.archetypeTagline}>"{archetype.tagline}"</Text>
                        </View>
                    </View>
                    <View style={styles.archetypeGrid}>
                        <View style={styles.archetypeColumn}>
                            <Text style={styles.archetypeLabel}>Superpower</Text>
                            <Text style={styles.archetypeValue}>{archetype.superpower}</Text>
                        </View>
                        <View style={styles.archetypeColumn}>
                            <Text style={styles.archetypeLabel}>Rischio</Text>
                            <Text style={styles.archetypeValue}>{archetype.risk}</Text>
                        </View>
                    </View>
                </View>

                {/* Scores Snapshot */}
                <View style={styles.scoresSection}>
                    <Text style={styles.sectionTitle}>SCORE SNAPSHOT</Text>
                    <View style={styles.scoreRow}>
                        <ScoreBar
                            label="Code / Engineering"
                            value={normalizedScores.code}
                            color={getScoreColor(normalizedScores.code)}
                        />
                        <ScoreBar
                            label="Data / ML"
                            value={normalizedScores.data}
                            color={getScoreColor(normalizedScores.data)}
                        />
                        <ScoreBar
                            label="Product / Strategy"
                            value={normalizedScores.product}
                            color={getScoreColor(normalizedScores.product)}
                        />
                        <ScoreBar
                            label="GenAI Systems"
                            value={normalizedScores.genai}
                            color={getScoreColor(normalizedScores.genai)}
                        />
                    </View>

                    {/* Readiness */}
                    <View style={styles.readinessBox}>
                        <Text style={{ fontSize: 10, fontWeight: 600 }}>GenAI Readiness</Text>
                        <View
                            style={[
                                styles.readinessBadge,
                                { backgroundColor: readinessColor.bg },
                            ]}
                        >
                            <Text style={{ color: readinessColor.text }}>{readinessLabel}</Text>
                        </View>
                    </View>
                </View>

                {/* Roles */}
                <View style={styles.rolesSection}>
                    <Text style={styles.sectionTitle}>RUOLI CONSIGLIATI</Text>
                    <View style={styles.rolesGrid}>
                        {/* NOW */}
                        <View style={styles.roleCard}>
                            <View style={[styles.roleBadge, styles.roleBadgeNow]}>
                                <Text style={[styles.roleBadgeText, { color: colors.primary }]}>
                                    NOW
                                </Text>
                            </View>
                            <Text style={styles.roleTitle}>{roleRecommendation.now}</Text>
                            <Text style={styles.roleReasonLabel}>Perché sei un fit:</Text>
                            {/* Use AI Rationale if available, otherwise static list */}
                            {result.aiEnhancements?.nowRationale ? (
                                <Text style={styles.roleReason}>{result.aiEnhancements.nowRationale}</Text>
                            ) : (
                                roleRecommendation.nowReasons.slice(0, 2).map((r, i) => (
                                    <Text key={i} style={styles.roleReason}>
                                        • {r}
                                    </Text>
                                ))
                            )}
                        </View>

                        {/* NEXT */}
                        <View style={styles.roleCard}>
                            <View style={[styles.roleBadge, styles.roleBadgeNext]}>
                                <Text style={[styles.roleBadgeText, { color: colors.textMuted }]}>
                                    NEXT
                                </Text>
                            </View>
                            <Text style={styles.roleTitle}>{roleRecommendation.next}</Text>
                            <Text style={styles.roleReasonLabel}>Cosa ti serve:</Text>
                            {/* Use AI Rationale if available, otherwise static list */}
                            {result.aiEnhancements?.nextRationale ? (
                                <Text style={styles.roleReason}>{result.aiEnhancements.nextRationale}</Text>
                            ) : (
                                roleRecommendation.requirements.slice(0, 2).map((r, i) => (
                                    <Text key={i} style={styles.roleReason}>
                                        • {r}
                                    </Text>
                                ))
                            )}
                        </View>
                    </View>
                </View>

                {/* Top Gaps */}
                {topGaps.length > 0 && (
                    <View style={styles.gapsSection}>
                        <Text style={styles.sectionTitle}>TOP 3 GAP DA COLMARE</Text>
                        {topGaps.map((gap, i) => {
                            const aiGap = result.aiEnhancements?.personalizedGaps?.find(g => g.id === gap.id);
                            return (
                                <View key={gap.id} style={styles.gapCard}>
                                    <View style={styles.gapNumber}>
                                        <Text style={styles.gapNumberText}>{i + 1}</Text>
                                    </View>
                                    <View style={styles.gapContent}>
                                        <Text style={styles.gapTitle}>{gap.title}</Text>
                                        <Text style={styles.gapWhy}>{gap.whyBlocks}</Text>

                                        {/* AI Analysis for Gap */}
                                        {aiGap?.personalizedAnalysis && (
                                            <Text style={[styles.gapWhy, { color: colors.primary, fontStyle: undefined, marginBottom: 8 }]}>
                                                "{aiGap.personalizedAnalysis}"
                                            </Text>
                                        )}

                                        <View style={styles.gapFixBox}>
                                            <Text style={styles.gapFixLabel}>Fix in 7 giorni</Text>
                                            <Text style={styles.gapFixText}>{aiGap?.personalizedFix || gap.fix7Days}</Text>
                                            {!aiGap && (
                                                <Text style={styles.gapOutput}>
                                                    Output: {gap.output}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Deep Dive Analysis (AI Extended) */}
                {pdfAnalysis && (
                    <View style={{ marginTop: 10, marginBottom: 20 }}>


                        {/* Executive Summary */}
                        <View style={styles.deepDiveBox}>
                            <Text style={styles.deepDiveTitle}>Executive Summary</Text>
                            <Text style={styles.deepDiveText}>
                                {pdfAnalysis.executiveSummary}
                            </Text>
                        </View>

                        {/* Strengths */}
                        <View style={styles.deepDiveSection}>
                            <Text style={styles.deepDiveTitle}>Punti di Forza</Text>
                            <Text style={styles.deepDiveText}>
                                {pdfAnalysis.strengthsAnalysis}
                            </Text>
                        </View>

                        {/* Weaknesses */}
                        <View style={styles.deepDiveSection}>
                            <Text style={styles.deepDiveTitle}>Aree di Miglioramento</Text>
                            <Text style={styles.deepDiveText}>
                                {pdfAnalysis.weaknessesAnalysis}
                            </Text>
                        </View>

                        {/* Career Strategy */}
                        <View style={[styles.deepDiveBox, { backgroundColor: colors.indigoLight, marginTop: 10 }]}>
                            <Text style={[styles.deepDiveTitle, { color: colors.indigo, borderBottomColor: '#c7d2fe' }]}>
                                Strategia di Carriera
                            </Text>
                            <Text style={styles.deepDiveText}>
                                {pdfAnalysis.careerStrategy}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Next Steps */}
                <View style={styles.stepsSection}>
                    <Text style={styles.sectionTitle}>I PROSSIMI 7 GIORNI</Text>
                    {nextSteps.map((step, i) => (
                        <View key={i} style={styles.stepRow}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>{i + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    ))}
                </View>

                {/* CTA */}
                <View style={styles.ctaSection}>
                    <Text style={styles.ctaTitle}>Prenota il tuo 1:1 per avere un feedback personalizzato sul tuo Role Fit Audit</Text>
                    <Text style={styles.ctaText}>
                        Una call <strong>gratuita</strong> di 15 minuti, in cui i nostri esperti AI saranno a <strong>tua completa disposizione</strong> per darti feedback, chiarire dubbi, darti consigli.
                    </Text>
                    <Link src="https://staituned.com/career-os#candidati" style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>Candidati al Career OS →</Text>
                    </Link>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} stAItuned. Tutti i diritti riservati.
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Link src="https://www.linkedin.com/company/stai-tuned">
                            <Image
                                src={getAssetPath('general/linkedin.png')}
                                style={{ width: 12, height: 12, opacity: 0.6 }}
                            />
                        </Link>
                        <Link src="https://staituned.com">
                            <Image
                                src={getAssetPath('general/logo-dark.png')}
                                style={{ width: 12, height: 12, opacity: 0.6 }}
                            />
                        </Link>
                        <Link src="https://staituned.com" style={styles.footerLink}>
                            staituned.com
                        </Link>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
