import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

const Disponibilidad = () => {
  const [fecha, setFecha] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const colorMap = { completo:['#E8166B','rgba(232,22,107,0.1)'], casi_lleno:['#f59e0b','rgba(245,158,11,0.1)'], disponible:['#00D4C8','rgba(0,212,200,0.1)'] };

  const handleSearch = async e => {
    e.preventDefault(); setLoading(true);
    try { const r = await api.get(`/visitas/disponibilidad?fecha=${fecha}`); setData(r.data); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); setData(null); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader category="VISITAS" title="Consultar disponibilidad" />
      <div className="glass-card" style={{ padding:'28px', marginBottom:'24px' }}>
        <form onSubmit={handleSearch} style={{ display:'flex', gap:'12px' }}>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} min={minDate} className="input-field" style={{ flex:1 }} required />
          <button type="submit" className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap' }}>
            <FaSearch size={12} /> Consultar
          </button>
        </form>
      </div>
      {loading && <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>Consultando...</div>}
      {data && !loading && (
        <>
          <div className="glass-card" style={{ padding:'20px 28px', marginBottom:'20px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
            {[['Fecha',data.fecha],['Día',data.diaSemana],['Horario',data.horarioAtencion],['Cap./bloque',`${data.capacidadMaximaPorBloque} pers.`]].map(([k,v]) => (
              <div key={k}><div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{k}</div><div style={{ fontSize:'14px', color:'var(--text-primary)', fontWeight:'500' }}>{v}</div></div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'16px' }}>
            {data.bloques.map(b => {
              const [color, bg] = colorMap[b.estado] || ['var(--text-muted)','var(--bg-card)'];
              return (
                <div key={b.hora} className="glass-card" style={{ padding:'20px', borderLeft:`2px solid ${color}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', color:'var(--text-primary)' }}>{b.hora}</span>
                    <span style={{ padding:'2px 8px', borderRadius:'20px', fontSize:'10px', color, background:bg }}>{b.estado}</span>
                  </div>
                  <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'4px' }}>{b.ocupados}/{b.capacidadMaxima} ocupados</div>
                  <div style={{ fontSize:'13px', color }}>{b.disponibles} disponibles</div>
                  <div style={{ marginTop:'10px', height:'4px', background:'var(--bg-tertiary)', borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ width:`${b.porcentajeOcupacion}%`, height:'100%', background:color, borderRadius:'2px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default Disponibilidad;
