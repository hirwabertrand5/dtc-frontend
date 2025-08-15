import React, { useState } from "react";
import Layout from "../components/Layout";
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Geocode using OpenStreetMap Nominatim
const geocode = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
};

// Get route from ORS via backend proxy
const getRouteFromORS = async (start, end) => {
  const res = await fetch("/api/routes/ors-directions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start, end })
  });
  if (!res.ok) return null;
  return await res.json();
};

const RoutePlanner = () => {
  const navigate = useNavigate();

  const [routeName, setRouteName] = useState("");
  const [stops, setStops] = useState([]);
  const [stopInput, setStopInput] = useState("");
  const [distance, setDistance] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);

  const handleAddStop = () => {
    if (stopInput.trim()) {
      setStops([...stops, stopInput.trim()]);
      setStopInput("");
    }
  };

  const handleDrawRoute = async () => {
    if (!startInput || !endInput) {
      toast.error("Enter both start and destination.");
      return;
    }
    const startCoord = await geocode(startInput);
    const endCoord = await geocode(endInput);
    if (!startCoord || !endCoord) {
      toast.error("Could not find one or both locations.");
      return;
    }
    setStart(startCoord);
    setEnd(endCoord);

    const data = await getRouteFromORS(startCoord, endCoord);
    if (!data || !data.features || !data.features[0]) {
      toast.error("Failed to get route from OpenRouteService.");
      return;
    }
    setRouteGeoJson(data);

    try {
      const summary = data.features[0].properties.summary;
      setDistance((summary.distance / 1000).toFixed(2)); // km
      setEstimatedTime(Math.floor(summary.duration / 60) + " min");
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    setRouteName("");
    setStops([]);
    setStopInput("");
    setDistance("");
    setEstimatedTime("");
    setStartInput("");
    setEndInput("");
    setStart(null);
    setEnd(null);
    setRouteGeoJson(null);
  };

  const handleSaveRoute = async () => {
    if (!routeName || !start || !end || stops.length < 2 || !distance || !estimatedTime || !routeGeoJson) {
      toast.error("Fill all fields, draw route, and add at least 2 stops.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/routes", {
        routeName,
        estimatedTime,
        distance: Number(distance),
        stops,
        geoJson: routeGeoJson.features[0].geometry // LineString [lng, lat] pairs
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Route saved!");
      handleClear();
      navigate("/view-routes");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save route");
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
        {/* Map Area */}
        <div style={{ flex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Route Planner</h2>
            <button onClick={() => navigate("/view-routes")} style={navBtn}>View All Routes</button>
          </div>
          <div style={{ position: "relative", height: 400, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {start && <Marker position={[start.lat, start.lng]} />}
              {end && <Marker position={[end.lat, end.lng]} />}
              {routeGeoJson && <GeoJSON data={routeGeoJson} style={{ color: "#2563eb", weight: 5 }} />}
            </MapContainer>
            <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", padding: 8, borderRadius: 8, fontWeight: 600 }}>
              Enter start and destination, then click "Draw Route"
            </div>
          </div>
        </div>

        {/* Route Details Form */}
        <div style={{
          flex: 1, background: "#fafbfc", borderRadius: 12, padding: 24, minWidth: 320,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
        }}>
          <h3>Route Details</h3>
          <input
            placeholder="Route Name"
            value={routeName}
            onChange={e => setRouteName(e.target.value)}
            style={inputField}
          />
          <input
            placeholder="Start Location"
            value={startInput}
            onChange={e => setStartInput(e.target.value)}
            style={inputField}
          />
          <input
            placeholder="Destination"
            value={endInput}
            onChange={e => setEndInput(e.target.value)}
            style={inputField}
          />
          <button onClick={handleDrawRoute} style={addBtn}>Draw Route</button>
          <input
            placeholder="Estimated Time (auto)"
            value={estimatedTime}
            readOnly
            style={inputField}
          />
          <input
            placeholder="Distance (km, auto)"
            value={distance}
            readOnly
            style={inputField}
          />
          <div style={{ margin: "12px 0" }}>
            <strong>Stops</strong>
            <div>
              {stops.map((stop, idx) => (
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
            <button onClick={handleClear} style={cancelBtn}>Clear</button>
            <button onClick={handleSaveRoute} style={saveBtn}>Save Route</button>
          </div>
        </div>
      </div>
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

const navBtn = {
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer"
};

export default RoutePlanner;