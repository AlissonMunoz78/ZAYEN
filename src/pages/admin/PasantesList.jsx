import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

const PasantesList = () => {
  const [pasantes, setPasantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPasantes(); }, []);

  const fetchPasantes = async () => {
    try { const r = await api.get('/admin/pasantes'); setPasantes(r.data || []); }
    catch { toast.error('Error al cargar pasantes'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este pasante?')) return;
    try { await api.delete(`/admin/pasantes/${id}`); toast.success('Pasante eliminado'); fetchPasantes(); }
    catch (e) { toast.error(e.response?.data?.msg || 'Error'); }
  };

  return (
    <div>
      <PageHeader category="GESTIÓN" title="Pasantes"
        action={
          <Link to="/pasantes/crear" className="btn-primary" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', fontSize:'13px' }}>
            <FaPlus size={12} /> Crear pasante
          </Link>
        }
      />
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? <div style={{ padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>Cargando...</div> : (
          <table className="data-table">
            <thead><tr><th>Nombre</th><th>Email</th><th>Facultad</th><th>Horas</th><th style={{ textAlign:'center' }}>Acciones</th></tr></thead>
            <tbody>
              {pasantes.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight:'500' }}>{p.nombre}</td>
                  <td style={{ color:'var(--text-secondary)', fontSize:'13px' }}>{p.email}</td>
                  <td style={{ color:'var(--text-secondary)' }}>{p.facultad}</td>
                  <td><span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', background:'rgba(107,53,200,0.1)', color:'#a78bfa' }}>{p.horasDePasantia}h</span></td>
                  <td style={{ textAlign:'center' }}>
                    <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
                      <Link to={`/pasantes/editar/${p._id}`} style={{ background:'rgba(107,53,200,0.12)', color:'#6B35C8', border:'none', borderRadius:'6px', padding:'7px 10px', cursor:'pointer', textDecoration:'none', display:'flex', alignItems:'center' }}>
                        <FaEdit size={12} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} style={{ background:'rgba(232,22,107,0.12)', color:'#E8166B', border:'none', borderRadius:'6px', padding:'7px 10px', cursor:'pointer' }}>
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && pasantes.length === 0 && (
          <div style={{ padding:'60px', textAlign:'center', color:'var(--text-muted)' }}>
            <FaUsers style={{ fontSize:'32px', marginBottom:'12px', opacity:0.4 }} />
            <p>No hay pasantes registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PasantesList;
