# RatMD Auth Service

Node.js Express 5 MongoDB JWT Zod bcryptjs

A production-ready REST API for authentication, conversion tracking, and community features — built with Node.js, Express 5, and MongoDB. Secure dual-token strategy with httpOnly cookies, token revocation, server-side session tracking, and centralized error handling.

## Features

- **Dual-token JWT auth** — Access tokens (15min) + refresh tokens (7 days) with httpOnly cookies
- **Server-side revocation** — Refresh tokens stored in MongoDB with `isRevoked` flag
- **Centralized error handling** — Custom `AppError` class catches Zod (422), JWT (401), and Mongoose (400/409) errors
- **Zod validation** — All inputs validated before hitting the database
- **Rate limiting** — Global (100/15min), login (5/15min), register (10/hour), refresh (20/15min), password reset (5/30min)
- **Email verification via OTP** — Required before login; 10-minute expiry
- **Password reset via OTP** — 10-minute expiry
- **Conversion tracking** — Save, paginate history, aggregate stats per user
- **Community features** — Leaderboard (top 20), public profiles, avatar management
- **User profiles** — Bio, GitHub, LinkedIn links, avatar selection
- **Rat rank system** — Automatic rank computation based on tokens saved (Rookie Rat → Rat King)

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| Database | MongoDB + Mongoose 9 |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod 4 |
| Security | bcryptjs, express-rate-limit, cookie-parser, helmet |
| Email | nodemailer (ready for password reset / verification) |

## Project Structure

```
services/auth/
├── app.js                          # Entry point, middleware, route registration
├── config/
│   ├── cookie.js                   # httpOnly cookie options (access + refresh)
│   └── env.js                      # Zod env validation (PORT, MONGODB_URL, secrets)
├── controllers/
│   ├── auth/
│   │   ├── authController.js       # Register, login, logout, refresh, me, OTP, password
│   │   └── authValidation.js       # Zod schemas for all auth endpoints
│   ├── conversion/
│   │   ├── conversionController.js # Save, history (paginated), stats
│   │   └── conversionValidation.js # Zod schema for saveConversion
│   ├── community/
│   │   └── communityController.js  # Leaderboard, avatar update, public profile
│   └── profile/
│       └── profileController.js    # Get/update user profile
├── middleware/
│   ├── authMiddleware.js           # JWT access token verification
│   ├── errorHandler.js             # AppError class + centralized error handler
│   ├── rateLimiter.js              # Global + auth-specific rate limiters
│   └── validate.js                 # Zod middleware wrapper
├── model/
│   ├── mongodb.js                  # Mongoose connection
│   ├── userModel.js                # User schema (auth + stats + profile)
│   ├── refreshToken.js             # Refresh token schema (TTL index)
│   └── conversionModel.js          # Conversion tracking schema
├── routes/
│   ├── authRoutes.js               # /api/auth/*
│   ├── conversionRoutes.js         # /api/conversions/*
│   ├── communityRoutes.js          # /api/community/*
│   └── profileRoutes.js            # /api/profile
├── utils/
│   ├── authTokens.js               # Token generation utilities
│   └── logger.js                   # Structured logger
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/ratmd` |
| `ACCESS_TOKEN_SECRET` | JWT signing secret for access tokens (min 32 chars) | `your_secret_here` |
| `REFRESH_TOKEN_SECRET` | JWT signing secret for refresh tokens (min 32 chars) | `your_secret_here` |
| `NODE_ENV` | Environment mode | `development` or `production` |

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/ratmd
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars
NODE_ENV=development
```

### Run Development

```bash
npm run dev
```

Starts with nodemon at `http://localhost:5000`.

### Production

```bash
npm start
```

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/auth/` | No | Health check |
| POST | `/api/auth/register` | No | Create new account |
| POST | `/api/auth/login` | No | Login and receive tokens |
| POST | `/api/auth/logout` | No | Revoke session |
| POST | `/api/auth/refresh` | No | Issue new access token |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/verify-email` | No | Verify email with OTP |
| POST | `/api/auth/resend-otp` | No | Resend verification OTP |
| POST | `/api/auth/forgot-password` | No | Request password reset OTP |
| POST | `/api/auth/reset-password` | No | Reset password with OTP |
| POST | `/api/auth/change-password` | Yes | Change password |

### Conversions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/conversions/save` | Yes | Save a conversion record |
| GET | `/api/conversions/history` | Yes | Paginated conversion history (`?page=1&limit=10`) |
| GET | `/api/conversions/stats` | Yes | User stats: totalTokensSaved, totalConversions, avgSavingsPercent, ratRank, avatar |

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/profile` | Yes | Get full user profile |
| PUT | `/api/profile` | Yes | Update profile (name, bio, github, linkedin, avatar) |

### Community

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/community/leaderboard` | No | Top 20 users by totalTokensSaved |
| GET | `/api/community/profile/:userId` | No | Public profile (no email/password) |
| PUT | `/api/community/avatar` | Yes | Update avatar (allowed: rat_default, rat_ninja, rat_hacker, rat_king, rat_ghost) |

## MongoDB Models

### User

| Field | Type | Default | Description |
|---|---|---|---|
| `name` | String | — | Required |
| `email` | String | — | Required, unique |
| `password` | String | — | Required, bcrypt hashed |
| `verifyOTP` | String | null | Email verification OTP |
| `verifyOTPExpire` | Number | 0 | OTP expiry timestamp |
| `isAccountVerified` | Boolean | false | Email verified flag |
| `resetOTP` | String | null | Password reset OTP |
| `resetOTPExpire` | Number | 0 | Reset OTP expiry timestamp |
| `totalTokensSaved` | Number | 0 | Cumulative tokens saved |
| `totalConversions` | Number | 0 | Total conversions performed |
| `avatar` | String | `rat_default` | Avatar identifier |
| `ratRank` | String | `Rookie Rat` | Computed rank label |
| `bio` | String | `''` | User bio |
| `github` | String | `''` | GitHub URL |
| `linkedin` | String | `''` | LinkedIn URL |

### RefreshToken

| Field | Type | Default | Description |
|---|---|---|---|
| `userId` | ObjectId | — | Ref: User, required |
| `token` | String | — | JWT refresh token |
| `expiresAt` | Date | — | TTL index (auto-purge) |
| `isRevoked` | Boolean | false | Revocation flag |

### Conversion

| Field | Type | Default | Description |
|---|---|---|---|
| `userId` | ObjectId | — | Ref: User, required |
| `filename` | String | — | Required |
| `originalTokens` | Number | — | Required |
| `optimizedTokens` | Number | — | Required |
| `savingsPercent` | Number | — | Required |
| `createdAt` | Date | Date.now | Timestamp |

## Authentication Flow

```
REGISTER / LOGIN
─────────────────────────────────────────────────
Client sends { email, password }
        │
        ▼
Server validates input (Zod) → hashes password (bcryptjs)
        │
        ▼
Generates:
  ┌─ Access Token  (JWT, 15min)  → httpOnly cookie
  └─ Refresh Token (JWT, 7 days) → httpOnly cookie + stored in MongoDB
        │
        ▼
{ success: true } ← No tokens in response body


ACCESSING PROTECTED ROUTES
─────────────────────────────────────────────────
Client request (cookie sent automatically)
        │
        ▼
authMiddleware verifies accessToken from cookie
        │
        ▼
req.user = { userId } → handler executes


LOGOUT
─────────────────────────────────────────────────
Server marks refresh token as isRevoked: true in DB
Clears both cookies


EMAIL VERIFICATION
─────────────────────────────────────────────────
Register → OTP generated and saved to user document
POST /verify-email { email, otp }
→ OTP verified → isAccountVerified: true
→ Login now allowed


RAT RANK THRESHOLDS
─────────────────────────────────────────────────
< 10,000     → Rookie Rat
< 100,000    → Gnawer
< 500,000    → Tunnel Rat
< 1,000,000  → Pack Leader
>= 1,000,000 → Rat King
```

## Security Highlights

- **httpOnly cookies** — Tokens inaccessible to XSS attacks
- **Server-side revocation** — Refresh tokens tracked in MongoDB with `isRevoked` flag
- **Token rotation** — Every refresh revokes the old token and issues a new pair
- **Reuse detection** — Revokes all user sessions on suspicious token reuse
- **Rate limiting** — Five dedicated limiters protect sensitive endpoints
- **Password security** — bcryptjs hashing (10 rounds), never stored or returned in plaintext
- **Input validation** — Zod schemas enforce format requirements before any DB query
- **TTL index** — MongoDB auto-deletes expired refresh tokens
- **CORS** — Restricted to frontend origin with credentials enabled

## Error Handling

All errors flow through a single centralized handler:

- **Zod validation errors** — 422 with per-field breakdown
- **JWT errors** — `JsonWebTokenError` / `TokenExpiredError` → 401
- **Mongoose errors** — Duplicate key (409), validation (400), invalid ObjectId (400)
- **Operational errors** — `AppError(message, statusCode)` from controllers
- **Unexpected errors** — Stack trace only in development

## License

MIT © Abdrahman Walied
