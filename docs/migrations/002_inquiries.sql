-- Creates the `inquiries` table, which stores contact-form submissions so
-- they show up in the admin CMS (Inquiries tab), in addition to the email
-- notification sent via Resend.
--
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- if it hasn't already been applied.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  project_type text,
  other_project_type text,
  description text,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Note: RLS is left disabled here to match `projects` and `site_settings`,
-- which are also fully open to the anon key (the admin panel has no real
-- server-side auth, just a client-side password check). Since this table
-- stores personal data (name/email/message), consider enabling RLS with
-- proper policies once the admin panel has real authentication.
