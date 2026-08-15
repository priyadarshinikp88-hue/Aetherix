import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const isSmall = width < 400;

export default function AboutScreen() {
  return (
    <View style={styles.page}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <View style={styles.headerTitleContainer}>
           
          </View>

          <Pressable
            style={styles.backIcon}
            onPress={() => router.replace('/home')}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#ffffff"
            />
          </Pressable>

        </View>

        {/* ================= FOUNDER ================= */}

        <View style={styles.founderSection}>

          <View style={styles.founderImageContainer}>

            <Image
              source={require('../assets/ceo.jpg')}
              style={styles.founderImage}
              contentFit="cover"
            />

          </View>


          <View style={styles.founderCard}>

            <View style={styles.smallLabelRow}>

              <Ionicons
                name="person-outline"
                size={17}
                color="#7fd8ff"
              />

              <Text style={styles.founderTag}>
                Founder
              </Text>

            </View>


            <Text style={styles.founderTitle}>
              Aetherix Technologies
            </Text>


            <Text style={styles.founderText}>
              At Aetherix Technologies, we believe Artificial
              Intelligence should solve real-world challenges
              and create meaningful impact for every industry.
            </Text>


            <Text style={styles.founderText}>
              Our goal is to develop innovative, intelligent
              and scalable AI solutions that empower
              organizations with accurate insights and
              better decision-making.
            </Text>

          </View>

        </View>


        {/* ================= MISSION & VISION ================= */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Mission & Vision
          </Text>


          <View style={styles.missionGrid}>

            <View style={styles.missionCard}>

              <View style={styles.cardIcon}>
                <Ionicons
                  name="rocket-outline"
                  size={25}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.missionTitle}>
                Our Mission
              </Text>

              <Text style={styles.missionText}>
                To deliver innovative AI-powered solutions
                that improve decision-making, efficiency
                and sustainability through intelligent
                technology.
              </Text>

            </View>


            <View style={styles.missionCard}>

              <View style={styles.cardIcon}>
                <Ionicons
                  name="eye-outline"
                  size={25}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.missionTitle}>
                Our Vision
              </Text>

              <Text style={styles.missionText}>
                To become a globally trusted Artificial
                Intelligence company driving innovation,
                research and digital transformation across
                industries.
              </Text>

            </View>

          </View>

        </View>


        {/* ================= WHY AETHERIX ================= */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Why Choose Aetherix?
          </Text>


          <View style={styles.whyGrid}>

            <View style={styles.whyCard}>

              <View style={styles.whyIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={25}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.whyTitle}>
                AI Powered
              </Text>

              <Text style={styles.whyText}>
                Advanced Artificial Intelligence delivering
                intelligent insights and automation.
              </Text>

            </View>


            <View style={styles.whyCard}>

              <View style={styles.whyIcon}>
                <Ionicons
                  name="pulse-outline"
                  size={25}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.whyTitle}>
                Real-Time Intelligence
              </Text>

              <Text style={styles.whyText}>
                Live monitoring and instant analytics for
                smarter decision-making.
              </Text>

            </View>


            <View style={styles.whyCard}>

              <View style={styles.whyIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={25}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.whyTitle}>
                Secure Platform
              </Text>

              <Text style={styles.whyText}>
                Enterprise-grade security with reliable
                cloud infrastructure.
              </Text>

            </View>


            <View style={styles.whyCard}>

              <View style={styles.whyIcon}>
                <Ionicons
                  name="bulb-outline"
                  size={25}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.whyTitle}>
                Innovation
              </Text>

              <Text style={styles.whyText}>
                Continuously developing AI solutions for
                the future.
              </Text>

            </View>

          </View>

        </View>


        {/* ================= CONTACT ================= */}

        <View style={styles.contactSection}>

          <Text style={styles.sectionTitle}>
            Contact Us
          </Text>


          <Text style={styles.contactDescription}>
            We'd love to hear from you. Reach out to
            Aetherix Technologies for collaboration,
            partnerships or support.
          </Text>


          <View style={styles.contactGrid}>

            <View style={styles.contactCard}>

              <View style={styles.contactIcon}>
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.contactTitle}>
                Email
              </Text>

              <Text style={styles.contactText}>
                shrinivas@aetherixcloud.com
              </Text>

            </View>


            <View style={styles.contactCard}>

              <View style={styles.contactIcon}>
                <Ionicons
                  name="globe-outline"
                  size={24}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.contactTitle}>
                Website
              </Text>

              <Text style={styles.contactText}>
                www.aetherixcloud.com
              </Text>

            </View>


            <View style={styles.contactCard}>

              <View style={styles.contactIcon}>
                <Ionicons
                  name="call-outline"
                  size={24}
                  color="#7fd8ff"
                />
              </View>

              <Text style={styles.contactTitle}>
                Phone
              </Text>

              <Text style={styles.contactText}>
                +91 9900510879
              </Text>

            </View>

          </View>

        </View>


        {/* ================= FOOTER ================= */}

        <View style={styles.footer}>

          <Text style={styles.footerTitle}>
            Aetherix Technologies
          </Text>

          <Text style={styles.footerTagline}>
            Intelligent technology for a smarter future
          </Text>

          <Text style={styles.footerText}>
            © 2026 Aetherix Technologies
          </Text>

          <Text style={styles.footerText}>
            All Rights Reserved.
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

  /* ================= PAGE ================= */

  page: {
    flex: 1,
    backgroundColor: '#061320',
  },

  content: {
    paddingBottom: 30,
  },


  /* ================= HEADER ================= */
 header: {
  minHeight: 125,

  paddingTop: 38,
  paddingBottom: 16,
  paddingHorizontal: 18,

  backgroundColor: '#061420',

  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.08)',

  flexDirection: 'row',
  alignItems: 'center',
},

  logo: {
  width: isSmall ? 120 : 140,
  height: isSmall ? 120 : 140,
},

  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerSubtitle: {
    color: '#72cfff',
    fontSize: 11,
    marginTop: 3,
  },

  backIcon: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.12)',

    borderWidth: 1,
    borderColor: 'rgba(22,135,255,0.25)',
  },

  /* ================= FOUNDER ================= */

  founderSection: {
    paddingHorizontal: isSmall ? 20 : 55,
    paddingVertical: 25,

    alignItems: 'center',

    gap: 22,
  },

  founderImageContainer: {
    width: isSmall ? 320 : 400,
    height: isSmall ? 295 : 380,

    borderRadius: 24,

    overflow: 'hidden',

    borderWidth: 2,
    borderColor: 'rgba(41,185,255,0.30)',
  },

  founderImage: {
    width: '100%',
    height: '100%',
  },

  founderCard: {
    width: '100%',
    maxWidth: 850,

    padding: isSmall ? 23 : 36,

    borderRadius: 22,

    backgroundColor: '#0e213a',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },

  smallLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 7,

    marginBottom: 12,
  },

  founderTag: {
    color: '#7fd8ff',

    fontSize: 14,

    fontWeight: '700',

    letterSpacing: 0.5,
  },

  founderTitle: {
    color: '#ffffff',

    fontSize: isSmall ? 27 : 38,

    fontWeight: '700',

    marginBottom: 18,
  },

  founderText: {
    color: '#cfe5f7',

    fontSize: isSmall ? 15 : 18,

    lineHeight: 28,

    marginBottom: 15,
  },


  /* ================= SECTIONS ================= */

  section: {
    paddingHorizontal: isSmall ? 20 : 55,
    paddingVertical: 35,
  },

  sectionTitle: {
    color: '#ffffff',

    fontSize:
      width < 400
        ? 29
        : width < 600
          ? 35
          : 45,

    fontWeight: '800',

    textAlign: 'center',

    marginBottom: 28,
  },


  /* ================= MISSION ================= */

  missionGrid: {
    width: '100%',

    flexDirection:
      width < 700
        ? 'column'
        : 'row',

    gap: 18,
  },

  missionCard: {
    flex: 1,

    minHeight: 225,

    padding: isSmall ? 23 : 32,

    borderRadius: 22,

    backgroundColor: '#0e213a',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },

  cardIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.10)',

    marginBottom: 15,
  },

  missionTitle: {
    color: '#76d8ff',

    fontSize: isSmall ? 24 : 30,

    fontWeight: '700',

    marginBottom: 15,
  },

  missionText: {
    color: '#cfe5f7',

    fontSize: isSmall ? 15 : 17,

    lineHeight: 27,
  },


  /* ================= WHY ================= */

  whyGrid: {
    width: '100%',

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'center',

    gap: 15,
  },

  whyCard: {
    width:
      width < 600
        ? '100%'
        : width < 950
          ? '47%'
          : '23%',

    minHeight: 215,

    padding: 23,

    borderRadius: 22,

    backgroundColor: '#0e213a',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  whyIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.10)',

    marginBottom: 14,
  },

  whyTitle: {
    color: '#7fd8ff',

    fontSize: isSmall ? 19 : 21,

    fontWeight: '700',

    textAlign: 'center',

    marginBottom: 13,
  },

  whyText: {
    color: '#cfe5f7',

    fontSize: 14.5,

    lineHeight: 24,

    textAlign: 'center',
  },


  /* ================= CONTACT ================= */

  contactSection: {
    paddingHorizontal: isSmall ? 20 : 55,

    paddingVertical: 38,

    alignItems: 'center',
  },

  contactDescription: {
    maxWidth: 700,

    color: '#cfe5f7',

    fontSize: isSmall ? 15 : 18,

    lineHeight: 27,

    textAlign: 'center',

    marginBottom: 28,
  },

  contactGrid: {
    width: '100%',

    flexDirection:
      width < 700
        ? 'column'
        : 'row',

    gap: 15,
  },

  contactCard: {
    flex: 1,

    minHeight: 165,

    padding: 25,

    borderRadius: 22,

    backgroundColor: '#0e213a',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  contactIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(22,135,255,0.10)',

    marginBottom: 13,
  },

  contactTitle: {
    color: '#7fd8ff',

    fontSize: 19,

    fontWeight: '700',

    marginBottom: 10,
  },

  contactText: {
    color: '#cfe5f7',

    fontSize: 13.5,

    textAlign: 'center',
  },


  /* ================= FOOTER ================= */

  footer: {
    marginTop: 15,

    paddingVertical: 38,
    paddingHorizontal: 20,

    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },

  footerTitle: {
    color: '#ffffff',

    fontSize: 24,

    fontWeight: '700',

    textAlign: 'center',
  },

  footerTagline: {
    color: '#82a9c5',

    fontSize: 13,

    textAlign: 'center',

    marginTop: 8,
  },

  footerText: {
    color: '#718da6',

    fontSize: 11.5,

    textAlign: 'center',

    marginTop: 7,
  },

});