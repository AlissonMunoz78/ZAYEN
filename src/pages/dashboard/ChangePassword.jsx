import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaKey } from 'react-icons/fa';
import api from '../../api/axios';
import FormCard from '../../components/FormCard';

const ChangePassword = () => {
  const [form, setForm] = useState({ actualPassword:'', nuevaPassword:'', confirmarPassword:'' });
  const [loading, setLoading] = useState(false);
  const h = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.nuevaPassword !== form.confirmarPassword) { toast.error('Las contraseñas no coinciden'); return; }
    if (form.nuevaPassword.length < 8) { toast.error('Mínimo 8 caracteres'); return; }
    setLoading(true);
    try {
      await api.put('/admin/cambiar-password', { actualPassword: form.actualPassword, nuevaPassword: form.nuevaPassword });
      toast.success('Contraseña actualizada');
      setForm({ actualPassword:'', nuevaPassword:'', confirmarPassword:'' });
    } catch (err) { toast.error(err.response?.data?.msg || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <FormCard title="Cambiar Contraseña" category="SEGURIDAD">
      <div style={{ display:'flex', justifyContent:'center', marginBottom:'28px' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'rgba(0,212,200,0.1)', border:'0.5px solid rgba(0,212,200,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FaKey style={{ color:'var(--c-cyan)', fontSize:'22px' }} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {[['actualPassword','Contraseña actual'],['nuevaPassword','Nueva contraseña'],['confirmarPassword','Confirmar nueva contraseña']].map(([name, label]) => (
          <div key={name} style={{ marginBottom:'20px' }}>
            <label className="field-label">{label}</label>
            <input type="password" name={name} value={form[name]} onChange={h}
              placeholder={name==='actualPassword' ? '••••••••' : 'Mínimo 8 caracteres'}
              className="input-field" minLength={name!=='actualPassword'?8:undefined} required />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', marginTop:'8px', padding:'13px' }}>
          {loading ? 'Actualizando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </FormCard>
  );
};
export default ChangePassword;
