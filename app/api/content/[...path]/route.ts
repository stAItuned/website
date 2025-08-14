import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/')
    const fullPath = path.join(process.cwd(), 'content', filePath)
    
    console.log(`[Content API] Requested: ${filePath}`)
    console.log(`[Content API] Full path: ${fullPath}`)
    console.log(`[Content API] CWD: ${process.cwd()}`)
    
    // Security check: ensure the path is within the content directory
    const contentDir = path.join(process.cwd(), 'content')
    if (!fullPath.startsWith(contentDir)) {
      console.log(`[Content API] Security violation: ${fullPath} not in ${contentDir}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`[Content API] File not found: ${fullPath}`)
      
      // List directory contents for debugging
      const dirPath = path.dirname(fullPath)
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath)
        console.log(`[Content API] Directory ${dirPath} contains:`, files)
      } else {
        console.log(`[Content API] Directory ${dirPath} does not exist`)
      }
      
      return new NextResponse('Not Found', { status: 404 })
    }
    
    // Get file stats
    const stats = fs.statSync(fullPath)
    if (!stats.isFile()) {
      console.log(`[Content API] Not a file: ${fullPath}`)
      return new NextResponse('Not Found', { status: 404 })
    }
    
    console.log(`[Content API] Serving file: ${fullPath} (${stats.size} bytes)`)
    
    // Read the file
    const fileBuffer = fs.readFileSync(fullPath)
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase()
    const contentTypeMap: { [key: string]: string } = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
    }
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream'
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('[Content API] Error serving content file:', error)
    console.error('[Content API] Request path:', params.path)
    console.error('[Content API] Process CWD:', process.cwd())
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 })
  }
}
