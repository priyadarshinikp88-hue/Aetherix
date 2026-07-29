import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);
    console.log("API Key Exists:", !!process.env.OPENWEATHER_API_KEY);

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    console.log("Calling OpenWeather API...");

    const response = await axios.get(url);

    res.json(response.data);

  } catch (error) {
    console.error("Weather Error:", error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({
      message: "Unable to fetch weather",
    });
  }
};