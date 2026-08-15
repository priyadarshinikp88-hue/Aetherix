import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOMORROW_FORECAST_URL =
  "https://api.tomorrow.io/v4/weather/forecast";

export const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // ============================================
    // VALIDATE LOCATION
    // ============================================

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    // ============================================
    // API KEY
    // ============================================

    const apiKey =
      process.env.TOMORROW_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message:
          "Tomorrow.io API key is not configured",
      });
    }

    console.log(
      "======================================"
    );

    console.log(
      "TOMORROW 5-DAY FORECAST REQUEST"
    );

    console.log(
      "LOCATION:",
      lat,
      lon
    );

    // ============================================
    // TOMORROW.IO FORECAST API
    // ============================================

    const response = await axios.get(
      TOMORROW_FORECAST_URL,
      {
        params: {
          location: `${lat},${lon}`,
          timesteps: "1d",
          units: "metric",
          apikey: apiKey,
        },

        headers: {
          Accept: "application/json",
        },

        timeout: 15000,
      }
    );

    // ============================================
    // RAW TOMORROW RESPONSE
    // ============================================

    const tomorrowData =
      response.data;

    console.log(
      "TOMORROW FORECAST STATUS:",
      response.status
    );

    console.log(
      "TOMORROW FORECAST RECEIVED"
    );

    // ============================================
    // DAILY DATA
    // ============================================

    const daily =
      tomorrowData?.timelines?.daily || [];

    console.log(
      "FORECAST DAYS:",
      daily.length
    );

    // ============================================
    // FORMAT DATA FOR AETHERIX
    // ============================================

    const formattedDaily =
      daily
        .slice(0, 5)
        .map((item) => {
          const values =
            item?.values || {};

          const weatherCode =
            values.weatherCodeFullDay ??
            values.weatherCodeMax ??
            values.weatherCodeMin ??
            1000;

          return {
            time:
              item.time,

            values: {
              temperatureAvg:
                values.temperatureAvg ??
                null,

              temperatureMin:
                values.temperatureMin ??
                null,

              temperatureMax:
                values.temperatureMax ??
                null,

              humidityAvg:
                values.humidityAvg ??
                null,

              windSpeedAvg:
                values.windSpeedAvg ??
                null,

              windDirectionAvg:
                values.windDirectionAvg ??
                null,

              precipitationProbabilityAvg:
                values.precipitationProbabilityAvg ??
                0,

              weatherCodeFullDay:
                weatherCode,

              condition:
                getWeatherCondition(
                  weatherCode
                ),

              sunriseTime:
                values.sunriseTime ??
                null,

              sunsetTime:
                values.sunsetTime ??
                null,
            },
          };
        });

    // ============================================
    // SEND RESPONSE
    // ============================================

    return res.status(200).json({
      data: {
        timelines: {
          daily: formattedDaily,
        },
      },

      location: {
        lat: Number(lat),
        lon: Number(lon),
      },

      days:
        formattedDaily.length,
    });

  } catch (error) {

    // ============================================
    // IMPORTANT ERROR LOGGING
    // ============================================

    console.error(
      "======================================"
    );

    console.error(
      "TOMORROW FORECAST ERROR"
    );

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "DATA:",
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "======================================"
    );

    return res.status(
      error.response?.status || 500
    ).json({
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to fetch 5-day forecast",

      status:
        error.response?.status || 500,

      details:
        error.response?.data || null,
    });
  }
};


// ============================================
// WEATHER CONDITION
// ============================================

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