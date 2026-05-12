"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Category, Product, ComponentOption,
  getCategories, addCategory, deleteCategoryDB,
  getProducts, addProduct, deleteProductDB,
  getSponges, addSponge, deleteSpongeDB,
  getFillings, addFilling, deleteFillingDB
} from '@/lib/data';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'ventas' | 'categorias' | 'productos' | 'bizcochuelos' | 'rellenos'>('ventas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  
  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sponges, setSponges] = useState<ComponentOption[]>([]);
  const [fillings, setFillings] = useState<ComponentOption[]>([]);

  // Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loadingApp, setLoadingApp] = useState(true);

  // Form States
  const [newCatName, setNewCatName] = useState('');
  
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCat, setNewProdCat] = useState('');
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdMainCat, setNewProdMainCat] = useState('Pasteles');
  const [newProdIsVidriera, setNewProdIsVidriera] = useState(false);

  const [newOptName, setNewOptName] = useState('');
  const [newOptIngr, setNewOptIngr] = useState('');

  const loadData = async () => {
    const [cats, prods, sp, fi] = await Promise.all([
      getCategories(), getProducts(), getSponges(), getFillings()
    ]);
    setCategories(cats); setProducts(prods); setSponges(sp); setFillings(fi);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      const simulatedRole = localStorage.getItem('simulatedRole');
      const finalRole = simulatedRole || profile?.role;

      if (finalRole !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      await loadData();
      setLoadingApp(false);
    };
    checkAuth();
  }, [router]);

  // --- Handlers: Categories ---
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const newCat: Category = { id: `cat-${Date.now()}`, name: newCatName.trim() };
    await addCategory(newCat);
    await loadData();
    setNewCatName('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas borrar esta categoría? Sus pasteles también se borrarán por la DB.")) return;
    await deleteCategoryDB(id);
    await loadData();
  };

  // --- Handlers: Products ---
  const handleAddProduct = async () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`, 
      category_id: newProdMainCat === 'Pasteles' ? newProdCat : '', 
      name: newProdName.trim(),
      description: newProdDesc.trim(), 
      price: Number(newProdPrice) || 0,
      images: newProdImg.trim() ? [newProdImg.trim()] : ['🎂'],
      main_category: newProdMainCat,
      is_vidriera: newProdIsVidriera
    };
    await addProduct(newProd);
    await loadData();
    setNewProdName(''); setNewProdPrice(''); setNewProdDesc(''); setNewProdImg('');
    setNewProdIsVidriera(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas borrar este pastel/álbum?")) return;
    await deleteProductDB(id);
    await loadData();
  };

  // --- Handlers: Components (Sponges / Fillings) ---
  const handleAddComponent = async (type: 'sponge' | 'filling') => {
    if (!newOptName.trim() || !newOptIngr.trim()) {
      alert("Debes ingresar un nombre y sus ingredientes.");
      return;
    }
    const newOpt: ComponentOption = {
      id: `${type}-${Date.now()}`,
      name: newOptName.trim(),
      ingredients: newOptIngr.trim()
    };
    
    if (type === 'sponge') {
      await addSponge(newOpt);
    } else {
      await addFilling(newOpt);
    }
    await loadData();
    setNewOptName(''); setNewOptIngr('');
  };

  const handleDeleteComponent = async (id: string, type: 'sponge' | 'filling') => {
    if (!window.confirm("¿Seguro que deseas borrar esta opción?")) return;
    if (type === 'sponge') {
      await deleteSpongeDB(id);
    } else {
      await deleteFillingDB(id);
    }
    await loadData();
  };

  const renderComponentList = (items: ComponentOption[], type: 'sponge' | 'filling') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay opciones guardadas.</p>}
      {items.map(item => (
        <div key={item.id} className="neumorphic-inset" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)', lineHeight: '1.2' }}>{item.name}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Ingredientes: {item.ingredients}</p>
          </div>
          <button 
            onClick={() => handleDeleteComponent(item.id, type)}
            style={{ background: 'none', border: 'none', color: '#ff1744', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Borrar
          </button>
        </div>
      ))}
    </div>
  );

  if (loadingApp) return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando administrador...</div>;

  return (
    <div className="admin-layout">
      {/* Overlay móvil */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Botón flotante móvil (FAB) */}
      <button 
        className="only-mobile"
        onClick={() => setIsSidebarOpen(true)}
        style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1101, width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(255, 51, 119, 0.5)', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="neon-text-pink" style={{ fontSize: '1.8rem', marginBottom: '30px', textAlign: 'center' }}>Panel Admin</h2>
        
        <button onClick={() => { setActiveTab('ventas'); setIsSidebarOpen(false); }} className={`btn ${activeTab === 'ventas' ? 'btn-primary' : 'btn-secondary'}`} style={{ textAlign: 'left', padding: '12px 20px', justifyContent: 'flex-start' }}>
          🛒 Gestión de Pedidos
        </button>
        <button onClick={() => { setActiveTab('categorias'); setIsSidebarOpen(false); }} className={`btn ${activeTab === 'categorias' ? 'btn-primary' : 'btn-secondary'}`} style={{ textAlign: 'left', padding: '12px 20px', justifyContent: 'flex-start' }}>
          📂 Categorías
        </button>
        <button onClick={() => { setActiveTab('productos'); setIsSidebarOpen(false); }} className={`btn ${activeTab === 'productos' ? 'btn-primary' : 'btn-secondary'}`} style={{ textAlign: 'left', padding: '12px 20px', justifyContent: 'flex-start' }}>
          🍰 Catálogo de Pasteles
        </button>
        <hr style={{ borderColor: 'var(--shadow-dark)', margin: '10px 0' }} />
        <button onClick={() => { setActiveTab('bizcochuelos'); setIsSidebarOpen(false); }} className={`btn ${activeTab === 'bizcochuelos' ? 'btn-primary' : 'btn-secondary'}`} style={{ textAlign: 'left', padding: '12px 20px', justifyContent: 'flex-start' }}>
          🍞 Tipos de Bizcochuelos
        </button>
        <button onClick={() => { setActiveTab('rellenos'); setIsSidebarOpen(false); }} className={`btn ${activeTab === 'rellenos' ? 'btn-primary' : 'btn-secondary'}`} style={{ textAlign: 'left', padding: '12px 20px', justifyContent: 'flex-start' }}>
          🍯 Tipos de Rellenos
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        
        {/* --- VENTAS --- */}
        {activeTab === 'ventas' && (
          <section>
            <h1 style={{ marginBottom: '30px', lineHeight: '1.1' }}>Gestión de Pedidos</h1>
            <div className="neumorphic" style={{ padding: '24px', overflowX: 'auto', borderRadius: '24px' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                 <thead>
                   <tr style={{ borderBottom: '2px solid var(--shadow-dark)' }}>
                     <th style={{ padding: '15px' }}>ID Pedido</th>
                     <th style={{ padding: '15px' }}>Cliente</th>
                     <th style={{ padding: '15px' }}>Pastel</th>
                     <th style={{ padding: '15px' }}>Detalles / Atributos</th>
                     <th style={{ padding: '15px' }}>Estado MP</th>
                     <th style={{ padding: '15px' }}>Acciones</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
                     <td style={{ padding: '15px', fontWeight: 'bold' }}>#A102</td>
                     <td style={{ padding: '15px' }}>Juan Pérez</td>
                     <td style={{ padding: '15px' }}>Torta Personalizada</td>
                     <td style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bizco: Vainilla | Relleno: Dulce Leche</td>
                     <td style={{ padding: '15px', color: '#00e676', fontWeight: 'bold' }}>A presupuestar</td>
                     <td style={{ padding: '15px' }}>
                       <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Ver Charla</button>
                     </td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </section>
        )}

        {/* --- CATEGORIAS --- */}
        {activeTab === 'categorias' && (
          <section>
            <h1 style={{ marginBottom: '30px', lineHeight: '1.1' }}>Gestión de Categorías</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              <div className="neumorphic" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Nueva Categoría</h2>
                <input type="text" className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Ej. Bautismos" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={handleAddCategory}>Añadir Categoría</button>
              </div>
              <div className="neumorphic" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Categorías Actuales</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {categories.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay categorías.</p>}
                  {categories.map(cat => (
                    <div key={cat.id} className="neumorphic-inset" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>{cat.name}</h4>
                      <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: '#ff1744', cursor: 'pointer', fontWeight: 'bold' }}>Borrar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- PASTELERIA ITEMS --- */}
        {activeTab === 'productos' && (
          <section>
            <h1 style={{ marginBottom: '30px', lineHeight: '1.1' }}>Catálogo de Pasteles</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              <div className="neumorphic" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Nuevo Item de Catálogo</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Línea de Producto</label>
                  <select className="neumorphic-inset" style={{ padding: '12px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'var(--text-main)', width: '100%' }} value={newProdMainCat} onChange={(e) => setNewProdMainCat(e.target.value)}>
                    <option value="Pasteles">🎂 Pasteles / Tortas</option>
                    <option value="Tartas">🥧 Tartas</option>
                    <option value="Postres">🍮 Postres</option>
                    <option value="Dulces Especiales">🍭 Dulces Especiales</option>
                  </select>
                </div>

                {newProdMainCat === 'Pasteles' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Categoría (Álbum)</label>
                    <select className="neumorphic-inset" style={{ padding: '12px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'var(--text-main)', width: '100%' }} value={newProdCat} onChange={(e) => setNewProdCat(e.target.value)}>
                      <option value="" disabled>Seleccionar Sub-Categoría</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                )}

                <input type="text" className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Nombre del Producto" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} />
                <input type="number" className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Precio ($)" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} />
                <textarea className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', minHeight: '80px', background: 'var(--bg-color)', color: 'inherit', resize: 'vertical' }} placeholder="Descripción corta" value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)}></textarea>
                <input type="text" className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="URL Imagen o Emoji" value={newProdImg} onChange={(e) => setNewProdImg(e.target.value)} />
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px' }}>
                  <input type="checkbox" checked={newProdIsVidriera} onChange={(e) => setNewProdIsVidriera(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: '600' }}>✨ Destacar en Vidriera</span>
                </label>

                <button className="btn btn-primary" style={{ marginTop: '5px' }} onClick={handleAddProduct}>Publicar Producto</button>
              </div>
              <div className="neumorphic" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Catálogo Actual</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                  {products.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay pasteles.</p>}
                  {products.map(prod => {
                    const cat = categories.find(c => c.id === prod.category_id);
                    const isUrl = prod.images[0] && (prod.images[0].startsWith('http') || prod.images[0].startsWith('/'));
                    return (
                      <div key={prod.id} className="neumorphic-inset" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'var(--shadow-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {isUrl ? <img src={prod.images[0]} alt="Pastel" style={{ width: '100%', height: '100%', objectFit: 'cover'}} /> : <span style={{ fontSize: '2rem'}}>{prod.images[0] || '🍰'}</span>}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.is_vidriera && <span style={{ color: 'var(--primary)', marginRight: '5px' }}>✨</span>}
                              {prod.name}
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {prod.main_category} {cat ? `> ${cat.name}` : ''}
                            </p>
                            <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>${prod.price}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteProduct(prod.id)} style={{ background: 'none', border: 'none', color: '#ff1744', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>Borrar</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- BIZCOCHUELOS --- */}
        {activeTab === 'bizcochuelos' && (
          <section>
            <h1 className="neon-text-pink" style={{ marginBottom: '10px', lineHeight: '1.1' }}>Tipos de Bizcochuelos</h1>
            <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>Crea las combinaciones de masas para que el cliente arme su torta.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              <div className="neumorphic" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>Nueva Combinación</h2>
                <input type="text" className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Nombre (ej. Vainilla)" value={newOptName} onChange={(e) => setNewOptName(e.target.value)} />
                <textarea className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', minHeight: '120px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Descripción o ingredientes" value={newOptIngr} onChange={(e) => setNewOptIngr(e.target.value)}></textarea>
                <button className="btn btn-primary" onClick={() => handleAddComponent('sponge')}>Guardar Opción</button>
              </div>
              <div className="neumorphic" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Disponibles</h2>
                {renderComponentList(sponges, 'sponge')}
              </div>
            </div>
          </section>
        )}

        {/* --- RELLENOS --- */}
        {activeTab === 'rellenos' && (
          <section>
            <h1 className="neon-text-pink" style={{ marginBottom: '10px', lineHeight: '1.1' }}>Tipos de Rellenos</h1>
            <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>Define las combinaciones de rellenos disponibles.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              <div className="neumorphic" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.4rem' }}>Nueva Combinación</h2>
                <input type="text" className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Nombre (ej. DDL + Nuez)" value={newOptName} onChange={(e) => setNewOptName(e.target.value)} />
                <textarea className="neumorphic-inset" style={{ padding: '15px', border: 'none', borderRadius: '12px', minHeight: '120px', background: 'var(--bg-color)', color: 'inherit' }} placeholder="Lista de rellenos..." value={newOptIngr} onChange={(e) => setNewOptIngr(e.target.value)}></textarea>
                <button className="btn btn-primary" onClick={() => handleAddComponent('filling')}>Guardar Opción</button>
              </div>
              <div className="neumorphic" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Disponibles</h2>
                {renderComponentList(fillings, 'filling')}
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
