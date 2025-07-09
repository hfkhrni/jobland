import { ConvexAuthProvider } from "@convex-dev/auth/react";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Platform, View } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const createRobustStorage = () => {
  const storage = {
    getItem: async (key: string) => {
      try {
        if (Platform.OS !== "web") {
          const secureValue = await SecureStore.getItemAsync(key);
          if (secureValue) return secureValue;
        }

        const asyncValue = await AsyncStorage.getItem(key);
        return asyncValue;
      } catch (error) {
        console.warn(`Storage getItem error for key ${key}:`, error);
        return null;
      }
    },

    setItem: async (key: string, value: string) => {
      try {
        const promises = [];

        if (Platform.OS !== "web") {
          promises.push(
            SecureStore.setItemAsync(key, value).catch((err) =>
              console.warn("SecureStore setItem failed:", err)
            )
          );
        }

        promises.push(
          AsyncStorage.setItem(key, value).catch((err) =>
            console.warn("AsyncStorage setItem failed:", err)
          )
        );

        await Promise.allSettled(promises);
      } catch (error) {
        console.warn(`Storage setItem error for key ${key}:`, error);
      }
    },

    removeItem: async (key: string) => {
      try {
        const promises = [];

        if (Platform.OS !== "web") {
          promises.push(
            SecureStore.deleteItemAsync(key).catch((err) =>
              console.warn("SecureStore removeItem failed:", err)
            )
          );
        }

        promises.push(
          AsyncStorage.removeItem(key).catch((err) =>
            console.warn("AsyncStorage removeItem failed:", err)
          )
        );

        await Promise.allSettled(promises);
      } catch (error) {
        console.warn(`Storage removeItem error for key ${key}:`, error);
      }
    },
  };

  return storage;
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const robustStorage = createRobustStorage();

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={robustStorage}>
      <RootNavigator />
      <Toast />
    </ConvexAuthProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;

function RootNavigator() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const hasMounted = useRef(false);

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (isLoading || !isColorSchemeLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkColorScheme ? "#000" : "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen
            name="(auth)/sign-in"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
