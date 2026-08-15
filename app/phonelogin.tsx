import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { OTPWidget } from '@msg91comm/sendotp-react-native';

const API_URL = 'https://aetherix-backend-eoj8.onrender.com/api';

const MSG91_WIDGET_ID = '36686d69717a353739353435'; 
const MSG91_AUTH_TOKEN = '556760TDociVLO2jz86a7da912P1';

export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [reqId, setReqId] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    try {
      OTPWidget.initializeWidget(
        MSG91_WIDGET_ID,
        MSG91_AUTH_TOKEN
      );
    } catch (error) {
      console.error('MSG91 initialization error:', error);
    }
  }, []);

  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    try {
      setSending(true);

      const response = await OTPWidget.sendOTP({
        identifier: `91${cleanPhone}`,
      });

      console.log('MSG91 Send OTP:', response);

      if (!response) {
        Alert.alert('Error', 'Failed to send OTP.');
        return;
      }

      /*
       * MSG91 returns the request ID.
       * Depending on the widget configuration/version,
       * it may be returned as reqId or message.
       */
      const newReqId =
        response.reqId ||
        response.requestId ||
        response.message ||
        '';

      if (!newReqId) {
        console.log('MSG91 response:', response);
        Alert.alert(
          'OTP Sent',
          'OTP was requested, but no request ID was returned. Check the Metro logs.'
        );
        return;
      }

      setReqId(newReqId);
      setOtpSent(true);

      Alert.alert(
        'OTP Sent',
        `OTP has been sent to +91 ${cleanPhone}.`
      );
    } catch (error: any) {
      console.error('Send OTP error:', error);

      Alert.alert(
        'OTP Error',
        error?.message || 'Failed to send OTP.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Missing OTP', 'Please enter the OTP.');
      return;
    }

    if (!/^\d{4,8}$/.test(otp)) {
      Alert.alert(
        'Invalid OTP',
        'Please enter a valid OTP.'
      );
      return;
    }

    if (!reqId) {
      Alert.alert(
        'Request ID Missing',
        'Please send the OTP again.'
      );
      return;
    }

    try {
      setVerifying(true);

      const response = await OTPWidget.verifyOTP({
        reqId,
        otp: otp.trim(),
      });

      console.log('MSG91 Verify OTP:', response);

      /*
       * Your existing web flow expects an MSG91
       * access token and then sends it to:
       *
       * /phone/verify-phone
       */

      const accessToken =
        response?.message ||
        response?.accessToken ||
        response?.token;

      if (!accessToken) {
        console.log('Full MSG91 verification response:', response);

        Alert.alert(
          'Verification Error',
          'OTP was verified, but the MSG91 access token was not received.'
        );
        return;
      }

      const backendResponse = await fetch(
        `${API_URL}/phone/verify-phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
          }),
        }
      );

      const backendData = await backendResponse.json();

      console.log(
        'Phone backend response:',
        backendData
      );

      if (!backendResponse.ok || !backendData?.success) {
        Alert.alert(
          'Phone Login Failed',
          backendData?.message ||
            'Phone verification failed.'
        );
        return;
      }

      /*
       * We'll add secure token storage after
       * the complete authentication flow is working.
       */

      Alert.alert(
        'Login Successful',
        'Phone number verified successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Verify OTP error:', error);

      Alert.alert(
        'Verification Error',
        error?.message ||
          'OTP verification failed.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleRetryOTP = async () => {
    if (!reqId) {
      Alert.alert(
        'Error',
        'Please send an OTP first.'
      );
      return;
    }

    try {
      setResending(true);

      const response = await OTPWidget.retryOTP({
        reqId,
        retryChannel: 11,
      });

      console.log('MSG91 Retry OTP:', response);

      const newReqId =
        response?.reqId ||
        response?.requestId ||
        response?.message;

      if (newReqId) {
        setReqId(newReqId);
      }

      Alert.alert(
        'OTP Resent',
        'A new OTP has been sent.'
      );
    } catch (error: any) {
      console.error('Retry OTP error:', error);

      Alert.alert(
        'Error',
        error?.message ||
          'Failed to resend OTP.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={styles.brand}>
            AETHERIX
          </Text>

          <Text style={styles.title}>
            Phone Login
          </Text>

          <Text style={styles.subtitle}>
            Sign in securely using your mobile number.
          </Text>

          {!otpSent ? (
            <>
              <Text style={styles.label}>
                Mobile Number
              </Text>

              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryText}>
                    +91
                  </Text>
                </View>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter your mobile number"
                  placeholderTextColor="#8a96a6"
                  value={phone}
                  onChangeText={(value) =>
                    setPhone(
                      value.replace(/\D/g, '').slice(0, 10)
                    )
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={!sending}
                />
              </View>

              <Pressable
                style={[
                  styles.primaryButton,
                  sending && styles.disabled,
                ]}
                onPress={handleSendOTP}
                disabled={sending}
              >
                <Text style={styles.primaryText}>
                  {sending
                    ? 'Sending OTP...'
                    : 'Send OTP'}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.otpInfo}>
                Enter the OTP sent to
              </Text>

              <Text style={styles.phoneDisplay}>
                +91 {phone}
              </Text>

              <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                placeholderTextColor="#8a96a6"
                value={otp}
                onChangeText={(value) =>
                  setOtp(
                    value.replace(/\D/g, '').slice(0, 8)
                  )
                }
                keyboardType="number-pad"
                maxLength={8}
                editable={!verifying}
              />

              <Pressable
                style={[
                  styles.primaryButton,
                  verifying && styles.disabled,
                ]}
                onPress={handleVerifyOTP}
                disabled={verifying}
              >
                <Text style={styles.primaryText}>
                  {verifying
                    ? 'Verifying...'
                    : 'Verify OTP'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleRetryOTP}
                disabled={resending}
              >
                <Text style={styles.secondaryText}>
                  {resending
                    ? 'Resending...'
                    : 'Resend OTP'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.changeButton}
                onPress={() => {
                  setOtpSent(false);
                  setOtp('');
                  setReqId('');
                }}
              >
                <Text style={styles.changeText}>
                  Change phone number
                </Text>
              </Pressable>
            </>
          )}

         <Pressable
  style={styles.backButton}
  onPress={() => router.replace('/login')}
>
  <Text style={styles.backButtonText}>
    ← Back to Login
  </Text>
</Pressable>

            </View>
  </ScrollView>
</KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061320',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 500,
    padding: 28,
    borderRadius: 24,
    backgroundColor: '#ffffff',
  },

  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },

  brand: {
    textAlign: 'center',
    color: '#2864e6',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },

  title: {
    textAlign: 'center',
    color: '#111827',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 24,
  },

  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 28,
  },

  label: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  phoneRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 18,
  },

  countryCode: {
    width: 65,
    height: 54,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },

  countryText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },

  phoneInput: {
    flex: 1,
    height: 54,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    color: '#111827',
    fontSize: 16,
  },

  otpInput: {
    width: '100%',
    height: 58,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    letterSpacing: 8,
    color: '#111827',
    fontSize: 22,
    marginTop: 18,
    marginBottom: 18,
  },

  primaryButton: {
    height: 54,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#2864e6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },

  secondaryButton: {
    height: 50,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#eef4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  secondaryText: {
    color: '#2864e6',
    fontSize: 16,
    fontWeight: '600',
  },

  changeButton: {
    alignItems: 'center',
    marginTop: 18,
  },

  changeText: {
    color: '#2864e6',
    fontSize: 14,
    fontWeight: '500',
  },

  otpInfo: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
  },

  phoneDisplay: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },

  backButton: {
    height: 50,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  backButtonText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: '600',
},

  backText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.6,
  },
});