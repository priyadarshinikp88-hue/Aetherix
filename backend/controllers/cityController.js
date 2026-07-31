import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const searchCities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }
    console.log(process.env.e50888965e64e26c26f2f75a8f40f82e);
    const response = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: q,
          limit: 25,
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