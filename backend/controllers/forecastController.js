import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOMORROW_API_URL =
  "https://api.tomorrow.io/v4/weather/forecast";

export const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    if (!process.env.TOMORROW_API_KEY) {
      return res.status(500).json({
        message: "Tomorrow.io API key is not configured",
      });
    }

    const response = await axios.get(
      TOMORROW_API_URL,
      {
        params: {
          location: `${lat},${lon}`,
          apikey: process.env.TOMORROW_API_KEY,
          units: "metric",
          timesteps: "1h,1d",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "TOMORROW FORECAST ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        error.response?.data?.message ||
        "Unable to fetch forecast from Tomorrow.io",
    });
  }
};