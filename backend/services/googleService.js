import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const searchLocation = async (query) => {
  try {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("Google Service Error:", error.message);
    throw error;
  }
};