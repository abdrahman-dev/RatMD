```
██████╗  █████╗ ████████╗███╗   ███╗██████╗
██╔══██╗██╔══██╗╚══██╔══╝████╗ ████║██╔══██╗
██████╔╝███████║   ██║   ██╔████╔██║██║  ██║
██╔══██╗██╔══██║   ██║   ██║╚██╔╝██║██║  ██║
██║  ██║██║  ██║   ██║   ██║ ╚═╝ ██║██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═════╝
```

![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![License MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Docker ready](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)
![Vercel deploy](https://img.shields.io/badge/Vercel-deploy-000000?style=flat-square&logo=vercel)

PDF to Markdown, optimized for AI — strip noise, preserve structure, and reduce token count for LLM ingestion.

---

## ✨ What is RatMD

RatMD converts PDF documents into clean, token-efficient Markdown designed for LLM workflows. It runs entirely in your browser — no uploads, no servers, no privacy leaks. The parser extracts text from PDFs using pdfjs-dist, groups content into structured lines, detects headings by font size ratios, and outputs Markdown that preserves document hierarchy.

Token savings are real but vary by document. Heavily formatted PDFs with repeated headers, footers, and whitespace typically see 30–60% fewer tokens. Plain academic papers with minimal formatting see smaller gains. The estimator uses OpenAI's `cl100k_base` encoding (via js-tiktoken) for accurate counts — not a heuristic.

## 🚀 Features

- **PDF parsing** — text extraction via pdfjs-dist v5 with line grouping and heading detection
- **Token estimation** — real `cl100k_base` encoding via js-tiktoken, not approximate math
- **Light/dark theme** — warm parchment light mode, dark-first default, persisted in localStorage
- **Mobile navigation** — hamburger menu with animated dropdown on screens < 768px
- **FAQ page** — 18 questions across 6 categories with accordion expand/collapse
- **Client-side privacy** — all processing happens in the browser, zero server uploads
- **RAG-ready output** — clean Markdown structured for vector databases and LLM context windows
- **Export** — download `.md` file or copy to clipboard
- **Responsive design** — full mobile support, floating pill navbar, container breakpoints
- **Framer Motion animations** — scroll-triggered fade-ins, entrance sequences, pulse effects

## 📦 Tech Stack

| Technology    | Version | Purpose                                    |
| ------------- | ------- | ------------------------------------------ |
| React         | 19      | UI framework                               |
| TypeScript    | 6       | Type safety                                |
| Vite          | 8       | Bundler and dev server                     |
| TailwindCSS   | 4       | Utility-first styling with `@theme` tokens |
| Framer Motion | 12      | Animation library                          |
| Zustand       | 5       | State management                           |
| React Router  | 7       | Client-side routing                        |
| pdfjs-dist    | 5       | PDF text extraction                        |
| js-tiktoken   | 1       | OpenAI `cl100k_base` token encoding        |

## 📁 Project Structure

```
app/web/src/
├── app/
│   ├── layouts/         # RootLayout with header + footer + outlet
│   ├── router/          # React Router config (home, converter, docs, faq)
│   └── store/           # Zustand store (file state, conversion state)
├── components/
│   ├── animations/      # AnimatedElement (Framer Motion scroll-reveal wrapper)
│   ├── layout/          # Header (fixed navbar), Footer
│   ├── shared/          # Section wrapper component
│   └── ui/              # Button, Card, Badge, Container, LogoIcon, Logo
├── features/
│   ├── export/          # Download .md + clipboard copy
│   ├── markdown-preview/# Rendered Markdown output viewer
│   ├── parser/          # ParserPanel with animated stage progression
│   ├── token-estimator/ # Token comparison bars + detail view
│   └── upload/          # Drag-and-drop upload zone
├── hooks/               # useTheme (dark/light toggle with localStorage)
├── lib/
│   ├── constants/       # Routes, nav links, feature data, steps
│   ├── pdf/             # Real PDF parser (pdfjs-dist, line grouping, heading detection)
│   ├── tokenizer/       # Real token estimator (js-tiktoken cl100k_base)
│   └── utils/           # cn() helper, formatBytes, generateId
├── pages/
│   ├── converter/       # Full conversion workflow page
│   ├── docs/            # CLI reference + web guide + token explanation
│   ├── faq/             # 18-question FAQ with accordion
│   └── home/            # 7-section landing page (hero, demo, savings, features, etc.)
├── services/            # Parser service abstraction (future: swap for API)
├── styles/              # index.css — @theme tokens + light mode overrides + keyframes
├── types/               # TypeScript interfaces (ConversionResult, EstimationResult, etc.)
├── App.tsx
└── main.tsx
```

## 🛠 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
cd app/web
npm install
```

### Development

```bash
npm run dev
# Opens at http://localhost:5173
```

### Build

```bash
npm run build
# Output in app/web/dist/
```

## 🐳 Docker

```bash
# From project root
docker compose up -d
# Opens at http://localhost:3000
```

The Docker image serves the built static app via Nginx. No backend required.

## 🚀 Deploy

### Vercel (one-click)

1. Push to GitHub
2. Import `app/web` as a new Vercel project
3. Vercel auto-detects Vite — no config needed
4. Deploy

### Vercel (manual CLI)

```bash
cd app/web
npx vercel --prod
```

### CI/CD

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. Configure three repository secrets:

- `VERCEL_TOKEN` — from [Vercel Account Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` — from `~/.vercel/project.json` after `vercel link`
- `VERCEL_PROJECT_ID` — same file

## ⚠️ Known Limitations

- **Heading detection is heuristic-based** — font size ratios determine heading levels. PDFs with non-standard sizing or inline formatting may produce incorrect hierarchy.
- **Token savings vary by document type** — heavily formatted PDFs (whitespace, repeated headers, page numbers) see 30–60% reduction. Plain academic papers with minimal formatting see smaller gains.
- **Client-side processing limit** — PDFs over 10MB may be slow or fail on low-end devices. The 10MB file cap reflects practical browser memory limits.
- **No image/table extraction** — the current parser only extracts text. Images, tables, and complex layouts are not preserved.
- **Browser-only** — no backend API or server-side parsing yet. CLI tools are planned.

## 🗺 Roadmap

- [ ] Backend API — REST endpoint for server-side PDF conversion
- [ ] Server-side parsing — offload heavy processing to a worker service
- [ ] Auth & API keys — secure access for programmatic use
- [ ] CLI tool — standalone binary for terminal workflows (`ratmd convert file.pdf`)
- [ ] Batch processing — convert multiple PDFs in a single operation
- [ ] Image extraction — preserve embedded images in output

## 📄 License

MIT © Abdrahman Walied
