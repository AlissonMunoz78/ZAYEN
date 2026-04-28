import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import api from '../../api/axios';

const PublicDisponibilidad = () => {
  const [fecha, setFecha] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSearch = async e => {
    e.preventDefault(); setLoading(true);
    try { const r = await api.get(`/publico/visitas/disponibilidad?fecha=${fecha}`); setData(r.data); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error al consultar'); setData(null); }
    finally { setLoading(false); }
  };

  const colorMap = { completo:['#E8166B','rgba(232,22,107,0.1)'], casi_lleno:['#f59e0b','rgba(245,158,11,0.1)'], disponible:['#00D4C8','rgba(0,212,200,0.1)'] };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', padding:'80px 40px 40px' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <div style={{ marginBottom:'8px' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', textDecoration:'none', fontSize:'13px' }}>
            <FaArrowLeft size={11} /> Volver
          </Link>
        </div>
        <div style={{ marginBottom:'40px', marginTop:'20px' }}>
          <div style={{ fontSize:'11px', color:'var(--c-cyan)', letterSpacing:'3px', marginBottom:'12px' }}>DISPONIBILIDAD</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'36px', color:'var(--text-primary)' }}>Consultar horarios</h1>
          <div style={{ width:'40px', height:'2px', background:'linear-gradient(90deg,#00D4C8,#6B35C8)', marginTop:'16px', borderRadius:'2px' }} />
        </div>
        <div className="glass-card" style={{ padding:'32px', marginBottom:'24px' }}>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:'12px' }}>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} min={minDate} className="input-field" style={{ flex:1 }} required />
            <button type="submit" className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap' }}>
              <FaSearch size={12} /> Consultar
            </button>
          </form>
        </div>
        {loading && <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>Consultando disponibilidad...</div>}
        {data && !loading && (
          <>
            <div className="glass-card" style={{ padding:'20px 28px', marginBottom:'20px', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
              {[['Fecha',data.fecha],['Día',data.diaSemana],['Horario',data.horarioAtencion],['Capacidad por bloque',`${data.capacidadMaximaPorBloque} personas`]].map(([k,v]) => (
                <div key={k}><span style={{ fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.5px' }}>{k}: </span><span style={{ fontSize:'14px', color:'var(--text-primary)', fontWeight:'500' }}>{v}</span></div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
              {data.bloques.map(b => {
                const [color, bg] = colorMap[b.estado] || ['var(--text-muted)','var(--bg-card)'];
                return (
                  <div key={b.hora} className="glass-card" style={{ padding:'20px', borderLeft:`2px solid ${color}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', color:'var(--text-primary)' }}>{b.hora}</span>
                      <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', color, background:bg }}>{b.estado}</span>
                    </div>
                    <div style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{b.ocupados}/{b.capacidadMaxima} ocupados</div>
                    <div style={{ fontSize:'13px', color }}>
                      {b.disponibles} disponibles
                    </div>
                    <div style={{ marginTop:'8px', height:'4px', background:'var(--bg-tertiary)', borderRadius:'2px', overflow:'hidden' }}>
                      <div style={{ width:`${b.porcentajeOcupacion}%`, height:'100%', background:color, borderRadius:'2px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default PublicDisponibilidad;
