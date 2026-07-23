# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # start with hot reload (nodemon + ts-node on server.ts)
npm run build   # compile TypeScript -> dist/
npm start       # run compiled dist/server.js (requires build first)
npm run prod    # build then start
npm test        # ts-node test-email.ts (no test framework configured)
```

There is no lint script configured. `tsconfig.json` has `strict: true`.

## Architecture

Express API for a dental clinic's two patient-facing intake forms. Deployed to Vercel as a serverless function; `server.ts` doubles as a local dev server. Database is Supabase Postgres, accessed via `@supabase/supabase-js` (`services/DatabaseService.ts`) — there is no ORM.

**Supabase connection**: `services/supabaseClient.ts` creates the client from `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (the service-role key — bypasses RLS, server-side only, never send it to a frontend). Because access goes through PostgREST rather than a raw Postgres connection, there's no pooler/connection-limit concern like there would be with a direct driver in a serverless function. All 5 tables (`patients`, `patient_medical_data`, `patient_documents`, `patient_audit_logs`, `_prisma_migrations`) have RLS enabled with zero policies — `anon`/`authenticated` get no access at all; only the service-role key (used exclusively by this backend) can read/write.

**Types**: `types/supabase.ts` holds the `Database` type generated from the live schema (via the Supabase MCP `generate_typescript_types` tool, or `supabase gen types typescript` from the CLI) — regenerate it after any schema change. `DatabaseService.ts` derives per-table `Row`/`Insert`/`Update` types from it (`Tables<"patients">`, `TablesInsert<"patients">`, etc.) rather than hand-maintained interfaces.

**Schema changes**: there's no local migration tooling for this project — table DDL was originally created via Prisma migrations (now removed) and is now managed directly against the Supabase project (SQL editor, Supabase CLI, or the `execute_sql`/`apply_migration` MCP tools). `updatedAt` columns are `NOT NULL` with no DB-level default — the app must always set it explicitly on insert/update (see `DatabaseService.ts`), since there's no ORM or trigger doing it automatically.

**Request flow**: `server.ts` → `routes/emailRoutes.ts` → `controllers/EmailController.ts` → `services/EmailService.ts` → (`services/PatientService.ts` + `services/MedicalService.ts` for DB persistence via `services/DatabaseService.ts`) → `lib/emailTemplate.ts` / `lib/utils.ts` for HTML email rendering via `nodemailer`.

Two form flows share this pipeline but persist to separate tables/models, one per frontend app:
- `POST /api/send-medical-form` — the medical-questionnaire app. Persists via `MedicalService` to `PatientMedicalData` (keyed by email when present), then emails via `formatPatientDataForEmail` from `lib/utils.ts`. DB write failure does not block the email send (logged, not thrown).
- `POST /api/send-patient-questionnaire` — the "how you heard about us" marketing app. Upserts via `PatientService.processPatientRegistration` into `PatientMarketingData`, then sends via `EmailTemplate` from `lib/emailTemplate.ts`. **Note**: the actual `transporter.sendMail` call for this route is currently commented out in `EmailService.sendPatientQuestionnaireEmail` and returns a mocked `messageId` — the email itself does not really send yet, only the DB write is real.

**Serverless-safe init**: `server.ts` uses a lazy, memoized `ensureInitialized()` so DB/email setup runs once per warm instance rather than at module load, and Express routes are registered regardless of whether DB/email init succeeds (init failures are logged, not thrown) — this was a deliberate fix so CORS middleware and routes stay available even when Vercel cold-starts without DB connectivity. Local dev (non-Vercel) calls `app.listen` directly after init; the Vercel path exports a `handler(req, res)` function instead.

**CORS**: allow-list is hardcoded in `server.ts` (`corsOptions.origin`) plus `process.env.FRONTEND_URL`, with a regex fallback allowing any `*.vercel.app` preview URL. `ALLOWED_ORIGINS` exists in `.env`/`.env.example` but is not currently read by `server.ts` — update the hardcoded array directly when adding a new frontend origin.

**Swagger**: route/schema docs live as JSDoc `@swagger` blocks directly above each route in `routes/emailRoutes.ts`, aggregated by `swagger/swagger.ts` and served at `/swagger`.

**Models** (`models/*.ts`): `EmailFormData.ts` is the plain-interface DTO shape for incoming form submissions (both flows funnel through it); row types (`Tables<"patients">`, `Tables<"patient_medical_data">`) come from `types/supabase.ts`, not from `models/`.
