"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, ComponentOption, getProductById, getSponges, getFillings } from '@/lib/data';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [sponges, setSponges] = useState<ComponentOption[]>([]);
  const [fillings, setFillings] = useState<ComponentOption[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // States for customization
  const [weight, setWeight] = useState(1);
  const [selectedSponge, setSelectedSponge] = useState("");
  const [selectedFilling, setSelectedFilling] = useState("");
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [prod, sps, fils] = await Promise.all([
          getProductById(params.id),
          getSponges(),
          getFillings()
        ]);
        setProduct(prod);
        setSponges(sps);
        setFillings(fils);
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <div className="neumorphic" style={{ display: 'inline-block', padding: '40px', borderRadius: '20px' }}>
          <div className="neon-text-pink" style={{ fontSize: '1.5rem' }}>Cargando detalles...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h2 className="neon-text-pink">Producto no encontrado 🥨</h2>
        <Link href="/" className="btn btn-secondary" style={{ marginTop: '20px', textDecoration: 'none' }}>Volver al Catálogo</Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ["🧁"];
  const finalPrice = product.price * weight;

  return (
    <main className="container" style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh' }}>
      <nav style={{ marginBottom: '40px' }}>
        <Link href="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>← Volver</Link>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        
        {/* Gallery Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="neumorphic-inset" style={{ height: '400px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {images[activeImage].startsWith('http') || images[activeImage].startsWith('/') ? (
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} 
              />
            ) : (
              <div style={{ fontSize: '6rem' }}>{images[activeImage]}</div>
            )}
          </div>
          
          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${images.length}, 1fr)`, gap: '15px' }}>
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`neumorphic thumbnail ${activeImage === i ? 'active-neon' : ''}`}
                  style={{ height: '80px', borderRadius: '15px', overflow: 'hidden', padding: 0, border: 'none', cursor: 'pointer' }}
                >
                  {img.startsWith('http') || img.startsWith('/') ? (
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  ) : (
                    <span>{img}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Section */}
        <div className="neumorphic" style={{ padding: '30px', borderRadius: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <header>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Catálogo / {product.main_category || 'Pasteles'}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginTop: '10px' }} className="neon-text-pink">{product.name}</h1>
          </header>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{product.description}</p>
          
          <div style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Weight Picker */}
            <div>
              <label style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Peso Estimado (Kilos)</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[1, 2, 3, 5].map((w) => (
                  <button 
                    key={w} 
                    onClick={() => setWeight(w)}
                    className={`btn ${weight === w ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '60px' }}
                  >
                    {w} Kg
                  </button>
                ))}
              </div>
            </div>

            {/* Configurable Selects only if it's a Cake/Pastel */}
            {(product.main_category === 'Pasteles' || !product.main_category) && (
              <>
                <div>
                  <label style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Tipo de Bizcochuelo</label>
                  <select 
                    value={selectedSponge} 
                    onChange={(e) => setSelectedSponge(e.target.value)}
                    className="neumorphic-inset" 
                    style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
                  >
                    <option value="">Personalización por defecto (Recomendado)</option>
                    {sponges.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>Sabor de Relleno</label>
                  <select 
                    value={selectedFilling} 
                    onChange={(e) => setSelectedFilling(e.target.value)}
                    className="neumorphic-inset" 
                    style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
                  >
                    <option value="">Relleno sugerido del chef</option>
                    {fillings.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Presupuesto Estimado</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-1px' }}>
                ${finalPrice.toLocaleString()}
              </div>
            </div>
            
            <Link 
              href={`/reserva?id=${product.id}&peso=${weight}&biz=${selectedSponge}&rel=${selectedFilling}`} 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '20px', textAlign: 'center', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 0 20px rgba(255, 51, 119, 0.4)' }}
            >
              🚀 Reservar Ahora
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
