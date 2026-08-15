import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOMORROW_API_URL =
  "https://api.tomorrow.io/v4/weather/realtime";

const TOMORROW_API_KEY =
  process.env.TOMORROW_API_KEY;

// =======================================================
// CURRENT WEATHER
// =======================================================

export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    if (!TOMORROW_API_KEY) {
      return res.status(500).json({
        message: "Tomorrow.io API key is not configured",
      });
    }

    const response = await axios.get(
      TOMORROW_API_URL,
      {
        params: {
          location: `${lat},${lon}`,
          apikey: TOMORROW_API_KEY,
          units: "metric",
        },
      }
    );

    const values =
      response.data?.data?.values || {};

    const weatherCode =
      values.weatherCode ?? null;

    res.json({
      temperature: values.temperature ?? null,

      feels_like:
        values.temperatureApparent ?? null,

      humidity:
        values.humidity ?? null,

      pressure:
        values.pressureSurfaceLevel ?? null,

      wind_speed:
        values.windSpeed ?? null,

      wind_direction:
        values.windDirection ?? null,

      visibility:
        values.visibility ?? null,

      cloud_cover:
        values.cloudCover ?? null,

      precipitation_probability:
        values.precipitationProbability ?? null,

      precipitation_type:
        values.precipitationType ?? null,

      rain_intensity:
        values.rainIntensity ?? null,

      weather_code: weatherCode,

      condition:
        getWeatherCondition(weatherCode),

      sunrise:
        values.sunriseTime ?? null,

      sunset:
        values.sunsetTime ?? null,

      raw: response.data,
    });
  } catch (error) {
    console.error(
      "TOMORROW WEATHER ERROR:",
      error.response?.data ||
        error.message
    );

    res.status(
      error.response?.status || 500
    ).json({
      message:
        error.response?.data?.message ||
        "Unable to fetch weather",
    });
  }
};


// =======================================================
// WEATHER CONDITION
// =======================================================

function getWeatherCondition(code) {
  const conditions = {
    1000: "Clear",

    1001: "Cloudy",

    1100: "Mostly Clear",

    1101: "Partly Cloudy",

    1102: "Mostly Cloudy",

    2000: "Fog",

    2100: "Light Fog",

    4000: "Drizzle",

    4001: "Rain",

    4200: "Light Rain",

    4201: "Heavy Rain",

    5000: "Snow",

    5001: "Flurries",

    5100: "Light Snow",

    5101: "Heavy Snow",

    6000: "Freezing Drizzle",

    6001: "Freezing Rain",

    6200: "Light Freezing Rain",

    6201: "Heavy Freezing Rain",

    7000: "Ice Pellets",

    7101: "Heavy Ice Pellets",

    7102: "Light Ice Pellets",

    8000: "Thunderstorm",
  };

  return (
    conditions[code] ||
    "Unknown"
  );
}