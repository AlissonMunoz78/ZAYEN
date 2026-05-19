import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCalendar,
  FaClock,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../../api/axios";

const CreateVisita = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    institucion: "",
    cantidadPersonas: "",
    fechaVisita: "",
    horaBloque: "",
  });
  const [errors, setErrors] = useState({ institucion: "" });
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "institucion" && (value || "").trim().length >= 3) {
      setErrors({ ...errors, institucion: "" });
    }
    if (name === "cantidadPersonas") {
      const n = Number(value);
      if (value !== "" && n > 20) {
        toast.error("El máximo permitido es de 20 personas por grupo");
      }
    }
    if (name === "fechaVisita" && value) {
      try {
        const r = await api.get(`/visitas/disponibilidad?fecha=${value}`);
        setDisponibilidad(r.data);
      } catch {
        toast.error("Error al consultar disponibilidad");
        setDisponibilidad(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate institución
    const instRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ&.,'\-\s]{3,}$/u;
    if (!instRegex.test((form.institucion || "").trim())) {
      setErrors({
        ...errors,
        institucion: "Ingrese una institución válida (mín. 3 caracteres).",
      });
      toast.error("Institución inválida (mín. 3 caracteres)");
      return;
    }
    if (Number(form.cantidadPersonas) > 20) {
      toast.error("El máximo permitido es de 20 personas por grupo");
      return;
    }
    setLoading(true);
    try {
      const cantPersonas = parseInt(form.cantidadPersonas, 10);
      if (isNaN(cantPersonas) || cantPersonas < 1 || cantPersonas > 20) {
        toast.error("Cantidad de personas inválida");
        setLoading(false);
        return;
      }
      const payload = {
        institucion: form.institucion,
        cantidadPersonas: cantPersonas,
        fechaVisita: form.fechaVisita,
        horaBloque: form.horaBloque,
      };
      console.log("Enviando payload:", payload);
      await api.post("/visitas", payload);
      toast.success("¡Reserva registrada exitosamente!");
      navigate("/visitas");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error al registrar la visita");
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    completo: "#E8166B",
    casi_lleno: "#f59e0b",
    disponible: "#00D4C8",
  };

  const stateMap = {
    completo: "Completo",
    casi_lleno: "Casi lleno",
    disponible: "Disponible",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => navigate("/visitas")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "20px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--c-cyan)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            <FaArrowLeft /> Volver
          </button>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--c-cyan)",
                letterSpacing: "2px",
                fontWeight: "600",
              }}
            >
              NUEVA RESERVA
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--text-primary)",
                margin: "4px 0 0 0",
              }}
            >
              Registrar Reserva Grupal
            </h1>
          </div>
          <div>
            <strong>Visitantes:</strong> Entre 1 y 20 personas por grupo •{" "}
            <strong>Duración:</strong> Bloques de 30 minutos •{" "}
            <strong>Horario:</strong> Lunes a Viernes
          </div>
        </div>

        {/* Form Card */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Institución */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                <FaBuilding style={{ color: "var(--c-purple)" }} /> Institución
              </label>
              <input
                type="text"
                name="institucion"
                value={form.institucion}
                onChange={handleChange}
                placeholder="Ej: Colegio San Francisco"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--c-purple)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(107,53,200,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.boxShadow = "none";
                }}
                required
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

            {/* Cantidad de Personas */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                <FaUsers style={{ color: "var(--c-cyan)" }} /> Cantidad de
                personas
              </label>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="number"
                  name="cantidadPersonas"
                  value={form.cantidadPersonas}
                  onChange={handleChange}
                  placeholder="15"
                  min="1"
                  max="20"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--c-cyan)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,212,200,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(0,212,200,0.1)",
                    border: "1px solid rgba(0,212,200,0.2)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "var(--c-cyan)",
                    fontWeight: "600",
                  }}
                >
                  Máx. 20
                </div>
              </div>
            </div>

            {/* Fecha */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                <FaCalendar style={{ color: "var(--c-orange)" }} /> Fecha de
                visita
              </label>
              <input
                type="date"
                name="fechaVisita"
                value={form.fechaVisita}
                onChange={handleChange}
                min={minDate}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--c-orange)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "6px",
                }}
              >
                Mínimo 1 día de anticipación (L-V)
              </div>
            </div>

            {/* Horario Bloque */}
            {disponibilidad && (
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  <FaClock style={{ color: "var(--c-green)" }} /> Bloque horario
                </label>

                {/* Grid de bloques */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  {disponibilidad.bloques?.map((b) => (
                    <button
                      key={b.hora}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, horaBloque: b.hora }))
                      }
                      style={{
                        padding: "14px 12px",
                        borderRadius: "10px",
                        border:
                          form.horaBloque === b.hora
                            ? `2px solid ${colorMap[b.estado]}`
                            : "1px solid var(--border-color)",
                        background:
                          form.horaBloque === b.hora
                            ? `${colorMap[b.estado]}15`
                            : "var(--bg-tertiary)",
                        color: colorMap[b.estado],
                        cursor:
                          b.estado === "completo" ? "not-allowed" : "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                        textAlign: "center",
                        opacity: b.estado === "completo" ? 0.5 : 1,
                        transition: "all 0.2s",
                      }}
                      disabled={b.estado === "completo"}
                      onMouseEnter={(e) => {
                        if (b.estado !== "completo") {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = `0 4px 12px ${colorMap[b.estado]}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "none";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontSize: "13px" }}>{b.hora}</div>
                      <div style={{ fontSize: "10px", opacity: 0.7 }}>
                        {b.disponibles} libre{b.disponibles !== 1 ? "s" : ""}
                      </div>
                      {b.estado === "completo" && (
                        <div style={{ fontSize: "9px", marginTop: "4px" }}>
                          LLENO
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Select fallback */}
                <select
                  name="horaBloque"
                  value={form.horaBloque}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    display: "none",
                  }}
                  required
                >
                  <option value="">Seleccione un horario</option>
                  {disponibilidad.bloques
                    ?.filter((b) => b.estado !== "completo")
                    .map((b) => (
                      <option key={b.hora} value={b.hora}>
                        {b.hora} — {b.disponibles} cupos
                      </option>
                    ))}
                </select>

                {form.horaBloque && (
                  <div
                    style={{
                      padding: "10px 12px",
                      background: "rgba(0,212,200,0.1)",
                      border: "1px solid rgba(0,212,200,0.2)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--c-cyan)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaCheckCircle /> Horario {form.horaBloque} seleccionado
                  </div>
                )}
              </div>
            )}

            {/* Botones */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/visitas")}
                style={{
                  flex: 1,
                  padding: "13px 20px",
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
                  e.target.style.color = "var(--c-purple)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--bg-tertiary)";
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.color = "var(--text-secondary)";
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  !form.horaBloque ||
                  !form.cantidadPersonas ||
                  !form.fechaVisita ||
                  !form.institucion ||
                  Number(form.cantidadPersonas) < 1 ||
                  Number(form.cantidadPersonas) > 20
                }
                style={{
                  flex: 2,
                  padding: "13px 20px",
                  background: loading
                    ? "rgba(0,212,200,0.5)"
                    : "linear-gradient(135deg, var(--c-cyan), #00A89A)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 10px 24px rgba(0,212,200,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "none";
                }}
              >
                {loading ? "Registrando..." : "Registrar Visita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVisita;
