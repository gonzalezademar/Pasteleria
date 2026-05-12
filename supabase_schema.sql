-- 1. Tabla de Perfiles Extendidos (se linkea con auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null check (role in ('admin', 'client')) default 'client',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en perfiles
alter table public.profiles enable row level security;
create policy "Los usuarios pueden ver su propio perfil" on public.profiles for select using ( auth.uid() = id );
create policy "Los administradores pueden ver todos los perfiles" on public.profiles for select using ( 
  (select role from public.profiles where id = auth.uid()) = 'admin' 
);

-- 2. Trigger para insertar automáticamente un perfil cuando un usuario se registra
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  is_first_user boolean;
begin
  -- Revisar si es el primer usuario de la plataforma
  select count(*) = 0 into is_first_user from public.profiles;

  insert into public.profiles (id, email, role)
  values (new.id, new.email, case when is_first_user then 'admin' else 'client' end);

  return new;
end;
$$ language plpgsql security definer;

-- Ligar el trigger a la tabla nativa auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. Tabla Categorías
create table public.categories (
  id text primary key,
  name text not null
);

-- 4. Tabla Bizcochuelos
create table public.sponges (
  id text primary key,
  name text not null,
  ingredients text not null
);

-- 5. Tabla Rellenos
create table public.fillings (
  id text primary key,
  name text not null,
  ingredients text not null
);

-- 6. Tabla Productos (Pasteles / Catálogo)
create table public.products (
  id text primary key,
  category_id text references public.categories(id) on delete cascade not null,
  name text not null,
  description text not null,
  price numeric not null,
  images text[] not null
);

-- 7. RLS (Row Level Security) para el catálogo y configuraciones
-- Permitir que CUALQUIERA (incluso sin login) pueda VER.
alter table public.categories enable row level security;
create policy "Público ve categorias" on public.categories for select using (true);
create policy "Admins modifican categorias" on public.categories for all using ( (select role from profiles where id = auth.uid()) = 'admin' );

alter table public.sponges enable row level security;
create policy "Público ve bizcochuelos" on public.sponges for select using (true);
create policy "Admins modifican bizcochuelos" on public.sponges for all using ( (select role from profiles where id = auth.uid()) = 'admin' );

alter table public.fillings enable row level security;
create policy "Público ve rellenos" on public.fillings for select using (true);
create policy "Admins modifican rellenos" on public.fillings for all using ( (select role from profiles where id = auth.uid()) = 'admin' );

alter table public.products enable row level security;
create policy "Público ve productos" on public.products for select using (true);
create policy "Admins modifican productos" on public.products for all using ( (select role from profiles where id = auth.uid()) = 'admin' );

-- (Opcional) Datos iniciales de prueba (Mocks por defecto)
insert into public.categories (id, name) values 
('cat-clasicos', 'Clásicos'), ('cat-bodas', 'Bodas'), ('cat-infantiles', 'Infantiles');

insert into public.sponges (id, name, ingredients) values 
('sponge-1', 'Vainilla Clásico', 'Harina, huevos, azúcar, esencia pura de vainilla, leche.'),
('sponge-2', 'Chocolate Húmedo', 'Harina, cacao amargo, café expreso sutil, huevos, aceite vegetal.');

insert into public.fillings (id, name, ingredients) values 
('filling-1', 'Dulce de Leche y Nueces', 'Dulce de leche repostero, nueces picadas tostadas, crema de manteca.'),
('filling-2', 'Crema Bariloche y Frutos Rojos', 'Dulce de leche, chocolate blanco, mermelada de frutos del bosque, frutos enteros.');

insert into public.products (id, category_id, name, description, price, images) values 
('prod-1', 'cat-clasicos', 'Delicia Red Velvet', 'Bizcocho clásico Red Velvet con glaseado de exquisito queso crema.', 12500, '{"/demo/clasico.png"}'),
('prod-2', 'cat-infantiles', 'Aventura Mágica 3D', 'Diversión asegurada con figuras temáticas moldeadas a mano y neon.', 19200, '{"/demo/infantil.png"}'),
('prod-3', 'cat-bodas', 'Boda de Ensueño', 'Torta hiperrealista de casamiento de 3 pisos con flores de azúcar alucinantes.', 45800, '{"/demo/boda.png"}');
