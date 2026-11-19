-- ============================================================================
-- TIENDAZAP STUDIO — ETAPA 3: ESQUEMA COMPLETO DE SUPABASE
-- Copia y pega este script en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. EXTENSIONES
create extension if not exists pgcrypto;

-- 2. PERFILES DE PROPIETARIOS Y SUPER-ADMIN
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'merchant' check (role in ('merchant', 'superadmin')),
  created_at timestamptz not null default now()
);

-- 3. TIENDAS (SLUG Y NOMBRE ÚNICOS A NIVEL GLOBAL)
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  preset text not null default 'general',
  phone text,
  currency text not null default 'S/',
  config jsonb not null default '{}'::jsonb,
  categories jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists stores_slug_lower_uidx on public.stores (lower(slug));
create unique index if not exists stores_name_lower_uidx on public.stores (lower(name));
create index if not exists stores_owner_idx on public.stores (owner_id);

-- 4. CATÁLOGOS INDEPENDIENTES POR TIENDA
create table if not exists public.catalogs (
  id text primary key,
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists catalogs_store_slug_uidx on public.catalogs (store_id, lower(slug));

-- 5. PRODUCTOS
create table if not exists public.products (
  id text primary key,
  store_id uuid not null references public.stores(id) on delete cascade,
  catalog_id text not null default 'cat_main',
  sku text,
  name text not null,
  category text not null default 'General',
  price numeric(12,2) not null default 0,
  currency text not null default 'S/',
  description text,
  listing_type text not null default 'item',
  condition text,
  location text,
  specs jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  video_url text,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  promo boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_store_idx on public.products (store_id);

-- 6. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.catalogs enable row level security;
alter table public.products enable row level security;

-- Helper para verificar si el usuario actual es superadmin
create or replace function public.is_superadmin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  );
$$;

-- Políticas de profiles
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_superadmin());

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- Políticas de stores
drop policy if exists "stores_public_read" on public.stores;
create policy "stores_public_read" on public.stores
  for select using (is_active = true or auth.uid() = owner_id or public.is_superadmin());

drop policy if exists "stores_owner_insert" on public.stores;
create policy "stores_owner_insert" on public.stores
  for insert with check (auth.uid() = owner_id);

drop policy if exists "stores_owner_update" on public.stores;
create policy "stores_owner_update" on public.stores
  for update using (auth.uid() = owner_id or public.is_superadmin());

drop policy if exists "stores_owner_delete" on public.stores;
create policy "stores_owner_delete" on public.stores
  for delete using (auth.uid() = owner_id or public.is_superadmin());

-- Políticas de catalogs
drop policy if exists "catalogs_public_read" on public.catalogs;
create policy "catalogs_public_read" on public.catalogs
  for select using (true);

drop policy if exists "catalogs_owner_write" on public.catalogs;
create policy "catalogs_owner_write" on public.catalogs
  for all using (
    exists (
      select 1 from public.stores s
      where s.id = catalogs.store_id and (s.owner_id = auth.uid() or public.is_superadmin())
    )
  )
  with check (
    exists (
      select 1 from public.stores s
      where s.id = catalogs.store_id and (s.owner_id = auth.uid() or public.is_superadmin())
    )
  );

-- Políticas de products
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

drop policy if exists "products_owner_write" on public.products;
create policy "products_owner_write" on public.products
  for all using (
    exists (
      select 1 from public.stores s
      where s.id = products.store_id and (s.owner_id = auth.uid() or public.is_superadmin())
    )
  )
  with check (
    exists (
      select 1 from public.stores s
      where s.id = products.store_id and (s.owner_id = auth.uid() or public.is_superadmin())
    )
  );

-- 7. STORAGE BUCKET PARA FOTOS, LOGOS, PORTADAS Y VIDEOS
insert into storage.buckets (id, name, public)
values ('tiendazap-media', 'tiendazap-media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'tiendazap-media');

drop policy if exists "media_auth_insert" on storage.objects;
create policy "media_auth_insert" on storage.objects
  for insert with check (bucket_id = 'tiendazap-media' and auth.role() = 'authenticated');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete" on storage.objects
  for delete using (bucket_id = 'tiendazap-media' and auth.uid() = owner);


-- 8. PERMISOS DE TABLAS PARA ROLES ANON Y AUTHENTICATED (REQUERIDO PARA EVALUAR RLS)
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;

alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on routines to anon, authenticated;
