import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBookOpen, FaArrowLeft, FaCheckCircle, FaCamera } from 'react-icons/fa';
import api from '../../api/axios';

const PublicDonacionBienes = () => {
  const [form, setForm] = useState({ nombreDonante:'', institucion:'', descripcionBien:'', estadoBien:'nuevo', descripcion:'' });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => {
    const f = e.target.files[0]; setFoto(f);
    if (f) { const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(f); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!foto) { toast.error('Debes subir una foto del bien'); return; }
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => data.append(k, v));
    data.append('fotoBien', foto);
    try { await api.post('/publico/donacion/bienes', data, { headers:{ 'Content-Type':'multipart/form-data' } }); setDone(true); toast.success('Donación registrada'); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', padding:'40px' }}>
      <div className="glass-card" style={{ width:'100%', maxWidth:'500px', padding:'48px' }}>
        {done ? (
          <div style={{ textAlign:'center' }}>
            <FaCheckCircle style={{ fontSize:'64px', color:'var(--c-cyan)', marginBottom:'20px', filter:'drop-shadow(0 0 16px rgba(0,212,200,0.4))' }} />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', color:'var(--text-primary)', marginBottom:'12px' }}>¡Donación registrada!</h2>
            <p style={{ color:'var(--text-secondary)', marginBottom:'32px', lineHeight:1.7 }}>El equipo del museo revisará tu donación. ¡Gracias por tu generosidad!</p>
            <Link to="/" className="btn-primary" style={{ textDecoration:'none', display:'inline-block', padding:'12px 32px' }}>Volver al inicio</Link>
          </div>
        ) : (
          <>
            <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', textDecoration:'none', fontSize:'13px', marginBottom:'28px' }}>
              <FaArrowLeft size={11} /> Volver al inicio
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'32px' }}>
              <div style={{ width:'52px', height:'52px', borderRadius:'12px', background:'rgba(107,53,200,0.1)', border:'0.5px solid rgba(107,53,200,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <FaBookOpen style={{ color:'var(--c-purple)', fontSize:'22px' }} />
              </div>
              <div>
                <div style={{ fontSize:'11px', color:'var(--c-purple)', letterSpacing:'3px', marginBottom:'4px' }}>DONACIÓN</div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'26px', color:'var(--text-primary)' }}>Donación de bienes</h1>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              {[['nombreDonante','Nombre del donante','María García'],['institucion','Institución','Empresa XYZ']].map(([name,label,ph]) => (
                <div key={name} style={{ marginBottom:'20px' }}>
                  <label className="field-label">{label}</label>
                  <input type="text" name={name} value={form[name]} onChange={h} placeholder={ph} className="input-field" required />
                </div>
              ))}
              <div style={{ marginBottom:'20px' }}>
                <label className="field-label">Descripción del bien</label>
                <textarea name="descripcionBien" value={form.descripcionBien} onChange={h} placeholder="Describe detalladamente el bien..." rows="3" className="input-field" style={{ resize:'vertical' }} required />
              </div>
              <div style={{ marginBottom:'20px' }}>
                <label className="field-label">Estado del bien</label>
                <select name="estadoBien" value={form.estadoBien} onChange={h} className="input-field">
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
              <div style={{ marginBottom:'20px' }}>
                <label className="field-label">Foto del bien *</label>
                <label style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:'var(--bg-tertiary)', border:'1px dashed var(--border-color)', borderRadius:'10px', cursor:'pointer', color:'var(--text-secondary)', fontSize:'14px' }}>
                  <FaCamera style={{ color:'var(--c-cyan)' }} />
                  {foto ? foto.name : 'Seleccionar imagen...'}
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} required />
                </label>
                {preview && <img src={preview} alt="Preview" style={{ marginTop:'12px', width:'100%', height:'160px', objectFit:'cover', borderRadius:'8px' }} />}
              </div>
              <div style={{ marginBottom:'28px' }}>
                <label className="field-label">Notas adicionales (opcional)</label>
                <textarea name="descripcion" value={form.descripcion} onChange={h} placeholder="Información adicional..." rows="2" className="input-field" style={{ resize:'vertical' }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', padding:'13px' }}>
                {loading ? 'Registrando...' : 'Registrar donación'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default PublicDonacionBienes;
