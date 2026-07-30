import "./alerts.css";

function Alerts() {
  return (
    <div className="alerts-page">

      <h1>🚨 Weather Alerts</h1>

      <div className="alert-card safe">
        ✅ No Severe Weather Alerts
      </div>

      <div className="alert-card">
        ☔ Heavy Rain Alerts
      </div>

      <div className="alert-card">
        🌩 Thunderstorm Alerts
      </div>

      <div className="alert-card">
        🌪 High Wind Warnings
      </div>

    </div>
  );
}

export default Alerts;