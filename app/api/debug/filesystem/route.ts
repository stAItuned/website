import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), 'content')
    const publicPath = path.join(process.cwd(), 'public')
    
    // Check if directories exist
    const contentExists = fs.existsSync(contentPath)
    const publicExists = fs.existsSync(publicPath)
    
    // Get some directory listings
    let contentListing: string[] = []
    let publicListing: string[] = []
    
    if (contentExists) {
      try {
        contentListing = fs.readdirSync(contentPath).slice(0, 10) // First 10 items
      } catch (error) {
        contentListing = [`Error reading: ${error}`]
      }
    }
    
    if (publicExists) {
      try {
        publicListing = fs.readdirSync(publicPath).slice(0, 10) // First 10 items
      } catch (error) {
        publicListing = [`Error reading: ${error}`]
      }
    }

    // Test specific image paths
    const testPaths = [
      path.join(process.cwd(), 'content', 'articles', 'ai-for-breast-cancer-diagnosis', 'cover.webp'),
      path.join(process.cwd(), 'public', 'assets', 'general', 'logo-text.png'),
      path.join(process.cwd(), 'public', 'assets', 'general', 'home_bg.webp'),
    ]

    const pathTests = testPaths.map(testPath => ({
      path: testPath.replace(process.cwd(), ''),
      exists: fs.existsSync(testPath),
      isFile: fs.existsSync(testPath) ? fs.statSync(testPath).isFile() : false
    }))

    return NextResponse.json({
      directories: {
        content: {
          exists: contentExists,
          path: contentPath.replace(process.cwd(), ''),
          listing: contentListing
        },
        public: {
          exists: publicExists,
          path: publicPath.replace(process.cwd(), ''),
          listing: publicListing
        }
      },
      testPaths: pathTests,
      cwd: process.cwd(),
      environment: process.env.NODE_ENV,
      platform: process.platform
    })
  } catch (error) {
    return NextResponse.json({
      error: `Failed to check file system: ${error}`,
      cwd: process.cwd(),
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}
