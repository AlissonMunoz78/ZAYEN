import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import api from '../../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/admin/recuperar-password', { email }); setSent(true); toast.success('Correo enviado'); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error al enviar correo'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:'40px' }}>
      <div className="glass-card" style={{ width:'100%', maxWidth:'420px', padding:'48px' }}>
        {sent ? (
          <div style={{ textAlign:'center' }}>
            <FaCheckCircle style={{ fontSize:'56px', color:'var(--c-cyan)', marginBottom:'20px', filter:'drop-shadow(0 0 16px rgba(0,212,200,0.4))' }} />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', color:'var(--text-primary)', marginBottom:'12px' }}>¡Correo enviado!</h2>
            <p style={{ color:'var(--text-secondary)', marginBottom:'28px', lineHeight:1.7 }}>Revisa tu bandeja de entrada en <strong style={{ color:'var(--text-primary)' }}>{email}</strong> y sigue las instrucciones.</p>
            <Link to="/login" className="btn-primary" style={{ textDecoration:'none', display:'inline-block', padding:'12px 32px' }}>Volver al login</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:'36px' }}>
              <div style={{ fontSize:'11px', color:'var(--c-cyan)', letterSpacing:'3px', marginBottom:'12px' }}>RECUPERACIÓN</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', color:'var(--text-primary)', marginBottom:'8px' }}>Recuperar contraseña</h1>
              <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>Ingresa tu correo para recibir instrucciones.</p>
              <div style={{ width:'32px', height:'2px', background:'linear-gradient(90deg,#00D4C8,#6B35C8)', marginTop:'16px', borderRadius:'2px' }} />
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:'24px' }}>
                <label className="field-label">Correo electrónico</label>
                <div style={{ position:'relative' }}>
                  <FaEnvelope style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'14px' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
                    className="input-field" style={{ paddingLeft:'40px' }} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', padding:'13px' }}>
                {loading ? <><FaSpinner style={{ animation:'spin 1s linear infinite', marginRight:'8px' }} />Enviando...</> : 'Enviar instrucciones'}
              </button>
            </form>
            <div style={{ textAlign:'center', marginTop:'24px' }}>
              <Link to="/login" style={{ fontSize:'13px', color:'var(--text-muted)', textDecoration:'none' }}>← Volver al login</Link>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
export default ForgotPassword;
