import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API = 'https://aetherix-backend-eoj8.onrender.com';

type TomorrowDaily = {
  time?: string;

  values?: {
    temperatureAvg?: number;
    temperatureMin?: number;
    temperatureMax?: number;

    humidityAvg?: number;

    windSpeedAvg?: number;

    weatherCodeMax?: number;
    weatherCodeMin?: number;

    precipitationProbabilityAvg?: number;
    precipitationProbabilityMax?: number;

    sunriseTime?: string;
    sunsetTime?: string;
  };
};

type ForecastResponse = {
  data?: {
    timelines?: {
      daily?: TomorrowDaily[];
    };
  };

  // fallback if backend returns daily directly
  timelines?: {
    daily?: TomorrowDaily[];
  };

  list?: any[];
};

type DayForecast = {
  date: string;
  temp: number;
  min: number;
  max: number;
  humidity: number;
  wind: number;
  description: string;
  weatherCode: number;
  rainProbability: number;
  sunrise?: string;
  sunset?: string;
};

/* =======================================================
   WEATHER CODE → NATURAL EMOJI
======================================================= */

const getWeatherEmoji = (code: number) => {
  switch (Number(code)) {
    // Clear
    case 1000:
      return '☀️';

    // Mostly clear
    case 1100:
      return '🌤️';

    // Partly cloudy
    case 1101:
      return '⛅';

    // Mostly cloudy
    case 1102:
      return '🌥️';

    // Cloudy
    case 1001:
      return '☁️';

    // Fog
    case 2000:
    case 2100:
      return '🌫️';

    // Drizzle
    case 4000:
      return '🌦️';

    // Rain
    case 4001:
      return '🌧️';

    // Light rain
    case 4200:
      return '🌦️';

    // Heavy rain
    case 4201:
      return '🌧️';

    // Snow
    case 5000:
      return '🌨️';

    case 5001:
      return '🌨️';

    case 5100:
      return '🌨️';

    case 5101:
      return '❄️';

    // Freezing drizzle/rain
    case 6000:
    case 6001:
    case 6200:
    case 6201:
      return '🌧️';

    // Ice pellets
    case 7000:
    case 7101:
    case 7102:
      return '🧊';

    // Thunderstorm
    case 8000:
      return '⛈️';

    default:
      return '🌤️';
  }
};

/* =======================================================
   WEATHER CODE → DESCRIPTION
======================================================= */

const getWeatherDescription = (code: number) => {
  switch (Number(code)) {
    case 1000:
      return 'Clear Sky';

    case 1100:
      return 'Mostly Clear';

    case 1101:
      return 'Partly Cloudy';

    case 1102:
      return 'Mostly Cloudy';

    case 1001:
      return 'Overcast Clouds';

    case 2000:
      return 'Fog';

    case 2100:
      return 'Light Fog';

    case 4000:
      return 'Drizzle';

    case 4001:
      return 'Rain';

    case 4200:
      return 'Light Rain';

    case 4201:
      return 'Heavy Rain';

    case 5000:
      return 'Snow';

    case 5001:
      return 'Flurries';

    case 5100:
      return 'Light Snow';

    case 5101:
      return 'Heavy Snow';

    case 6000:
      return 'Freezing Drizzle';

    case 6001:
      return 'Freezing Rain';

    case 6200:
      return 'Light Freezing Rain';

    case 6201:
      return 'Heavy Freezing Rain';

    case 7000:
      return 'Ice Pellets';

    case 7101:
      return 'Heavy Ice Pellets';

    case 7102:
      return 'Light Ice Pellets';

    case 8000:
      return 'Thunderstorm';

    default:
      return 'Weather Unavailable';
  }
};

/* =======================================================
   DATE HELPERS
======================================================= */

const getDayName = (
  dateString: string,
  index: number
) => {
  if (index === 0) {
    return 'Today';
  }

  if (index === 1) {
    return 'Tomorrow';
  }

  return new Date(
    `${dateString}T12:00:00`
  ).toLocaleDateString('en-IN', {
    weekday: 'long',
  });
};

const getDate = (dateString: string) => {
  return new Date(
    `${dateString}T12:00:00`
  ).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/* =======================================================
   TIME FORMAT
======================================================= */

const formatTime = (
  value?: string
) => {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/* =======================================================
   FORECAST SCREEN
======================================================= */

export default function ForecastScreen() {
  const router = useRouter();

  const {
    lat,
    lon,
    city,
  } = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    city?: string;
  }>();

  const [forecast, setForecast] =
    useState<DayForecast[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /* =====================================================
     LOAD FORECAST
  ===================================================== */

  useEffect(() => {
    loadForecast();
  }, [lat, lon]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      setError('');

      if (!lat || !lon) {
        setError(
          'Location is not available. Please return to the dashboard and try again.'
        );
        return;
      }

      const response = await fetch(
        `${API}/api/forecast?lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}`
      );

      const data: ForecastResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          (data as any)?.message ||
            'Unable to fetch forecast.'
        );
      }

      /* =================================================
         TOMORROW.IO FORMAT

         data.timelines.daily
      ================================================= */

      const tomorrowDaily =
        data?.data?.timelines?.daily ||
        data?.timelines?.daily ||
        [];

      if (
        Array.isArray(tomorrowDaily) &&
        tomorrowDaily.length > 0
      ) {
        const daily: DayForecast[] =
          tomorrowDaily
            .slice(0, 5)
            .map((item) => {
              const values =
                item.values || {};

              const date =
                item.time?.split('T')[0] ||
                new Date()
                  .toISOString()
                  .split('T')[0];

              const weatherCode =
                Number(
                  values.weatherCodeMax ??
                    values.weatherCodeMin ??
                    1000
                );

              return {
                date,

                temp:
                  Number(
                    values.temperatureAvg ??
                      values.temperatureMax ??
                      0
                  ),

                min:
                  Number(
                    values.temperatureMin ??
                      values.temperatureAvg ??
                      0
                  ),

                max:
                  Number(
                    values.temperatureMax ??
                      values.temperatureAvg ??
                      0
                  ),

                humidity:
                  Number(
                    values.humidityAvg ?? 0
                  ),

                wind:
                  Number(
                    values.windSpeedAvg ?? 0
                  ),

                description:
                  getWeatherDescription(
                    weatherCode
                  ),

                weatherCode,

                rainProbability:
                  Number(
                    values.precipitationProbabilityAvg ??
                      values.precipitationProbabilityMax ??
                      0
                  ),

                sunrise:
                  values.sunriseTime,

                sunset:
                  values.sunsetTime,
              };
            });

        setForecast(daily);
        return;
      }

      /* =================================================
         FALLBACK

         If your backend still returns an older
         list-based structure, safely process it.
      ================================================= */

      const list =
        Array.isArray(data?.list)
          ? data.list
          : [];

      if (!list.length) {
        throw new Error(
          'No forecast data available.'
        );
      }

      const grouped: Record<
        string,
        any[]
      > = {};

      list.forEach((item) => {
        if (!item?.dt) {
          return;
        }

        const date = new Date(
          item.dt * 1000
        );

        const key =
          date.toLocaleDateString(
            'en-CA'
          );

        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push(item);
      });

      const daily: DayForecast[] =
        Object.entries(grouped)
          .slice(0, 5)
          .map(([date, items]) => {
            const temps =
              items.map(
                (item) =>
                  Number(
                    item?.main?.temp ?? 0
                  )
              );

            const humidity =
              items.map(
                (item) =>
                  Number(
                    item?.main?.humidity ?? 0
                  )
              );

            const wind =
              items.map(
                (item) =>
                  Number(
                    item?.wind?.speed ?? 0
                  )
              );

            const representative =
              items[0];

            const description =
              representative
                ?.weather?.[0]
                ?.description ||
              'Weather unavailable';

            const weatherCode =
              Number(
                representative
                  ?.weather?.[0]
                  ?.id ?? 1000
              );

            return {
              date,

              temp:
                temps.length
                  ? temps.reduce(
                      (a, b) => a + b,
                      0
                    ) / temps.length
                  : 0,

              min:
                temps.length
                  ? Math.min(...temps)
                  : 0,

              max:
                temps.length
                  ? Math.max(...temps)
                  : 0,

              humidity:
                humidity.length
                  ? humidity.reduce(
                      (a, b) => a + b,
                      0
                    ) / humidity.length
                  : 0,

              wind:
                wind.length
                  ? wind.reduce(
                      (a, b) => a + b,
                      0
                    ) / wind.length
                  : 0,

              description,

              weatherCode,

              rainProbability: 0,
            };
          });

      setForecast(daily);
    } catch (err: any) {
      console.error(
        'Forecast error:',
        err
      );

      setError(
        err?.message ||
          'Unable to connect to weather server.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View style={styles.center}>
          <View style={styles.loadingIcon}>
            <Ionicons
              name="cloud-outline"
              size={42}
              color="#62D0FF"
            />
          </View>

          <ActivityIndicator
            size="large"
            color="#62D0FF"
          />

          <Text
            style={styles.loadingTitle}
          >
            Loading Forecast
          </Text>

          <Text
            style={styles.loadingText}
          >
            Fetching the latest weather
            predictions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View style={styles.center}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="cloud-offline-outline"
              size={50}
              color="#FF8A8A"
            />
          </View>

          <Text
            style={styles.errorTitle}
          >
            Forecast Unavailable
          </Text>

          <Text
            style={styles.errorText}
          >
            {error}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#041327"
            />

            <Text
              style={styles.backText}
            >
              Back to Dashboard
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* =============================================
            HEADER
        ============================================= */}

        <View style={styles.header}>
          <Pressable
            style={styles.backCircle}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={25}
              color="#62D0FF"
            />
          </Pressable>

          <View
            style={styles.headerText}
          >
            <Text
              style={styles.eyebrow}
            >
              AETHERIX WEATHER
            </Text>

            <Text
              style={styles.title}
              numberOfLines={1}
            >
              5-Day Forecast
            </Text>

            <Text
              style={styles.subtitle}
              numberOfLines={1}
            >
              {city ||
                'Selected Location'}
            </Text>
          </View>

          <View
            style={styles.headerIcon}
          >
            <Ionicons
              name="calendar-outline"
              size={23}
              color="#62D0FF"
            />
          </View>
        </View>

        {/* =============================================
            LOCATION PILL
        ============================================= */}

        <View
          style={styles.locationPill}
        >
          <View
            style={styles.locationIcon}
          >
            <Ionicons
              name="location"
              size={19}
              color="#62D0FF"
            />
          </View>

          <View
            style={styles.locationText}
          >
            <Text
              style={
                styles.locationLabel
              }
            >
              FORECAST FOR
            </Text>

            <Text
              style={
                styles.locationName
              }
              numberOfLines={1}
            >
              {city ||
                'Selected Location'}
            </Text>
          </View>

          <View
            style={styles.liveBadge}
          >
            <View
              style={styles.liveDot}
            />

            <Text
              style={styles.liveText}
            >
              LIVE
            </Text>
          </View>
        </View>

        {/* =============================================
            SECTION
        ============================================= */}

        <View
          style={styles.sectionHeader}
        >
          <View>
            <Text
              style={
                styles.sectionTitle
              }
            >
              DAILY FORECAST
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Detailed weather predictions
            </Text>
          </View>

          <Ionicons
            name="sparkles-outline"
            size={22}
            color="#62D0FF"
          />
        </View>

        {/* =============================================
            FORECAST CARDS
        ============================================= */}

        {forecast.map(
          (day, index) => (
            <View
              key={`${day.date}-${index}`}
              style={styles.card}
            >
              {/* TOP */}

              <View
                style={styles.cardTop}
              >
                <View
                  style={styles.dayInfo}
                >
                  <Text
                    style={styles.day}
                  >
                    {getDayName(
                      day.date,
                      index
                    )}
                  </Text>

                  <Text
                    style={styles.date}
                  >
                    {getDate(day.date)}
                  </Text>
                </View>

                {/* WEATHER ICON */}

                <View
                  style={styles.iconBox}
                >
                  <Text
                    style={
                      styles.weatherEmoji
                    }
                  >
                    {getWeatherEmoji(
                      day.weatherCode
                    )}
                  </Text>
                </View>
              </View>

              {/* MAIN WEATHER */}

              <View
                style={styles.weatherMain}
              >
                <View
                  style={styles.temperatureBlock}
                >
                  <View
                    style={
                      styles.temperatureRow
                    }
                  >
                    <Text
                      style={
                        styles.temperature
                      }
                    >
                      {Math.round(
                        day.temp
                      )}
                    </Text>

                    <Text
                      style={
                        styles.degree
                      }
                    >
                      °C
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.description
                    }
                  >
                    {day.description}
                  </Text>
                </View>

                {/* HIGH / LOW */}

                <View
                  style={styles.highLow}
                >
                  <View
                    style={
                      styles.highRow
                    }
                  >
                    <View
                      style={
                        styles.highIcon
                      }
                    >
                      <Ionicons
                        name="arrow-up"
                        size={14}
                        color="#FDBA74"
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.highLabel
                        }
                      >
                        HIGH
                      </Text>

                      <Text
                        style={styles.high}
                      >
                        {Math.round(
                          day.max
                        )}
                        °
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.lowRow
                    }
                  >
                    <View
                      style={
                        styles.lowIcon
                      }
                    >
                      <Ionicons
                        name="arrow-down"
                        size={14}
                        color="#7DD3FC"
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.lowLabel
                        }
                      >
                        LOW
                      </Text>

                      <Text
                        style={styles.low}
                      >
                        {Math.round(
                          day.min
                        )}
                        °
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* DIVIDER */}

              <View
                style={styles.divider}
              />

              {/* DETAILS */}

              <View
                style={styles.details}
              >
                {/* HUMIDITY */}

                <View
                  style={styles.detail}
                >
                  <View
                    style={[
                      styles.detailIcon,
                      styles.blueIcon,
                    ]}
                  >
                    <Ionicons
                      name="water-outline"
                      size={20}
                      color="#62D0FF"
                    />
                  </View>

                  <View
                    style={styles.detailText}
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      HUMIDITY
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {Math.round(
                        day.humidity
                      )}
                      %
                    </Text>
                  </View>
                </View>

                {/* WIND */}

                <View
                  style={styles.detail}
                >
                  <View
                    style={[
                      styles.detailIcon,
                      styles.purpleIcon,
                    ]}
                  >
                    <Ionicons
                      name="navigate-outline"
                      size={20}
                      color="#A78BFA"
                    />
                  </View>

                  <View
                    style={styles.detailText}
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      WIND
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {day.wind.toFixed(
                        1
                      )}{' '}
                      m/s
                    </Text>
                  </View>
                </View>
              </View>

              {/* RAIN PROBABILITY */}

              {day.rainProbability >
                0 && (
                <View
                  style={
                    styles.rainProbability
                  }
                >
                  <View
                    style={
                      styles.rainLeft
                    }
                  >
                    <Text
                      style={
                        styles.rainEmoji
                      }
                    >
                      🌧️
                    </Text>

                    <View>
                      <Text
                        style={
                          styles.rainLabel
                        }
                      >
                        RAIN CHANCE
                      </Text>

                      <Text
                        style={
                          styles.rainSubtext
                        }
                      >
                        Probability of
                        precipitation
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.rainValue
                    }
                  >
                    {Math.round(
                      day.rainProbability
                    )}
                    %
                  </Text>
                </View>
              )}

              {/* SUNRISE / SUNSET */}

              {(day.sunrise ||
                day.sunset) && (
                <View
                  style={
                    styles.sunRow
                  }
                >
                  {day.sunrise && (
                    <View
                      style={
                        styles.sunItem
                      }
                    >
                      <Ionicons
                        name="sunny-outline"
                        size={18}
                        color="#FDBA74"
                      />

                      <View>
                        <Text
                          style={
                            styles.sunLabel
                          }
                        >
                          SUNRISE
                        </Text>

                        <Text
                          style={
                            styles.sunValue
                          }
                        >
                          {formatTime(
                            day.sunrise
                          )}
                        </Text>
                      </View>
                    </View>
                  )}

                  {day.sunset && (
                    <View
                      style={
                        styles.sunItem
                      }
                    >
                      <Ionicons
                        name="moon-outline"
                        size={18}
                        color="#C4B5FD"
                      />

                      <View>
                        <Text
                          style={
                            styles.sunLabel
                          }
                        >
                          SUNSET
                        </Text>

                        <Text
                          style={
                            styles.sunValue
                          }
                        >
                          {formatTime(
                            day.sunset
                          )}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )
        )}

        {/* FOOTER */}

        <View
          style={styles.footer}
        >
          <Ionicons
            name="cloud-outline"
            size={17}
            color="#52718D"
          />

          <Text
            style={styles.footerText}
          >
            AETHERIX • INTELLIGENT
            WEATHER
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =======================================================
   STYLES
======================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#041327',
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 50,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#0B3153',
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: '#62D0FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  subtitle: {
    color: '#829DB7',
    fontSize: 13,
    marginTop: 3,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor:
      'rgba(98,208,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* LOCATION */

  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#08294A',
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.20)',
    borderRadius: 20,
    padding: 11,
    marginBottom: 28,
  },

  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor:
      'rgba(98,208,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  locationText: {
    flex: 1,
  },

  locationLabel: {
    color: '#64819D',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  locationName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor:
      'rgba(76,230,158,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(76,230,158,0.25)',
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#61E6A3',
    marginRight: 6,
  },

  liveText: {
    color: '#61E6A3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    color: '#62D0FF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },

  sectionSubtitle: {
    color: '#708BA5',
    fontSize: 12,
    marginTop: 5,
  },

  /* CARD */

  card: {
    backgroundColor: '#08294A',
    borderRadius: 25,
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.22)',
    padding: 18,
    marginBottom: 17,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  dayInfo: {
    flex: 1,
  },

  day: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  date: {
    color: '#718EA9',
    fontSize: 12,
    marginTop: 5,
  },

  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor:
      'rgba(98,208,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  weatherEmoji: {
    fontSize: 46,
    lineHeight: 54,
    textAlign: 'center',
  },

  /* MAIN WEATHER */

  weatherMain: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 17,
  },

  temperatureBlock: {
    flex: 1,
  },

  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  temperature: {
    color: '#FFFFFF',
    fontSize: 53,
    lineHeight: 60,
    fontWeight: '900',
  },

  degree: {
    color: '#62D0FF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 5,
    marginLeft: 3,
  },

  description: {
    color: '#62D0FF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
    textTransform: 'capitalize',
    maxWidth: 180,
  },

  highLow: {
    gap: 9,
    alignItems: 'flex-end',
  },

  highRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  lowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  highIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor:
      'rgba(253,186,116,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  lowIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor:
      'rgba(125,211,252,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  highLabel: {
    color: '#7B8FA5',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  lowLabel: {
    color: '#7B8FA5',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  high: {
    color: '#FDBA74',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },

  low: {
    color: '#7DD3FC',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },

  divider: {
    height: 1,
    backgroundColor:
      'rgba(255,255,255,0.07)',
  },

  /* DETAILS */

  details: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  detail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.035)',
    borderRadius: 16,
    padding: 11,
  },

  detailIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  blueIcon: {
    backgroundColor:
      'rgba(98,208,255,0.09)',
  },

  purpleIcon: {
    backgroundColor:
      'rgba(167,139,250,0.09)',
  },

  detailText: {
    flex: 1,
    marginLeft: 9,
  },

  detailLabel: {
    color: '#718AA3',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  /* RAIN */

  rainProbability: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    backgroundColor:
      'rgba(98,208,255,0.055)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.10)',
    padding: 11,
  },

  rainLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  rainEmoji: {
    fontSize: 25,
    marginRight: 10,
  },

  rainLabel: {
    color: '#62D0FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  rainSubtext: {
    color: '#6D879F',
    fontSize: 9,
    marginTop: 3,
  },

  rainValue: {
    color: '#62D0FF',
    fontSize: 17,
    fontWeight: '900',
  },

  /* SUN */

  sunRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  sunItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.025)',
    borderRadius: 13,
    padding: 10,
  },

  sunLabel: {
    color: '#708AA2',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 8,
  },

  sunValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
    marginTop: 2,
  },

  /* LOADING */

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: '#08294A',
    borderWidth: 1,
    borderColor:
      'rgba(98,208,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 18,
  },

  loadingText: {
    color: '#829DB7',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  /* ERROR */

  errorIcon: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor:
      'rgba(255,138,138,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(255,138,138,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 18,
  },

  errorText: {
    color: '#8FAAC5',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 25,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#62D0FF',
    paddingHorizontal: 19,
    paddingVertical: 13,
    borderRadius: 15,
  },

  backText: {
    color: '#041327',
    fontWeight: '900',
  },

  /* FOOTER */

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 7,
    opacity: 0.8,
  },

  footerText: {
    color: '#52718D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});