import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaUniversity,
  FaClock,
  FaKey,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import storeAuth from "../../context/storeAuth";
import UploadProfilePhoto from "../../components/UploadProfilePhoto";

const Profile = () => {
  const { rol } = storeAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [celular, setCelular] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const endpoint = rol === "pasante" ? "/pasante/perfil" : "/admin/perfil";
      const r = await api.get(endpoint);
      setProfile(r.data || {});
      setCelular(r.data?.celular || "");
    } catch {
      toast.error("Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const endpoint = rol === "pasante" ? "/pasante/perfil" : "/admin/perfil";
      await api.put(endpoint, { celular });
      toast.success("Perfil actualizado");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error");
    } finally {
      setUpdating(false);
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
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "36px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "var(--c-cyan)",
            letterSpacing: "3px",
            marginBottom: "8px",
          }}
        >
          CUENTA
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "32px",
            color: "var(--text-primary)",
          }}
        >
          Mi Perfil
        </h1>
        <div
          style={{
            width: "40px",
            height: "2px",
            background: "linear-gradient(90deg,#00D4C8,#6B35C8)",
            marginTop: "12px",
            borderRadius: "2px",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
          gap: "24px",
        }}
      >
        {/* Foto */}
        <div
          className="glass-card"
          style={{ padding: "32px", textAlign: "center" }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto 16px",
              background: "var(--bg-tertiary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--border-accent)",
            }}
          >
            {profile?.fotoPerfil ? (
              <img
                src={profile.fotoPerfil}
                alt="Foto"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <FaUserCircle
                style={{
                  fontSize: "48px",
                  color: "var(--c-cyan)",
                  opacity: 0.5,
                }}
              />
            )}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "18px",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            {profile?.nombre}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--c-cyan)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            {profile?.rol || rol}
          </div>
          <UploadProfilePhoto
            userId={profile?._id}
            currentPhoto={profile?.fotoPerfil}
            userType={rol}
            onPhotoUpdate={(newPhoto) =>
              setProfile((p) => ({ ...p, fotoPerfil: newPhoto }))
            }
          />
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="glass-card" style={{ padding: "28px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "20px",
              }}
            >
              {[
                [FaEnvelope, "Correo electrónico", profile?.email],
                [FaPhone, "Celular", profile?.celular || "No registrado"],
                ...(profile?.facultad
                  ? [[FaUniversity, "Facultad", profile.facultad]]
                  : []),
                ...(profile?.horasDePasantia !== undefined
                  ? [
                      [
                        FaClock,
                        "Horas de pasantía",
                        `${profile.horasDePasantia}h`,
                      ],
                    ]
                  : []),
              ].map(([Icon, label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(0,212,200,0.1)",
                      border: "0.5px solid rgba(0,212,200,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      style={{ color: "var(--c-cyan)", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        letterSpacing: "0.5px",
                        marginBottom: "3px",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{ fontSize: "14px", color: "var(--text-primary)" }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editar celular */}
          <div className="glass-card" style={{ padding: "28px" }}>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "16px",
                fontWeight: "500",
              }}
            >
              Actualizar información
            </div>
            <form onSubmit={handleUpdate}>
              <label className="field-label">Número de celular</label>
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="09XXXXXXXX"
                  className="input-field"
                  pattern="09[0-9]{8}"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {updating ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
            {rol !== "pasante" && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "0.5px solid var(--border-color)",
                }}
              >
                <Link
                  to="/cambiar-password"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--c-cyan)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  <FaKey size={12} /> Cambiar contraseña
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
