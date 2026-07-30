import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">

      <h1>📊 AI Weather Dashboard</h1>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h2>🌡 Temperature</h2>
          <p>-- °C</p>
        </div>

        <div className="dashboard-card">
          <h2>💧 Humidity</h2>
          <p>-- %</p>
        </div>

        <div className="dashboard-card">
          <h2>🌬 Wind Speed</h2>
          <p>-- m/s</p>
        </div>

        <div className="dashboard-card">
          <h2>📈 Weather Trend</h2>
          <p>Graph Coming Soon</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;