import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  Alert,
  Dimensions,
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
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Login',
        'Please enter Email and Password'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'https://aetherix-backend-eoj8.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log('LOGIN STATUS:', response.status);
      console.log('LOGIN RESPONSE:', data);

      if (response.ok) {
        router.replace('/home');
      } else {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid credentials'
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Server Error',
        'Unable to connect to the server'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = () => {
    Alert.alert(
      'Google Login',
      'Google authentication will be connected to the existing Aetherix Firebase authentication.'
    );
  };

  // =====================================================
  // UI
  // =====================================================

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

        {/* LOGIN CARD */}

        <View style={styles.loginCard}>

          {/* LOGO */}

          <Image
            source={require('../assets/logo.png')}
            style={styles.loginLogo}
            contentFit="contain"
          />

          {/* TITLE */}

          <Text style={styles.loginTitle}>
            Welcome back 👋
          </Text>

          <Text style={styles.loginSubtitle}>
            Sign in to your{' '}
            <Text style={styles.loginAetherix}>
              Aetherix
            </Text>{' '}
            account
          </Text>

          {/* EMAIL */}

          <Text style={styles.fieldLabel}>
            Email address
          </Text>

          <View style={styles.inputBox}>

            <View style={styles.inputIcon}>
              <Svg
                width={21}
                height={21}
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M4 5h16v14H4z"
                  stroke="#9AB7D5"
                  strokeWidth="1.7"
                />

                <Path
                  d="m4 7 8 6 8-6"
                  stroke="#9AB7D5"
                  strokeWidth="1.7"
                />
              </Svg>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#7186A3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

          </View>

          {/* PASSWORD */}

          <Text style={styles.fieldLabel}>
            Password
          </Text>

          <View style={styles.inputBox}>

            <View style={styles.inputIcon}>
              <Svg
                width={21}
                height={21}
                viewBox="0 0 24 24"
                fill="none"
              >
                <Path
                  d="M7 10V7a5 5 0 0 1 10 0v3"
                  stroke="#9AB7D5"
                  strokeWidth="1.7"
                />

                <Path
                  d="M5 10h14v10H5z"
                  stroke="#9AB7D5"
                  strokeWidth="1.7"
                />
              </Svg>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#7186A3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Text style={styles.eyeIcon}>
                {showPassword ? '◉' : '◌'}
              </Text>
            </Pressable>

          </View>

          {/* FORGOT PASSWORD */}

          <Pressable
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert(
                'Forgot Password',
                'Password recovery screen will be added next.'
              )
            }
          >
            <Text style={styles.forgotText}>
              Forgot password?
            </Text>
          </Pressable>

          {/* SIGN IN */}

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.buttonPressed,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.signInText}>
              {loading
                ? 'Signing In...'
                : 'Sign In'}
            </Text>

            {!loading && (
              <Text style={styles.signInArrow}>
                →
              </Text>
            )}
          </Pressable>

          {/* OR */}

          <View style={styles.orRow}>

            <View style={styles.orLine} />

            <Text style={styles.orText}>
              OR
            </Text>

            <View style={styles.orLine} />

          </View>

          {/* GOOGLE + PHONE */}

          <View style={styles.socialRow}>

            {/* GOOGLE */}

            <Pressable
              style={({ pressed }) => [
                styles.googleButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleGoogleLogin}
            >
              <View style={styles.googleLogo}>
                <Svg
                  width={24}
                  height={24}
                  viewBox="0 0 48 48"
                >
                  <Path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.7 30.47.5 24 .5 14.62.5 6.51 5.88 2.56 13.73l7.98 6.19C12.46 13.99 17.74 9.5 24 9.5z"
                  />

                  <Path
                    fill="#34A853"
                    d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.65c-.55 2.97-2.27 5.49-4.84 7.18l7.83 6.08C44.21 37.91 46.5 31.78 46.5 24.5z"
                  />

                  <Path
                    fill="#FBBC05"
                    d="M10.54 28.08A14.45 14.45 0 0 1 9.5 24c0-1.42.36-2.79 1.04-4.08l-7.98-6.19A23.93 23.93 0 0 0 .5 24c0 3.86.92 7.5 2.55 10.27l7.49-6.19z"
                  />

                  <Path
                    fill="#EA4335"
                    d="M24 47.5c6.48 0 11.91-2.14 15.88-5.83l-7.83-6.08c-2.17 1.45-4.94 2.31-8.05 2.31-6.25 0-11.54-4.49-13.45-10.52l-7.49 6.19C6.51 42.12 14.62 47.5 24 47.5z"
                  />
                </Svg>
              </View>

              <Text style={styles.googleText}>
                Google
              </Text>
            </Pressable>

            {/* PHONE */}

            <Pressable
              style={({ pressed }) => [
                styles.phoneButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() =>
                router.push('/phonelogin')
              }
            >
              <Text style={styles.phoneIcon}>
                📞
              </Text>

              <Text style={styles.phoneText}>
                Phone
              </Text>
            </Pressable>

          </View>

          {/* REGISTER */}

          <View style={styles.registerRow}>

            <Text style={styles.registerText}>
              New to Aetherix?
            </Text>

            <Pressable
              onPress={() =>
                router.push('/register')
              }
            >
              <Text style={styles.createAccount}>
                Create an account
              </Text>
            </Pressable>

          </View>

          {/* TRUST */}

          <View style={styles.trustContainer}>

            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <Text style={styles.trustIconText}>
                  🛡
                </Text>
              </View>

              <Text style={styles.trustTitle}>
                Enterprise Grade
              </Text>

              <Text style={styles.trustText}>
                Bank-level security
              </Text>
            </View>

            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <Text style={styles.trustIconText}>
                  ☁
                </Text>
              </View>

              <Text style={styles.trustTitle}>
                99.9% Uptime
              </Text>

              <Text style={styles.trustText}>
                Always available
              </Text>
            </View>

            <View style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <Text style={styles.trustIconText}>
                  🌐
                </Text>
              </View>

              <Text style={styles.trustTitle}>
                Global Coverage
              </Text>

              <Text style={styles.trustText}>
                Worldwide data
              </Text>
            </View>

          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#020814',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width < 700 ? 18 : 45,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // =====================================================
  // CARD
  // =====================================================

  loginCard: {
    width: '100%',
    maxWidth: 650,
    paddingHorizontal: width < 500 ? 22 : 35,
    paddingTop: width < 500 ? 25 : 32,
    paddingBottom: 28,

    backgroundColor: '#061A32',

    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#1687FF',

    shadowColor: '#1687FF',
    shadowOpacity: 0.18,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 8,
  },

  // =====================================================
  // LOGO
  // =====================================================

  loginLogo: {
    width: 95,
    height: 95,
    alignSelf: 'center',
    marginBottom: 10,
  },

  // =====================================================
  // TITLE
  // =====================================================

  loginTitle: {
    fontSize: width < 500 ? 28 : 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },

  loginSubtitle: {
    color: '#8197B3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
  },

  loginAetherix: {
    color: '#299BFF',
    fontWeight: '700',
  },

  // =====================================================
  // INPUT LABEL
  // =====================================================

  fieldLabel: {
    marginTop: 19,
    marginBottom: 8,
    color: '#DCE8F5',
    fontSize: 13,
    fontWeight: '700',
  },

  // =====================================================
  // INPUT
  // =====================================================

  inputBox: {
    width: '100%',
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,

    borderRadius: 15,

    backgroundColor: '#081A30',

    borderWidth: 1,
    borderColor: 'rgba(80,135,190,0.32)',
  },

  inputIcon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 10,
    marginLeft: 6,
  },

  eyeButton: {
    padding: 8,
  },

  eyeIcon: {
    color: '#8EA8C3',
    fontSize: 20,
  },

  // =====================================================
  // FORGOT
  // =====================================================

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 11,
  },

  forgotText: {
    color: '#299BFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // =====================================================
  // SIGN IN
  // =====================================================

  signInButton: {
    width: '100%',
    minHeight: 58,

    marginTop: 22,

    borderRadius: 15,

    backgroundColor: '#087FF5',

    alignItems: 'center',
    justifyContent: 'center',
  },

  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  signInArrow: {
    position: 'absolute',
    right: 20,
    color: '#FFFFFF',
    fontSize: 24,
  },

  // =====================================================
  // OR
  // =====================================================

  orRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  orText: {
    marginHorizontal: 12,
    color: '#71849C',
    fontSize: 11,
    fontWeight: '600',
  },

  // =====================================================
  // GOOGLE + PHONE
  // =====================================================

  socialRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },

  googleButton: {
    flex: 1,
    height: 58,
    borderRadius: 15,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },

  googleLogo: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleText: {
    color: '#202124',
    fontSize: 18,
    fontWeight: '700',
  },

  phoneButton: {
    flex: 1,
    height: 58,
    borderRadius: 15,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#1768B5',

    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },

  phoneIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  phoneText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },

  // =====================================================
  // REGISTER
  // =====================================================

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  registerText: {
    color: '#71869F',
    fontSize: 13,
  },

  createAccount: {
    marginLeft: 5,
    color: '#299BFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // =====================================================
  // TRUST
  // =====================================================

  trustContainer: {
    width: '100%',
    marginTop: 27,
    paddingTop: 22,

    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.09)',

    flexDirection: 'row',
  },

  trustItem: {
    flex: 1,
    alignItems: 'center',
  },

  trustIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(20,130,255,0.09)',

    marginBottom: 7,
  },

  trustIconText: {
    fontSize: 19,
  },

  trustTitle: {
    color: '#D8E7F6',
    fontSize: width < 380 ? 9 : 10,
    fontWeight: '700',
    textAlign: 'center',
  },

  trustText: {
    marginTop: 3,
    color: '#60758D',
    fontSize: width < 380 ? 8 : 9,
    textAlign: 'center',
  },

  // =====================================================
  // BUTTON STATES
  // =====================================================

  buttonPressed: {
    opacity: 0.72,
  },

  disabledButton: {
    opacity: 0.6,
  },

});