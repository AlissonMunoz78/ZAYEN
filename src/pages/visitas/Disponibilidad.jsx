import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';

const Disponibilidad = () => {
  const [fecha, setFecha] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bloqueSel, setBloqueSel] = useState(null);
  const [personas, setPersonas] = useState({ adultos: 0, estudiantes: 0 });

  const MAX = 20;
  const total = personas.adultos + personas.estudiantes;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSearch = async e => {
    e.preventDefault();

    if (!fecha) return toast.error('Selecciona una fecha');

    setLoading(true);
    try {
      const r = await api.get(
        `/visitas/disponibilidad?fecha=${fecha}`
      );
      setData(r.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    completo: ['#E8166B', 'rgba(232,22,107,0.1)'],
    casi_lleno: ['#f59e0b', 'rgba(245,158,11,0.1)'],
    disponible: ['#00D4C8', 'rgba(0,212,200,0.1)']
  };

  const change = (tipo, op) => {
    if (op === '+') {
      if (total >= MAX) return toast.warning('Máx 20');
      setPersonas(p => ({ ...p, [tipo]: p[tipo] + 1 }));
    } else {
      setPersonas(p => ({ ...p, [tipo]: Math.max(0, p[tipo] - 1) }));
    }
  };

  const agendar = async () => {
    if (!fecha) return toast.error('Selecciona fecha');
    if (!bloqueSel?.hora) return toast.error('Selecciona bloque');
    if (total === 0) return toast.error('Agrega personas');

    try {
      await api.post('/visitas', {
        fecha,
        hora: bloqueSel.hora,
        ...personas
      });

      const r = await api.get(
        `/visitas/disponibilidad?fecha=${fecha}`
      );

      setData(r.data);
      setBloqueSel(null);
      setPersonas({ adultos: 0, estudiantes: 0 });

    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al agendar');
    }
  };

  return (
    <div>
      <PageHeader category="VISITAS" title="Consultar disponibilidad" />

      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            min={minDate}
            className="input-field"
            style={{ flex: 1 }}
            required
          />
          <button type="submit" className="btn-primary">
            <FaSearch size={12} /> Consultar
          </button>
        </form>
      </div>

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' }}>
          {data.bloques.map(b => {
            const [color] = colorMap[b.estado];

            return (
              <div
                key={b.hora}
                onClick={() => setBloqueSel(b)}
                className="glass-card"
                style={{ padding: '20px', borderLeft: `2px solid ${color}`, cursor: 'pointer' }}
              >
                {b.hora} - {b.disponibles}
              </div>
            );
          })}
        </div>
      )}

      {bloqueSel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '28px', width: '400px' }}>

            <h3>{bloqueSel.hora}</h3>

            {['adultos', 'estudiantes'].map(t => (
              <div key={t} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <span>{t}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => change(t, '-')} type="button">-</button>
                  {personas[t]}
                  <button onClick={() => change(t, '+')} type="button">+</button>
                </div>
              </div>
            ))}

            <button className="btn-primary" style={{ width: '100%' }} onClick={agendar}>
              Agendar ({total})
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Disponibilidad;