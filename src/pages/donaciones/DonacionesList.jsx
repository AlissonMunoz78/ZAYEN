import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaDollarSign,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaDonate,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const DonacionesList = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonaciones();
  }, []);

  const fetchDonaciones = async () => {
    try {
      const r = await api.get("/donaciones");
      setDonaciones(Array.isArray(r.data) ? r.data : r.data?.donaciones || []);
    } catch {
      toast.error("Error al cargar donaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleBienStatus = async (id, status) => {
    if (
      !window.confirm(
        `¿${status === "aceptada" ? "Aceptar" : "Rechazar"} esta donación?`,
      )
    )
      return;
    try {
      await api.patch(`/donaciones/${id}/estado-bien`, { status });
      toast.success(`Donación ${status}`);
      fetchDonaciones();
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error");
    }
  };

  const badgeStyle = (s) => {
    const map = {
      completada: ["#00D4C8", "rgba(0,212,200,0.12)"],
      aceptada: ["#00D4C8", "rgba(0,212,200,0.12)"],
      no_aceptada: ["#E8166B", "rgba(232,22,107,0.12)"],
      fallida: ["#E8166B", "rgba(232,22,107,0.12)"],
      pendiente: ["#a78bfa", "rgba(107,53,200,0.12)"],
    };
    const [color, bg] = map[s] || ["var(--text-muted)", "var(--bg-card)"];
    return {
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "500",
      color,
      background: bg,
    };
  };

  return (
    <div>
      <PageHeader
        category="GESTIÓN"
        title="Donaciones"
        action={
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              to="/donaciones/economica"
              className="btn-outline"
              style={{
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaDollarSign size={12} /> Económica
            </Link>
            <Link
              to="/donaciones/bienes"
              className="btn-primary"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
              }}
            >
              <FaBox size={12} /> Bienes
            </Link>
          </div>
        }
      />
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Cargando...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Donante</th>
                <th>Institución</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto/Descripción</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {donaciones.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: "500" }}>{d.nombreDonante}</td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {d.institucion}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {new Date(
                      d.fecha || d.createdAt || d.fechaDonacion || Date.now(),
                    ).toLocaleDateString("es-EC")}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        textTransform: "capitalize",
                      }}
                    >
                      {d.tipoDonacion}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {d.tipoDonacion === "economica"
                      ? `$${d.monto?.toFixed(2)}`
                      : d.descripcionBien}
                  </td>
                  <td>
                    <span style={badgeStyle(d.status)}>{d.status}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {d.tipoDonacion === "bienes" &&
                      d.status === "pendiente" && (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleBienStatus(d.id, "aceptada")}
                            style={{
                              background: "rgba(0,212,200,0.12)",
                              color: "#00D4C8",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() =>
                              handleBienStatus(d.id, "no_aceptada")
                            }
                            style={{
                              background: "rgba(232,22,107,0.12)",
                              color: "#E8166B",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && donaciones.length === 0 && (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <FaDonate
              style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}
            />
            <p>No hay donaciones registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default DonacionesList;
