import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Crew Management", path: "/crew" },
    { name: "Bus Management", path: "/buses" },
    { name: "Duty Scheduler", path: "/duties" },
    { name: "Route Planner", path: "/routes" },
    { name: "Reports", path: "/reports" },
    { name: "Admin Settings", path: "/settings" },
    { name: "Users & Roles", path: "/users" },
    { name: "Simulation", path: "/simulation" },
    { name: "Profile & Logout", path: "/profile" }
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>DTC Bus System</h2>

      <nav style={styles.nav}>
        {menus.map((menu, index) => (
          <NavLink
            key={index}
            to={menu.path}
            style={({ isActive }) => ({
              ...styles.link,
              backgroundColor: isActive ? "#e8f0fe" : "transparent",
              fontWeight: isActive ? "600" : "400"
            })}
          >
            {menu.name}
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          style={styles.avatar}
        />
        <div>
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <br />
          <span style={{ fontSize: "12px", color: "#777" }}>Admin</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRight: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh"
  },
  logo: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "30px",
    color: "#212121"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  link: {
    padding: "12px 16px",
    borderRadius: "6px",
    color: "#333",
    textDecoration: "none"
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderTop: "1px solid #eee",
    paddingTop: "15px"
  },
  avatar: {
    borderRadius: "50%",
    width: "40px",
    height: "40px"
  }
};

export default Sidebar;
