"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ComponentOption, getSponges, getFillings } from '@/lib/data';

export default function ArmarTorta() {
  const [sponges, setSponges] = useState<ComponentOption[]>([]);
  const [fillings, setFillings] = useState<ComponentOption[]>([]);

  const [selectedSponge, setSelectedSponge] = useState<ComponentOption | null>(null);
  const [selectedFilling, setSelectedFilling] = useState<ComponentOption | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    (async () => {
      const [s, f] = await Promise.all([getSponges(), getFillings()]);
      setSponges(s);
      setFillings(f);
    })();
  }, []);

  const handleFinish = () => {
    setStep(3);
  };

  return (
    <main className="container" style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', maxWidth: '900px' }}>
      
      <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '20px', display: 'inline-block', fontWeight: 'bold' }}>
        ← Volver al Inicio
      </Link>

      <h1 className="neon-text-pink" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '10px' }}>Arma tu Torta</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '50px', fontSize: '1.2rem' }}>Personaliza cada capa con los sabores que más te gusten.</p>

      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
         <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--shadow-dark)', position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}></div>
         <div style={{ width: `${(step - 1) * 50}%`, height: '4px', backgroundColor: 'var(--primary)', position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 1, transition: 'width 0.3s ease' }}></div>
         
         <div style={{ zIndex: 2, background: step >= 1 ? 'var(--primary)' : 'var(--bg)', border: `4px solid ${step >= 1 ? 'var(--primary)' : 'var(--shadow-dark)'}`, color: step >= 1 ? '#fff' : 'var(--text-muted)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
         <div style={{ zIndex: 2, background: step >= 2 ? 'var(--primary)' : 'var(--bg)', border: `4px solid ${step >= 2 ? 'var(--primary)' : 'var(--shadow-dark)'}`, color: step >= 2 ? '#fff' : 'var(--text-muted)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
         <div style={{ zIndex: 2, background: step >= 3 ? 'var(--primary)' : 'var(--bg)', border: `4px solid ${step >= 3 ? 'var(--primary)' : 'var(--shadow-dark)'}`, color: step >= 3 ? '#fff' : 'var(--text-muted)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
      </div>

      {step === 1 && (
        <section className="fade-in">
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Paso 1: Elige el Bizcochuelo 🍞</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {sponges.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aún no hay opciones disponibles.</p>}
            {sponges.map(sponge => (
              <div 
                key={sponge.id} 
                onClick={() => { setSelectedSponge(sponge); setStep(2); }}
                className={`neumorphic ${selectedSponge?.id === sponge.id ? 'active' : ''}`} 
                style={{ padding: '25px', cursor: 'pointer', border: selectedSponge?.id === sponge.id ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.3s ease' }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{sponge.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}><strong>Ingredientes:</strong> {sponge.ingredients}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="fade-in">
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Paso 2: Elige el Relleno 🍯</h2>
          <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
            {fillings.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aún no hay opciones disponibles.</p>}
            {fillings.map(filling => (
              <div 
                key={filling.id} 
                onClick={() => setSelectedFilling(filling)}
                className={`neumorphic ${selectedFilling?.id === filling.id ? 'active' : ''}`} 
                style={{ padding: '25px', cursor: 'pointer', border: selectedFilling?.id === filling.id ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.3s ease' }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{filling.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}><strong>Contiene:</strong> {filling.ingredients}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
             <button className="btn btn-secondary" onClick={() => setStep(1)}>Volver al Paso 1</button>
             <button 
               className="btn btn-primary" 
               disabled={!selectedFilling}
               onClick={handleFinish}
               style={{ opacity: !selectedFilling ? 0.5 : 1 }}
             >
               Finalizar Selección →
             </button>
          </div>
        </section>
      )}

      {step === 3 && selectedSponge && selectedFilling && (
        <section className="fade-in neumorphic" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }} className="neon-text-pink">¡Excelente Elección!</h2>
          
          <div style={{ backgroundColor: 'var(--bg)', padding: '30px', borderRadius: '15px', marginBottom: '30px', textAlign: 'left', border: '1px solid var(--shadow-light)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'var(--primary)' }}>Resumen de tu Torta:</h3>
            <p style={{ marginBottom: '10px' }}><strong>Bizcochuelo:</strong> {selectedSponge.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{selectedSponge.ingredients}</p>
            
            <p style={{ marginBottom: '10px' }}><strong>Relleno:</strong> {selectedFilling.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedFilling.ingredients}</p>
          </div>

          <div style={{ backgroundColor: 'rgba(255,158,189,0.1)', padding: '20px', borderRadius: '10px', color: 'var(--primary)', marginBottom: '30px', fontWeight: 'bold' }}>
            ℹ️ Precio a presupuestar por el administrador en base a la decoración solicitada.
          </div>

          <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
            Solicitar Presupuesto por WhatsApp
          </button>
          <br /><br />
          <button className="btn" style={{ textDecoration: 'underline', background: 'none' }} onClick={() => setStep(1)}>
            Empezar de nuevo
          </button>
        </section>
      )}

    </main>
  );
}
