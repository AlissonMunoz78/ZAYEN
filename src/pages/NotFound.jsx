import { Link } from 'react-router-dom';
import dinoRepair from '../assets/dino-repair.png';

export const NotFound = () => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'var(--bg-primary)', padding:'40px' }}>
    <img src={dinoRepair} alt="No encontrado" style={{ width:'200px', height:'200px', objectFit:'contain', marginBottom:'32px', filter:'drop-shadow(0 0 20px rgba(0,212,200,0.3))' }} />
    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'48px', color:'var(--text-muted)', marginBottom:'8px', opacity:0.3 }}>404</div>
    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', color:'var(--text-primary)', marginBottom:'12px' }}>Página no encontrada</h1>
    <p style={{ color:'var(--text-secondary)', marginBottom:'32px', textAlign:'center', maxWidth:'400px', lineHeight:1.7 }}>La ruta que buscas no existe. Verifica la URL o regresa al inicio.</p>
    <Link to="/" className="btn-primary">Volver al inicio</Link>
  </div>
);
