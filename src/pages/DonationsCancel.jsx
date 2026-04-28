import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

export const DonationsCancel = () => (
  <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'var(--bg-primary)', padding:'40px', textAlign:'center' }}>
    <FaTimesCircle style={{ fontSize:'72px', color:'#E8166B', marginBottom:'24px', filter:'drop-shadow(0 0 20px rgba(232,22,107,0.4))' }} />
    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'36px', color:'var(--text-primary)', marginBottom:'16px' }}>Donación cancelada</h2>
    <p style={{ color:'var(--text-secondary)', marginBottom:'32px' }}>Puedes intentarlo nuevamente cuando estés listo.</p>
    <Link to="/" className="btn-primary">Volver al inicio</Link>
  </div>
);
