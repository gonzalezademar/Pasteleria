"use client";

import { useState } from 'react';

export default function MisPedidos() {
  const [messages, setMessages] = useState([
    { sender: 'admin', text: '¡Hola! Recibimos la seña de tu Delicia de Fresas y Crema. ¿Tenías alguna duda con el relleno?', time: '10:30 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: 'client', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMessage('');
    // Mock Admin Reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'admin', text: 'Entendido. Lo anotaré en los detalles de tu pedido. ¡Gracias!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  return (
    <main className="container" style={{ padding: '60px 20px', minHeight: '100vh' }}>
      <h1 className="neon-text-pink" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Mis Pedidos y Chat</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
        
        {/* Lista de Pedidos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="neumorphic" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '5px' }}>Pedido #A102</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Delicia de Fresas y Crema (2 Kg)</p>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00e676' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Seña Pagada (En preparación)</span>
            </div>
          </div>
          
          <div className="neumorphic" style={{ padding: '20px', opacity: 0.6 }}>
            <h3 style={{ marginBottom: '5px' }}>Pedido #A088</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choco-Extremo 3D (1 Kg)</p>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#bdbdbd' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Entregado</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="neumorphic" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--shadow-dark)' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Chat con Administración (Pedido #A102)</h2>
          </div>
          
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.sender === 'client' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'client' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ 
                  backgroundColor: msg.sender === 'client' ? 'var(--primary)' : 'var(--card-bg)',
                  color: msg.sender === 'client' ? 'white' : 'var(--text-main)',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'client' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  boxShadow: msg.sender === 'client' ? 'none' : 'inset 2px 2px 5px var(--shadow-light), inset -2px -2px 5px var(--shadow-dark)',
                  border: msg.sender === 'client' ? 'none' : '1px solid var(--shadow-dark)'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{msg.time}</span>
              </div>
            ))}
          </div>
          
          <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid var(--shadow-dark)', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..." 
              className="neumorphic-inset"
              style={{ flex: 1, padding: '15px', border: 'none', outline: 'none', color: 'var(--text-main)', borderRadius: '100px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', borderRadius: '100px' }}>
              Enviar
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
