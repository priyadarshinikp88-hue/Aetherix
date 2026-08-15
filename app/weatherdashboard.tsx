import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

/* =========================================================
   API
========================================================= */

const API =
  'https://aetherix-backend-eoj8.onrender.com';

/* =========================================================
   TYPES
========================================================= */

type WeatherIconName =
  keyof typeof Ionicons.glyphMap;

type City = {
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
};

type WeatherData = {
  name?: string;
  city?: string;

  location?: {
    city?: string;
    name?: string;
  };

  sys?: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };

  coord?: {
    lat?: number;
    lon?: number;
  };

  main?: {
    temp?: number;
    feels_like?: number;
    humidity?: number;
    pressure?: number;
  };

  visibility?: number;

  wind?: {
    speed?: number;
    deg?: number;
  };

  weather?: Array<{
    main?: string;
    description?: string;
    icon?: string;
  }>;
};

type ForecastItem = {
  dt?: number;
  dt_txt?: string;

  main?: {
    temp?: number;
  };

  weather?: Array<{
    main?: string;
    description?: string;
  }>;
};

/* =========================================================
   MOON PHASE
========================================================= */

function getMoonPhase(date: Date) {
  const cycle = 29.530588853;

  const knownNewMoon =
    new Date(
      '2000-01-06T18:14:00Z'
    );

  const days =
    (date.getTime() -
      knownNewMoon.getTime()) /
    86400000;

  const phase =
    ((days % cycle) + cycle) %
    cycle;

  const illumination =
    Math.round(
      (1 -
        Math.cos(
          (2 * Math.PI * phase) /
            cycle
        )) *
        50
    );

  if (phase < 1.84566) {
    return {
      name: 'New Moon',
      icon: 'moon-outline' as WeatherIconName,
      illumination,
    };
  }

  if (phase < 7.38223) {
    return {
      name: 'Waxing Crescent',
      icon: 'moon-outline' as WeatherIconName,
      illumination,
    };
  }

  if (phase < 9.22828) {
    return {
      name: 'First Quarter',
      icon: 'contrast-outline' as WeatherIconName,
      illumination,
    };
  }

  if (phase < 14.76529) {
    return {
      name: 'Waxing Gibbous',
      icon: 'moon-outline' as WeatherIconName,
      illumination,
    };
  }

  if (phase < 16.61134) {
    return {
      name: 'Full Moon',
      icon: 'ellipse-outline' as WeatherIconName,
      illumination,
    };
  }

  if (phase < 22.14837) {
    return {
      name: 'Waning Gibbous',
      icon: 'moon-outline' as WeatherIconName,
      illumination,
    };
  }

  if (phase < 23.99442) {
    return {
      name: 'Last Quarter',
      icon: 'contrast-outline' as WeatherIconName,
      illumination,
    };
  }

  return {
    name: 'Waning Crescent',
    icon: 'moon-outline' as WeatherIconName,
    illumination,
  };
}

/* =========================================================
   WEATHER ICON
========================================================= */

function getWeatherIcon(
  main?: string,
  description?: string
): WeatherIconName {
  const value =
    `${main || ''} ${description || ''}`
      .toLowerCase();

  if (
    value.includes('thunder') ||
    value.includes('storm')
  ) {
    return 'thunderstorm-outline';
  }

  if (
    value.includes('rain') ||
    value.includes('drizzle')
  ) {
    return 'rainy-outline';
  }

  if (
    value.includes('snow') ||
    value.includes('sleet')
  ) {
    return 'snow-outline';
  }

  if (
    value.includes('clear') ||
    value.includes('sunny')
  ) {
    return 'sunny-outline';
  }

  if (
    value.includes('partly') ||
    value.includes('few clouds')
  ) {
    return 'partly-sunny-outline';
  }

  if (
    value.includes('mist') ||
    value.includes('fog') ||
    value.includes('haze')
  ) {
    return 'cloud-outline';
  }

  return 'cloud-outline';
}

/* =========================================================
   WEATHER COLOR
========================================================= */

function getConditionAccent(
  main?: string,
  description?: string
) {
  const value =
    `${main || ''} ${description || ''}`
      .toLowerCase();

  if (
    value.includes('thunder') ||
    value.includes('storm')
  ) {
    return '#B9A1FF';
  }

  if (
    value.includes('rain') ||
    value.includes('drizzle')
  ) {
    return '#58D4FF';
  }

  if (
    value.includes('clear') ||
    value.includes('sunny')
  ) {
    return '#FFC857';
  }

  if (
    value.includes('snow') ||
    value.includes('sleet')
  ) {
    return '#C7F1FF';
  }

  if (value.includes('partly')) {
    return '#7ADFFF';
  }

  return '#6DD2FF';
}

/* =========================================================
   WEATHER EMOJI
========================================================= */

function getWeatherEmoji(
  main?: string,
  description?: string
) {
  const value =
    `${main || ''} ${description || ''}`
      .toLowerCase();

  if (
    value.includes('thunder') ||
    value.includes('storm')
  ) {
    return '⛈️';
  }

  if (
    value.includes('heavy rain') ||
    value.includes('rain')
  ) {
    return '🌧️';
  }

  if (
    value.includes('drizzle')
  ) {
    return '🌦️';
  }

  if (
    value.includes('snow') ||
    value.includes('sleet')
  ) {
    return '❄️';
  }

  if (
    value.includes('clear') ||
    value.includes('sunny')
  ) {
    return '☀️';
  }

  if (
    value.includes('partly') ||
    value.includes('few clouds')
  ) {
    return '🌤️';
  }

  if (
    value.includes('mist') ||
    value.includes('fog') ||
    value.includes('haze')
  ) {
    return '🌫️';
  }

  return '☁️';
}

/* =========================================================
   DATE / TIME
========================================================= */

function formatClock(date: Date) {
  return date.toLocaleTimeString(
    'en-IN',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString(
    'en-IN',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
}

function formatSunTime(
  timestamp?: number
) {
  if (!timestamp) {
    return '--:--';
  }

  return new Date(
    timestamp * 1000
  ).toLocaleTimeString(
    'en-IN',
    {
      hour: 'numeric',
      minute: '2-digit',
    }
  );
}

function windDirection(
  deg?: number
) {
  if (deg == null) {
    return '';
  }

  const directions = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW',
  ];

  return directions[
    Math.round(deg / 45) % 8
  ];
}

/* =========================================================
   ANIMATED WEATHER EMOJI
   ========================================================= */

function AnimatedWeatherEmoji({
  condition,
  description,
  color,
}: {
  condition?: string;
  description?: string;
  color: string;
}) {
  const floatAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const rainAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const flashAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const value =
    `${condition || ''} ${description || ''}`
      .toLowerCase();

  const isRain =
    value.includes('rain') ||
    value.includes('drizzle');

  const isThunder =
    value.includes('thunder') ||
    value.includes('storm');

  const isSnow =
    value.includes('snow') ||
    value.includes('sleet');

  const emoji =
    getWeatherEmoji(
      condition,
      description
    );

  useEffect(() => {
    const float =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            floatAnim,
            {
              toValue: -5,
              duration: 1200,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            floatAnim,
            {
              toValue: 5,
              duration: 1200,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            floatAnim,
            {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            },
          ),
        ])
      );

    float.start();

    const scale =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            scaleAnim,
            {
              toValue: 1.08,
              duration: 1000,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            scaleAnim,
            {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }
          ),
        ])
      );

    scale.start();

    let rain:
      Animated.CompositeAnimation | null =
      null;

    if (
      isRain ||
      isThunder ||
      isSnow
    ) {
      rain =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              rainAnim,
              {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              rainAnim,
              {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }
            ),
          ])
        );

      rain.start();
    }

    let flash:
      Animated.CompositeAnimation | null =
      null;

    if (isThunder) {
      flash =
        Animated.loop(
          Animated.sequence([
            Animated.delay(1700),

            Animated.timing(
              flashAnim,
              {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              flashAnim,
              {
                toValue: 0,
                duration: 160,
                useNativeDriver: true,
              }
            ),

            Animated.delay(2300),
          ])
        );

      flash.start();
    }

    return () => {
      float.stop();
      scale.stop();

      if (rain) {
        rain.stop();
      }

      if (flash) {
        flash.stop();
      }
    };
  }, [
    condition,
    description,
    isRain,
    isThunder,
    isSnow,
  ]);

  const dropTranslate =
    rainAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-5, 18],
    });

  return (
    <View
      style={
        styles.animatedEmojiContainer
      }
    >
      <Animated.View
        style={[
          styles.emojiGlow,
          {
            backgroundColor:
              `${color}18`,
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={{
          transform: [
            {
              translateY:
                floatAnim,
            },
          ],
        }}
      >
        <Text
          style={
            styles.weatherEmoji
          }
        >
          {emoji}
        </Text>
      </Animated.View>

      {/* NATURAL RAIN DROPS */}

      {(isRain ||
        isThunder) && (
        <Animated.View
          style={[
            styles.rainLayer,
            {
              transform: [
                {
                  translateY:
                    dropTranslate,
                },
              ],
              opacity:
                rainAnim.interpolate(
                  {
                    inputRange: [
                      0,
                      1,
                    ],
                    outputRange: [
                      0.45,
                      1,
                    ],
                  }
                ),
            },
          ]}
        >
          <View
            style={[
              styles.rainDrop,
              styles.dropOne,
              {
                backgroundColor:
                  color,
              },
            ]}
          />

          <View
            style={[
              styles.rainDrop,
              styles.dropTwo,
              {
                backgroundColor:
                  color,
              },
            ]}
          />

          <View
            style={[
              styles.rainDrop,
              styles.dropThree,
              {
                backgroundColor:
                  color,
              },
            ]}
          />

          <View
            style={[
              styles.rainDropSmall,
              styles.dropFour,
              {
                backgroundColor:
                  color,
              },
            ]}
          />

          <View
            style={[
              styles.rainDropSmall,
              styles.dropFive,
              {
                backgroundColor:
                  color,
              },
            ]}
          />

          <View
            style={[
              styles.rainDrop,
              styles.dropSix,
              {
                backgroundColor:
                  color,
                height: 10,
              },
            ]}
          />
        </Animated.View>
      )}

      {/* SNOW */}

      {isSnow && (
        <Animated.View
          style={[
            styles.snowLayer,
            {
              transform: [
                {
                  translateY:
                    dropTranslate,
                },
              ],
              opacity:
                rainAnim,
            },
          ]}
        >
          <Text
            style={
              styles.snowEmoji
            }
          >
            •  •  •
          </Text>
        </Animated.View>
      )}

      {/* LIGHTNING */}

      {isThunder && (
        <Animated.View
          style={[
            styles.flashIcon,
            {
              opacity:
                flashAnim,
            },
          ]}
        >
          <Text
            style={
              styles.flashEmoji
            }
          >
            ⚡
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

/* =========================================================
   DETAIL CARD
========================================================= */

function DetailCard({
  icon,
  title,
  value,
  subtitle,
  accent,
}: {
  icon: WeatherIconName;
  title: string;
  value: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <View
      style={[
        styles.detailCard,
        {
          borderColor:
            `${accent}42`,
        },
      ]}
    >
      <View
        style={[
          styles.detailIconBox,
          {
            backgroundColor:
              `${accent}12`,
            borderColor:
              `${accent}25`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={26}
          color={accent}
        />
      </View>

      <Text
        style={[
          styles.detailTitle,
          {
            color: accent,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={
          styles.detailValue
        }
        numberOfLines={1}
      >
        {value}
      </Text>

      <Text
        style={
          styles.detailSubtitle
        }
      >
        {subtitle}
      </Text>
    </View>
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function DashboardScreen() {
  const router = useRouter();

  const insets =
    useSafeAreaInsets();

  const { width } =
    useWindowDimensions();

  const isSmall =
    width < 370;

  /* =======================================================
     STATE
  ======================================================= */

  const [weather, setWeather] =
    useState<WeatherData | null>(
      null
    );

  const [forecast, setForecast] =
    useState<ForecastItem[]>([]);

  const [search, setSearch] =
    useState('');

  const [cityOptions, setCityOptions] =
    useState<City[]>([]);

  const [searching, setSearching] =
    useState(false);

  const [locating, setLocating] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [now, setNow] =
    useState(new Date());

  /* =======================================================
     CLOCK
  ======================================================= */

  useEffect(() => {
    const timer =
      setInterval(() => {
        setNow(new Date());
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  /* =======================================================
     FORECAST
  ======================================================= */

  const fetchForecast =
    async (
      lat: number,
      lon: number
    ) => {
      try {
        const response =
          await fetch(
            `${API}/api/forecast?lat=${encodeURIComponent(
              lat
            )}&lon=${encodeURIComponent(
              lon
            )}`
          );

        const data =
          await response.json();

        if (
          response.ok &&
          Array.isArray(
            data?.list
          )
        ) {
          setForecast(
            data.list
          );
        } else {
          setForecast([]);
        }
      } catch (error) {
        console.log(
          'Forecast error:',
          error
        );

        setForecast([]);
      }
    };

  /* =======================================================
     WEATHER
  ======================================================= */

  const fetchWeather =
    async (
      lat: number,
      lon: number
    ) => {
      try {
        setLoading(true);

        const response =
          await fetch(
            `${API}/api/weather?lat=${encodeURIComponent(
              lat
            )}&lon=${encodeURIComponent(
              lon
            )}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              'Unable to fetch weather'
          );
        }

        setWeather(data);

        await fetchForecast(
          lat,
          lon
        );
      } catch (error) {
        console.log(
          'Weather fetch error:',
          error
        );

        Alert.alert(
          'Weather Error',
          'Unable to fetch weather data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     INITIAL WEATHER
  ======================================================= */

  useEffect(() => {
    fetchWeather(
      12.2958,
      76.6394
    );
  }, []);

  /* =======================================================
     AUTO UPDATE EVERY MINUTE
  ======================================================= */

  useEffect(() => {
    const lat =
      weather?.coord?.lat;

    const lon =
      weather?.coord?.lon;

    if (
      lat == null ||
      lon == null
    ) {
      return;
    }

    const interval =
      setInterval(
        async () => {
          try {
            const response =
              await fetch(
                `${API}/api/weather?lat=${lat}&lon=${lon}`
              );

            const data =
              await response.json();

            if (response.ok) {
              setWeather(data);

              await fetchForecast(
                lat,
                lon
              );
            }
          } catch (error) {
            console.log(
              'Weather auto update failed:',
              error
            );
          }
        },
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    weather?.coord?.lat,
    weather?.coord?.lon,
  ]);

  /* =======================================================
     CITY SEARCH
  ======================================================= */

  const searchCities =
    async (
      value: string
    ) => {
      const text =
        value.trim();

      if (text.length < 2) {
        setCityOptions([]);
        return;
      }

      try {
        setSearching(true);
    const response = await fetch(
  `${API}/api/cities?q=${encodeURIComponent(text)}`
);

        const data =
          await response.json();

        if (
          !response.ok ||
          !Array.isArray(data)
        ) {
          setCityOptions([]);
          return;
        }

        const options: City[] =
          data
            .filter(
              (item: any) =>
                item?.name &&
                item?.lat != null &&
                item?.lon != null
            )
            .map(
              (item: any) => ({
                name:
                  item.name,
                state:
                  item.state ||
                  '',
                country:
                  item.country ||
                  '',
                lat: Number(
                  item.lat
                ),
                lon: Number(
                  item.lon
                ),
              })
            )
            .slice(0, 6);

        setCityOptions(
          options
        );
      } catch (error) {
        console.log(
          'City search error:',
          error
        );

        setCityOptions([]);
      } finally {
        setSearching(false);
      }
    };

  useEffect(() => {
    const value =
      search.trim();

    if (value.length < 2) {
      setCityOptions([]);
      return;
    }

    const timer =
      setTimeout(() => {
        searchCities(value);
      }, 450);

    return () =>
      clearTimeout(timer);
  }, [search]);

  /* =======================================================
     SELECT CITY
  ======================================================= */

  const selectCity =
    async (city: City) => {
      Keyboard.dismiss();

      setSearch(
        city.name
      );

      setCityOptions([]);

      await fetchWeather(
        city.lat,
        city.lon
      );
    };

  /* =======================================================
     CURRENT LOCATION
  ======================================================= */

  const getLiveLocation =
    async () => {
      if (locating) {
        return;
      }

      try {
        setLocating(true);

        Keyboard.dismiss();

        const permission =
          await Location.requestForegroundPermissionsAsync();

        if (
          permission.status !==
          'granted'
        ) {
          Alert.alert(
            'Location Permission',
            'Please allow location access to use your current location.'
          );

          return;
        }

        const position =
          await Location.getCurrentPositionAsync(
            {
              accuracy:
                Location.Accuracy.Balanced,
            }
          );

        const {
          latitude,
          longitude,
        } = position.coords;

        let liveCity =
          'Current Location';

        try {
          const places =
            await Location.reverseGeocodeAsync(
              {
                latitude,
                longitude,
              }
            );

          const place =
            places?.[0];

          liveCity =
            place?.city ||
            place?.district ||
            place?.subregion ||
            place?.region ||
            'Current Location';
        } catch (error) {
          console.log(
            'Reverse geocode error:',
            error
          );
        }

        setSearch(
          liveCity
        );

        setCityOptions([]);

        await fetchWeather(
          latitude,
          longitude
        );
      } catch (error) {
        console.log(
          'Location error:',
          error
        );

        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please try again.'
        );
      } finally {
        setLocating(false);
      }
    };

  /* =======================================================
     VALUES
  ======================================================= */

  const condition =
    weather?.weather?.[0]
      ?.main ||
    'Clouds';

  const description =
    weather?.weather?.[0]
      ?.description ||
    'Current conditions';

  const accent =
    getConditionAccent(
      condition,
      description
    );

  const city =
    weather?.city ||
    weather?.location?.city ||
    weather?.location?.name ||
    weather?.name ||
    'Mysore';

  const country =
    weather?.sys?.country ||
    'IN';

  const temperature =
    weather?.main?.temp;

  const feelsLike =
    weather?.main?.feels_like;

  const humidity =
    weather?.main?.humidity;

  const pressure =
    weather?.main?.pressure;

  const visibility =
    weather?.visibility;

  const windSpeed =
    weather?.wind?.speed;

  const windDeg =
    weather?.wind?.deg;

  const moon =
    useMemo(
      () =>
        getMoonPhase(now),
      [now]
    );

  const visibilityText =
    visibility == null
      ? '--'
      : `${(
          visibility / 1000
        ).toFixed(1)} km`;

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading &&
    !weather
  ) {
    return (
      <View
        style={
          styles.loadingScreen
        }
      >
        <View
          style={
            styles.loadingOrb
          }
        >
          <Text
            style={
              styles.loadingEmoji
            }
          >
            🌤️
          </Text>
        </View>

        <Text
          style={
            styles.loadingTitle
          }
        >
          AETHERIX WEATHER
        </Text>

        <Text
          style={
            styles.loadingText
          }
        >
          Loading live weather...
        </Text>

        <ActivityIndicator
          size="small"
          color="#65D8FF"
          style={{
            marginTop: 18,
          }}
        />
      </View>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <View
      style={styles.page}
    >
      {/* BACKGROUND */}

      <View
        pointerEvents="none"
        style={
          styles.backgroundLayer
        }
      >
        <View
          style={
            styles.bgGlowOne
          }
        />

        <View
          style={
            styles.bgGlowTwo
          }
        />

        <View
          style={
            styles.bgGlowThree
          }
        />

        <View
          style={
            styles.bgGlowFour
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop:
            insets.top + 7,
          paddingBottom:
            insets.bottom + 28,
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={
            styles.header
          }
        >
          <Pressable
            style={
              styles.menuButton
            }
          >
            <Ionicons
              name="menu-outline"
              size={31}
              color="#BCEEFF"
            />
          </Pressable>

          <View
            style={styles.brand}
          >
            <Text
              style={
                styles.brandSubtitle
              }
            >
              Intelligent weather insights
            </Text>
          </View>

          <View
            style={
              styles.headerActions
            }
          >
            <Pressable
              style={
                styles.headerAction
              }
             onPress={() => {
  const lat = weather?.coord?.lat;
  const lon = weather?.coord?.lon;

  if (lat == null || lon == null) {
    Alert.alert(
      'Location unavailable',
      'Please select a city first.'
    );
    return;
  }

  router.push({
    pathname: '/alerts',
    params: {
      lat: String(lat),
      lon: String(lon),
      city: String(city),
    },
  });
}}
            >
              <View
                style={
                  styles.headerIconWrap
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color="#65D8FF"
                />

                <View
                  style={
                    styles.alertDot
                  }
                />
              </View>

              <Text
                style={
                  styles.headerActionText
                }
              >
                Alerts
              </Text>
            </Pressable>
   <Pressable
  style={styles.headerAction}
  onPress={() => {
    const lat = weather?.coord?.lat;
    const lon = weather?.coord?.lon;

    if (lat == null || lon == null) {
      Alert.alert(
        'Location unavailable',
        'Please select a city first.'
      );
      return;
    }

    router.push({
      pathname: '/forecast',
      params: {
        lat: String(lat),
        lon: String(lon),
        city: String(city),
      },
    });
  }}
>
  <Ionicons
    name="cloud-outline"
    size={27}
    color="#65D8FF"
  />

  <Text
    style={styles.headerActionText}
  >
    Forecast
  </Text>
</Pressable>
           
          </View>
        </View>

        {/* =================================================
            SEARCH
        ================================================= */}

        <View
          style={
            styles.searchBox
          }
        >
          <Ionicons
            name="search-outline"
            size={29}
            color="#68D8FF"
          />

          <TextInput
            value={search}
            onChangeText={
              setSearch
            }
            placeholder="Search city..."
            placeholderTextColor="#6E89A4"
            style={
              styles.searchInput
            }
            autoCorrect={false}
            autoCapitalize="words"
          />

          <Pressable
            style={
              styles.locationButton
            }
            onPress={
              getLiveLocation
            }
            disabled={locating}
          >
            {locating ? (
              <ActivityIndicator
                size="small"
                color="#68D8FF"
              />
            ) : (
              <Ionicons
                name="locate-outline"
                size={29}
                color="#68D8FF"
              />
            )}
          </Pressable>
        </View>

        {/* SEARCH LOADING */}

        {searching &&
          search.trim()
            .length >= 2 && (
            <View
              style={
                styles.searchingRow
              }
            >
              <ActivityIndicator
                size="small"
                color="#68D8FF"
              />

              <Text
                style={
                  styles.searchingText
                }
              >
                Finding cities...
              </Text>
            </View>
          )}

        {/* SEARCH RESULTS */}

        {cityOptions.length >
          0 && (
          <View
            style={
              styles.searchResults
            }
          >
            {cityOptions.map(
              (
                item,
                index
              ) => (
                <Pressable
                  key={`${item.name}-${item.lat}-${index}`}
                  onPress={() =>
                    selectCity(
                      item
                    )
                  }
                  style={
                    styles.cityResult
                  }
                >
                  <View
                    style={
                      styles.resultIcon
                    }
                  >
                    <Ionicons
                      name="location-outline"
                      size={21}
                      color="#68D8FF"
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.resultCity
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.resultCountry
                      }
                    >
                      {[
                        item.state,
                        item.country,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ', '
                        )}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={19}
                    color="#68859E"
                  />
                </Pressable>
              )
            )}
          </View>
        )}

        {/* =================================================
            CITY
        ================================================= */}

        <View
          style={
            styles.cityHeader
          }
        >
          <View
            style={
              styles.cityIcon
            }
          >
            <Ionicons
              name="location"
              size={24}
              color="#68D8FF"
            />
          </View>

          <Text
            style={
              styles.cityTitle
            }
            numberOfLines={1}
          >
            {city}
          </Text>

          <Text
            style={
              styles.countryText
            }
          >
            {country}
          </Text>
        </View>

        {/* =================================================
            HERO CARD
            TEMPERATURE LEFT • PRESENT CONDITION RIGHT
        ================================================= */}

        <View style={styles.heroCard}>
          <View
            style={[
              styles.cardTopLine,
              { backgroundColor: accent },
            ]}
          />

          <View style={styles.dateRow}>
            <View>
              <Text style={styles.dateText}>
                {formatDate(now)}
              </Text>

              <Text style={styles.clockText}>
                {formatClock(now)}
              </Text>
            </View>

            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.heroMainRow}>
            {/* LEFT — CURRENT WEATHER */}
            <View style={styles.heroTemperatureBlock}>
              <Text style={styles.currentLabel}>
                CURRENT WEATHER
              </Text>

              <View style={styles.temperatureRow}>
                <Text
                  style={[
                    styles.temperature,
                    isSmall && {
                      fontSize: 68,
                      lineHeight: 73,
                    },
                  ]}
                >
                  {temperature != null
                    ? Math.round(temperature)
                    : '--'}
                </Text>

                <Text style={styles.degree}>°C</Text>
              </View>

              <Text style={styles.heroFeelsLabel}>
                Feels like {feelsLike != null ? `${Math.round(feelsLike)}°C` : '--'}
              </Text>
            </View>

            {/* RIGHT — PRESENT CONDITION ONLY */}
            <View style={styles.heroConditionBlock}>
              <Text style={styles.conditionSideLabel}>
                PRESENT CONDITION
              </Text>

              <View
                style={[
                  styles.heroConditionIcon,
                  {
                    backgroundColor: `${accent}14`,
                    borderColor: `${accent}42`,
                  },
                ]}
              >
                <AnimatedWeatherEmoji
                  condition={condition}
                  description={description}
                  color={accent}
                />
              </View>

              <Text
                style={styles.heroConditionText}
                numberOfLines={2}
              >
                {description}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            WEATHER DETAILS HEADER
        ================================================= */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={
                styles.sectionTitle
              }
            >
              WEATHER DETAILS
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Live atmospheric conditions
            </Text>
          </View>

          <View
            style={
              styles.sectionIndicator
            }
          >
            <View
              style={
                styles.sectionIndicatorDot
              }
            />

            <Text
              style={
                styles.sectionIndicatorText
              }
            >
              LIVE
            </Text>
          </View>
        </View>

        {/* =================================================
            DETAILS
        ================================================= */}

        <View
          style={
            styles.detailGrid
          }
        >
          <DetailCard
            icon="water-outline"
            title="Humidity"
            value={
              humidity != null
                ? `${humidity}%`
                : '--'
            }
            subtitle="Moisture"
            accent="#5ED9FF"
          />

          <DetailCard
            icon="speedometer-outline"
            title="Pressure"
            value={
              pressure != null
                ? `${pressure} hPa`
                : '--'
            }
            subtitle="Atmospheric"
            accent="#B18DFF"
          />

          <DetailCard
            icon="navigate-outline"
            title="Wind"
            value={
              windSpeed != null
                ? `${Number(
                    windSpeed
                  ).toFixed(
                    1
                  )} m/s`
                : '--'
            }
            subtitle={
              windDirection(
                windDeg
              ) ||
              'Wind speed'
            }
            accent="#63E5A6"
          />

          <DetailCard
            icon="eye-outline"
            title="Visibility"
            value={
              visibilityText
            }
            subtitle="Distance"
            accent="#80D3FF"
          />

          <DetailCard
            icon="sunny-outline"
            title="Sunrise"
            value={formatSunTime(
              weather?.sys
                ?.sunrise
            )}
            subtitle="Morning"
            accent="#FFC857"
          />

          <DetailCard
            icon="moon-outline"
            title="Sunset"
            value={formatSunTime(
              weather?.sys
                ?.sunset
            )}
            subtitle="Evening"
            accent="#E59AFF"
          />
        </View>

        {/* =================================================
            MOON PHASE
            DIRECTLY BELOW SUNSET
        ================================================= */}

        <View
          style={
            styles.moonPhaseCard
          }
        >
          <View
            style={
              styles.moonPhaseIcon
            }
          >
            <Ionicons
              name={
                moon.icon
              }
              size={34}
              color="#D9C9FF"
            />
          </View>

          <View
            style={
              styles.moonPhaseText
            }
          >
            <Text
              style={
                styles.moonPhaseSmall
              }
            >
              MOON PHASE
            </Text>

            <Text
              style={
                styles.moonPhaseName
              }
            >
              {moon.name}
            </Text>

            <Text
              style={
                styles.moonPhaseIllumination
              }
            >
              {moon.illumination}%
              illuminated
            </Text>
          </View>

          <View
            style={
              styles.moonPhaseBadge
            }
          >
            <Ionicons
              name="moon-outline"
              size={14}
              color="#D9C9FF"
            />

            <Text
              style={
                styles.moonPhaseBadgeText
              }
            >
              MOON
            </Text>
          </View>
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View
          style={
            styles.footer
          }
        >
          <View
            style={
              styles.footerLine
            }
          />

          <Text
            style={
              styles.footerText
            }
          >
            AETHERIX • INTELLIGENT WEATHER
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    /* =====================================================
       PAGE
    ===================================================== */

    page: {
      flex: 1,
      backgroundColor:
        '#031328',
    },

    backgroundLayer: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
    },

    bgGlowOne: {
      position:
        'absolute',
      width: 390,
      height: 390,
      borderRadius: 195,
      backgroundColor:
        '#123A62',
      opacity: 0.45,
      top: -230,
      right: -180,
    },

    bgGlowTwo: {
      position:
        'absolute',
      width: 330,
      height: 330,
      borderRadius: 165,
      backgroundColor:
        '#075C7A',
      opacity: 0.13,
      right: -210,
      top: 510,
    },

    bgGlowThree: {
      position:
        'absolute',
      width: 290,
      height: 290,
      borderRadius: 145,
      backgroundColor:
        '#283A77',
      opacity: 0.1,
      left: -210,
      top: 360,
    },

    bgGlowFour: {
      position:
        'absolute',
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor:
        '#07576D',
      opacity: 0.09,
      left: -150,
      bottom: 100,
    },

    /* =====================================================
       LOADING
    ===================================================== */

    loadingScreen: {
      flex: 1,
      backgroundColor:
        '#031328',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    loadingOrb: {
      width: 108,
      height: 108,
      borderRadius: 54,
      backgroundColor:
        '#092B4A',
      borderWidth: 1,
      borderColor:
        '#245D7E',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    loadingEmoji: {
      fontSize: 52,
    },

    loadingTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '900',
      letterSpacing: 2,
      marginTop: 20,
    },

    loadingText: {
      color: '#718DA6',
      fontSize: 12,
      marginTop: 7,
    },

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      minHeight: 87,
      paddingHorizontal: 18,
      flexDirection:
        'row',
      alignItems: 'center',
    },

    menuButton: {
      width: 58,
      height: 58,
      borderRadius: 19,
      backgroundColor:
        '#092A49',
      borderWidth: 1,
      borderColor:
        '#245E81',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    brand: {
      flex: 1,
      marginLeft: 12,
      marginRight: 5,
    },

    brandTitle: {
      color: '#FFFFFF',
      fontSize: 21,
      fontWeight: '900',
      letterSpacing: -0.5,
    },

    brandSubtitle: {
      color: '#7896AF',
      fontSize: 9,
      fontWeight: '600',
      marginTop: 4,
    },

    headerActions: {
      flexDirection:
        'row',
      gap: 6,
    },

    headerAction: {
      width: 65,
      height: 68,
      borderRadius: 19,
      backgroundColor:
        '#092A49',
      borderWidth: 1,
      borderColor:
        '#245E81',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    headerIconWrap: {
      position:
        'relative',
    },

    headerActionText: {
      color: '#D9EDF8',
      fontSize: 9,
      fontWeight: '900',
      marginTop: 5,
    },

    alertDot: {
      position:
        'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        '#FF5F86',
      right: -3,
      top: -2,
    },

    /* =====================================================
       SEARCH
    ===================================================== */

    searchBox: {
      height: 68,
      marginHorizontal: 18,
      marginTop: 9,
      borderRadius: 23,
      backgroundColor:
        '#092A49',
      borderWidth: 1,
      borderColor:
        '#245E81',
      flexDirection:
        'row',
      alignItems: 'center',
      paddingLeft: 17,
      paddingRight: 7,
    },

    searchInput: {
      flex: 1,
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
      marginHorizontal: 12,
      paddingVertical: 0,
    },

    locationButton: {
      width: 54,
      height: 54,
      borderRadius: 17,
      backgroundColor:
        '#103656',
      borderWidth: 1,
      borderColor:
        '#2A6789',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    searchingRow: {
      marginHorizontal: 22,
      marginTop: 8,
      flexDirection:
        'row',
      alignItems: 'center',
      gap: 7,
    },

    searchingText: {
      color: '#7591A9',
      fontSize: 10,
    },

    searchResults: {
      marginHorizontal: 18,
      marginTop: 7,
      borderRadius: 20,
      backgroundColor:
        '#071F3A',
      borderWidth: 1,
      borderColor:
        '#245D80',
      overflow: 'hidden',
    },

    cityResult: {
      minHeight: 66,
      paddingHorizontal: 13,
      flexDirection:
        'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        '#143A5A',
    },

    resultIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        '#0C3154',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    resultCity: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
    },

    resultCountry: {
      color: '#718EA7',
      fontSize: 10,
      marginTop: 3,
    },

    /* =====================================================
       CITY
    ===================================================== */

    cityHeader: {
      alignSelf:
        'center',
      flexDirection:
        'row',
      alignItems: 'center',
      marginTop: 22,
      marginBottom: 14,
      maxWidth: '92%',
    },

    cityIcon: {
      width: 47,
      height: 47,
      borderRadius: 16,
      backgroundColor:
        '#0C3154',
      borderWidth: 1,
      borderColor:
        '#246083',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 10,
    },

    cityTitle: {
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: '900',
      maxWidth: '67%',
    },

    countryText: {
      color: '#67D8FF',
      fontSize: 15,
      fontWeight: '900',
      marginLeft: 7,
    },

    /* =====================================================
       HERO
    ===================================================== */

    heroCard: {
      marginHorizontal: 18,
      borderRadius: 31,
      backgroundColor:
        '#061D37',
      borderWidth: 1,
      borderColor:
        '#286284',
      paddingHorizontal: 18,
      paddingTop: 21,
      paddingBottom: 23,
      overflow: 'hidden',
    },

    cardTopLine: {
      position:
        'absolute',
      top: 0,
      alignSelf:
        'center',
      width: '60%',
      height: 4,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
    },

    dateRow: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
    },

    dateText: {
      color: '#DCEAF7',
      fontSize: 14,
      fontWeight: '800',
    },

    clockText: {
      color: '#69D8FF',
      fontSize: 24,
      fontWeight: '900',
      marginTop: 4,
    },

    livePill: {
      height: 29,
      paddingHorizontal: 10,
      borderRadius: 15,
      backgroundColor:
        '#0A3554',
      borderWidth: 1,
      borderColor:
        '#23617F',
      flexDirection:
        'row',
      alignItems: 'center',
    },

    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        '#62E6A5',
      marginRight: 5,
    },

    liveText: {
      color: '#8DE9BB',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    heroMainRow: {
      marginTop: 36,
      flexDirection: 'row',
      alignItems: 'stretch',
      minHeight: 178,
    },

    heroTemperatureBlock: {
      flex: 1.05,
      paddingRight: 12,
      justifyContent: 'flex-start',
    },

    currentLabel: {
      color: '#64D8FF',
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1.8,
      marginBottom: 5,
    },

    temperatureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    temperature: {
      color: '#FFFFFF',
      fontSize: 78,
      lineHeight: 84,
      fontWeight: '900',
      letterSpacing: -5,
    },

    degree: {
      color: '#68D8FF',
      fontSize: 27,
      fontWeight: '900',
      marginTop: 13,
      marginLeft: 3,
    },

    heroFeelsLabel: {
      color: '#8BA8BD',
      fontSize: 13,
      fontWeight: '800',
      marginTop: 2,
    },

    heroConditionBlock: {
      flex: 0.95,
      borderLeftWidth: 1,
      borderLeftColor: '#1E526F',
      paddingLeft: 17,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
    },

    conditionSideLabel: {
      color: '#64D8FF',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.2,
      marginBottom: 9,
      textAlign: 'center',
    },

    heroConditionIcon: {
      width: 96,
      height: 96,
      borderRadius: 30,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    heroConditionText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
      textTransform: 'capitalize',
      textAlign: 'center',
      marginTop: 9,
      lineHeight: 18,
    },

    /* =====================================================
       PRESENT CONDITION
    ===================================================== */

    presentCondition: {
      marginTop: 19,
      minHeight: 69,
      borderRadius: 20,
      backgroundColor:
        '#092847',
      borderWidth: 1,
      borderColor:
        '#20506F',
      paddingHorizontal: 11,
      flexDirection:
        'row',
      alignItems: 'center',
    },

    presentConditionIcon: {
      width: 49,
      height: 49,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    presentConditionLabel: {
      color: '#65839B',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1.1,
      marginBottom: 3,
    },

    presentConditionText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
      textTransform:
        'capitalize',
    },

    /* =====================================================
       WEATHER STRIP
       OUTSIDE HERO
    ===================================================== */

    weatherStrip: {
      marginHorizontal: 18,
      marginTop: 11,
      minHeight: 93,
      borderRadius: 24,
      backgroundColor:
        '#082541',
      borderWidth: 1,
      borderColor:
        '#245B7C',
      paddingHorizontal: 11,
      flexDirection:
        'row',
      alignItems: 'center',
    },

    weatherEmojiBox: {
      width: 78,
      height: 78,
      borderRadius: 22,
      backgroundColor:
        '#0B3152',
      borderWidth: 1,
      borderColor:
        '#285D7B',
      alignItems: 'center',
      justifyContent:
        'center',
      overflow: 'hidden',
    },

    animatedEmojiContainer: {
      width: 78,
      height: 78,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    emojiGlow: {
      position:
        'absolute',
      width: 70,
      height: 70,
      borderRadius: 35,
    },

    weatherEmoji: {
      fontSize: 43,
      includeFontPadding:
        false,
    },

    rainLayer: {
      position:
        'absolute',
      width: 70,
      height: 65,
      bottom: 0,
      left: 4,
    },

    rainDrop: {
      position:
        'absolute',
      width: 3,
      height: 14,
      borderRadius: 3,
      transform: [
        {
          rotate:
            '17deg',
        },
      ],
    },

    rainDropSmall: {
      position:
        'absolute',
      width: 2,
      height: 9,
      borderRadius: 2,
      transform: [
        {
          rotate:
            '17deg',
        },
      ],
    },

    dropOne: {
      left: 15,
      top: 3,
    },

    dropTwo: {
      left: 29,
      top: 10,
    },

    dropThree: {
      left: 44,
      top: 1,
    },

    dropFour: {
      left: 22,
      top: 25,
    },

    dropFive: {
      left: 51,
      top: 22,
    },

    dropSix: {
      left: 35,
      top: 34,
    },

    snowLayer: {
      position:
        'absolute',
      bottom: 9,
    },

    snowEmoji: {
      color: '#C9F2FF',
      fontSize: 17,
      fontWeight: '900',
      letterSpacing: 4,
    },

    flashIcon: {
      position:
        'absolute',
      right: 7,
      bottom: 12,
    },

    flashEmoji: {
      fontSize: 20,
    },

    weatherStripText: {
      flex: 1,
      marginLeft: 13,
      paddingRight: 5,
    },

    weatherStripCondition: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
      textTransform:
        'capitalize',
    },

    weatherStripFeels: {
      color: '#7793AA',
      fontSize: 11,
      fontWeight: '700',
      marginTop: 7,
    },

    feelsHighlight: {
      color: '#A9C3D5',
      fontWeight: '900',
    },

    weatherStripLive: {
      height: 27,
      paddingHorizontal: 8,
      borderRadius: 14,
      backgroundColor:
        '#0B3552',
      borderWidth: 1,
      borderColor:
        '#215A76',
      flexDirection:
        'row',
      alignItems: 'center',
    },

    weatherStripDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        '#60E3A3',
      marginRight: 4,
    },

    weatherStripLiveText: {
      color: '#7EE3AA',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.7,
    },

    /* =====================================================
       SECTION
    ===================================================== */

    sectionHeader: {
      marginHorizontal: 20,
      marginTop: 23,
      marginBottom: 11,
      flexDirection:
        'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    sectionTitle: {
      color: '#D1E1ED',
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1.6,
    },

    sectionSubtitle: {
      color: '#536F87',
      fontSize: 8,
      fontWeight: '600',
      marginTop: 3,
    },

    sectionIndicator: {
      height: 27,
      paddingHorizontal: 9,
      borderRadius: 14,
      backgroundColor:
        '#092E48',
      borderWidth: 1,
      borderColor:
        '#1E5573',
      flexDirection:
        'row',
      alignItems: 'center',
    },

    sectionIndicatorDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        '#61E5A5',
      marginRight: 5,
    },

    sectionIndicatorText: {
      color: '#80DFAE',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.7,
    },

    /* =====================================================
       DETAIL GRID
    ===================================================== */

    detailGrid: {
      paddingHorizontal: 18,
      flexDirection:
        'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
      rowGap: 10,
    },

    detailCard: {
      width: '48.4%',
      minHeight: 142,
      borderRadius: 23,
      backgroundColor:
        '#082440',
      borderWidth: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 7,
      paddingVertical: 13,
    },

    detailIconBox: {
      width: 48,
      height: 48,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    detailTitle: {
      fontSize: 11,
      fontWeight: '900',
      marginTop: 9,
    },

    detailValue: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '900',
      marginTop: 5,
      textAlign: 'center',
    },

    detailSubtitle: {
      color: '#708BA4',
      fontSize: 8,
      fontWeight: '600',
      marginTop: 4,
      textAlign: 'center',
    },

    /* =====================================================
       MOON PHASE
       BELOW SUNSET
    ===================================================== */

    moonPhaseCard: {
      marginHorizontal: 18,
      marginTop: 11,
      minHeight: 92,
      borderRadius: 24,
      backgroundColor:
        '#101D43',
      borderWidth: 1,
      borderColor:
        '#514A82',
      paddingHorizontal: 11,
      flexDirection:
        'row',
      alignItems: 'center',
    },

    moonPhaseIcon: {
      width: 68,
      height: 68,
      borderRadius: 21,
      backgroundColor:
        '#171E49',
      borderWidth: 1,
      borderColor:
        '#655A96',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    moonPhaseText: {
      flex: 1,
      marginLeft: 13,
    },

    moonPhaseSmall: {
      color: '#8C82B6',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1.2,
    },

    moonPhaseName: {
      color: '#F5F0FF',
      fontSize: 17,
      fontWeight: '900',
      marginTop: 3,
    },

    moonPhaseIllumination: {
      color: '#918BAF',
      fontSize: 9,
      fontWeight: '700',
      marginTop: 3,
    },

    moonPhaseBadge: {
      height: 29,
      paddingHorizontal: 9,
      borderRadius: 15,
      backgroundColor:
        '#1B1B47',
      borderWidth: 1,
      borderColor:
        '#574E87',
      flexDirection:
        'row',
      alignItems: 'center',
    },

    moonPhaseBadgeText: {
      color: '#CEC3F2',
      fontSize: 7,
      fontWeight: '900',
      marginLeft: 4,
      letterSpacing: 0.8,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
      alignItems: 'center',
      marginTop: 23,
    },

    footerLine: {
      width: 50,
      height: 2,
      borderRadius: 1,
      backgroundColor:
        '#1B5272',
      marginBottom: 9,
    },

    footerText: {
      color: '#3E607A',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1.1,
    },
  });