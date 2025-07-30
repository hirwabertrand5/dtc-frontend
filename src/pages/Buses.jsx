import Layout from "../components/Layout";

const busData = [
  {
    id: "1",
    number: "DTC-101",
    capacity: 50,
    type: "Standard",
    status: "Active",
    crew: "Crew A",
    route: "Route 101"
  },
  {
    id: "2",
    number: "DTC-102",
    capacity: 40,
    type: "Mini",
    status: "Maintenance",
    crew: "-",
    route: "-"
  },
  {
    id: "3",
    number: "DTC-103",
    capacity: 60,
    type: "AC",
    status: "Idle",
    crew: "Crew B",
    route: "Route 205"
  }
];

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

const Buses = () => {
  return (
    <Layout>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "1rem" }}>
          Bus Management
        </h2>

        <button style={buttonStyle}>Add New Bus</button>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th>BUS NUMBER</th>
              <th>CAPACITY</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>ASSIGNED CREW</th>
              <th>ASSIGNED ROUTE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {busData.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.number}</td>
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
                <td>{bus.crew}</td>
                <td>{bus.route}</td>
                <td>
                  <button style={actionBtn}>Edit</button>
                  <button style={{ ...actionBtn, background: "#0d6efd" }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

const tableStyle = {
  width: "100%",
  backgroundColor: "#fff",
  borderCollapse: "collapse",
  borderRadius: "8px",
  overflow: "hidden",
  marginTop: "20px"
};

const buttonStyle = {
  background: "#0d6efd",
  color: "#fff",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  border: "none",
  borderRadius: "8px",
  marginBottom: "10px",
  cursor: "pointer"
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
