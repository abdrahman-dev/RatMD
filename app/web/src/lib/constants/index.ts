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
    title: 'LLM-ready Markdown',
    description: 'Clean structure your model actually understands. Not a wall of text.',
    icon: 'brain',
  },
  {
    title: 'Stays on your machine',
    description: 'Everything runs in your browser. We literally can\'t see your files.',
    icon: 'lock',
  },
  {
    title: 'Private by design',
    description: 'No accounts needed to convert. No tracking. No nonsense.',
    icon: 'shield',
  },
  {
    title: 'Web now. CLI soon.',
    description: 'Use the web app today. CLI dropping soon for terminal lovers.',
    icon: 'terminal',
  },
  {
    title: 'Surprisingly fast',
    description: 'Client-side parsing that doesn\'t make you wait around.',
    icon: 'zap',
  },
  {
    title: 'RAG pipeline ready',
    description: 'Chunk it, embed it, retrieve it. The output is already structured for that.',
    icon: 'database',
  },
] as const

export const HOW_IT_WORKS = [
  { number: 1, title: 'Upload PDF', description: 'Drag it in or click to browse. Max 10MB for now.' },
  { number: 2, title: 'Extract & Clean', description: 'We rip out the good stuff and trash the rest.' },
  { number: 3, title: 'Generate Markdown', description: 'Headings stay headings. Content stays readable.' },
  { number: 4, title: 'Optimize Tokens', description: 'Watch the token count drop in real time.' },
  { number: 5, title: 'Export or Copy', description: 'Copy it, download it, paste it straight into your LLM.' },
] as const
