-- 1. Forzar Admin al usuario actual
UPDATE public.profiles SET role = 'admin';

-- 2. Limpiar productos antiguos
DELETE FROM public.products;
DELETE FROM public.categories;

-- 3. Crear Categorías Reales que coincidan con las imágenes
INSERT INTO public.categories (id, name) VALUES 
('cat-clasicos', 'Clásicos'),
('cat-infantiles', 'Infantiles'),
('cat-bodas', 'Bodas');

-- 4. Insertar pasteles fotorrealistas asegurando integridad de los IDs de Categoría
INSERT INTO public.products (id, category_id, name, description, price, images) VALUES 
('prod-1', 'cat-clasicos', 'Delicia Red Velvet', 'Bizcocho clásico Red Velvet con un glaseado premium de exquisito queso crema.', 12500, '{"/demo/clasico.png"}'),
('prod-2', 'cat-infantiles', 'Aventura Mágica 3D', 'Diversión asegurada con figuras temáticas moldeadas a mano y colores vibrantes de neon.', 19200, '{"/demo/infantil.png"}'),
('prod-3', 'cat-bodas', 'Boda de Ensueño', 'Torta de casamiento de 3 pisos con delicadas flores de azúcar pastel y encaje de fondant brillante.', 45800, '{"/demo/boda.png"}');
