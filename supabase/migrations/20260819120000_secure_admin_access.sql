-- Accès d'administration FRTP
-- Cette migration est idempotente et peut être rejouée sans créer de doublons.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

-- Le compte Auth FRTP existant devient administrateur. Si le compte est créé
-- après cette migration, rejouer uniquement cet INSERT suffit.
insert into public.admins (user_id)
select id
from auth.users
where lower(email) = lower('contact@frtp.fr')
on conflict (user_id) do nothing;

drop policy if exists "Admins read admins" on public.admins;
create policy "Admins read admins"
on public.admins for select
to authenticated
using (user_id = auth.uid());

-- Suppression des anciennes règles trop larges.
drop policy if exists "Authenticated users manage projects" on public.projects;
drop policy if exists "Authenticated users manage project images" on public.project_images;
drop policy if exists "Authenticated users manage news" on public.news;
drop policy if exists "Authenticated users manage categories" on public.project_categories;
drop policy if exists "Authenticated users manage site settings" on public.site_settings;
drop policy if exists "Authenticated users read contact requests" on public.contact_requests;
drop policy if exists "Authenticated users update contact requests" on public.contact_requests;
drop policy if exists "Service role inserts contact requests" on public.contact_requests;

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
on public.projects for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage project images" on public.project_images;
create policy "Admins manage project images"
on public.project_images for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage news" on public.news;
create policy "Admins manage news"
on public.news for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage categories" on public.project_categories;
create policy "Admins manage categories"
on public.project_categories for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read contact requests" on public.contact_requests;
create policy "Admins read contact requests"
on public.contact_requests for select to authenticated
using (public.is_admin());

drop policy if exists "Admins update contact requests" on public.contact_requests;
create policy "Admins update contact requests"
on public.contact_requests for update to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Les anciens droits d'écriture génériques du stockage sont également retirés.
drop policy if exists "Authenticated users upload project images" on storage.objects;
drop policy if exists "Authenticated users update project images" on storage.objects;
drop policy if exists "Authenticated users delete project images" on storage.objects;
drop policy if exists "Authenticated users upload news images" on storage.objects;
drop policy if exists "Authenticated users update news images" on storage.objects;
drop policy if exists "Authenticated users delete news images" on storage.objects;
drop policy if exists "Authenticated users upload site assets" on storage.objects;
drop policy if exists "Authenticated users update site assets" on storage.objects;
drop policy if exists "Authenticated users delete site assets" on storage.objects;

drop policy if exists "Admins upload project images" on storage.objects;
create policy "Admins upload project images"
on storage.objects for insert to authenticated
with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins update project images" on storage.objects;
create policy "Admins update project images"
on storage.objects for update to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins delete project images" on storage.objects;
create policy "Admins delete project images"
on storage.objects for delete to authenticated
using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins upload news images" on storage.objects;
create policy "Admins upload news images"
on storage.objects for insert to authenticated
with check (bucket_id = 'news-images' and public.is_admin());

drop policy if exists "Admins update news images" on storage.objects;
create policy "Admins update news images"
on storage.objects for update to authenticated
using (bucket_id = 'news-images' and public.is_admin())
with check (bucket_id = 'news-images' and public.is_admin());

drop policy if exists "Admins delete news images" on storage.objects;
create policy "Admins delete news images"
on storage.objects for delete to authenticated
using (bucket_id = 'news-images' and public.is_admin());

drop policy if exists "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins update site assets" on storage.objects;
create policy "Admins update site assets"
on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and public.is_admin())
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins delete site assets" on storage.objects;
create policy "Admins delete site assets"
on storage.objects for delete to authenticated
using (bucket_id = 'site-assets' and public.is_admin());
