```
██████╗  █████╗ ████████╗███╗   ███╗██████╗
██╔══██╗██╔══██╗╚══██╔══╝████╗ ████║██╔══██╗
██████╔╝███████║   ██║   ██╔████╔██║██║  ██║
██╔══██╗██╔══██║   ██║   ██║╚██╔╝██║██║  ██║
██║  ██║██║  ██║   ██║   ██║ ╚═╝ ██║██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═════╝
```

[![Deploy](https://github.com/abdrahman-dev/RatMD/actions/workflows/deploy.yml/badge.svg)](https://github.com/abdrahman-dev/RatMD/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-ratmd.vercel.app-39FF14?style=flat-square&logo=vercel)](https://ratmd.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express5-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![License MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**PDF to Markdown, optimized for AI** — strip noise, preserve structure, and cut token
count before the text ever reaches an LLM.

[Live demo](https://ratmd.vercel.app) · [Report an issue](https://github.com/abdrahman-dev/RatMD/issues) · [MIT licensed](LICENSE)

---

## 📸 Screenshots

<!-- Screenshots are not yet added. Drop images into docs/ and uncomment the lines below. -->

<!-- ![Landing page](docs/home.png) -->
<!-- ![Converter with before/after token counts](docs/converter.png) -->
<!-- ![Dashboard with conversion history](docs/dashboard.png) -->

---

## ✨ What is RatMD

RatMD converts PDF documents into clean, token-efficient Markdown designed for LLM
workflows. The frontend runs entirely in the browser — no uploads, no servers, no privacy
leaks. The parser extracts text from PDFs using pdfjs-dist, groups content into structured
lines, detects headings by font size ratios, and outputs Markdown that preserves document
hierarchy.

Token savings are real but vary by document. Heavily formatted PDFs with repeated headers,
footers, and whitespace typically see 30–60% fewer tokens. Plain academic papers with minimal
formatting see smaller gains. The estimator uses OpenAI's `cl100k_base` encoding (via
js-tiktoken) for accurate counts — not a heuristic.

The backend provides user accounts, conversion history tracking, a leaderboard API, and
profile management — all secured with httpOnly cookie-based JWT auth. Optional LLM-powered
markdown cleanup is available via a bring-your-own OpenRouter key stored encrypted on your
profile.

## 🚀 Features

**Conversion**

- **PDF parsing** — text extraction via pdfjs-dist v5 with line grouping and heading detection
- **Token estimation** — real `cl100k_base` encoding via js-tiktoken, not approximate math
- **Export** — download a `.md` file or copy to clipboard
- **Client-side privacy** — all parsing happens in the browser, zero server uploads
- **RAG-ready output** — clean Markdown structured for vector databases and LLM context windows

**AI enhancement (optional, bring your own key)**

- **LLM cleanup** — repairs broken headings, strips header/footer artifacts, fixes tables
- **Encrypted key storage** — AES-256-GCM at rest, never returned by the API or logged
- **Content-hash cache** — re-enhancing identical Markdown skips the LLM call entirely

**Accounts**

- **Auth system** — JWT auth with httpOnly cookies, email verification via OTP, password reset
- **Dashboard** — user stats and paginated conversion history
- **Profile** — avatar picker, bio, GitHub and LinkedIn links
- **Leaderboard API** — top 20 users ranked by tokens saved (backend only, UI not shipped yet)
- **Rat ranks** — automatic progression from Rookie Rat to Rat King

**Interface**

- **Light/dark theme** — warm parchment light mode, dark-first default, persisted in localStorage
- **Animated background** — canvas particle system with a theme-aware palette
- **Framer Motion animations** — scroll-triggered fade-ins, entrance sequences, pulse effects
- **Responsive layout** — full mobile support with hamburger navigation below 768px
- **FAQ page** — 18 questions across 6 categories with accordion expand/collapse

## 🏗 Architecture

```
+----------------------------------------------------------------------+
| app/web                           | services/auth/                   |
| ---------------------             | ---------------------            |
| React 19 SPA                      | Node.js + Express 5              |
| Vite 8 + TailwindCSS v4           | MongoDB + Mongoose 9             |
| Zustand 5 state                   | JWT auth (httpOnly cookies)      |
| React Router 7                    | Zod validation                   |
|                                   |                                  |
| Pages:                            | Endpoints:                       |
|   /        /converter             |   /api/auth/*                    |
|   /docs    /faq                   |   /api/conversions/*             |
|   /login   /register              |   /api/profile                   |
|   /verify-email                   |   /api/community/*               |
|   /dashboard  /profile            |                                  |
+----------------------------------------------------------------------+
```

PDF text extraction runs entirely in the browser. The backend is only reached for
accounts, history, leaderboards, and optional LLM enhancement.

## 📦 Tech Stack

| Technology    | Version | Purpose                                     |
| ------------- | ------- | ------------------------------------------- |
| React         | 19      | UI framework                                |
| TypeScript    | 6       | Type safety                                 |
| Vite          | 8       | Bundler and dev server                      |
| TailwindCSS   | 4       | Utility-first styling with `@theme` tokens  |
| Framer Motion | 12      | Animation library                           |
| Zustand       | 5       | State management                            |
| React Router  | 7       | Client-side routing                         |
| pdfjs-dist    | 5       | PDF text extraction                         |
| js-tiktoken   | 1       | OpenAI `cl100k_base` token encoding         |
| Express       | 5       | Backend API framework                       |
| MongoDB       | 9       | Database + Mongoose ODM                     |
| Zod           | 4       | Input validation                            |
| OpenRouter    | —       | Optional LLM enhancement (BYO key)          |

## 🧩 Capstone Concepts

| Concept | Where it lives |
|---|---|
| API endpoints | `services/auth/app.js:32-35` mounts `/api/auth`, `/api/conversions`, `/api/community`, `/api/profile` · route files in `services/auth/routes/` · `conversionRoutes.js:14-17` registers `POST /save`, `POST /enhance`, `GET /history`, `GET /stats` · controllers in `services/auth/controllers/{auth,conversion,profile,community}/` |
| Database | `services/auth/model/mongodb.js` (`connectDB`) · `userModel.js`, `conversionModel.js:3-45` (`originalTokens`, `optimizedTokens`, `savingsPercent`, `contentHash`, `enhancedMarkdown`, `llmModel`, `llmInputTokens`, `llmOutputTokens`), `refreshToken.js` |
| Authentication | `services/auth/middleware/authMiddleware.js` (verifies JWT, sets `req.user = { userId }`) · `services/auth/utils/authTokens.js` (`generateAccessToken`/`generateRefreshToken`) · `services/auth/config/env.js:16-26` (`ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `ENCRYPTION_SECRET`) · `services/auth/utils/encryption.js` (AES-256-GCM) |
| LLM integration | `services/auth/utils/llmClient.js` (`createLLMClient(apiKey)` via `openai`, configured by `LLM_BASE_URL`/`LLM_MODEL`) · `services/auth/controllers/conversion/conversionController.js:136-283` (`enhanceConversion` + system prompt) · frontend BYO-key form in `app/web/src/pages/profile/ProfilePage.tsx` and Enhance button in `app/web/src/pages/converter/ConverterPage.tsx` |
| Caching | `services/auth/model/conversionModel.js:25-40` (indexed `contentHash`, `enhancedMarkdown`, `llmModel`, `llmInputTokens`, `llmOutputTokens`) · `services/auth/controllers/conversion/conversionController.js` (SHA-256 via `node:crypto`, `findOne({ userId, contentHash, enhancedMarkdown })`, responds `cached: true`, writes back on success) · frontend hash helper `sha256Hex` in `app/web/src/lib/utils/index.ts` |

## 📁 Project Structure

```
RatMD/
├── app/web/                        # React 19 SPA (Vite)
│   └── src/
│       ├── app/
│       │   ├── layouts/            # RootLayout with header + footer + outlet
│       │   ├── providers/          # Session restore on app mount
│       │   ├── router/             # React Router config (9 routes)
│       │   └── store/              # Zustand stores (app-store, auth-store)
│       ├── components/
│       │   ├── animations/         # AnimatedElement (Framer Motion scroll-reveal)
│       │   ├── background/         # AnimatedBackground (canvas particle system)
│       │   ├── brand/              # RatMDLogo / RatMDIcon
│       │   ├── layout/             # Header (auth-aware navbar), Footer
│       │   ├── shared/             # Section wrapper
│       │   └── ui/                 # Button, Card, Badge, Container
│       ├── features/
│       │   ├── export/             # Download .md + clipboard copy
│       │   ├── markdown-preview/   # Rendered Markdown output viewer
│       │   ├── parser/             # ParserPanel with animated stages
│       │   ├── token-estimator/    # Token comparison bars + detail view
│       │   └── upload/             # Drag-and-drop upload zone
│       ├── hooks/                  # useTheme, useFileUpload
│       ├── lib/
│       │   ├── api/                # Fetch client (credentials: include) + endpoints
│       │   ├── constants/          # Routes, nav links, feature data, steps
│       │   ├── markdown/           # Markdown helpers (extractHeadings)
│       │   ├── pdf/                # PDF parser (pdfjs-dist, heading detection)
│       │   ├── tokenizer/          # Token estimator (js-tiktoken cl100k_base)
│       │   └── utils/              # cn(), formatBytes, formatNumber, generateId, sha256Hex
│       ├── pages/
│       │   ├── auth/               # Login, Register, VerifyEmail
│       │   ├── converter/          # Full conversion workflow
│       │   ├── dashboard/          # User stats + conversion history
│       │   ├── docs/               # Web guide + token explanation + CLI preview
│       │   ├── faq/                # 18-question accordion FAQ
│       │   ├── home/               # Landing page sections
│       │   └── profile/            # Avatar picker + profile form + BYO key
│       ├── services/               # Parser + export service abstractions
│       ├── styles/                 # @theme tokens + light/dark mode + keyframes
│       ├── types/                  # TypeScript interfaces
│       ├── App.tsx
│       └── main.tsx
│
├── services/auth/                  # Express 5 + MongoDB API
│   ├── app.js                      # Entry point, middleware, route registration
│   ├── config/                     # Cookie options, Zod env validation
│   ├── controllers/                # auth/, conversion/, community/, profile/
│   ├── middleware/                 # authMiddleware, errorHandler, rateLimiter, validate
│   ├── model/                      # userModel, refreshToken, conversionModel, mongodb
│   ├── routes/                     # authRoutes, conversionRoutes, communityRoutes, profileRoutes
│   ├── utils/                      # authTokens, logger, encryption, llmClient
│   └── .env.example                # PORT, MONGODB_URL, JWT secrets, ENCRYPTION_SECRET, LLM_*
│
├── .github/workflows/deploy.yml    # Build + deploy web app to Vercel
├── Dockerfile                      # Multi-stage build, serves static app via Nginx
├── docker-compose.yml              # Runs the prebuilt web image on port 3000
└── nginx.conf                      # Static file server + SPA fallback
```

Per-package READMEs document the frontend in detail ([app/web](app/web/README.md)) and every
API endpoint, model, and security property ([services/auth](services/auth/README.md)).

## 🚀 Quick Start

```bash
# 1. Backend — copy the env template, then fill in the three secrets
cd services/auth
cp .env.example .env
npm install
npm run dev            # http://localhost:5000

# 2. Frontend — in a second terminal
cd app/web
npm install
npm run dev            # http://localhost:5173
```

The converter works fully offline with no account and no backend running. You only need the
API for accounts, history, and AI enhancement.

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

See [Getting Started](#-getting-started) for the full environment reference.

## 🤖 AI Enhancement (Bring Your Own Key)

RatMD can optionally clean up converted Markdown with an LLM — fix broken headings, strip
page-number and header/footer artifacts, repair tables — without ever uploading your PDF.

- It is **optional**; conversion works fully without it.
- It is **bring-your-own-key**: add your OpenRouter API key on the **Profile** page
  (Profile → AI enhancement — OpenRouter key). The key is encrypted at rest with AES-256-GCM
  (`ENCRYPTION_SECRET`) and is never returned by the API or logged.
- In the Converter, an **Enhance with AI** button appears once you are signed in with a key
  saved. It sends only the already-converted Markdown text (never the PDF) to OpenRouter. On
  failure the original Markdown is kept.
- Repeated enhancements of identical content are served from cache (SHA-256 content hash) to
  avoid redundant calls.
- Server env placeholders: see `services/auth/.env.example` for `ENCRYPTION_SECRET`,
  `LLM_BASE_URL` (default `https://openrouter.ai/api/v1`), and `LLM_MODEL`
  (default `openai/gpt-4o-mini`).

## 🛠 Getting Started

### Prerequisites

- Node.js 20+ and npm 10+
- MongoDB 6+ (local or Atlas) — only needed for accounts and history

### Environment variables

The API validates its environment with Zod at startup and refuses to boot on invalid values.
Copy `services/auth/.env.example` to `services/auth/.env`:

| Variable                            | Required | Constraint                | Purpose                                  |
| ----------------------------------- | -------- | ------------------------- | ---------------------------------------- |
| `PORT`                              | Yes      | number, 1–65535           | HTTP port (default `5000` in the example) |
| `MONGODB_URL`                       | Yes      | non-empty                 | MongoDB connection string                |
| `ACCESS_TOKEN_SECRET`               | Yes      | min 32 characters         | Signs access tokens                      |
| `REFRESH_TOKEN_SECRET`              | Yes      | min 32 characters         | Signs refresh tokens                     |
| `ENCRYPTION_SECRET`                 | Yes      | min 32 characters         | AES-256-GCM key for stored OpenRouter keys |
| `NODE_ENV`                          | No       | `development`\|`production`\|`test` | Defaults to `development`      |
| `LLM_BASE_URL`                      | No       | any string                | Defaults to `https://openrouter.ai/api/v1` |
| `LLM_MODEL`                         | No       | any string                | Defaults to `openai/gpt-4o-mini`        |

The frontend reads a single optional variable, `VITE_API_URL` (default
`http://localhost:5000/api`).

### Scripts

| Command         | Where          | Does                                        |
| --------------- | -------------- | ------------------------------------------- |
| `npm run dev`   | both packages  | Dev server with hot reload / nodemon         |
| `npm run build` | `app/web`      | Typecheck and build to `app/web/dist/`       |
| `npm run lint`  | `app/web`      | ESLint                                       |
| `npm run typecheck` | `app/web`  | TypeScript only, no emit                     |
| `npm start`     | `services/auth`| Run the API with plain Node                 |

## 🐳 Docker

```bash
docker compose up -d --build   # http://localhost:3000
```

**This serves the frontend only.** The image builds `app/web`, then serves the static output
through Nginx with an SPA fallback. It does not start the API or a database — for the full app
run `npm run dev` in `services/auth` alongside it, or point `VITE_API_URL` at your deployed API.

## ☁️ Deployment

`.github/workflows/deploy.yml` builds `app/web` and deploys it to Vercel on every push to
`main`. It needs three repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and
`VERCEL_PROJECT_ID`.

If you self-host the API, remember to update the CORS origin — see Known Limitations.

## ⚠️ Known Limitations

**Parsing**

- **Heading detection is heuristic-based** — font size ratios determine heading levels. PDFs
  with non-standard sizing or inline formatting may produce incorrect hierarchy.
- **Token savings vary by document type** — heavily formatted PDFs (whitespace, repeated
  headers, page numbers) see 30–60% reduction; plain academic papers see smaller gains.
- **No image or table extraction** — the current parser only extracts text. Images, tables,
  and complex layouts are not preserved.
- **10MB file cap** — larger PDFs may be slow or fail on low-end devices. This reflects
  practical browser memory limits.

**Deployment and security (not yet addressed)**

- **CORS origin is hardcoded** to `http://localhost:5173` in `services/auth/app.js`. Before
  deploying the API to another domain, change it to your frontend origin or the browser will
  block credentialed requests.
- **OTP delivery is not wired up** — email verification and password reset codes are written
  to the server console rather than emailed, and they are not gated behind `NODE_ENV`. Do not
  run this build in production as-is.
- **No security headers** — `helmet` is not mounted, so responses ship without HSTS,
  CSP, or `X-Content-Type-Options`.

## 🗺 Roadmap

- [x] Auth system — JWT with httpOnly cookies, email verification, password reset
- [x] Dashboard — user stats and paginated conversion history
- [x] Profile — avatar picker, bio, social links
- [x] Leaderboard API — top 20 by tokens saved (frontend view still to come)
- [x] AI enhancement with bring-your-own OpenRouter key and content-hash caching
- [ ] Leaderboard UI — render the existing `/api/community/leaderboard` endpoint
- [ ] Production readiness — env-driven CORS origin, OTP email delivery, security headers
- [ ] Automated tests — currently none; parser and auth flows are untested
- [ ] CLI tool — standalone binary for terminal workflows (`ratmd convert file.pdf`)
- [ ] Batch processing — convert multiple PDFs in a single operation
- [ ] Image extraction — preserve embedded images in output

## 🤝 Contributing

Issues and pull requests are welcome. A few conventions this codebase follows:

- Two independent packages (`app/web`, `services/auth`) — run `npm install` in each after
  cloning.
- Keep secrets in `.env` only; `.env.example` is the committed template.
- Run `npm run lint` and `npm run typecheck` in `app/web` before opening a PR.
- Conventional-ish commit prefixes: `feat:`, `fix:`, `docs:`, `style:`, `chore:`.

## 📄 License

[MIT](LICENSE) © 2026 Abdrahman Walied