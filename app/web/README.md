# RatMD Frontend

React 19 SPA for PDF-to-Markdown conversion, with auth, dashboard, community features, an
animated background, light/dark theme, and a rat rank system. All PDF parsing happens in the
browser — files never leave the machine.

## Stack

| Technology    | Version | Purpose                                          |
| ------------- | ------- | ------------------------------------------------ |
| React         | 19      | UI framework                                     |
| TypeScript    | 6       | Type safety                                      |
| Vite          | 8       | Bundler + dev server                             |
| TailwindCSS   | 4       | Utility-first styling via the `@theme` directive |
| Framer Motion | 12      | Page transitions and scroll animations           |
| Zustand       | 5       | State management (app store + auth store)        |
| React Router  | 7       | Client-side routing with protected routes        |
| pdfjs-dist    | 5       | Client-side PDF text extraction                  |
| js-tiktoken   | 1       | OpenAI `cl100k_base` token encoding              |

## Pages & Routes

| Route           | Component      | Access      | Description                                            |
| --------------- | -------------- | ----------- | ------------------------------------------------------ |
| `/`             | HomePage       | Public      | Landing page with hero, demo, features, how-it-works   |
| `/converter`    | ConverterPage  | Public      | Upload → parse → estimate → export workflow            |
| `/docs`         | DocsPage       | Public      | Web guide, token explanation, CLI preview              |
| `/faq`          | FaqPage        | Public      | 18-question accordion FAQ across 6 categories          |
| `/login`        | LoginPage      | Public only | Email + password sign-in                               |
| `/register`     | RegisterPage   | Public only | Name + email + password registration                  |
| `/verify-email` | VerifyEmailPage| Public only | 6-digit OTP verification with resend cooldown          |
| `/dashboard`    | DashboardPage  | Protected   | Stats cards and paginated conversion history           |
| `/profile`      | ProfilePage    | Protected   | Avatar picker, bio/social form, OpenRouter API key    |

Protected routes redirect to `/login`. Public-only auth routes redirect to `/converter` when
already authenticated.

## Environment Variables

| Variable        | Description          | Default                     |
| --------------- | -------------------- | --------------------------- |
| `VITE_API_URL`  | Backend API base URL | `http://localhost:5000/api` |

Create `.env.local` in `app/web/`:

```env
VITE_API_URL=http://localhost:5000/api
```

This is optional — without it the client falls back to localhost. Set it explicitly when
building for a deployed backend, otherwise the production bundle will point at localhost.

## How to Run

```bash
npm install
npm run dev          # http://localhost:5173
```

### Build

```bash
npm run build        # typechecks, then outputs to dist/
```

### Lint and typecheck

```bash
npm run lint
npm run typecheck
```

## Key Directories

```
src/
├── app/
│   ├── layouts/         # RootLayout (Header + Outlet + Footer)
│   ├── providers/       # Session restore via fetchMe on mount
│   ├── router/          # createBrowserRouter with protected/public guards
│   └── store/           # app-store.ts (conversion state), auth-store.ts (user/auth state)
├── components/
│   ├── animations/      # AnimatedElement — Framer Motion scroll-reveal wrapper
│   ├── background/      # AnimatedBackground — theme-aware canvas particle system
│   ├── brand/           # RatMDLogo, RatMDIcon
│   ├── layout/          # Header (auth-aware with dropdown), Footer
│   ├── shared/          # Section wrapper
│   └── ui/              # Button, Card, Badge, Container
├── features/
│   ├── export/          # Download .md + clipboard copy
│   ├── markdown-preview/# Rendered Markdown viewer
│   ├── parser/          # ParserPanel with animated stage progression
│   ├── token-estimator/ # Token comparison bars + detail view
│   └── upload/          # Drag-and-drop upload zone with validation
├── hooks/               # useTheme, useFileUpload
├── lib/
│   ├── api/             # client.ts (fetch wrapper, credentials: include), endpoints.ts
│   ├── constants/       # Routes, nav links, feature data, steps
│   ├── markdown/        # converter.ts (extractHeadings)
│   ├── pdf/             # PDF parser (pdfjs-dist, line grouping, heading detection)
│   ├── tokenizer/       # Token estimator (js-tiktoken cl100k_base)
│   └── utils/           # cn.ts (clsx wrapper), index.ts (formatBytes, formatNumber,
│                        #   generateId, sha256Hex)
├── pages/               # All page components (auth, converter, dashboard, docs, faq, home, profile)
├── services/            # Parser + export service abstractions
├── styles/              # index.css — @theme tokens, dark/light mode, keyframes
├── types/               # TypeScript interfaces (AuthUser, ConversionResult, etc.)
├── App.tsx              # Wraps AppRouter with Providers
└── main.tsx             # Entry point
```

## Design System

### CSS Variables (TailwindCSS v4 `@theme`)

All colors use CSS variables — zero hardcoded hex in components. Defined in
`src/styles/index.css`.

| Token                    | Dark      | Light     |
| ------------------------ | --------- | --------- |
| `--color-bg`             | `#080B09` | `#F7F5F0` |
| `--color-surface`        | `#0F1410` | `#EDEAE3` |
| `--color-surface-elevated` | `#161C17` | `#E4E0D8` |
| `--color-accent`         | `#39FF14` | `#1A7A05` |
| `--color-accent-dim`     | `#2CBF10` | `#155E04` |
| `--color-text`           | `#F0F0EE` | `#0A0A0A` |
| `--color-text-dim`       | `#525252` | `#737373` |
| `--color-text-dimmer`    | `#2E2E2E` | `#A3A3A3` |
| `--color-border`         | `#1C1C1C` | `#D4D0C8` |
| `--color-border-light`   | `#141414` | `#E0DDD6` |
| `--color-success`        | `#22C55E` | `#16A34A` |
| `--color-warning`        | `#F59E0B` | `#D97706` |
| `--color-danger`         | `#EF4444` | `#DC2626` |

Light mode is applied by setting `data-theme="light"` on `<html>`. `useTheme` owns that
attribute and persists the choice to `localStorage` under `ratmd-theme`.

### Typography

- **Monospace**: JetBrains Mono (primary) — nav, inputs, code, stats, labels
- **Sans**: Geist (secondary) — headings, body text

### Components

- Sharp corners — `border-radius: 4px` max on inputs
- CTA buttons use `bg-accent text-background`
- Surface cards use `bg-surface border border-border`
- Framer Motion entrance: `opacity: 0 → 1, y: 20 → 0` on page mount

## API Client

All API calls go through `src/lib/api/client.ts` — a fetch wrapper with:

- `credentials: 'include'` on every request (httpOnly cookies)
- Generic typing: `client.get<T>(url): Promise<T>`
- Auto-clears auth state on 401 responses
- Methods: `get`, `post`, `put`, `delete`

Endpoint paths are declared once in `src/lib/api/endpoints.ts`.

## License

[MIT](../../LICENSE) © 2026 Abdrahman Walied