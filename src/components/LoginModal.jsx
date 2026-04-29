import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import api from '../api/axios';
import storeAuth from '../context/storeAuth';

const LoginModal = ({ onClose }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setRol } = storeAuth();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Variable correcta en Vite
  const BASE_URL =
    import.meta.env.VITE_URL_BACKEND ||
    'https://backend-zayen.onrender.com/api';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const r = await api.post(`${BASE_URL}/admin/login`, form);

      if (r.data?.token) {
        setToken(r.data.token);
        setRol(r.data.admin?.rol);
        toast.success(r.data.msg);
        onClose?.();
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(
        err.response?.data?.msg || err.message || 'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" style={{ maxWidth: '460px' }}>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = 'var(--bg-card-hover)')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.background = 'var(--bg-tertiary)')
          }
        >
          <FaTimes size={14} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '32px',
              fontWeight: '600',
              background: 'linear-gradient(135deg,#00D4C8,#6B35C8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px',
              marginBottom: '4px',
            }}
          >
            ZAYEN
          </div>

          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}
          >
            ACCESO AL SISTEMA
          </div>

          <div className="accent-line" />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="field-label">Correo electrónico</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="input-field"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label className="field-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <FaLock
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar al sistema'}
          </button>
        </form>

        {/* Divisor */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          gap: '14px'
        }}>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>O</span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--border-color)' }} />
        </div>

        {/* Botón Google estilo imagen */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '14px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            style={{ width: '20px', height: '20px' }}
          />
          Continuar con Google
        </button>

      </div>
    </div>
  );
};

export default LoginModal;