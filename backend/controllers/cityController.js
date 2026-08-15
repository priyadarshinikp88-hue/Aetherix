import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY;

const AUTOCOMPLETE_URL =
  "https://places.googleapis.com/v1/places:autocomplete";

const TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

const GEOCODE_URL =
  "https://maps.googleapis.com/maps/api/geocode/json";

const MAX_RESULTS = 8;

/* =======================================================
   HELPERS
======================================================= */

const headers = () => ({
  "Content-Type": "application/json",
  "X-Goog-Api-Key": GOOGLE_API_KEY,
});

/* =======================================================
   PLACE DETAILS
======================================================= */

const getPlaceDetails = async (
  placeId
) => {
  try {
    const response =
      await axios.get(
        `https://places.googleapis.com/v1/${placeId}`,
        {
          headers: {
            "X-Goog-Api-Key":
              GOOGLE_API_KEY,

            "X-Goog-FieldMask":
              "id,displayName,formattedAddress,location,addressComponents,addressDescriptor,types",
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "GOOGLE PLACE DETAILS ERROR:",
      error.response?.data ||
        error.message
    );

    return null;
  }
};

/* =======================================================
   FORMAT GOOGLE PLACE
======================================================= */

const formatPlace = (
  place
) => {
  if (
    !place ||
    !place.location
  ) {
    return null;
  }

  let state = "";
  let district = "";
  let country = "India";

  const components =
    place.addressComponents ||
    [];

  components.forEach(
    (component) => {
      const types =
        component.types || [];

      const name =
        component.longText || "";

      if (
        types.includes(
          "administrative_area_level_1"
        )
      ) {
        state = name;
      }

      if (
        types.includes(
          "administrative_area_level_2"
        )
      ) {
        district = name;
      }

      if (
        types.includes("country")
      ) {
        country = name;
      }
    }
  );

  const name =
    place.displayName?.text ||
    "";

  const address =
    place.formattedAddress ||
    "";

  return {
    value: `${place.location.latitude},${place.location.longitude}`,

    label:
      address ||
      name,

    name,

    state,

    district,

    country,

    lat:
      Number(
        place.location.latitude
      ),

    lon:
      Number(
        place.location.longitude
      ),

    placeId:
      place.id || "",

    formattedAddress:
      address,

    types:
      place.types || [],
  };
};

/* =======================================================
   TEXT SEARCH FALLBACK
======================================================= */

const textSearch = async (
  query
) => {
  try {
    const response =
      await axios.post(
        TEXT_SEARCH_URL,
        {
          textQuery:
            `${query}, India`,

          languageCode: "en",

          regionCode: "IN",

          maxResultCount: 10,
        },
        {
          headers: {
            ...headers(),

            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents,places.addressDescriptor,places.types",
          },
        }
      );

    return (
      response.data?.places ||
      []
    );
  } catch (error) {
    console.error(
      "GOOGLE TEXT SEARCH ERROR:",
      error.response?.data ||
        error.message
    );

    return [];
  }
};

/* =======================================================
   GEOCODING FALLBACK
======================================================= */

const geocodeSearch = async (
  query
) => {
  try {
    const response =
      await axios.get(
        GEOCODE_URL,
        {
          params: {
            address:
              `${query}, India`,

            key: GOOGLE_API_KEY,

            language: "en",

            region: "in",
          },
        }
      );

    if (
      response.data?.status !==
      "OK"
    ) {
      return [];
    }

    return (
      response.data.results ||
      []
    ).map(
      (item) => {
        const location =
          item.geometry?.location;

        if (!location) {
          return null;
        }

        let state = "";
        let district = "";
        let country = "India";

        (
          item.address_components ||
          []
        ).forEach(
          (component) => {
            const types =
              component.types ||
              [];

            if (
              types.includes(
                "administrative_area_level_1"
              )
            ) {
              state =
                component.long_name;
            }

            if (
              types.includes(
                "administrative_area_level_2"
              )
            ) {
              district =
                component.long_name;
            }

            if (
              types.includes(
                "country"
              )
            ) {
              country =
                component.long_name;
            }
          }
        );

        return {
          value: `${location.lat},${location.lng}`,

          label:
            item.formatted_address ||
            item.address_components?.[0]
              ?.long_name ||
            query,

          name:
            item.address_components?.[0]
              ?.long_name ||
            query,

          state,

          district,

          country,

          lat: Number(location.lat),

          lon: Number(location.lng),

          placeId:
            item.place_id || "",

          formattedAddress:
            item.formatted_address ||
            "",

          types:
            item.types || [],
        };
      }
    ).filter(Boolean);
  } catch (error) {
    console.error(
      "GOOGLE GEOCODING ERROR:",
      error.response?.data ||
        error.message
    );

    return [];
  }
};

/* =======================================================
   MAIN SEARCH
======================================================= */

export const searchCities =
  async (req, res) => {
    try {
     const query = String(
  req.query.q ||
  req.query.query ||
  ""
).trim();

      if (query.length < 2) {
        return res.json([]);
      }

      if (!GOOGLE_API_KEY) {
        return res.status(500).json({
          message:
            "GOOGLE_MAPS_API_KEY is not configured",
        });
      }

      let results = [];

      /* =================================================
         1. GOOGLE AUTOCOMPLETE
      ================================================= */

      try {
        const response =
          await axios.post(
            AUTOCOMPLETE_URL,
            {
              input: query,

              includedRegionCodes:
                ["in"],

              languageCode: "en",

              includeQueryPredictions:
                false,
            },
            {
              headers: {
                ...headers(),

                "X-Goog-FieldMask":
                  "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
              },
            }
          );

        const suggestions =
          response.data
            ?.suggestions ||
          [];

        /*
         * Get details for the
         * best autocomplete results.
         */

        for (
          const suggestion of suggestions.slice(
            0,
            6
          )
        ) {
          const prediction =
            suggestion.placePrediction;

          if (
            !prediction?.placeId
          ) {
            continue;
          }

          const place =
            await getPlaceDetails(
              prediction.placeId
            );

          const formatted =
            formatPlace(place);

          if (formatted) {
            results.push(
              formatted
            );
          }
        }
      } catch (error) {
        console.error(
          "GOOGLE AUTOCOMPLETE ERROR:",
          error.response?.data ||
            error.message
        );
      }

      /* =================================================
         2. TEXT SEARCH FALLBACK
      ================================================= */

      if (
        results.length <
        MAX_RESULTS
      ) {
        const places =
          await textSearch(
            query
          );

        places.forEach(
          (place) => {
            const formatted =
              formatPlace(place);

            if (
              formatted &&
              formatted.lat != null &&
              formatted.lon != null
            ) {
              results.push(
                formatted
              );
            }
          }
        );
      }

      /* =================================================
         3. GEOCODING FALLBACK
      ================================================= */

      if (
        results.length === 0
      ) {
        const geocoded =
          await geocodeSearch(
            query
          );

        results.push(
          ...geocoded
        );
      }

      /* =================================================
         4. REMOVE DUPLICATES
      ================================================= */

      const unique =
        results.filter(
          (item, index, array) => {
            return (
              index ===
              array.findIndex(
                (other) => {
                  if (
                    item.placeId &&
                    other.placeId
                  ) {
                    return (
                      item.placeId ===
                      other.placeId
                    );
                  }

                  return (
                    Math.abs(
                      item.lat -
                        other.lat
                    ) < 0.0001 &&
                    Math.abs(
                      item.lon -
                        other.lon
                    ) < 0.0001
                  );
                }
              )
            );
          }
        );

      /* =================================================
         5. RETURN BEST RESULTS
      ================================================= */

      return res.json(
        unique.slice(
          0,
          MAX_RESULTS
        )
      );
    } catch (error) {
      console.error(
        "CITY SEARCH ERROR:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        message:
          "Unable to search locations",
      });
    }
  };