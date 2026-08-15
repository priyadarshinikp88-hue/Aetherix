import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        initialRouteName="login-ui"
        screenOptions={{
          headerShown: false,
        }}
      >

        {/* FIRST PAGE */}
        <Stack.Screen
          name="login-ui"
          options={{
            headerShown: false,
          }}
        />

        {/* LOGIN CARD */}
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />

        {/* PHONE LOGIN */}
        <Stack.Screen
          name="phonelogin"
          options={{
            headerShown: false,
          }}
        />

        {/* REGISTER */}
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />

        {/* MAIN APP */}
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />

        {/* TABS */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />

      </Stack>

      <StatusBar style="light" />
    </ThemeProvider>
  );
}