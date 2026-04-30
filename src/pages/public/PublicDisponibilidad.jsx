import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';

const PublicDisponibilidad = () => {
  const [fecha, setFecha] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

  const [form, setForm] = useState({
    institucion: '',
    cantidadPersonas: 1
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSearch = async e => {
    e.preventDefault();

    if (!fecha) return toast.error('Selecciona una fecha');

    setLoading(true);

    try {
      const r = await api.get(
        `/publico/visitas/disponibilidad?fecha=${fecha}`
      );
      setData(r.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al consultar');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (bloque) => {
    if (bloque.disponibles <= 0) {
      return toast.error('Este horario está lleno');
    }

    setBloqueSeleccionado(bloque);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setForm({ institucion: '', cantidadPersonas: 1 });
    setBloqueSeleccionado(null);
  };

  const reservar = async () => {
    if (!fecha) return toast.error('Selecciona fecha');
    if (!bloqueSeleccionado?.hora) return toast.error('Selecciona horario');
    if (!form.institucion.trim()) return toast.error('Ingrese institución');

    try {
      await api.post('/publico/visitas', {
        institucion: form.institucion,
        cantidadPersonas: form.cantidadPersonas,
        fecha,
        hora: bloqueSeleccionado.hora
      });

      toast.success('Reserva registrada');

      cerrarModal();

      const r = await api.get(
        `/publico/visitas/disponibilidad?fecha=${fecha}`
      );

      setData(r.data);

    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al reservar');
    }
  };

  const colorMap = {
    completo: ['#E8166B', 'rgba(232,22,107,0.1)'],
    casi_lleno: ['#f59e0b', 'rgba(245,158,11,0.1)'],
    disponible: ['#00D4C8', 'rgba(0,212,200,0.1)']
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '80px 40px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '8px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>
            <FaArrowLeft size={11} /> Volver
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
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

        {loading && <div style={{ textAlign: 'center' }}>Consultando...</div>}

        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px' }}>
            {data.bloques.map(b => {
              const [color, bg] = colorMap[b.estado];

              return (
                <div
                  key={b.hora}
                  className="glass-card"
                  onClick={() => abrirModal(b)}
                  style={{ padding: '20px', borderLeft: `2px solid ${color}`, cursor: 'pointer' }}
                >
                  <div>{b.hora}</div>
                  <div>{b.disponibles} disponibles</div>
                </div>
              );
            })}
          </div>
        )}

        {modalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '30px', width: '400px' }}>

              <h3>{bloqueSeleccionado?.hora}</h3>

              <input
                placeholder="Institución"
                className="input-field"
                value={form.institucion}
                onChange={e => setForm({ ...form, institucion: e.target.value })}
              />

              <input
                type="number"
                min="1"
                max="20"
                className="input-field"
                value={form.cantidadPersonas}
                onChange={e => setForm({ ...form, cantidadPersonas: Number(e.target.value) })}
              />

              <button className="btn-primary" onClick={reservar}>
                Registrar
              </button>

              <button className="btn-secondary" onClick={cerrarModal}>
                Cancelar
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicDisponibilidad;