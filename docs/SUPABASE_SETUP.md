# Supabase Setup — WashGo Phase 1

This covers the manual setup needed to run WashGo against a real Supabase
backend. Without it, the app runs fine in **mock mode** (the default) —
nothing below is required to keep developing the prototype.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose an organization, name it (e.g. `washgo`),
   set a database password (save it somewhere safe — you won't need it for
   the app, only for direct DB access), and pick a region close to Siem Reap
   (e.g. Singapore).
3. Wait for provisioning to finish (a couple of minutes).

## 2. Find your project URL and anon key

In the Supabase dashboard: **Project Settings → API**.

- **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
- **anon / public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **Never** use the **service_role** key in this app. It bypasses Row Level
Security and must never ship inside a mobile client. It has no use in this
codebase at all — Phase 1 only ever uses the anon key.

## 3. Create `.env`

From the project root (PowerShell):

```powershell
Copy-Item .env.example .env
```

Edit `.env` and fill in the two values from step 2:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
EXPO_PUBLIC_DATA_SOURCE=supabase
```

`.env` is git-ignored — it will not be committed.

Restart the Expo dev server after editing `.env` (environment variables are
read at bundle time):

```powershell
npx expo start -c
```

## 4. Run the SQL migration

In the Supabase dashboard: **SQL Editor → New query**. Paste the full
contents of [`supabase/migrations/001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql)
and click **Run**.

This creates every Phase-1-and-beyond table (`profiles`, `addresses`,
`laundries`, `laundry_services`, `orders`, `order_items`,
`order_status_history`, `notifications`, `payments`, `favorites`), the
`profiles` row-creation trigger, and all Row Level Security policies.

If you prefer the Supabase CLI instead of the dashboard:

```powershell
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## 5. Configure authentication

In the dashboard: **Authentication → Providers → Email** should already be
enabled by default — that's all Phase 1 needs (email + password).

### Email confirmation

**Authentication → Sign In / Providers → Email** has a "Confirm email"
toggle.

- **For local development**, it's fine to **turn email confirmation off** so
  `signUp` immediately returns an active session and you can test the full
  flow without checking an inbox.
- **Before shipping to real users**, turn it back **on** so accounts can't be
  created with someone else's email address.

## 6. Switching between mock and Supabase modes

Controlled entirely by `EXPO_PUBLIC_DATA_SOURCE` in `.env`:

```env
EXPO_PUBLIC_DATA_SOURCE=mock       # default — src/data/mock, no network calls
EXPO_PUBLIC_DATA_SOURCE=supabase   # real auth, profiles, addresses
```

Restart Expo (`npx expo start -c`) after changing it. If `EXPO_PUBLIC_DATA_SOURCE`
is missing or set to anything else, the app falls back to `mock` and logs a
warning in dev.

## 7. Regenerating TypeScript database types

[`src/types/database.ts`](../src/types/database.ts) was hand-written to
match the migration SQL, and is marked in a comment as needing
regeneration. Once your project is linked, regenerate it from the real
schema:

```powershell
npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
```

Re-run this any time the schema changes. The hand-written version only
includes `Insert`/`Update` shapes for the tables Phase 1 actually writes to
(`addresses`, `profiles`) — regeneration will need those narrowed back down
if you want to keep write access restricted to safe fields, since Supabase's
generator produces full-table Insert/Update types.

## 8. Security notes

- The service-role key is never referenced anywhere in this app — don't add
  it.
- Row Level Security is enabled on every table; there is no `using (true)`
  policy anywhere in the migration.
- `profiles.role` cannot be changed by the client: a trigger
  (`profiles_prevent_role_change`) silently reverts any client-attempted
  role change, and new accounts are always created with `role = 'customer'`
  regardless of what a client sends at sign-up.
- Setting a default address goes through the `set_default_address()` Postgres
  function (called via `.rpc(...)`) so "unset the old default, set the new
  one" happens atomically, respecting the same RLS policies as a normal
  update.

## 9. Manual test flow

### Mock mode

```text
Set EXPO_PUBLIC_DATA_SOURCE=mock (or leave it unset)
→ npx expo start
→ Login (any input passing local validation)
→ Navigate through the customer app
→ Edit Profile — shows the "Changes saved" banner, nothing persisted
→ Manage Addresses — same mock list as before
→ Log Out
```

### Supabase mode

```text
Complete steps 1-5 above, set EXPO_PUBLIC_DATA_SOURCE=supabase
→ npx expo start -c
→ Register a customer (full name, email, phone, password)
→ In the Supabase dashboard: Table Editor → profiles — confirm a row was
  created for the new user, with role = customer
→ Sign in
→ Personal Information → edit name/phone → Save Changes → confirm the
  "Changes saved" banner and that profiles.full_name / phone updated in
  the dashboard
→ Restart the app (Reload in Expo dev tools) → confirm you're still signed
  in and the profile still loads (session persisted via AsyncStorage)
→ Saved Addresses → Add Address → confirm it appears in the addresses table
→ Set an address as default → confirm exactly one row has is_default = true
  for that user
→ Edit an address → Delete an address (with confirmation)
→ Create a second Supabase user and confirm it cannot see the first user's
  addresses or profile (RLS)
→ Log Out → confirm the back gesture from /login cannot reopen (tabs)
```

## Current limitations (Phase 1)

- Orders, notifications, payments, laundries/services, favorites, and
  riders have schema + RLS but are **not** wired into the app — those
  screens still use `src/data/mock`.
- Sign-in/sign-up is email + password only; the login screen's "Phone or
  Email" field only accepts an email in Supabase mode.
- Password reset has a service method (`authService.requestPasswordReset`)
  but no screen calls it yet.
- Avatar upload has a profile-service method (`updateAvatarUrl`) but no
  image picker/upload flow yet.
- The Profile tab's summary card reads the live profile in Supabase mode,
  but most other screens (Favorites, Notifications, Orders, Payment
  Methods) are unaffected by this phase and still show mock data.

## Recommended next phase

Wire up Favorites and Notifications (both already have schema + RLS and are
comparatively low-risk since they're single-owner tables like `addresses`),
then Orders — which needs the order-creation flow, `order_items`, and a
secure way to advance `order_status` (a Postgres function or edge function,
since customers intentionally have no direct UPDATE policy on `orders` in
this phase).
