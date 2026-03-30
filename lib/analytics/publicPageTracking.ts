import { allPosts, allTopics } from '@/lib/contentlayer'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import { sanitizeSlug } from '@/lib/sanitizeSlug'

export type TrackedPublicPageType =
  | 'article'
  | 'landing'
  | 'hub'
  | 'topic'
  | 'product'
  | 'legal'
  | 'tool'
  | 'author'

export interface TrackedPublicPageDescriptor {
  key: string
  docId: string
  path: string
  title: string
  pageType: TrackedPublicPageType
  author: string | null
  language: string | null
  target: string | null
  articleSlug: string | null
}

interface StaticPageDescriptorInput {
  path: string
  title: string
  pageType: Exclude<TrackedPublicPageType, 'article' | 'topic' | 'product' | 'author'>
  language?: string | null
}

export const PUBLIC_PAGE_VIEWS_COLLECTION = 'page_views_first_party'

const EXCLUDED_PREFIXES = ['/admin', '/api', '/debug', '/preview', '/test-firebase', '/article-creator']
const EXCLUDED_EXACT_PATHS = new Set(['/403'])

const LEARN_TARGET_TITLES: Record<string, string> = {
  newbie: 'Learn Newbie',
  midway: 'Learn Midway',
  expert: 'Learn Expert',
}

const STATIC_PAGES: StaticPageDescriptorInput[] = [
  { path: '/', title: 'Home', pageType: 'landing' },
  { path: '/ai-eu-act', title: 'AI EU Act', pageType: 'landing' },
  { path: '/ai-eu-act/risorse', title: 'AI EU Act Resources', pageType: 'tool' },
  { path: '/author', title: 'All Authors', pageType: 'hub' },
  { path: '/become-writer', title: 'Become Writer', pageType: 'landing' },
  { path: '/business', title: 'Business', pageType: 'landing' },
  { path: '/career-os', title: 'Career OS', pageType: 'landing' },
  { path: '/contribute', title: 'Contribute', pageType: 'landing' },
  { path: '/contribute/wizard', title: 'Contributor Wizard', pageType: 'tool' },
  { path: '/contributor', title: 'Contributor Program', pageType: 'landing' },
  { path: '/cookie-policy', title: 'Cookie Policy', pageType: 'legal' },
  { path: '/demo', title: 'Lab Projects', pageType: 'hub' },
  { path: '/learn', title: 'Learn', pageType: 'hub' },
  { path: '/learn/articles', title: 'Learn Articles', pageType: 'hub' },
  { path: '/meet', title: 'Chi Siamo', pageType: 'landing' },
  { path: '/privacy', title: 'Privacy Policy', pageType: 'legal' },
  { path: '/prodotti', title: 'Lab Projects', pageType: 'hub' },
  { path: '/role-fit-audit', title: 'Role Fit Audit', pageType: 'tool' },
  { path: '/signin', title: 'Sign In', pageType: 'tool' },
  { path: '/terms', title: 'Termini e Condizioni', pageType: 'legal' },
  { path: '/topics', title: 'Topics Hub', pageType: 'hub' },
]

function normalizePathname(pathname: string): string {
  if (!pathname) return '/'

  const withoutHash = pathname.split('#')[0] || ''
  const withoutQuery = withoutHash.split('?')[0] || ''
  const trimmed = withoutQuery.trim()

  if (!trimmed) return '/'
  if (trimmed === '/') return '/'

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '') || '/'
}

function pathToDocId(path: string): string {
  if (path === '/') return 'root'
  return path.slice(1).replaceAll('/', '__')
}

function titleizeSegment(value: string): string {
  return value
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function makeDescriptor(input: Omit<TrackedPublicPageDescriptor, 'key' | 'docId'>): TrackedPublicPageDescriptor {
  return {
    ...input,
    key: input.path,
    docId: pathToDocId(input.path),
  }
}

function buildStaticDescriptor(input: StaticPageDescriptorInput): TrackedPublicPageDescriptor {
  return makeDescriptor({
    path: normalizePathname(input.path),
    title: input.title,
    pageType: input.pageType,
    author: null,
    language: input.language ?? null,
    target: null,
    articleSlug: null,
  })
}

function isExcludedPath(path: string): boolean {
  return EXCLUDED_EXACT_PATHS.has(path) || EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

const STATIC_PAGE_MAP = new Map(
  STATIC_PAGES.map((page) => {
    const descriptor = buildStaticDescriptor(page)
    return [descriptor.path, descriptor] as const
  }),
)

const LEARN_TARGET_MAP = new Map(
  Object.entries(LEARN_TARGET_TITLES).map(([target, title]) => {
    const descriptor = makeDescriptor({
      path: `/learn/${target}`,
      title,
      pageType: 'hub',
      author: null,
      language: null,
      target,
      articleSlug: null,
    })

    return [descriptor.path, descriptor] as const
  }),
)

const ARTICLE_PAGE_MAP = new Map(
  allPosts
    .filter((post) => post.published !== false)
    .map((post) => {
      const rawTarget =
        typeof post.target === 'string' && post.target.trim().length > 0
          ? post.target.trim().toLowerCase()
          : 'midway'

      const descriptor = makeDescriptor({
        path: normalizePathname(`/learn/${rawTarget}/${post.slug}`),
        title: post.title,
        pageType: 'article',
        author: typeof post.author === 'string' ? post.author : null,
        language: typeof post.language === 'string' ? post.language : null,
        target: rawTarget,
        articleSlug: sanitizeSlug(post.slug),
      })

      return [descriptor.path, descriptor] as const
    }),
)

const ARTICLE_SLUG_MAP = new Map(
  Array.from(ARTICLE_PAGE_MAP.values())
    .filter((page) => page.articleSlug)
    .map((page) => [page.articleSlug as string, page] as const),
)

const TOPIC_PAGE_MAP = new Map(
  allTopics.map((topic) => {
    const descriptor = makeDescriptor({
      path: normalizePathname(`/topics/${topic.slug}`),
      title: topic.title,
      pageType: 'topic',
      author: null,
      language: topic.slug.endsWith('.it') ? 'it' : 'en',
      target: null,
      articleSlug: null,
    })

    return [descriptor.path, descriptor] as const
  }),
)

const PRODUCT_PAGE_MAP = new Map(
  getAllProducts().map((product) => {
    const descriptor = makeDescriptor({
      path: normalizePathname(`/prodotti/${product.slug}`),
      title: product.title,
      pageType: 'product',
      author: null,
      language: null,
      target: null,
      articleSlug: null,
    })

    return [descriptor.path, descriptor] as const
  }),
)

function makeAuthorDescriptor(path: string, slug: string): TrackedPublicPageDescriptor {
  return makeDescriptor({
    path,
    title: `Author: ${titleizeSegment(slug)}`,
    pageType: 'author',
    author: null,
    language: null,
    target: null,
    articleSlug: null,
  })
}

export function getTrackedArticlePageBySlug(slug: string): TrackedPublicPageDescriptor | null {
  const sanitized = sanitizeSlug(slug.trim().toLowerCase())
  if (!sanitized) return null
  return ARTICLE_SLUG_MAP.get(sanitized) ?? null
}

export function getTrackedPublicPage(pathname: string): TrackedPublicPageDescriptor | null {
  const normalizedPath = normalizePathname(pathname)

  if (isExcludedPath(normalizedPath)) {
    return null
  }

  return (
    ARTICLE_PAGE_MAP.get(normalizedPath) ??
    TOPIC_PAGE_MAP.get(normalizedPath) ??
    PRODUCT_PAGE_MAP.get(normalizedPath) ??
    LEARN_TARGET_MAP.get(normalizedPath) ??
    STATIC_PAGE_MAP.get(normalizedPath) ??
    (() => {
      if (normalizedPath.startsWith('/author/')) {
        const slug = normalizedPath.split('/')[2]
        if (slug) return makeAuthorDescriptor(normalizedPath, slug)
      }

      if (normalizedPath.startsWith('/verify/')) {
        return makeDescriptor({
          path: normalizedPath,
          title: 'Credential Verification',
          pageType: 'tool',
          author: null,
          language: null,
          target: null,
          articleSlug: null,
        })
      }

      return null
    })()
  )
}

export function listKnownTrackedPublicPages(): TrackedPublicPageDescriptor[] {
  const pages = [
    ...STATIC_PAGE_MAP.values(),
    ...LEARN_TARGET_MAP.values(),
    ...ARTICLE_PAGE_MAP.values(),
    ...TOPIC_PAGE_MAP.values(),
    ...PRODUCT_PAGE_MAP.values(),
  ]

  const deduped = new Map<string, TrackedPublicPageDescriptor>()
  for (const page of pages) {
    deduped.set(page.path, page)
  }

  return Array.from(deduped.values())
}

export function getTrackedProductPage(pathname: string): TrackedPublicPageDescriptor | null {
  const normalizedPath = normalizePathname(pathname)
  return PRODUCT_PAGE_MAP.get(normalizedPath) ?? null
}

export function getTrackedProductPageBySlug(slug: string): TrackedPublicPageDescriptor | null {
  const product = getProductBySlug(slug)
  if (!product) return null
  return PRODUCT_PAGE_MAP.get(`/prodotti/${product.slug}`) ?? null
}
