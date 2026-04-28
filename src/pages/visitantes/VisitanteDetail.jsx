import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaTrash, FaUserCircle } from 'react-icons/fa';
import api from '../../api/axios';

const VisitanteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visitante, setVisitante] = useState(null);

  useEffect(() => {
    api.get(`/visitantes/${id}`)
      .then(r => setVisitante(r.data))
      .catch(() => { toast.error('Error al cargar visitante'); navigate('/visitantes'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este visitante?')) return;
    try { await api.delete(`/visitantes/${id}`); toast.success('Visitante eliminado'); navigate('/visitantes'); }
    catch { toast.error('Error al eliminar'); }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <FaSpinner style={{ fontSize:'32px', color:'var(--c-cyan)', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth:'600px' }}>
      <button onClick={() => navigate('/visitantes')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer', fontSize:'13px', marginBottom:'24px' }}>
        <FaArrowLeft size={11} /> Volver a visitantes
      </button>
      <div style={{ marginBottom:'32px' }}>
        <div style={{ fontSize:'11px', color:'var(--c-cyan)', letterSpacing:'3px', marginBottom:'8px' }}>VISITANTES</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'32px', color:'var(--text-primary)' }}>Detalle del visitante</h1>
        <div style={{ width:'40px', height:'2px', background:'linear-gradient(90deg,#00D4C8,#6B35C8)', marginTop:'12px', borderRadius:'2px' }} />
      </div>
      <div className="glass-card" style={{ padding:'36px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'rgba(0,212,200,0.1)', border:'0.5px solid rgba(0,212,200,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FaUserCircle style={{ color:'var(--c-cyan)', fontSize:'28px' }} />
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'22px', color:'var(--text-primary)' }}>{visitante?.nombre}</div>
              <div style={{ fontSize:'13px', color:'var(--text-muted)' }}>{visitante?.institucion}</div>
            </div>
          </div>
          <button onClick={handleDelete} style={{ background:'rgba(232,22,107,0.1)', color:'var(--c-magenta)', border:'0.5px solid rgba(232,22,107,0.2)', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
            <FaTrash size={12} /> Eliminar
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
          {[['Cédula', visitante?.cedula], ['Institución', visitante?.institucion], ['Fecha de visita', visitante?.fecha ? new Date(visitante.fecha).toLocaleDateString('es-EC',{year:'numeric',month:'long',day:'numeric'}) : '—']].map(([label, value]) => (
            <div key={label} style={{ padding:'16px', background:'var(--bg-tertiary)', borderRadius:'10px' }}>
              <div style={{ fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.5px', marginBottom:'6px' }}>{label}</div>
              <div style={{ fontSize:'15px', color:'var(--text-primary)', fontWeight:'500' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default VisitanteDetail;
