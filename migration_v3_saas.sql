-- 1. Crear tabla de Tiendas (Shops)
create table if not exists public.shops (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,
  name text not null,
  slogan text,
  -- Configuración estética
  theme_id int default 1 check (theme_id between 1 and 5),
  title_color text default '#000000',
  slogan_color text default '#666666',
  decorations jsonb default '{"emojis": [], "packs": []}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en shops
alter table public.shops enable row level security;

create policy "Cualquiera puede ver tiendas" on public.shops for select using (true);
create policy "Los dueños pueden editar su tienda" on public.shops for all using ( auth.uid() = owner_id );

-- 2. Modificar tablas existentes para agregar shop_id
alter table public.categories add column if not exists shop_id uuid references public.shops(id) on delete cascade;
alter table public.sponges add column if not exists shop_id uuid references public.shops(id) on delete cascade;
alter table public.fillings add column if not exists shop_id uuid references public.shops(id) on delete cascade;
alter table public.products add column if not exists shop_id uuid references public.shops(id) on delete cascade;

-- 3. Actualizar políticas RLS para filtrar por shop_id
-- (Eliminamos las viejas y creamos las nuevas basadas en shop_id o perfil de dueño)

drop policy if exists "Público ve categorias" on public.categories;
create policy "Público ve categorias de la tienda" on public.categories for select using (true);
create policy "Dueños editan sus categorias" on public.categories for all using (
  exists (select 1 from public.shops where id = public.categories.shop_id and owner_id = auth.uid())
);

drop policy if exists "Público ve bizcochuelos" on public.sponges;
create policy "Público ve bizcochuelos de la tienda" on public.sponges for select using (true);
create policy "Dueños editan sus bizcochuelos" on public.sponges for all using (
  exists (select 1 from public.shops where id = public.sponges.shop_id and owner_id = auth.uid())
);

drop policy if exists "Público ve rellenos" on public.fillings;
create policy "Público ve rellenos de la tienda" on public.fillings for select using (true);
create policy "Dueños editan sus rellenos" on public.fillings for all using (
  exists (select 1 from public.shops where id = public.fillings.shop_id and owner_id = auth.uid())
);

drop policy if exists "Público ve productos" on public.products;
create policy "Público ve productos de la tienda" on public.products for select using (true);
create policy "Dueños editan sus productos" on public.products for all using (
  exists (select 1 from public.shops where id = public.products.shop_id and owner_id = auth.uid())
);
