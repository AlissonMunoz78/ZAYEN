import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
    <Navbar />
    <main style={{ flex: 1, overflow: 'auto', padding: '32px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </div>
    </main>
  </div>
);

export default Layout;
