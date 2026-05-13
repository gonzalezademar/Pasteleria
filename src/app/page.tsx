"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-wrapper" style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text-main)', overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
      <section className="hero-landing" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px', textAlign: 'center' }}>
        {/* Elementos decorativos de fondo */}
        <div className="blob" style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'rgba(255, 51, 119, 0.15)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }}></div>
        <div className="blob" style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(0, 212, 255, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="glass" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '50px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)', border: '1px solid rgba(255, 51, 119, 0.3)' }}>
            ✨ La plataforma #1 para Pasteleros Modernos
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Tu Pastelería Merece una <br />
            <span className="neon-text-pink">Web de Ensueño</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
            Crea tu tienda online personalizada en minutos. Vende tus tortas con un catálogo 3D, gestiona pedidos y enamora a tus clientes con una estética profesional.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth?mode=register" className="btn btn-primary" style={{ padding: '20px 48px', fontSize: '1.2rem', textDecoration: 'none', boxShadow: '0 20px 40px rgba(255, 51, 119, 0.3)' }}>
              Empezar Gratis Ahora
            </Link>
            <Link href="/tienda/demo" className="btn btn-secondary" style={{ padding: '20px 48px', fontSize: '1.2rem', textDecoration: 'none' }}>
              Ver Demo en Vivo
            </Link>
          </div>

          {/* Mockup Preview */}
          <div className="neumorphic" style={{ marginTop: '80px', borderRadius: '40px', padding: '15px', maxWidth: '1000px', margin: '80px auto 0 auto', transform: 'perspective(1000px) rotateX(5deg)', boxShadow: '0 50px 100px rgba(0,0,0,0.4)' }}>
             <div className="neumorphic-inset" style={{ borderRadius: '30px', overflow: 'hidden', aspectRatio: '16/9', background: '#1a1a1a', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Dashboard Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                   <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '10px' }}>Tu Tienda Aquí</h3>
                   <p style={{ color: 'rgba(255,255,255,0.7)' }}>Personaliza colores, productos y más...</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section style={{ padding: '100px 20px', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>Todo lo que necesitas para <span className="neon-text-pink">Crecer</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Diseñado por pasteleros, para pasteleros.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {[
              { title: 'Personalización Total', desc: 'Elige entre 5 temas premium y personaliza colores de títulos, slogans y decoraciones.', icon: '🎨' },
              { title: 'Catálogo Interactivo', desc: 'Muestra tus creaciones con galerías de fotos y descripciones tentadoras.', icon: '🎂' },
              { title: 'Gestión de Pedidos', desc: 'Recibe y administra los pedidos de tus clientes de forma organizada.', icon: '📱' },
              { title: 'Efectos de Cotillón', desc: 'Añade magia a tu web con emojis flotantes y decoraciones temáticas.', icon: '🎉' },
              { title: 'Dominio Propio', desc: 'Tu tienda tendrá una URL única y profesional para compartir en redes.', icon: '🌐' },
              { title: 'Soporte 24/7', desc: 'Estamos aquí para ayudarte a que tu negocio brille en internet.', icon: '⭐' }
            ].map((feat, i) => (
              <div key={i} className="neumorphic" style={{ padding: '40px', borderRadius: '32px', textAlign: 'left', transition: 'transform 0.3s' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feat.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section style={{ padding: '120px 20px', textAlign: 'center' }}>
        <div className="container">
          <div className="neumorphic" style={{ padding: '80px 40px', borderRadius: '48px', background: 'linear-gradient(135deg, rgba(255, 51, 119, 0.1), rgba(0, 212, 255, 0.1))', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '24px' }}>¿Listo para digitalizar tu talento?</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
              Únete a cientos de pasteleros que ya están vendiendo más con nuestra plataforma.
            </p>
            <Link href="/auth?mode=register" className="btn btn-primary" style={{ padding: '20px 60px', fontSize: '1.3rem', textDecoration: 'none' }}>
              Crear mi Tienda Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '60px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>© 2026 Pastelería Pro. Creado con ❤️ para el mundo dulce.</p>
      </footer>

      <style jsx>{`
        .hero-landing {
          background: radial-gradient(circle at center, rgba(255, 51, 119, 0.05) 0%, transparent 70%);
        }
        .neumorphic:hover {
          transform: translateY(-10px);
        }
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
