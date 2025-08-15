import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

let userRole = "";
const token = localStorage.getItem("token");
if (token) {
  try {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  } catch {
    userRole = "";
  }
}

const ViewRoutes = () => {
  const navigate = useNavigate();

  const [routes, setRoutes] = useState([]);
  const [archivedRoutes, setArchivedRoutes] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [archivedTotalPages, setArchivedTotalPages] = useState(1);
  const [editRoute, setEditRoute] = useState(null);
  const [form, setForm] = useState({
    routeName: "",
    estimatedTime: "",
    distance: "",
    stops: [],
    geoJson: null
  });
  const [stopInput, setStopInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!showArchived) fetchRoutes();
    // eslint-disable-next-line
  }, [page, showArchived, search]);

  useEffect(() => {
    if (showArchived) fetchArchivedRoutes();
    // eslint-disable-next-line
  }, [archivedPage, showArchived, search]);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/routes?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoutes(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch routes");
    }
  };

  const fetchArchivedRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/routes/archived?page=${archivedPage}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArchivedRoutes(res.data.data || []);
      setArchivedTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch archived routes");
    }
  };

  // Open modal for edit
  const openEditModal = (route) => {
    setEditRoute(route);
    setForm({
      routeName: route.routeName,
      estimatedTime: route.estimatedTime,
      distance: route.distance,
      stops: route.stops,
      geoJson: route.geoJson
    });
    setShowModal(true);
  };

  const handleAddStop = () => {
    if (stopInput.trim()) {
      setForm({ ...form, stops: [...form.stops, stopInput.trim()] });
      setStopInput("");
    }
  };

  const handleEditSave = async () => {
    if (!form.routeName || !form.estimatedTime || !form.distance || form.stops.length < 2 || !form.geoJson) {
      toast.error("Fill all fields and add at least 2 stops.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/routes/${editRoute._id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Route updated!");
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update route");
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this route?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Route archived!");
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to archive route");
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/routes/restore/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Route restored!");
      fetchArchivedRoutes();
    } catch {
      toast.error("Failed to restore route");
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/routes/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routes_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Exported CSV!");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>All Routes</h2>
          <button onClick={() => navigate("/routes")} style={navBtn}>Create New Route</button>
        </div>

        <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
          <input
            placeholder="Search by name or number"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); setArchivedPage(1); }}
            style={inputField}
          />
          <button onClick={handleExport} style={exportBtn}>Export CSV</button>
          <button onClick={() => setShowArchived(!showArchived)} style={archiveBtn}>
            {showArchived ? "Back to Active Routes" : "View Archived Routes"}
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {(showArchived ? archivedRoutes : routes).map((route) => (
            <div key={route._id} style={{
              background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              padding: 18, width: 380, minHeight: 320, position: "relative"
            }}>
              <h3 style={{ margin: 0 }}>
                {route.routeName} <span style={{ color: "#888", fontSize: 14 }}>({route.routeNumber})</span>
              </h3>
              <div style={{ fontSize: 14, margin: "8px 0" }}>
                <b>Time:</b> {route.estimatedTime} &nbsp; <b>Distance:</b> {route.distance} km
              </div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <b>Stops:</b> {route.stops.join(" → ")}
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                <b>Created By:</b> {route.createdBy || "-"}<br />
                <b>Updated By:</b> {route.updatedBy || "-"}
              </div>
              <div style={{ height: 120, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                <MapContainer
                  center={
                    route.geoJson?.coordinates?.length > 0
                      ? [route.geoJson.coordinates[0][1], route.geoJson.coordinates[0][0]]
                      : [28.6139, 77.2090]
                  }
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                  dragging={false}
                  doubleClickZoom={false}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {route.geoJson && (
                    <GeoJSON data={{ type: "Feature", geometry: route.geoJson }} style={{ color: "#2563eb", weight: 4 }} />
                  )}
                </MapContainer>
              </div>
              {userRole === "Admin" && (
                <div style={{ display: "flex", gap: 8 }}>
                  {!showArchived && <button style={editBtn} onClick={() => openEditModal(route)}>Edit</button>}
                  {!showArchived && <button style={archiveBtn} onClick={() => handleArchive(route._id)}>Archive</button>}
                  {showArchived && <button style={restoreBtn} onClick={() => handleRestore(route._id)}>Restore</button>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8 }}>
          <button disabled={(showArchived ? archivedPage : page) === 1} onClick={() => showArchived ? setArchivedPage(archivedPage - 1) : setPage(page - 1)}>Prev</button>
          <span>Page {showArchived ? archivedPage : page} of {showArchived ? archivedTotalPages : totalPages}</span>
          <button disabled={(showArchived ? archivedPage : page) === (showArchived ? archivedTotalPages : totalPages)} onClick={() => showArchived ? setArchivedPage(archivedPage + 1) : setPage(page + 1)}>Next</button>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3>Edit Route</h3>
            <input
              placeholder="Route Name"
              value={form.routeName}
              onChange={e => setForm({ ...form, routeName: e.target.value })}
              style={inputField}
            />
            <input
              placeholder="Estimated Time"
              value={form.estimatedTime}
              onChange={e => setForm({ ...form, estimatedTime: e.target.value })}
              style={inputField}
            />
            <input
              placeholder="Distance (km)"
              value={form.distance}
              onChange={e => setForm({ ...form, distance: e.target.value })}
              style={inputField}
            />
            <div style={{ margin: "12px 0" }}>
              <strong>Stops</strong>
              <div>
                {form.stops.map((stop, idx) => (
                  <div key={idx} style={{ fontSize: 14, margin: "2px 0" }}>
                    Stop {idx + 1}: {stop}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  placeholder="Add Stop"
                  value={stopInput}
                  onChange={e => setStopInput(e.target.value)}
                  style={{ ...inputField, flex: 1, marginBottom: 0 }}
                />
                <button onClick={handleAddStop} style={addBtn}>Add Stop</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowModal(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleEditSave} style={saveBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const inputField = {
  padding: "10px",
  width: "100%",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const addBtn = {
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

const saveBtn = {
  backgroundColor: "#22c55e",
  padding: "10px 20px",
  color: "#fff",
  borderRadius: "8px",
  border: "none",
  fontWeight: 600
};

const cancelBtn = {
  backgroundColor: "#f59e42",
  padding: "10px 20px",
  color: "#fff",
  borderRadius: "8px",
  border: "none",
  fontWeight: 600
};

const editBtn = {
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

const archiveBtn = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

const restoreBtn = {
  backgroundColor: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
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

const exportBtn = {
  backgroundColor: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

const navBtn = {
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

export default ViewRoutes;