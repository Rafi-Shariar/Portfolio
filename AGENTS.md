# Agent Directives, Project Context & Operational Rules

> This file is the single source of operational truth for agents in this repo.
> `REQUIRMENT.md` is the product **draft**. The confirmed decisions below are
> user-approved. Do not implement frontend UI until the user gives the go-ahead.

---

## 0. Project Context

**Product:** Dynamic full-stack personal portfolio with a secure single-admin dashboard.
All public content is database-driven and editable. Public site uses fluid GSAP animations.

**Monorepo layout (two separate deployables, both on Vercel):**
- `frontend/` — Next.js 16 (App Router), React 19, Tailwind CSS v4, GSAP, TanStack Query/Form, shadcn + Base UI, Biome. `reactCompiler: true`.
- `backend/` — Node.js + Express 5, Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`), PostgreSQL, Zod 4, JWT, Cloudinary, Nodemailer, Biome, `tsx`.
- `REQUIRMENT.md` — product draft (not final).
- `AGENTS.md` — this file.

**Public routes:** `/`, `/projects`, `/projects/:slug`.
**Admin routes:** `/admin/*` (login + CRUD dashboard).

---

## 1. Confirmed Architecture Decisions (user-approved)

- **Topology:** standalone Express API (two deployables). Keep the layered module structure.
- **Auth:** single admin, JWT **access token only — no refresh token** — stored in an
  `httpOnly`, `Secure`, `SameSite` cookie. Logout clears the cookie. No server-side session store.
  Choose a sane access-token lifetime (e.g. 1–7 days) since there is no rotation.
- **Redis:** not used. Remove the Redis dependency, config keys, and `lib/redis.ts`.
- **Content scope:** Profile (+ SocialLink), Project (+ ProjectImage, Tag via ProjectTag),
  Skill, Experience, Certification, Extracurricular, ContactMessage.
- **Media:** backend-proxied multipart upload (multer memory) → Cloudinary. Persist `publicId`
  so replaced/removed assets can be deleted. Enforce MIME type + size before upload.
- **Deployment:** frontend and backend both on Vercel (serverless functions).

---

## 2. Vercel Serverless Constraints (must honor)

- **No long-lived server in prod:** never call `app.listen()` in the deployed entry. Export the
  Express `app` as the serverless handler; keep `server.ts` for local dev only.
- **No boot-time side effects:** move `prisma.$connect()` and `transporter.verify()` out of the
  entry path. A failed SMTP verify must never crash a request; verify lazily or skip it.
- **Connection pooling:** use a pooled Postgres URL (Prisma Postgres / Neon / Supabase pooler)
  with `@prisma/adapter-pg`; reuse a single client per function instance to avoid connection storms.
- **Upload size cap:** Vercel functions limit request bodies to ~4.5 MB. Cap multer file size
  accordingly; switch to signed direct-to-Cloudinary upload only if larger assets are required.
- **Cookies:** frontend and API on different `*.vercel.app` origins are cross-site. Cookies need
  `SameSite=None; Secure`, and a shared custom domain (e.g. `api.example.com`) is preferred to
  avoid third-party-cookie blocking. CORS must allow the exact `FRONTEND_URL` with `credentials: true`.
- **Build step:** run `prisma generate` during build. `src/generated/**` stays gitignored; never hand-edit it.

---

## 3. Verified Scaffold Status (read before coding)

`backend/` was scaffolded from a **healthcare** template and is currently **not clean**:
- `npx tsc --noEmit` FAILS:
  - `src/app/lib/googleAuth.ts` → `config.google_client_id` does not exist.
  - `src/app/lib/redis.ts` → `config.redis_user/password/host/port` do not exist.
  - `src/app/middleware/checkAuth.ts:71` → `user.status` is not on the `User` model.
- `package.json` name is `project-ph-healthcare-system-backend` → rename for this project.
- `User` model has only `id/name/email/timestamps`; `Role` enum has only `ADMIN`.
  `checkAuth` already assumes `role` + `status` exist, and passes non-unique fields
  (`name`, `role`) into `findUnique` — invalid Prisma usage to fix.
- Template leftovers not required here: `google-auth-library`, EJS forgot-password template,
  unused Redis, commented `seed.ts` referencing `SUPER_ADMIN`.
- `src/app.ts`: no routers mounted; middleware order is wrong (`globalErrorHandler` before
  `notFound`). Correct order: parsers → cors → routes → `notFound` → `globalErrorHandler`.
- `validateRequest` only parses `req.body` and is typed `z.ZodObject` (too narrow); `jwt.ts`
  uses `any` + `console.log`; `config/index.ts` has typo `bak_url`.

**Rule:** Do not build features on top of broken/leftover code. Clean and verify the base first.

---

## 4. Backend Architecture & Conventions

- Layered module per domain: `src/app/module/<name>/<name>.{route,controller,service,validation,interface}.ts`.
- Flow: `route → validateRequest → controller → service → prisma`.
- Responses: `sendResponse` for success; `AppError` + `catchAsync` for errors. `notFound` must use the same envelope shape.
- `validateRequest` must validate `body`, `query`, and `params` — not body only. Type schemas as `ZodType`/`ZodTypeAny`, not `ZodObject`.
- No `console.log` in production paths; no empty `catch` blocks; no `any`.
- Prisma: schema split under `prisma/schema/*.prisma`; config in `prisma.config.ts`.
- DB conventions: `String @id @default(uuid())`, `createdAt @default(now())`, `updatedAt @updatedAt`, snake_case `@@map` table names, enums in `enums.prisma`.
- Env: central `config/index.ts`; validate all env vars with Zod at boot; fix typo `bak_url` → `backend_url`; drop all Redis keys.

---

## 5. Frontend Architecture & Conventions

- App Router; Server Components by default. Add `"use client"` only for interactivity/animation.
- GSAP rules (SSR safety):
  - Client components only; register plugins once in a single client entry.
  - Add `@gsap/react` and use `useGSAP` with a `scope` (auto-cleanup), or `gsap.context().revert()`.
  - Call `ScrollTrigger.refresh()` after fonts/images/layout settle; avoid animating layout-affecting props.
  - Honor `prefers-reduced-motion`; never block first paint with animations.
- Data: TanStack Query for server state; TanStack Form + Zod for forms.
- UI: reuse existing shadcn/Base UI primitives and the `cn` util; Tailwind v4 (no `tailwind.config`). Respect `reactCompiler: true`.
- Content pages must be SEO-aware (metadata, sitemap, robots) and resilient to empty data.

---

## 6. Security & Data Rules

- Never commit, print, or hardcode secrets. `.env` stays local; document keys in `.env.example`.
- Never store tokens in `localStorage`. Access token lives in an `httpOnly` cookie only.
- Rate-limit `/auth/*` and public `POST /contact`. Validate upload MIME type + size before
  Cloudinary; delete replaced/removed assets via stored `publicId`.
- CORS: allow only `FRONTEND_URL` with `credentials: true`.
- Validate every request boundary with Zod; sanitize free-text before persistence/email.

---

## 7. Work Process & Execution Loop

1. **Analyze:** inspect existing code + dependency versions; confirm env/services.
2. **Plan:** for non-trivial work, present a plan and ask clarifying questions first.
3. **Implement:** focused, minimal, pattern-consistent edits.
4. **Validate:** run `npm run lint:check` / `npm run format:check` (backend) and `npm run lint`
   (frontend) plus `npx tsc --noEmit`; fix all introduced errors.
5. **Summarize:** list files changed and verification status.

---

## 8. Git & Collaboration

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- Atomic, scoped commits. Clean diffs: no unused deps, debug logs, or temp comments.
- Only commit when explicitly asked.

---

## CRITICAL RULES — MUST FOLLOW

- Keep responses concise and actionable; no filler.
- **PLANNING:** ask clarifying questions before non-trivial tasks; never assume stack/requirements; review edge cases and breaking changes.
- **CHANGE/EDIT:** break large features into parallelizable tasks and delegate; never leave syntax errors, broken imports, or `TODO` placeholders; always run lint + typecheck + build/test after changes.
- **DO NOT** generate frontend UI until the user explicitly confirms the architectural proposal.
- **CLEANUP FIRST:** fix the template's typecheck failures and leftover code before building any feature.
