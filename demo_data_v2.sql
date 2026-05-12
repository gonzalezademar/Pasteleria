-- LOTE DE DATOS FICTICIOS ACTUALIZADO CON IMÁGENES VERIFICADAS
-- Este script inserta una variedad de productos con fotos reales de alta calidad especializadas en pastelería.

-- 1. Asegurar categorías
INSERT INTO public.categories (id, name) VALUES 
('cat-clasicos', 'Clásicos'),
('cat-bodas', 'Bodas'),
('cat-infantiles', 'Infantiles'),
('cat-vintage', 'Vintage & Retro'),
('cat-modern', 'Minimalista Moderno')
ON CONFLICT (id) DO NOTHING;

-- 2. Limpiar productos previos para evitar duplicados y errores
DELETE FROM public.products; 

-- 3. Insertar productos con URLs verificadas (Unsplash Premium Quality)
INSERT INTO public.products (id, category_id, name, description, price, images, main_category, is_vidriera) VALUES 

-- CLÁSICOS (PASTELES)
('p-clas-1', 'cat-clasicos', 'Red Velvet Premium', 'Bizcocho aterciopelado con el equilibrio justo de cacao y un frosting de queso crema sedoso.', 12500, 
 '{"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=800"}', 
 'Pasteles', true),

('p-clas-2', 'cat-clasicos', 'Selva Negra Tradicional', 'Capas de chocolate, crema chantilly y cerezas frescas. Un clásico que nunca falla.', 14000, 
 '{"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800"}', 
 'Pasteles', false),

-- BODAS (PASTELES)
('p-boda-1', 'cat-bodas', 'Boda de Ensueño (3 Pisos)', 'Torta de casamiento de tres niveles con terminación texturizada y flores naturales de estación.', 55000, 
 '{"https://images.unsplash.com/photo-1614878257906-91bdeb16c470?q=80&w=800"}', 
 'Pasteles', true),

-- INFANTILES (PASTELES)
('p-inf-1', 'cat-infantiles', 'Arcoíris Mágico', 'Explosión de colores y sabor. Ideal para cumpleaños infantiles llenos de alegría.', 18000, 
 '{"https://images.unsplash.com/photo-1622576890453-8e50b6f7d5b0?q=80&w=800"}', 
 'Pasteles', true),

-- TARTAS (Categoría Principal)
('p-tar-1', 'cat-clasicos', 'Lemon Pie Artesanal', 'Base quebrada, crema de limón con jugo natural y un merengue italiano perfectamente quemado.', 9500, 
 '{"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800"}', 
 'Tartas', true),

-- POSTRES (Categoría Principal)
('p-pos-1', 'cat-clasicos', 'Mousse de Chocolate Doble', 'Suave mousse de chocolate semi-amargo con virutas de chocolate belga.', 7500, 
 '{"https://images.unsplash.com/photo-1673551491291-5b17d2842988?q=80&w=800"}', 
 'Postres', true),

-- DULCES ESPECIALES (Categoría Principal)
('p-dul-1', 'cat-clasicos', 'Caja de Macarons Franceses', 'Surtido premium de macarons de pistacho, frambuesa y vainilla. El regalo perfecto.', 8200, 
 '{"https://images.unsplash.com/photo-1702034519527-b0975c467001?q=80&w=800"}', 
 'Dulces Especiales', true);
