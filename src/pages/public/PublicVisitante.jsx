import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import api from "../../api/axios";

const PublicVisitante = () => {
  const [form, setForm] = useState({ nombre: "", cedula: "", institucion: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({ institucion: "" });
  const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const instRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ&.,'\-\s]{3,}$/u;
    if (!instRegex.test((form.institucion || "").trim())) {
      setErrors({
        institucion: "Ingrese una institución válida (mín. 3 caracteres).",
      });
      toast.error("Institución inválida (mín. 3 caracteres)");
      setLoading(false);
      return;
    }
    try {
      await api.post("/publico/visitante", form);
      setDone(true);
      toast.success("Visita registrada");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "40px",
      }}
    >
      <div
        className="glass-card"
        style={{ width: "100%", maxWidth: "460px", padding: "48px" }}
      >
        {done ? (
          <div style={{ textAlign: "center" }}>
            <FaCheckCircle
              style={{
                fontSize: "64px",
                color: "var(--c-cyan)",
                marginBottom: "20px",
                filter: "drop-shadow(0 0 16px rgba(0,212,200,0.4))",
              }}
            />
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "28px",
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              ¡Bienvenido!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "32px",
                lineHeight: 1.7,
              }}
            >
              Tu visita al Museo Gustavo Orcés ha sido registrada correctamente.
            </p>
            <Link
              to="/"
              className="btn-primary"
              style={{
                textDecoration: "none",
                display: "inline-block",
                padding: "12px 32px",
              }}
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
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
                <FaArrowLeft size={11} /> Volver al inicio
              </Link>
            </div>
            <div style={{ marginBottom: "36px", marginTop: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--c-cyan)",
                  letterSpacing: "3px",
                  marginBottom: "12px",
                }}
              >
                REGISTRO PÚBLICO
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "28px",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                Registrar visita
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Completa tus datos para registrar tu visita individual.
              </p>
              <div
                style={{
                  width: "32px",
                  height: "2px",
                  background: "linear-gradient(90deg,#00D4C8,#6B35C8)",
                  marginTop: "16px",
                  borderRadius: "2px",
                }}
              />
            </div>
            <form onSubmit={handleSubmit}>
              {[
                ["nombre", "Nombre completo", "text", "Carlos Rodríguez"],
                ["cedula", "Cédula (10 dígitos)", "text", "1234567890"],
                ["institucion", "Institución", "text", "Universidad XYZ"],
              ].map(([name, label, type, ph]) => (
                <div key={name} style={{ marginBottom: "20px" }}>
                  <label className="field-label">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={(e) => {
                      h(e);
                      if (
                        name === "institucion" &&
                        e.target.value.trim().length >= 3
                      )
                        setErrors({ institucion: "" });
                    }}
                    placeholder={ph}
                    className="input-field"
                    pattern={name === "cedula" ? "[0-9]{10}" : undefined}
                    maxLength={name === "cedula" ? 10 : undefined}
                    required
                  />
                  {name === "institucion" && errors.institucion && (
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
              ))}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", padding: "13px", marginTop: "8px" }}
              >
                {loading ? "Registrando..." : "Registrar visita"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default PublicVisitante;
