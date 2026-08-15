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
    // 2. SUNRISE + SUNSET + AQI
    //
    // ONE TIMELINE REQUEST
    // ===================================================

    let sunrise = null;
    let sunset = null;

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

      const timelineResponse =
        await axios.post(
          TOMORROW_TIMELINE_URL,
          {
            location,

            fields: [
              // SUN
              "sunriseTime",
              "sunsetTime",

              // AQI
              "epaIndex",
              "epaHealthConcern",
              "epaPrimaryPollutant",

              // POLLUTANTS
              "particulateMatter25",
              "particulateMatter10",
              "pollutantO3",
              "pollutantNO2",
              "pollutantCO",
              "pollutantSO2",
            ],

            units: "metric",

            /*
             * One request can return
             * multiple timelines.
             */
            timesteps: [
              "1h",
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
        "🌤️ SUN + AQI TIMELINE RESPONSE:",
        JSON.stringify(
          timelineResponse.data,
          null,
          2
        )
      );


      const timelines =
        timelineResponse.data
          ?.data
          ?.timelines || [];


      // =================================================
      // FIND DAILY TIMELINE
      // =================================================

      const dailyTimeline =
        timelines.find(
          (item) =>
            item.timestep === "1d"
        );


      const dailyInterval =
        dailyTimeline?.intervals?.[0];


      const dailyValues =
        dailyInterval?.values || {};


      // =================================================
      // SUNRISE / SUNSET
      // =================================================

      sunrise =
        dailyValues.sunriseTime ??
        null;

      sunset =
        dailyValues.sunsetTime ??
        null;


      // =================================================
      // FIND HOURLY TIMELINE
      // =================================================

      const hourlyTimeline =
        timelines.find(
          (item) =>
            item.timestep === "1h"
        );


      const hourlyInterval =
        hourlyTimeline?.intervals?.[0];


      const hourlyValues =
        hourlyInterval?.values || {};


      // =================================================
      // AIR QUALITY
      // =================================================

      airQualityIndex =
        hourlyValues.epaIndex ??
        null;

      airQualityLevel =
        hourlyValues.epaHealthConcern ??
        null;

      airQualityPrimaryPollutant =
        hourlyValues.epaPrimaryPollutant ??
        null;


      // =================================================
      // POLLUTANTS
      // =================================================

      pm25 =
        hourlyValues.particulateMatter25 ??
        null;

      pm10 =
        hourlyValues.particulateMatter10 ??
        null;

      ozone =
        hourlyValues.pollutantO3 ??
        null;

      nitrogenDioxide =
        hourlyValues.pollutantNO2 ??
        null;

      carbonMonoxide =
        hourlyValues.pollutantCO ??
        null;

      sulfurDioxide =
        hourlyValues.pollutantSO2 ??
        null;


    } catch (timelineError) {

      console.error(
        "❌ SUN + AQI TIMELINE ERROR:",
        timelineError.response?.data ||
          timelineError.message
      );

      /*
       * Don't fail the complete weather
       * response if Timeline is unavailable.
       */
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