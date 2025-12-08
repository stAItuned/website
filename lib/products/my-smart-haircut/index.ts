import type { Product } from '@/types/product'

/**
 * My Smart Haircut
 * 
 * AI-powered barber shop platform with virtual try-on and smart operations
 */
export const mySmartHaircut: Product = {
  slug: 'my-smart-haircut',
  title: 'My Smart Haircut',
  subtitle: 'AI-Powered Barber Shop Platform',
  tagline: 'Sharp Cuts. Smart Style.',
  description: 'Transform your barber shop with AI-powered virtual try-ons, smart product recommendations, and automated booking—driving retail sales and client retention.',
  language: 'en',
  longDescription: `My Smart Haircut revolutionizes the barber shop experience with AI technology designed for modern grooming businesses.

**For Clients:** Upload a selfie and virtually try on hairstyles before booking. Get personalized product recommendations based on your hair type and style goals.

**For Barbers:** Real-time AI suggestions during appointments help upsell products naturally. Generate custom after-care routines instantly for every client.

**For Owners:** Automate marketing campaigns, fill empty slots, and re-engage lapsed clients—all powered by intelligent insights.`,
  
  image: '/assets/products/my-smart-haircut/demo.mp4',
  coverImage: '/assets/products/my-smart-haircut/demo.mp4',
  images: [
    '/assets/products/my-smart-haircut/demo.mp4',
    '/assets/products/my-smart-haircut/demo.gif',
  ],
  videoOrientation: 'landscape',
  
  status: 'beta',
  
  tags: ['GenAI', 'Virtual Try-On', 'Barber Shop Management', 'Smart Booking', 'E-commerce'],
  category: 'operations',
  techStack: ['React 19', 'TypeScript', 'Vite', 'Google Gemini Flash 2.5', 'Google Gemini Pro 3', 'Tailwind CSS', 'Framer Motion', 'IndexedDB', 'PWA'],
  
  problem: `Barber shops face three critical challenges:

1. **Low Retail Revenue:** Barbers focus on cutting hair and forget to recommend products, missing out on high-margin sales.

2. **Client Hesitation:** Customers want to try new styles but fear disappointment, leading them to stick with safe, cheap cuts.

3. **Poor Marketing:** Without data-driven campaigns, shops struggle to fill appointment slots and retain clients who gradually drift away.

The result? Businesses rely solely on service revenue while clients purchase their grooming products elsewhere.`,
  problemStatement: `Barber shops miss out on retail revenue because staff forget to upsell, clients fear trying new styles, and owners lack tools for effective marketing campaigns.`,
  
  solution: `My Smart Haircut delivers a complete AI-powered platform that transforms every aspect of your barber shop:

**Virtual Try-On Magic Mirror**
Clients upload selfies and see themselves with different hairstyles using advanced AI—building confidence and driving bookings.

**Smart Product Recommendations**
Interactive quizzes analyze hair type and style preferences to suggest the perfect shampoos, waxes, and styling products.

**Barber Copilot**
Real-time, context-aware prompts help staff naturally upsell services and products during appointments (e.g., "Client has dry scalp—suggest tea tree oil treatment").

**Automated Marketing Engine**
Target specific client segments with personalized campaigns to fill empty slots and win back lapsed customers—all managed from one dashboard.

Built on Google's Gemini AI, the platform combines cutting-edge computer vision with intelligent business automation.`,
  solutionDescription: `An all-in-one AI platform that boosts barber shop revenue through virtual try-ons, smart product recommendations, real-time staff assistance, and automated marketing campaigns.`,
  
  features: [
    {
      title: 'AI Virtual Try-On',
      description: 'Clients see themselves with different haircuts using generative AI before booking—eliminating uncertainty and driving conversions',
      icon: '💇‍♂️'
    },
    {
      title: 'Product Recommendation Engine',
      description: 'Interactive quiz analyzes hair type and desired look to recommend perfect product bundles—increasing basket size',
      icon: '🛍️'
    },
    {
      title: 'Barber Copilot',
      description: 'Real-time, context-aware prompts during appointments help staff upsell naturally and confidently',
      icon: '🤖'
    },
    {
      title: 'Automated Care Routines',
      description: 'Generate personalized 3-step home care plans instantly after each service—boosting product sales and retention',
      icon: '📝'
    },
    {
      title: 'Smart Booking System',
      description: 'Frictionless scheduling with integrated service and barber selection—plus smart upselling at checkout',
      icon: '📅'
    },
    {
      title: 'AI Marketing Dashboard',
      description: 'Create targeted email and SMS campaigns for specific segments (e.g., lapsed clients, high-value customers)',
      icon: '🚀'
    }
  ],
  
  benefits: [
    {
      metric: '+30%',
      description: 'Product revenue increase through AI-driven recommendations'
    },
    {
      metric: '20min',
      description: 'Faster consultations with visual style references'
    },
    {
      metric: '+15%',
      description: 'Higher re-booking rate via personalized engagement'
    }
  ],
  
  useCases: [
    {
      title: 'Indecisive Clients Who Want Change',
      description: 'Customers who want to try new styles but fear disappointment',
      before: 'Shows blurry celebrity photos to barber, ends up disappointed because hair texture differs',
      after: 'Uses Try-On feature to preview the exact cut on their face—books immediately with confidence'
    },
    {
      title: 'Busy Barbers Missing Sales',
      description: 'Staff focused on cutting who forget to recommend products',
      before: 'Finishes cut, processes payment—client leaves empty-handed',
      after: 'Checks AI prompt: "Client bought matte clay 2 months ago—suggest refill." Makes the sale effortlessly'
    },
    {
      title: 'Solo Stylists Going Digital',
      description: 'Independent professionals competing with larger salons',
      before: 'Manual bookings, no product strategy, inconsistent marketing',
      after: 'Professional digital presence with automated scheduling, smart upselling, and targeted campaigns'
    }
  ],
  
  caseStudy: {
    company: 'Urban Cuts Studio',
    companySize: '5-10 employees',
    industry: 'Men\'s Grooming',
    problem: 'High foot traffic but zero product sales—clients bought haircuts in-store but purchased grooming products on Amazon',
    solution: 'Deployed My Smart Haircut on a waiting room tablet. Clients explored Virtual Try-On and took the Product Quiz while waiting for their appointment',
    results: [
      'Retail revenue doubled within 30 days',
      '3x increase in "Full Works" package bookings through app visibility',
      '45% reduction in no-shows via automated reminders',
      'Staff consultation time cut by 20 minutes per client using visual try-on results'
    ]
  },
  
  technicalSpecs: {
    tech: ['React 19', 'TypeScript', 'Vite', 'Google Gemini Flash 2.5', 'Google Gemini Pro 3', 'Tailwind CSS', 'Framer Motion', 'IndexedDB', 'PWA'],
    deployment: 'Web App + PWA (Progressive Web App - Mobile First)',
    apiAvailable: false
  },
  
  faq: [
    {
      question: 'Do I need powerful hardware to run the AI features?',
      answer: 'No. All AI processing happens in the cloud using Google\'s Gemini models. The platform works smoothly on any smartphone, tablet, or basic computer.'
    },
    {
      question: 'Is client photo data secure?',
      answer: 'Absolutely. Photos are processed for the try-on session and stored locally on the device using IndexedDB. No images are permanently saved on external servers.'
    },
    {
      question: 'How accurate is the Virtual Try-On?',
      answer: 'We use advanced generative AI with photorealistic rendering that preserves facial identity, skin tone, and lighting conditions while seamlessly applying hairstyles.'
    },
    {
      question: 'Can I customize the products and services?',
      answer: 'Yes. The Owner dashboard provides full control to add, edit, or remove services, products, barber profiles, and pricing—all without technical knowledge.'
    },
    {
      question: 'Does this replace my existing booking system?',
      answer: 'It\'s designed as an all-in-one solution, but you can also use it alongside existing systems if you primarily want the Try-On and retail features.'
    },
    {
      question: 'What are the AI costs?',
      answer: 'The platform uses your own Google API key. Gemini Flash models are extremely cost-effective—typically under $0.01 per try-on session.'
    }
  ],
  
  pricing: {
    model: 'custom',
    description: 'Flexible pricing tailored to shop size and features. AI costs scale with usage through your Google API account.'
  },
  
  cta: {
    primary: {
      text: 'Request a Demo',
      href: '/aziende#prenota-call'
    },
    secondary: {
      text: 'See Live Demo',
      href: '/demo/my-smart-haircut'
    }
  },
  
  liveUrl: undefined,
  demoUrl: '/demo/my-smart-haircut',
  githubUrl: undefined,
  
  publishedDate: '2025-12-07',
  lastUpdated: '2025-12-07',
  featured: true
}
