export const PAGE_SLUGS = {
  HOMEPAGE: 'homepage',
  SEARCH: 'search',
  ARTICLES: 'articles',
  ABOUT: 'about',
  CONTACT: 'contact',
  PRIVACY: 'privacy',
  TERMS: 'terms',
} as const

export type PageSlug = typeof PAGE_SLUGS[keyof typeof PAGE_SLUGS]

export interface PageDefinition {
  slug: PageSlug
  title: string
  description: string
  path: string
}

export const PAGE_DEFINITIONS: PageDefinition[] = [
  { slug: 'homepage', title: 'Homepage', description: 'Main landing page', path: '/' },
  { slug: 'search', title: 'Search', description: 'Search interface', path: '/search' },
  { slug: 'articles', title: 'Articles', description: 'Articles listing', path: '/articles' },
  { slug: 'about', title: 'About Us', description: 'About page', path: '/about' },
  { slug: 'contact', title: 'Contact Us', description: 'Contact page', path: '/contact' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'Privacy policy', path: '/privacy' },
  { slug: 'terms', title: 'Terms of Use', description: 'Terms of service', path: '/terms' },
]
