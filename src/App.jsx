import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Home from "./home";
import ForgotPassword from "./forgotpassword";
import Forecast from "./components/forecast";
import Dashboard from "./components/dashboard";
import Alerts from "./components/alerts";
import WeatherMap from "./components/WeatherMap";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forecast" element={<Forecast />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/alerts" element={<Alerts />} />
<Route path="/map" element={<WeatherMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;