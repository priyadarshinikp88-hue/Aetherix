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
// 2. SUNRISE / SUNSET
//    Use 1d timeline
// ===================================================

let sunrise = null;
let sunset = null;

try {
  const sunResponse = await axios.post(
    TOMORROW_TIMELINE_URL,
    {
      location,

      fields: [
        "sunriseTime",
        "sunsetTime",
      ],

      units: "metric",

      timesteps: [
        "1d",
      ],

      startTime: "now",

      endTime: "nowPlus1d",

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

  console.log(
    "🌅 SUN TIMELINE RESPONSE:",
    JSON.stringify(
      sunResponse.data,
      null,
      2
    )
  );

  const sunTimeline =
    sunResponse.data?.data?.timelines?.find(
      (item) =>
        item.timestep === "1d"
    );

  const sunInterval =
    sunTimeline?.intervals?.[0];

  const sunValues =
    sunInterval?.values || {};

  sunrise =
    sunValues.sunriseTime ??
    null;

  sunset =
    sunValues.sunsetTime ??
    null;

} catch (error) {

  console.error(
    "❌ SUNRISE/SUNSET ERROR:",
    error.response?.data ||
      error.message
  );
}


// ===================================================
// 3. AIR QUALITY
//    Use 1h timeline
// ===================================================

let airQualityIndex = null;
let airQualityLevel = null;
let airQualityPrimaryPollutant = null;

let pm25 = null;
let pm10 = null;
let ozone = null;
let nitrogenDioxide = null;
let carbonMonoxide = null;
let sulfurDioxide = null;

try {
  const airResponse = await axios.post(
    TOMORROW_TIMELINE_URL,
    {
      location,

      fields: [
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

      endTime: "nowPlus1h",

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

  console.log(
    "🌫️ AIR QUALITY RESPONSE:",
    JSON.stringify(
      airResponse.data,
      null,
      2
    )
  );

  const airTimeline =
    airResponse.data?.data?.timelines?.find(
      (item) =>
        item.timestep === "1h"
    );

  const airInterval =
    airTimeline?.intervals?.[0];

  const airValues =
    airInterval?.values || {};

  airQualityIndex =
    airValues.epaIndex ??
    null;

  airQualityLevel =
    airValues.epaHealthConcern ??
    null;

  airQualityPrimaryPollutant =
    airValues.epaPrimaryPollutant ??
    null;

  pm25 =
    airValues.particulateMatter25 ??
    null;

  pm10 =
    airValues.particulateMatter10 ??
    null;

  ozone =
    airValues.pollutantO3 ??
    null;

  nitrogenDioxide =
    airValues.pollutantNO2 ??
    null;

  carbonMonoxide =
    airValues.pollutantCO ??
    null;

  sulfurDioxide =
    airValues.pollutantSO2 ??
    null;

} catch (error) {

  console.error(
    "❌ AIR QUALITY ERROR:",
    error.response?.data ||
      error.message
  );
}

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

pm25,

pm10,

ozone,

nitrogen_dioxide:
  nitrogenDioxide,

carbon_monoxide:
  carbonMonoxide,

sulfur_dioxide:
  sulfurDioxide,
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