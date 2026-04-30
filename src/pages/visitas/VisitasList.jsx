import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const VisitasList = () => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitas();
  }, []);

  const fetchVisitas = async () => {
    try {
      const r = await api.get("/visitas");
      setVisitas(Array.isArray(r.data) ? r.data : r.data?.visitas || []);
    } catch {
      toast.error("Error al cargar visitas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    const descripcion =
      status === "cancelada"
        ? window.prompt("Motivo de cancelación:")
        : "sin novedad";
    if (status === "cancelada" && !descripcion) return;
    try {
      await api.patch(`/visitas/${id}/estado`, { status, descripcion });
      toast.success(`Visita marcada como ${status}`);
      fetchVisitas();
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error al actualizar");
    }
  };

  const badgeStyle = (s) => {
    const map = {
      realizada: ["#00D4C8", "rgba(0,212,200,0.12)"],
      cancelada: ["#E8166B", "rgba(232,22,107,0.12)"],
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
        title="Visitas"
        action={
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              to="/visitas/disponibilidad"
              className="btn-outline"
              style={{
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              Ver disponibilidad
            </Link>
            <Link
              to="/visitas/crear"
              className="btn-primary"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
              }}
            >
              <FaPlus size={12} /> Nueva visita
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
                <th>Institución</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Estado</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: "500" }}>{v.institucion}</td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {v.fechaVisita}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {v.horaBloque}
                  </td>
                  <td>{v.cantidadPersonas}</td>
                  <td>
                    <span style={badgeStyle(v.status)}>{v.status}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {v.status === "pendiente" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleStatus(v.id, "realizada")}
                          style={{
                            background: "rgba(0,212,200,0.12)",
                            color: "#00D4C8",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaCheckCircle size={12} /> Realizada
                        </button>
                        <button
                          onClick={() => handleStatus(v.id, "cancelada")}
                          style={{
                            background: "rgba(232,22,107,0.12)",
                            color: "#E8166B",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaTimesCircle size={12} /> Cancelar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && visitas.length === 0 && (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <FaCalendarAlt
              style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}
            />
            <p>No hay visitas registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VisitasList;
