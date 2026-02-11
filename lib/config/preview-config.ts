export const previewConfig = {
    // In production, this should be a strong secret stored in env vars
    secret: process.env.PREVIEW_SECRET,
}

export function isPreviewEnabled() {
    return !!previewConfig.secret
}

export function isValidPreviewToken(token: string | null) {
    if (!token || !previewConfig.secret) return false
    return token === previewConfig.secret
}
