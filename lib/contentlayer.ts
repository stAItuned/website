// Re-export from contentlayer generated types
let allPosts: any[] = []
let allTeams: any[] = []
let allTopics: any[] = []

try {
  const { allPosts: generatedAllPosts, allTeams: generatedAllTeams, allTopics: generatedAllTopics } = await import('../.contentlayer/generated/index.mjs')

  allPosts = generatedAllPosts || []
  allTeams = generatedAllTeams || []
  allTopics = generatedAllTopics || []
} catch (error) {
  console.warn('[contentlayer] failed to import generated data:', error)
  allPosts = []
  allTeams = []
  allTopics = []
}

export { allPosts, allTeams, allTopics }
