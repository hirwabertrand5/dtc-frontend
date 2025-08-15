import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Get user role from JWT ---
let userRole = "";
const token = localStorage.getItem("token");
if (token) {
  try {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  } catch (e) {
    userRole = "";
  }
}

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

const handleClearArchived = async () => {
  if (!window.confirm("Are you sure you want to permanently delete all archived crew? This cannot be undone!")) return;
  try {
    const token = localStorage.getItem("token");
    await axios.delete("/api/crew/archived/clear", {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("All archived crew deleted!");
    setShowArchived(false);
    fetchCrew();
  } catch (err) {
    toast.error("Failed to clear archived crew");
  }
};

const Crew = () => {
  const [crewData, setCrewData] = useState([]);
  const [archivedCrew, setArchivedCrew] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "Driver",
    status: "Available",
    avatar: null
  });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!showArchived) fetchCrew();
    // eslint-disable-next-line
  }, [page, showArchived]);

  const fetchCrew = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/crew?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrewData(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch crew");
    }
  };

  const fetchArchivedCrew = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/crew/archived", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArchivedCrew(res.data);
      setShowArchived(true);
    } catch (err) {
      toast.error("Failed to fetch archived crew");
    }
  };

  // Open modal for add or edit
  const openModal = (crew = null) => {
    setError("");
    if (crew) {
      setEditMode(true);
      setEditId(crew._id);
      setForm({
        name: crew.name,
        role: crew.role,
        status: crew.status,
        avatar: crew.avatar || null
      });
    } else {
      setEditMode(false);
      setEditId(null);
      setForm({
        name: "",
        role: "Driver",
        status: "Available",
        avatar: null
      });
    }
    setShowModal(true);
  };

  // Add or update crew
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("status", form.status);
      if (form.avatar && typeof form.avatar !== "string") {
        formData.append("avatar", form.avatar);
      }
      if (editMode) {
        // Update
        await axios.put(`/api/crew/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Crew updated!");
      } else {
        // Add
        await axios.post("/api/crew", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Crew added!");
      }
      setShowModal(false);
      setForm({
        name: "",
        role: "Driver",
        status: "Available",
        avatar: null
      });
      fetchCrew();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save crew");
      toast.error(err.response?.data?.error || "Failed to save crew");
    }
  };

  // Soft delete (archive)
  const handleDelete = async (id) => {
    if (!window.confirm("Archive this crew member?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/crew/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Crew archived!");
      fetchCrew();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to archive crew");
    }
  };

  // Export to CSV
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/crew/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "crew_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Exported CSV!");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ fontWeight: 600 }}>Crew Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {userRole === "Admin" && (
            <>
<button onClick={() => openModal()} style={addBtn}>+ Add New Crew</button>
      <button onClick={handleExport} style={exportBtn}>Export CSV</button>
      <button onClick={fetchArchivedCrew} style={archiveBtn}>View Archived Crew</button>
            </>
          )}
        </div>
      </div>

      {userRole !== "Admin" && (
        <div style={{ color: "#888", marginBottom: 10 }}>
          You have view-only access to crew data.
        </div>
      )}

      {!showArchived && (
        <>
          <div style={cardTable}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>Created By</th>
                  <th>Updated By</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(crewData) && crewData.map((crew) => (
                  <tr key={crew._id} style={{ borderTop: "1px solid #eee", height: "60px" }}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={
                            crew.avatar
                              ? crew.avatar.startsWith("/uploads")
                                ? `http://localhost:5000${crew.avatar}`
                                : crew.avatar
                              : "https://i.pravatar.cc/150"
                          }
                          alt="avatar"
                          style={avatarStyle}
                        />
                        <div>
                          <div style={{ fontWeight: "600" }}>{crew.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{crew.crewId || crew._id}</td>
                    <td>{crew.role}</td>
                    <td><span style={getStatusStyle(crew.status)}>{crew.status}</span></td>
                    <td>{crew.createdBy || "-"}</td>
                    <td>{crew.updatedBy || "-"}</td>
                    <td>
                      {userRole === "Admin" ? (
                        <>
                          <FiEdit
                            style={{ cursor: "pointer", marginRight: "12px", color: "#333" }}
                            onClick={() => openModal(crew)}
                          />
                          <FiTrash2
                            style={{ cursor: "pointer", color: "#dc3545" }}
                            onClick={() => handleDelete(crew._id)}
                          />
                        </>
                      ) : (
                        <>
                          <FiEdit
                            style={{
                              marginRight: "12px",
                              color: "#bbb",
                              cursor: "not-allowed",
                              opacity: 0.5
                            }}
                            title="No permission"
                            onClick={e => e.preventDefault()}
                          />
                          <FiTrash2
                            style={{
                              color: "#bbb",
                              cursor: "not-allowed",
                              opacity: 0.5
                            }}
                            title="No permission"
                            onClick={e => e.preventDefault()}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 8 }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}

      {/* Archived Crew Table */}
      {showArchived && (
        <div style={cardTable}>
          <h3>Archived Crew</h3>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>NAME</th>
                <th>ID</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>Archived By</th>
                <th>Archived At</th>
              </tr>
            </thead>
            <tbody>
              {archivedCrew.map((crew) => (
                <tr key={crew._id}>
                  <td>{crew.name}</td>
                  <td>{crew.crewId}</td>
                  <td>{crew.role}</td>
                  <td>{crew.status}</td>
                  <td>{crew.updatedBy || "-"}</td>
                  <td>{new Date(crew.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowArchived(false)} style={cancelBtn}>Back to Active Crew</button>
          <button onClick={handleClearArchived} style={cancelBtn}>Clear All Archived Crew</button>
        </div>
      )}

      {showModal && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: "1rem" }}>{editMode ? "Edit Crew" : "Add New Crew"}</h3>
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
                type="file"
                accept="image/*"
                style={inputField}
                onChange={e => setForm({ ...form, avatar: e.target.files[0] })}
              />
              {editMode && form.avatar && typeof form.avatar === "string" && (
                <img
                  src={
                    form.avatar.startsWith("/uploads")
                      ? `http://localhost:5000${form.avatar}`
                      : form.avatar
                  }
                  alt="Current"
                  style={{ width: 60, height: 60, borderRadius: 8, marginBottom: 10 }}
                />
              )}
              <select name="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputField}>
                <option>Driver</option>
                <option>Conductor</option>
              </select>
              <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputField}>
                <option>Available</option>
                <option>Resting</option>
                <option>On Duty</option>
              </select>
              {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
                <button type="submit" style={saveBtn}>{editMode ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

// --- Styles (same as before) ---
const addBtn = {
  padding: "10px 16px",
  borderRadius: "8px",
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

const exportBtn = {
  padding: "10px 16px",
  borderRadius: "8px",
  background: "#22c55e", // green
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

const archiveBtn = {
  padding: "10px 16px",
  borderRadius: "8px",
  background: "#f59e42", // orange
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