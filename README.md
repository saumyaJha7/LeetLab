# LeetLab — LeetCode in Your Pocket

> A mobile-first LeetCode clone built with **Expo + React Native + Supabase**. Browse a curated problem library, read statements with examples / hints / constraints, write code in an in-app editor, and submit to a server-side judge that runs hidden test cases and returns per-case verdicts.

- **Stack:** Expo SDK 55 · Expo Router · React 19 · React Native 0.83 · TypeScript · HeroUI Native + Tailwind v4 + Uniwind · Supabase (Auth + Postgres + RLS) · expo-server API · CodeBox / Judge0-compatible execution · EAS Build
- **Platforms:** Android · iOS · Web (static)
- **Theme:** Dark-only minimal — Emerald `#00D09E` primary, Sky `#4DABF7` links, Amber `#FFB800` medium, Coral `#FF6B6B` hard

---

## Table of Contents

- [Features](#features)
- [Demo / Screenshots](#demo--screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Routes & Navigation](#routes--navigation)
- [Database Schema](#database-schema)
- [Auth Flow](#auth-flow)
- [Code Execution (Judge)](#code-execution-judge)
- [Theming & Design System](#theming--design-system)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Supabase Setup](#supabase-setup)
- [Running on Device](#running-on-device)
- [Building with EAS](#building-with-eas)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Problem Library
- Full problem list with `FlatList`, live count (`X of Y`), pull-to-retry.
- Full-text search (`SearchField`) across titles.
- Tag filter chips (`All + tags`) with frequency-derived tags and haptic feedback.
- `Loading / Error / Empty` states with retry and clear-filters actions.

### Problem Detail
- Title, tags, languages, acceptance rate.
- `Description`, `Examples` (monospace Input/Output/Explanation cards), `Hints`, `Constraints`.
- CTA to open the code editor with the problem pre-loaded.

### In-App Code Editor + Judge
- Language picker (`Select` + bottom-sheet, `snapPoints 40%`): `javascript`, `python`, `java`.
- Auto-loaded `code_snippets[lang]` starter code; smart-swap only if editor untouched.
- Monospace multiline `TextInput` in `KeyboardAvoidingView`.
- Submit → running spinner → verdict card:
  - `Accepted` / `Wrong Answer` / `Error`
  - `passed / total`, per-case icons, execution time, `expected vs got`.
  - Error banner with Retry.

### Home
- Time-aware greeting (`Good morning/afternoon/evening, {name}`) + date eyebrow.
- `Suggested for you` preview (first 3 problems) + `View all`.
- `Problem library` card with live total count → browse CTA.

### Auth
- Email/password login + signup (validation: non-empty, `password >= 6`, `confirm == password`).
- Google Sign-In (native → Supabase `signInWithIdToken({ provider: 'google' })`).
- Forgot password via `resetPasswordForEmail`.
- Auto-profile creation via Postgres trigger.
- Protected routes with redirects; persisted session via AsyncStorage.

### Profile
- Avatar (image or initials fallback) + name + email.
- `Account` section: email + member-since.
- Danger-soft sign-out with spinner → redirect to login.

---

## Demo / Screenshots

> Add screenshots/GIFs here.

```text
docs/
  screenshots/
    home.png
    problems.png
    detail.png
    editor.png
    verdict.png
    auth.png
```

Suggested capture flow: `Login → Home → Problems (search/filter) → Detail → Editor → Verdict`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| App framework | Expo `~55.0.31`, React `19.2.0`, React Native `0.83.10` |
| Routing | Expo Router `~55.0.18` (file-based, typed routes, React Compiler) |
| UI kit | `heroui-native ^1.0.10` — Button, Input, TextField, SearchField, Select, Card, Chip, Avatar, Spinner |
| Styling | `tailwindcss ^4.3.3` + `uniwind ^1.12` + `tailwind-merge` / `tailwind-variants` |
| Animation / gestures | `react-native-reanimated 4.2.1`, `react-native-worklets`, `react-native-gesture-handler`, `expo-haptics`, `@gorhom/bottom-sheet` |
| Navigation primitives | `@react-navigation/bottom-tabs`, `native`, `elements` (consumed by Expo Router) |
| Icons / media | `@expo/vector-icons` (Ionicons), `expo-image`, `expo-font`, `expo-symbols`, `expo-glass-effect` |
| Backend | `@supabase/supabase-js ^2.116`, Supabase Auth + Postgres + RLS |
| Server API | `expo-server ~55.0.12` (`src/app/api/submit+api.ts`) |
| Judge | CodeBox / Judge0-compatible (`CODEBOX_URL`, `CODEBOX_API_TOKEN`), Judge0 language IDs `js:63, py:71, java:62` |
| Auth native | `@react-native-google-signin/google-signin ^16.1.5` + `google-services.json` |
| Storage / utils | `@react-native-async-storage/async-storage`, `react-native-url-polyfill`, `expo-constants`, `expo-linking`, `expo-status-bar`, `expo-splash-screen`, `expo-system-ui`, `expo-web-browser`, `expo-device`, `expo-sqlite` (plugin enabled) |
| Web | `react-dom`, `react-native-web`, `react-native-svg` |
| Dev / tooling | TypeScript `~5.9`, ESLint + `eslint-config-expo`, Supabase CLI `^2.118`, EAS CLI, Bun (`bun.lock`) |

---

## Architecture

```text
┌─────────────────────────────┐
│  Expo App (src/app/)        │
│  Tabs: Home / Problems /    │
│  Detail / Editor / Profile  │
│  + (auth) Login / Signup    │
└──────────────┬──────────────┘
               │ Supabase JS (anon/publishable)
               │  - auth.signIn / signUp
               │  - from('problems').select (no test_cases)
               │  - from('profiles').select/update own row
               ▼
┌─────────────────────────────┐      ┌──────────────────────┐
│  Supabase                   │      │ expo-server API      │
│  - Auth (email + Google)    │      │ POST /api/submit     │
│  - Postgres + RLS           │◄─────│  Bearer JWT →        │
│  - profiles / problems      │ svc  │  getUser → fetch     │
│    (test_cases hidden)      │ role │  test_cases → CodeBox│
└─────────────────────────────┘      └──────────┬───────────┘
                                                │ POST /submissions?wait=true
                                                ▼
                                     ┌──────────────────────┐
                                     │ CodeBox / Judge0     │
                                     │ cpu 5s, mem 256MB    │
                                     │ stdin/stdout compare │
                                     └──────────────────────┘
```

- **No Edge Functions.** Server logic lives in `src/app/api/submit+api.ts` via `expo-server`.
- **No global store.** `AuthContext` for session; `useProfile`, `useProblemList`, `useProblem`, `useGoogleAuth` encapsulate data; screen-local `useState` for UI.
- **Continuous Native Generation.** No `ios/` / `android/` dirs — native config via `app.json` + config plugins.

---

## Project Structure

```text
LeetLab/
  src/
    app/
      _layout.tsx                 # Root: GestureHandler + HeroUI + AuthProvider + Stack
      index.tsx                   # Entry gate: redirect → /(tabs) or /(auth)/login
      (auth)/
        _layout.tsx               # Auth stack (fade, headerless)
        login.tsx                 # Email + Google + forgot-password
        signup.tsx                # Email + confirm + Google
      (tabs)/
        _layout.tsx               # Protected tabs: Home, Problems, Profile + hidden detail/editor
        index.tsx                 # Home: greeting + suggested + library card
        problems.tsx              # Library: search + tag filter + FlatList
        profile.tsx               # Avatar + account + sign-out (via components/profile)
        [problemId]/
          index.tsx               # Detail: description/examples/hints/constraints
          codeEditor.tsx          # Editor + submit + verdict UI
      api/
        submit+api.ts             # POST /api/submit — authenticated judge endpoint
    components/
      auth/
        AuthScreen.tsx            # Shared login/signup shell (brand, card, Google, footer)
        PasswordField.tsx         # Labeled password field with eye toggle
      home/
        HomeHeader.tsx            # Greeting + date
        SuggestedProblems.tsx     # 3-problem preview card
        LibraryCard.tsx           # Total count + browse CTA
      problems/
        ProblemRow.tsx            # Tappable row: title + tags + acceptance + chevron
        ProblemTags.tsx           # Chip wrap (tags/languages)
        FilterChips.tsx           # Horizontal tag filter with haptics
        ExampleBlock.tsx          # Example N card (Input/Output/Explanation)
        DetailSection.tsx         # Card wrapper (Title + children)
      editor/
        LanguageSelect.tsx        # Bottom-sheet language picker
      profile/
        ProfileHeader.tsx         # Avatar + name + email
        AccountDetails.tsx        # Email + member-since rows
        SignOutButton.tsx         # Danger-soft sign-out
      ui/
        Screen.tsx                # flex-1 + safe-area + paddingH 20
        States.tsx                # LoadingState / EmptyState / ErrorState
        SectionTitle.tsx          # 17/700 heading + optional action (currently unused)
        PressableScale.tsx        # RN Animated scale 0.97 press (not Reanimated — Fabric safety)
        EnteringView.tsx          # FadeInDown stagger (containers only)
    hooks/
      useAuth.tsx                 # AuthContext {session, loading} + onAuthStateChange
      useGoogleAuth.ts            # Google → Supabase, friendly error mapping
      useProblem.ts               # Single problem (never selects test_cases)
      useProblemList.ts           # List summaries + exact count + limit
      useProfile.ts               # Current profiles row (name, avatar_url)
    lib/
      supabase.ts                 # Client: EXPO_PUBLIC_SUPABASE_URL/KEY + AsyncStorage
      supabase-admin.ts           # Server: service_role + getUserFromRequest (Bearer)
      judge.ts                    # LANGUAGE_ID_MAP, CodeBox executor, compare, verdict
      submit.ts                   # Client submit (JWT + getApiBaseUrl via hostUri)
      run-task.ts                 # runTaskAsync wrapper for expo-server background task
      motion.ts                   # Easing/duration tokens, FadeInDown/LinearTransition
    theme.ts                      # TS design tokens (mirror of global.css)
    uniwind.d.ts                  # Generated Uniwind types (do not edit)
  supabase/
    config.toml                   # Local CLI config (project_id LeetLab)
    migrations/
      20260925000000_create_profile_on_signup.sql  # handle_new_user() trigger
      20260926000000_profiles_rls.sql              # own-row SELECT/UPDATE
      20260929171319_add_test_cases_to_problems.sql
      20260929172150_add_code_snippets_to_problems.sql
      20260929172859_hide_test_cases_from_clients.sql  # revoked (no-op, kept for history)
      20260929173248_hide_test_cases_properly.sql     # column-level grants, hides test_cases
  assets/
    images/                       # icon, favicon, splash, adaptive-icon layers, tutorial art
    expo.icon/                    # iOS icon composition source
  app.json                        # Expo config: slug LeetLab, scheme leetlab, plugins, EAS projectId
  eas.json                        # development / preview / production profiles
  global.css                      # Tailwind + Uniwind + HeroUI + dark-only vars
  metro.config.js                 # Reanimated + Uniwind Metro wrappers
  babel.config.js                 # babel-preset-expo
  tsconfig.json                   # strict, @/* → ./src/*, expo base
  eslint.config.js                # eslint-config-expo flat
  google-services.json            # Android Firebase / Google Sign-In (contains secrets — do not publish)
  package.json / bun.lock         # Deps (Bun)
```

---

## Routes & Navigation

| Route | Screen | Access |
|---|---|---|
| `/` | Redirect gate (`useAuth` → tabs or login) | Public |
| `/(auth)/login` | `WELCOME BACK / Keep your edge.` — email, password, Google, forgot-password | Guest |
| `/(auth)/signup` | `START YOUR RUN / Build your edge.` — email, password, confirm, Google | Guest |
| `/(tabs)` (Home) | Greeting, suggested (3), library count | Auth |
| `/(tabs)/problems` | Search + tag filter + full list | Auth |
| `/(tabs)/[problemId]` | Full statement + examples/hints/constraints | Auth (push, `href: null`) |
| `/(tabs)/[problemId]/codeEditor` | Language + editor + verdict | Auth (push, `href: null`) |
| `/(tabs)/profile` | Avatar, account, sign-out | Auth |
| `POST /api/submit` | Judge endpoint `{status, solved, passed, total, results}` | Auth (Bearer JWT) |

Navigation notes:

- Root `Stack` with `background: colors.background`; `(tabs)` peer-switch `animation: none`, `(auth)` `fade`.
- Tabs use Ionicons (`home-outline`, `code-slash-outline`, `person-outline`) with theme `tabBar` colors.
- Detail/editor are pushed with manual ghost back buttons, hidden from tab bar.
- `typedRoutes: true` + `reactCompiler: true` in `app.json`.

---

## Database Schema

### `profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK → `auth.users.id` | Created by `handle_new_user()` trigger |
| `name` | `text \| null` | From `raw_user_meta_data.name / full_name` |
| `avatar_url` | `text \| null` | From `raw_user_meta_data.avatar_url / picture` |

RLS: enabled. `authenticated` can `SELECT` / `UPDATE` only where `auth.uid() = id`. No `INSERT` policy (trigger owns inserts, `SECURITY DEFINER`, `ON CONFLICT DO NOTHING`).

### `problems`

| Column | Type | Notes |
|---|---|---|
| `problem_id` | `int` PK | Ordered ascending in list |
| `title` | `text` | e.g. Two Sum, Valid Parentheses |
| `description` | `text` | Full statement |
| `examples` | `jsonb` | `[{input, output, explanation?}]` — public, shown in UI |
| `tags` | `text[]` | e.g. Array, Hash Table, Stack — used for FilterChips |
| `hints` | `text[]` | Public |
| `constraints` | `text[]` | Public |
| `languages` | `text[]` | e.g. `["javascript","python"]` — drives picker default |
| `acceptance_rate` | `numeric` | Shown as `%` |
| `code_snippets` | `jsonb` | `{lang: starterCode}` — public, pre-fills editor |
| `test_cases` | `jsonb` | `[{input, output}]` — **hidden from clients**, service_role only |
| `created_at` / `updated_at` | `timestamptz` | |

Column-level grants (migration `..._hide_test_cases_properly.sql`): `REVOKE ALL` then re-`GRANT SELECT/INSERT/UPDATE` on every column **except** `test_cases` (+ `DELETE, REFERENCES, TRIGGER, TRUNCATE`). Earlier `REVOKE SELECT(test_cases)` attempt was a no-op and is kept for history.

Seeded examples:

- **Two Sum (id 1):** 5 cases, stdin `nums\ntarget` → stdout `[i,j]`.
- **Valid Parentheses (id 2):** 6 cases, stdin `s` → stdout `true/false`.
- `code_snippets` include `python` (`class Solution` + I/O boilerplate) and `javascript` (`readline` wrappers) matching the stdin/stdout contract exactly.

> No `submissions` table yet — verdicts are ephemeral and returned directly from `/api/submit`.

---

## Auth Flow

1. `AuthProvider` bootstraps `supabase.auth.getSession()` + subscribes to `onAuthStateChange` → `{ session, loading }`.
2. **Email:** `signInWithPassword` / `signUp` / `resetPasswordForEmail` (email lowercased + trimmed).
   - Signup with `!session` → email-confirmation notice; with `session` → `router.replace('/(tabs)')`.
3. **Google:** `GoogleSignin.configure(webClientId)` → `hasPlayServices()` → `signIn()` → `idToken` → `supabase.auth.signInWithIdToken({ provider: 'google', token })`. Maps `IN_PROGRESS / PLAY_SERVICES_NOT_AVAILABLE / SIGN_IN_CANCELLED / DEVELOPER_ERROR` to friendly messages; silent `null` on user-cancel.
4. **Trigger:** `on_auth_user_created_profiles` inserts `profiles` row automatically.
5. **Guards:** `src/app/index.tsx` + `src/app/(tabs)/_layout.tsx` redirect to `/(auth)/login` when `!session` and not loading. Login/signup `replace(/(tabs))` on success. Sign-out `replace(/(auth)/login)`.
6. **Submit auth:** client reads `session.access_token` → `Authorization: Bearer <jwt>` → server `auth.getUser(token)` → `401` if missing/invalid.

---

## Code Execution (Judge)

**Client** (`src/lib/submit.ts` + `codeEditor.tsx`):

```ts
submitSolution({ problemId, language, sourceCode })
→ POST {apiBase}/api/submit { problemId, sourceCode, language }
→ headers { Authorization: `Bearer ${session.access_token}` }
```

`getApiBaseUrl()`: uses `EXPO_PUBLIC_API_URL` if set, else `http://{hostUri}` from `expo-constants` (dev-server IP for physical devices via dev-client + ngrok).

**Server** (`src/app/api/submit+api.ts`):

1. Parse + validate `problemId: int`, `sourceCode: string`, `language: 'javascript' | 'python' | 'java'`.
2. `getUserFromRequest()` — case-insensitive `Bearer` parse → `auth.getUser(token)`.
3. Fetch `test_cases` with **service_role** (bypasses RLS — only place that can see hidden column).
4. `runTaskAsync(runAllTestCases)` against CodeBox.

**Judge core** (`src/lib/judge.ts`):

- `LANGUAGE_ID_MAP = { javascript: 63, python: 71, java: 62 }` (Judge0 IDs).
- `POST {CODEBOX_URL}/submissions?wait=true { language_id, source_code, stdin, expected_output, cpu_time_limit: 5s, memory_limit: 256MB }`.
- `toCaseResult`: normalized trim + CRLF compare; Judge0 status `id 3/4 → accepted / wrong-answer`, else `error`.
- `runAllTestCases`: `Promise.all` over cases → `overallStatus` → `{ status, solved, passed, total, results }`.

No submission history is persisted — add a `submissions` table if you need leaderboards/streaks.

---

## Theming & Design System

Dark-only lock: identical vars in `@variant light` and `@variant dark` in `global.css` so system preference never changes the UI. Single source of truth for hex is `src/theme.ts` — keep the two in sync.

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0F1115` | Screen bg |
| `foreground` | `#F3F8FF` | Primary text |
| `muted` | `#8B95A5` | Secondary text |
| `surface` | `#1A1D24` | Cards |
| `surface-secondary` | `#22262F` | Example blocks, chips |
| `border` | `#2A2E39` | Field borders, dividers |
| `primary` / `success` / `accent` | `#00D09E` Emerald | CTA, accepted, focus |
| `secondary` / `link` | `#4DABF7` Sky | Links, secondary actions |
| `warning` / `medium` | `#FFB800` Amber | Medium difficulty |
| `danger` / `hard` | `#FF6B6B` Coral | Errors, hard, sign-out |

- `radius: 8 / 12 / 16 / 20`, `spacing: 8 / 12 / 16 / 20 / 24 / 32` (`spacing.lg = 20` screen paddingH).
- HeroUI tokens: `bg-background / surface / accent / border / muted / link / danger`.
- Motion: `<300ms`, transform + opacity only; `press 120ms`, `enter 250ms FadeInDown`, `delay index*50 capped`; full `useReducedMotion` support; haptics on filter press.
- `PressableScale` uses legacy `RN Animated` (not Reanimated) due to Android Fabric crash history. `EnteringView` is containers-only, never `FlatList` rows.

---

## Getting Started

### Prerequisites

- Node 20+ + **Bun** (`bun.lock` present — use `bunx` instead of `npx`)
- Supabase project (or local via Supabase CLI + Docker)
- CodeBox / Judge0-compatible instance (`CODEBOX_URL` + `CODEBOX_API_TOKEN`)
- Google Cloud OAuth client (Web client ID) + `google-services.json` for Android
- EAS CLI for builds (`bunx eas-cli`)
- Expo Go **will not work** for Google Sign-In (native module) — use a development build

### 1. Install dependencies

```bash
# Always use expo install to resolve SDK-compatible versions
bunx expo install
# or
bun install
```

### 2. Configure environment

Copy `.env.example` (or create `.env`) — see [Environment Variables](#environment-variables).

### 3. Start the dev server

```bash
bunx expo start
```

Open in:

- Development build (`bunx expo run:android` / `bunx expo run:ios`, or EAS development build)
- Android emulator / iOS simulator
- Web: `bunx expo start --web`

### 4. Lint + typecheck (required before declaring any task done)

```bash
bunx expo lint
bunx tsc --noEmit
```

Other useful commands:

```bash
bunx expo-doctor
bunx expo install --fix
```

---

## Environment Variables

| Key | Public? | Used by | Description |
|---|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Client | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_KEY` | Yes | Client | Supabase publishable / anon key |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Yes | Client | Google OAuth web client ID for `GoogleSignin.configure()` |
| `EXPO_PUBLIC_API_URL` | Yes | Client | Override for `/api/submit` base (required for physical devices; else falls back to `hostUri`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **No — server only** | API route | Bypasses RLS to read `test_cases`. Never prefix with `EXPO_PUBLIC_` |
| `CODEBOX_URL` | **No** | API route | CodeBox base URL (falls back to `http://localhost:3000`) |
| `CODEBOX_API_TOKEN` | **No** | API route | CodeBox auth token |
| `AUTH_DB_PASSWORD` | **No** | Supabase CLI | Local DB password |

> Never commit `.env` or `google-services.json` verbatim to a public repo. The publishable key is safe to ship in the client; the service-role key must stay server-side.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `expo start` | Dev server |
| `android` | `expo start --android` | Start + open Android |
| `ios` | `expo start --ios` | Start + open iOS |
| `web` | `expo start --web` | Start + open Web |
| `lint` | `expo lint` | ESLint (expo flat config) |
| `reset-project` | `node ./scripts/reset-project.js` | Template reset (moves starter to `app-example`) |

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

1. `create_profile_on_signup` — trigger `handle_new_user()`
2. `profiles_rls` — own-row `SELECT`/`UPDATE`
3. `add_test_cases_to_problems` — `test_cases jsonb` + Two Sum / Valid Parentheses seeds
4. `add_code_snippets_to_problems` — `code_snippets jsonb` starters
5. `hide_test_cases_from_clients` — revoked attempt (historical)
6. `hide_test_cases_properly` — column-level grants (effective)

`supabase/config.toml`: `project_id LeetLab`, API `54321`, DB `54322`, shadow `54320`, Postgres 17, auth `site_url 127.0.0.1:3000`, signup enabled, `min_password 6`, confirmations off. No Edge Functions, no `seed.sql`.

---

## Running on Device

Native Google Sign-In requires a **development build**:

```bash
# Local
bunx expo run:android
bunx expo run:ios

# Or cloud
bunx eas-cli build --profile development
```

For physical devices hitting the local API:

```bash
# Option 1: expose via ngrok (@expo/ngrok is installed)
# Option 2: set your LAN URL explicitly
EXPO_PUBLIC_API_URL=http://192.168.x.x:8081 npx expo start --dev-client
```

---

## Building with EAS

`eas.json` profiles:

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
# OTA updates (no channel configured yet — add one when ready)
bunx eas-cli update --branch preview --message "..."
```

- `appVersionSource: remote`, CLI `>= 23.2.0`.
- `projectId: 9399e19e-3e3b-454d-bc89-5b9811de7f39` in `app.json`.
- `android.package: com.saumyajha.LeetLab`, `scheme: leetlab`, `orientation: portrait`.

---

## Security Notes

- `test_cases` are **never selected client-side** (`useProblem` explicitly omits them). Only the service-role API route can read them.
- Column-level `GRANT`s enforce this at the DB layer, not just app logic.
- Client ships only `EXPO_PUBLIC_*` keys. `SUPABASE_SERVICE_ROLE_KEY`, `CODEBOX_*`, and `AUTH_DB_PASSWORD` are server-only.
- Auth guards on every tab route + `401` on `/api/submit` without a valid Bearer JWT.
- `google-services.json` contains secrets — treat like `.env`.

---

## Roadmap

- [ ] `submissions` table — persist verdicts, history per user/problem
- [ ] Submission history UI + retry-from-history
- [ ] Difficulty field + color coding (Easy/Medium/Hard already partially themed)
- [ ] Streaks, XP, leaderboards
- [ ] Syntax highlighting + line numbers in editor (currently plain monospace `TextInput`)
- [ ] Offline drafts (SQLite — `expo-sqlite` plugin already enabled)
- [ ] Pagination / virtualization tuning for large libraries
- [ ] EAS Update channels (`development` / `preview` / `production`)
- [ ] Unit testing (Jest per Expo guide) + E2E (Maestro/Detox)
- [ ] More languages (C++, Go, Rust — extend `LANGUAGE_ID_MAP`)
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

- Expo versioned docs: `https://docs.expo.dev/versions/v55.0.0/` (match `expo` major in `package.json`)
- Expo LLMs index: `https://docs.expo.dev/llms.txt`
- Router: `https://docs.expo.dev/router/introduction/`
- EAS: `https://docs.expo.dev/eas/`

---

## License

No license file present. Add one (e.g. MIT) before publishing.

Default Expo template text has been replaced by this README.

---

> Built with Expo SDK 55 · React 19 · Supabase · HeroUI Native. If you find this useful, star the repo and open issues/PRs for new problems, languages, and judge improvements.
