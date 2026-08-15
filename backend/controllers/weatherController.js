import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "🔥 AETHERIX WEATHER CONTROLLER: TOMORROW.IO VERSION"
);

const TOMORROW_REALTIME_URL =
  "https://api.tomorrow.io/v4/weather/realtime";

const TOMORROW_TIMELINE_URL =
  "https://api.tomorrow.io/v4/timelines";

const TOMORROW_API_KEY =
  process.env.TOMORROW_API_KEY;


// =======================================================
// CURRENT WEATHER
// =======================================================

export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // ---------------------------------------------------
    // VALIDATE LOCATION
    // ---------------------------------------------------

    if (!lat || !lon) {
      return res.status(400).json({
        message:
          "Latitude and Longitude are required",
      });
    }

    // ---------------------------------------------------
    // VALIDATE API KEY
    // ---------------------------------------------------

    if (!TOMORROW_API_KEY) {
      return res.status(500).json({
        message:
          "Tomorrow.io API key is not configured",
      });
    }

    const location = `${lat},${lon}`;

    // ===================================================
    // 1. REALTIME WEATHER
    // ===================================================

    const weatherResponse =
      await axios.get(
        TOMORROW_REALTIME_URL,
        {
          params: {
            location,
            apikey:
              TOMORROW_API_KEY,
            units: "metric",
          },
        }
      );

    const weatherValues =
      weatherResponse.data?.data?.values ||
      {};

    const weatherCode =
      weatherValues.weatherCode ??
      null;


    // ===================================================
    // 2. TIMELINE FOR SUN + AQI
    // ===================================================

    let sunValues = {};
    let airValues = {};

    try {
      const timelineResponse =
        await axios.post(
          TOMORROW_TIMELINE_URL,
          {
            location,

            fields: [
              "sunriseTime",
              "sunsetTime",

              "epaIndex",
              "epaHealthConcern",
              "epaPrimaryPollutant",

              "particulateMatter25",
              "particulateMatter10",
              "pollutantO3",
              "pollutantNO2",
              "pollutantCO",
              "pollutantSO2",
            ],

            units: "metric",

            timesteps: [
              "1h",
            ],

            startTime: "now",

            endTime:
              "nowPlus1h",

            timezone: "auto",
          },
          {
            params: {
              apikey:
                TOMORROW_API_KEY,
            },

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );


      const timelines =
        timelineResponse.data
          ?.data
          ?.timelines || [];


      /*
       * Find the first timeline.
       */

      const timeline =
        timelines[0];


      const interval =
        timeline?.intervals?.[0];


      const timelineValues =
        interval?.values || {};


      sunValues =
        timelineValues;

      airValues =
        timelineValues;


    } catch (timelineError) {

      console.error(
        "⚠️ TOMORROW SUN/AQI TIMELINE ERROR:",
        timelineError.response
          ?.data ||
          timelineError.message
      );

      /*
       * Don't fail the whole weather
       * request if the optional
       * Sun/AQI data isn't available.
       */
    }


    // ===================================================
    // SUNRISE / SUNSET
    // ===================================================

    const sunrise =
      sunValues.sunriseTime ??
      weatherValues.sunriseTime ??
      null;

    const sunset =
      sunValues.sunsetTime ??
      weatherValues.sunsetTime ??
      null;


    // ===================================================
    // AQI
    // ===================================================

    const airQualityIndex =
      airValues.epaIndex ??
      weatherValues.epaIndex ??
      null;

    const airQualityLevel =
      airValues.epaHealthConcern ??
      weatherValues.epaHealthConcern ??
      null;

    const airQualityPrimaryPollutant =
      airValues.epaPrimaryPollutant ??
      weatherValues.epaPrimaryPollutant ??
      null;


    // ===================================================
    // RESPONSE
    // ===================================================

    return res.json({

      // ================= CURRENT WEATHER =================

      temperature:
        weatherValues.temperature ??
        null,

      feels_like:
        weatherValues.temperatureApparent ??
        null,

      humidity:
        weatherValues.humidity ??
        null,

      pressure:
        weatherValues.pressureSurfaceLevel ??
        null,

      wind_speed:
        weatherValues.windSpeed ??
        null,

      wind_direction:
        weatherValues.windDirection ??
        null,

      visibility:
        weatherValues.visibility ??
        null,

      cloud_cover:
        weatherValues.cloudCover ??
        null,

      precipitation_probability:
        weatherValues.precipitationProbability ??
        null,

      precipitation_type:
        weatherValues.precipitationType ??
        null,

      rain_intensity:
        weatherValues.rainIntensity ??
        null,

      weather_code:
        weatherCode,

      condition:
        getWeatherCondition(
          weatherCode
        ),


      // ================= SUN =================

      sunrise,

      sunset,


      // ================= AIR QUALITY =================

      air_quality_index:
        airQualityIndex,

      air_quality_level:
        airQualityLevel,

      air_quality_primary_pollutant:
        airQualityPrimaryPollutant,


      // ================= POLLUTANTS =================

      pm25:
        airValues.particulateMatter25 ??
        weatherValues.particulateMatter25 ??
        null,

      pm10:
        airValues.particulateMatter10 ??
        weatherValues.particulateMatter10 ??
        null,

      ozone:
        airValues.pollutantO3 ??
        weatherValues.pollutantO3 ??
        null,

      nitrogen_dioxide:
        airValues.pollutantNO2 ??
        weatherValues.pollutantNO2 ??
        null,

      carbon_monoxide:
        airValues.pollutantCO ??
        weatherValues.pollutantCO ??
        null,

      sulfur_dioxide:
        airValues.pollutantSO2 ??
        weatherValues.pollutantSO2 ??
        null,


      // ================= LOCATION =================

      latitude:
        Number(lat),

      longitude:
        Number(lon),


      // ================= DEBUG =================

      raw:
        weatherResponse.data,
    });

  } catch (error) {

    console.error(
      "❌ TOMORROW WEATHER ERROR:",
      error.response?.data ||
        error.message
    );

    return res.status(
      error.response?.status ||
      500
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

    1000:
      "Clear",

    1001:
      "Cloudy",

    1100:
      "Mostly Clear",

    1101:
      "Partly Cloudy",

    1102:
      "Mostly Cloudy",

    2000:
      "Fog",

    2100:
      "Light Fog",

    4000:
      "Drizzle",

    4001:
      "Rain",

    4200:
      "Light Rain",

    4201:
      "Heavy Rain",

    5000:
      "Snow",

    5001:
      "Flurries",

    5100:
      "Light Snow",

    5101:
      "Heavy Snow",

    6000:
      "Freezing Drizzle",

    6001:
      "Freezing Rain",

    6200:
      "Light Freezing Rain",

    6201:
      "Heavy Freezing Rain",

    7000:
      "Ice Pellets",

    7101:
      "Heavy Ice Pellets",

    7102:
      "Light Ice Pellets",

    8000:
      "Thunderstorm",
  };

  return (
    conditions[code] ||
    "Unknown"
  );
}