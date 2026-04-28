import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import api from '../../api/axios';
import FormCard from '../../components/FormCard';

const DonacionEconomica = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombreDonante:'', institucion:'', monto:'', descripcion:'' });
  const [processing, setProcessing] = useState(false);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setProcessing(true);
    try {
      const r = await api.post('/donaciones/economica', form);
      const donacionId = r.data.donacion?.id || r.data.donacion?._id;
      const pay = await api.post('/donaciones/pago', { donacionId });
      window.location.href = pay.data.url;
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); setProcessing(false); }
  };

  return (
    <FormCard title="Donación Económica" category="DONACIONES">
      <div style={{ marginBottom:'28px', padding:'14px 16px', background:'rgba(0,212,200,0.06)', border:'0.5px solid rgba(0,212,200,0.2)', borderRadius:'10px', display:'flex', gap:'10px', alignItems:'flex-start', fontSize:'13px', color:'var(--text-secondary)' }}>
        <FaLock style={{ color:'var(--c-cyan)', marginTop:'2px', flexShrink:0 }} />
        Serás redirigido a Stripe para completar el pago de forma segura.
      </div>
      <form onSubmit={handleSubmit}>
        {[['nombreDonante','Nombre del donante','text','Juan Pérez'],['institucion','Institución','text','Empresa XYZ']].map(([name,label,type,ph]) => (
          <div key={name} style={{ marginBottom:'20px' }}>
            <label className="field-label">{label}</label>
            <input type={type} name={name} value={form[name]} onChange={h} placeholder={ph} className="input-field" required />
          </div>
        ))}
        <div style={{ marginBottom:'20px' }}>
          <label className="field-label">Monto (USD)</label>
          <input type="number" name="monto" value={form.monto} onChange={h} placeholder="100.00" min="0.01" step="0.01" className="input-field" required />
        </div>
        <div style={{ marginBottom:'28px' }}>
          <label className="field-label">Descripción (opcional)</label>
          <textarea name="descripcion" value={form.descripcion} onChange={h} placeholder="Propósito de la donación..." rows="3" className="input-field" style={{ resize:'vertical' }} />
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <button type="button" onClick={() => navigate('/donaciones')} className="btn-outline" style={{ flex:1 }}>Cancelar</button>
          <button type="submit" disabled={processing} className="btn-primary" style={{ flex:2 }}>{processing ? 'Procesando...' : 'Proceder al pago'}</button>
        </div>
      </form>
    </FormCard>
  );
};
export default DonacionEconomica;
