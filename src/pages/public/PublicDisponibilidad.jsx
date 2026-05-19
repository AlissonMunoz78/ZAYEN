import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaArrowLeft, FaClipboardList } from "react-icons/fa";
import api from "../../api/axios";

const PublicDisponibilidad = () => {
  const [fecha, setFecha] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

  const [form, setForm] = useState({
    institucion: "",
    cantidadPersonas: 1,
  });
  const [errors, setErrors] = useState({ institucion: "" });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!fecha) return toast.error("Selecciona una fecha");

    setLoading(true);

    try {
      const r = await api.get(`/publico/visitas/disponibilidad?fecha=${fecha}`);
      setData(r.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error al consultar");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (bloque) => {
    if (bloque.disponibles <= 0) {
      return toast.error("Este horario está lleno");
    }

    setBloqueSeleccionado(bloque);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setForm({ institucion: "", cantidadPersonas: 1 });
    setBloqueSeleccionado(null);
  };

  const reservar = async () => {
    if (!fecha) return toast.error("Selecciona fecha");
    if (!bloqueSeleccionado?.hora) return toast.error("Selecciona horario");
    if (!form.institucion.trim()) return toast.error("Ingrese institución");

    // front validation: institución mínimo 3 caracteres y caracteres permitidos
    const instVal = (form.institucion || "").trim();
    const instRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ&.,'\-\s]{3,}$/u;
    if (!instRegex.test(instVal)) {
      setErrors({
        ...errors,
        institucion: "Ingrese una institución válida (mín. 3 caracteres).",
      });
      return toast.error("Institución inválida (mín. 3 caracteres)");
    }
    try {
      const cantPersonas = parseInt(form.cantidadPersonas, 10);
      if (isNaN(cantPersonas) || cantPersonas < 1 || cantPersonas > 20) {
        toast.error("Cantidad de personas inválida");
        return;
      }

      console.log("Enviando payload público:", {
        institucion: form.institucion,
        cantidadPersonas: cantPersonas,
        fechaVisita: fecha,
        horaBloque: bloqueSeleccionado.hora,
      });

      await api.post("/publico/visitas", {
        institucion: form.institucion,
        cantidadPersonas: cantPersonas,
        fechaVisita: fecha,
        horaBloque: bloqueSeleccionado.hora,
      });

      toast.success("Reserva registrada");

      cerrarModal();

      const r = await api.get(`/publico/visitas/disponibilidad?fecha=${fecha}`);

      setData(r.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error al reservar");
    }
  };

  const colorMap = {
    completo: ["#E8166B", "rgba(232,22,107,0.1)"],
    casi_lleno: ["#f59e0b", "rgba(245,158,11,0.1)"],
    disponible: ["#00D4C8", "rgba(0,212,200,0.1)"],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "80px 40px 40px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "8px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "13px",
            }}
          >
            <FaArrowLeft size={11} /> Volver
          </Link>
        </div>

        <div
          className="glass-card"
          style={{ padding: "32px", marginBottom: "24px" }}
        >
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "12px" }}
          >
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={minDate}
              className="input-field"
              style={{ flex: 1 }}
              required
            />
            <button type="submit" className="btn-primary">
              <FaSearch size={12} /> Consultar
            </button>
          </form>
        </div>

        {loading && <div style={{ textAlign: "center" }}>Consultando...</div>}

        {data && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
              gap: "16px",
            }}
          >
            {data.bloques?.map((b) => {
              const [color, bg] = colorMap[b.estado];

              return (
                <div
                  key={b.hora}
                  className="glass-card"
                  onClick={() => abrirModal(b)}
                  style={{
                    padding: "20px",
                    borderLeft: `2px solid ${color}`,
                    cursor: "pointer",
                  }}
                >
                  <div>{b.hora}</div>
                  <div>{b.disponibles} disponibles</div>
                </div>
              );
            })}
          </div>
        )}

        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={cerrarModal}
          >
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "32px",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--c-cyan)",
                    letterSpacing: "2px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  RESERVAR VISITA
                </div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    margin: "0 0 8px 0",
                  }}
                >
                  {bloqueSeleccionado?.hora}
                </h2>
                <div
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  {bloqueSeleccionado?.disponibles} cupo
                  {bloqueSeleccionado?.disponibles !== 1 ? "s" : ""} disponible
                  {bloqueSeleccionado?.disponibles !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Información */}
              <div
                style={{
                  marginBottom: "24px",
                  padding: "14px 16px",
                  background: "rgba(0,212,200,0.1)",
                  border: "1px solid rgba(0,212,200,0.2)",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <FaClipboardList
                  style={{
                    color: "var(--c-cyan)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <div>Completa los datos para finalizar tu reserva</div>
              </div>

              {/* Formulario */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  Institución
                </label>
                <input
                  type="text"
                  placeholder="Ej: Colegio San Francisco"
                  value={form.institucion}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, institucion: val });
                    if (val.trim().length >= 3)
                      setErrors({ ...errors, institucion: "" });
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.institucion && (
                  <div
                    style={{
                      color: "#E8166B",
                      fontSize: "12px",
                      marginTop: "8px",
                    }}
                  >
                    {errors.institucion}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  Cantidad de personas (1-20)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.cantidadPersonas}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cantidadPersonas: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Botones */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "20px",
                }}
              >
                <button
                  onClick={cerrarModal}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(107,53,200,0.1)";
                    e.target.style.borderColor = "rgba(107,53,200,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--bg-tertiary)";
                    e.target.style.borderColor = "var(--border-color)";
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={reservar}
                  disabled={
                    !form.institucion.trim() ||
                    form.cantidadPersonas < 1 ||
                    form.cantidadPersonas > 20
                  }
                  style={{
                    flex: 2,
                    padding: "12px 20px",
                    background:
                      "linear-gradient(135deg, var(--c-cyan), #00A89A)",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 10px 24px rgba(0,212,200,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "none";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDisponibilidad;
