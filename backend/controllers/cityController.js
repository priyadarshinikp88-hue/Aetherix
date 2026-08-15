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
   GET ADDRESS COMPONENT
======================================================= */

const getComponentName = (
  components,
  type
) => {
  const component =
    components.find((item) =>
      (item.types || []).includes(type)
    );

  return (
    component?.longText ||
    component?.shortText ||
    ""
  );
};

/* =======================================================
   FIND DISTRICT
======================================================= */

const getDistrict = (components) => {
  /*
   * Google may return:
   *
   * administrative_area_level_2
   * administrative_area_level_3
   * administrative_area_level_4
   *
   * depending on the location.
   *
   * We should NOT blindly use a value
   * containing "Division" as the district.
   */

  const level2 = getComponentName(
    components,
    "administrative_area_level_2"
  );

  if (
    level2 &&
    !level2
      .toLowerCase()
      .includes("division")
  ) {
    return level2;
  }

  const level3 = getComponentName(
    components,
    "administrative_area_level_3"
  );

  if (
    level3 &&
    !level3
      .toLowerCase()
      .includes("division")
  ) {
    return level3;
  }

  const level4 = getComponentName(
    components,
    "administrative_area_level_4"
  );

  if (
    level4 &&
    !level4
      .toLowerCase()
      .includes("division")
  ) {
    return level4;
  }

  /*
   * If Google only provides a division,
   * don't incorrectly call it a district.
   */

  return "";
};

/* =======================================================
   FORMAT GOOGLE PLACE
======================================================= */

const formatPlace = (place) => {
  if (
    !place ||
    !place.location
  ) {
    return null;
  }

  const components =
    place.addressComponents || [];

  const state =
    getComponentName(
      components,
      "administrative_area_level_1"
    );

  const country =
    getComponentName(
      components,
      "country"
    ) || "India";

  const district =
    getDistrict(
      components
    );

  const locality =
    getComponentName(
      components,
      "locality"
    );

  const sublocality =
    getComponentName(
      components,
      "sublocality"
    );

  const postalTown =
    getComponentName(
      components,
      "postal_town"
    );

  const name =
    place.displayName?.text ||
    locality ||
    sublocality ||
    postalTown ||
    "";

  const address =
    place.formattedAddress ||
    "";

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
   LOCATION TYPE CHECK
======================================================= */

const geographicTypes = new Set([
  "locality",
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
  "administrative_area_level_5",
  "sublocality",
  "sublocality_level_1",
  "sublocality_level_2",
  "postal_town",
  "neighborhood",
  "route",
  "premise",
]);

const unwantedTypes = new Set([
  "establishment",
  "point_of_interest",
  "service",
  "housing_complex",
  "association_or_organization",
  "store",
  "restaurant",
  "cafe",
  "bar",
  "lodging",
  "school",
  "hospital",
  "church",
]);

/* =======================================================
   LOCATION SCORE
======================================================= */

const getLocationScore = (
  item,
  query
) => {
  const types =
    item.types || [];

  const queryLower =
    query
      .trim()
      .toLowerCase();

  const name =
    String(
      item.name || ""
    ).toLowerCase();

  let score = 0;

  /* Exact name */
  if (
    name === queryLower
  ) {
    score += 100;
  }

  /* Starts with query */
  if (
    name.startsWith(
      queryLower
    )
  ) {
    score += 50;
  }

  /* Geographic result */
  if (
    types.some((type) =>
      geographicTypes.has(type)
    )
  ) {
    score += 40;
  }

  /* Actual locality */
  if (
    types.includes("locality")
  ) {
    score += 30;
  }

  /* Has district */
  if (
    item.district
  ) {
    score += 20;
  }

  /* Has state */
  if (
    item.state
  ) {
    score += 10;
  }

  /*
   * Penalize business / POI
   * results.
   */

  if (
    types.some((type) =>
      unwantedTypes.has(type)
    )
  ) {
    score -= 100;
  }

  return score;
};

/* =======================================================
   TEXT SEARCH
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

        const components =
          item.address_components ||
          [];

        const state =
          getComponentName(
            components,
            "administrative_area_level_1"
          );

        const country =
          getComponentName(
            components,
            "country"
          ) || "India";

        const district =
          getDistrict(
            components
          );

        const locality =
          getComponentName(
            components,
            "locality"
          );

        const sublocality =
          getComponentName(
            components,
            "sublocality"
          );

        const postalTown =
          getComponentName(
            components,
            "postal_town"
          );

        const name =
          locality ||
          sublocality ||
          postalTown ||
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
            Number(
              location.lat
            ),

          lon:
            Number(
              location.lng
            ),

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

      if (
        query.length < 2
      ) {
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

        for (
          const suggestion of
          suggestions
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
         4. REMOVE TRUE DUPLICATES

         SAME NAME ≠ DUPLICATE

         Same village in different
         districts MUST remain.
      ================================================= */

      const unique = [];

      for (
        const item of results
      ) {
        const duplicate =
          unique.some(
            (existing) => {

              if (
                item.placeId &&
                existing.placeId &&
                item.placeId ===
                  existing.placeId
              ) {
                return true;
              }

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
         5. SCORE AND SORT
      ================================================= */

      unique.sort(
        (a, b) => {
          const scoreA =
            getLocationScore(
              a,
              query
            );

          const scoreB =
            getLocationScore(
              b,
              query
            );

          return (
            scoreB -
            scoreA
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