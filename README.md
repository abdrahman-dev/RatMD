```
██████╗  █████╗ ████████╗███╗   ███╗██████╗
██╔══██╗██╔══██╗╚══██╔══╝████╗ ████║██╔══██╗
██████╔╝███████║   ██║   ██╔████╔██║██║  ██║
██╔══██╗██╔══██║   ██║   ██║╚██╔╝██║██║  ██║
██║  ██║██║  ██║   ██║   ██║ ╚═╝ ██║██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═════╝
```

![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Express5-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![License MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

PDF to Markdown, optimized for AI — strip noise, preserve structure, and reduce token count for LLM ingestion.

---

## ✨ What is RatMD

RatMD converts PDF documents into clean, token-efficient Markdown designed for LLM workflows. The frontend runs entirely in your browser — no uploads, no servers, no privacy leaks. The parser extracts text from PDFs using pdfjs-dist, groups content into structured lines, detects headings by font size ratios, and outputs Markdown that preserves document hierarchy.

Token savings are real but vary by document. Heavily formatted PDFs with repeated headers, footers, and whitespace typically see 30–60% fewer tokens. Plain academic papers with minimal formatting see smaller gains. The estimator uses OpenAI's `cl100k_base` encoding (via js-tiktoken) for accurate counts — not a heuristic.

The backend provides user accounts, conversion history tracking, community leaderboards, and profile management — all secured with httpOnly cookie-based JWT auth.

## 🚀 Features

- **PDF parsing** — text extraction via pdfjs-dist v5 with line grouping and heading detection
- **Token estimation** — real `cl100k_base` encoding via js-tiktoken, not approximate math
- **Auth & Community** — JWT-based auth with httpOnly cookies, email verification via OTP, conversion tracking, rat ranks, leaderboards, user profiles
- **Light/dark theme** — warm parchment light mode, dark-first default, persisted in localStorage
- **Mobile navigation** — hamburger menu with animated dropdown on screens < 768px
- **FAQ page** — 18 questions across 6 categories with accordion expand/collapse
- **Client-side privacy** — all processing happens in the browser, zero server uploads
- **RAG-ready output** — clean Markdown structured for vector databases and LLM context windows
- **Export** — download `.md` file or copy to clipboard
- **Responsive design** — full mobile support, floating pill navbar, container breakpoints
- **Framer Motion animations** — scroll-triggered fade-ins, entrance sequences, pulse effects

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│  app/web/                  services/auth/               │
│  ──────────                ─────────────                │
│  React 19 SPA              Node.js + Express 5          │
│  Vite 8 + TailwindCSS v4   MongoDB + Mongoose 9         │
│  Zustand 5 state           JWT auth (httpOnly cookies)  │
│  React Router 7            Zod validation               │
│                                                             │
│  Pages:                    Endpoints:                   │
│  / /converter /docs /faq   /api/auth/*                  │
│  /login /register          /api/conversions/*           │
│  /verify-email             /api/profile                 │
│  /dashboard /profile       /api/community/*             │
└─────────────────────────────────────────────────────────┘
```

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
| Express       | 5       | Backend API framework                      |
| MongoDB       | 9       | Database + Mongoose ODM                    |
| Zod           | 4       | Input validation                           |

## 📁 Project Structure

```
RatMD/
├── app/web/src/
│   ├── app/
│   │   ├── layouts/         # RootLayout with header + footer + outlet
│   │   ├── providers/       # Session restore on app mount
│   │   ├── router/          # React Router config (10 routes)
│   │   └── store/           # Zustand stores (app-store, auth-store)
│   ├── components/
│   │   ├── animations/      # AnimatedElement (Framer Motion scroll-reveal)
│   │   ├── layout/          # Header (auth-aware navbar), Footer
│   │   ├── shared/          # Section wrapper component
│   │   └── ui/              # Button, Card, Badge, Container, Logo
│   ├── features/
│   │   ├── export/          # Download .md + clipboard copy
│   │   ├── markdown-preview/# Rendered Markdown output viewer
│   │   ├── parser/          # ParserPanel with animated stages
│   │   ├── token-estimator/ # Token comparison bars + detail view
│   │   └── upload/          # Drag-and-drop upload zone
│   ├── hooks/               # useTheme, useFileUpload, useTokenEstimate
│   ├── lib/
│   │   ├── api/             # Fetch client (credentials: include) + endpoints
│   │   ├── constants/       # Routes, nav links, feature data, steps
│   │   ├── pdf/             # Real PDF parser (pdfjs-dist, heading detection)
│   │   ├── tokenizer/       # Real token estimator (js-tiktoken cl100k_base)
│   │   └── utils/           # cn(), formatBytes, formatNumber, generateId
│   ├── pages/
│   │   ├── auth/            # Login, Register, VerifyEmail
│   │   ├── converter/       # Full conversion workflow
│   │   ├── dashboard/       # User stats + conversion history
│   │   ├── docs/            # CLI reference + web guide
│   │   ├── faq/             # 18-question accordion FAQ
│   │   ├── home/            # 7-section landing page
│   │   └── profile/         # Avatar picker + profile form
│   ├── services/            # Parser + export service abstractions
│   ├── styles/              # @theme tokens + light/dark mode + keyframes
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
│
└── services/auth/
    ├── app.js               # Entry point, middleware, route registration
    ├── config/              # Cookie options, Zod env validation
    ├── controllers/         # auth/, conversion/, community/, profile/
    ├── middleware/           # authMiddleware, errorHandler, rateLimiter, validate
    ├── model/               # userModel, refreshToken, conversionModel, mongodb
    ├── routes/              # authRoutes, conversionRoutes, communityRoutes, profileRoutes
    ├── utils/               # authTokens, logger
    └── .env                 # PORT, MONGODB_URL, JWT secrets
```

## 🛠 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or Atlas)

### Installation

```bash
# Backend
cd services/auth
npm install

# Frontend
cd app/web
npm install
```

### Development

Run both services in separate terminals:

```bash
# Terminal 1 — Backend
cd services/auth
npm run dev
# Runs at http://localhost:5000

# Terminal 2 — Frontend
cd app/web
npm run dev
# Opens at http://localhost:5173
```

### Build

```bash
cd app/web
npm run build
# Output in app/web/dist/
```

## 🐳 Docker

```bash
# From project root
docker compose up -d
# Opens at http://localhost:3000
```

The Docker image serves the built static app via Nginx.

## ⚠️ Known Limitations

- **Heading detection is heuristic-based** — font size ratios determine heading levels. PDFs with non-standard sizing or inline formatting may produce incorrect hierarchy.
- **Token savings vary by document type** — heavily formatted PDFs (whitespace, repeated headers, page numbers) see 30–60% reduction. Plain academic papers with minimal formatting see smaller gains.
- **Client-side processing limit** — PDFs over 10MB may be slow or fail on low-end devices. The 10MB file cap reflects practical browser memory limits.
- **No image/table extraction** — the current parser only extracts text. Images, tables, and complex layouts are not preserved.

## 🗺 Roadmap

- [x] Auth system — JWT with httpOnly cookies, email verification, password reset
- [x] Dashboard — user stats, conversion history with pagination
- [x] Profile — avatar picker, bio, social links
- [ ] Community leaderboard UI
- [ ] Server-side parsing — offload heavy processing to a worker service
- [ ] CLI tool — standalone binary for terminal workflows (`ratmd convert file.pdf`)
- [ ] Batch processing — convert multiple PDFs in a single operation
- [ ] Image extraction — preserve embedded images in output

## 📄 License

MIT © Abdrahman Walied
