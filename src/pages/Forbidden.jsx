import { Link } from 'react-router-dom';
import dinoImg from '../assets/dino.jpg';

export const Forbidden = () => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'var(--bg-primary)', padding:'40px' }}>
    <img src={dinoImg} alt="Prohibido" style={{ width:'180px', height:'180px', objectFit:'cover', borderRadius:'50%', marginBottom:'32px', border:'2px solid rgba(232,22,107,0.4)', filter:'drop-shadow(0 0 20px rgba(232,22,107,0.2))' }} />
    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'48px', color:'var(--text-muted)', marginBottom:'8px', opacity:0.3 }}>403</div>
    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', color:'var(--text-primary)', marginBottom:'12px' }}>Acceso denegado</h1>
    <p style={{ color:'var(--text-secondary)', marginBottom:'32px' }}>No tienes permisos para ver esta página.</p>
    <Link to="/dashboard" className="btn-primary">Ir al dashboard</Link>
  </div>
);
