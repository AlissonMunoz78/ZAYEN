import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import FormCard from '../../components/FormCard';

const CreatePasante = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre:'', email:'', facultad:'', celular:'', horasDePasantia:0 });
  const [loading, setLoading] = useState(false);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/admin/pasantes', form); toast.success('Pasante creado'); navigate('/pasantes'); }
    catch (e) { toast.error(e.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <FormCard title="Crear Pasante" category="GESTIÓN">
      <form onSubmit={handleSubmit}>
        {[['nombre','Nombre completo','text','María García'],['email','Correo electrónico','email','correo@epn.edu.ec'],['facultad','Facultad','text','Ingeniería de Sistemas'],['celular','Celular','text','0999999999']].map(([name,label,type,ph]) => (
          <div key={name} style={{ marginBottom:'20px' }}>
            <label className="field-label">{label}</label>
            <input type={type} name={name} placeholder={ph} value={form[name]} onChange={h} className="input-field" required pattern={name==='celular'?'09[0-9]{8}':undefined} />
          </div>
        ))}
        <div style={{ marginBottom:'24px' }}>
          <label className="field-label">Horas de pasantía</label>
          <input type="number" name="horasDePasantia" value={form.horasDePasantia} onChange={h} className="input-field" min="0" />
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <button type="button" onClick={() => navigate('/pasantes')} className="btn-outline" style={{ flex:1 }}>Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex:2 }}>{loading ? 'Creando...' : 'Crear Pasante'}</button>
        </div>
      </form>
    </FormCard>
  );
};
export default CreatePasante;
