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
  
  // Files/directories to temporarily move (only auth-related routes)
  const filesToMove = [
    'app/api',
    'app/(writer)',
    'app/(public)/learn/[target]',
    'app/(public)/author/[slug]'
    // Note: We temporarily move [target] page to avoid client component issues, but keep [target]/[slug] for articles
  ]
  
  filesToMove.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath)
    const backupPath = path.join(backupDir, filePath)
    
    if (fs.existsSync(fullPath)) {
      console.log(`Moving ${filePath} to backup...`)
      
      // Special handling for learn/[target] - only move the page.tsx, not the [slug] directory
      if (filePath === 'app/(public)/learn/[target]') {
        const targetPagePath = path.join(fullPath, 'page.tsx')
        if (fs.existsSync(targetPagePath)) {
          // Ensure backup directory exists
          const backupDirPath = path.dirname(backupPath)
          if (!fs.existsSync(backupDirPath)) {
            fs.mkdirSync(backupDirPath, { recursive: true })
          }
          if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true })
          }
          
          // Move only the page.tsx file
          const backupPagePath = path.join(backupPath, 'page.tsx')
          fs.renameSync(targetPagePath, backupPagePath)
        }
      } else {
        // Normal move for other files
        // Ensure backup directory exists
        const backupDirPath = path.dirname(backupPath)
        if (!fs.existsSync(backupDirPath)) {
          fs.mkdirSync(backupDirPath, { recursive: true })
        }
        
        // Move the file/directory
        fs.renameSync(fullPath, backupPath)
      }
    }
  })

  // Create static route directories for learn targets
  const learnTargets = ['newbie', 'midway', 'expert']
  learnTargets.forEach(target => {
    const targetDir = path.join(__dirname, '..', 'app/(public)/learn', target)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    
    const pageContent = `import { redirect } from 'next/navigation'

export default function ${target.charAt(0).toUpperCase() + target.slice(1)}Page() {
  redirect('/learn?target=${target}')
}`
    
    fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageContent)
    console.log(`Created static route for /learn/${target}`)
  })
  
  console.log('Firebase build preparation complete.')
} else {
  console.log('Not a Firebase build, skipping preparation.')
}
