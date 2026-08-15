import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoginUI() {
  // ==========================================
  // ANIMATIONS
  // ==========================================

  const pageFade = useRef(new Animated.Value(0)).current;

  const heroFloat = useRef(new Animated.Value(0)).current;

  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  // ==========================================
  // ANIMATION SETUP
  // ==========================================

  useEffect(() => {
    // PAGE FADE
    Animated.timing(pageFade, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    // HERO FLOAT
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: -5,
          duration: 2200,
          useNativeDriver: true,
        }),

        Animated.timing(heroFloat, {
          toValue: 5,
          duration: 2200,
          useNativeDriver: true,
        }),

        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // CARD ANIMATION
    const animateCard = (
      value: Animated.Value,
      delay: number
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(value, {
            toValue: -3,
            duration: 1800,
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 3,
            duration: 1800,
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateCard(card1Anim, 0);
    animateCard(card2Anim, 400);
    animateCard(card3Anim, 800);
  }, []);

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <View style={styles.backgroundGlow} />

      <View style={styles.blueGlow} />

      <View style={styles.bottomGlow} />


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: pageFade,
          },
        ]}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <View style={styles.header}>

          <Text style={styles.headerTitle}>
            AETHERIX
          </Text>

          <Text style={styles.headerSubtitle}>
            WEATHER INTELLIGENCE
          </Text>

        </View>


        {/* ==========================================
            HERO LOGO
        ========================================== */}

        <Animated.View
          style={[
            styles.heroLogoContainer,
            {
              transform: [
                {
                  translateY: heroFloat,
                },
              ],
            },
          ]}
        >

          <Image
            source={require('../assets/hero-logo.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />

        </Animated.View>


        {/* ==========================================
            HERO TEXT
        ========================================== */}

        <View style={[styles.hero, { marginTop: 25 }]}>

          <Text style={styles.heroTitle}>
            Understand the weather
          </Text>

          <Text style={styles.heroBlueTitle}>
            Make smarter decisions
          </Text>

          <Text style={styles.heroDescription}>
            Real-time weather intelligence, accurate forecasts
            and intelligent alerts — all in one powerful platform.
          </Text>

        </View>


        {/* ==========================================
            EXPLORE BUTTON
        ========================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.exploreButton,
            pressed && styles.explorePressed,
          ]}
          onPress={() => router.push('/login')}
        >

          <Text style={styles.exploreText}>
            Explore Weather Intelligence
          </Text>

          <Ionicons
            name="arrow-forward"
            size={21}
            color="#FFFFFF"
          />

        </Pressable>


        {/* ==========================================
            SMALL INFO
        ========================================== */}

        <View style={styles.infoRow}>

          <Ionicons
            name="checkmark-circle-outline"
            size={16}
            color="#299BFF"
          />

          <Text style={styles.infoText}>
            No complicated setup
          </Text>

          <Text style={styles.dot}>
            •
          </Text>

          <Text style={styles.infoText}>
            Real-time insights
          </Text>

        </View>


        {/* ==========================================
            FEATURE CARDS
        ========================================== */}

        <View style={styles.cardsRow}>

          {/* CARD 1 */}

          <Animated.View
            style={[
              styles.featureCard,
              {
                transform: [
                  {
                    translateY: card1Anim,
                  },
                ],
              },
            ]}
          >

            <View style={styles.iconCircle}>

              <Ionicons
                name="radio-outline"
                size={27}
                color="#299BFF"
              />

            </View>

            <Text style={styles.featureTitle}>
              Real-Time Data
            </Text>

            <Text style={styles.featureDescription}>
              Live weather conditions from trusted sources.
            </Text>

          </Animated.View>


          {/* CARD 2 */}

          <Animated.View
            style={[
              styles.featureCard,
              styles.middleCard,
              {
                transform: [
                  {
                    translateY: card2Anim,
                  },
                ],
              },
            ]}
          >

            <View style={styles.iconCircle}>

              <Ionicons
                name="analytics-outline"
                size={27}
                color="#299BFF"
              />

            </View>

            <Text style={styles.featureTitle}>
              Intelligent Forecasts
            </Text>

            <Text style={styles.featureDescription}>
              AI-powered forecasting for smarter planning.
            </Text>

          </Animated.View>


          {/* CARD 3 */}

          <Animated.View
            style={[
              styles.featureCard,
              {
                transform: [
                  {
                    translateY: card3Anim,
                  },
                ],
              },
            ]}
          >

            <View style={styles.iconCircle}>

              <Ionicons
                name="thunderstorm-outline"
                size={27}
                color="#299BFF"
              />

            </View>

            <Text style={styles.featureTitle}>
              Smart Alerts
            </Text>

            <Text style={styles.featureDescription}>
              Instant notifications for severe weather.
            </Text>

          </Animated.View>

        </View>


        {/* ==========================================
            SECURITY
        ========================================== */}

        <View style={styles.securityBox}>

          {/* SECURE */}

          <View style={styles.securityItem}>

            <View style={styles.securityIcon}>

              <Ionicons
                name="shield-checkmark-outline"
                size={25}
                color="#299BFF"
              />

            </View>

            <Text style={styles.securityTitle}>
              Secure
            </Text>

            <Text style={styles.securityDescription}>
              Your data is protected
            </Text>

          </View>


          <View style={styles.divider} />


          {/* RELIABLE */}

          <View style={styles.securityItem}>

            <View style={styles.securityIcon}>

              <Ionicons
                name="checkmark-circle-outline"
                size={25}
                color="#299BFF"
              />

            </View>

            <Text style={styles.securityTitle}>
              Reliable
            </Text>

            <Text style={styles.securityDescription}>
              Trusted weather intelligence
            </Text>

          </View>


          <View style={styles.divider} />


          {/* ACCURATE */}

          <View style={styles.securityItem}>

            <View style={styles.securityIcon}>

              <Ionicons
                name="locate-outline"
                size={25}
                color="#299BFF"
              />

            </View>

            <Text style={styles.securityTitle}>
              Accurate
            </Text>

            <Text style={styles.securityDescription}>
              Precise data and insights
            </Text>

          </View>

        </View>

      </Animated.View>

    </SafeAreaView>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  // ==========================================
  // MAIN
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: '#010712',
  },

  content: {
    flex: 1,

    paddingHorizontal: 18,

    paddingTop: 60,

    paddingBottom: 5,

    alignItems: 'center',
  },


  // ==========================================
  // BACKGROUND
  // ==========================================

  backgroundGlow: {
    position: 'absolute',

    width: width * 1.45,
    height: height * 0.52,

    top: 120,
    left: -width * 0.22,

    borderRadius: width,

    backgroundColor: 'rgba(2,25,58,0.30)',
  },

  blueGlow: {
    position: 'absolute',

    width: width * 1.35,
    height: 300,

    top: 160,
    left: -width * 0.17,

    borderRadius: 300,

    backgroundColor: 'rgba(0,85,180,0.08)',
  },

  bottomGlow: {
    position: 'absolute',

    width: width * 1.3,
    height: 150,

    bottom: -90,
    left: -width * 0.15,

    borderRadius: 200,

    backgroundColor: 'rgba(0,95,220,0.12)',
  },


  // ==========================================
  // HEADER
  // ==========================================

  header: {
    width: '100%',

    height: 62,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 5,

    marginBottom: 2,
  },
   
  headerTitle: {
  color: '#FFFFFF',
  fontSize: 30,
  fontWeight: '900',
  letterSpacing: 3.5,
},

  headerSubtitle: {
    color: '#299BFF',

    fontSize: 7.5,

    fontWeight: '700',

    letterSpacing: 1.5,

    marginTop: 2,
  },


  // ==========================================
  // HERO LOGO
  // ==========================================

  heroLogoContainer: {
    width: '100%',

    height: 185,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: -2,
  },

  heroLogo: {
    width: width * 0.78,

    height: 185,
  },


  // ==========================================
  // HERO TEXT
  // ==========================================

  hero: {
    width: '100%',

    alignItems: 'center',

    marginTop: -3,
  },

  heroTitle: {
    color: '#FFFFFF',

    fontSize: width < 390 ? 24 : 27,

    lineHeight: width < 390 ? 29 : 32,

    fontWeight: '800',

    textAlign: 'center',
  },

  heroBlueTitle: {
    color: '#1688FF',

    fontSize: width < 390 ? 24 : 27,

    lineHeight: width < 390 ? 29 : 32,

    fontWeight: '800',

    textAlign: 'center',
  },

  heroDescription: {
    color: '#9AAFC4',

    fontSize: 10,

    lineHeight: 14,

    textAlign: 'center',

    maxWidth: 330,

    marginTop: 5,
  },


  // ==========================================
  // EXPLORE BUTTON
  // ==========================================

  exploreButton: {
    width: '76%',

    height: 48,

    marginTop: 25,

  marginBottom: 20,

   borderRadius: 17,

    backgroundColor: '#0878F5',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 9,

    shadowColor: '#1688FF',

    shadowOpacity: 0.75,

    shadowRadius: 14,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 9,
  },

  explorePressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  exploreText: {
    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: '800',
  },


  // ==========================================
  // INFO
  // ==========================================

  infoRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 3,

    height: 20,
  },

  infoText: {
    color: '#91A6BA',

    fontSize: 9,

    marginLeft: 4,
  },

  dot: {
    color: '#299BFF',

    fontSize: 11,

    marginHorizontal: 6,
  },


  // ==========================================
  // FEATURE CARDS
  // ==========================================

  cardsRow: {
    width: '100%',

    flexDirection: 'row',

    gap: 7,

    marginTop: 5,
  },

  featureCard: {
    flex: 1,

    height: 136,

    borderRadius: 18,

    borderWidth: 1,

    borderColor: '#16578F',

    backgroundColor: 'rgba(3,20,40,0.94)',

    alignItems: 'center',

    paddingHorizontal: 7,

    paddingVertical: 10,

    shadowColor: '#1688FF',

    shadowOpacity: 0.30,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 6,
  },

  middleCard: {
    borderColor: '#299BFF',

    backgroundColor: 'rgba(5,27,55,0.97)',

    shadowOpacity: 0.55,

    shadowRadius: 15,

    elevation: 9,
  },

  iconCircle: {
    width: 49,

    height: 49,

    borderRadius: 25,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: '#1688FF',

    backgroundColor: 'rgba(5,55,105,0.45)',

    marginBottom: 6,
  },

  featureTitle: {
    color: '#FFFFFF',

    fontSize: 11,

    fontWeight: '800',

    textAlign: 'center',

    marginBottom: 4,
  },

  featureDescription: {
    color: '#8EA5BB',

    fontSize: 8.2,

    lineHeight: 12,

    textAlign: 'center',
  },


  // ==========================================
  // SECURITY
  // ==========================================

  securityBox: {
    width: '100%',

    height: 82,

    marginTop: 15,

    borderRadius: 18,

    borderWidth: 1,

    borderColor: '#174D7E',

    backgroundColor: 'rgba(5,22,42,0.96)',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-evenly',

    paddingHorizontal: 3,
  },

  securityItem: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',
  },

  securityIcon: {
    width: 32,

    height: 32,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: 'rgba(5,60,110,0.40)',

    marginBottom: 2,
  },

  securityTitle: {
    color: '#FFFFFF',

    fontSize: 10,

    fontWeight: '800',

    marginBottom: 1,
  },

  securityDescription: {
    color: '#7F96AE',

    fontSize: 7.2,

    lineHeight: 9,

    textAlign: 'center',

    paddingHorizontal: 2,
  },

  divider: {
    width: 1,

    height: 48,

    backgroundColor: '#19466B',
  },

});