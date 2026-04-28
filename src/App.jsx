import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import { Home } from './pages/Home';
import Login from './pages/Auth/Login';
import GoogleCallback from './pages/Auth/GoogleCallback';
import ConfirmAccount from './pages/Auth/ConfirmAccount';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import ChangePassword from './pages/dashboard/ChangePassword';
import AdminisList from './pages/admin/AdminisList';
import CreateAdmini from './pages/admin/CreateAdmini';
import EditAdmini from './pages/admin/EditAdmini';
import PasantesList from './pages/admin/PasantesList';
import CreatePasante from './pages/admin/CreatePasante';
import EditPasante from './pages/admin/EditPasante';
import VisitasList from './pages/visitas/VisitasList';
import CreateVisita from './pages/visitas/CreateVisita';
import Disponibilidad from './pages/visitas/Disponibilidad';
import DonacionesList from './pages/donaciones/DonacionesList';
import DonacionEconomica from './pages/donaciones/DonacionEconomica';
import DonacionBienes from './pages/donaciones/DonacionBienes';
import { DonationsSuccess } from './pages/DonationsSuccess';
import { DonationsCancel } from './pages/DonationsCancel';
import PublicVisitante from './pages/public/PublicVisitante';
import PublicDisponibilidad from './pages/public/PublicDisponibilidad';
import PublicDonacionEconomica from './pages/public/PublicDonacionEconomica';
import PublicDonacionBienes from './pages/public/PublicDonacionBienes';
import VisitantesList from './pages/visitantes/VisitantesList';
import CreateVisitante from './pages/visitantes/CreateVisitante';
import VisitanteDetail from './pages/visitantes/VisitanteDetail';
import { NotFound } from './pages/NotFound';
import { Forbidden } from './pages/Forbidden';
import ProtectedRoute from './routers/ProtectedRouter';
import PublicRoute from './routers/PublicRouter';
import PrivateRouteWithRole from './routers/PrivateRouteWhitRole';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000}
        toastStyle={{
          background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          border: '0.5px solid var(--border-color)', borderRadius: '12px',
          fontFamily: 'var(--font-body)', fontSize: '16px',
        }}
      />
      {/* SIN PageTransition envolviendo Routes — el modal necesita estado estable */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publico/visitante" element={<PublicVisitante />} />
        <Route path="/publico/visitas/disponibilidad" element={<PublicDisponibilidad />} />
        <Route path="/publico/donacion/economica" element={<PublicDonacionEconomica />} />
        <Route path="/publico/donacion/bienes" element={<PublicDonacionBienes />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/confirmar/:token" element={<ConfirmAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/donacion/exitosa" element={<DonationsSuccess />} />
        <Route path="/donacion/cancelada" element={<DonationsCancel />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/cambiar-password" element={<ChangePassword />} />
            <Route path="/adminis" element={<PrivateRouteWithRole rolPermitido="administrador"><AdminisList /></PrivateRouteWithRole>} />
            <Route path="/adminis/crear" element={<PrivateRouteWithRole rolPermitido="administrador"><CreateAdmini /></PrivateRouteWithRole>} />
            <Route path="/adminis/editar/:id" element={<PrivateRouteWithRole rolPermitido="administrador"><EditAdmini /></PrivateRouteWithRole>} />
            <Route path="/pasantes" element={<PasantesList />} />
            <Route path="/pasantes/crear" element={<CreatePasante />} />
            <Route path="/pasantes/editar/:id" element={<EditPasante />} />
            <Route path="/visitas" element={<VisitasList />} />
            <Route path="/visitas/crear" element={<CreateVisita />} />
            <Route path="/visitas/disponibilidad" element={<Disponibilidad />} />
            <Route path="/donaciones" element={<DonacionesList />} />
            <Route path="/donaciones/economica" element={<DonacionEconomica />} />
            <Route path="/donaciones/bienes" element={<DonacionBienes />} />
            <Route path="/visitantes" element={<VisitantesList />} />
            <Route path="/visitantes/crear" element={<CreateVisitante />} />
            <Route path="/visitantes/:id" element={<VisitanteDetail />} />
          </Route>
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
