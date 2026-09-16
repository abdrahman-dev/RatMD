# My 10x Solution — RatMD (Abdrahman Walied Nasr Mussa)

RatMD is a PDF to clean Markdown converter built for LLM and token-constrained workflows.

## 1. The problem

PDFs extracted as raw text are noisy: repeated headers and footers, broken heading hierarchy, page numbers, and split sentences. Feeding that noise into an LLM wastes tokens, breaks retrieval, and produces worse answers. Manually cleaning the extracted text for each document is slow and error-prone.

## 2. Who has this problem

Developers, researchers, and students who need to feed PDF content into LLMs or docs pipelines and want clean, minimal-token Markdown instead of raw extracted noise.

## 3. The 10x claim

What took 10–15 minutes of manual cleanup per PDF now takes seconds: paste the PDF through RatMD's AI Enhancement and get fixed headings, removed artifacts, and repaired tables without hand-editing.

This claim is backed directly by the codebase: `app/web/src/features/token-estimator/TokenEstimator.tsx` shows the before/after token counts, `services/auth/model/conversionModel.js:13-22` stores `originalTokens`, `optimizedTokens`, and `savingsPercent` for every conversion, and the `enhanceConversion` flow in `services/auth/controllers/conversion/conversionController.js:148-283` automates the manual reformatting step.

## 4. How it was implemented

PDF parsing happens entirely in the browser. `app/web/src/lib/pdf/parser.ts` uses `pdfjs-dist` to extract text items, groups them into lines by Y-coordinate, detects headings heuristically from font-size ratios, and emits Markdown. `app/web/src/lib/tokenizer/estimate.ts` and `TokenEstimator.tsx` count tokens with `js-tiktoken` (`cl100k_base`) to show real savings. Nothing is uploaded.

When the user wants a cleaner result, the Converter offers an optional AI Enhancement. The frontend sends only the already-converted Markdown text (never the PDF) to `POST /api/conversions/enhance` with `{ markdown, filename }`. The backend checks the user's encrypted OpenRouter key, hashes the Markdown with SHA-256, and looks for a cached result before calling the LLM. If no cached result exists, it creates an `openai` client via `services/auth/utils/llmClient.js` using the decrypted per-user key and the configured `LLM_BASE_URL`/`LLM_MODEL`, sends a system prompt that instructs cleaning without summarization, and returns the cleaned Markdown. The enhanced result is stored with model and token usage so the next identical request is served instantly from cache.

Authentication, conversion history, and key storage are handled by the `services/auth` Express service backed by MongoDB/Mongoose.

## 5. The 5 concepts implemented

0 swaps used — all 5 concepts are from the primary list.

- **API endpoints** — `services/auth/app.js:31-34` mounts `/api/auth`, `/api/conversions`, `/api/community`, `/api/profile`; routes in `services/auth/routes/*.js` including `conversionRoutes.js:14-17` (`POST /save`, `POST /enhance`, `GET /history`, `GET /stats`).
- **Database** — `services/auth/model/mongodb.js` (connection) and Mongoose schemas `services/auth/model/userModel.js`, `services/auth/model/conversionModel.js`, `services/auth/model/refreshToken.js`.
- **Authentication** — `services/auth/middleware/authMiddleware.js:4-16` (JWT verify, `req.user = { userId }`), `services/auth/utils/authTokens.js`, `services/auth/config/env.js:16-22` (`ACCESS_TOKEN_SECRET`/`REFRESH_TOKEN_SECRET`), and `services/auth/controllers/auth/*`.
- **LLM integration** — `services/auth/utils/llmClient.js:3-10` (`createLLMClient(apiKey)` with OpenRouter), `services/auth/utils/encryption.js` (AES-256-GCM for `openRouterApiKey`), `services/auth/controllers/conversion/conversionController.js:136-283`, and frontend BYO-key UI in `app/web/src/pages/profile/ProfilePage.tsx` + `app/web/src/pages/converter/ConverterPage.tsx`.
- **Caching** — `services/auth/model/conversionModel.js:25-40` (`contentHash` indexed, `enhancedMarkdown`, `llmModel`, `llmInputTokens`, `llmOutputTokens`) and `services/auth/controllers/conversion/conversionController.js:165-186,227-254` (SHA-256 hash, cache lookup with `cached:true`, store on success).

## 6. One explicit non-goal

No image or table extraction from PDFs, no multi-file batch conversion, and no non-PDF format support. The parser extracts text only; images and complex layouts are intentionally out of scope (see README Known Limitations). This keeps the core flow focused on text cleanup and token savings.

## 7. How to run it

See README `## 🛠 Getting Started` — those steps are accurate. Backend: `cd services/auth && npm install && npm run dev` (port 5000). Frontend: `cd app/web && npm install && npm run dev` (port 5173). For the optional AI Enhancement feature, set `ENCRYPTION_SECRET` (required, min 32 chars), and optionally `LLM_BASE_URL` and `LLM_MODEL` as documented in `services/auth/.env.example`; the core converter works without them.
