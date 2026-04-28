import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import FormCard from '../../components/FormCard';

const CreateAdmini = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre:'', email:'', password:'', celular:'', tipo:'administrativo', facultad:'', horasDePasantia:0 });
  const [loading, setLoading] = useState(false);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/admin/adminis', form); toast.success('Admini creado'); navigate('/adminis'); }
    catch (e) { toast.error(e.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  const inputStyle = { marginBottom: '20px' };

  return (
    <FormCard title="Crear Admini" category="ADMINISTRACIÓN">
      <form onSubmit={handleSubmit}>
        {[['nombre','Nombre completo','text','Juan Pérez'],['email','Correo electrónico','email','correo@ejemplo.com'],['password','Contraseña','password','Mínimo 8 caracteres'],['celular','Celular','text','0999999999']].map(([name,label,type,ph]) => (
          <div key={name} style={inputStyle}>
            <label className="field-label">{label}</label>
            <input type={type} name={name} placeholder={ph} value={form[name]} onChange={h} className="input-field" required minLength={name==='password'?8:undefined} pattern={name==='celular'?'09[0-9]{8}':undefined} />
          </div>
        ))}
        <div style={inputStyle}>
          <label className="field-label">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={h} className="input-field">
            <option value="administrativo">Administrativo</option>
            <option value="estudiante">Estudiante</option>
          </select>
        </div>
        {form.tipo==='estudiante' && (<>
          <div style={inputStyle}>
            <label className="field-label">Facultad</label>
            <input type="text" name="facultad" placeholder="Ej: Ingeniería de Sistemas" value={form.facultad} onChange={h} className="input-field" required />
          </div>
          <div style={inputStyle}>
            <label className="field-label">Horas de pasantía</label>
            <input type="number" name="horasDePasantia" value={form.horasDePasantia} onChange={h} className="input-field" min="0" />
          </div>
        </>)}
        <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
          <button type="button" onClick={() => navigate('/adminis')} className="btn-outline" style={{ flex:1 }}>Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary" style={{ flex:2 }}>{loading ? 'Creando...' : 'Crear Admini'}</button>
        </div>
      </form>
    </FormCard>
  );
};
export default CreateAdmini;
