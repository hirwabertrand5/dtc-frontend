const StatCard = ({ title, value, percentage, color }) => {
  return (
    <div style={styles.card}>
      <p style={styles.title}>{title}</p>
      <h2 style={styles.value}>{value}</h2>
      <p style={{ ...styles.percentage, color }}>{percentage}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 0 1px #eee",
    minWidth: "200px",
    flex: 1
  },
  title: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
    fontWeight: 500
  },
  value: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: 4
  },
  percentage: {
    fontSize: "14px",
    fontWeight: 500,
    marginTop: "4px"
  }
};

export default StatCard;
