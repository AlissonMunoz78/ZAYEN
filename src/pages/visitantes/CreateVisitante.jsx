import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import FormCard from '../../components/FormCard';

const CreateVisitante = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre:'', cedula:'', institucion:'' });
  const [loading, setLoading] = useState(false);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/visitantes', form); toast.success('Visitante registrado'); navigate('/visitantes'); }
    catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <FormCard title="Registrar Visitante" category="VISITANTES">
      <form onSubmit={handleSubmit}>
        {[['nombre','Nombre completo','text','Carlos Rodríguez'],['cedula','Cédula (10 dígitos)','text','1234567890'],['institucion','Institución','text','Universidad XYZ']].map(([name,label,type,ph]) => (
          <div key={name} style={{ marginBottom:'20px' }}>
            <label className="field-label">{label}</label>
            <input type={type} name={name} value={form[name]} onChange={h} placeholder={ph} className="input-field"
              pattern={name==='cedula'?'[0-9]{10}':undefined} maxLength={name==='cedula'?10:undefined} required />
          </div>
        ))}
        <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
          <button type="button" onClick={() => navigate('/visitantes')} className="btn-outline" style={{ flex:1 }}>Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex:2 }}>{loading ? 'Registrando...' : 'Registrar visitante'}</button>
        </div>
      </form>
    </FormCard>
  );
};
export default CreateVisitante;
