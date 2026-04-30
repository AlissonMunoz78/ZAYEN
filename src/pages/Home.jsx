import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdMuseum } from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaDonate,
  FaCalendarAlt,
  FaUserPlus,
  FaChevronDown,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { FaFacebook, FaSquareInstagram } from "react-icons/fa6";
import themeStore from "../context/themeStore";
import LoginModal from "../components/LoginModal";

const condorImg = new URL("../assets/condor.jpeg", import.meta.url).href;
const mamutImg = new URL("../assets/mamut.jpeg", import.meta.url).href;
const jurasico = new URL("../assets/jurasico.jpg", import.meta.url).href;
const dinoImg = new URL("../assets/dino.jpg", import.meta.url).href;

export const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [navState, setNavState] = useState("top");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { isDark, toggle } = themeStore();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = useCallback(() => {
    const current = window.scrollY;
    if (current < 60) {
      setNavState("top");
    } else if (current < lastScrollY.current - 4) {
      setNavState("visible");
    } else if (current > lastScrollY.current + 4) {
      setNavState("hidden");
    }
    lastScrollY.current = current;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Detectar error de OAuth (backend redirige a /?error=unauthorized)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "unauthorized") {
      toast.error("Acceso no autorizado");
      const t = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [navigate]);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = showLogin ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogin]);

  const navBg = navState === "top" ? "transparent" : "rgba(124, 25, 216, 0.42)";

  const S = {
    catLabel: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: "600",
      letterSpacing: "3.5px",
      textTransform: "uppercase",
      color: "var(--c-cyan)",
      display: "block",
      marginBottom: "14px",
    },
    title: {
      fontFamily: "var(--font-title)",
      lineHeight: 1.15,
      color: "var(--text-primary)",
    },
    body: {
      fontFamily: "var(--font-body)",
      fontSize: "17px",
      color: "var(--text-secondary)",
      lineHeight: 1.8,
    },
  };

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* NAVBAR */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: isMobile ? "65px" : "80px",
          padding: isMobile ? "0 16px" : "0 56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navBg,
          backdropFilter: navState !== "top" ? "blur(22px)" : "none",
          borderBottom:
            navState !== "top" ? "0.5px solid rgba(255,255,255,0.09)" : "none",
          transform:
            navState === "hidden" ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.38s ease, background 0.3s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "6px" : "20px",
          }}
        >
          <img
            src="/epn.png"
            alt="EPN"
            style={{ height: isMobile ? "40px" : "58px", width: "auto" }}
          />
          <img
            src="/museo.png"
            alt="Museo"
            style={{ height: isMobile ? "32px" : "58px", width: "auto" }}
          />
          {!isMobile && (
            <div
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.2)",
                paddingLeft: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#fff",
                  letterSpacing: "1.5px",
                }}
              >
                MUSEO
              </div>
              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "2px",
                }}
              >
                GUSTAVO ORCÉS
              </div>
            </div>
          )}
        </div>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "36px",
          }}
        >
          <div
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: "24px" }}
          >
            {[
              ["#inicio", "Inicio"],
              ["#nosotros", "Nosotros"],
              ["#servicios", "Servicios"],
              ["#contacto", "Contacto"],
            ].map(([h, l]) => (
              <a
                key={h}
                href={h}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.75)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.75)")
                }
              >
                {l}
              </a>
            ))}
          </div>

          {!isMobile && (
            <button
              onClick={toggle}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isDark ? <FaSun size={15} /> : <FaMoon size={15} />}
            </button>
          )}

          {!isMobile && (
            <button
              onClick={() => setShowLogin(true)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: "500",
                background: "linear-gradient(135deg,#00D4C8,#6B35C8)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.87")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Iniciar sesión
            </button>
          )}

          {/* Hamburger Button - Solo en mobile/tablet */}
          {isMobile && (
            <button
              className="hamburger"
              aria-label="Toggle menú"
              onClick={() => setShowSidebar((s) => !s)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: showSidebar
                  ? "rgba(0, 212, 200, 0.25)"
                  : "rgba(0, 212, 200, 0.1)",
                border: "1px solid var(--c-cyan)",
                borderRadius: "8px",
                cursor: "pointer",
                color: "var(--c-cyan)",
                transition: "all 0.25s ease",
                marginLeft: "auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 212, 200, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = showSidebar
                  ? "rgba(0, 212, 200, 0.25)"
                  : "rgba(0, 212, 200, 0.1)";
              }}
            >
              <svg
                width="20"
                height="16"
                viewBox="0 0 24 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="2" rx="1" fill="currentColor" />
                <rect y="8" width="24" height="2" rx="1" fill="currentColor" />
                <rect y="16" width="24" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          )}
        </nav>
      </header>

      {/* Overlay for Sidebar */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 299,
            animation: "fadeIn 0.3s ease-out",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar - ChatGPT Style */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "300px",
          background: "var(--bg-secondary)",
          zIndex: 300,
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.5)",
          transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflowY: "auto",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "16px",
              fontWeight: "600",
              background:
                "linear-gradient(135deg, var(--c-cyan), var(--c-purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1.5px",
            }}
          >
            ZAYEN
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--c-cyan)",
              cursor: "pointer",
              fontSize: "24px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "rotate(90deg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "rotate(0)")
            }
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav
          style={{
            flex: 1,
            padding: "16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {[
            ["#inicio", "🏠", "Inicio"],
            ["#nosotros", "🏛️", "Nosotros"],
            ["#servicios", "✨", "Servicios"],
            ["#contacto", "📍", "Contacto"],
          ].map(([href, emoji, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setShowSidebar(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "8px",
                color: "var(--text-primary)",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: "500",
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 212, 200, 0.12)";
                e.currentTarget.style.borderColor = "var(--border-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <span style={{ fontSize: "18px" }}>{emoji}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Sidebar Divider */}
        <div
          style={{
            height: "1px",
            background: "var(--border-color)",
            margin: "8px 0",
          }}
        />

        {/* Login Section */}
        <div
          style={{
            padding: "16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={() => {
              setShowLogin(true);
              setShowSidebar(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 14px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, var(--c-cyan), var(--c-purple))",
              color: "#fff",
              fontSize: "15px",
              fontFamily: "var(--font-body)",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span></span>
            Iniciar sesión
          </button>

          <button
            onClick={toggle}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 212, 200, 0.08)";
              e.currentTarget.style.borderColor = "var(--border-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            {isDark ? (
              <>
                <span>☀️</span> Modo claro
              </>
            ) : (
              <>
                <span>🌙</span> Modo oscuro
              </>
            )}
          </button>
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "14px 14px",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          Museo Gustavo Orcés · EPN
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>

      {/* HERO */}
      <section
        id="inicio"
        style={{
          position: "relative",
          height: isMobile ? "auto" : "100vh",
          minHeight: isMobile ? "80vh" : "auto",
          overflow: "hidden",
          paddingTop: isMobile ? "80px" : "0",
        }}
      >
        <img
          src={jurasico}
          alt="Hero"
          style={{
            width: "100%",
            height: isMobile ? "auto" : "100%",
            minHeight: isMobile ? "400px" : "auto",
            objectFit: "cover",
            filter: "brightness(0.32)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(150deg,rgba(13,27,42,0.85) 0%,rgba(107,53,200,0.2) 60%,rgba(232,22,107,0.08) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "20px 16px 40px" : "0 80px",
            paddingTop: isMobile ? "40px" : "80px",
          }}
        >
          <div style={{ maxWidth: isMobile ? "100%" : "720px" }}>
            <span style={S.catLabel}>
              Escuela Politécnica Nacional · Quito, Ecuador
            </span>
            <h1
              style={{
                ...S.title,
                fontSize: isMobile
                  ? "clamp(28px, 6vw, 42px)"
                  : "clamp(52px,7vw,94px)",
                color: "#fff",
                marginBottom: isMobile ? "16px" : "28px",
                fontWeight: "400",
              }}
            >
              Patrimonio
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg,#00D4C8,#6B35C8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Científico
              </span>
              <br />
              del Ecuador
            </h1>
            <div
              className="accent-line"
              style={{ margin: isMobile ? "12px 0" : "16px 0" }}
            />
            <p
              style={{
                ...S.body,
                color: "rgba(255,255,255,0.72)",
                fontSize: isMobile ? "16px" : "20px",
                marginBottom: isMobile ? "24px" : "44px",
                maxWidth: isMobile ? "100%" : "540px",
              }}
            >
              Inspirando generaciones a través del conocimiento, la ciencia y la
              historia natural.
            </p>
            <div
              style={{
                display: "flex",
                gap: isMobile ? "10px" : "18px",
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <a
                href="#servicios"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                  gap: "10px",
                  background: "linear-gradient(135deg,#00D4C8,#6B35C8)",
                  color: "#fff",
                  padding: isMobile ? "12px 24px" : "14px 36px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <FaCalendarAlt /> Agendar visita
              </a>
              <a
                href="#donaciones"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                  gap: "10px",
                  background: "rgba(181, 30, 207, 0.35)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  padding: isMobile ? "12px 24px" : "14px 36px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  border: "0.5px solid rgba(169, 19, 124, 0.22)",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <FaDonate /> Apoyar al museo
              </a>
            </div>
          </div>
        </div>
        {!isMobile && (
          <a
            href="#nosotros"
            style={{
              position: "absolute",
              bottom: "44px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.4)",
              animation: "bounce 2.2s ease infinite",
              textDecoration: "none",
            }}
          >
            <FaChevronDown size={28} />
          </a>
        )}
      </section>

      {/* SOBRE NOSOTROS */}
      <section
        id="nosotros"
        style={{
          padding: isMobile ? "40px 16px" : "110px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "24px" : "90px",
          alignItems: "center",
        }}
      >
        <div>
          <span style={S.catLabel}>Sobre nosotros</span>
          <h2
            style={{
              ...S.title,
              fontSize: isMobile ? "28px" : "52px",
              marginBottom: isMobile ? "16px" : "28px",
              fontWeight: "400",
            }}
          >
            Un espacio para la ciencia y la{" "}
            <span
              style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg,#00D4C8,#6B35C8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              historia natural
            </span>
          </h2>
          <div className="accent-line" />
          <p style={{ ...S.body, marginBottom: isMobile ? "24px" : "36px" }}>
            El Museo Gustavo Orcés dedica sus esfuerzos a la ciencia y la
            historia natural del Ecuador. Educamos, inspiramos y conectamos a
            los visitantes con la riqueza biológica y paleontológica del país.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {[
              [
                "Exhibiciones permanentes",
                "Colecciones de fauna, paleontología y biodiversidad ecuatoriana.",
              ],
              [
                "Biblioteca científica",
                "Acceso a publicaciones y documentos históricos del país.",
              ],
              [
                "Programas educativos",
                "Talleres y visitas guiadas para todas las edades.",
              ],
            ].map(([t, d]) => (
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: isMobile ? "15px" : "17px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {t}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: isMobile ? "14px" : "16px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gridTemplateRows: isMobile ? "auto" : "220px 220px",
            gap: "14px",
          }}
        >
          <img
            src={condorImg}
            alt="Cóndor"
            style={{
              width: "100%",
              height: isMobile ? "250px" : "100%",
              objectFit: "cover",
              borderRadius: "12px",
              gridRow: isMobile ? "auto" : "1/3",
            }}
          />
          <img
            src={mamutImg}
            alt="Mamut"
            style={{
              width: "100%",
              height: isMobile ? "250px" : "100%",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
          <img
            src={dinoImg}
            alt="Dino"
            style={{
              width: "100%",
              height: isMobile ? "250px" : "100%",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        </div>
      </section>

      {/* INFO MUSEO */}
      <section
        style={{
          padding: isMobile ? "40px 16px" : "80px",
          background: "var(--bg-secondary)",
        }}
      >
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
            gap: isMobile ? "16px" : "36px",
          }}
        >
          {[
            [
              FaMapMarkerAlt,
              "Ubicación",
              "Ladrón de Guevara E11-253",
              "Quito, Ecuador",
            ],
            [
              FaClock,
              "Horarios",
              "Lunes a Viernes",
              "08:00 — 16:30 · Entrada gratuita",
            ],
            [FaPhone, "Contacto", "info@museogustavorces.ec", "02 123 4567"],
          ].map(([Icon, title, l1, l2]) => (
            <div
              key={title}
              className="glass-card"
              style={{
                padding: isMobile ? "24px" : "36px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,rgba(0,212,200,0.12),rgba(107,53,200,0.12))",
                  border: "0.5px solid var(--border-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Icon style={{ color: "var(--c-cyan)", fontSize: "24px" }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: isMobile ? "18px" : "22px",
                  fontWeight: "500",
                  marginBottom: "12px",
                  color: "var(--text-primary)",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: isMobile ? "15px" : "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                }}
              >
                {l1}
                <br />
                {l2}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section
        id="servicios"
        style={{ padding: isMobile ? "40px 16px" : "110px 80px" }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "48px" : "72px",
          }}
        >
          <span style={S.catLabel}>Nuestros servicios</span>
          <h2
            style={{
              ...S.title,
              fontSize: isMobile ? "28px" : "52px",
              fontWeight: "400",
            }}
          >
            ¿Cómo podemos ayudarte?
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
            gap: isMobile ? "16px" : "28px",
          }}
        >
          {[
            {
              Icon: FaCalendarAlt,
              title: "Visitas Grupales",
              desc: "Para grupos de 2 a 25 personas. Ideal para instituciones educativas con bloques de 30 minutos.",
              items: [
                "Reserva con 1 día de anticipación",
                "Lunes a Viernes, horario de atención",
                "Guías especializados disponibles",
                "Máximo 25 personas por bloque",
              ],
              to: "/publico/visitas/disponibilidad",
              cta: "Consultar disponibilidad",
              color: "#00D4C8",
              modal: false,
            },
            {
              Icon: FaUserPlus,
              title: "Visita Individual",
              desc: "Acceso libre durante nuestro horario de atención sin necesidad de reserva previa.",
              items: [
                "Sin reserva previa necesaria",
                "Registro rápido al ingresar",
                "Entrada gratuita para todos",
                "Recorre a tu propio ritmo",
              ],
              to: "/publico/visitante",
              cta: "Registrar visita",
              color: "#6B35C8",
              modal: false,
            },
            {
              Icon: MdMuseum,
              title: "Acceso al Sistema",
              desc: "Portal exclusivo para el personal del museo: administradores y pasantes.",
              items: [
                "Gestión completa de visitas",
                "Registro de visitantes",
                "Control de donaciones",
                "Reportes y estadísticas",
              ],
              to: "#",
              cta: "Iniciar sesión",
              color: "#E8166B",
              modal: true,
            },
          ].map(({ Icon, title, desc, items, to, cta, color, modal }) => (
            <div
              key={title}
              className="glass-card"
              style={{
                padding: isMobile ? "20px" : "40px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: `${color}18`,
                  border: `0.5px solid ${color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: isMobile ? "16px" : "24px",
                }}
              >
                <Icon style={{ color, fontSize: "24px" }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: isMobile ? "20px" : "26px",
                  fontWeight: "400",
                  marginBottom: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {title}
              </div>
              <p
                style={{
                  ...S.body,
                  fontSize: isMobile ? "15px" : "16px",
                  marginBottom: "22px",
                  flex: 1,
                }}
              >
                {desc}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  marginBottom: "32px",
                  textAlign: "left",
                }}
              >
                {items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: isMobile ? "14px" : "15px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              {modal ? (
                <button
                  onClick={() => setShowLogin(true)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: isMobile ? "12px 16px" : "13px",
                    borderRadius: "8px",
                    fontFamily: "var(--font-body)",
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: "500",
                    background: color,
                    color: "#fff",
                    border: `0.5px solid ${color}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.87")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {cta}
                </button>
              ) : (
                <Link
                  to={to}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: isMobile ? "12px 16px" : "13px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: "500",
                    background: color,
                    color: "#fff",
                    border: `0.5px solid ${color}`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.87")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DONACIONES */}
      <section
        id="donaciones"
        style={{
          padding: isMobile ? "40px 16px" : "110px 80px",
          background: "var(--bg-secondary)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(0,212,200,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(232,22,107,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "48px" : "72px",
          }}
        >
          <span style={S.catLabel}>Apoya al museo</span>
          <h2
            style={{
              ...S.title,
              fontSize: isMobile ? "28px" : "52px",
              fontWeight: "400",
              marginBottom: "20px",
            }}
          >
            Tu contribución hace la diferencia
          </h2>
          <p
            style={{
              ...S.body,
              maxWidth: isMobile ? "100%" : "540px",
              margin: "0 auto",
              fontSize: isMobile ? "16px" : "18px",
            }}
          >
            Preservar el patrimonio natural ecuatoriano requiere el apoyo de
            toda la comunidad.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "16px" : "28px",
            maxWidth: "840px",
            margin: "0 auto",
          }}
        >
          {[
            {
              Icon: FaDonate,
              title: "Donación Económica",
              desc: "Realiza una donación económica segura mediante pago en línea con Stripe.",
              link: "/publico/donacion/economica",
              cta: "Donar ahora",
              color: "#00D4C8",
            },
            {
              Icon: MdMuseum,
              title: "Donación de Bienes",
              desc: "Dona materiales, equipos o especímenes para enriquecer nuestras colecciones.",
              link: "/publico/donacion/bienes",
              cta: "Registrar donación",
              color: "#6B35C8",
            },
          ].map(({ Icon, title, desc, link, cta, color }) => (
            <div
              key={title}
              className="glass-card"
              style={{
                padding: isMobile ? "20px" : "48px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: `${color}18`,
                  border: `0.5px solid ${color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Icon style={{ color, fontSize: "28px" }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-title)",
                  fontSize: isMobile ? "22px" : "28px",
                  fontWeight: "400",
                  marginBottom: "14px",
                  color: "var(--text-primary)",
                }}
              >
                {title}
              </div>
              <p
                style={{
                  ...S.body,
                  fontSize: isMobile ? "15px" : "16px",
                  marginBottom: "32px",
                }}
              >
                {desc}
              </p>
              <Link
                to={link}
                style={{
                  display: "inline-block",
                  padding: isMobile ? "12px 24px" : "13px 36px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  fontWeight: "500",
                  background: `linear-gradient(135deg,${color},${color}99)`,
                  color: "#fff",
                }}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contacto"
        style={{
          padding: isMobile ? "32px 16px" : "80px",
          background: "var(--bg-primary)",
          borderTop: "0.5px solid var(--border-color)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "32px" : "56px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-title)",
                fontSize: isMobile ? "20px" : "28px",
                fontWeight: "600",
                background: "linear-gradient(135deg,#00D4C8,#6B35C8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "4px",
                marginBottom: "8px",
              }}
            >
              ZAYEN
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-muted)",
                letterSpacing: "3px",
              }}
            >
              MUSEO GUSTAVO ORCÉS · EPN
            </div>
            <div
              style={{
                width: "48px",
                height: "2px",
                background: "linear-gradient(90deg,#00D4C8,#6B35C8)",
                borderRadius: "2px",
                margin: "20px auto 0",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              gap: isMobile ? "24px" : "48px",
              textAlign: isMobile ? "center" : "center",
              marginBottom: isMobile ? "24px" : "56px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  letterSpacing: "2.5px",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                }}
              >
                Dirección
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: isMobile ? "15px" : "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                }}
              >
                Ladrón de Guevara E11-253
                <br />
                Quito, Ecuador
              </p>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  letterSpacing: "2.5px",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                }}
              >
                Contacto
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: isMobile ? "15px" : "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                }}
              >
                info@museogustavorces.ec
                <br />
                02 123 4567
              </p>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  letterSpacing: "2.5px",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                }}
              >
                Síguenos
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "14px",
                }}
              >
                <a
                  href="https://www.facebook.com/MuseoGustavoOrcesEPN"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#00D4C8";
                    e.currentTarget.style.borderColor = "#00D4C8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/mhngov"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E8166B";
                    e.currentTarget.style.borderColor = "#E8166B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  <FaSquareInstagram size={18} />
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "0.5px solid var(--border-color)",
              paddingTop: isMobile ? "20px" : "28px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              gap: isMobile ? "12px" : "0",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: isMobile ? "13px" : "14px",
                color: "var(--text-muted)",
              }}
            >
              © 2025 Museo Gustavo Orcés · Escuela Politécnica Nacional
            </p>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: isMobile ? "13px" : "14px",
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--c-cyan)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              Acceso para personal →
            </button>
          </div>
        </div>
      </footer>

      <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(10px)}}`}</style>
    </div>
  );
};

export default Home;
