import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import storeAuth from "../context/storeAuth";
import themeStore from "../context/themeStore";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaDonate,
  FaSignOutAlt,
  FaUserShield,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaKey,
} from "react-icons/fa";
import { MdMuseum } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NavLink = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const active =
    location.pathname === to || location.pathname.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`sidebar-link${active ? " active" : ""}`}
      style={{
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "13px 0" : "12px 16px",
      }}
    >
      <Icon style={{ fontSize: "18px", flexShrink: 0 }} />
      {!collapsed && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}>
          {label}
        </span>
      )}
    </Link>
  );
};

const Navbar = () => {
  const { rol, clearToken } = storeAuth();
  const { isDark, toggle } = themeStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const btnBase = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "transparent",
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    width: "100%",
    transition: "background 0.2s",
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "20px 12px",
        }}
      >
        {/* Logo + colapsar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            marginBottom: "36px",
          }}
        >
          {!collapsed && (
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "22px",
                  fontWeight: "600",
                  letterSpacing: "2px",
                }}
                className="gradient-text"
              >
                ZAYEN
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  letterSpacing: "1.2px",
                  marginTop: "2px",
                  fontFamily: "var(--font-body)",
                }}
              >
                MUSEO GUSTAVO ORCÉS
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border-color)",
              borderRadius: "8px",
              padding: "8px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {collapsed ? <FaBars size={15} /> : <FaTimes size={15} />}
          </button>
        </div>

        {/* Sección principal */}
        <nav style={{ flex: 1 }}>
          {!collapsed && (
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                letterSpacing: "2px",
                marginBottom: "8px",
                paddingLeft: "18px",
                fontFamily: "var(--font-body)",
                fontWeight: "600",
              }}
            >
              PRINCIPAL
            </div>
          )}
          <NavLink
            to="/dashboard"
            icon={FaHome}
            label="Inicio"
            collapsed={collapsed}
          />
          <NavLink
            to="/visitas"
            icon={FaCalendarAlt}
            label="Visitas"
            collapsed={collapsed}
          />
          <NavLink
            to="/visitantes"
            icon={FaUsers}
            label="Visitantes"
            collapsed={collapsed}
          />
          <NavLink
            to="/donaciones"
            icon={FaDonate}
            label="Donaciones"
            collapsed={collapsed}
          />

          {(rol === "administrador" || rol === "admini") && (
            <>
              {!collapsed && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    letterSpacing: "2px",
                    margin: "20px 0 8px",
                    paddingLeft: "18px",
                    fontFamily: "var(--font-body)",
                    fontWeight: "600",
                  }}
                >
                  GESTIÓN
                </div>
              )}
              <NavLink
                to="/pasantes"
                icon={MdMuseum}
                label="Pasantes"
                collapsed={collapsed}
              />
            </>
          )}
          {rol === "administrador" && (
            <NavLink
              to="/adminis"
              icon={FaUserShield}
              label="Adminis"
              collapsed={collapsed}
            />
          )}
        </nav>

        {/* Footer del sidebar */}
        <div
          style={{
            borderTop: "0.5px solid var(--border-color)",
            paddingTop: "16px",
          }}
        >
          <NavLink
            to="/perfil"
            icon={FaUserCircle}
            label="Mi perfil"
            collapsed={collapsed}
          />

          {/* Toggle tema */}
          <button
            onClick={toggle}
            style={{
              ...btnBase,
              color: "var(--text-secondary)",
              padding: collapsed ? "12px 0" : "12px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
              marginBottom: "4px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-card)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {isDark ? (
              <FaSun
                size={17}
                style={{ flexShrink: 0, color: "var(--text-secondary)" }}
              />
            ) : (
              <FaMoon
                size={17}
                style={{ flexShrink: 0, color: "var(--text-secondary)" }}
              />
            )}
            {!collapsed && <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              ...btnBase,
              color: "var(--c-magenta)",
              padding: collapsed ? "12px 0" : "12px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(232,22,107,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <FaSignOutAlt size={17} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
