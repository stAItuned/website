export const getContentDateTime = (date?: string, updatedAt?: string): number => {
  const primary = date ? new Date(date).getTime() : Number.NaN
  if (Number.isFinite(primary)) return primary

  const fallback = updatedAt ? new Date(updatedAt).getTime() : Number.NaN
  if (Number.isFinite(fallback)) return fallback

  return 0
}
