import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../components/LoginModal';
import storeAuth from '../../context/storeAuth';

// La ruta /login ahora muestra el modal sobre un fondo oscuro
// Esto garantiza que funcione tanto el modal desde el Home como la ruta directa
const Login = () => {
  const navigate = useNavigate();
  const { token } = storeAuth();

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token]);

  const handleClose = () => navigate('/', { replace: true });

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', position:'relative' }}>
      <LoginModal onClose={handleClose} />
    </div>
  );
};

export default Login;
