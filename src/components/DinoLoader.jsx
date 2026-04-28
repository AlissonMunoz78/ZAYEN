const DinoLoader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "'EB Garamond', serif",
        fontSize: '40px', fontWeight: '600', letterSpacing: '8px',
        background: 'linear-gradient(135deg, #00D4C8, #6B35C8)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '12px',
      }}>ZAYEN</div>

      <div style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: '12px', color: 'rgba(255,255,255,0.35)',
        letterSpacing: '3px', marginBottom: '48px',
      }}>MUSEO GUSTAVO ORCÉS</div>

      {/* Barra de progreso */}
      <div style={{
        width: '200px', height: '2px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '2px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #00D4C8, #6B35C8, #E8166B)',
          borderRadius: '2px',
          animation: 'loaderBar 1.2s ease-in-out infinite alternate',
        }} />
      </div>

      <style>{`
        @keyframes loaderBar { from { width: 15%; } to { width: 92%; } }
      `}</style>
    </div>
  );
};

export default DinoLoader;
