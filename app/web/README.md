# RatMD Frontend

React 19 SPA for PDF-to-Markdown conversion with auth, dashboard, community features, animated background, light/dark theme, and a rat rank system.

## Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Bundler + dev server |
| TailwindCSS | 4 | Utility-first styling via `@theme` directive |
| Framer Motion | 12 | Page transitions and scroll animations |
| Zustand | 5 | State management (app store + auth store) |
| React Router | 7 | Client-side routing with protected routes |
| pdfjs-dist | 5 | Client-side PDF text extraction |
| js-tiktoken | 1 | OpenAI `cl100k_base` token encoding |

## Pages & Routes

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | HomePage | Public | Landing page with hero, demo, features, how-it-works |
| `/converter` | ConverterPage | Public | Full conversion workflow — upload, parse, estimate, export |
| `/docs` | DocsPage | Public | CLI reference + web guide + token explanation |
| `/faq` | FaqPage | Public | 18-question accordion FAQ across 6 categories |
| `/login` | LoginPage | Public only | Email + password sign-in |
| `/register` | RegisterPage | Public only | Name + email + password registration |
| `/verify-email` | VerifyEmailPage | Public only | 6-digit OTP verification with resend cooldown |
| `/dashboard` | DashboardPage | Protected | User greeting, stats cards, paginated conversion history |
| `/profile` | ProfilePage | Protected | Avatar picker, name/bio/social form, save |

Protected routes redirect to `/login`. Public-only routes (auth pages) redirect to `/converter` if already authenticated.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

Create `.env.local` in `app/web/`:

```env
VITE_API_URL=http://localhost:5000/api
```

## How to Run

```bash
cd app/web
npm install
npm run dev
# Opens at http://localhost:5173
```

### Build

```bash
npm run build
# Output in app/web/dist/
```

### Lint

```bash
npm run lint
```

## Key Directories

```
src/
├── app/
│   ├── layouts/         # RootLayout (Header + Outlet + Footer)
│   ├── providers/       # Session restore via fetchMe on mount
│   ├── router/          # createBrowserRouter with protected/public guards
│   └── store/           # app-store.ts (file/conversion state), auth-store.ts (user/auth state)
├── components/
│   ├── animations/      # AnimatedElement — Framer Motion scroll-reveal wrapper
│   ├── layout/          # Header (auth-aware with dropdown), Footer
│   ├── shared/          # Section wrapper
│   └── ui/              # Button, Card, Badge, Container, Logo, LogoIcon
├── features/
│   ├── export/          # Download .md + clipboard copy
│   ├── markdown-preview/# Rendered Markdown viewer
│   ├── parser/          # ParserPanel with animated stage progression
│   ├── token-estimator/ # Token comparison bars + detail view
│   └── upload/          # Drag-and-drop upload zone with validation
├── hooks/               # useTheme, useFileUpload, useTokenEstimate
├── lib/
│   ├── api/             # client.ts (fetch wrapper, credentials: include), endpoints.ts
│   ├── constants/       # Routes, nav links, feature data, steps
│   ├── pdf/             # PDF parser (pdfjs-dist, line grouping, heading detection)
│   ├── tokenizer/       # Token estimator (js-tiktoken cl100k_base)
│   └── utils/           # cn(), formatBytes, formatNumber, generateId, clamp, truncateText
├── pages/               # All page components (auth, converter, dashboard, docs, faq, home, profile)
├── services/            # Parser + export service abstractions
├── styles/              # index.css — @theme tokens, dark/light mode, keyframes
├── types/               # TypeScript interfaces (AuthUser, ConversionResult, etc.)
├── App.tsx              # Wraps AppRouter with Providers
└── main.tsx             # Entry point
```

## Design System

### CSS Variables (TailwindCSS v4 `@theme`)

All colors use CSS variables — zero hardcoded hex in components.

| Token | Dark | Light |
|---|---|---|
| `--color-background` | `#0B0F0C` | `#F0EDE6` |
| `--color-surface` | `#111827` | `#E8E4DC` |
| `--color-accent` | `#39FF14` | `#2A8F0A` |
| `--color-text` | `#E8E8E8` | `#1A1A18` |
| `--color-text-dim` | `rgba(255,255,255,0.5)` | `#6B6560` |
| `--color-border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.1)` |
| `--color-danger` | `#EF4444` | `#DC2626` |

### Typography

- **Monospace**: JetBrains Mono (primary) — nav, inputs, code, stats, labels
- **Sans**: Geist (secondary) — headings, body text

### Components

- Sharp corners — `border-radius: 4px` max on inputs
- CTA buttons use `bg-accent text-background`
- Surface cards use `bg-surface border border-border`
- Framer Motion entrance: `opacity: 0 → 1, y: 20 → 0` on page mount

## API Client

All API calls use `src/lib/api/client.ts` — a fetch wrapper with:

- `credentials: 'include'` on every request (httpOnly cookies)
- Generic typing: `client.get<T>(url): Promise<T>`
- Auto-clears auth state on 401 responses
- Methods: `get`, `post`, `put`, `delete`

## License

MIT © Abdrahman Walied
