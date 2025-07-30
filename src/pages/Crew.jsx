import Layout from "../components/Layout";
import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // icons

const initialData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    crewId: "DTC-C001",
    role: "Driver",
    status: "On Duty",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Priya Sharma",
    crewId: "DTC-C002",
    role: "Conductor",
    status: "Available",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: 3,
    name: "Amit Singh",
    crewId: "DTC-C003",
    role: "Driver",
    status: "Resting",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
];

const getStatusStyle = (status) => {
  let base = {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#fff"
  };
  if (status === "Available") return { ...base, backgroundColor: "#28a745" };
  if (status === "On Duty") return { ...base, backgroundColor: "#0d6efd" };
  if (status === "Resting") return { ...base, backgroundColor: "#adb5bd" };
  return { ...base, backgroundColor: "#6c757d" };
};

const Crew = () => {
  const [crewData, setCrewData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    crewId: "",
    role: "Driver",
    status: "Available",
    avatar: "https://i.pravatar.cc/150"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCrew = {
      id: Date.now(),
      ...form
    };
    setCrewData([...crewData, newCrew]);
    setForm({
      name: "",
      crewId: "",
      role: "Driver",
      status: "Available",
      avatar: "https://i.pravatar.cc/150"
    });
    setShowModal(false);
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ fontWeight: 600 }}>Crew Management</h2>
        <button onClick={() => setShowModal(true)} style={addBtn}>+ Add New Crew</button>
      </div>

      <div style={cardTable}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>NAME</th>
              <th>ID</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {crewData.map((crew) => (
              <tr key={crew.id} style={{ borderTop: "1px solid #eee", height: "60px" }}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={crew.avatar} alt="avatar" style={avatarStyle} />
                    <div>
                      <div style={{ fontWeight: "600" }}>{crew.name}</div>
                    </div>
                  </div>
                </td>
                <td>{crew.crewId}</td>
                <td>{crew.role}</td>
                <td><span style={getStatusStyle(crew.status)}>{crew.status}</span></td>
                <td>
                  <FiEdit style={{ cursor: "pointer", marginRight: "12px", color: "#333" }} />
                  <FiTrash2 style={{ cursor: "pointer", color: "#dc3545" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: "1rem" }}>Add New Crew</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                required
                style={inputField}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                name="crewId"
                placeholder="Employee ID (e.g. DTC-C005)"
                value={form.crewId}
                required
                style={inputField}
                onChange={(e) => setForm({ ...form, crewId: e.target.value })}
              />
              <select name="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputField}>
                <option>Driver</option>
                <option>Conductor</option>
              </select>
              <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputField}>
                <option>Available</option>
                <option>Resting</option>
                <option>On Duty</option>
              </select>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
                <button type="submit" style={saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

// --- Styles ---

const addBtn = {
  padding: "10px 16px",
  borderRadius: "8px",
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

const cardTable = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)"
};

const avatarStyle = {
  width: "40px", height: "40px", borderRadius: "50%"
};

const inputField = {
  padding: "10px",
  width: "100%",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const modalBackdrop = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100
};

const modalBox = {
  background: "#fff",
  borderRadius: "12px",
  padding: "24px",
  width: "400px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
};

const saveBtn = {
  backgroundColor: "#0d6efd",
  padding: "10px 20px",
  color: "#fff",
  borderRadius: "8px",
  border: "none",
  fontWeight: 600
};

const cancelBtn = {
  backgroundColor: "#6c757d",
  padding: "10px 20px",
  color: "#fff",
  borderRadius: "8px",
  border: "none",
  fontWeight: 600
};

export default Crew;
