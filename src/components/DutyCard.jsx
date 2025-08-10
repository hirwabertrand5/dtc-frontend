const DutyCard = ({ label, type }) => {
  let bg = "#e0e7ff", color = "#2563eb";
  if (type === "Conflict") { bg = "#fee2e2"; color = "#dc2626"; }
  if (type === "Linked") { bg = "#e0e7ff"; color = "#2563eb"; }
  if (type === "Unlinked") { bg = "#fef3c7"; color = "#b45309"; }

  // Highlight "NO REST" or "OVERLAP" in red/orange
  if (label.includes("NO REST")) { bg = "#fee2e2"; color = "#dc2626"; }
  if (label.includes("OVERLAP")) { bg = "#fef3c7"; color = "#b45309"; }

  return (
    <div style={{
      background: bg,
      color,
      borderRadius: 10,
      padding: "10px 14px",
      fontWeight: 600,
      fontSize: 14,
      textAlign: "center",
      minWidth: 90,
      whiteSpace: "pre-line",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      {label}
    </div>
  );
};

export default DutyCard;
