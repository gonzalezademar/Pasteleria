"use client";

import { useState } from 'react';

export default function ChatDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '¡Hola! Bienvenido a la Magia de la Pastelería 3D. ¿Estás buscando alguna torta en especial o necesitas ver nuestro catálogo?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: '¡Qué buena idea! Si estás buscando una torta temática, te sugiero mirar en nuestra categoría "Infantiles" o "Bodas". ¡Puedo ayudarte a cotizarla si me dices de cuántos kilos la buscas!' }]);
    }, 1500);
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0)' : 'scale(1)',
        }}
      >
        💬
      </button>

      {/* Ventana de Chat */}
      <div 
        className="neumorphic"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '350px',
          height: '500px',
          backgroundColor: 'rgba(23, 23, 25, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid var(--shadow-dark)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none'
        }}
      >
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--shadow-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px 20px 0 0' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: '#00e676' }}></div>
            Chat (Demo)
          </h3>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
               <div style={{ 
                 maxWidth: '80%', 
                 padding: '10px 15px', 
                 borderRadius: m.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                 backgroundColor: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                 color: '#fff',
                 fontSize: '0.9rem',
                 lineHeight: '1.4'
               }}>
                 {m.text}
               </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid var(--shadow-dark)', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            className="neumorphic-inset"
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '20px', outline: 'none', color: '#fff', fontSize: '0.9rem' }}
          />
          <button type="submit" style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ➤
          </button>
        </form>
      </div>
    </>
  );
}
