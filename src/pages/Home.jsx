import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdMuseum } from 'react-icons/md';
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaDonate,
  FaCalendarAlt, FaUserPlus, FaChevronDown, FaSun, FaMoon } from 'react-icons/fa';
import { FaFacebook, FaSquareInstagram } from 'react-icons/fa6';
import themeStore from '../context/themeStore';
import LoginModal from '../components/LoginModal';

const condorImg = new URL('../assets/condor.jpeg', import.meta.url).href;
const mamutImg  = new URL('../assets/mamut.jpeg',  import.meta.url).href;
const jurasico  = new URL('../assets/jurasico.jpg', import.meta.url).href;
const dinoImg   = new URL('../assets/dino.jpg',     import.meta.url).href;

export const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [navState, setNavState] = useState('top');
  const lastScrollY = useRef(0);
  const { isDark, toggle } = themeStore();

  const handleScroll = useCallback(() => {
    const current = window.scrollY;
    if (current < 60) {
      setNavState('top');
    } else if (current < lastScrollY.current - 4) {
      setNavState('visible');
    } else if (current > lastScrollY.current + 4) {
      setNavState('hidden');
    }
    lastScrollY.current = current;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = showLogin ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showLogin]);

  const navBg = navState === 'top'
    ? 'transparent'
    : 'rgba(13,27,42,0.93)';

  const S = {
    catLabel: { fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:'600',
      letterSpacing:'3.5px', textTransform:'uppercase', color:'var(--c-cyan)',
      display:'block', marginBottom:'14px' },
    title: { fontFamily:'var(--font-title)', lineHeight:1.15, color:'var(--text-primary)' },
    body: { fontFamily:'var(--font-body)', fontSize:'17px', color:'var(--text-secondary)', lineHeight:1.8 },
  };

  return (
    <div style={{ background:'var(--bg-primary)', color:'var(--text-primary)', minHeight:'100vh' }}>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* NAVBAR */}
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        height:'80px', padding:'0 56px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background: navBg,
        backdropFilter: navState !== 'top' ? 'blur(22px)' : 'none',
        borderBottom: navState !== 'top' ? '0.5px solid rgba(255,255,255,0.09)' : 'none',
        transform: navState === 'hidden' ? 'translateY(-100%)' : 'translateY(0)',
        transition:'transform 0.38s ease, background 0.3s',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
          <img src="/epn.png" alt="EPN" style={{ height:'58px', width:'auto' }}/>
          <img src="/museo.png" alt="Museo" style={{ height:'58px', width:'auto' }}/>
          <div style={{ borderLeft:'1px solid rgba(255,255,255,0.2)', paddingLeft:'20px' }}>
            <div style={{ fontFamily:'var(--font-title)', fontSize:'20px', fontWeight:'600',
              color:'#fff', letterSpacing:'1.5px' }}>MUSEO</div>
            <div style={{ fontFamily:'var(--font-title)', fontSize:'13px',
              color:'rgba(255,255,255,0.6)', letterSpacing:'2px' }}>GUSTAVO ORCÉS</div>
          </div>
        </div>
        <nav style={{ display:'flex', alignItems:'center', gap:'36px' }}>
          {[['#inicio','Inicio'],['#nosotros','Nosotros'],['#servicios','Servicios'],['#contacto','Contacto']].map(([h,l])=>(
            <a key={h} href={h} style={{ fontFamily:'var(--font-body)', fontSize:'16px',
              color:'rgba(255,255,255,0.75)', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#fff'}
              onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.75)'}
            >{l}</a>
          ))}
          <button onClick={toggle} style={{ background:'rgba(255,255,255,0.1)',
            border:'0.5px solid rgba(255,255,255,0.2)', borderRadius:'8px', padding:'8px 12px',
            cursor:'pointer', color:'#fff', display:'flex', alignItems:'center' }}>
            {isDark ? <FaSun size={15}/> : <FaMoon size={15}/>}
          </button>
          <button onClick={()=>setShowLogin(true)} style={{ fontFamily:'var(--font-body)',
            fontSize:'15px', fontWeight:'500',
            background:'linear-gradient(135deg,#00D4C8,#6B35C8)',
            color:'#fff', border:'none', padding:'10px 26px',
            borderRadius:'8px', cursor:'pointer', transition:'opacity 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.opacity='0.87'}
            onMouseLeave={e=>e.currentTarget.style.opacity='1'}
          >Iniciar sesión</button>
        </nav>
      </header>

      {/* HERO */}
      <section id="inicio" style={{ position:'relative', height:'100vh', overflow:'hidden' }}>
        <img src={jurasico} alt="Hero"
          style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.32)' }}/>
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(150deg,rgba(13,27,42,0.85) 0%,rgba(107,53,200,0.2) 60%,rgba(232,22,107,0.08) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
          justifyContent:'center', padding:'0 80px', paddingTop:'80px' }}>
          <div style={{ maxWidth:'720px' }}>
            <span style={S.catLabel}>Escuela Politécnica Nacional · Quito, Ecuador</span>
            <h1 style={{ ...S.title, fontSize:'clamp(52px,7vw,94px)', color:'#fff',
              marginBottom:'28px', fontWeight:'400' }}>
              Patrimonio<br/>
              <span style={{ fontStyle:'italic',
                background:'linear-gradient(135deg,#00D4C8,#6B35C8)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Científico</span><br/>
              del Ecuador
            </h1>
            <div className="accent-line"/>
            <p style={{ ...S.body, color:'rgba(255,255,255,0.72)', fontSize:'20px',
              marginBottom:'44px', maxWidth:'540px' }}>
              Inspirando generaciones a través del conocimiento, la ciencia y la historia natural.
            </p>
            <div style={{ display:'flex', gap:'18px', flexWrap:'wrap' }}>
              <a href="#servicios" style={{ fontFamily:'var(--font-body)', fontSize:'16px',
                fontWeight:'500', display:'inline-flex', alignItems:'center', gap:'10px',
                background:'linear-gradient(135deg,#00D4C8,#6B35C8)', color:'#fff',
                padding:'14px 36px', borderRadius:'8px', textDecoration:'none' }}>
                <FaCalendarAlt/> Agendar visita
              </a>
              <a href="#donaciones" style={{ fontFamily:'var(--font-body)', fontSize:'16px',
                display:'inline-flex', alignItems:'center', gap:'10px',
                background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', color:'#fff',
                padding:'14px 36px', borderRadius:'8px', textDecoration:'none',
                border:'0.5px solid rgba(255,255,255,0.22)' }}>
                <FaDonate/> Apoyar al museo
              </a>
            </div>
          </div>
        </div>
        <a href="#nosotros" style={{ position:'absolute', bottom:'44px', left:'50%',
          transform:'translateX(-50%)', color:'rgba(255,255,255,0.4)',
          animation:'bounce 2.2s ease infinite', textDecoration:'none' }}>
          <FaChevronDown size={28}/>
        </a>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="nosotros" style={{ padding:'110px 80px',
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'90px', alignItems:'center' }}>
        <div>
          <span style={S.catLabel}>Sobre nosotros</span>
          <h2 style={{ ...S.title, fontSize:'52px', marginBottom:'28px', fontWeight:'400' }}>
            Un espacio para la ciencia y la{' '}
            <span style={{ fontStyle:'italic', background:'linear-gradient(135deg,#00D4C8,#6B35C8)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>historia natural</span>
          </h2>
          <div className="accent-line"/>
          <p style={{ ...S.body, marginBottom:'36px' }}>
            El Museo Gustavo Orcés dedica sus esfuerzos a la ciencia y la historia natural del Ecuador.
            Educamos, inspiramos y conectamos a los visitantes con la riqueza biológica y paleontológica del país.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            {[['Exhibiciones permanentes','Colecciones de fauna, paleontología y biodiversidad ecuatoriana.'],
              ['Biblioteca científica','Acceso a publicaciones y documentos históricos del país.'],
              ['Programas educativos','Talleres y visitas guiadas para todas las edades.']
            ].map(([t,d])=>(
              <div key={t} style={{ display:'flex', gap:'18px', alignItems:'flex-start' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%',
                  background:'var(--c-cyan)', marginTop:'12px', flexShrink:0 }}/>
                <div>
                  <div style={{ fontFamily:'var(--font-body)', fontSize:'17px', fontWeight:'600',
                    color:'var(--text-primary)', marginBottom:'4px' }}>{t}</div>
                  <div style={{ fontFamily:'var(--font-body)', fontSize:'16px', color:'var(--text-muted)' }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
          gridTemplateRows:'220px 220px', gap:'14px' }}>
          <img src={condorImg} alt="Cóndor"
            style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px', gridRow:'1/3' }}/>
          <img src={mamutImg} alt="Mamut"
            style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }}/>
          <img src={dinoImg} alt="Dino"
            style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }}/>
        </div>
      </section>

      {/* INFO MUSEO */}
      <section style={{ padding:'80px', background:'var(--bg-secondary)' }}>
        <div style={{ maxWidth:'980px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'36px' }}>
          {[[FaMapMarkerAlt,'Ubicación','Ladrón de Guevara E11-253','Quito, Ecuador'],
            [FaClock,'Horarios','Lunes a Viernes','08:00 — 16:30 · Entrada gratuita'],
            [FaPhone,'Contacto','info@museogustavorces.ec','02 123 4567']
          ].map(([Icon,title,l1,l2])=>(
            <div key={title} className="glass-card" style={{ padding:'36px', textAlign:'center' }}>
              <div style={{ width:'60px', height:'60px', borderRadius:'50%',
                background:'linear-gradient(135deg,rgba(0,212,200,0.12),rgba(107,53,200,0.12))',
                border:'0.5px solid var(--border-accent)',
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <Icon style={{ color:'var(--c-cyan)', fontSize:'24px' }}/>
              </div>
              <div style={{ fontFamily:'var(--font-title)', fontSize:'22px',
                fontWeight:'500', marginBottom:'12px', color:'var(--text-primary)' }}>{title}</div>
              <div style={{ fontFamily:'var(--font-body)', fontSize:'16px',
                color:'var(--text-secondary)', lineHeight:1.9 }}>{l1}<br/>{l2}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding:'110px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:'72px' }}>
          <span style={S.catLabel}>Nuestros servicios</span>
          <h2 style={{ ...S.title, fontSize:'52px', fontWeight:'400' }}>¿Cómo podemos ayudarte?</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'28px' }}>
          {[
            { Icon:FaCalendarAlt, title:'Visitas Grupales',
              desc:'Para grupos de 2 a 25 personas. Ideal para instituciones educativas con bloques de 30 minutos.',
              items:['Reserva con 1 día de anticipación','Lunes a Viernes, horario de atención','Guías especializados disponibles','Máximo 25 personas por bloque'],
              to:'/publico/visitas/disponibilidad', cta:'Consultar disponibilidad', color:'#00D4C8', modal:false },
            { Icon:FaUserPlus, title:'Visita Individual',
              desc:'Acceso libre durante nuestro horario de atención sin necesidad de reserva previa.',
              items:['Sin reserva previa necesaria','Registro rápido al ingresar','Entrada gratuita para todos','Recorre a tu propio ritmo'],
              to:'/publico/visitante', cta:'Registrar visita', color:'#6B35C8', modal:false },
            { Icon:MdMuseum, title:'Acceso al Sistema',
              desc:'Portal exclusivo para el personal del museo: administradores y pasantes.',
              items:['Gestión completa de visitas','Registro de visitantes','Control de donaciones','Reportes y estadísticas'],
              to:'#', cta:'Iniciar sesión', color:'#E8166B', modal:true },
          ].map(({ Icon, title, desc, items, to, cta, color, modal })=>(
            <div key={title} className="glass-card" style={{ padding:'40px', display:'flex', flexDirection:'column' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'12px',
                background:`${color}18`, border:`0.5px solid ${color}40`,
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' }}>
                <Icon style={{ color, fontSize:'24px' }}/>
              </div>
              <div style={{ fontFamily:'var(--font-title)', fontSize:'26px',
                fontWeight:'400', marginBottom:'14px', color:'var(--text-primary)' }}>{title}</div>
              <p style={{ ...S.body, fontSize:'16px', marginBottom:'22px', flex:1 }}>{desc}</p>
              <ul style={{ listStyle:'none', marginBottom:'32px' }}>
                {items.map(item=>(
                  <li key={item} style={{ fontFamily:'var(--font-body)', fontSize:'15px',
                    color:'var(--text-muted)', marginBottom:'8px',
                    display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:color, flexShrink:0 }}/>{item}
                  </li>
                ))}
              </ul>
              {modal
                ? <button onClick={()=>setShowLogin(true)} style={{
                    display:'block', width:'100%', textAlign:'center', padding:'13px',
                    borderRadius:'8px', fontFamily:'var(--font-body)', fontSize:'16px',
                    fontWeight:'500', background:`${color}18`, color,
                    border:`0.5px solid ${color}40`, cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.color='#fff';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${color}18`;e.currentTarget.style.color=color;}}
                  >{cta}</button>
                : <Link to={to} style={{
                    display:'block', textAlign:'center', padding:'13px',
                    borderRadius:'8px', textDecoration:'none',
                    fontFamily:'var(--font-body)', fontSize:'16px', fontWeight:'500',
                    background:`${color}18`, color, border:`0.5px solid ${color}40`, transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.color='#fff';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${color}18`;e.currentTarget.style.color=color;}}
                  >{cta}</Link>
              }
            </div>
          ))}
        </div>
      </section>

      {/* DONACIONES */}
      <section id="donaciones" style={{ padding:'110px 80px', background:'var(--bg-secondary)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(0,212,200,0.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(232,22,107,0.04)', pointerEvents:'none' }}/>
        <div style={{ textAlign:'center', marginBottom:'72px' }}>
          <span style={S.catLabel}>Apoya al museo</span>
          <h2 style={{ ...S.title, fontSize:'52px', fontWeight:'400', marginBottom:'20px' }}>Tu contribución hace la diferencia</h2>
          <p style={{ ...S.body, maxWidth:'540px', margin:'0 auto', fontSize:'18px' }}>
            Preservar el patrimonio natural ecuatoriano requiere el apoyo de toda la comunidad.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'28px', maxWidth:'840px', margin:'0 auto' }}>
          {[
            { Icon:FaDonate, title:'Donación Económica', desc:'Realiza una donación económica segura mediante pago en línea con Stripe.', link:'/publico/donacion/economica', cta:'Donar ahora', color:'#00D4C8' },
            { Icon:MdMuseum, title:'Donación de Bienes', desc:'Dona materiales, equipos o especímenes para enriquecer nuestras colecciones.', link:'/publico/donacion/bienes', cta:'Registrar donación', color:'#6B35C8' },
          ].map(({ Icon, title, desc, link, cta, color })=>(
            <div key={title} className="glass-card" style={{ padding:'48px', textAlign:'center' }}>
              <div style={{ width:'68px', height:'68px', borderRadius:'50%',
                background:`${color}18`, border:`0.5px solid ${color}40`,
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                <Icon style={{ color, fontSize:'28px' }}/>
              </div>
              <div style={{ fontFamily:'var(--font-title)', fontSize:'28px',
                fontWeight:'400', marginBottom:'14px', color:'var(--text-primary)' }}>{title}</div>
              <p style={{ ...S.body, fontSize:'16px', marginBottom:'32px' }}>{desc}</p>
              <Link to={link} style={{ display:'inline-block', padding:'13px 36px', borderRadius:'8px',
                textDecoration:'none', fontFamily:'var(--font-body)', fontSize:'16px', fontWeight:'500',
                background:`linear-gradient(135deg,${color},${color}99)`, color:'#fff' }}>{cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" style={{ padding:'80px', background:'var(--bg-primary)', borderTop:'0.5px solid var(--border-color)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'56px' }}>
            <div style={{ fontFamily:'var(--font-title)', fontSize:'28px', fontWeight:'600',
              background:'linear-gradient(135deg,#00D4C8,#6B35C8)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              letterSpacing:'4px', marginBottom:'8px' }}>ZAYEN</div>
            <div style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'var(--text-muted)', letterSpacing:'3px' }}>
              MUSEO GUSTAVO ORCÉS · EPN
            </div>
            <div style={{ width:'48px', height:'2px', background:'linear-gradient(90deg,#00D4C8,#6B35C8)',
              borderRadius:'2px', margin:'20px auto 0' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
            gap:'48px', textAlign:'center', marginBottom:'56px' }}>
            {[
              ['DIRECCIÓN','Ladrón de Guevara E11-253\nQuito, Ecuador'],
              ['CONTACTO','info@museogustavorces.ec\n02 123 4567'],
            ].map(([label, text])=>(
              <div key={label}>
                <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:'600',
                  color:'var(--text-muted)', letterSpacing:'2.5px', marginBottom:'20px' }}>{label}</div>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'16px',
                  color:'var(--text-secondary)', lineHeight:1.9, whiteSpace:'pre-line' }}>{text}</p>
              </div>
            ))}
            <div>
              <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:'600',
                color:'var(--text-muted)', letterSpacing:'2.5px', marginBottom:'20px' }}>SÍGUENOS</div>
              <div style={{ display:'flex', justifyContent:'center', gap:'14px' }}>
                {[[FaFacebook,'https://www.facebook.com/MuseoGustavoOrcesEPN','#00D4C8'],
                  [FaSquareInstagram,'https://www.instagram.com/mhngov','#E8166B']
                ].map(([Icon,href,hc])=>(
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ width:'44px', height:'44px', borderRadius:'8px',
                      background:'var(--bg-card)', border:'0.5px solid var(--border-color)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'var(--text-secondary)', textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.color=hc;e.currentTarget.style.borderColor=hc;}}
                    onMouseLeave={e=>{e.currentTarget.style.color='var(--text-secondary)';e.currentTarget.style.borderColor='var(--border-color)';}}
                  ><Icon size={18}/></a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop:'0.5px solid var(--border-color)', paddingTop:'28px',
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'14px', color:'var(--text-muted)' }}>
              © 2025 Museo Gustavo Orcés · Escuela Politécnica Nacional
            </p>
            <button onClick={()=>setShowLogin(true)} style={{ fontFamily:'var(--font-body)',
              fontSize:'14px', color:'var(--text-muted)', background:'none',
              border:'none', cursor:'pointer', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--c-cyan)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}
            >Acceso para personal →</button>
          </div>
        </div>
      </footer>

      <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(10px)}}`}</style>
    </div>
  );
};

export default Home;
