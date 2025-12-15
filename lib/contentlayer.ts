// Re-export from contentlayer generated types
let allPosts: any[] = []
let allTeams: any[] = []

try {
  const { allPosts: generatedAllPosts, allTeams: generatedAllTeams } = await import('../.contentlayer/generated/index.mjs')
  allPosts = generatedAllPosts || []
  allTeams = generatedAllTeams || []
} catch (error) {
  console.warn('[contentlayer] failed to import generated data:', error)
  allPosts = []
  allTeams = []
}

export { allPosts, allTeams }
