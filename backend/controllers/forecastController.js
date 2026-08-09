import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast/daily",
      {
        params: {
          lat,
          lon,
          cnt: 15,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "FORECAST ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        error.response?.data?.message ||
        "Unable to fetch 15-day forecast",
    });
  }
};