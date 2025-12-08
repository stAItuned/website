# Product Template Guide

This document provides a comprehensive template and instructions for creating new products in the system.

## File Structure

Create a new file: `lib/products/your-product-name.ts`

## Template with Instructions

```typescript
import type { Product } from '@/types/product'

/**
 * [Product Name]
 * 
 * [One-line tagline/description]
 */
export const yourProductName: Product = {
  // ============================================================================
  // BASIC IDENTIFICATION (Required)
  // ============================================================================
  
  /**
   * slug: Unique URL-friendly identifier
   * - Use kebab-case (lowercase with hyphens)
   * - Must be unique across all products
   * - Used in URLs: /products/[slug]
   * Example: 'doc-assistant', 'editorial-planner'
   */
  slug: 'your-product-slug',
  
  /**
   * title: Official product name
   * - Used in headers, navigation, and meta tags
   * - Keep it concise and memorable
   * Example: 'Document AI Assistant', 'Leave Tracker AI'
   */
  title: 'Your Product Name',
  
  /**
   * description: Short description (1-2 sentences)
   * - Used in product cards and listings
   * - Should be clear and compelling
   * - Max ~160 characters for best results
   * Example: 'Il tuo AI assistant dedicato sui tuoi documenti aziendali.'
   */
  description: 'Brief description of what your product does',
  
  /**
   * status: Current availability status
   * Options:
   * - 'coming-soon': Announced but not available yet
   * - 'beta': Available for testing/early access
   * - 'live': Fully available and production-ready
   */
  status: 'coming-soon',
  
  /**
   * category: Primary product category
   * Options:
   * - 'marketing': Content, campaigns, social media
   * - 'automation': Workflow automation, process optimization
   * - 'analytics': Data analysis, reporting, insights
   * - 'productivity': Task management, collaboration
   * - 'enterprise': Large-scale business solutions
   * - 'hr': Human resources, team management
   * - 'operations': Business operations, logistics
   * - 'other': Doesn't fit other categories
   */
  category: 'productivity',
  
  /**
   * tags: Searchable keywords/categories
   * - Used for filtering and search
   * - 2-5 tags recommended
   * - Common tags: 'GenAI', 'Automazione', 'Produttività', 'Marketing', etc.
   */
  tags: ['GenAI', 'Produttività', 'Enterprise'],
  
  // ============================================================================
  // EXTENDED DESCRIPTIONS (Recommended)
  // ============================================================================
  
  /**
   * subtitle: Short tagline under the title
   * - More conversational than title
   * - Focus on the benefit/outcome
   * Example: 'Parla con i tuoi documenti'
   */
  subtitle: 'Your catchy subtitle',
  
  /**
   * tagline: Alternative to subtitle
   * - Can be the same as subtitle
   * - Used in hero sections
   */
  tagline: 'Your product tagline',
  
  /**
   * shortDescription: Brief summary (optional)
   * - Alternative to description
   * - Can be slightly longer (2-3 sentences)
   */
  shortDescription: 'A bit more detail about your product',
  
  /**
   * longDescription: Detailed overview (1-2 paragraphs)
   * - Used on product detail page
   * - Explain what it does and who it's for
   * - Can use markdown formatting
   */
  longDescription: `A comprehensive description of your product.
    
Explain the key value proposition and what makes it unique.`,
  
  // ============================================================================
  // VISUAL ASSETS (Recommended)
  // ============================================================================
  
  /**
   * image: Main product image
   * - Used in product cards and thumbnails
   * - Path relative to /public
   * - Recommended: 800x600px or 4:3 ratio
   * Example: '/assets/products/your_product.jpeg'
   */
  image: '/assets/products/your_product.jpeg',
  
  /**
   * coverImage: Hero/banner image
   * - Used on product detail page header
   * - Recommended: 1200x630px or 16:9 ratio
   * Example: '/assets/products/your_product_cover.jpeg'
   */
  coverImage: '/assets/products/your_product_cover.jpeg',
  
  /**
   * images: Additional screenshots/images (optional)
   * - Gallery of product screenshots
   * - Show different features or use cases
   */
  images: [
    '/assets/products/your_product_screen1.jpeg',
    '/assets/products/your_product_screen2.jpeg',
  ],
  
  // ============================================================================
  // LINKS & URLS (Optional)
  // ============================================================================
  
  /**
   * liveUrl: Production URL
   * - Where users can access the live product
   * - Full URL: https://...
   */
  liveUrl: undefined,
  
  /**
   * demoUrl/demoLink: Demo or preview URL
   * - Can be internal (/demo/...) or external
   * - For trying the product without signing up
   */
  demoUrl: '/demo/your-product',
  
  /**
   * githubUrl/githubLink: GitHub repository (if open source)
   * - Full URL to GitHub repo
   */
  githubUrl: undefined,
  
  // ============================================================================
  // PROBLEM & SOLUTION (Highly Recommended)
  // ============================================================================
  
  /**
   * problem/problemStatement: What problem does this solve?
   * - Describe the pain points your target users face
   * - Be specific and relatable
   * - Use bullet points or paragraphs
   * - This helps users identify if they need your product
   */
  problem: `Describe the main problem your product solves.
    
Why is this problem important? What are the consequences of not solving it?
    
Use real-world scenarios that your target audience will recognize.`,
  
  /**
   * solution/solutionDescription: How does your product solve it?
   * - Explain your approach
   * - Highlight key capabilities
   * - Show how it addresses each pain point mentioned above
   */
  solution: `Explain how your product solves the problem.
    
What makes your solution unique or better?
    
Include key features or approaches that make it work.`,
  
  // ============================================================================
  // FEATURES (Highly Recommended)
  // ============================================================================
  
  /**
   * features: List of key features
   * - 3-6 features recommended
   * - Each feature has title, description, and optional emoji icon
   * - Focus on benefits, not just capabilities
   */
  features: [
    {
      title: 'Feature Name',
      description: 'What this feature does and why it matters',
      icon: '🚀' // Emoji or icon identifier
    },
    {
      title: 'Another Feature',
      description: 'Benefit-focused description',
      icon: '⚡'
    },
    {
      title: 'Third Feature',
      description: 'How this helps users',
      icon: '🎯'
    },
  ],
  
  // ============================================================================
  // BENEFITS (Optional but recommended for SaaS products)
  // ============================================================================
  
  /**
   * benefits: Quantifiable outcomes
   * - Show impact with metrics
   * - Each benefit has a metric and description
   * - Use real data if available, or reasonable estimates
   */
  benefits: [
    {
      metric: '80%',
      description: 'Reduction in time spent on [task]'
    },
    {
      metric: '3x',
      description: 'Faster [process/workflow]'
    },
    {
      metric: '24/7',
      description: 'Always available, no downtime'
    },
  ],
  
  // ============================================================================
  // USE CASES (Optional but helpful)
  // ============================================================================
  
  /**
   * useCases: Specific scenarios where product excels
   * - Show before/after transformation
   * - Help users see themselves using it
   * - 2-4 use cases recommended
   */
  useCases: [
    {
      title: 'Use Case Title (e.g., "Team of 10-50")',
      description: 'Context about this use case',
      before: 'What life was like before using your product',
      after: 'How things improved after using your product'
    },
  ],
  
  // ============================================================================
  // CASE STUDY (Optional but powerful for credibility)
  // ============================================================================
  
  /**
   * caseStudy: Real-world success story
   * - Provides social proof
   * - Shows concrete results
   * - Include company context and specific outcomes
   */
  caseStudy: {
    company: 'Company name (can be generic: "Startup nel settore X")',
    companySize: '10-25 dipendenti',
    industry: 'Industry/Sector',
    problem: 'Specific problem this company faced',
    solution: 'How they used your product to solve it',
    results: [
      'Specific metric or outcome 1',
      'Specific metric or outcome 2',
      'Specific metric or outcome 3',
    ],
    // Optional testimonial within case study
    testimonial: {
      quote: 'Direct quote from customer',
      author: 'Customer name',
      role: 'Their role/title'
    }
  },
  
  // ============================================================================
  // TECHNICAL DETAILS (Recommended for technical audience)
  // ============================================================================
  
  /**
   * techStack: Technologies used
   * - Array of technology names
   * - Helps technical users understand the product
   * - Shows your expertise
   */
  techStack: ['Next.js', 'TypeScript', 'OpenAI', 'PostgreSQL'],
  
  /**
   * technicalSpecs: Detailed technical information
   */
  technicalSpecs: {
    tech: ['Technology 1', 'Technology 2', 'Technology 3'],
    deployment: 'Cloud (AWS/Azure) or On-Premise or Web App',
    apiAvailable: true // Whether product has an API
  },
  
  // ============================================================================
  // FAQ (Highly Recommended)
  // ============================================================================
  
  /**
   * faq/faqs: Frequently asked questions
   * - Address common concerns and objections
   * - Provide detailed answers
   * - 3-6 questions recommended
   */
  faq: [
    {
      question: 'Common question users might have?',
      answer: 'Clear, detailed answer that addresses the concern.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Explain your security and privacy measures.'
    },
    {
      question: 'How much does it cost?',
      answer: 'Pricing information or "Contact us for custom pricing".'
    },
  ],
  
  // ============================================================================
  // TESTIMONIAL (Optional)
  // ============================================================================
  
  /**
   * testimonial: Customer quote (separate from case study)
   * - Standalone testimonial for social proof
   * - Can be displayed prominently
   */
  testimonial: {
    quote: 'This product transformed how we work...',
    author: 'Customer Name',
    role: 'CEO',
    company: 'Company Name'
  },
  
  // ============================================================================
  // CALL TO ACTION (Optional but recommended)
  // ============================================================================
  
  /**
   * cta: Main call-to-action buttons
   * - Primary: Main action (e.g., "Get Started", "Try Demo")
   * - Secondary: Alternative action (e.g., "Learn More", "Contact Sales")
   */
  cta: {
    primary: {
      text: 'Get Started',
      href: '/contact' // or external URL
    },
    secondary: {
      text: 'View Demo',
      href: '/demo/your-product'
    }
  },
  
  // ============================================================================
  // PRICING (Optional)
  // ============================================================================
  
  /**
   * pricing: Pricing information
   * - Model: free, freemium, subscription, custom, contact
   * - Tiers: Different pricing tiers with features
   */
  pricing: {
    model: 'custom',
    description: 'Flexible pricing based on your needs',
    tiers: [
      {
        name: 'Starter',
        price: '€99/month',
        description: 'For small teams',
        features: [
          'Feature 1',
          'Feature 2',
          'Up to 10 users',
        ],
        highlighted: false
      },
      {
        name: 'Professional',
        price: '€299/month',
        description: 'For growing businesses',
        features: [
          'Everything in Starter',
          'Advanced feature 1',
          'Advanced feature 2',
          'Up to 50 users',
        ],
        highlighted: true // Highlight recommended tier
      },
    ]
  },
  
  // ============================================================================
  // METADATA (Optional but good for SEO)
  // ============================================================================
  
  /**
   * metadata: SEO and social sharing metadata
   */
  metadata: {
    title: 'Your Product Name - Brief Description',
    description: 'SEO-optimized description for search engines',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    ogImage: '/assets/products/your_product_social.jpeg' // 1200x630px
  },
  
  /**
   * metaDescription: Alternative to metadata.description
   */
  metaDescription: 'SEO description for search results',
  
  /**
   * keywords: Search keywords array
   */
  keywords: ['AI', 'automation', 'productivity'],
  
  // ============================================================================
  // ADVANCED/OPTIONAL FIELDS
  // ============================================================================
  
  /**
   * relatedProducts: Slugs of related products
   * - Show users similar or complementary products
   */
  relatedProducts: ['other-product-slug', 'another-product-slug'],
  
  /**
   * featured: Show this product prominently
   * - Featured products appear first in listings
   */
  featured: true,
  
  /**
   * publishedDate: When the product was launched
   */
  publishedDate: '2024-12-06',
  
  /**
   * lastUpdated: Last time product info was updated
   */
  lastUpdated: '2024-12-06',
}
```

## Quick Start Checklist

When creating a new product, at minimum include:

### Required Fields ✅
- [ ] `slug` - Unique identifier
- [ ] `title` - Product name
- [ ] `description` - Short description
- [ ] `status` - coming-soon, beta, or live
- [ ] `category` - Primary category
- [ ] `tags` - At least 2-3 tags

### Highly Recommended ⭐
- [ ] `subtitle` or `tagline` - Catchy tagline
- [ ] `longDescription` - Detailed overview
- [ ] `image` - Product image
- [ ] `problem` - What problem does it solve?
- [ ] `solution` - How does it solve it?
- [ ] `features` - 3-6 key features
- [ ] `faq` - 3-5 common questions

### Nice to Have 💫
- [ ] `coverImage` - Hero image
- [ ] `benefits` - Quantifiable outcomes
- [ ] `caseStudy` - Real success story
- [ ] `techStack` - Technologies used
- [ ] `cta` - Call-to-action buttons
- [ ] `pricing` - Pricing information

## Integration Steps

After creating your product file:

1. **Import in `index.ts`:**
   ```typescript
   import { yourProductName } from './your-product-name'
   ```

2. **Add to products array:**
   ```typescript
   export const allProducts: Product[] = [
     // ... existing products
     yourProductName,
   ]
   ```

3. **Add product image to `/public/assets/products/`**

4. **Test the product page:**
   - Visit: `http://localhost:3000/products/your-product-slug`

## Tips for Great Product Pages

### Writing Tips 📝
- **Be specific**: Don't say "saves time" - say "reduces task completion from 2 hours to 15 minutes"
- **Focus on benefits**: Not what it does, but what users achieve
- **Use real examples**: Concrete scenarios help users understand value
- **Address objections**: Use FAQ to handle common concerns proactively

### Visual Tips 🎨
- **High-quality images**: Clear screenshots showing the product in action
- **Consistent style**: Use same color scheme and image format across products
- **Show, don't tell**: Screenshots are worth 1000 words

### SEO Tips 🔍
- **Unique descriptions**: Don't reuse text across products
- **Include keywords**: Naturally incorporate terms users would search for
- **Complete metadata**: Fill in all metadata fields for better discoverability

## Examples to Reference

Check these existing products for inspiration:

- **Full featured**: `leave-tracker.ts` - Has all sections with detailed content
- **Minimal but effective**: `fund-comparison.ts` - Beta product with essentials
- **Coming soon**: `doc-assistant.ts` - Announced product with full details
- **Marketing focused**: `editorial-planner.ts` - Strong use cases and benefits

## Need Help?

If you're unsure about any field:
1. Look at existing product files for examples
2. Check the `types/product.ts` file for type definitions
3. Consult team documentation or ask for review

Remember: It's better to start with the required fields and add more detail over time than to be blocked by trying to perfect everything upfront!
