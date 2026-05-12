"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Category, Product, getCategories, getProducts } from '@/lib/data';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeMainCategory, setActiveMainCategory] = useState<string>('Pasteles');
  const [activeSegment, setActiveSegment] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const mainCategories = ['Pasteles', 'Tartas', 'Postres', 'Dulces Especiales'];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorStatus(null);
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        
        if (cats.length === 0 && prods.length === 0) {
          setErrorStatus("No se encontraron datos en la base de datos.");
        }

        setCategories(cats);
        setProducts(prods);
      } catch (err: any) {
        console.error("Critical Fetch Error:", err);
        setErrorStatus(`Error: ${err.message || 'Desconocido'}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const vidrieraProducts = products.filter(p => p.is_vidriera);
  
  const filteredProducts = products.filter(p => {
    const matchesMain = p.main_category === activeMainCategory;
    if (!matchesMain) return false;
    
    if (activeMainCategory === 'Pasteles' && activeSegment !== 'all') {
      return p.category_id === activeSegment;
    }
    return true;
  });

  return (
    <main className="container" style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh' }}>
      
      {/* --- HERO SECTION --- */}
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ marginBottom: '16px', lineHeight: '1.2' }}>
          La Magia de la <span className="neon-text-pink">Pastelería</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', marginBottom: '40px' }}>
          Diseños 3D, sabores inolvidables y una experiencia de compra diseñada especialmente para ti.
        </p>

        {/* CTA Arma tu Torta - Siempre visible por defecto */}
        <div className="neumorphic" style={{ display: 'inline-block', padding: '30px', borderRadius: '28px', border: '1px solid rgba(255, 51, 119, 0.2)', maxWidth: '100%' }}>
          <h2 style={{ marginBottom: '12px' }}>✨ ¡Crea tu Torta <span className="neon-text-pink">100% Personalizada</span>!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1rem' }}>Elige tus combinaciones favoritas de masa y relleno. Nosotros la cotizamos.</p>
          <Link href="/armar-torta" className="btn btn-primary" style={{ textDecoration: 'none', padding: '18px 40px', fontSize: '1.1rem' }}>
            🎂 Armar mi Torta Ahora
          </Link>
        </div>
      </header>

      {/* --- SECCIÓN VIDRIERA --- */}
      {!loading && vidrieraProducts.length > 0 && (
        <section className="vidriera-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
             <h2 className="neon-text-pink" style={{ fontSize: '2rem' }}>Nuestra Vidriera</h2>
             <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, var(--primary), transparent)' }}></div>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Una selección exclusiva de nuestras mejores creaciones.</p>
          
          <div className="vidriera-scroll">
            {vidrieraProducts.map(prod => (
              <Link key={`v-${prod.id}`} href={`/producto/${prod.id}`} style={{ textDecoration: 'none' }}>
                <article className="neumorphic vidriera-card" style={{ padding: '20px', borderRadius: '24px', height: '100%' }}>
                  <div className="neumorphic-inset" style={{ height: '200px', marginBottom: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {prod.images[0]?.startsWith('/') || prod.images[0]?.startsWith('http') ? (
                       <img src={prod.images[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     ) : (
                       <span style={{ fontSize: '4rem' }}>{prod.images[0] || '🧁'}</span>
                     )}
                  </div>
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '5px' }}>{prod.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${prod.price}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- NAVEGACIÓN DE LÍNEAS (TABS SUPERIORES) --- */}
      <nav className="main-tabs">
        {mainCategories.map(cat => (
          <button 
            key={cat}
            onClick={() => { setActiveMainCategory(cat); setActiveSegment('all'); }}
            className={`main-tab-item ${activeMainCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* --- SUB-CATEGORÍAS (SOLO PARA PASTELES) --- */}
      {activeMainCategory === 'Pasteles' && categories.length > 0 && (
        <section style={{ marginBottom: '40px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 10px' }}>
          <button 
            onClick={() => setActiveSegment('all')}
            className={`btn ${activeSegment === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem' }}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveSegment(cat.id)}
              className={`btn ${activeSegment === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem' }}
            >
              {cat.name}
            </button>
          ))}
        </section>
      )}

      {/* Error / Diagnóstico */}
      {errorStatus && (
        <div className="neumorphic" style={{ padding: '20px', textAlign: 'center', border: '1px solid #ff1744', color: '#ff1744', margin: '20px auto', maxWidth: '500px', borderRadius: '15px' }}>
          ⚠️ <strong>Estado:</strong> {errorStatus}
        </div>
      )}

      {/* --- GRID DE PRODUCTOS --- */}
      <h2 style={{ marginBottom: '30px' }}>Catálogo: <span style={{ color: 'var(--primary)' }}>{activeMainCategory}</span></h2>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        
        {loading && (
          [1,2,3].map(i => (
            <div key={i} className="neumorphic" style={{ height: '400px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}></div>
          ))
        )}

        {!loading && filteredProducts.length === 0 && !errorStatus && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }} className="neumorphic">
            No hay productos cargados en esta línea todavía. 🥨
          </div>
        )}

        {!loading && filteredProducts.map((prod, index) => {
          const isUrl = prod.images[0] && (prod.images[0].startsWith('http') || prod.images[0].startsWith('/'));
          
          return (
            <article key={prod.id} className="neumorphic" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="neumorphic-inset" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {isUrl ? (
                   <img src={prod.images[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="floating glass" style={{ animationDelay: `${index * 0.5}s`, width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '3rem', textAlign: 'center' }}>
                    {prod.images[0] || '🍰'}
                  </div>
                )}
                
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--primary)', color: '#fff', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                  {prod.images.length} {prod.images.length === 1 ? 'Foto' : 'Fotos'}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{prod.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>{prod.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>${prod.price}</span>
                  <Link href={`/producto/${prod.id}`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Ver Detalle</Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
