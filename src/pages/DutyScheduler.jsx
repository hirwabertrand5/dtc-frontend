import Layout from "../components/Layout";
import DutyCard from "../components/DutyCard";
import { useState } from "react";

// Static data for demo
const crews = [
  { id: "C001", name: "Rajesh Kumar", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "C002", name: "Priya Sharma", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "C003", name: "Amit Singh", avatar: "https://i.pravatar.cc/40?img=3" }
];

const days = [
  { label: "MON", date: "24" },
  { label: "TUE", date: "25" },
  { label: "WED", date: "26" },
  { label: "THU", date: "27" },
  { label: "FRI", date: "28" },
  { label: "SAT", date: "29" }
];

// Duties per crew per day (index = day)
const duties = {
  C001: [
    { day: 0, label: "Route 101\n08:00 - 16:00", type: "Linked" },
    { day: 1, label: "Route 205\n09:00 - 17:00\nOVERLAP", type: "Conflict" },
    { day: 3, label: "Route 101\n08:00 - 16:00", type: "Linked" },
    { day: 4, label: "Route 303\n10:00 - 18:00", type: "Linked" }
  ],
  C002: [
    { day: 0, label: "Route 205\n09:00 - 17:00", type: "Linked" },
    { day: 2, label: "Route 303\n08:00 - 16:00\nNO REST", type: "Conflict" },
    { day: 4, label: "Route 303\n10:00 - 18:00", type: "Linked" }
  ],
  C003: [
    { day: 0, label: "Route 303\n10:00 - 18:00", type: "Linked" },
    { day: 4, label: "Route 101\n08:00 - 16:00", type: "Linked" }
  ]
};

const unassigned = [
  { label: "Route 404\n07:00 - 15:00", type: "Linked" },
  { label: "Route 501 (AC)\n12:00 - 20:00", type: "Linked" },
  { label: "Route 101 (Night)\n22:00 - 06:00", type: "Linked" }
];

const DutyScheduler = () => {
  const [activeTab, setActiveTab] = useState("Linked");

  return (
    <Layout>
      <div style={{ padding: "2rem", display: "flex", gap: "2rem" }}>
        {/* Main Scheduler */}
        <div style={{ flex: 3, minWidth: 0 }}>
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Duty Scheduler</h2>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer"
              }}>Today</button>
              <button
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >Add New Duty</button>
            </div>
          </div>
          {/* Tabs & Date Range */}
          <div style={{ display: "flex", alignItems: "center", margin: "24px 0 8px 0" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setActiveTab("Linked")}
                style={{
                  background: activeTab === "Linked" ? "#2563eb" : "#f3f4f6",
                  color: activeTab === "Linked" ? "#fff" : "#888",
                  border: "none",
                  borderRadius: "8px 0 0 8px",
                  padding: "8px 18px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >Linked Duties</button>
              <button
                onClick={() => setActiveTab("Unlinked")}
                style={{
                  background: activeTab === "Unlinked" ? "#2563eb" : "#f3f4f6",
                  color: activeTab === "Unlinked" ? "#fff" : "#888",
                  border: "none",
                  borderRadius: "0 8px 8px 0",
                  padding: "8px 18px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >Unlinked Duties</button>
            </div>
            <div style={{ marginLeft: "auto", color: "#666", fontWeight: 500 }}>
              Mon, 24 Jul 2024 - Sun, 30 Jul 2024
            </div>
          </div>
          {/* Grid */}
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            overflowX: "auto",
            padding: "0 0 1rem 0"
          }}>
            {/* Grid Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "180px repeat(6, 1fr)",
              borderBottom: "1px solid #eee",
              fontWeight: 600,
              color: "#888",
              fontSize: "15px",
              padding: "16px 0 8px 0"
            }}>
              <div style={{ paddingLeft: 24 }}>CREW</div>
              {days.map(day => (
                <div key={day.label} style={{ textAlign: "center" }}>
                  <div>{day.label}</div>
                  <div style={{ fontSize: 13, color: "#bbb" }}>{day.date}</div>
                </div>
              ))}
            </div>
            {/* Crew Rows */}
            {crews.map(crew => (
              <div
                key={crew.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px repeat(6, 1fr)",
                  alignItems: "center",
                  minHeight: 80,
                  borderBottom: "1px solid #f3f4f6"
                }}
              >
                {/* Crew Info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 24 }}>
                  <img src={crew.avatar} alt={crew.name} style={{ borderRadius: "50%", width: 44, height: 44 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{crew.name}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>ID: {crew.id}</div>
                  </div>
                </div>
                {/* Duty Slots */}
                {days.map((day, idx) => {
                  const duty = (duties[crew.id] || []).find(d => d.day === idx);
                  return (
                    <div key={idx} style={{
                      minHeight: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {duty && (
                        <DutyCard label={duty.label} type={duty.type} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {/* Unassigned Duties */}
        <div style={{
          flex: 1,
          background: "#fafbfc",
          borderRadius: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: "24px",
          minWidth: 260,
          maxWidth: 320,
          height: "fit-content"
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: 18 }}>Unassigned Duties</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {unassigned.map((duty, idx) => (
              <DutyCard key={idx} label={duty.label} type={duty.type} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DutyScheduler;
