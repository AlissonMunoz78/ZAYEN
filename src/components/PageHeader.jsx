const PageHeader = ({ category, title, action }) => (
  <div
    className="page-header"
    style={{
      marginBottom: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "24px",
      flexWrap: "wrap",
    }}
  >
    <div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--c-cyan)",
          display: "block",
          marginBottom: "8px",
        }}
      >
        {category}
      </span>
      <h1
        style={{
          fontFamily: "var(--font-title)",
          fontSize: "38px",
          fontWeight: "400",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        {title}
      </h1>
      <div
        style={{
          width: "48px",
          height: "3px",
          background: "linear-gradient(90deg,#00D4C8,#6B35C8)",
          borderRadius: "2px",
          marginTop: "14px",
        }}
      />
    </div>
    <div
      className="page-header-action"
      style={{ display: "flex", alignItems: "flex-end" }}
    >
      {action}
    </div>
  </div>
);
export default PageHeader;
