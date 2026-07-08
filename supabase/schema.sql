create extension if not exists "pgcrypto";

create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  city text,
  category_id uuid references public.project_categories(id) on delete set null,
  short_description text,
  description text,
  initial_problem text,
  works_done text,
  client_type text,
  work_date date,
  duration text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  image_type text not null check (image_type in ('before', 'during', 'after', 'gallery')),
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  city text,
  work_type text,
  message text not null,
  status text not null default 'nouveau' check (status in ('nouveau', 'traite', 'archive')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Contrôle d'accès administrateur
-- ----------------------------------------------------------------------------
-- Auparavant, toutes les politiques accordaient un accès complet au rôle
-- "authenticated" (tout compte connecté). On restreint désormais la gestion
-- aux comptes explicitement listés dans la table "admins".
--
-- Après avoir exécuté ce schéma, ajouter votre compte admin :
--   insert into public.admins (user_id)
--   values ('<UUID du compte créé dans Supabase Auth>');
-- ============================================================================

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

insert into public.project_categories (name, slug, description)
values
  ('Terrassement', 'terrassement', 'Decaissement, fouilles, plateformes et modelage de terrain.'),
  ('VRD', 'vrd', 'Voiries, reseaux divers et raccordements techniques.'),
  ('Assainissement', 'assainissement', 'Eaux usees, eaux pluviales, drainage et conformite.'),
  ('Voirie', 'voirie', 'Acces, parkings, bordures, enrobes et reprises.'),
  ('Reseaux', 'reseaux', 'Reseaux secs, humides, telecom et electricite.'),
  ('Amenagements exterieurs', 'amenagements-exterieurs', 'Abords, cours, cheminements et finitions.'),
  ('Demolition / reprise', 'demolition-reprise', 'Depose, reprise de malfacons et remise en securite.')
on conflict (slug) do nothing;

alter table public.admins enable row level security;
alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.news enable row level security;
alter table public.contact_requests enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Published projects are public" on public.projects;
drop policy if exists "Published news are public" on public.news;
drop policy if exists "Categories are public" on public.project_categories;
drop policy if exists "Project images are public" on public.project_images;
drop policy if exists "Authenticated users manage projects" on public.projects;
drop policy if exists "Authenticated users manage project images" on public.project_images;
drop policy if exists "Authenticated users manage news" on public.news;
drop policy if exists "Authenticated users manage categories" on public.project_categories;
drop policy if exists "Authenticated users manage site settings" on public.site_settings;
drop policy if exists "Authenticated users read contact requests" on public.contact_requests;
drop policy if exists "Authenticated users update contact requests" on public.contact_requests;
drop policy if exists "Service role inserts contact requests" on public.contact_requests;
drop policy if exists "Admins manage projects" on public.projects;
drop policy if exists "Admins manage project images" on public.project_images;
drop policy if exists "Admins manage news" on public.news;
drop policy if exists "Admins manage categories" on public.project_categories;
drop policy if exists "Admins manage site settings" on public.site_settings;
drop policy if exists "Admins read contact requests" on public.contact_requests;
drop policy if exists "Admins update contact requests" on public.contact_requests;
drop policy if exists "Admins read admins" on public.admins;

-- Lecture publique : uniquement les contenus publiés.
create policy "Published projects are public"
on public.projects for select
using (is_published = true);

create policy "Published news are public"
on public.news for select
using (is_published = true);

create policy "Categories are public"
on public.project_categories for select
using (true);

create policy "Project images are public"
on public.project_images for select
using (true);

-- Gestion : réservée aux administrateurs (table public.admins).
create policy "Admins read admins"
on public.admins for select
to authenticated
using (user_id = auth.uid());

create policy "Admins manage projects"
on public.projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage project images"
on public.project_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage news"
on public.news for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage categories"
on public.project_categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage site settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins read contact requests"
on public.contact_requests for select
to authenticated
using (public.is_admin());

create policy "Admins update contact requests"
on public.contact_requests for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- L'insertion des demandes de contact se fait côté serveur via la clé service
-- role (route /api/contact), qui contourne RLS. Aucune politique d'insertion
-- publique n'est donc nécessaire : on évite ainsi qu'un visiteur insère
-- directement dans la table avec la clé anonyme.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users upload project images" on storage.objects;
drop policy if exists "Authenticated users update project images" on storage.objects;
drop policy if exists "Authenticated users delete project images" on storage.objects;
drop policy if exists "Project images are publicly readable" on storage.objects;
drop policy if exists "Authenticated users upload news images" on storage.objects;
drop policy if exists "Authenticated users update news images" on storage.objects;
drop policy if exists "Authenticated users delete news images" on storage.objects;
drop policy if exists "News images are publicly readable" on storage.objects;
drop policy if exists "Authenticated users upload site assets" on storage.objects;
drop policy if exists "Authenticated users update site assets" on storage.objects;
drop policy if exists "Authenticated users delete site assets" on storage.objects;
drop policy if exists "Site assets are publicly readable" on storage.objects;
drop policy if exists "Admins upload project images" on storage.objects;
drop policy if exists "Admins update project images" on storage.objects;
drop policy if exists "Admins delete project images" on storage.objects;
drop policy if exists "Admins upload news images" on storage.objects;
drop policy if exists "Admins update news images" on storage.objects;
drop policy if exists "Admins delete news images" on storage.objects;
drop policy if exists "Admins upload site assets" on storage.objects;
drop policy if exists "Admins update site assets" on storage.objects;
drop policy if exists "Admins delete site assets" on storage.objects;

create policy "Admins upload project images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images' and public.is_admin());

create policy "Admins update project images"
on storage.objects for update
to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

create policy "Admins delete project images"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images' and public.is_admin());

create policy "Project images are publicly readable"
on storage.objects for select
using (bucket_id = 'project-images');

create policy "Admins upload news images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'news-images' and public.is_admin());

create policy "Admins update news images"
on storage.objects for update
to authenticated
using (bucket_id = 'news-images' and public.is_admin())
with check (bucket_id = 'news-images' and public.is_admin());

create policy "Admins delete news images"
on storage.objects for delete
to authenticated
using (bucket_id = 'news-images' and public.is_admin());

create policy "News images are publicly readable"
on storage.objects for select
using (bucket_id = 'news-images');

create policy "Admins upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets' and public.is_admin());

create policy "Admins update site assets"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets' and public.is_admin())
with check (bucket_id = 'site-assets' and public.is_admin());

create policy "Admins delete site assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_admin());

create policy "Site assets are publicly readable"
on storage.objects for select
using (bucket_id = 'site-assets');
