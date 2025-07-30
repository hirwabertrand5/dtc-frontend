import Layout from "../components/Layout";
import DutyCard from "../components/DutyCard";
import { useState } from "react";

const crews = [
  { id: "C001", name: "Rajesh Kumar", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "C002", name: "Priya Sharma", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "C003", name: "Amit Singh", avatar: "https://i.pravatar.cc/40?img=3" }
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DutyScheduler = () => {
  const [activeTab, setActiveTab] = useState("Linked");

  return (
    <Layout>
      <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
        
        {/* === Scheduler Grid Area === */}
        <div style={{ flex: 3 }}>
          {/* Title & Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Duty Scheduler</h2>
            <div>
              {["Linked", "Unlinked"].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  style={{
                    padding: "10px 16px",
                    marginLeft: "10px",
                    background: activeTab === type ? "#0d6efd" : "#f5f5f5",
                    color: activeTab === type ? "#fff" : "#333",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "200px repeat(7, 1fr)",
            background: "#f1f3f5",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "14px"
          }}>
            <div></div>
            {days.map(day => (
              <div key={day} style={{ textAlign: "center" }}>{day}</div>
            ))}
          </div>

          {/* Crew Rows */}
          {crews.map(crew => (
            <div
              key={crew.id}
              style={{
                display: "grid",
                gridTemplateColumns: "200px repeat(7, 1fr)",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #eee"
              }}
            >
              {/* Crew Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "10px" }}>
                <img src={crew.avatar} alt="Avatar" style={{ borderRadius: "50%", width: "36px" }} />
                <div>
                  <strong>{crew.name}</strong><br />
                  <small>{crew.id}</small>
                </div>
              </div>

              {/* Calendar Duty Slots */}
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    minHeight: "60px",
                    background: "#fff",
                    border: "1px dashed #ccc",
                    margin: "4px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {/* Static pills for now */}
                  {crew.id === "C001" && i === 1 && (
                    <DutyCard label="Route 101 — 08:00–16:00" type="Linked" />
                  )}
                  {crew.id === "C002" && i === 2 && (
                    <DutyCard label="Route 205 — 09:00–17:00" type="Unlinked" />
                  )}
                  {crew.id === "C003" && i === 3 && (
                    <DutyCard label="Route 303 — NO REST" type="Conflict" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* === Unassigned Duties Panel === */}
        <div style={{ flex: 1 }}>
          <h3>Unassigned Duties</h3>
          <div style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <DutyCard label="Route X — 10:00–18:00" type="Linked" />
            <DutyCard label="Route Y — 06:00–14:00" type="Unlinked" />
            <DutyCard label="Route Z — Conflict" type="Conflict" />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default DutyScheduler;