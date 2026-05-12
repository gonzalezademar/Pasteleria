"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Reserva() {
  const [showMercadoPago, setShowMercadoPago] = useState(false);
  const [paid, setPaid] = useState(false);

  const priceTotal = 9000; // 2 Kg a $4500
  const senaPercentage = 0.5; // 50% de seña para reservar
  const amountToPay = priceTotal * senaPercentage;

  if (paid) {
    return (
      <main className="container" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="neumorphic" style={{ padding: '60px', maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
          <h1 className="neon-text-pink" style={{ marginBottom: '20px' }}>¡Reserva Confirmada!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.2rem' }}>
            Hemos recibido el pago de tu seña por <b>${amountToPay.toLocaleString()}</b>. Tu pedido ya está en producción.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-secondary">Volver al Inicio</Link>
            <Link href="/mis-pedidos" className="btn btn-primary">Ir al Chat con Administración</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: '60px', paddingBottom: '80px', position: 'relative' }}>
      
      {/* Resumen del Pedido */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Resumen de Tu Pedido</h1>
        
        <div className="neumorphic" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid var(--shadow-dark)', paddingBottom: '20px' }}>
            <div className="neumorphic-inset" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🍰</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem' }}>Delicia de Fresas y Crema</h2>
              <p style={{ color: 'var(--text-muted)' }}>Tamaño: 2 Kg | Relleno: Crema Bariloche</p>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${priceTotal.toLocaleString()}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,158,189,0.1)', padding: '20px', borderRadius: '16px', border: '1px dashed var(--primary)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Política de Seña (Reserva)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Para agendar y comenzar la producción de tu pastel súper moderno, requerimos un anticipo del 50%. El resto se abonará al retirar o entregar. Modificaciones permitidas hasta 48hs antes.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Total a Abonar Ahora (Seña)</span>
            <span className="neon-text-pink" style={{ fontSize: '2.5rem', fontWeight: '900' }}>
              ${amountToPay.toLocaleString()}
            </span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '20px', fontSize: '1.2rem', marginTop: '10px' }}
            onClick={() => setShowMercadoPago(true)}
          >
            Pagar Seña con Mercado Pago
          </button>
        </div>
      </div>

      {/* Glassmorphism MercadoPago Modal Mock */}
      {showMercadoPago && (
        <div className="glass" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(247, 235, 240, 0.8)'
        }}>
          <div className="neumorphic" style={{ width: '400px', padding: '40px', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setShowMercadoPago(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              ×
            </button>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#009ee3', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              MP
            </div>
            <h2 style={{ marginBottom: '10px' }}>Pagar a "Mi Pastelería 3D"</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Total: ${amountToPay.toLocaleString()}</p>
            
            <button 
              className="btn" 
              style={{ width: '100%', backgroundColor: '#009ee3', color: 'white', border: 'none', padding: '15px', borderRadius: '8px' }}
              onClick={() => setPaid(true)}
            >
              Simular Pago Exitoso
            </button>
          </div>
        </div>
      )}
      
    </main>
  );
}
