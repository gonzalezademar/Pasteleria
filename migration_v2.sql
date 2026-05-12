-- MIGRACIÓN PARA EXPANSIÓN DE CATÁLOGO Y VIDRIERA

-- 1. Añadir columna para Categoría Principal (Pasteles, Tartas, etc.)
ALTER TABLE public.products ADD COLUMN main_category TEXT DEFAULT 'Pasteles';

-- 2. Añadir columna para Destacar en Vidriera
ALTER TABLE public.products ADD COLUMN is_vidriera BOOLEAN DEFAULT false;

-- 3. (Opcional) Actualizar productos existentes para que pertenezcan a 'Pasteles'
UPDATE public.products SET main_category = 'Pasteles' WHERE main_category IS NULL;
