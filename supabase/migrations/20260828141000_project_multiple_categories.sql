create table if not exists public.project_category_links (
  project_id uuid not null references public.projects(id) on delete cascade,
  category_id uuid not null references public.project_categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, category_id)
);

insert into public.project_category_links (project_id, category_id)
select id, category_id from public.projects where category_id is not null
on conflict (project_id, category_id) do nothing;

alter table public.project_category_links enable row level security;

drop policy if exists "Project category links are public" on public.project_category_links;
drop policy if exists "Admins manage project category links" on public.project_category_links;

create policy "Project category links are public"
on public.project_category_links for select
using (true);

create policy "Admins manage project category links"
on public.project_category_links for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
