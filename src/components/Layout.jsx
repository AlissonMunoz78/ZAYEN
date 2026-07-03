import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div
    className="app-layout"
    style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg-primary)",
    }}
  >
    <Navbar />
    <main
      className="app-main"
      style={{ flex: 1, overflow: "auto", minHeight: "100vh" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </div>
    </main>
  </div>
);

export default Layout;
