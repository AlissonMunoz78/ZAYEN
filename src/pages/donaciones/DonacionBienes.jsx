import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';
import api from '../../api/axios';
import FormCard from '../../components/FormCard';

const DonacionBienes = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombreDonante:'', institucion:'', descripcionBien:'', estadoBien:'nuevo', descripcion:'' });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
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
    Object.entries(form).forEach(([k,v]) => data.append(k,v));
    data.append('fotoBien', foto);
    try { await api.post('/donaciones/bienes', data, { headers:{ 'Content-Type':'multipart/form-data' } }); toast.success('Donación registrada'); navigate('/donaciones'); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <FormCard title="Donación de Bienes" category="DONACIONES">
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
        <div style={{ display:'flex', gap:'12px' }}>
          <button type="button" onClick={() => navigate('/donaciones')} className="btn-outline" style={{ flex:1 }}>Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex:2 }}>{loading ? 'Registrando...' : 'Registrar donación'}</button>
        </div>
      </form>
    </FormCard>
  );
};
export default DonacionBienes;
