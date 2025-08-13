'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ArticleFormData {
  title: string
  content: string
  excerpt: string
  metaDescription: string
  tags: string[]
  category: string
  coverImage: File | null
  coverImageUrl: string
  attachedImages: Array<{ file: File | null; url: string; id: string }>
  target: 'Newbie' | 'Midway' | 'Expert'
  status: 'draft' | 'published'
  seoScore: number
}

interface SEOConfig {
  titleMinLength: number
  titleMaxLength: number
  metaDescMinLength: number
  metaDescMaxLength: number
  contentMinWords: number
  requiredTags: number
  suggestions: string[]
}

export default function NewArticlePage() {
  const router = useRouter()
  const [article, setArticle] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    metaDescription: '',
    tags: [],
    category: '',
    coverImage: null,
    coverImageUrl: '',
    attachedImages: [],
    target: 'Newbie',
    status: 'draft',
    seoScore: 0
  })
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [generatedSlug, setGeneratedSlug] = useState('')

  // Mock admin configuration - this would come from your backend
  const adminConfig = useMemo((): {
    topics: string[]
    seoConfig: SEOConfig
  } => ({
    topics: [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Data Science',
      'AI Ethics',
      'Research Papers',
      'Tutorials & Guides',
      'Industry News',
      'AI Tools & Frameworks',
      'Neural Networks',
      'Reinforcement Learning',
      'Generative AI',
      'MLOps',
      'AI in Healthcare',
      'AI in Finance',
      'AI in Education'
    ],
    seoConfig: {
      titleMinLength: 30,
      titleMaxLength: 60,
      metaDescMinLength: 120,
      metaDescMaxLength: 160,
      contentMinWords: 300,
      requiredTags: 3,
      suggestions: [
        'Use numbers in your title (e.g., "5 Ways to...")',
        'Include your target keyword in the first paragraph',
        'Add internal and external links',
        'Use proper heading structure (H1, H2, H3)',
        'Include relevant images with alt text',
        'Write for your target audience level',
        'Keep paragraphs short and scannable',
        'Use bullet points and lists for better readability'
      ]
    }
  }), [])

  // Auto-generate slug from title
  useEffect(() => {
    if (article.title) {
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setGeneratedSlug(slug)
    }
  }, [article.title])

  // Calculate SEO score
  useEffect(() => {
    const calculateSEOScore = () => {
      let score = 0
      const { seoConfig } = adminConfig
      
      // Title length check
      if (article.title.length >= seoConfig.titleMinLength && article.title.length <= seoConfig.titleMaxLength) {
        score += 20
      }
      
      // Meta description check
      if (article.metaDescription.length >= seoConfig.metaDescMinLength && article.metaDescription.length <= seoConfig.metaDescMaxLength) {
        score += 20
      }
      
      // Content length check
      const wordCount = article.content.split(/\s+/).filter(word => word.length > 0).length
      if (wordCount >= seoConfig.contentMinWords) {
        score += 20
      }
      
      // Tags check
      if (article.tags.length >= seoConfig.requiredTags) {
        score += 15
      }
      
      // Cover image check
      if (article.coverImage || article.coverImageUrl) {
        score += 10
      }
      
      // Category check
      if (article.category) {
        score += 10
      }
      
      // Excerpt check
      if (article.excerpt.length > 50) {
        score += 5
      }
      
      return score
    }
    
    setArticle(prev => ({ ...prev, seoScore: calculateSEOScore() }))
  }, [article.title, article.metaDescription, article.content, article.tags, article.coverImage, article.coverImageUrl, article.category, article.excerpt, adminConfig])

  const categories = adminConfig.topics

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true)
    try {
      // Here you would save to your backend/Firebase
      const updatedArticle = { 
        ...article, 
        status,
        slug: generatedSlug // Server will generate final slug
      }
      console.log('Saving article:', updatedArticle)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect based on status
      if (status === 'published') {
        router.push('/writer?published=true')
      } else {
        router.push('/writer/drafts?saved=true')
      }
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArticle(prev => ({ 
        ...prev, 
        coverImage: file,
        coverImageUrl: URL.createObjectURL(file)
      }))
    }
  }

  const handleImageAdd = () => {
    if (imageUrl.trim() && !article.attachedImages.some(img => img.url === imageUrl.trim())) {
      const newImage = {
        id: Date.now().toString(),
        url: imageUrl.trim(),
        file: null
      }
      setArticle(prev => ({
        ...prev,
        attachedImages: [...prev.attachedImages, newImage]
      }))
      setImageUrl('')
    }
  }

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newImage = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        file: file
      }
      setArticle(prev => ({
        ...prev,
        attachedImages: [...prev.attachedImages, newImage]
      }))
      // Reset the input
      e.target.value = ''
    }
  }

  const handleImageRemove = (imageToRemove: { file: File | null; url: string; id: string }) => {
    setArticle(prev => ({
      ...prev,
      attachedImages: prev.attachedImages.filter(img => img.id !== imageToRemove.id)
    }))
    // Revoke object URL if it was a file upload
    if (imageToRemove.file) {
      URL.revokeObjectURL(imageToRemove.url)
    }
  }

  const insertImageIntoContent = (image: { file: File | null; url: string; id: string }) => {
    const imageMarkdown = `\n![Image description](${image.url})\n`
    setArticle(prev => ({
      ...prev,
      content: prev.content + imageMarkdown
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTagAdd()
    }
  }

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleViewRenderedArticle = () => {
    // This would open a preview of the article as it would appear on the site
    // For now, we'll just show an alert
    alert('This would open a preview of the rendered article on the website.')
  }

  return (
    <main className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-gray-600 mt-2">Write and publish your next article</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm">
              <span className="text-gray-600">SEO Score: </span>
              <span className={`font-semibold ${getSEOScoreColor(article.seoScore)}`}>
                {article.seoScore}/100
              </span>
            </div>
            <button
              onClick={handleViewRenderedArticle}
              className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
            >
              View Article
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSave('draft')}
              disabled={saving || !article.title}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving || !article.title || !article.content || !article.metaDescription}
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {saving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>Publish</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {!showPreview ? (
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="Enter your article title..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {article.title.length}/{adminConfig.seoConfig.titleMaxLength} characters
                  {article.title.length < adminConfig.seoConfig.titleMinLength && (
                    <span className="text-red-500 ml-2">
                      (Minimum {adminConfig.seoConfig.titleMinLength} characters)
                    </span>
                  )}
                </p>
                {generatedSlug && (
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /learn/{article.target.toLowerCase()}/{generatedSlug}
                  </p>
                )}
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  value={article.metaDescription}
                  onChange={(e) => setArticle(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Write a compelling meta description for search engines..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {article.metaDescription.length}/{adminConfig.seoConfig.metaDescMaxLength} characters
                  {article.metaDescription.length < adminConfig.seoConfig.metaDescMinLength && (
                    <span className="text-red-500 ml-2">
                      (Minimum {adminConfig.seoConfig.metaDescMinLength} characters)
                    </span>
                  )}
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Write a brief summary of your article..."
                />
              </div>

              {/* Category and Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic *
                  </label>
                  <select
                    value={article.category}
                    onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={article.target}
                    onChange={(e) => setArticle(prev => ({ ...prev, target: e.target.value as 'Newbie' | 'Midway' | 'Expert' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Newbie">Newbie</option>
                    <option value="Midway">Midway</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {article.coverImageUrl && (
                    <div className="relative">
                      <Image
                        src={article.coverImageUrl}
                        alt="Cover preview"
                        width={300}
                        height={200}
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => setArticle(prev => ({ ...prev, coverImage: null, coverImageUrl: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-primary-500 hover:text-primary-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={handleTagAdd}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {article.tags.length}/{adminConfig.seoConfig.requiredTags} tags
                  {article.tags.length < adminConfig.seoConfig.requiredTags && (
                    <span className="text-red-500 ml-2">
                      (Minimum {adminConfig.seoConfig.requiredTags} tags required)
                    </span>
                  )}
                </p>
              </div>

              {/* Image Gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Gallery
                </label>
                {article.attachedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {article.attachedImages.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <Image
                          src={image.url}
                          alt={`Attached image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          <button
                            onClick={() => insertImageIntoContent(image)}
                            className="p-1 bg-primary-500 text-white rounded text-xs hover:bg-primary-600"
                            title="Insert into content"
                          >
                            Insert
                          </button>
                          <button
                            onClick={() => handleImageRemove(image)}
                            className="p-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            title="Remove image"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload an image file</p>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Or paste image URL..."
                    />
                    <button
                      onClick={handleImageAdd}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add images to your gallery and insert them into your content
                </p>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <button
                    onClick={() => {
                      const imageMarkdown = '\n![Alt text description](image-url-here)\n'
                      setArticle(prev => ({
                        ...prev,
                        content: prev.content + imageMarkdown
                      }))
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Insert Image</span>
                  </button>
                </div>
                <textarea
                  value={article.content}
                  onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  style={{ fontFamily: "'Courier New', monospace" }}
                  placeholder="Write your article content in Markdown..."
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    You can use Markdown syntax for formatting. For example: **bold**, *italic*, `code`, etc.
                  </p>
                  <p className="text-xs text-gray-600">
                    {getWordCount(article.content)} words
                    {getWordCount(article.content) < adminConfig.seoConfig.contentMinWords && (
                      <span className="text-red-500 ml-2">
                        (Minimum {adminConfig.seoConfig.contentMinWords} words)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* SEO Suggestions */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">SEO Suggestions</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  {adminConfig.seoConfig.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {article.title || 'Untitled Article'}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded">
                      {article.target || 'Midway'}
                    </span>
                    {article.category && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {article.category}
                      </span>
                    )}
                    <span>{getWordCount(article.content)} words</span>
                  </div>

                  {article.excerpt && (
                    <p className="text-lg text-gray-600 border-l-4 border-primary-200 pl-4 italic mb-4">
                      {article.excerpt}
                    </p>
                  )}

                  {article.coverImageUrl && (
                    <div className="mb-6">
                      <Image 
                        src={article.coverImageUrl} 
                        alt="Cover" 
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      code({ children, className, ...rest }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <SyntaxHighlighter
                            PreTag="div"
                            language={match[1]}
                            style={tomorrow}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {article.content || 'Start writing your article content...'}
                  </ReactMarkdown>
                </div>

                {/* Article attachments preview */}
                {article.attachedImages.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {article.attachedImages.map((image, index) => (
                        <Image
                          key={image.id}
                          src={image.url}
                          alt={`Attached image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {article.title || 'Your Article Title'}
                  </h4>
                  <p className="text-green-700 text-sm mt-1">
                    example.com/learn/{article.target.toLowerCase()}/{generatedSlug || 'your-slug'}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    {article.metaDescription || 'Your meta description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Autosave indicator */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Changes are automatically saved as drafts
          </p>
        </div>
      </div>
    </main>
  )
}
