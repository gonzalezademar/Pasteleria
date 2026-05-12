import { supabase } from './supabase';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  main_category?: string; // Pasteles, Tartas, Postres, Dulces Especiales
  is_vidriera?: boolean;
}

export interface ComponentOption {
  id: string;
  name: string;
  ingredients: string;
}

// --- Categories ---
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    throw error;
  }
  return data || [];
}

export async function addCategory(category: Category) {
  const { error } = await supabase.from('categories').insert([category]);
  if (error) console.error('Error adding category:', error);
}

export async function deleteCategoryDB(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) console.error('Error deleting category:', error);
}

// --- Products ---
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    throw error;
  }
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
  return data;
}

export async function addProduct(product: Product) {
  const { error } = await supabase.from('products').insert([product]);
  if (error) console.error('Error adding product:', error);
}

export async function deleteProductDB(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('Error deleting product:', error);
}

// --- Sponges (Bizcochuelos) ---
export async function getSponges(): Promise<ComponentOption[]> {
  const { data, error } = await supabase.from('sponges').select('*');
  if (error) {
    console.error('Error fetching sponges:', error);
    return [];
  }
  return data || [];
}

export async function addSponge(sponge: ComponentOption) {
  const { error } = await supabase.from('sponges').insert([sponge]);
  if (error) console.error('Error adding sponge:', error);
}

export async function deleteSpongeDB(id: string) {
  const { error } = await supabase.from('sponges').delete().eq('id', id);
  if (error) console.error('Error deleting sponge:', error);
}

// --- Fillings (Rellenos) ---
export async function getFillings(): Promise<ComponentOption[]> {
  const { data, error } = await supabase.from('fillings').select('*');
  if (error) {
    console.error('Error fetching fillings:', error);
    return [];
  }
  return data || [];
}

export async function addFilling(filling: ComponentOption) {
  const { error } = await supabase.from('fillings').insert([filling]);
  if (error) console.error('Error adding filling:', error);
}

export async function deleteFillingDB(id: string) {
  const { error } = await supabase.from('fillings').delete().eq('id', id);
  if (error) console.error('Error deleting filling:', error);
}

