import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export const DonationsSuccess = () => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'var(--bg-primary)', padding:'40px', textAlign:'center' }}>
    <FaCheckCircle style={{ fontSize:'72px', color:'#00D4C8', marginBottom:'24px', filter:'drop-shadow(0 0 20px rgba(0,212,200,0.4))' }} />
    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'36px', color:'var(--text-primary)', marginBottom:'16px' }}>¡Gracias por tu donación!</h2>
    <p style={{ color:'var(--text-secondary)', marginBottom:'32px', maxWidth:'400px', lineHeight:1.7 }}>Tu aporte contribuye a preservar el conocimiento y la ciencia en el Ecuador.</p>
    <Link to="/" className="btn-primary">Volver al inicio</Link>
  </div>
);
