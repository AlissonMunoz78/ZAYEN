import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaDonate,
  FaArrowRight,
  FaChartLine,
} from "react-icons/fa";
import api from "../../api/axios";
import storeAuth from "../../context/storeAuth";

const StatCard = ({ title, value, icon: Icon, color, link, sub }) => (
  <Link to={link} style={{ textDecoration: "none" }}>
    <div
      className="glass-card"
      style={{
        padding: "32px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${color}18`,
            border: `0.5px solid ${color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon style={{ color, fontSize: "20px" }} />
        </div>
        <FaArrowRight
          style={{ color: "var(--text-muted)", fontSize: "13px" }}
        />
      </div>
      <div
        style={{
          fontFamily: "var(--font-title)",
          fontSize: "36px",
          fontWeight: "400",
          color: "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "17px",
          color: "var(--text-secondary)",
          marginTop: "6px",
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color,
            marginTop: "8px",
            fontWeight: "500",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  </Link>
);

const Dashboard = () => {
  const { rol } = storeAuth();
  const [stats, setStats] = useState({
    visitas: 0,
    donaciones: 0,
    visitantes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/visitas/estadisticas"),
      api.get("/donaciones/estadisticas"),
      api.get("/visitantes/estadisticas"),
    ])
      .then(([v, d, vi]) => {
        setStats({
          visitas: v.data.totalVisitas || 0,
          donaciones: d.data.totalRecaudado || 0,
          visitantes: vi.data.totalVisitantes || 0,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "44px" }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "var(--c-cyan)",
            display: "block",
            marginBottom: "10px",
          }}
        >
          PANEL DE CONTROL
        </span>
        <h1
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "42px",
            fontWeight: "400",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "18px",
            color: "var(--text-secondary)",
          }}
        >
          Bienvenido,&nbsp;
          <span
            style={{
              color: "var(--c-cyan)",
              fontWeight: "500",
              textTransform: "capitalize",
            }}
          >
            {rol}
          </span>
        </p>
        <div
          style={{
            width: "48px",
            height: "3px",
            background: "linear-gradient(90deg,#00D4C8,#6B35C8)",
            borderRadius: "2px",
            marginTop: "16px",
          }}
        />
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-card"
              style={{ height: "160px", animation: "pulse 1.5s ease infinite" }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "44px",
          }}
        >
          <StatCard
            title="Reservas registradas"
            value={stats.visitas}
            icon={FaCalendarAlt}
            color="#00D4C8"
            link="/visitas"
            sub="Total acumulado"
          />
          <StatCard
            title="Donaciones recaudadas"
            value={`$${Number(stats.donaciones).toFixed(2)}`}
            icon={FaDonate}
            color="#6B35C8"
            link="/donaciones"
            sub="Donaciones económicas"
          />
          <StatCard
            title="Visitantes registrados"
            value={stats.visitantes}
            icon={FaUsers}
            color="#E8166B"
            link="/visitantes"
            sub="Total en base de datos"
          />
        </div>
      )}

      <div className="glass-card" style={{ padding: "36px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <FaChartLine style={{ color: "var(--c-cyan)", fontSize: "18px" }} />
          <h2
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "26px",
              fontWeight: "400",
              color: "var(--text-primary)",
            }}
          >
            Acciones rápidas
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "14px",
          }}
        >
          {[
            {
              label: "Registrar reserva",
              to: "/visitas/crear",
              color: "#00D4C8",
            },
            {
              label: "Registrar visitante",
              to: "/visitantes/crear",
              color: "#6B35C8",
            },
            { label: "Ver donaciones", to: "/donaciones", color: "#E8166B" },
            ...(rol === "administrador"
              ? [
                  {
                    label: "Crear admini",
                    to: "/adminis/crear",
                    color: "#00D4C8",
                  },
                ]
              : []),
          ].map(({ label, to, color }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: "16px 22px",
                borderRadius: "10px",
                textDecoration: "none",
                background: `${color}12`,
                color,
                border: `0.5px solid ${color}30`,
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = color;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${color}12`;
                e.currentTarget.style.color = color;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
    </div>
  );
};
export default Dashboard;
