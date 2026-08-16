import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OTP() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOTP = async () => {
    if (phone.trim().length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    try {
      setLoading(true);

      setOtpSent(true);

      Alert.alert(
        'OTP Sent',
        `OTP has been sent to +91 ${phone}`
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async () => {
    if (otp.trim().length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit OTP.'
      );
      return;
    }

    try {
      setLoading(true);


      Alert.alert(
        'OTP Verified',
        'Phone number verified successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        'Unable to verify OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <View style={styles.card}>

          {/* ==========================================
              LOGO
          ========================================== */}

          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />


          {/* ==========================================
              TITLE
          ========================================== */}

          <Text style={styles.title}>
            Phone Verification
          </Text>

          <Text style={styles.subtitle}>
            Enter your phone number to receive an OTP
          </Text>


          {/* ==========================================
              PHONE NUMBER
          ========================================== */}

          <View style={styles.phoneGroup}>

            <View style={styles.countryCode}>
              <Text style={styles.countryText}>
                +91
              </Text>
            </View>

            <TextInput
              style={styles.phoneInput}
              placeholder="Enter phone number"
              placeholderTextColor="#7186A3"
              value={phone}
              onChangeText={(text) =>
                setPhone(
                  text.replace(/[^0-9]/g, '').slice(0, 10)
                )
              }
              keyboardType="phone-pad"
              maxLength={10}
            />

          </View>


          {/* ==========================================
              SEND OTP
          ========================================== */}

          {!otpSent && (
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
              onPress={handleSendOTP}
              disabled={loading}
            >

              <Text style={styles.primaryButtonText}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Text>

            </Pressable>
          )}


          {/* ==========================================
              OTP
          ========================================== */}

          {otpSent && (
            <>

              <TextInput
                style={styles.otpInput}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#7186A3"
                value={otp}
                onChangeText={(text) =>
                  setOtp(
                    text.replace(/[^0-9]/g, '').slice(0, 6)
                  )
                }
                keyboardType="number-pad"
                maxLength={6}
              />


              {/* VERIFY */}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                  loading && styles.disabled,
                ]}
                onPress={handleVerifyOTP}
                disabled={loading}
              >

                <Text style={styles.primaryButtonText}>
                  {loading
                    ? 'Verifying...'
                    : 'Verify OTP'}
                </Text>

              </Pressable>


              {/* RESEND */}

              <Pressable
                style={styles.resendButton}
                onPress={handleSendOTP}
                disabled={loading}
              >

                <Text style={styles.resendText}>
                  Resend OTP
                </Text>

              </Pressable>

            </>
          )}


          {/* ==========================================
              BACK TO LOGIN
          ========================================== */}

          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.replace('/login')}
          >

            <Text style={styles.backText}>
              Back to Login
            </Text>

          </Pressable>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  // ==========================================
  // PAGE
  // ==========================================

  page: {
    flex: 1,

    backgroundColor: '#061320',
  },

  keyboard: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 20,
  },


  // ==========================================
  // CARD
  // ==========================================

  card: {
    width: '100%',

    maxWidth: 520,

    paddingHorizontal: width < 600 ? 22 : 40,
    paddingVertical: width < 600 ? 32 : 45,

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 30,

    shadowOffset: {
      width: 0,
      height: 20,
    },

    elevation: 12,

    alignItems: 'center',
  },


  // ==========================================
  // LOGO
  // ==========================================

  logo: {
    width: width < 600 ? 75 : 90,

    height: width < 600 ? 75 : 90,

    marginBottom: 15,
  },


  // ==========================================
  // TITLE
  // ==========================================

  title: {
    marginBottom: 8,

    color: '#2864E6',

    fontSize: width < 600 ? 27 : 32,

    fontWeight: '700',

    textAlign: 'center',
  },

  subtitle: {
    color: '#6B7280',

    fontSize: 13,

    lineHeight: 19,

    textAlign: 'center',

    marginBottom: 25,

    paddingHorizontal: 10,
  },


  // ==========================================
  // PHONE
  // ==========================================

  phoneGroup: {
    width: '100%',

    flexDirection: 'row',

    marginBottom: 18,
  },

  countryCode: {
    width: width < 380 ? 65 : 75,

    height: width < 600 ? 54 : 60,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#F8FAFC',

    borderWidth: 1,

    borderColor: '#D1D5DB',

    borderRightWidth: 0,

    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },

  countryText: {
    color: '#1F2937',

    fontSize: 16,

    fontWeight: '700',
  },

  phoneInput: {
    flex: 1,

    height: width < 600 ? 54 : 60,

    paddingHorizontal: 18,

    borderWidth: 1,

    borderColor: '#D1D5DB',

    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,

    color: '#111827',

    backgroundColor: '#FFFFFF',

    fontSize: 16,
  },


  // ==========================================
  // OTP INPUT
  // ==========================================

  otpInput: {
    width: '100%',

    height: width < 600 ? 54 : 60,

    paddingHorizontal: 18,

    marginBottom: 18,

    borderWidth: 1,

    borderColor: '#D1D5DB',

    borderRadius: 12,

    color: '#111827',

    backgroundColor: '#FFFFFF',

    fontSize: 17,

    textAlign: 'center',

    letterSpacing: 5,
  },


  // ==========================================
  // BUTTON
  // ==========================================

  primaryButton: {
    width: '100%',

    height: width < 600 ? 54 : 60,

    marginBottom: 14,

    borderRadius: 12,

    backgroundColor: '#2864E6',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#2864E6',

    shadowOpacity: 0.20,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  primaryButtonText: {
    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: '600',
  },


  // ==========================================
  // RESEND
  // ==========================================

  resendButton: {
    marginBottom: 8,

    paddingVertical: 8,
  },

  resendText: {
    color: '#2864E6',

    fontSize: 14,

    fontWeight: '600',
  },


  // ==========================================
  // BACK
  // ==========================================

  backButton: {
    width: '100%',

    height: 54,

    marginTop: 10,

    borderRadius: 12,

    backgroundColor: '#6B7280',

    alignItems: 'center',

    justifyContent: 'center',
  },

  backText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '600',
  },


  // ==========================================
  // PRESSED / DISABLED
  // ==========================================

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.65,
  },

});