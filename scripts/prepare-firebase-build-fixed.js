#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const isFirebaseBuild = process.env.FIREBASE_DEPLOYMENT === 'true'

if (isFirebaseBuild) {
  console.log('Preparing for Firebase static export...')
  
  // Create backup directory
  const backupDir = path.join(__dirname, '..', '.firebase-build-backup')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  // Files/directories to temporarily move (only auth-related, keep public dynamic routes)
  const filesToMove = [
    'app/api',
    'app/(writer)'
  ]
  
  filesToMove.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath)
    const backupPath = path.join(backupDir, filePath)
    
    if (fs.existsSync(fullPath)) {
      console.log(`Moving ${filePath} to backup...`)
      
      // Ensure backup directory exists
      const backupDirPath = path.dirname(backupPath)
      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true })
      }
      
      // Move the file/directory
      fs.renameSync(fullPath, backupPath)
    }
  })

  // Add generateStaticParams to dynamic routes that need it
  const dynamicRoutes = [
    {
      path: 'app/(public)/learn/[target]/page.tsx',
      params: [
        { target: 'newbie' },
        { target: 'midway' },
        { target: 'expert' }
      ]
    }
  ]

  dynamicRoutes.forEach(route => {
    const routePath = path.join(__dirname, '..', route.path)
    const backupRoutePath = path.join(backupDir, route.path)
    
    if (fs.existsSync(routePath)) {
      console.log(`Adding generateStaticParams to ${route.path}...`)
      
      // Backup original file
      const backupRouteDir = path.dirname(backupRoutePath)
      if (!fs.existsSync(backupRouteDir)) {
        fs.mkdirSync(backupRouteDir, { recursive: true })
      }
      fs.copyFileSync(routePath, backupRoutePath)
      
      // Read and modify the file
      let content = fs.readFileSync(routePath, 'utf8')
      
      // Add generateStaticParams function before the component
      const generateStaticParamsCode = `
export async function generateStaticParams() {
  return ${JSON.stringify(route.params, null, 2)}
}

`
      
      // Insert after imports but before component
      const importEndRegex = /import.*?from.*?[\r\n]+/g
      const matches = content.match(importEndRegex)
      if (matches) {
        const lastImportIndex = content.lastIndexOf(matches[matches.length - 1]) + matches[matches.length - 1].length
        content = content.slice(0, lastImportIndex) + generateStaticParamsCode + content.slice(lastImportIndex)
      }
      
      fs.writeFileSync(routePath, content)
    }
  })

  // Generate static params for posts/[slug] by reading the content
  const postsPagePath = path.join(__dirname, '..', 'app/(public)/posts/[slug]/page.tsx')
  if (fs.existsSync(postsPagePath)) {
    console.log('Adding generateStaticParams to posts/[slug]/page.tsx...')
    
    // Backup original file
    const backupPostsPath = path.join(backupDir, 'app/(public)/posts/[slug]/page.tsx')
    const backupPostsDir = path.dirname(backupPostsPath)
    if (!fs.existsSync(backupPostsDir)) {
      fs.mkdirSync(backupPostsDir, { recursive: true })
    }
    fs.copyFileSync(postsPagePath, backupPostsPath)
    
    // Read current content
    let content = fs.readFileSync(postsPagePath, 'utf8')
    
    // Add generateStaticParams function
    const generateStaticParamsCode = `
export async function generateStaticParams() {
  const { allPosts } = await import('@/lib/contentlayer')
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

`
    
    // Insert after imports
    const importEndRegex = /import.*?from.*?[\r\n]+/g
    const matches = content.match(importEndRegex)
    if (matches) {
      const lastImportIndex = content.lastIndexOf(matches[matches.length - 1]) + matches[matches.length - 1].length
      content = content.slice(0, lastImportIndex) + generateStaticParamsCode + content.slice(lastImportIndex)
    }
    
    fs.writeFileSync(postsPagePath, content)
  }

  // Also add generateStaticParams to author/[slug] if it exists
  const authorPagePath = path.join(__dirname, '..', 'app/(public)/author/[slug]/page.tsx')
  if (fs.existsSync(authorPagePath)) {
    console.log('Adding generateStaticParams to author/[slug]/page.tsx...')
    
    // Backup original file
    const backupAuthorPath = path.join(backupDir, 'app/(public)/author/[slug]/page.tsx')
    const backupAuthorDir = path.dirname(backupAuthorPath)
    if (!fs.existsSync(backupAuthorDir)) {
      fs.mkdirSync(backupAuthorDir, { recursive: true })
    }
    fs.copyFileSync(authorPagePath, backupAuthorPath)
    
    // Read current content
    let content = fs.readFileSync(authorPagePath, 'utf8')
    
    // Add generateStaticParams function
    const generateStaticParamsCode = `
export async function generateStaticParams() {
  const fs = await import('fs')
  const path = await import('path')
  
  // Get all author directories
  const teamDir = path.join(process.cwd(), 'content/team')
  if (!fs.existsSync(teamDir)) return []
  
  const authorDirs = fs.readdirSync(teamDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  return authorDirs.map(slug => ({ slug }))
}

`
    
    // Insert after imports
    const importEndRegex = /import.*?from.*?[\r\n]+/g
    const matches = content.match(importEndRegex)
    if (matches) {
      const lastImportIndex = content.lastIndexOf(matches[matches.length - 1]) + matches[matches.length - 1].length
      content = content.slice(0, lastImportIndex) + generateStaticParamsCode + content.slice(lastImportIndex)
    }
    
    fs.writeFileSync(authorPagePath, content)
  }
  
  console.log('Firebase build preparation complete.')
} else {
  console.log('Not a Firebase build, skipping preparation.')
}
