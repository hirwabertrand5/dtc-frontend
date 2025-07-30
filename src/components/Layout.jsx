import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content block */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* ✅ Topbar at the top */}
        <Topbar />

        {/* ✅ Page content inside padding */}
        <main style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#f5f6fa"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
