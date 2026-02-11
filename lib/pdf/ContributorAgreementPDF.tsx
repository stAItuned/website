// ContributorAgreementPDF.tsx

import React from 'react'
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from '@react-pdf/renderer'
import path from 'path'
import { lexer, Token } from 'marked'

// Helper to get font path server-side
const getFontPath = (fontFile: string) => {
    return path.resolve(process.cwd(), 'public/fonts', fontFile)
}

// Helper to get asset path server-side
const getAssetPath = (assetFile: string) => {
    return path.resolve(process.cwd(), 'public/assets', assetFile)
}

// Register fonts
Font.register({
    family: 'Montserrat-V2',
    fonts: [
        { src: getFontPath('Montserrat-Regular.ttf'), fontWeight: 400 },
        { src: getFontPath('Montserrat-SemiBold.ttf'), fontWeight: 600 },
        { src: getFontPath('Montserrat-Bold.ttf'), fontWeight: 700 },
    ],
})

const colors = {
    primary: '#1A1E3B',
    accent: '#F59E0B',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
}

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Montserrat-V2',
        fontSize: 9,
        color: colors.text,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 10,
    },
    logo: {
        width: 100,
        height: 'auto',
    },
    headerInfo: {
        textAlign: 'right',
    },
    headerLabel: {
        fontSize: 8,
        color: colors.textMuted,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.primary,
        marginBottom: 15,
        textAlign: 'center',
    },
    detailsBox: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    detailLabel: {
        width: 110,
        fontWeight: 700,
        color: colors.primary,
    },
    detailValue: {
        flex: 1,
    },
    // Markdown Styles
    h1: { fontSize: 14, fontWeight: 700, color: colors.primary, marginTop: 15, marginBottom: 8, fontFamily: 'Montserrat-V2' },
    h2: { fontSize: 12, fontWeight: 700, color: colors.primary, marginTop: 12, marginBottom: 6, fontFamily: 'Montserrat-V2' },
    h3: { fontSize: 10, fontWeight: 700, color: colors.primary, marginTop: 10, marginBottom: 4, fontFamily: 'Montserrat-V2' },
    paragraph: { marginBottom: 8, lineHeight: 1.4 },
    bold: { fontWeight: 700, fontFamily: 'Montserrat-V2' },
    italic: { fontStyle: 'italic' },
    list: { marginBottom: 8, marginLeft: 10 },
    listItem: { flexDirection: 'row', marginBottom: 2 },
    bullet: { width: 10, fontWeight: 700, fontFamily: 'Montserrat-V2' },
    listItemContent: { flex: 1 },
    hr: { borderBottomWidth: 1, borderBottomColor: colors.border, marginVertical: 10 },

    footer: {
        marginTop: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 7,
        color: colors.textMuted,
    },
    signatureSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '45%',
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: colors.text,
        marginTop: 15,
        paddingTop: 4,
    },
})

// Helper to render inline tokens recursively (bold, text, italic)
function renderInline(tokens: Token[] | undefined): any {
    if (!tokens) return null;
    return tokens.map((token, i) => {
        switch (token.type) {
            case 'strong':
                return <Text key={i} style={styles.bold}>{renderInline((token as any).tokens)}</Text>
            case 'em':
                return <Text key={i} style={styles.italic}>{renderInline((token as any).tokens)}</Text>
            case 'text':
                if ((token as any).tokens) {
                    return <Text key={i}>{renderInline((token as any).tokens)}</Text>
                }
                return (token as any).text
            case 'codespan':
                return <Text key={i} style={{ backgroundColor: '#f1f5f9', padding: 2 }}>{(token as any).text}</Text>
            case 'br':
                return "\n"
            default:
                if ((token as any).tokens) {
                    return <Text key={i}>{renderInline((token as any).tokens)}</Text>
                }
                return (token as any).text || (token as any).raw || null
        }
    })
}

// Simple Markdown component for react-pdf
function MarkdownPDF({ content }: { content: string }) {
    const tokens = lexer(content)

    return (
        <View>
            {tokens.map((token, i) => {
                switch (token.type) {
                    case 'heading': {
                        const styleKey = `h${token.depth}` as keyof typeof styles
                        return <Text key={i} style={styles[styleKey] || styles.h3}>{token.text}</Text>
                    }
                    case 'paragraph':
                        return (
                            <Text key={i} style={styles.paragraph}>
                                {renderInline(token.tokens)}
                            </Text>
                        )
                    case 'list':
                        return (
                            <View key={i} style={styles.list}>
                                {token.items.map((item: any, j: number) => (
                                    <View key={j} style={styles.listItem}>
                                        <Text style={styles.bullet}>•</Text>
                                        <View style={styles.listItemContent}>
                                            {/* In marked, list item content can be in tokens or just text */}
                                            {item.tokens ? (
                                                <Text>
                                                    {item.tokens.map((t: any, k: number) => (
                                                        <React.Fragment key={k}>
                                                            {t.type === 'text' || t.type === 'paragraph' ? (
                                                                renderInline(t.tokens || lexer(t.text).flatMap(bt => (bt as any).tokens || []))
                                                            ) : null}
                                                        </React.Fragment>
                                                    ))}
                                                </Text>
                                            ) : (
                                                <Text>{renderInline(lexer(item.text).flatMap(bt => (bt as any).tokens || []))}</Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )
                    case 'hr':
                        return <View key={i} style={styles.hr} />
                    case 'space':
                        return <View key={i} style={{ height: 5 }} />
                    default:
                        if ((token as any).tokens) {
                            return <Text key={i} style={styles.paragraph}>{renderInline((token as any).tokens)}</Text>
                        }
                        return null
                }
            })}
        </View>
    )
}

interface PDFProps {
    legalName: string
    email: string
    date: string
    version: string
    agreementText: string
    language: 'it' | 'en'
    hash?: string
}

export function ContributorAgreementPDF({ legalName, email, date, version, agreementText, language, hash }: PDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={getAssetPath('general/logo-text-dark.png')} style={styles.logo} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerLabel}>Contributor Agreement</Text>
                        <Text style={{ fontSize: 9, fontWeight: 700 }}>v{version}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    {language === 'it' ? 'Accordo Contributor stAI tuned' : 'stAI tuned Contributor Agreement'}
                </Text>

                {/* Details */}
                <View style={styles.detailsBox}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{language === 'it' ? 'Autore:' : 'Author:'}</Text>
                        <Text style={styles.detailValue}>{legalName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>{email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{language === 'it' ? 'Data di Accettazione:' : 'Acceptance Date:'}</Text>
                        <Text style={styles.detailValue}>{date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Versione:</Text>
                        <Text style={styles.detailValue}>{version}</Text>
                    </View>
                    {hash && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{language === 'it' ? 'Impronta Digitale:' : 'Digital Hash:'}</Text>
                            <Text style={[styles.detailValue, { fontSize: 6, fontFamily: 'Courier', color: colors.textMuted }]}>{hash}</Text>
                        </View>
                    )}
                </View>

                {/* Content */}
                <MarkdownPDF content={agreementText} />

                {/* Signatures */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={{ fontWeight: 700 }}>{language === 'it' ? 'L’Autore' : 'The Author'}</Text>
                        <View style={styles.signatureLine}>
                            <Text>{legalName}</Text>
                            <Text style={{ fontSize: 7, color: colors.textMuted, marginTop: 2 }}>{language === 'it' ? 'Firmato digitalmente' : 'Digitally Signed'}</Text>
                            <Text style={{ fontSize: 6, color: colors.textMuted }}>{date}</Text>
                        </View>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={{ fontWeight: 700 }}>{language === 'it' ? 'L’Editore' : 'The Publisher'}</Text>
                        <View style={styles.signatureLine}>
                            <Text>stAI tuned / Daniele Moltisanti</Text>
                            <Text style={{ fontSize: 7, color: colors.textMuted, marginTop: 2 }}>{language === 'it' ? 'Firmato digitalmente' : 'Digitally Signed'}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} stAI tuned. All rights reserved.
                    </Text>
                    <Text style={styles.footerText}>
                        staituned.com
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
