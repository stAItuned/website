#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const isFirebaseBuild = process.env.FIREBASE_DEPLOYMENT === 'true'

if (isFirebaseBuild) {
  console.log('Restoring files after Firebase build...')
  
  const backupDir = path.join(__dirname, '..', '.firebase-build-backup')
  
  if (fs.existsSync(backupDir)) {
    // Files/directories to restore
    const filesToRestore = [
      'app/api',
      'app/(writer)',
      'app/(public)/learn/[target]',
      'app/(public)/author/[slug]'
      // Note: We restore [target] page after build
    ]
    
    filesToRestore.forEach(filePath => {
      const fullPath = path.join(__dirname, '..', filePath)
      const backupPath = path.join(backupDir, filePath)
      
      if (fs.existsSync(backupPath)) {
        console.log(`Restoring ${filePath} from backup...`)
        
        // Special handling for learn/[target] - only restore the page.tsx
        if (filePath === 'app/(public)/learn/[target]') {
          const backupPagePath = path.join(backupPath, 'page.tsx')
          const targetPagePath = path.join(fullPath, 'page.tsx')
          
          if (fs.existsSync(backupPagePath)) {
            // Ensure target directory exists
            if (!fs.existsSync(fullPath)) {
              fs.mkdirSync(fullPath, { recursive: true })
            }
            
            // Restore the page.tsx file
            fs.renameSync(backupPagePath, targetPagePath)
          }
        } else {
          // Normal restore for other files
          // Ensure target directory exists
          const targetDirPath = path.dirname(fullPath)
          if (!fs.existsSync(targetDirPath)) {
            fs.mkdirSync(targetDirPath, { recursive: true })
          }
          
          // Restore the file/directory
          if (fs.statSync(backupPath).isDirectory()) {
            if (fs.existsSync(fullPath)) {
              fs.rmSync(fullPath, { recursive: true, force: true })
            }
            fs.renameSync(backupPath, fullPath)
          } else {
            fs.copyFileSync(backupPath, fullPath)
            fs.unlinkSync(backupPath)
          }
        }
      }
    })

    // Clean up static route directories we created
    const learnTargets = ['newbie', 'midway', 'expert']
    learnTargets.forEach(target => {
      const targetDir = path.join(__dirname, '..', 'app/(public)/learn', target)
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true })
        console.log(`Cleaned up static route for /learn/${target}`)
      }
    })
    
    // Remove backup directory
    fs.rmSync(backupDir, { recursive: true, force: true })
    console.log('Firebase build cleanup complete.')
  }
} else {
  console.log('Not a Firebase build, skipping cleanup.')
}
