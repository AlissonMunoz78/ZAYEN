import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import FormCard from "../../components/FormCard";

const CreateVisita = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    institucion: "",
    cantidadPersonas: "",
    fechaVisita: "",
    horaBloque: "",
  });
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
    // Validación cliente: no permitir más de 20 personas
    if (Number(form.cantidadPersonas) > 20) {
      toast.error("El máximo permitido es de 20 personas por grupo");
      return;
    }
    setLoading(true);
    try {
      await api.post("/visitas", form);
      toast.success("Visita registrada");
      navigate("/visitas");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error");
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    completo: "#E8166B",
    casi_lleno: "#f59e0b",
    disponible: "#00D4C8",
  };

  return (
    <FormCard title="Registrar Visita" category="VISITAS">
      <div
        style={{
          marginBottom: "28px",
          padding: "14px 16px",
          background: "rgba(0,212,200,0.06)",
          border: "0.5px solid rgba(0,212,200,0.2)",
          borderRadius: "10px",
          fontSize: "13px",
          color: "var(--text-secondary)",
        }}
      >
        ℹ️ Las visitas grupales deben tener entre 1 y 20 personas. Se asignan
        por bloques de 30 minutos.
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label className="field-label">Institución</label>
          <input
            type="text"
            name="institucion"
            value={form.institucion}
            onChange={handleChange}
            placeholder="Universidad XYZ"
            className="input-field"
            required
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label className="field-label">Cantidad de personas (1-20)</label>
          <input
            type="number"
            name="cantidadPersonas"
            value={form.cantidadPersonas}
            onChange={handleChange}
            placeholder="15"
            className="input-field"
            min="1"
            max="20"
            required
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label className="field-label">Fecha de visita</label>
          <input
            type="date"
            name="fechaVisita"
            value={form.fechaVisita}
            onChange={handleChange}
            min={minDate}
            className="input-field"
            required
          />
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            Debe ser con al menos 1 día de anticipación (Lunes a Viernes)
          </div>
        </div>
        {disponibilidad && (
          <div style={{ marginBottom: "20px" }}>
            <label className="field-label">Bloque horario</label>
            <select
              name="horaBloque"
              value={form.horaBloque}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Seleccione un horario</option>
              {disponibilidad.bloques
                .filter((b) => b.estado !== "completo")
                .map((b) => (
                  <option key={b.hora} value={b.hora}>
                    {b.hora} — {b.disponibles} cupos disponibles
                    {b.estado === "casi_lleno" ? " (⚠️ Casi lleno)" : ""}
                  </option>
                ))}
            </select>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {disponibilidad.bloques.map((b) => (
                <div
                  key={b.hora}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    background: `${colorMap[b.estado]}12`,
                    border: `0.5px solid ${colorMap[b.estado]}30`,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: colorMap[b.estado],
                    }}
                  >
                    {b.hora}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {b.disponibles} libre{b.disponibles !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => navigate("/visitas")}
            className="btn-outline"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              !form.horaBloque ||
              !form.cantidadPersonas ||
              Number(form.cantidadPersonas) < 1 ||
              Number(form.cantidadPersonas) > 20
            }
            className="btn-primary"
            style={{ flex: 2 }}
          >
            {loading ? "Registrando..." : "Registrar visita"}
          </button>
        </div>
      </form>
    </FormCard>
  );
};
export default CreateVisita;
