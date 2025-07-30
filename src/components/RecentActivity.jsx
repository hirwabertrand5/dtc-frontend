const RecentActivity = () => {
  const activity = [
    { id: 1, text: "Route #R123 updated by Planner Jane", time: "2 hours ago" },
    { id: 2, text: "Duty #D456 assigned to Driver Mike", time: "4 hours ago" },
    { id: 3, text: "Bus #B789 maintenance scheduled", time: "1 day ago" }
  ];

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {activity.map((item) => (
        <li key={item.id} style={{
          padding: '12px 0',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#c2d4ff",
            marginRight: "16px"
          }} />

          <div>
            <p style={{ margin: 0, fontSize: 14 }}>{item.text}</p>
            <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivity;
