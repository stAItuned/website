// Re-export from contentlayer generated types
let allPosts: any[] = []

try {
  const { allPosts: generatedAllPosts } = await import('../.contentlayer/generated/index.mjs')
  allPosts = generatedAllPosts || []
} catch (error) {
  console.warn('[contentlayer] failed to import generated data:', error)
  allPosts = []
}

export { allPosts }
