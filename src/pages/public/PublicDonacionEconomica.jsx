import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaDonate, FaArrowLeft, FaLock } from "react-icons/fa";
import api from "../../api/axios";

const PublicDonacionEconomica = () => {
  const [form, setForm] = useState({
    nombreDonante: "",
    institucion: "",
    monto: "",
    descripcion: "",
  });
  const [processing, setProcessing] = useState(false);
  const h = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const r = await api.post("/donaciones/economica", {
        ...form,
        monto: Number(form.monto),
      });
      const donacionId = r.data.donacion?.id;
      const pay = await api.post("/donaciones/pago", { donacionId });
      window.location.href = pay.data.url;
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error al procesar");
      setProcessing(false);
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
        style={{ width: "100%", maxWidth: "500px", padding: "48px" }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "13px",
            marginBottom: "28px",
          }}
        >
          <FaArrowLeft size={11} /> Volver al inicio
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "rgba(0,212,200,0.1)",
              border: "0.5px solid rgba(0,212,200,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaDonate style={{ color: "var(--c-cyan)", fontSize: "22px" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--c-cyan)",
                letterSpacing: "3px",
                marginBottom: "4px",
              }}
            >
              DONACIÓN
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "26px",
                color: "var(--text-primary)",
              }}
            >
              Donación económica
            </h1>
          </div>
        </div>
        <div
          style={{
            marginBottom: "28px",
            padding: "14px 16px",
            background: "rgba(0,212,200,0.06)",
            border: "0.5px solid rgba(0,212,200,0.2)",
            borderRadius: "10px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          <FaLock
            style={{ color: "var(--c-cyan)", marginTop: "2px", flexShrink: 0 }}
          />
          Serás redirigido a Stripe para completar el pago de forma segura.
        </div>
        <form onSubmit={handleSubmit}>
          {[
            ["nombreDonante", "Nombre del donante", "text", "Juan Pérez"],
            ["institucion", "Institución", "text", "Empresa XYZ"],
          ].map(([name, label, type, ph]) => (
            <div key={name} style={{ marginBottom: "20px" }}>
              <label className="field-label">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={h}
                placeholder={ph}
                className="input-field"
                required
              />
            </div>
          ))}
          <div style={{ marginBottom: "20px" }}>
            <label className="field-label">Monto (USD)</label>
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={h}
              placeholder="10.00"
              min="0.01"
              step="0.01"
              className="input-field"
              required
            />
          </div>
          <div style={{ marginBottom: "28px" }}>
            <label className="field-label">Descripción (opcional)</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={h}
              placeholder="Propósito de la donación..."
              rows="3"
              className="input-field"
              style={{ resize: "vertical" }}
            />
          </div>
          <button
            type="submit"
            disabled={processing}
            className="btn-primary"
            style={{ width: "100%", padding: "13px" }}
          >
            {processing ? "Procesando..." : "Proceder al pago"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default PublicDonacionEconomica;
