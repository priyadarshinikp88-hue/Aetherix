import "../styles/WeatherAnimation.css";

function WeatherAnimation({ weather }) {
  const condition = weather?.weather?.[0]?.main || "Clouds";
  const description = weather?.weather?.[0]?.description?.toLowerCase() || "";

let rainDrops = 0;
let rainSpeed = 1;

if (description.includes("drizzle")) {
  rainDrops = 8;
  rainSpeed = 1.8;
}
else if (description.includes("light")) {
  rainDrops = 12;
  rainSpeed = 1.2;
}
else if (description.includes("moderate")) {
  rainDrops = 18;
  rainSpeed = 0.9;
}
else if (description.includes("heavy")) {
  rainDrops = 30;
  rainSpeed = 0.6;
}
else {
  rainDrops = 15;
  rainSpeed = 1;
}

  return (
    <div className="weather-animation">

      {/* ================= RAIN ================= */}

      {condition === "Rain" && (
        <div className="rain-scene">

          <div className="cloud">
            <div className="cloud-part one"></div>
            <div className="cloud-part two"></div>
            <div className="cloud-part three"></div>
            <div className="cloud-base"></div>
          </div>
    <div className="rain">
  {[...Array(rainDrops)].map((_, i) => (
    <span
      key={i}
       style={{
    left: `${Math.random()*100}%`,
    height: `${8 + Math.random()*8}px`,
    width: `${2 + Math.random()*2}px`,
    animationDelay: `${Math.random()}s`,
    animationDuration: `${0.6 + Math.random()*0.5}s`
}}
    />
  ))}
</div>
    <div className="rain-floor">
    {[...Array(8)].map((_,i)=>
        <span key={i}/>
    )}
</div>
        </div>
      )}

      {/* ================= CLOUDS ================= */}

      {condition === "Clouds" && (
        <div className="cloud-scene">

          <div className="floating-cloud cloud1"></div>

          <div className="floating-cloud cloud2"></div>

        </div>
      )}

      {/* ================= CLEAR ================= */}

      {condition === "Clear" && (
        <div className="sun-scene">

          <div className="sun"></div>

        </div>
      )}

    </div>
  );
}

export default WeatherAnimation;