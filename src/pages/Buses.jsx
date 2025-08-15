import Layout from "../components/Layout";
import { useState, useEffect } from "react";
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

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "#20c997";
    case "Maintenance":
      return "#fd7e14";
    case "Idle":
      return "#ced4da";
    case "Out of Service":
      return "#dc3545";
    default:
      return "#adb5bd";
  }
};

// Helpers to safely read crew fields that might vary by API
const getCrewName = (c) =>
  c?.name ||
  c?.fullName ||
  (c?.firstName && c?.lastName ? `${c.firstName} ${c.lastName}` : c?.firstName || c?.lastName) ||
  c?.email ||
  c?.username ||
  c?._id ||
  "";

const getCrewRole = (c) => c?.role || c?.position || "";
const getCrewStatus = (c) => c?.status || c?.availability || "";

const Buses = () => {
  const [busData, setBusData] = useState([]);
  const [archivedBuses, setArchivedBuses] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    busNumber: "",
    capacity: "",
    type: "Standard",
    status: "Idle",
    assignedCrew: "",
    assignedRoute: ""
  });
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // New: options for selects
  const [crewOptions, setCrewOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [showOnlyAvailableCrew, setShowOnlyAvailableCrew] = useState(true);

  useEffect(() => {
    if (!showArchived) fetchBuses();
    // eslint-disable-next-line
  }, [page, showArchived]);

  useEffect(() => {
    // Load crew and route options on mount
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const auth = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

      // Try crew with a generous limit; fallback to base endpoint shape
      let crewRes = await axios.get(`/api/crew?limit=1000`, auth).catch(() => null);
      if (!crewRes) crewRes = await axios.get(`/api/crew`, auth);

      // Routes (your /api/routes already excludes archived and supports pagination)
      const routesRes = await axios.get(`/api/routes?page=1&limit=1000`, auth);

      const crewRaw = crewRes?.data?.data ?? crewRes?.data?.crew ?? crewRes?.data ?? [];
      const routesRaw = routesRes?.data?.data ?? routesRes?.data ?? [];

      setCrewOptions(Array.isArray(crewRaw) ? crewRaw : []);
      setRouteOptions(Array.isArray(routesRaw) ? routesRaw : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load crew/routes options");
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/buses?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBusData(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch buses");
    }
  };

  const fetchArchivedBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/buses/archived", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArchivedBuses(res.data);
      setShowArchived(true);
    } catch (err) {
      toast.error("Failed to fetch archived buses");
    }
  };

  // Open modal for add or edit
  const openModal = (bus = null) => {
    setError("");
    if (bus) {
      setEditMode(true);
      setEditId(bus._id);
      setForm({
        busNumber: bus.busNumber,
        capacity: bus.capacity,
        type: bus.type,
        status: bus.status,
        assignedCrew: bus.assignedCrew || "",
        assignedRoute: bus.assignedRoute || ""
      });
    } else {
      setEditMode(false);
      setEditId(null);
      setForm({
        busNumber: "",
        capacity: "",
        type: "Standard",
        status: "Idle",
        assignedCrew: "",
        assignedRoute: ""
      });
    }
    setShowModal(true);
  };

  // Add or update bus
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (editMode) {
        await axios.put(`/api/buses/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Bus updated!");
      } else {
        await axios.post("/api/buses", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Bus added!");
      }
      setShowModal(false);
      setForm({
        busNumber: "",
        capacity: "",
        type: "Standard",
        status: "Idle",
        assignedCrew: "",
        assignedRoute: ""
      });
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save bus");
      toast.error(err.response?.data?.error || "Failed to save bus");
    }
  };

  // Soft delete (archive)
  const handleArchive = async (id) => {
    if (!window.confirm("Archive this bus?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/buses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Bus archived!");
      fetchBuses();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to archive bus");
    }
  };

  // Export to CSV
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/buses/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "buses_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Exported CSV!");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  // Clear all archived buses
  const handleClearArchived = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all archived buses? This cannot be undone!")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/buses/archived/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("All archived buses deleted!");
      setShowArchived(false);
      fetchBuses();
    } catch (err) {
      toast.error("Failed to clear archived buses");
    }
  };

  // Filtered crew list for the select
  const crewListForSelect = (showOnlyAvailableCrew
    ? crewOptions.filter(c => (getCrewStatus(c) || "").toLowerCase().startsWith("avail"))
    : crewOptions
  );

  // Is the current assignedRoute/assignedCrew present in the options?
  const assignedRouteInOptions = form.assignedRoute && routeOptions.some(r => r.routeName === form.assignedRoute);
  const assignedCrewInOptions = form.assignedCrew && crewOptions.some(c => getCrewName(c) === form.assignedCrew);

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ fontWeight: 600 }}>Bus Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {userRole === "Admin" && (
            <>
              <button onClick={() => openModal()} style={addBtn}>+ Add New Bus</button>
              <button onClick={handleExport} style={exportBtn}>Export CSV</button>
              <button onClick={fetchArchivedBuses} style={archiveBtn}>View Archived Buses</button>
            </>
          )}
        </div>
      </div>

      {userRole !== "Admin" && (
        <div style={{ color: "#888", marginBottom: 10 }}>
          You have view-only access to bus data.
        </div>
      )}

      {!showArchived && (
        <>
          <div style={cardTable}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>BUS NUMBER</th>
                  <th>CAPACITY</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>ASSIGNED CREW</th>
                  <th>ASSIGNED ROUTE</th>
                  <th>Created By</th>
                  <th>Updated By</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {busData.map((bus) => (
                  <tr key={bus._id}>
                    <td>{bus.busNumber}</td>
                    <td>{bus.capacity}</td>
                    <td>{bus.type}</td>
                    <td>
                      <span style={{
                        backgroundColor: getStatusColor(bus.status),
                        padding: "4px 10px",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        {bus.status}
                      </span>
                    </td>
                    <td>{bus.assignedCrew}</td>
                    <td>{bus.assignedRoute}</td>
                    <td>{bus.createdBy || "-"}</td>
                    <td>{bus.updatedBy || "-"}</td>
                    <td>
                      {userRole === "Admin" ? (
                        <>
                          <button style={actionBtn} onClick={() => openModal(bus)}>Edit</button>
                          <button style={{ ...actionBtn, background: "#dc3545" }} onClick={() => handleArchive(bus._id)}>Archive</button>
                        </>
                      ) : (
                        <>
                          <button style={{ ...actionBtn, background: "#bbb", cursor: "not-allowed" }} disabled>Edit</button>
                          <button style={{ ...actionBtn, background: "#bbb", cursor: "not-allowed" }} disabled>Archive</button>
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

      {/* Archived Buses Table */}
      {showArchived && (
        <div style={cardTable}>
          <h3>Archived Buses</h3>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>BUS NUMBER</th>
                <th>CAPACITY</th>
                <th>TYPE</th>
                <th>STATUS</th>
                <th>ASSIGNED CREW</th>
                <th>ASSIGNED ROUTE</th>
                <th>Archived By</th>
                <th>Archived At</th>
              </tr>
            </thead>
            <tbody>
              {archivedBuses.map((bus) => (
                <tr key={bus._id}>
                  <td>{bus.busNumber}</td>
                  <td>{bus.capacity}</td>
                  <td>{bus.type}</td>
                  <td>{bus.status}</td>
                  <td>{bus.assignedCrew}</td>
                  <td>{bus.assignedRoute}</td>
                  <td>{bus.updatedBy || "-"}</td>
                  <td>{new Date(bus.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowArchived(false)} style={cancelBtn}>Back to Active Buses</button>
          <button onClick={handleClearArchived} style={archiveBtn}>Clear All Archived Buses</button>
        </div>
      )}

      {showModal && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: "1rem" }}>{editMode ? "Edit Bus" : "Add New Bus"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="busNumber"
                placeholder="Bus Number"
                value={form.busNumber}
                required
                style={inputField}
                onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
                disabled={editMode}
              />
              <input
                name="capacity"
                type="number"
                placeholder="Capacity"
                value={form.capacity}
                required
                style={inputField}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              <select
                name="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={inputField}
              >
                <option>Standard</option>
                <option>Mini</option>
                <option>AC</option>
              </select>
              <select
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={inputField}
              >
                <option>Active</option>
                <option>Idle</option>
                <option>Maintenance</option>
                <option>Out of Service</option>
              </select>

              {/* Assigned Crew (Select from DB) */}
              <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={showOnlyAvailableCrew}
                    onChange={(e) => setShowOnlyAvailableCrew(e.target.checked)}
                    style={{ marginRight: 6 }}
                  />
                  Only show available crew
                </label>
                <button type="button" onClick={loadOptions} style={smallBtn}>Reload</button>
              </div>
              <select
                name="assignedCrew"
                value={form.assignedCrew}
                onChange={(e) => setForm({ ...form, assignedCrew: e.target.value })}
                style={inputField}
                disabled={loadingOptions}
                required={false}
              >
                <option value="">{loadingOptions ? "Loading crew..." : "Select Crew (optional)"}</option>
                {/* If current value not in options (legacy/manual), show it so it displays */}
                {!assignedCrewInOptions && form.assignedCrew && (
                  <option value={form.assignedCrew}>{form.assignedCrew} (not in list)</option>
                )}
                {crewListForSelect.map((c) => {
                  const name = getCrewName(c);
                  const role = getCrewRole(c);
                  const status = getCrewStatus(c);
                  return (
                    <option key={c._id || name} value={name}>
                      {name}{role ? ` - ${role}` : ""}{status ? ` [${status}]` : ""}
                    </option>
                  );
                })}
              </select>

              {/* Assigned Route (Select from DB) */}
              <select
                name="assignedRoute"
                value={form.assignedRoute}
                onChange={(e) => setForm({ ...form, assignedRoute: e.target.value })}
                style={inputField}
                disabled={loadingOptions}
                required={false}
              >
                <option value="">{loadingOptions ? "Loading routes..." : "Select Route (optional)"}</option>
                {/* If current value not in options (legacy/manual), show it so it displays */}
                {!assignedRouteInOptions && form.assignedRoute && (
                  <option value={form.assignedRoute}>{form.assignedRoute} (not in list)</option>
                )}
                {routeOptions.map((r) => (
                  <option key={r._id} value={r.routeName}>
                    {r.routeName}{r.routeNumber ? ` (${r.routeNumber})` : ""}
                  </option>
                ))}
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
  background: "#22c55e",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

const archiveBtn = {
  padding: "10px 16px",
  borderRadius: "8px",
  background: "#f59e42",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

const smallBtn = {
  padding: "6px 10px",
  borderRadius: "6px",
  background: "#111827",
  color: "#fff",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 12
};

const cardTable = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)"
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
  width: "420px",
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

const actionBtn = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "500",
  fontSize: "13px",
  cursor: "pointer",
  marginRight: "6px",
  background: "#6c757d",
  color: "#fff"
};

export default Buses;