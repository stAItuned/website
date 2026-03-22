import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { businessTranslations, normalizeBusinessLocale } from '@/lib/i18n/business-translations'
import { sendTelegramFeedback } from '@/lib/telegram'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const {
      name,
      email,
      company,
      role,
      processName,
      mainPain,
      notes,
      acceptedPrivacy,
      source,
      page,
      userAgent,
      locale: rawLocale,
    } = body || {}

    const locale = normalizeBusinessLocale(rawLocale)
    const t = businessTranslations[locale].apiErrors.apply

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: t.nameRequired }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: t.invalidEmail }, { status: 400 })
    }
    if (!company || typeof company !== 'string' || !company.trim()) {
      return NextResponse.json({ error: t.companyRequired }, { status: 400 })
    }
    if (!processName || typeof processName !== 'string' || !processName.trim()) {
      return NextResponse.json({ error: t.processNameRequired }, { status: 400 })
    }
    if (!mainPain || typeof mainPain !== 'string' || !mainPain.trim()) {
      return NextResponse.json({ error: t.mainPainRequired }, { status: 400 })
    }
    if (!acceptedPrivacy) {
      return NextResponse.json({ error: t.privacyRequired }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    try {
      const requestsRef = db().collection('business_demo_requests')
      await requestsRef.add({
        name: name.trim(),
        email: normalizedEmail,
        company: company.trim(),
        role: typeof role === 'string' && role.trim() ? role.trim() : null,
        processName: processName.trim(),
        mainPain: mainPain.trim(),
        notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
        acceptedPrivacy: true,
        source: source || 'unknown',
        page: page || '/business',
        userAgent: userAgent || req.headers.get('user-agent') || null,
        createdAt: new Date().toISOString(),
      })
    } catch (dbError) {
      console.error('BUSINESS REQUEST FIREBASE SAVE ERROR:', dbError)
    }

    const telegramMessage = [
      locale === 'en' ? '🆕 New Business Demo Request' : '🆕 Nuova richiesta demo business',
      '',
      `${locale === 'en' ? '👤 Name' : '👤 Nome'}: ${name.trim()}`,
      `📧 Email: ${normalizedEmail}`,
      `${locale === 'en' ? '🏢 Company' : '🏢 Azienda'}: ${company.trim()}`,
      role?.trim() ? `${locale === 'en' ? '🧩 Role' : '🧩 Ruolo'}: ${role.trim()}` : '',
      `${locale === 'en' ? '⚙️ Process' : '⚙️ Processo'}: ${processName.trim()}`,
      `${locale === 'en' ? '🚧 Main pain' : '🚧 Problema principale'}: ${mainPain.trim()}`,
      notes?.trim() ? `${locale === 'en' ? '🗒 Notes' : '🗒 Note'}: ${notes.trim()}` : '',
      source ? `📍 Source: ${source}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    await sendTelegramFeedback({
      category: 'business_demo_request',
      message: telegramMessage,
      email: normalizedEmail,
      page: page || '/business',
      userAgent: userAgent || req.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Business demo request error:', error)
    return NextResponse.json({ error: businessTranslations.it.apiErrors.apply.serverError }, { status: 500 })
  }
}
