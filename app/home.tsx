import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const isSmall = width < 400;

export default function HomeScreen() {
  /* =====================================================
     ANIMATION VALUES
  ===================================================== */

  const headerAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const logoFloat = useRef(
    new Animated.Value(0)
  ).current;

  const logoScale = useRef(
    new Animated.Value(1)
  ).current;

  const alertAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const aboutAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const profileAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const heroAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const insightAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const aiAnimation = useRef(
    new Animated.Value(0)
  ).current;


  /* =====================================================
     START ANIMATIONS
  ===================================================== */

  useEffect(() => {

    /* HEADER ENTER */

    Animated.spring(headerAnimation, {
      toValue: 1,
      friction: 7,
      tension: 45,
      useNativeDriver: true,
    }).start();


    /* LOGO FLOAT */

    Animated.loop(
      Animated.sequence([

        Animated.timing(logoFloat, {
          toValue: -5,
          duration: 1800,
          useNativeDriver: true,
        }),

        Animated.timing(logoFloat, {
          toValue: 3,
          duration: 1800,
          useNativeDriver: true,
        }),

        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),

      ])
    ).start();


    /* LOGO SCALE / GLOW EFFECT */

    Animated.loop(
      Animated.sequence([

        Animated.timing(logoScale, {
          toValue: 1.035,
          duration: 1800,
          useNativeDriver: true,
        }),

        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),

      ])
    ).start();


    /* NAVIGATION ENTRANCE */

    Animated.stagger(110, [

      Animated.spring(alertAnimation, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.spring(aboutAnimation, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.spring(profileAnimation, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),

    ]).start();


    /* HERO */

    Animated.timing(heroAnimation, {
      toValue: 1,
      duration: 750,
      delay: 350,
      useNativeDriver: true,
    }).start();


    /* INSIGHT */

    Animated.timing(insightAnimation, {
      toValue: 1,
      duration: 750,
      delay: 500,
      useNativeDriver: true,
    }).start();


    /* AI */

    Animated.timing(aiAnimation, {
      toValue: 1,
      duration: 750,
      delay: 650,
      useNativeDriver: true,
    }).start();

  }, []);


  /* =====================================================
     NAVIGATION ANIMATION HELPER
  ===================================================== */

  const navigationStyle = (
    animation: Animated.Value
  ) => ({
    opacity: animation,

    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  });


  /* =====================================================
     PRESS ANIMATION
  ===================================================== */

  const createPressAnimation = () => {
    const scale = new Animated.Value(1);

    const pressIn = () => {
      Animated.spring(scale, {
        toValue: 0.92,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    return {
      scale,
      pressIn,
      pressOut,
    };
  };

  const alertPress = createPressAnimation();
  const aboutPress = createPressAnimation();
  const profilePress = createPressAnimation();


  /* =====================================================
     UI
  ===================================================== */

  return (
    <View style={styles.page}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnimation,

              transform: [
                {
                  translateY:
                    headerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-35, 0],
                    }),
                },
              ],
            },
          ]}
        >

          {/* ================= LOGO ================= */}

          <Animated.View
            style={[
              styles.logoSection,
              {
                transform: [
                  {
                    translateY: logoFloat,
                  },
                  {
                    scale: logoScale,
                  },
                ],
              },
            ]}
          >

            <View style={styles.logoGlow} />

            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />

          </Animated.View>


          {/* ================= NAVIGATION ================= */}

          <View style={styles.navigation}>

            {/* ALERTS */}

            <Animated.View
              style={[
                styles.navAnimated,
                navigationStyle(alertAnimation),
                {
                  transform: [
                    ...navigationStyle(alertAnimation)
                      .transform,
                    {
                      scale: alertPress.scale,
                    },
                  ],
                },
              ]}
            >

              <Pressable
                style={styles.navItem}
                onPressIn={alertPress.pressIn}
                onPressOut={alertPress.pressOut}
                onPress={() =>
                  Alert.alert(
                    'Weather Alerts',
                    'Weather notifications will be connected next.'
                  )
                }
              >

                <View style={styles.iconCircle}>
                  <Ionicons
                    name="notifications-outline"
                    size={21}
                    color="#ffffff"
                  />
                </View>

                <Text style={styles.navText}>
                  Alerts
                </Text>

              </Pressable>

            </Animated.View>


            {/* ABOUT */}

            <Animated.View
              style={[
                styles.navAnimated,
                navigationStyle(aboutAnimation),
                {
                  transform: [
                    ...navigationStyle(aboutAnimation)
                      .transform,
                    {
                      scale: aboutPress.scale,
                    },
                  ],
                },
              ]}
            >

              <Pressable
                style={styles.navItem}
                onPressIn={aboutPress.pressIn}
                onPressOut={aboutPress.pressOut}
                onPress={() =>
                  router.push('/about')
                }
              >

                <View style={styles.iconCircle}>
                 <Ionicons
  name="sparkles-outline"
  size={21}
  color="#ffffff"
/>
                </View>

                <Text style={styles.navText}>
                  About
                </Text>

              </Pressable>

            </Animated.View>


            {/* PROFILE */}

            <Animated.View
              style={[
                styles.navAnimated,
                navigationStyle(profileAnimation),
                {
                  transform: [
                    ...navigationStyle(profileAnimation)
                      .transform,
                    {
                      scale: profilePress.scale,
                    },
                  ],
                },
              ]}
            >

              <Pressable
                style={styles.profileItem}
                onPressIn={profilePress.pressIn}
                onPressOut={profilePress.pressOut}
                onPress={() =>
                  Alert.alert(
                    'Profile',
                    'Profile page will be added next.'
                  )
                }
              >

                <View style={styles.profileIcon}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#ffffff"
                  />
                </View>

                <Text style={styles.profileText}>
                  Profile
                </Text>

              </Pressable>

            </Animated.View>

          </View>

        </Animated.View>


        {/* =================================================
            HERO
        ================================================= */}

        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnimation,

              transform: [
                {
                  translateY:
                    heroAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [35, 0],
                    }),
                },
              ],
            },
          ]}
        >

          <View style={styles.heroContent}>

            <Text style={styles.heroTitle}>
              Weather Intelligence{'\n'}
              Across Industries
            </Text>


            <Text style={styles.heroDescription}>
              Turning weather data into smarter decisions
            </Text>

   <Pressable
  style={({ pressed }) => [
    styles.exploreButton,
    pressed && styles.pressed,
  ]}
  onPress={() => router.push('/exploreservices')}
>
  <Text style={styles.exploreButtonText}>
    Explore Services
  </Text>

  <Ionicons
    name="arrow-forward"
    size={21}
    color="#ffffff"
  />
</Pressable>
          </View>

        </Animated.View>


        {/* =================================================
            SMARTER DECISIONS
        ================================================= */}

        <Animated.View
          style={[
            styles.insightSection,
            {
              opacity: insightAnimation,

              transform: [
                {
                  translateY:
                    insightAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                },
              ],
            },
          ]}
        >

          <View style={styles.insightLine} />

          <Text style={styles.insightTitle}>
            Smarter decisions
          </Text>

          <Text style={styles.insightTitle}>
            Better outcomes
          </Text>

        </Animated.View>


        {/* =================================================
            FEATURE CARDS
        ================================================= */}

        <View style={styles.featureRow}>

          <View style={styles.featureCard}>

            <View style={styles.featureIcon}>
              <Ionicons
                name="analytics-outline"
                size={24}
                color="#54caff"
              />
            </View>

            <Text style={styles.featureTitle}>
              Reliable Data
            </Text>

            <Text style={styles.featureText}>
              Accurate weather intelligence for better planning
            </Text>

          </View>


          <View style={styles.featureCard}>

            <View style={styles.featureIcon}>
              <Ionicons
                name="warning-outline"
                size={24}
                color="#54caff"
              />
            </View>

            <Text style={styles.featureTitle}>
              Smart Alerts
            </Text>

            <Text style={styles.featureText}>
              Get notified when important weather conditions
              require attention
            </Text>

          </View>

        </View>


        {/* =================================================
            AETHERIX AI
        ================================================= */}

        <Animated.View
          style={[
            styles.aiSection,
            {
              opacity: aiAnimation,

              transform: [
                {
                  translateY:
                    aiAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [35, 0],
                    }),
                },
              ],
            },
          ]}
        >

          <View style={styles.assistantCard}>

            {/* AI ICON */}

            <View style={styles.aiOuterCircle}>

              <View style={styles.aiInnerCircle}>

                <Ionicons
                  name="sparkles"
                  size={29}
                  color="#ffffff"
                />

              </View>

            </View>


            <Text style={styles.aiTitle}>
              Aetherix AI
            </Text>


            <Text style={styles.aiDescription}>
              Ask questions , Understand weather
              {'\n'}
              Make smarter decisions
            </Text>


            {/* INPUT */}

            <View style={styles.inputContainer}>

              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#7899b8"
              />

              <TextInput
                style={styles.aiInput}
                placeholder="Ask Aetherix AI..."
                placeholderTextColor="#7899b8"
              />

            </View>


            {/* ASK BUTTON */}

            <Pressable
              style={({ pressed }) => [
                styles.askButton,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                Alert.alert(
                  'Aetherix AI',
                  'AI Assistant will be connected next.'
                )
              }
            >

              <Ionicons
                name="sparkles-outline"
                size={19}
                color="#ffffff"
              />

              <Text style={styles.askButtonText}>
                Ask AI
              </Text>

            </Pressable>

          </View>

        </Animated.View>


        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer}>

          <Text style={styles.footerTitle}>
            Aetherix Technologies
          </Text>

          <Text style={styles.footerTagline}>
            Weather intelligence for a smarter future
          </Text>

          <Text style={styles.footerText}>
            © 2026 Aetherix Technologies
          </Text>

          <Text style={styles.footerText}>
            All Rights Reserved
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =====================================================
     PAGE
  ===================================================== */

  page: {
    flex: 1,
    backgroundColor: '#061320',
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },


  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    width: '100%',

    minHeight: 165,

    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 8,

    backgroundColor: '#061420',

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',

    flexDirection: 'row',
    alignItems: 'center',
  },

/* =====================================================
     LOGO
  ===================================================== */

   logoSection: {
  width: isSmall ? 115 : 125,
  height: isSmall ? 115 : 125,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},

logo: {
  width: isSmall ? 115 : 125,
  height: isSmall ? 115 : 125,
},

logoGlow: {
  position: 'absolute',
  width: isSmall ? 108 : 118,
  height: isSmall ? 108 : 118,
  borderRadius: 60,
  backgroundColor: 'rgba(22,135,255,0.13)',
},

/* =====================================================
     NAVIGATION
  ===================================================== */

  navigation: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-around',

    marginLeft: 4,
  },

  navAnimated: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navItem: {
    width: isSmall ? 55 : 62,
    minHeight: 72,

    paddingVertical: 7,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  iconCircle: {
    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.10)',
  },

  navText: {
    color: '#d9e8f5',

    fontSize: isSmall ? 9 : 10.5,

    fontWeight: '600',

    textAlign: 'center',
  },


  /* =====================================================
     PROFILE
  ===================================================== */
  profileItem: {
  width: isSmall ? 55 : 62,
  minHeight: 72,

  paddingVertical: 7,
  paddingHorizontal: 4,

  borderRadius: 14,

  backgroundColor: 'transparent',

  alignItems: 'center',
  justifyContent: 'center',

  gap: 5,
},

 profileIcon: {
  width: 34,
  height: 34,

  borderRadius: 17,

  alignItems: 'center',
  justifyContent: 'center',

  backgroundColor: 'rgba(22,135,255,0.10)',
},

  profileText: {
    color: '#ffffff',

    fontSize: isSmall ? 9 : 10.5,

    fontWeight: '700',

    textAlign: 'center',
  },

  /* =====================================================
     HERO
  ===================================================== */

  hero: {
    width: '100%',

    paddingHorizontal: isSmall ? 20 : 28,

    paddingTop: 30,
    paddingBottom: 20,

    alignItems: 'center',
  },

  heroContent: {
    width: '100%',

    maxWidth: 700,

    alignItems: 'center',
  },

  heroTitle: {
    color: '#ffffff',

    fontSize: isSmall ? 34 : 44,

    lineHeight: isSmall ? 43 : 53,

    fontWeight: '800',

    textAlign: 'center',

    letterSpacing: -0.5,
  },

  heroDescription: {
    marginTop: 18,

    maxWidth: 620,

    color: '#a9c2d9',

    fontSize: isSmall ? 15 : 17,

    lineHeight: 26,

    textAlign: 'center',
  },


  /* =====================================================
     EXPLORE BUTTON
  ===================================================== */

  exploreButton: {
    marginTop: 27,

    minWidth: isSmall ? 250 : 285,

    minHeight: 56,

    paddingHorizontal: 25,

    borderRadius: 16,

    backgroundColor: '#1687ff',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,

    shadowColor: '#1687ff',
    shadowOpacity: 0.30,
    shadowRadius: 12,

    elevation: 6,
  },

  exploreButtonText: {
    color: '#ffffff',

    fontSize: isSmall ? 16 : 18,

    fontWeight: '700',
  },

  pressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },


  /* =====================================================
     INSIGHT
  ===================================================== */

  insightSection: {
    paddingHorizontal: isSmall ? 24 : 35,

    paddingTop: 25,
    paddingBottom: 25,

    alignItems: 'center',
  },

  insightLine: {
    width: 45,
    height: 3,

    borderRadius: 3,

    backgroundColor: '#1687ff',

    marginBottom: 17,
  },

  insightTitle: {
    color: '#1687ff',

    fontSize: isSmall ? 25 : 29,

    lineHeight: 34,

    fontWeight: '800',

    textAlign: 'center',
  },

  /* =====================================================
     FEATURE CARDS
  ===================================================== */

  featureRow: {
    width: '100%',

    paddingHorizontal: isSmall ? 18 : 30,

    flexDirection: 'row',

    justifyContent: 'space-between',

    gap: 12,

    marginTop: 12,
    marginBottom: 28,
  },

  featureCard: {
    flex: 1,

    minHeight: 155,

    padding: 17,

    borderRadius: 18,

    backgroundColor: '#0b2038',

    borderWidth: 1,

    borderColor: 'rgba(22,135,255,0.22)',
  },

  featureIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.12)',

    marginBottom: 12,
  },

  featureTitle: {
    color: '#ffffff',

    fontSize: 15,

    fontWeight: '700',
  },

  featureText: {
    color: '#8fa9c1',

    fontSize: 11.5,

    lineHeight: 18,

    marginTop: 7,
  },


  /* =====================================================
     AI SECTION
  ===================================================== */

  aiSection: {
    paddingHorizontal: isSmall ? 18 : 30,

    paddingBottom: 40,
  },

  assistantCard: {
    width: '100%',

    padding: isSmall ? 24 : 32,

    borderRadius: 26,

    backgroundColor: '#0e213a',

    borderWidth: 1,

    borderColor: 'rgba(22,135,255,0.28)',

    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 15,

    elevation: 4,
  },


  /* =====================================================
     AI ICON
  ===================================================== */

  aiOuterCircle: {
    width: 88,
    height: 88,

    borderRadius: 44,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.10)',

    borderWidth: 1,

    borderColor: 'rgba(22,135,255,0.22)',
  },

  aiInnerCircle: {
    width: 64,
    height: 64,

    borderRadius: 32,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#1687ff',

    shadowColor: '#1687ff',
    shadowOpacity: 0.35,
    shadowRadius: 12,

    elevation: 5,
  },

  aiTitle: {
    color: '#ffffff',

    fontSize: 28,

    fontWeight: '800',

    textAlign: 'center',

    marginTop: 18,
  },

  aiDescription: {
    color: '#9db2ca',

    fontSize: 14,

    lineHeight: 22,

    textAlign: 'center',

    marginTop: 8,

    marginBottom: 20,
  },


  /* =====================================================
     AI INPUT
  ===================================================== */

  inputContainer: {
    width: '100%',

    minHeight: 54,

    paddingHorizontal: 15,

    borderRadius: 14,

    backgroundColor: '#102b49',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.10)',

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,
  },

  aiInput: {
    flex: 1,

    color: '#ffffff',

    fontSize: 15,
  },


  /* =====================================================
     AI BUTTON
  ===================================================== */

  askButton: {
    width: '100%',

    minHeight: 54,

    marginTop: 14,

    borderRadius: 14,

    backgroundColor: '#1687ff',

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
  },

  askButtonText: {
    color: '#ffffff',

    fontSize: 17,

    fontWeight: '700',
  },


  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    marginTop: 5,

    paddingVertical: 35,

    paddingHorizontal: 20,

    alignItems: 'center',

    borderTopWidth: 1,

    borderTopColor: 'rgba(255,255,255,0.08)',
  },

  footerTitle: {
    color: '#ffffff',

    fontSize: 21,

    fontWeight: '700',
  },

  footerTagline: {
    color: '#8facbf',

    fontSize: 13,

    textAlign: 'center',

    marginTop: 8,
  },

  footerText: {
    color: '#64819a',

    fontSize: 11,

    textAlign: 'center',

    marginTop: 7,
  },

});