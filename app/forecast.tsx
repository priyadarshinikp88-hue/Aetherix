import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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

type ForecastItem = {
  dt: number;
  main?: {
    temp?: number;
    humidity?: number;
  };
  weather?: {
    main?: string;
    description?: string;
    icon?: string;
  }[];
  wind?: {
    speed?: number;
  };
};

type DayForecast = {
  date: string;
  temp: number;
  min: number;
  max: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
};

export default function ForecastScreen() {
  const router = useRouter();

  const { lat, lon, city } = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    city?: string;
  }>();

  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Unable to fetch forecast.'
        );
      }

      const list: ForecastItem[] = Array.isArray(data?.list)
        ? data.list
        : [];

      if (!list.length) {
        throw new Error('No forecast data available.');
      }

      const grouped: Record<string, ForecastItem[]> = {};

      list.forEach((item) => {
        const date = new Date(item.dt * 1000);

        const key = date.toLocaleDateString('en-CA');

        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push(item);
      });

      const daily: DayForecast[] = Object.entries(grouped)
        .slice(0, 5)
        .map(([date, items]) => {
          const temps = items.map(
            (item) => item.main?.temp ?? 0
          );

          const humidity = items.map(
            (item) => item.main?.humidity ?? 0
          );

          const wind = items.map(
            (item) => item.wind?.speed ?? 0
          );

          // Pick forecast closest to noon
          const representative = items.reduce(
            (closest, current) => {
              const currentHour = new Date(
                current.dt * 1000
              ).getHours();

              const closestHour = new Date(
                closest.dt * 1000
              ).getHours();

              return Math.abs(currentHour - 12) <
                Math.abs(closestHour - 12)
                ? current
                : closest;
            }
          );

          const weather =
            representative.weather?.[0];

          return {
            date,

            temp:
              temps.reduce(
                (sum, value) => sum + value,
                0
              ) / temps.length,

            min: Math.min(...temps),

            max: Math.max(...temps),

            humidity:
              humidity.reduce(
                (sum, value) => sum + value,
                0
              ) / humidity.length,

            wind:
              wind.reduce(
                (sum, value) => sum + value,
                0
              ) / wind.length,

            description:
              weather?.description ||
              'Weather unavailable',

            icon:
              weather?.icon ||
              '01d',
          };
        });

      setForecast(daily);
    } catch (err: any) {
      console.error('Forecast error:', err);

      setError(
        err?.message ||
          'Unable to connect to weather server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (
    dateString: string,
    index: number
  ) => {
    if (index === 0) {
      return 'Today';
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
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

          <Text style={styles.loadingTitle}>
            Loading Forecast
          </Text>

          <Text style={styles.loadingText}>
            Fetching the latest weather predictions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={55}
            color="#FF8A8A"
          />

          <Text style={styles.errorTitle}>
            Forecast Unavailable
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#041327"
            />

            <Text style={styles.backText}>
              Back to Dashboard
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backCircle}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={25}
              color="#62D0FF"
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              AETHERIX WEATHER
            </Text>

            <Text style={styles.title}>
              5-Day Forecast
            </Text>

            <Text style={styles.subtitle}>
              {city || 'Selected Location'}
            </Text>
          </View>
        </View>

        {/* FORECAST CARDS */}

        <Text style={styles.sectionTitle}>
          DAILY FORECAST
        </Text>

        <Text style={styles.sectionSubtitle}>
          Detailed weather predictions
        </Text>

        {forecast.map((day, index) => (
          <View
            key={day.date}
            style={styles.card}
          >
            {/* DAY */}

            <View style={styles.cardTop}>
              <View>
                <Text style={styles.day}>
                  {getDayName(day.date, index)}
                </Text>

                <Text style={styles.date}>
                  {getDate(day.date)}
                </Text>
              </View>

              <View style={styles.iconBox}>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png`,
                  }}
                  style={styles.weatherIcon}
                />
              </View>
            </View>

            {/* TEMPERATURE */}

            <View style={styles.weatherMain}>
              <View>
                <Text style={styles.temperature}>
                  {Math.round(day.temp)}°
                </Text>

                <Text style={styles.description}>
                  {day.description}
                </Text>
              </View>

              <View style={styles.highLow}>
                <Text style={styles.high}>
                  ↑ {Math.round(day.max)}°C
                </Text>

                <Text style={styles.low}>
                  ↓ {Math.round(day.min)}°C
                </Text>
              </View>
            </View>

            {/* DETAILS */}

            <View style={styles.details}>
              <View style={styles.detail}>
                <Ionicons
                  name="water-outline"
                  size={22}
                  color="#62D0FF"
                />

                <View>
                  <Text style={styles.detailLabel}>
                    Humidity
                  </Text>

                  <Text style={styles.detailValue}>
                    {Math.round(day.humidity)}%
                  </Text>
                </View>
              </View>

              <View style={styles.detail}>
                <Ionicons
                  name="navigate-outline"
                  size={22}
                  color="#A78BFA"
                />

                <View>
                  <Text style={styles.detailLabel}>
                    Wind
                  </Text>

                  <Text style={styles.detailValue}>
                    {day.wind.toFixed(1)} m/s
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  backCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#0B3153',
    borderWidth: 1,
    borderColor: 'rgba(98,208,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },

  subtitle: {
    color: '#8FAAC5',
    fontSize: 13,
    marginTop: 3,
  },

  sectionTitle: {
    color: '#62D0FF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },

  sectionSubtitle: {
    color: '#7794B0',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#08294A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(98,208,255,0.24)',
    padding: 18,
    marginBottom: 16,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  day: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  date: {
    color: '#7E9AB5',
    fontSize: 12,
    marginTop: 5,
  },

  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(98,208,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(98,208,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  weatherIcon: {
    width: 58,
    height: 58,
  },

  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },

  temperature: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
  },

  description: {
    color: '#62D0FF',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
    maxWidth: 190,
  },

  highLow: {
    alignItems: 'flex-end',
    gap: 7,
  },

  high: {
    color: '#FDBA74',
    fontSize: 14,
    fontWeight: '800',
  },

  low: {
    color: '#7DD3FC',
    fontSize: 14,
    fontWeight: '800',
  },

  details: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  detail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: 15,
    padding: 12,
  },

  detailLabel: {
    color: '#7895AF',
    fontSize: 10,
    marginLeft: 9,
  },

  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 9,
    marginTop: 2,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: '#08294A',
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
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 15,
  },

  backText: {
    color: '#041327',
    fontWeight: '900',
  },
});