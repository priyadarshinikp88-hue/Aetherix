import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const isSmall = width < 400;


/* =========================================================
   SERVICES
========================================================= */

const services = [
  {
    icon: 'cloud-outline',
    title: 'Weather Intelligence',
    tag: 'Core Intelligence',
    description:
      'Real-time weather intelligence, forecasts, alerts, and actionable insights for smarter planning and decision-making.',
  },

  {
    icon: 'leaf-outline',
    title: 'Agriculture',
    tag: 'Smart Agriculture',
    description:
      'Weather-driven intelligence helping farmers make better decisions around crops, irrigation, risks, and agricultural planning.',
  },

  {
    icon: 'business-outline',
    title: 'Smart City',
    tag: 'Urban Intelligence',
    description:
      'Weather intelligence supporting urban planning, infrastructure, transportation, and city operations.',
  },

  {
    icon: 'boat-outline',
    title: 'Marine',
    tag: 'Marine Intelligence',
    description:
      'Weather and environmental intelligence designed to support marine activities and safer decision-making.',
  },

  {
    icon: 'airplane-outline',
    title: 'Aviation',
    tag: 'Aviation Intelligence',
    description:
      'Weather insights for aviation planning, operational awareness, and improved understanding of weather conditions.',
  },
];


/* =========================================================
   HERO IMAGES
========================================================= */

const heroImages = [
  require('../assets/weather.png'),
  require('../assets/agriculture.png'),
  require('../assets/smartcity.png'),
  require('../assets/marine.png'),
  require('../assets/aviation.png'),
];


export default function ExploreServicesScreen() {

  const router = useRouter();

  /* =======================================================
     HEADER ANIMATION
  ======================================================= */

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(20)
  ).current;


  /* =======================================================
     IMAGE ANIMATION
  ======================================================= */

  const imageOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const imageScale = useRef(
    new Animated.Value(0.62)
  ).current;


  /* =======================================================
     CURRENT IMAGE
  ======================================================= */

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = heroImages[currentIndex];


  /* =======================================================
     HEADER ANIMATION
  ======================================================= */

  useEffect(() => {

    Animated.parallel([

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),

    ]).start();

  }, [fadeAnim, slideAnim]);


  /* =======================================================
     IMAGE ANIMATION

     SMALL
       ↓
     FADE IN
       ↓
     SLOW ZOOM IN
       ↓
     FULL SIZE
       ↓
     HOLD
       ↓
     FADE OUT
       ↓
     NEXT IMAGE
========================================================= */

  useEffect(() => {

    let cancelled = false;

    let holdTimer: ReturnType<typeof setTimeout> | null = null;


    /* -------------------------------------------------------
       RESET IMAGE
    ------------------------------------------------------- */

    imageOpacity.setValue(0);

    imageScale.setValue(0.62);


    /* -------------------------------------------------------
       SMALL → FULL SIZE
    ------------------------------------------------------- */

    Animated.parallel([

      Animated.timing(imageOpacity, {
        toValue: 1,

        duration: 900,

        useNativeDriver: true,
      }),

      Animated.timing(imageScale, {
        toValue: 1,

        duration: 3200,

        useNativeDriver: true,
      }),

    ]).start(({ finished }) => {

      if (!finished || cancelled) {
        return;
      }


      /* -----------------------------------------------------
         HOLD FULL-SIZE IMAGE
      ----------------------------------------------------- */

      holdTimer = setTimeout(() => {

        if (cancelled) {
          return;
        }


        /* ---------------------------------------------------
           FADE OUT ONLY

           NO ZOOM OUT
        --------------------------------------------------- */

        Animated.timing(imageOpacity, {
          toValue: 0,

          duration: 900,

          useNativeDriver: true,

        }).start(({ finished: fadeFinished }) => {

          if (!fadeFinished || cancelled) {
            return;
          }


          /* -----------------------------------------------
             NEXT IMAGE
          ------------------------------------------------ */

          setCurrentIndex((previous) => {

            return (
              (previous + 1) %
              heroImages.length
            );

          });

        });

      }, 1800);

    });


    /* -------------------------------------------------------
       CLEANUP
    ------------------------------------------------------- */

    return () => {

      cancelled = true;

      if (holdTimer) {
        clearTimeout(holdTimer);
      }

      imageOpacity.stopAnimation();

      imageScale.stopAnimation();

    };

  }, [
    currentIndex,
    imageOpacity,
    imageScale,
  ]);


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <View style={styles.page}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>


          {/* =================================================
              HEADER
          ================================================= */}

          <Animated.View
            style={[
              styles.header,

              {
                opacity: fadeAnim,

                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >

            <View style={styles.headerText}>

              <Text style={styles.headerTitle}>
                Explore Services
              </Text>

              <Text style={styles.headerSubtitle}>
                Intelligent weather solutions
              </Text>

            </View>


            <View style={styles.headerIcon}>

              <Ionicons
                name="sparkles-outline"
                size={25}
                color="#63d8ff"
              />

            </View>

          </Animated.View>


          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <View style={styles.heroVisual}>

            <Animated.View
              style={[
                styles.imageContainer,

                {
                  opacity: imageOpacity,

                  transform: [
                    {
                      scale: imageScale,
                    },
                  ],
                },
              ]}
            >

              <Image
                source={currentImage}
                style={styles.heroImage}
                contentFit="contain"
              />

            </Animated.View>


            {/* =================================================
                HERO TITLE
            ================================================= */}

            <Text style={styles.visualTitle}>
              Weather Intelligence
            </Text>


            <Text style={styles.visualDescription}>
              Turning weather data into smarter
              decisions across industries.
            </Text>

          </View>

        </View>


        {/* =================================================
            SERVICES
        ================================================= */}

        <View style={styles.servicesSection}>

          <Text style={styles.sectionTitle}>
            Our Services
          </Text>


          <Text style={styles.sectionDescription}>
            Powerful intelligence designed for different
            weather-sensitive sectors.
          </Text>


          {/* =================================================
              SERVICE CARDS
          ================================================= */}

          {services.map((service) => (

            <Pressable
  key={service.title}
  onPress={() => {
    if (service.title === 'Weather Intelligence') {
      router.push('/weatherdashboard');
    }
  }}
  style={({ pressed }) => [
    styles.serviceCard,
    pressed && styles.cardPressed,
  ]}
>

              {/* ICON */}

              <View style={styles.serviceIcon}>

                <Ionicons
                  name={service.icon as any}
                  size={29}
                  color="#63d8ff"
                />

              </View>


              {/* CONTENT */}

              <View style={styles.serviceContent}>

                <View style={styles.serviceTopRow}>

                  <Text style={styles.serviceTitle}>
                    {service.title}
                  </Text>


                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#63a8ca"
                  />

                </View>


                <View style={styles.serviceTag}>

                  <Text style={styles.serviceTagText}>
                    {service.tag}
                  </Text>

                </View>


                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>

              </View>

            </Pressable>

          ))}


          {/* =================================================
              FOOTER
          ================================================= */}

          <View style={styles.footer}>

            <Text style={styles.footerTitle}>
              Aetherix Technologies
            </Text>

            <Text style={styles.footerCopyright}>
              © 2026 Aetherix Technologies
            </Text>

          </View>

        </View>

      </ScrollView>

    </View>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =======================================================
     PAGE
  ======================================================= */

  page: {
    flex: 1,

    backgroundColor: '#061320',
  },


  scrollContent: {
    paddingBottom: 30,
  },


  /* =======================================================
     HERO
  ======================================================= */

  hero: {
    backgroundColor: '#061420',

    borderBottomWidth: 1,

    borderBottomColor:
      'rgba(255,255,255,0.08)',

    overflow: 'hidden',
  },


  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    minHeight: 120,

    paddingTop: 48,

    paddingBottom: 10,

    paddingHorizontal: 24,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },


  headerText: {
    flex: 1,
  },


  headerTitle: {
    color: '#ffffff',

    fontSize:
      isSmall ? 27 : 31,

    fontWeight: '800',
  },


  headerSubtitle: {
    color: '#76b6d4',

    fontSize: 13,

    marginTop: 5,
  },


  headerIcon: {
    width: 54,

    height: 54,

    borderRadius: 27,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      'rgba(10,45,72,0.9)',

    borderWidth: 1,

    borderColor:
      'rgba(70,190,240,0.35)',
  },


  /* =======================================================
     HERO VISUAL
  ======================================================= */

  heroVisual: {
    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 10,

    paddingTop: 0,

    paddingBottom: 30,

    overflow: 'hidden',
  },


  /* =======================================================
     LARGE IMAGE
  ======================================================= */

  imageContainer: {
    width:
      isSmall ? 390 : 470,

    height:
      isSmall ? 390 : 470,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 0,

    marginBottom: 5,
  },


  heroImage: {
    width: '100%',

    height: '100%',
  },


  /* =======================================================
     HERO TEXT
  ======================================================= */

  visualTitle: {
    color: '#ffffff',

    fontSize:
      isSmall ? 28 : 33,

    fontWeight: '800',

    textAlign: 'center',

    marginTop: 5,
  },


  visualDescription: {
    maxWidth: 450,

    color: '#91b0c4',

    fontSize: 15,

    lineHeight: 23,

    textAlign: 'center',

    marginTop: 9,

    paddingHorizontal: 15,
  },


  /* =======================================================
     SERVICES
  ======================================================= */

  servicesSection: {
    paddingHorizontal:
      isSmall ? 17 : 30,

    paddingTop: 34,
  },


  sectionTitle: {
    color: '#ffffff',

    fontSize:
      isSmall ? 30 : 35,

    fontWeight: '800',

    textAlign: 'center',
  },


  sectionDescription: {
    color: '#819caf',

    fontSize: 14,

    lineHeight: 22,

    textAlign: 'center',

    marginTop: 8,

    marginBottom: 26,

    paddingHorizontal: 8,
  },


  /* =======================================================
     SERVICE CARD
  ======================================================= */

  serviceCard: {
    width: '100%',

    minHeight: 150,

    marginBottom: 15,

    padding:
      isSmall ? 17 : 21,

    borderRadius: 21,

    backgroundColor: '#0b2037',

    borderWidth: 1,

    borderColor:
      'rgba(73,151,201,0.18)',

    flexDirection: 'row',

    alignItems: 'flex-start',

    elevation: 3,
  },


  cardPressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },


  /* =======================================================
     SERVICE ICON
  ======================================================= */

  serviceIcon: {
    width: 56,

    height: 56,

    borderRadius: 18,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      'rgba(18,119,183,0.12)',

    borderWidth: 1,

    borderColor:
      'rgba(44,180,239,0.18)',
  },


  /* =======================================================
     SERVICE CONTENT
  ======================================================= */

  serviceContent: {
    flex: 1,

    marginLeft: 15,
  },


  serviceTopRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 8,
  },


  serviceTitle: {
    flex: 1,

    color: '#ffffff',

    fontSize:
      isSmall ? 18 : 20,

    fontWeight: '700',
  },


  serviceTag: {
    alignSelf: 'flex-start',

    marginTop: 7,

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 9,

    backgroundColor:
      'rgba(0,183,255,0.08)',
  },


  serviceTagText: {
    color: '#62c9ef',

    fontSize: 9.5,

    fontWeight: '700',
  },


  serviceDescription: {
    color: '#91abc0',

    fontSize:
      isSmall ? 12.5 : 13.5,

    lineHeight: 20,

    marginTop: 9,
  },


  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    marginTop: 25,

    paddingTop: 28,

    paddingBottom: 15,

    alignItems: 'center',

    borderTopWidth: 1,

    borderTopColor:
      'rgba(255,255,255,0.07)',
  },


  footerTitle: {
    color: '#ffffff',

    fontSize: 21,

    fontWeight: '800',
  },


  footerCopyright: {
    color: '#5d788e',

    fontSize: 10.5,

    marginTop: 8,
  },

});