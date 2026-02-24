import crypto from 'crypto'

interface WaitlistOptInTokenPayload {
  email: string
  intentKey: string
  locale: 'it' | 'en'
  exp: number
}

type WaitlistTokenInput = Omit<WaitlistOptInTokenPayload, 'exp'> & {
  ttlSeconds?: number
}

function getSecret(): string | null {
  if (process.env.WAITLIST_OPTIN_SECRET) return process.env.WAITLIST_OPTIN_SECRET
  if (process.env.NODE_ENV !== 'production') return 'dev-waitlist-optin-secret'
  return null
}

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url')
}

export function createWaitlistOptInToken(input: WaitlistTokenInput): string | null {
  const secret = getSecret()
  if (!secret) return null

  const payload: WaitlistOptInTokenPayload = {
    email: input.email.trim().toLowerCase(),
    intentKey: input.intentKey.trim(),
    locale: input.locale,
    exp: Math.floor(Date.now() / 1000) + (input.ttlSeconds ?? 60 * 60 * 24 * 7),
  }

  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = sign(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export function verifyWaitlistOptInToken(token: string): WaitlistOptInTokenPayload | null {
  const secret = getSecret()
  if (!secret) return null

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSignature = sign(encodedPayload, secret)
  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (providedBuffer.length !== expectedBuffer.length) return null
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as WaitlistOptInTokenPayload
    if (!parsed?.email || !parsed?.intentKey || !parsed?.locale || !parsed?.exp) return null
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null
    if (parsed.locale !== 'it' && parsed.locale !== 'en') return null
    return parsed
  } catch {
    return null
  }
}
