-- ============================================================================
-- VOCANOVA · Supabase (EU Region, e.g. Frankfurt eu-central-1) Schema
-- Stores voluntary Google (Gmail) user profiles, GDPR newsletter opt-in flag,
-- synced FSRS-5 memory states, gameplay progress, and personal Anki decks.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vocanova_users (
  google_sub TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',

  -- Separate explicit GDPR Art. 6(1)(a) consent for email updates/newsletters
  marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_opt_in_at TIMESTAMPTZ,

  -- Pilot summary metrics
  native_lang TEXT DEFAULT 'ru',
  target_lang TEXT DEFAULT 'de',
  high_score INTEGER NOT NULL DEFAULT 0,
  learned_count INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 1,

  -- Cloud backups (JSONB)
  fsrs_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  progress_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  anki_decks_json JSONB NOT NULL DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security with no public anon policy:
-- Only Vercel Serverless Functions using SUPABASE_SERVICE_ROLE_KEY can read/write.
ALTER TABLE public.vocanova_users ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_vocanova_users_email ON public.vocanova_users (email);
CREATE INDEX IF NOT EXISTS idx_vocanova_users_marketing ON public.vocanova_users (marketing_opt_in)
  WHERE marketing_opt_in = TRUE;

-- Quick GDPR export query for users who explicitly opted into newsletters:
-- SELECT email, display_name, native_lang, target_lang, marketing_opt_in_at
-- FROM public.vocanova_users
-- WHERE marketing_opt_in = TRUE
-- ORDER BY marketing_opt_in_at DESC;
