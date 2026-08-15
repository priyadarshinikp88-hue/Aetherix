import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API =
  'https://aetherix-backend-eoj8.onrender.com';

type WeatherData = {
  name?: string;

  sys?: {
    country?: string;
  };

  main?: {
    temp?: number;
    humidity?: number;
  };

  wind?: {
    speed?: number;
  };

  weather?: Array<{
    main?: string;
    description?: string;
  }>;

  air?: {
    main?: {
      aqi?: number;
    };
  };
};

type WeatherAlert = {
  icon: string;
  type: 'High' | 'Medium' | 'Safe';
  title: string;
  message: string;
};

export default function AlertsScreen() {
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

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [alerts, setAlerts] =
    useState<WeatherAlert[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadWeather();
  }, [lat, lon]);

  const loadWeather = async () => {
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
        `${API}/api/weather?lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Unable to fetch weather data.'
        );
      }

      setWeather(data);

      generateAlerts(data);
    } catch (err: any) {
      console.log(
        'Alerts weather error:',
        err
      );

      setError(
        err?.message ||
          'Unable to load weather alerts.'
      );
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = (
    data: WeatherData
  ) => {
    const generated: WeatherAlert[] = [];

    const temperature =
      data.main?.temp ?? 0;

    const humidity =
      data.main?.humidity ?? 0;

    const wind =
      data.wind?.speed ?? 0;

    const condition =
      data.weather?.[0]?.main ||
      '';

    const description =
      data.weather?.[0]?.description ||
      '';

    const aqi =
      data.air?.main?.aqi;

    /* =========================
       EXTREME HEAT
    ========================= */

    if (temperature >= 38) {
      generated.push({
        icon: '🔥',
        type: 'High',
        title: 'Extreme Heat Warning',
        message:
          'Temperature is extremely high. Stay hydrated and avoid direct sunlight.',
      });
    }

    /* =========================
       RAIN
    ========================= */

    if (
      condition.toLowerCase().includes('rain') ||
      description
        .toLowerCase()
        .includes('rain')
    ) {
      generated.push({
        icon: '🌧️',
        type: 'Medium',
        title: 'Rain Alert',
        message:
          'Carry an umbrella and take care while travelling. Waterlogging may occur in some areas.',
      });
    }

    /* =========================
       THUNDERSTORM
    ========================= */

    if (
      condition
        .toLowerCase()
        .includes('thunder')
    ) {
      generated.push({
        icon: '⛈️',
        type: 'High',
        title: 'Thunderstorm Warning',
        message:
          'Stay indoors and avoid open areas until the storm passes.',
      });
    }

    /* =========================
       LOW VISIBILITY
    ========================= */

    const lowVisibility =
      [
        'fog',
        'mist',
        'haze',
      ].some((value) =>
        condition
          .toLowerCase()
          .includes(value)
      );

    if (lowVisibility) {
      generated.push({
        icon: '🌫️',
        type: 'Medium',
        title: 'Low Visibility',
        message:
          'Visibility may be reduced. Travel carefully and use appropriate lights.',
      });
    }

    /* =========================
       STRONG WIND
    ========================= */

    if (wind >= 10) {
      generated.push({
        icon: '🌬️',
        type: 'Medium',
        title: 'Strong Wind',
        message:
          'Secure loose outdoor objects and take extra care while travelling.',
      });
    }

    /* =========================
       HIGH HUMIDITY
    ========================= */

    if (humidity >= 85) {
      generated.push({
        icon: '💧',
        type: 'Medium',
        title: 'High Humidity',
        message:
          'Humidity is high. Stay hydrated and expect a muggy atmosphere.',
      });
    }

    /* =========================
       AIR QUALITY
    ========================= */

    if (
      aqi != null &&
      aqi >= 4
    ) {
      generated.push({
        icon: '🌍',
        type: 'High',
        title: 'Poor Air Quality',
        message:
          'Air quality may affect sensitive individuals. Consider reducing prolonged outdoor activity.',
      });
    }

    /* =========================
       SAFE
    ========================= */

    if (generated.length === 0) {
      generated.push({
        icon: '✅',
        type: 'Safe',
        title: 'No Active Alerts',
        message:
          'Current weather conditions are normal. Enjoy your day!',
      });
    }

    setAlerts(generated);
  };

  const getBadgeColor = (
    type: WeatherAlert['type']
  ) => {
    if (type === 'High') {
      return '#E9546B';
    }

    if (type === 'Medium') {
      return '#F6A84A';
    }

    return '#42D99A';
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View style={styles.center}>
          <View style={styles.loadingIcon}>
            <Ionicons
              name="notifications-outline"
              size={42}
              color="#65D8FF"
            />
          </View>

          <ActivityIndicator
            size="large"
            color="#65D8FF"
          />

          <Text style={styles.loadingTitle}>
            Loading Weather Alerts
          </Text>

          <Text style={styles.loadingText}>
            Analyzing current weather conditions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={styles.safe}
      >
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={55}
            color="#FF7F96"
          />

          <Text style={styles.errorTitle}>
            Alerts Unavailable
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
        {/* HEADER */}

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
              color="#65D8FF"
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              AETHERIX WEATHER
            </Text>

            <Text style={styles.title}>
              Smart Alerts
            </Text>

            <Text style={styles.subtitle}>
              {city ||
                weather?.name ||
                'Selected Location'}
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="notifications-outline"
              size={27}
              color="#65D8FF"
            />

            <View
              style={styles.headerDot}
            />
          </View>
        </View>

        {/* INTRO */}

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={27}
              color="#65D8FF"
            />
          </View>

          <View
            style={styles.introText}
          >
            <Text
              style={styles.introTitle}
            >
              AI Weather Monitoring
            </Text>

            <Text
              style={styles.introSubtitle}
            >
              Real-time conditions analyzed
              for important weather changes.
            </Text>
          </View>
        </View>

        {/* ALERTS */}

        <Text style={styles.sectionTitle}>
          WEATHER ALERTS
        </Text>

        <Text
          style={styles.sectionSubtitle}
        >
          Current conditions for{' '}
          {city ||
            weather?.name ||
            'your location'}
        </Text>

        {alerts.map(
          (alert, index) => {
            const badgeColor =
              getBadgeColor(
                alert.type
              );

            return (
              <View
                key={`${alert.title}-${index}`}
                style={[
                  styles.alertCard,
                  {
                    borderColor: `${badgeColor}45`,
                  },
                ]}
              >
                <View
                  style={styles.alertTop}
                >
                  <View
                    style={[
                      styles.alertIcon,
                      {
                        backgroundColor: `${badgeColor}15`,
                        borderColor: `${badgeColor}35`,
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.alertEmoji
                      }
                    >
                      {alert.icon}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: `${badgeColor}18`,
                        borderColor: `${badgeColor}40`,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.badgeDot,
                        {
                          backgroundColor:
                            badgeColor,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color:
                            badgeColor,
                        },
                      ]}
                    >
                      {alert.type.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={styles.alertTitle}
                >
                  {alert.title}
                </Text>

                <Text
                  style={styles.alertMessage}
                >
                  {alert.message}
                </Text>

                {/* WEATHER DETAILS */}

                <View
                  style={styles.details}
                >
                  <View
                    style={styles.detail}
                  >
                    <Ionicons
                      name="thermometer-outline"
                      size={19}
                      color="#65D8FF"
                    />

                    <View>
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Temperature
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {weather?.main
                          ?.temp != null
                          ? `${Math.round(
                              weather.main.temp
                            )}°C`
                          : '--'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.detail}
                  >
                    <Ionicons
                      name="water-outline"
                      size={19}
                      color="#65D8FF"
                    />

                    <View>
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Humidity
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {weather?.main
                          ?.humidity != null
                          ? `${weather.main.humidity}%`
                          : '--'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.detail}
                  >
                    <Ionicons
                      name="navigate-outline"
                      size={19}
                      color="#A78BFA"
                    />

                    <View>
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Wind
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {weather?.wind
                          ?.speed != null
                          ? `${weather.wind.speed} m/s`
                          : '--'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.detail}
                  >
                    <Ionicons
                      name="cloud-outline"
                      size={19}
                      color="#63E5A6"
                    />

                    <View>
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        Condition
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                        numberOfLines={1}
                      >
                        {weather?.weather?.[0]
                          ?.description ||
                          '--'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={styles.footer}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color="#68859E"
                  />

                  <Text
                    style={
                      styles.footerText
                    }
                  >
                    Updated{' '}
                    {new Date().toLocaleTimeString(
                      'en-IN',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </Text>
                </View>
              </View>
            );
          }
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#031328',
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
    marginBottom: 24,
  },

  backCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#092A49',
    borderWidth: 1,
    borderColor: '#245E81',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: '#65D8FF',
    fontSize: 9,
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
    color: '#7896AF',
    fontSize: 12,
    marginTop: 3,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#092A49',
    borderWidth: 1,
    borderColor: '#245E81',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerDot: {
    position: 'absolute',
    right: 10,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF5F86',
  },

  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#061D37',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#245E81',
    padding: 16,
    marginBottom: 26,
  },

  introIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#092F50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  introText: {
    flex: 1,
  },

  introTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  introSubtitle: {
    color: '#7896AF',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  sectionTitle: {
    color: '#65D8FF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  sectionSubtitle: {
    color: '#718DA6',
    fontSize: 11,
    marginTop: 5,
    marginBottom: 15,
  },

  alertCard: {
    backgroundColor: '#061D37',
    borderRadius: 25,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },

  alertTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  alertIcon: {
    width: 65,
    height: 65,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  alertEmoji: {
    fontSize: 35,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  alertTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 17,
  },

  alertMessage: {
    color: '#9AB1C7',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  details: {
    marginTop: 17,
    gap: 8,
  },

  detail: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  detailLabel: {
    color: '#68859E',
    fontSize: 9,
    marginLeft: 10,
  },

  detailValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 10,
    marginTop: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },

  footerText: {
    color: '#68859E',
    fontSize: 9,
    marginLeft: 6,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingIcon: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: '#092A49',
    borderWidth: 1,
    borderColor: '#245E81',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 17,
  },

  loadingText: {
    color: '#7896AF',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },

  errorTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 17,
  },

  errorText: {
    color: '#7896AF',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 23,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#65D8FF',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 15,
  },

  backText: {
    color: '#041327',
    fontWeight: '900',
  },
});