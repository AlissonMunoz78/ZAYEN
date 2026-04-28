import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

const VisitantesList = () => {
  const [visitantes, setVisitantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/visitantes').then(r => setVisitantes(r.data.visitantes || []))
      .catch(() => toast.error('Error al cargar visitantes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader category="GESTIÓN" title="Visitantes"
        action={
          <Link to="/visitantes/crear" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <FaPlus size={12} /> Registrar visitante
          </Link>
        }
      />
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div> : (
          <table className="data-table">
            <thead><tr><th>Nombre</th><th>Cédula</th><th>Institución</th><th>Fecha</th></tr></thead>
            <tbody>
              {visitantes.map(v => (
                <tr key={v._id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/visitantes/${v._id}`}>
                  <td style={{ fontWeight: '500' }}>{v.nombre}</td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{v.cedula}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{v.institucion}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(v.fecha).toLocaleDateString('es-EC')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && visitantes.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FaUsers style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }} />
            <p>No hay visitantes registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VisitantesList;
