import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    let { lat, lon, city } = req.query;

    if (city) {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
      );

      if (!geoResponse.data.length) {
        return res.status(404).json({
          message: "City not found",
        });
      }

      lat = geoResponse.data[0].lat;
      lon = geoResponse.data[0].lon;
    }

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const airResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    res.json({
      ...weatherResponse.data,
      air: airResponse.data.list[0],
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Unable to fetch weather",
    });
  }
};