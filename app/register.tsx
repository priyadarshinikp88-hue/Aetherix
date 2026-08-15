import React, { useState } from 'react';
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

const API_URL = 'https://aetherix-backend-eoj8.onrender.com/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Check all fields
    if (
      name.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      Alert.alert('Missing Information', 'Please fill all fields.');
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Registration Successful',
          data.message || 'Account created successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ],
        );
      } else {
        Alert.alert(
          'Registration Failed',
          data.message || 'Unable to create account.',
        );
      }
    } catch (error) {
      console.error('Registration error:', error);

      Alert.alert(
        'Server Error',
        'Unable to connect to the server. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <Text style={styles.brand}>
            AETHERIX
          </Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join our AI Weather Forecast Platform and receive
            accurate weather predictions, live alerts and
            smart insights.
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#8a96a6"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />

          {/* Email */}
          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#8a96a6"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* Password */}
          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#8a96a6"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {/* Confirm Password */}
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#8a96a6"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          {/* Register */}
          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              loading && styles.disabledButton,
              pressed && !loading && styles.pressed,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </Pressable>

          {/* Back to Login */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/login')}
            disabled={loading}
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
    maxWidth: 520,
    padding: 28,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },

  logo: {
    width: 80,
    height: 80,
  },

  brand: {
    textAlign: 'center',
    color: '#2864e6',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 22,
  },

  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 25,
  },

  label: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    width: '100%',
    height: 54,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
    fontSize: 16,
    marginBottom: 17,
  },

  registerButton: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#2864e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  registerButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },

  backButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  

  disabledButton: {
    opacity: 0.6,
  },

  pressed: {
    opacity: 0.75,
  },
});