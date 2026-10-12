# LeetLab — LeetCode in Your Pocket

> A mobile-first LeetCode client built with **Expo + React Native + Supabase**. Browse a curated problem library, read statements with examples / hints / constraints, write code in an in-app editor, and submit to a server-side judge that runs hidden test cases and returns per-case verdicts.

- **Stack:** Expo SDK 55 · Expo Router · React 19 · TypeScript · HeroUI Native + Tailwind v4 + Uniwind · Zustand · Supabase (Auth + Postgres + RLS) · expo-server API · CodeBox (Judge0-compatible) execution · EAS Build
- **Platforms:** Android · iOS · Web (static)
- **Theme:** Dark-only (`#0F1115` base, Emerald `#00D09E` primary) — except the Auth screens, which use a light mint/white mock-style design

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Database Schema](#database-schema)
- [Auth Flow](#auth-flow)
- [Code Execution (Judge)](#code-execution-judge)
- [Theming](#theming)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Supabase Setup](#supabase-setup)
- [Running on Device](#running-on-device)
- [Building with EAS](#building-with-eas)
- [Security Notes](#security-notes)
- [Known Placeholders](#known-placeholders)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Problem Library (`/(tabs)/problems`)
- Supabase-backed list with `FlatList`, live subtitle (`X of Y` / `Y total`), pull-to-refresh.
- Title search + tag filter (`TagFilterSelect`) with frequency-sorted counts.
- `Loading / Error / Empty` states with retry and clear-filters.

### Problem Detail (`/(tabs)/[problemId]`)
- Title, `DifficultyBadge` (derived, see below), tags, acceptance rate.
- Description, `ExampleBlock` cards (Input / Output / Explanation), hints, constraints, supported languages.
- CTA → code editor with the problem pre-loaded.

### Code Editor (`/(tabs)/[problemId]/codeEditor`)
- Language switcher (`javascript` / `python` / `java`), defaulting to `problem.languages[0]`.
- Starter code auto-loaded from `code_snippets[lang]`; switching languages preserves your edits.
- Plain monospace multiline `TextInput` in a `KeyboardAvoidingView` (no syntax highlighting yet — `lib/highlight.ts` tokenizer exists but is currently unused).
- Guards: empty-code and non-runnable-language checks with friendly messages.

### Verdict Result (`/(tabs)/[problemId]/result`)
- Dedicated result screen (navigated to with the verdict as a JSON param).
- `VerdictCard`: `Accepted` / `Wrong Answer` / `Error`, `passed / total`.
- `CaseList`: per-case pass/fail icon, time, and on failure `expected vs got / stderr`.
- Every submit also persists one aggregate row to `submissions` (best-effort, server-side). There is **no history UI yet**.

### Home (`/(tabs)`)
- Brand + profile greeting row + session banner.
- `QuickPractice`: Browse all, Daily (Two Sum or first problem), Saved (placeholder — no-op for now).
- `WeekStats`: currently **hardcoded** (`Solved: 1, Streak: 0, Saved: 0`).

### Auth (`/(auth)/login`, `/(auth)/signup`)
- **Google-only.** No email/password UI.
- Native Google Sign-In → Supabase `signInWithIdToken({ provider: 'google' })` with friendly error mapping (cancel, Play Services, in-progress, dev misconfig).
- Protected routes with redirects; session persisted via AsyncStorage.

### Profile (`/(tabs)/profile`)
- Avatar (image or initials fallback) + name + email.
- Account card: email + member-since (from `session.user.created_at`).
- Sign-out → redirect to login.

---

## Tech Stack

| Layer | Technology |
|---|---|
| App framework | Expo `~55.0.31`, React `19.2.0`, React Native `0.83.10` |
| Routing | Expo Router `~55.0.18` (file-based, typed routes, React Compiler) |
| UI kit | `heroui-native ^1.0.10` — Button, Card, Chip, Avatar, Spinner, Select, etc. |
| Styling | `tailwindcss ^4` + `uniwind` + `tailwind-merge` / `tailwind-variants` |
| State | `zustand ^5` (`useSessionStore`, `useProblemsStore`, `useProfileStore`) + `useProblem`, `useGoogleAuth` hooks |
| Animation / gestures | `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `@gorhom/bottom-sheet` |
| Icons / media | Ionicons via `@expo/vector-icons`, `expo-image`, `expo-font` (Inter), `expo-symbols` |
| Backend | `@supabase/supabase-js ^2.116` — Auth + Postgres + RLS |
| Server API | `expo-server ~55.0.12` (`src/app/api/submit+api.ts`) |
| Judge | Self-hosted **CodeBox** with a Judge0-compatible API (`CODEBOX_URL`, `CODEBOX_API_TOKEN`); Judge0 language IDs `js:63, py:71, java:62` |
| Auth native | `@react-native-google-signin/google-signin ^16.1.5` + `google-services.json` |
| Storage / utils | `@react-native-async-storage/async-storage`, `react-native-url-polyfill`, `expo-constants`, `expo-linking`, `expo-status-bar`, `expo-splash-screen`, `expo-sqlite` (plugin enabled) |
| Web | `react-dom`, `react-native-web`, `react-native-svg` |
| Tooling | TypeScript `~5.9`, ESLint + `eslint-config-expo`, Supabase CLI, EAS CLI, Bun (`bun.lock`) |

---

## Architecture

```text
┌─────────────────────────────┐
│  Expo App (src/app/)        │
│  (auth): login / signup     │
│  (tabs): home / problems /  │
│  detail / editor / result / │
│  profile                    │
└──────────────┬──────────────┘
               │ Supabase JS (publishable key)
               │  - auth.signInWithIdToken (Google)
               │  - from('problems').select (no test_cases)
               │  - from('profiles').select own row
               ▼
┌─────────────────────────────┐      ┌──────────────────────┐
│  Supabase                   │      │ expo-server API      │
│  - Auth (Google)            │◄─────│ POST /api/submit     │
│  - Postgres + RLS           │ svc  │  Bearer JWT →        │
│  - profiles / problems /    │ role │  getUser → fetch     │
│    submissions              │      │  test_cases → CodeBox│
└─────────────────────────────┘      └──────────┬───────────┘
                                                │ POST /submissions?wait=true
                                                ▼
                                     ┌──────────────────────┐
                                     │ CodeBox (Judge0-     │
                                     │ compatible API)      │
                                     │ cpu 5s, mem 256MB    │
                                     │ stdin/stdout compare │
                                     └──────────────────────┘
```

- **No Edge Functions.** Server logic lives in `src/app/api/submit+api.ts` via `expo-server` + `runTaskAsync`.
- **No global server cache.** `useSessionStore` owns session + profile lifecycle; `useProblemsStore` owns the problem list; `useProblem` fetches single problems; screen-local `useState` for UI.
- **Continuous Native Generation.** No `ios/` / `android/` dirs — native config via `app.config.js` + config plugins.

---

## Project Structure

```text
LeetLab/
  src/
    app/
      _layout.tsx                 # Root: GestureHandler + HeroUI + session init + Stack
      index.tsx                   # Entry gate: redirect → /(tabs) or /(auth)/login
      (auth)/
        _layout.tsx               # Guest guard + fade stack
        login.tsx / signup.tsx    # Google-only, shared AuthScreen
      (tabs)/
        _layout.tsx               # Auth guard + Tabs (Home, Problems, Profile)
        index.tsx                 # Home
        problems.tsx              # Library: search + tag filter + FlatList
        profile.tsx               # Avatar + account + sign-out
        [problemId]/
          index.tsx               # Detail
          codeEditor.tsx          # Editor + submit
          result.tsx              # Verdict + per-case list
      api/
        submit+api.ts             # POST /api/submit — authenticated judge endpoint
    components/
      auth/                       # AuthScreen, GoogleSignInButton, banners
      home/                       # HomeBrand, HomeProfileRow, SessionBanner, QuickPractice, WeekStats
      problems/                   # ProblemCard, DifficultyBadge, ExampleBlock, HintsList, ConstraintsList, ...
      editor/                     # EditorHeader, EditorToolbar, LanguageSelect, CodeInputFrame, SubmitFeedback
      result/                     # ResultHeader, VerdictCard, CaseList
      profile/                    # ProfileHeader, AccountDetails, SignOutButton
      ui/                         # Screen, ScreenHeader, States (Loading/Empty/Error), PressableScale, EnteringView
    hooks/
      useGoogleAuth.ts            # Google → Supabase sign-in
      useProblem.ts               # Single problem (never selects test_cases)
    stores/
      useSessionStore.ts          # { session, loading, initialize() } + profile lifecycle
      useProblemsStore.ts         # Problem list + total + error
      useProfileStore.ts          # Current profiles row (name, avatar_url)
    lib/
      supabase.ts                 # Anon/publishable client (AsyncStorage)
      supabase-admin.ts           # Server: service_role + getUserFromRequest (Bearer)
      judge.ts                    # LANGUAGE_ID_MAP, CodeBox executor, compare, verdict
      submit.ts                   # Client submit (JWT + getApiBaseUrl via hostUri)
      run-task.ts                 # runTaskAsync wrapper for expo-server
      difficulty.ts               # difficultyFor(rate): ≥60 Easy, ≥40 Medium, else Hard
      highlight.ts                # Zero-dep tokenizer (currently unused in UI)
      display-name.ts / motion.ts # Name/initials helpers, animation tokens
    theme.ts                      # TS design tokens (mirror of global.css)
  supabase/
    config.toml                   # Local CLI config (project_id LeetLab)
    migrations/                   # Profile trigger, RLS, problems columns, test_case hiding, submissions
  app.config.js                   # Expo config: slug LeetLab, scheme leetlab, plugins, EAS projectId
  eas.json                        # development / preview / production profiles
  global.css                      # Tailwind + Uniwind + dark-only vars
  metro.config.js / babel.config.js
  google-services.json            # Android Firebase / Google Sign-In (gitignored — do not publish)
```

---

## Routes

| Route | Screen | Access |
|---|---|---|
| `/` | Redirect gate | Public |
| `/(auth)/login` | Google sign-in | Guest |
| `/(auth)/signup` | Google sign-up | Guest |
| `/(tabs)` (Home) | Greeting, quick practice, week stats | Auth |
| `/(tabs)/problems` | Search + tag filter + full list | Auth |
| `/(tabs)/[problemId]` | Full statement + examples/hints/constraints | Auth (push, `href: null`) |
| `/(tabs)/[problemId]/codeEditor` | Language + editor + submit | Auth (push, `href: null`) |
| `/(tabs)/[problemId]/result` | Verdict + per-case results | Auth (push, `href: null`) |
| `/(tabs)/profile` | Avatar, account, sign-out | Auth |
| `POST /api/submit` | Judge endpoint `{status, solved, passed, total, results}` | Auth (Bearer JWT) |

---

## Database Schema

### `profiles`

| Column | Notes |
|---|---|
| `id` | `uuid` PK → `auth.users.id`, created by `handle_new_user()` trigger |
| `name` | `text \| null` from Google profile (`name` / `full_name`) |
| `avatar_url` | `text \| null` from Google profile (`avatar_url` / `picture`) |

RLS: `authenticated` can `SELECT` / `UPDATE` only where `auth.uid() = id`. No `INSERT` policy (trigger owns inserts, `SECURITY DEFINER`, `ON CONFLICT DO NOTHING`).

### `problems`

| Column | Notes |
|---|---|
| `problem_id` | `int` PK, ordered ascending in list |
| `title` / `description` | Statement |
| `examples` | `jsonb` `[{input, output, explanation?}]` — public |
| `tags` / `hints` / `constraints` | `text[]` — public, tags drive the filter |
| `languages` | `text[]` — drives editor default |
| `acceptance_rate` | `numeric` — shown as `%`, also derives difficulty badge |
| `code_snippets` | `jsonb` `{lang: starterCode}` — public |
| `test_cases` | `jsonb` `[{input, output}]` — **hidden from clients**, service_role only |
| `created_at` / `updated_at` | `timestamptz` |

Difficulty is **not a DB column** — `difficultyFor(rate)` maps `≥60 → Easy, ≥40 → Medium, else Hard`.

Seeded: **Two Sum (id 1)** — 5 cases, stdin `nums\ntarget` → stdout `[i,j]`; **Valid Parentheses (id 2)** — 6 cases, stdin raw string → stdout `true/false`. Python + JS starters match the stdin/stdout contract; Java is accepted by the judge but has no seeded snippet yet.

### `submissions`

One aggregate row per submit (written best-effort by the API route, never blocks the verdict):

`id uuid PK, user_id → profiles, problem_id → problems, source_code, language, status ∈ {accepted, partial, failed}, passed, total, runtime/memory, results jsonb, created_at, finished_at`. RLS: users can read/insert only their own rows. **No UI reads this table yet.**

---

## Auth Flow

1. `useSessionStore.initialize()` runs once at root: `getSession()` + `onAuthStateChange` → `{ session, loading }`. On session set it fetches the profile; on null it clears it.
2. **Google:** `GoogleSignin.configure(webClientId)` → `hasPlayServices()` → `signIn()` → `idToken` → `supabase.auth.signInWithIdToken({ provider: 'google', token })`. User-cancel returns silently; other failures map to friendly messages.
3. **Trigger:** `on_auth_user_created_profiles` inserts the `profiles` row automatically.
4. **Guards:** `/` + `(tabs)/_layout` redirect to `/(auth)/login` when `!session`; `(auth)/_layout` redirects to `/(tabs)` when a session exists. Sign-out → `replace(/(auth)/login)`.
5. **Submit auth:** client reads `session.access_token` → `Authorization: Bearer <jwt>` → server `auth.getUser(token)` → `401` if missing/invalid.

---

## Code Execution (Judge)

**Client** (`src/lib/submit.ts`):

```ts
submitSolution({ problemId, language, sourceCode })
→ POST {apiBase}/api/submit { problemId, sourceCode, language }
→ headers { Authorization: `Bearer ${session.access_token}` }
```

`getApiBaseUrl()`: `EXPO_PUBLIC_API_URL` if set, else `http://{hostUri}` from `expo-constants` (dev-server IP for physical devices).

**Server** (`src/app/api/submit+api.ts`):

1. Bearer JWT → `getUserFromRequest()` → `401` if null.
2. Validate `problemId: int`, `sourceCode: string`, `language ∈ {javascript, python, java}`.
3. Fetch `test_cases` with **service_role** (only reader of the hidden column).
4. `runTaskAsync(runAllTestCases)` against CodeBox + best-effort `submissions` insert.

**Judge core** (`src/lib/judge.ts`):

- `LANGUAGE_ID_MAP = { javascript: 63, python: 71, java: 62 }` (Judge0 IDs — CodeBox speaks a Judge0-compatible API, it is not Judge0 hosting).
- `POST {CODEBOX_URL}/submissions?wait=true` with `X-Auth-Token`, `cpu_time_limit: 5s`, `memory_limit: 256MB`.
- Normalized trim + CRLF compare; Judge0 status `3/4 → accepted / wrong-answer`, else `error`; `Promise.all` over cases → `{ status, solved, passed, total, results }`.

---

## Theming

Dark-only lock: identical vars in `@variant light` and `@variant dark` in `global.css` so system preference never changes the UI. `src/theme.ts` is the TS mirror — keep the two in sync.

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0F1115` | Screen bg |
| `foreground` | `#F3F8FF` | Primary text |
| `muted` | `#8B95A5` | Secondary text |
| `surface` | `#1A1D24` | Cards |
| `surface-secondary` | `#22262F` | Example blocks, chips |
| `border` | `#2A2E39` | Borders, dividers |
| `primary` / `success` | `#00D09E` Emerald | CTA, accepted, focus |
| `secondary` / `link` | `#4DABF7` Sky | Links |
| `warning` / `medium` | `#FFB800` Amber | Medium difficulty |
| `danger` / `hard` | `#FF6B6B` Coral | Errors, hard, sign-out |

Inter 400–800, `radius 8/12/16/20`, screen padding `20`. Motion: `<300ms`, transform + opacity only; Reanimated is deliberately avoided at the root / in rows due to Android Fabric crash history.

> Exception: `AuthScreen` is intentionally light (mint `#C9E9E9` header + white sheet + navy text) per mock.

---

## Getting Started

### Prerequisites

- Node 20+ + **Bun** (`bun.lock` present — use `bunx` instead of `npx`)
- Supabase project (or local via Supabase CLI + Docker)
- CodeBox instance (`CODEBOX_URL` + `CODEBOX_API_TOKEN`)
- Google Cloud OAuth client (Web client ID) + `google-services.json` for Android
- EAS CLI for builds (`bunx eas-cli`)
- Expo Go **will not work** (native Google Sign-In) — use a development build

### 1. Install dependencies

```bash
# Always use expo install to resolve SDK-compatible versions
bunx expo install
# or
bun install
```

### 2. Configure environment

Create `.env` in the project root (see [Environment Variables](#environment-variables)). There is no `.env.example` checked in.

### 3. Start the dev server

```bash
bunx expo start
```

Open in a development build (`bunx expo run:android` / `bunx expo run:ios`, or an EAS development build), an emulator/simulator, or web via `bunx expo start --web`.

### 4. Lint + typecheck (required before declaring any task done)

```bash
bunx expo lint
bunx tsc --noEmit
```

Useful extras: `bunx expo-doctor`, `bunx expo install --fix`.

---

## Environment Variables

| Key | Public? | Used by | Description |
|---|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Client | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_KEY` / `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Client | Supabase publishable / anon key (publishable preferred, anon fallback) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Yes | Client | Google OAuth web client ID |
| `EXPO_PUBLIC_API_URL` | Yes | Client | Override for `/api/submit` base (needed for production / physical devices) |
| `SUPABASE_SERVICE_ROLE_KEY` | **No — server only** | API route | Bypasses RLS to read `test_cases`. Never prefix with `EXPO_PUBLIC_` |
| `CODEBOX_URL` | **No** | API route | CodeBox base URL |
| `CODEBOX_API_TOKEN` | **No** | API route | CodeBox auth token |
| `AUTH_DB_PASSWORD` | **No** | Supabase CLI | Local DB password |

> Never commit `.env` or `google-services.json` to a public repo. On EAS, `google-services.json` is injected via the `GOOGLE_SERVICES_JSON` file env var (see `app.config.js`).

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `expo start` | Dev server |
| `android` | `expo start --android` | Start + open Android |
| `ios` | `expo start --ios` | Start + open iOS |
| `web` | `expo start --web` | Start + open Web |
| `lint` | `expo lint` | ESLint (expo flat config) |

Run via `bunx` / `bun run` in this repo.

---

## Supabase Setup

Local (CLI + Docker):

```bash
supabase start
supabase db push
supabase stop
```

Remote (linked project):

```bash
supabase link --project-ref <ref>
supabase db push
```

Migrations in order:

1. `create_profile_on_signup` — `handle_new_user()` trigger
2. `profiles_rls` — own-row `SELECT`/`UPDATE`
3. `add_test_cases_to_problems` — `test_cases jsonb` + seeds
4. `add_code_snippets_to_problems` — `code_snippets jsonb` starters
5. `hide_test_cases_from_clients` — first revoke attempt (no-op, kept for history)
6. `hide_test_cases_properly` — column-level grants (effective)
7. `create_submissions` + `replace_submissions` — `submissions` table + RLS + indexes

---

## Running on Device

Native Google Sign-In requires a **development build**:

```bash
bunx expo run:android
bunx expo run:ios
# or cloud
bunx eas-cli build --profile development
```

For physical devices hitting the local API, either expose via ngrok (`@expo/ngrok` is installed) or set your LAN URL explicitly:

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:8081 bunx expo start --dev-client
```

---

## Building with EAS

| Profile | Config |
|---|---|
| `development` | `developmentClient: true`, `distribution: internal` |
| `preview` | `distribution: internal` |
| `production` | `autoIncrement: true` |

```bash
bunx eas-cli build --profile development
bunx eas-cli build --profile preview
bunx eas-cli build --profile production
bunx eas-cli submit --platform android|ios
```

- `appVersionSource: remote`, `projectId: 9399e19e-3e3b-454d-bc89-5b9811de7f39`.
- `android.package: com.saumyajha.LeetLab`, `scheme: leetlab`, `orientation: portrait`.

---

## Security Notes

- `test_cases` are **never selected client-side**. Enforced at the DB layer via column-level `GRANT`s, not just app logic. Only the service-role API route can read them.
- Client ships only `EXPO_PUBLIC_*` keys. `SUPABASE_SERVICE_ROLE_KEY` and `CODEBOX_*` stay server-side.
- Auth guards on every tab route + `401` on `/api/submit` without a valid Bearer JWT.
- `google-services.json` contains secrets — treat like `.env`.

---

## Known Placeholders

- `WeekStats` is hardcoded (`TODO: replace with real stats` from `submissions`).
- `QuickPractice → Saved` is a no-op placeholder.
- `highlight.ts` tokenizer is unused — the editor is a plain `TextInput`.
- Only Python + JavaScript snippets are seeded; Java runs on the judge but starts from an empty editor.
- No submission-history UI yet (table exists, nothing reads it).

---

## Roadmap

- [ ] Submission-history UI + retry-from-history + real `WeekStats`
- [ ] Real `difficulty` column (replace heuristic) + color-coded filters
- [ ] Saved/bookmark problems
- [ ] Streaks, XP, leaderboards
- [ ] Syntax highlighting + line numbers (wire up `highlight.ts` or an editor lib)
- [ ] Offline drafts (`expo-sqlite` plugin already enabled)
- [ ] Pagination / virtualization tuning for large libraries
- [ ] EAS Update channels
- [ ] Tests (Jest + Maestro/Detox)
- [ ] More languages (extend `LANGUAGE_ID_MAP`)
- [ ] Admin problem-creation UI

---

## Contributing

1. Fork + branch (`feat/...`, `fix/...`).
2. Use `bunx expo install <package>` for new deps (SDK-compatible).
3. Keep `src/theme.ts` ↔ `global.css` in sync.
4. Keep non-route code outside `src/app/`; routes in `src/app/` only.
5. Run before pushing:
   ```bash
   bunx expo lint
   bunx tsc --noEmit
   ```
6. Never commit `.env`, `google-services.json` secrets, or `ios/`/`android/` (CNG-generated).

Useful docs:

- Expo versioned docs for this project: `https://docs.expo.dev/versions/v55.0.0/`
- Expo LLMs index: `https://docs.expo.dev/llms.txt`
- Router: `https://docs.expo.dev/router/introduction/`
- EAS: `https://docs.expo.dev/eas/`

---

## License

No license file present. Add one (e.g. MIT) before publishing.

---

> Built with Expo SDK 55 · React 19 · Supabase · HeroUI Native. Star the repo and open issues/PRs for new problems, languages, and judge improvements.
