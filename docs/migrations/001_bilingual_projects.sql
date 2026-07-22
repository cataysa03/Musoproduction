-- Adds bilingual (Turkish/English) title and category fields to `projects`.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
--
-- The existing `title`/`category` columns are left in place untouched (not
-- read by the app anymore after this migration, but not dropped either, so
-- nothing else that might reference them breaks). They can be dropped later
-- once you've confirmed nothing else depends on them.

alter table projects
  add column if not exists title_tr text,
  add column if not exists title_en text,
  add column if not exists category_tr text,
  add column if not exists category_en text;

-- Backfill: all existing rows were created before i18n existed, so their
-- current `title`/`category` values are English content.
update projects
set
  title_en = coalesce(title_en, title),
  category_en = coalesce(category_en, category)
where title_en is null or category_en is null;
