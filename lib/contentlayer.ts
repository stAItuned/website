// Re-export from contentlayer generated types
let allPosts: any[] = []

try {
  const contentlayer = require('../.contentlayer/generated')
  allPosts = contentlayer.allPosts || []
} catch {
  // Fallback for development when contentlayer hasn't run yet
  allPosts = []
}

export { allPosts }
