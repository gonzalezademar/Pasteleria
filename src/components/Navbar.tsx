"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string>('client');
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMenuOpen(false); // Cerrar menú al cambiar de ruta
  }, [router]);

  useEffect(() => {
    const savedSimulation = localStorage.getItem('simulatedRole');
    if (savedSimulation) setSimulatedRole(savedSimulation);

    const fetchProfileData = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (data) {
        setRole(data.role);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario');
        fetchProfileData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario');
        fetchProfileData(session.user.id);
      } else {
        setRole('client');
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('simulatedRole');
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  const displayRole = simulatedRole || role;

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(23, 23, 25, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--shadow-dark)', zIndex: 1100 }}>
      <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', zIndex: 1200 }}>🍰 Pastelería</Link>
      
      {/* Botón Hamburger */}
      <button 
        className="only-mobile" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '2rem', cursor: 'pointer', zIndex: 1200, display: 'flex', alignItems: 'center' }}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        {!session ? (
          <>
            <Link href="/#features" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', marginRight: '20px' }}>Características</Link>
            <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ textDecoration: 'none' }}>Vender mi Pastelería</Link>
          </>
        ) : (
          <>
            <Link href="/tienda/demo" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', marginRight: '20px' }}>Mi Tienda</Link>
            {/* Toggle de Modo (Cliente / Admin) */}
            <div className={`role-toggle ${displayRole === 'admin' ? 'admin' : ''}`}>
              <div className="role-toggle-slider"></div>
              <button 
                type="button"
                className={`role-toggle-item ${displayRole !== 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setSimulatedRole('client');
                  localStorage.setItem('simulatedRole', 'client');
                  setIsMenuOpen(false);
                  router.push('/tienda/demo');
                }}
              >
                🛒 Vista
              </button>
              <button 
                type="button"
                className={`role-toggle-item ${displayRole === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setSimulatedRole('admin');
                  localStorage.setItem('simulatedRole', 'admin');
                  setIsMenuOpen(false);
                  router.push('/admin');
                }}
              >
                🛠️ Admin
              </button>
            </div>

            <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
              Hola, <strong style={{ color: 'var(--primary)' }}>{userName}</strong>
            </span>

            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', width: 'auto' }}>
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
