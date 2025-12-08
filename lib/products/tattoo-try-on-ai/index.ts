import type { Product } from '@/types/product'

/**
 * Tattoo Try-On AI
 * 
 * AI-powered try-on that quality-checks photos, places tattoos realistically, and shows instant before/after previews
 */
export const tattooTryOnAI: Product = {
  slug: 'tattoo-try-on-ai',
  title: 'Tattoo Try-On AI',
  subtitle: 'See the ink before it\'s permanent',
  tagline: 'See the ink before it\'s permanent',
  description: 'AI-powered try-on that quality-checks photos, places tattoos realistically, and shows instant before/after previews.',
  language: 'en',
  longDescription: `Tattoo Try-On AI is a web app that lets clients upload a body photo, pick a tattoo from a curated gallery (or their own file), and see a realistic placement in seconds. Behind the scenes, images are normalized for size, format, and transparency, then run through Gemini for the actual "inking."

The workflow is built for live consultations: bulk-import flash sheets, group designs by style, swap body photos from a personal library, and keep a visual history of every generated look. A before/after slider keeps clients confident, while cost tracking and temporary storage cleanup keep API spend predictable during trials or events.`,
  
  image: '/assets/products/tattoo-try-on-ai/cover_tattoo.mp4',
  coverImage: '/assets/products/tattoo-try-on-ai/tattoo.mp4',
  images: [
    '/assets/products/tattoo-try-on-ai/tattoo.mp4',
    '/assets/products/tattoo-try-on-ai/cover_tattoo.mp4',
  ],
  videoOrientation: 'portrait',
  
  status: 'beta',
  
  tags: ['AI tattoo try-on', 'Computer vision', 'Virtual preview', 'Image generation', 'Client consultations'],
  category: 'other',
  techStack: ['React 19', 'Vite', 'TypeScript', 'Express', 'Node.js', 'Google Gemini 2.5', 'Sharp', 'IndexedDB'],
  
  problem: `Clients struggle to visualize how a tattoo will look on their own body and hesitate to book. Artists burn time in Photoshop to mock up designs and resize them by hand. Custom designs arrive in odd formats (wrong aspect ratio, no transparency), so previews look fake. Remote consultations are hard—photos are low quality, lighting is bad, and the result feels untrustworthy. Studios can't quickly compare multiple placements or styles with a client in the chair. Unclear previews lead to regret, cancellations, and fewer upsells.`,
  
  problemStatement: `Clients struggle to visualize how a tattoo will look on their own body and hesitate to book. Artists burn time in Photoshop to mock up designs and resize them by hand. Custom designs arrive in odd formats, making previews look fake.`,
  
  solution: `Tattoo Try-On AI transforms the consultation process with AI-powered realistic previews:

- **Automatic Image Normalization:** Uploads are automatically normalized and quality-gated so both body photos and tattoo PNGs start clean
- **AI-Powered Placement:** Gemini applies the tattoo to the body photo with realistic sizing, alignment, and blending—no manual masking
- **Instant Comparison:** A side-by-side compare slider and history strip let clients flip between "before," "after," and past variations instantly
- **Studio Management:** Studios manage a tattoo gallery (including bulk import), edit metadata, and store client body photos locally for quick reuse

The platform uses Google's Gemini 2.5 to create photorealistic tattoo placements that help clients decide with confidence.`,
  
  solutionDescription: `Tattoo Try-On AI uses computer vision and generative AI to create photorealistic tattoo previews in seconds. The platform normalizes images, applies quality gates, and generates instant before/after comparisons that help clients book with confidence.`,
  
  features: [
    {
      title: 'AI Tattoo Placement',
      description: 'Uses Gemini to place tattoos on body photos with realistic lighting, proportion, and skin blending—no manual masking needed',
      icon: '🖌️'
    },
    {
      title: 'Photo Quality Guard',
      description: 'Normalizes images, enforces format/size, and runs quality gates on both body photos and tattoo files to avoid blurry or unusable inputs',
      icon: '🛡️'
    },
    {
      title: 'Personal Body Library',
      description: 'Save and manage client body shots locally (IndexedDB) with quick uploads, deletions, and normalization for repeat sessions',
      icon: '📸'
    },
    {
      title: 'Design Gallery & Bulk Import',
      description: 'Upload single designs or bulk-import flash sets, group by style, edit metadata, and keep everything ready for try-on',
      icon: '🎨'
    },
    {
      title: 'Before/After & History',
      description: 'Instant compare slider plus a thumbnail history strip to revisit previous generations and placements with one tap',
      icon: '↔️'
    },
    {
      title: 'Cost & Storage Controls',
      description: 'Tracks Gemini usage costs, exposes cleanup endpoints for temp files, and keeps assets organized across models/try-ons',
      icon: '📊'
    }
  ],
  
  benefits: [
    {
      metric: '5-8x',
      description: 'Faster mockup creation—30 seconds instead of 5-10 minutes of manual editing'
    },
    {
      metric: '30%',
      description: 'Fewer consultation overruns thanks to quality-gated inputs reducing retakes'
    },
    {
      metric: '20%',
      description: 'Lift in pre-booking conversion when clients see believable previews'
    }
  ],
  
  useCases: [
    {
      title: 'Walk-in client choosing between flash designs',
      description: 'Independent tattoo artists and boutique studios serving clients who want to see designs on their own body',
      before: 'Artist manually resizes and layers PNGs in Photoshop while the client waits',
      after: 'Client uploads a phone photo, taps a design, and sees a realistic preview plus history strip to compare options'
    },
    {
      title: 'Remote consultation with custom design',
      description: 'Studios offering remote or hybrid consultations with clients who send their own designs',
      before: 'Low-quality selfies and mis-sized art lead to back-and-forth emails',
      after: 'App normalizes both images, runs a quality gate, and renders a clean try-on the artist can annotate'
    },
    {
      title: 'Flash day marketing',
      description: 'Artists who sell or test flash sheets and want quick marketing visuals',
      before: 'Designs scattered across drives with no easy way to show them on skin',
      after: 'Bulk import flash sets, generate model previews, and share before/after shots on socials the same day'
    }
  ],
  
  caseStudy: {
    company: 'Ink & Oak Studio',
    companySize: '8 artists',
    industry: 'Body art / tattoo studio',
    problem: 'Clients hesitated on placements and styles; artists spent ~8 minutes per Photoshop mockup',
    solution: 'Bulk-imported flash sets, captured client body photos on an iPad, and generated multiple AI placements during the consult',
    results: [
      'Mockup time dropped from ~8 minutes to under 90 seconds',
      'Same-day booking rate increased by 18%',
      'Revision requests after booking fell by ~40%',
      'Flash day promos were posted with AI previews within an hour',
      'API spend stayed within budget using built-in cost tracking'
    ],
    testimonial: {
      quote: 'Clients stop second-guessing once they see the before/after slider—bookings feel effortless now.',
      author: 'Laura M.',
      role: 'Studio manager'
    }
  },
  
  technicalSpecs: {
    tech: ['React 19', 'Vite', 'TypeScript', 'Express', 'Node.js', 'Google Gemini 2.5', 'Sharp', 'IndexedDB'],
    deployment: 'Web App (browser) + Node.js backend (cloud or self-hosted)',
    apiAvailable: true
  },
  
  faq: [
    {
      question: 'Where are my photos stored?',
      answer: 'Body photos and tattoo files stay in your browser (IndexedDB) unless you explicitly send them for AI processing; processed images can optionally be stored on the backend\'s file storage.'
    },
    {
      question: 'Do you keep my API key or data?',
      answer: 'The Gemini key is kept server-side; the frontend only talks to the backend. Logs track usage and costs but omit image contents.'
    },
    {
      question: 'How is pricing handled?',
      answer: 'Beta is usage-based on your own Gemini key. The built-in cost tracker shows per-call estimates so you can cap spend.'
    },
    {
      question: 'Can I upload my own designs?',
      answer: 'Yes—single uploads and bulk imports are supported. The app normalizes files (size, transparency, format) and runs a quality gate.'
    },
    {
      question: 'Does it work on mobile?',
      answer: 'The web app is responsive; you can shoot a quick photo on your phone, upload it, and preview tattoos on the spot.'
    },
    {
      question: 'How do I integrate it into my existing site or booking flow?',
      answer: 'Use the exposed REST endpoints (apply tattoo, quality gates, storage) or embed the web app and point it to your backend URL.'
    }
  ],
  
  pricing: {
    model: 'custom',
    description: 'Beta is usage-based on your own Gemini API key with built-in cost tracking'
  },
  
  cta: {
    primary: {
      text: 'Request a Demo',
      href: '/aziende#prenota-call'
    },
    secondary: {
      text: 'See Live Demo',
      href: '/demo/tattoo-try-on-ai'
    }
  },
  
  liveUrl: undefined,
  demoUrl: '/demo/tattoo-try-on-ai',
  githubUrl: undefined,
  
  publishedDate: '2025-12-08',
  lastUpdated: '2025-12-08',
  featured: true
}
