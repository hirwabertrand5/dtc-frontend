import React from "react";

const Topbar = () => {
  return (
    <div style={styles.container}>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search..."
        style={styles.search}
      />

      {/* Profile section */}
      <div style={styles.profile}>
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          style={styles.avatar}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "60px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  search: {
    width: "300px",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "#f5f5f5",
  },
  profile: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
};

export default Topbar;
