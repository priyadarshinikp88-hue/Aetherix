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

const MAX_RESULTS = 15;

/* =======================================================
   GOOGLE HEADERS
======================================================= */

const headers = () => ({
  "Content-Type": "application/json",
  "X-Goog-Api-Key": GOOGLE_API_KEY,
});

/* =======================================================
   PLACE DETAILS
======================================================= */

const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,

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

const formatPlace = (place) => {
  if (!place || !place.location) {
    return null;
  }

  let state = "";
  let district = "";
  let country = "India";

  const components =
    place.addressComponents || [];

  components.forEach((component) => {
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
  });

  const name =
    place.displayName?.text || "";

  const address =
    place.formattedAddress || "";

  return {
    value:
      `${place.location.latitude},${place.location.longitude}`,

    label:
      address || name,

    name,

    district,

    state,

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
   TEXT SEARCH
======================================================= */

const textSearch = async (query) => {
  try {
    const response =
      await axios.post(
        TEXT_SEARCH_URL,
        {
          textQuery:
            `${query}, India`,

          languageCode: "en",

          regionCode: "IN",

          maxResultCount: 20,
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

const geocodeSearch = async (query) => {
  try {
    const response =
      await axios.get(
        GEOCODE_URL,
        {
          params: {
            address:
              `${query}, India`,

            key:
              GOOGLE_API_KEY,

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
    )
      .map((item) => {
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
        ).forEach((component) => {
          const types =
            component.types || [];

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
        });

        const name =
          item.address_components?.[0]
            ?.long_name ||
          query;

        return {
          value:
            `${location.lat},${location.lng}`,

          label:
            item.formatted_address ||
            name,

          name,

          district,

          state,

          country,

          lat:
            Number(location.lat),

          lon:
            Number(location.lng),

          placeId:
            item.place_id || "",

          formattedAddress:
            item.formatted_address ||
            "",

          types:
            item.types || [],
        };
      })
      .filter(Boolean);

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
   MAIN CITY SEARCH
======================================================= */

export const searchCities =
  async (req, res) => {
    try {
      const query =
        String(
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
          response.data?.suggestions ||
          [];

        /*
         * Get more suggestions so
         * villages with the same
         * name can appear.
         */

        for (
          const suggestion of
          suggestions.slice(0, 10)
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

      } catch (error) {
        console.error(
          "GOOGLE AUTOCOMPLETE ERROR:",
          error.response?.data ||
            error.message
        );
      }

      /* =================================================
         2. TEXT SEARCH
      ================================================= */

      const places =
        await textSearch(query);

      places.forEach((place) => {
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
      });

      /* =================================================
         3. GEOCODING FALLBACK
      ================================================= */

      if (results.length === 0) {
        const geocoded =
          await geocodeSearch(
            query
          );

        results.push(
          ...geocoded
        );
      }

      /* =================================================
         4. REMOVE TRUE DUPLICATES
         
         IMPORTANT:
         Do NOT deduplicate by village name.
         
         Same village name in different
         districts must remain.
      ================================================= */

      const unique = [];

      for (
        const item of results
      ) {
        const duplicate =
          unique.some(
            (existing) => {

              // Same Google place
              if (
                item.placeId &&
                existing.placeId &&
                item.placeId ===
                  existing.placeId
              ) {
                return true;
              }

              // Same coordinates
              const sameLocation =
                Math.abs(
                  item.lat -
                    existing.lat
                ) < 0.00001 &&
                Math.abs(
                  item.lon -
                    existing.lon
                ) < 0.00001;

              return sameLocation;
            }
          );

        if (!duplicate) {
          unique.push(item);
        }
      }

      /* =================================================
         5. RANK RESULTS
         
         Exact village name first.
         Then partial matches.
      ================================================= */

      const queryLower =
        query.toLowerCase();

      unique.sort(
        (a, b) => {

          const aName =
            String(
              a.name || ""
            ).toLowerCase();

          const bName =
            String(
              b.name || ""
            ).toLowerCase();

          const aExact =
            aName ===
            queryLower
              ? 0
              : 1;

          const bExact =
            bName ===
            queryLower
              ? 0
              : 1;

          if (
            aExact !== bExact
          ) {
            return (
              aExact -
              bExact
            );
          }

          const aStarts =
            aName.startsWith(
              queryLower
            )
              ? 0
              : 1;

          const bStarts =
            bName.startsWith(
              queryLower
            )
              ? 0
              : 1;

          return (
            aStarts -
            bStarts
          );
        }
      );

      /* =================================================
         6. RETURN 15 RESULTS
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