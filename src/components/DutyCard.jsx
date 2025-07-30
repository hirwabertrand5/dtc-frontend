const DutyCard = ({ label, type }) => {
  const getColor = () => {
    if (label.toLowerCase().includes("conflict") || type === "Conflict") return "#fee2e2";
    if (type === "Linked") return "#dbeafe";
    if (type === "Unlinked") return "#fef3c7";
    return "#f3f4f6";
  };

  return (
    <div
      style={{
        background: getColor(),
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
        color: "#222",
        textAlign: "center",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
      }}
    >
      {label}
    </div>
  );
};

export default DutyCard;