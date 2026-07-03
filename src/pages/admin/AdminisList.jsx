import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const AdminisList = () => {
  const [adminis, setAdminis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAdminis();
  }, []);

  const fetchAdminis = async () => {
    try {
      const r = await api.get("/admin/adminis");
      setAdminis(Array.isArray(r.data) ? r.data : r.data?.adminis || []);
    } catch {
      toast.error("Error al cargar adminis");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este admini?")) return;
    try {
      await api.delete(`/admin/adminis/${id}`);
      toast.success("Admini eliminado");
      fetchAdminis();
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error");
    }
  };

  return (
    <div>
      <PageHeader
        category="ADMINISTRACIÓN"
        title="Adminis"
        action={
          <Link
            to="/adminis/crear"
            className="btn-primary"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            <FaPlus size={12} /> Crear admini
          </Link>
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
                <th>Nombre</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Facultad</th>
                <th>Horas</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {adminis.map((a) => (
                <tr key={a._id}>
                  <td style={{ fontWeight: "500" }}>{a.nombre}</td>
                  <td
                    style={{ color: "var(--text-secondary)", fontSize: "13px" }}
                  >
                    {a.email}
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        background: "rgba(0,212,200,0.1)",
                        color: "#00D4C8",
                        textTransform: "capitalize",
                      }}
                    >
                      {a.tipo}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {a.facultad || "—"}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {a.horasDePasantia || "—"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        to={`/adminis/editar/${a._id}`}
                        style={{
                          background: "rgba(107,53,200,0.12)",
                          color: "#6B35C8",
                          border: "none",
                          borderRadius: "6px",
                          padding: "7px 10px",
                          cursor: "pointer",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaEdit size={12} />
                      </Link>
                      <button
                        onClick={() => handleDelete(a._id)}
                        style={{
                          background: "rgba(232,22,107,0.12)",
                          color: "#E8166B",
                          border: "none",
                          borderRadius: "6px",
                          padding: "7px 10px",
                          cursor: "pointer",
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && adminis.length === 0 && (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <FaUserShield
              style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}
            />
            <p>No hay adminis registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminisList;
