export const getContentDateTime = (date?: string, updatedAt?: string): number => {
  const primary = updatedAt ? new Date(updatedAt).getTime() : Number.NaN
  if (Number.isFinite(primary)) return primary

  const fallback = date ? new Date(date).getTime() : Number.NaN
  if (Number.isFinite(fallback)) return fallback

  return 0
}

export const getPublishedDateTime = (date?: string, updatedAt?: string): number => {
  const primary = date ? new Date(date).getTime() : Number.NaN
  if (Number.isFinite(primary)) return primary

  const fallback = updatedAt ? new Date(updatedAt).getTime() : Number.NaN
  if (Number.isFinite(fallback)) return fallback

  return 0
}
