import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import api from '../../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nuevaPassword:'', confirmarPassword:'' });
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    api.get(`/admin/recuperar-password/${token}`)
      .then(() => setValid(true))
      .catch(() => { setValid(false); toast.error('Token inválido'); })
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.nuevaPassword !== form.confirmarPassword) { toast.error('Las contraseñas no coinciden'); return; }
    if (form.nuevaPassword.length < 8) { toast.error('Mínimo 8 caracteres'); return; }
    setLoading(true);
    try { await api.post(`/admin/recuperar-password/${token}`, { nuevaPassword: form.nuevaPassword }); toast.success('Contraseña actualizada'); setTimeout(() => navigate('/login'), 2000); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  if (validating) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)' }}>
      <FaSpinner style={{ fontSize:'32px', color:'var(--c-cyan)', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:'40px' }}>
      <div className="glass-card" style={{ width:'100%', maxWidth:'420px', padding:'48px' }}>
        {!valid ? (
          <div style={{ textAlign:'center' }}>
            <FaTimesCircle style={{ fontSize:'56px', color:'var(--c-magenta)', marginBottom:'20px' }} />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', color:'var(--text-primary)', marginBottom:'12px' }}>Token inválido</h2>
            <p style={{ color:'var(--text-secondary)', marginBottom:'24px' }}>El enlace ha expirado o no es válido.</p>
            <Link to="/forgot-password" className="btn-primary" style={{ textDecoration:'none', display:'inline-block', padding:'10px 28px' }}>Solicitar nuevo enlace</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:'36px' }}>
              <div style={{ fontSize:'11px', color:'var(--c-cyan)', letterSpacing:'3px', marginBottom:'12px' }}>SEGURIDAD</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', color:'var(--text-primary)' }}>Nueva contraseña</h1>
              <div style={{ width:'32px', height:'2px', background:'linear-gradient(90deg,#00D4C8,#6B35C8)', marginTop:'16px', borderRadius:'2px' }} />
            </div>
            <form onSubmit={handleSubmit}>
              {[['nuevaPassword','Nueva contraseña'],['confirmarPassword','Confirmar contraseña']].map(([name,label]) => (
                <div key={name} style={{ marginBottom:'20px' }}>
                  <label className="field-label">{label}</label>
                  <div style={{ position:'relative' }}>
                    <FaLock style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'14px' }} />
                    <input type="password" name={name} value={form[name]} onChange={h} placeholder="Mínimo 8 caracteres" className="input-field" style={{ paddingLeft:'40px' }} minLength={8} required />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', padding:'13px', marginTop:'8px' }}>
                {loading ? <><FaSpinner style={{ animation:'spin 1s linear infinite', marginRight:'8px' }} />Actualizando...</> : 'Restablecer contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
export default ResetPassword;
