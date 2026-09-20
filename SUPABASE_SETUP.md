# Supabase Setup

The repository already contains the schema, privacy policies, anonymous sign-in,
answer persistence, and realtime message client. The site stays in local demo
mode until the two public Supabase values are configured.

## Dashboard Steps

1. Create a free project at <https://supabase.com/dashboard>.
2. Open **Authentication > Providers > Anonymous Sign-Ins** and enable it.
3. Open **SQL Editor** and run the migrations in order: first
   `supabase/migrations/001_sidequest.sql`, then
   `supabase/migrations/002_friends.sql`, then
   `supabase/migrations/003_fix_circle_codes.sql`, then
   `supabase/migrations/004_shared_circles_and_answers.sql`, then
   `supabase/migrations/005_circle_daily_stats.sql`, then
   `supabase/migrations/006_fix_answer_saving.sql`.
4. Open **Project Settings > API** and copy the project URL and publishable
   `anon` key. Never use the `service_role` key in this website.

## Configure The Site

From the project directory, run:

```bash
SUPABASE_URL="https://YOUR_PROJECT.supabase.co" \
SUPABASE_ANON_KEY="YOUR_PUBLISHABLE_ANON_KEY" \
node scripts/configure-supabase.mjs
```

Then commit `dist/config.js`, push, and redeploy the site.

## Test With Two People

1. Open the deployed site in a fresh browser. It anonymously signs in.
2. Create a circle and copy its six-character invite code.
3. Send the second tester this link, replacing the example code:

   `https://YOUR-SITE.example/?circle=ABC123#today`

4. Open that link in another browser or private window.
5. Submit answers and send messages from both windows. Messages should appear
   without refreshing; circle answers are protected by database policy until
   each person submits their own answer.

## What Is Already Implemented

- Anonymous Supabase Auth sessions
- User profiles
- Searchable usernames, friend requests, and accepting friends
- Circle creation and invite-code joining
- Daily fun and reflective questions
- Answer persistence and answer-before-reveal Row Level Security
- Circle messages and Realtime subscriptions
- Local-mode fallback when Supabase is unavailable

## Next Integration Work

The current UI still displays sample data in parts of History. After the
two-browser smoke test, replace those samples with queries from `answers`.
Do not add notifications or production email authentication until the shared
answer and message loop is stable.
