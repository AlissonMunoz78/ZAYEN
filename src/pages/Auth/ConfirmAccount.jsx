import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import api from '../../api/axios';

const ConfirmAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get(`/admin/confirmar/${token}`)
      .then(r => { setStatus('success'); toast.success(r.data.msg); setTimeout(() => navigate('/login'), 3000); })
      .catch(() => { setStatus('error'); toast.error('Token inválido o expirado'); });
  }, [token]);

  const icons = { loading: <FaSpinner style={{ fontSize:'56px', color:'var(--c-cyan)', animation:'spin 1s linear infinite' }} />, success: <FaCheckCircle style={{ fontSize:'56px', color:'var(--c-cyan)', filter:'drop-shadow(0 0 16px rgba(0,212,200,0.4))' }} />, error: <FaTimesCircle style={{ fontSize:'56px', color:'var(--c-magenta)', filter:'drop-shadow(0 0 16px rgba(232,22,107,0.4))' }} /> };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:'40px' }}>
      <div className="glass-card" style={{ width:'100%', maxWidth:'420px', padding:'48px', textAlign:'center' }}>
        <div style={{ marginBottom:'20px' }}>{icons[status]}</div>
        {status==='loading' && <><h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', color:'var(--text-primary)', marginBottom:'8px' }}>Confirmando cuenta...</h2><p style={{ color:'var(--text-secondary)' }}>Por favor espera</p></>}
        {status==='success' && <><h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', color:'var(--text-primary)', marginBottom:'8px' }}>¡Cuenta confirmada!</h2><p style={{ color:'var(--text-secondary)', marginBottom:'24px' }}>Redirigiendo al login...</p><Link to="/login" style={{ color:'var(--c-cyan)', textDecoration:'none' }}>Ir al login ahora</Link></>}
        {status==='error' && <><h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'24px', color:'var(--text-primary)', marginBottom:'8px' }}>Token inválido</h2><p style={{ color:'var(--text-secondary)', marginBottom:'24px' }}>El token ha expirado. Contacta al administrador.</p><Link to="/login" className="btn-primary" style={{ textDecoration:'none', display:'inline-block', padding:'10px 28px' }}>Volver al login</Link></>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
export default ConfirmAccount;
