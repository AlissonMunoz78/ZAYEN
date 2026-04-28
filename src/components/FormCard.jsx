const FormCard = ({ title, category, children }) => (
  <div style={{ maxWidth:'680px', margin:'0 auto' }}>
    <div style={{ marginBottom:'36px' }}>
      <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:'600',
        letterSpacing:'3px', textTransform:'uppercase', color:'var(--c-cyan)',
        display:'block', marginBottom:'8px' }}>{category}</span>
      <h1 style={{ fontFamily:'var(--font-title)', fontSize:'38px', fontWeight:'400',
        color:'var(--text-primary)' }}>{title}</h1>
      <div style={{ width:'48px', height:'3px',
        background:'linear-gradient(90deg,#00D4C8,#6B35C8)',
        borderRadius:'2px', marginTop:'14px' }}/>
    </div>
    <div className="glass-card" style={{ padding:'44px' }}>
      {children}
    </div>
  </div>
);
export default FormCard;
