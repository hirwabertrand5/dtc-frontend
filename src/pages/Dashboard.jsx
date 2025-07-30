import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import RecentActivity from "../components/RecentActivity";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    buses: 0,
    crew: 0,
    duties: 0,
    routes: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [busRes, crewRes, dutyRes, routeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/buses/count", { headers }),
          axios.get("http://localhost:5000/api/crew/count", { headers }),
          axios.get("http://localhost:5000/api/duties/count", { headers }),
          axios.get("http://localhost:5000/api/routes/count", { headers })
        ]);

        setStats({
          buses: busRes.data.total,
          crew: crewRes.data.total,
          duties: dutyRes.data.total,
          routes: routeRes.data.total
        });
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err.response?.data || err.message);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Layout>
      <div style={{ padding: "2rem" }}>
        <h2 style={{
          fontSize: "22px",
          fontWeight: 600,
          marginBottom: "2rem"
        }}>
          Dashboard Overview
        </h2>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "40px"
        }}>
          <StatCard title="Total Buses" value={stats.buses} percentage="+5%" color="green" />
          <StatCard title="Active Routes" value={stats.routes} percentage="0%" color="gray" />
          <StatCard title="Scheduled Duties" value={stats.duties} percentage="+10%" color="green" />
          <StatCard title="Available Crew" value={stats.crew} percentage="-2%" color="red" />
        </div>

        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h3 style={{ margin: 0 }}>Recent Activity</h3>
            <button style={{
              background: "#f5f5f5",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500
            }}>
              View All
            </button>
          </div>

          <RecentActivity />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
