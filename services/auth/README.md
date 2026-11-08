# RatMD API

Node.js Express 5 + MongoDB REST API for authentication, conversion tracking, community
features, and optional bring-your-own-key LLM enhancement. Secure dual-token strategy with
httpOnly cookies, token revocation, server-side session tracking, and centralized error
handling.

## Features

- **Dual-token JWT auth** — Access tokens (15min) + refresh tokens (7 days) in httpOnly cookies
- **Server-side revocation** — Refresh tokens stored in MongoDB with an `isRevoked` flag
- **Centralized error handling** — Custom `AppError` class catches Zod (422), JWT (401), and
  Mongoose (400/409) errors
- **Zod validation** — All inputs validated before hitting the database
- **Rate limiting** — Global (100/15min), login (5/15min), register (10/hour), refresh
  (20/15min)
- **Security headers** — `helmet` mounted on all responses
- **Conversion tracking** — Save, paginated history, aggregate per-user stats
- **LLM enhancement** — Optional OpenRouter cleanup of converted Markdown, with the user's
  key encrypted at rest and results cached by content hash
- **Community features** — Leaderboard (top 20), public profiles, avatar management
- **User profiles** — Bio, GitHub, LinkedIn links, avatar selection
- **Rat rank system** — Automatic rank computation based on tokens saved (Rookie Rat → Rat King)

## Tech Stack

| Layer      | Technology                                                |
| ---------- | --------------------------------------------------------- |
| Runtime    | Node.js 20+ + Express 5                                   |
| Database   | MongoDB + Mongoose 9                                      |
| Auth       | JWT (jsonwebtoken), httpOnly cookies                      |
| Validation | Zod 4 (env + request bodies)                              |
| Security   | bcryptjs, express-rate-limit, cookie-parser, helmet, CORS |
| LLM        | `openai` SDK pointed at OpenRouter (BYO key, optional)    |

> **Note** — Verification and password-reset OTP flows were removed; register/login work
> without email verification.

## Project Structure

```
services/auth/
├── app.js                          # Entry point, middleware, route registration
├── config/
│   ├── cookie.js                   # httpOnly cookie options (access + refresh)
│   └── env.js                      # Zod env validation (PORT, MONGODB_URL, secrets)
├── controllers/
│   ├── auth/
│   │   ├── authController.js       # Register, login, logout, refresh, me, change password
│   │   └── authValidation.js       # Zod schemas for all auth endpoints
│   ├── conversion/
│   │   ├── conversionController.js # Save, enhance, history (paginated), stats
│   │   └── conversionValidation.js # Zod schemas for save and enhance
│   ├── community/
│   │   └── communityController.js  # Leaderboard, avatar update, public profile
│   └── profile/
│       ├── profileController.js    # Get/update profile, update encrypted LLM key
│       └── profileValidation.js    # Zod schema for the LLM key payload
├── middleware/
│   ├── authMiddleware.js           # JWT access token verification
│   ├── errorHandler.js             # AppError class + centralized error handler
│   ├── rateLimiter.js              # Global + auth-specific rate limiters
│   └── validate.js                 # Zod middleware wrapper
├── model/
│   ├── mongodb.js                  # Mongoose connection
│   ├── userModel.js                # User schema (auth + stats + profile + LLM key)
│   ├── refreshToken.js             # Refresh token schema (TTL index)
│   └── conversionModel.js          # Conversion tracking + enhancement cache schema
├── routes/
│   ├── authRoutes.js               # /api/auth/*
│   ├── conversionRoutes.js         # /api/conversions/*
│   ├── communityRoutes.js          # /api/community/*
│   └── profileRoutes.js            # /api/profile
├── utils/
│   ├── authTokens.js               # Access + refresh token generation
│   ├── encryption.js               # AES-256-GCM encrypt/decrypt
│   ├── llmClient.js                # OpenRouter client factory + config resolution
│   └── logger.js                   # Structured logger
├── .env.example
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm 10+
- MongoDB instance (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Configuration is validated by Zod at import time — the process exits with a descriptive error
if anything is missing or malformed. Copy the template and fill it in:

```bash
cp .env.example .env
```

| Variable               | Required | Constraint                        | Description                              |
| ---------------------- | -------- | --------------------------------- | ---------------------------------------- |
| `PORT`                 | Yes      | numeric string, 1–65535           | HTTP port                                |
| `MONGODB_URL`          | Yes      | non-empty                         | MongoDB connection string                |
| `ACCESS_TOKEN_SECRET`  | Yes      | min 32 characters                 | JWT signing secret for access tokens     |
| `REFRESH_TOKEN_SECRET` | Yes      | min 32 characters                 | JWT signing secret for refresh tokens    |
| `ENCRYPTION_SECRET`    | Yes      | min 32 characters                 | AES-256-GCM key for stored OpenRouter keys |
| `NODE_ENV`             | No       | `development`\|`production`\|`test` | Defaults to `development`                |
| `ALLOWED_ORIGINS`      | No       | comma-separated list, defaults to `http://localhost:5173` | CORS allowlist (credentials enabled) |
| `TRUST_PROXY`          | No       | non-negative integer, defaults to `0` | Proxy hop count for real client IP when behind a proxy |
| `LLM_BASE_URL`         | No       | any string                        | Defaults to `https://openrouter.ai/api/v1` |
| `LLM_MODEL`            | No       | any string                        | Defaults to `openai/gpt-4o-mini`        |

Example `.env`:

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/ratmd
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars
ENCRYPTION_SECRET=your_encryption_secret_min_32_chars
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
TRUST_PROXY=0
```

Generate real secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Run Development

```bash
npm run dev      # nodemon, http://localhost:5000
```

### Production

```bash
npm start        # plain node
```

## API Endpoints

### Auth

| Method | Endpoint                    | Auth | Rate limit    | Description             |
| ------ | --------------------------- | ---- | ------------- | ----------------------- |
| GET    | `/api/auth/`                | No   | global        | Health check            |
| POST   | `/api/auth/register`        | No   | 10/hour       | Create new account      |
| POST   | `/api/auth/login`           | No   | 5/15min       | Login and receive tokens |
| POST   | `/api/auth/logout`          | No   | global        | Revoke session          |
| POST   | `/api/auth/refresh`         | No   | 20/15min      | Issue new access token  |
| GET    | `/api/auth/me`              | Yes  | global        | Get current user        |
| POST   | `/api/auth/change-password` | Yes  | global        | Change password         |

### Conversions

| Method | Endpoint                     | Auth | Description                                                          |
| ------ | ---------------------------- | ---- | -------------------------------------------------------------------- |
| POST   | `/api/conversions/save`      | Yes  | Save a conversion record (optionally with a `contentHash`)           |
| POST   | `/api/conversions/enhance`   | Yes  | LLM-cleanup converted Markdown using the user's encrypted OpenRouter key; served from cache on a content-hash hit |
| GET    | `/api/conversions/history`   | Yes  | Paginated conversion history (`?page=1&limit=10`)                     |
| GET    | `/api/conversions/stats`     | Yes  | `totalTokensSaved`, `totalConversions`, `avgSavingsPercent`, `ratRank`, `avatar` |

`POST /enhance` body: `{ markdown, filename }`. Markdown is capped at 50,000 characters by the
Zod schema. Requires `ENCRYPTION_SECRET` to decrypt the stored key; the user's original
Markdown is preserved if the call fails.

### Profile

| Method | Endpoint                  | Auth | Description                                                    |
| ------ | ------------------------- | ---- | -------------------------------------------------------------- |
| GET    | `/api/profile`            | Yes  | Get full user profile                                          |
| PUT    | `/api/profile`            | Yes  | Update profile (name, bio, github, linkedin, avatar)           |
| PUT    | `/api/profile/llm-key`    | Yes  | Store or clear the user's OpenRouter key (encrypted at rest)   |

### Community

| Method | Endpoint                            | Auth | Description                                                       |
| ------ | ----------------------------------- | ---- | ----------------------------------------------------------------- |
| GET    | `/api/community/leaderboard`        | No   | Top 20 users by `totalTokensSaved`                                  |
| PUT    | `/api/community/avatar`             | Yes  | Update avatar (`rat_default`, `rat_ninja`, `rat_hacker`, `rat_king`, `rat_ghost`) |
| GET    | `/api/community/profile/:userId`    | No   | Public profile (no email or password)                               |

## MongoDB Models

### User

| Field               | Type    | Default         | Description                              |
| ------------------- | ------- | --------------- | ---------------------------------------- |
| `name`              | String  | —               | Required                                  |
| `email`             | String  | —               | Required, unique                          |
| `password`          | String  | —               | Required, bcrypt hashed                   |
| `openRouterApiKey`  | String  | `null`          | AES-256-GCM ciphertext of the user's BYO key |
| `totalTokensSaved`  | Number  | `0`             | Cumulative tokens saved                   |
| `totalConversions`  | Number  | `0`             | Total conversions performed               |
| `avatar`            | String  | `rat_default`   | Avatar identifier                         |
| `ratRank`           | String  | `Rookie Rat`    | Computed rank label                       |
| `bio`               | String  | `''`            | User bio                                  |
| `github`            | String  | `''`            | GitHub URL                                |
| `linkedin`          | String  | `''`            | LinkedIn URL                              |

`openRouterApiKey` is never selected into API responses. `GET /api/profile` returns a
`hasLlmKey` boolean instead.

### RefreshToken

| Field       | Type     | Default | Description                        |
| ----------- | -------- | ------- | ---------------------------------- |
| `userId`    | ObjectId | —       | Ref: User, required                |
| `token`     | String   | —       | JWT refresh token                  |
| `expiresAt` | Date     | —       | TTL index (auto-purge)             |
| `isRevoked` | Boolean  | `false` | Revocation flag                    |

### Conversion

| Field               | Type     | Default   | Description                                    |
| ------------------- | -------- | --------- | ---------------------------------------------- |
| `userId`            | ObjectId | —         | Ref: User, required                            |
| `filename`          | String   | —         | Required                                       |
| `originalTokens`    | Number   | —         | Required                                       |
| `optimizedTokens`   | Number   | —         | Required                                       |
| `savingsPercent`    | Number   | —         | Required                                       |
| `contentHash`       | String   | —         | SHA-256 of the Markdown, indexed for cache hits |
| `enhancedMarkdown`  | String   | —         | Cached LLM-cleaned output                      |
| `llmModel`          | String   | —         | Model that produced the enhancement            |
| `llmInputTokens`    | Number   | —         | Tokens sent to the LLM                         |
| `llmOutputTokens`   | Number   | —         | Tokens returned by the LLM                     |
| `createdAt`         | Date     | `Date.now`| Timestamp                                      |

## Authentication Flow

```
REGISTER / LOGIN
--------------------------------------------------------------
Client sends { email, password }
        |
        v
Server validates input (Zod) -> hashes password (bcryptjs)
        |
        v
Generates:
  +-- Access Token  (JWT, 15min)  -> httpOnly cookie
  +-- Refresh Token (JWT, 7 days) -> httpOnly cookie + stored in MongoDB
        |
        v
{ success: true }   <-- No tokens in the response body


ACCESSING PROTECTED ROUTES
--------------------------------------------------------------
Client request (cookie sent automatically)
        |
        v
authMiddleware verifies accessToken from cookie
        |
        v
req.user = { userId } -> handler executes


LOGOUT
--------------------------------------------------------------
Server marks the refresh token isRevoked: true in the DB
Clears both cookies


RAT RANK THRESHOLDS
--------------------------------------------------------------
>= 1,000,000 -> Rat King
>=   500,000 -> Pack Leader
>=   100,000 -> Tunnel Rat
>=    10,000 -> Gnawer
>=         0 -> Rookie Rat
```

## AI Enhancement Flow

```
Client (signed in, has saved key)
        |
        v  POST /api/conversions/enhance { markdown, filename }
        |
        v  sha256(markdown) -> contentHash
        |
        v  findOne({ userId, contentHash, enhancedMarkdown: { $exists: true } })
        |
   +----+---------------------------+
   | cache hit                      | miss
   | -> { markdown, cached: true }  | decrypt user.openRouterApiKey (AES-256-GCM)
   |                                | -> createLLMClient(key) via LLM_BASE_URL
   |                                | -> chat.completions.create with LLM_MODEL
   |                                | -> store enhancedMarkdown + token usage
   |                                | -> { markdown, cached: false }
   +--------------------------------+
```

The system prompt instructs the model to repair structure without summarizing or dropping
content. On any failure the client keeps the original Markdown.

## Security Highlights

- **httpOnly cookies** — Tokens inaccessible to XSS attacks
- **Server-side revocation** — Refresh tokens tracked in MongoDB with an `isRevoked` flag
- **Token rotation** — Every refresh revokes the old token and issues a new pair
- **Reuse detection** — Revokes all user sessions on suspicious token reuse
- **Rate limiting** — Four dedicated limiters protect sensitive endpoints
- **Password security** — bcryptjs hashing (10 rounds), never stored or returned in plaintext
- **Input validation** — Zod schemas enforce format requirements before any DB query
- **Encrypted secrets at rest** — OpenRouter keys stored as AES-256-GCM ciphertext
- **TTL index** — MongoDB auto-deletes expired refresh tokens
- **CORS** — Allowlist from `ALLOWED_ORIGINS` (comma-separated, default `http://localhost:5173`) with credentials enabled
- **Security headers** — `helmet` mounted

## Error Handling

All errors flow through a single centralized handler:

- **Zod validation errors** — 422 with per-field breakdown
- **JWT errors** — `JsonWebTokenError` / `TokenExpiredError` -> 401
- **Mongoose errors** — Duplicate key (409), validation (400), invalid ObjectId (400)
- **Operational errors** — `AppError(message, statusCode)` from controllers
- **Unexpected errors** — Stack trace only in development

## License

[MIT](../../LICENSE) © 2026 Abdrahman Walied