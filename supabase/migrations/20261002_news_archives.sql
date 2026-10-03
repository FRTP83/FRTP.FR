-- Préparé en local ; à appliquer lors de la publication groupée approuvée.
-- Sauvegarder la table news auparavant. L'adresse de l'article reste inchangée.
begin;
alter table public.news add column if not exists is_archived boolean not null default false;
update public.news
set is_archived = true, updated_at = now()
where id = '741e7780-bc4b-433d-be5d-bbd65d4fc366'
  and slug = 'fermeture-estivale-de-frtp'
  and created_at < '2026-08-24T00:00:00+02:00';
commit;
