import { Octokit } from "octokit"

const gh = new Octokit({ 
  auth: process.env.WEBSITE_DISPATCH_TOKEN! 
})

const owner = "stAItuned"
const repo = "content-manager"

export async function openPublishPR({ 
  slug, 
  content, 
  title,
  frontmatter 
}: {
  slug: string
  content: string
  title: string
  frontmatter: any
}) {
  try {
    const branch = `publish/${slug}`
    const path = `articles/${slug}.md`
    const base = "main"

    // Create frontmatter + content
    const mdxContent = `---
title: "${frontmatter.title}"
slug: "${frontmatter.slug}"
date: "${frontmatter.date}"
author: "${frontmatter.author}"
tags: [${frontmatter.tags?.map((tag: string) => `"${tag}"`).join(', ') || ''}]
excerpt: "${frontmatter.excerpt || ''}"
---

${content}`

    // Create branch off base
    const { data: { object: { sha: baseSha } } } = 
      await gh.request("GET /repos/{owner}/{repo}/git/refs/heads/{base}", { 
        owner, repo, base 
      })
    
    await gh.request("POST /repos/{owner}/{repo}/git/refs", {
      owner, 
      repo, 
      ref: `refs/heads/${branch}`, 
      sha: baseSha
    })

    // Add file
    await gh.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner, 
      repo, 
      path,
      message: `feat: publish ${title}`,
      content: Buffer.from(mdxContent).toString("base64"),
      branch
    })

    // Open PR
    const pr = await gh.request("POST /repos/{owner}/{repo}/pulls", {
      owner, 
      repo, 
      title: `Publish: ${title}`, 
      head: branch, 
      base,
      body: `Auto-generated PR for publishing: ${title}\n\nSlug: ${slug}`
    })
    
    return pr.data.html_url
  } catch (error) {
    console.error('Error creating PR:', error)
    throw new Error('Failed to create publish PR')
  }
}
