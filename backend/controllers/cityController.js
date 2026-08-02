import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const searchCities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q,
          limit: 1000,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    const uniqueCities = [];

    response.data.forEach((city) => {

      const exists = uniqueCities.find(
        (c) =>
          c.name === city.name &&
          c.state === (city.state || "") &&
          c.country === city.country
      );

      if (!exists) {
        uniqueCities.push({
          value: `${city.lat},${city.lon}`,
          label: `${city.name}${city.state ? ", " + city.state : ""}, ${city.country}`,
          name: city.name,
          state: city.state || "",
          country: city.country,
          lat: city.lat,
          lon: city.lon,
        });
      }

    });

    res.json(uniqueCities);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Unable to fetch cities",
    });
  }
};