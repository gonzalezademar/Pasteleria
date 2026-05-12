"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        setMessage({ text: '¡Registro exitoso! Ya puedes iniciar sesión.', type: 'success' });
        setMode('login');
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Redirect logic depending on profile is handled inside admin/page.tsx
        // Here we just redirect to home and let the user navigate
        router.push('/');
      } else if (mode === 'recover') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ text: 'Se ha enviado un enlace de recuperación a tu correo.', type: 'success' });
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Ha ocurrido un error inesperado.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div className="neumorphic" style={{ width: '100%', maxWidth: '450px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 className="neon-text-pink" style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar Clave'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Accede a tus reservas y chat con la pastelería.' : 
             mode === 'register' ? 'Únete para hacer tus reservas 3D personalizadas.' :
             'Te enviaremos un link de recuperación al email.'}
          </p>
        </div>

        {message && (
          <div style={{ padding: '12px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e9', color: message.type === 'error' ? '#c62828' : '#2e7d32' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Nombre Completo</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required={mode === 'register'} className="neumorphic-inset" style={{ padding: '15px', border: 'none', outline: 'none', color: 'var(--text-main)', borderRadius: '12px' }} placeholder="Juan Pérez" />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="neumorphic-inset" style={{ padding: '15px', border: 'none', outline: 'none', color: 'var(--text-main)', borderRadius: '12px' }} placeholder="correo@ejemplo.com" />
          </div>

          {mode !== 'recover' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="neumorphic-inset" style={{ padding: '15px', border: 'none', outline: 'none', color: 'var(--text-main)', borderRadius: '12px' }} placeholder="••••••••" />
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={() => setMode('recover')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Registrarme' : 'Enviar Link de Recuperación'}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--shadow-dark)', paddingTop: '20px', marginTop: '10px' }}>
          {mode === 'login' ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ¿No tienes cuenta? <button onClick={() => { setMode('register'); setMessage(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Crea una aquí</button>
            </p>
          ) : (
             <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ¿Ya tienes cuenta? <button onClick={() => { setMode('login'); setMessage(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Inicia sesión</button>
            </p>
          )}
        </div>

      </div>

    </main>
  );
}
