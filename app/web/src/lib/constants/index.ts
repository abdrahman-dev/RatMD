export const APP_NAME = 'RatMD'
export const APP_TAGLINE = 'PDF to Markdown, optimized for AI'
export const APP_DESCRIPTION = 'Reduce LLM token usage by up to 20% by converting PDFs into clean Markdown.'

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_FILE_TYPES = ['.pdf']
export const ACCEPTED_MIME_TYPES = ['application/pdf']

export const ROUTES = {
  home: '/',
  converter: '/converter',
  docs: '/docs',
  faq: '/faq',
  login: '/login',
  register: '/register',
  verifyEmail: '/verify-email',
  dashboard: '/dashboard',
  profile: '/profile',
} as const

export const NAV_LINKS = [
  { label: 'Converter', href: ROUTES.converter },
  { label: 'Docs', href: ROUTES.docs },
  { label: 'FAQ', href: ROUTES.faq },
  { label: 'GitHub', href: 'https://github.com/abdrahman-dev/RatMD', external: true },
] as const

export const FEATURES = [
  {
    title: 'AI-Optimized Output',
    description: 'Markdown structured for LLM context windows. Clean, semantic, token-efficient.',
    icon: 'brain',
  },
  {
    title: 'Local-First',
    description: 'All processing happens in your browser. No uploads to external servers.',
    icon: 'lock',
  },
  {
    title: 'Privacy Focused',
    description: 'Your documents never leave your machine. 100% client-side processing.',
    icon: 'shield',
  },
  {
    title: 'CLI + Web',
    description: 'Use via browser or terminal. ratmd convert file.pdf — that\'s it.',
    icon: 'terminal',
  },
  {
    title: 'Fast Parsing',
    description: 'Built for speed. Parse and convert even large PDFs in seconds.',
    icon: 'zap',
  },
  {
    title: 'RAG-Ready',
    description: 'Output structured for vector databases and retrieval-augmented generation pipelines.',
    icon: 'database',
  },
] as const

export const HOW_IT_WORKS = [
  { number: 1, title: 'Upload PDF', description: 'Drag & drop or select a PDF file. Max 10MB.' },
  { number: 2, title: 'Extract & Clean', description: 'We extract text, strip headers/footers, remove noise.' },
  { number: 3, title: 'Generate Markdown', description: 'Semantic structure is preserved in clean Markdown.' },
  { number: 4, title: 'Optimize Tokens', description: 'See your token savings — up to 75% reduction.' },
  { number: 5, title: 'Export or Copy', description: 'Download .md file or copy to clipboard. Ready for AI.' },
] as const
