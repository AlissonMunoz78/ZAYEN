import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import api from "../../api/axios";
import storeAuth from "../../context/storeAuth";
import FormCard from "../../components/FormCard";

const EditPasante = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rol, tipo } = storeAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pasante, setPasante] = useState(null);
  const [form, setForm] = useState({
    celular: "",
    facultad: "",
    horasDePasantia: 0,
  });
  const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const puedeEditar =
    rol === "administrador" || (rol === "admini" && tipo !== "estudiante");

  useEffect(() => {
    api
      .get(`/admin/pasantes/${id}`)
      .then((r) => {
        setPasante(r.data);
        setForm({
          celular: r.data.celular || "",
          facultad: r.data.facultad || "",
          horasDePasantia: r.data.horasDePasantia || 0,
        });
      })
      .catch(() => {
        toast.error("Error al cargar pasante");
        navigate("/pasantes");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = puedeEditar
      ? {
          celular: form.celular,
          facultad: form.facultad,
          horasDePasantia: form.horasDePasantia,
        }
      : { celular: form.celular };
    try {
      await api.put(`/admin/pasantes/${id}`, data);
      toast.success("Pasante actualizado");
      navigate("/pasantes");
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <FaSpinner
          style={{
            fontSize: "32px",
            color: "var(--c-cyan)",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <FormCard title="Editar Pasante" category="GESTIÓN">
      {pasante && (
        <div
          style={{
            marginBottom: "28px",
            padding: "16px",
            background: "var(--bg-tertiary)",
            borderRadius: "10px",
            border: "0.5px solid var(--border-color)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginBottom: "4px",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Nombre:</strong>{" "}
            {pasante.nombre}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>Email:</strong>{" "}
            {pasante.email}
          </div>
        </div>
      )}
      {!puedeEditar && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            background: "rgba(232,22,107,0.08)",
            border: "0.5px solid rgba(232,22,107,0.2)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#f472b6",
          }}
        >
          ⚠️ Como admini estudiante, solo puedes editar el celular.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label className="field-label">Celular</label>
          <input
            type="text"
            name="celular"
            value={form.celular}
            onChange={h}
            placeholder="0999999999"
            className="input-field"
            pattern="09[0-9]{8}"
            required
          />
        </div>
        {puedeEditar && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label className="field-label">Facultad</label>
              <input
                type="text"
                name="facultad"
                value={form.facultad}
                onChange={h}
                placeholder="Ingeniería de Sistemas"
                className="input-field"
                required
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label className="field-label">Horas de pasantía</label>
              <input
                type="number"
                name="horasDePasantia"
                value={form.horasDePasantia}
                onChange={h}
                className="input-field"
                min="0"
              />
            </div>
          </>
        )}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={() => navigate("/pasantes")}
            className="btn-outline"
            style={{ flex: 1 }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ flex: 2 }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </FormCard>
  );
};
export default EditPasante;
