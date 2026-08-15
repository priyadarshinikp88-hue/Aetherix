import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOMORROW_TIMELINE_URL =
  "https://api.tomorrow.io/v4/timelines";

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

    const response = await axios.post(
      TOMORROW_TIMELINE_URL,
      {
        location: `${lat},${lon}`,

        fields: [
          "temperature",
          "humidity",
          "windSpeed",
          "precipitationProbability",
          "weatherCodeFullDay",
        ],

        units: "metric",

        timesteps: ["1d"],

        startTime: "now",

        endTime: "nowPlus15d",

        timezone: "auto",
      },
      {
        params: {
          apikey: process.env.TOMORROW_API_KEY,
        },

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const timeline =
      response.data?.data?.timelines?.find(
        (item) => item.timestep === "1d"
      );

    const intervals =
      timeline?.intervals || [];

    const daily = intervals
      .slice(0, 15)
      .map((item) => ({
        time: item.startTime,

        values: {
          temperatureAvg:
            item.values?.temperatureAvg ??
            item.values?.temperature ??
            null,

          temperatureMin:
            item.values?.temperatureMin ??
            null,

          temperatureMax:
            item.values?.temperatureMax ??
            null,

          humidityAvg:
            item.values?.humidityAvg ??
            item.values?.humidity ??
            null,

          windSpeedAvg:
            item.values?.windSpeedAvg ??
            item.values?.windSpeed ??
            null,

          precipitationProbabilityAvg:
            item.values
              ?.precipitationProbabilityAvg ??
            item.values
              ?.precipitationProbability ??
            0,

          weatherCodeFullDay:
            item.values?.weatherCodeFullDay ??
            item.values?.weatherCode ??
            1000,
        },
      }));

    res.json({
      data: {
        timelines: {
          daily,
        },
      },

      location: {
        lat: Number(lat),
        lon: Number(lon),
      },

      days: daily.length,
    });
  } catch (error) {
    console.error(
      "TOMORROW 15-DAY FORECAST ERROR:",
      error.response?.data ||
        error.message
    );

    res.status(
      error.response?.status || 500
    ).json({
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to fetch 15-day forecast",
    });
  }
};