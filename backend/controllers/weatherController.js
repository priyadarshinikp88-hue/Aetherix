import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);

    res.json(response.data);

  } catch (error) {

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message,
      });
    }

    res.status(500).json({
      message: "Unable to fetch weather",
    });
  }
};