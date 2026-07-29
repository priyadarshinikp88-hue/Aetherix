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
      "http://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: q,
          limit: 8,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    const cities = response.data.map((city) => ({
      name: city.name,
      state: city.state || "",
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));

    res.json(cities);

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Unable to fetch cities",
    });
  }
};