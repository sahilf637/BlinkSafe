import { Tabs, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Add this callback for layout handling
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    const auth = getAuth();
    let unsubscribe: () => void;

    const initializeAuth = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setAuthenticated(!!user);
          if (!user) {
            router.replace("./(auth)/login");
          }
          // Set app ready regardless of auth state
          setAppIsReady(true);
        });
      } catch (error) {
        console.error('Initialization error:', error);
        setAppIsReady(true);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!appIsReady) {
    return null; // Keep showing splash screen
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs screenOptions={{ headerShown: false }}>
        {/* Your existing tab screens */}
        <Tabs.Screen 
          name="home" 
          options={{ 
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />, 
            tabBarLabel: "Home" 
          }} 
        />
        <Tabs.Screen 
          name="stats" 
          options={{ 
            tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />, 
            tabBarLabel: "Stats" 
          }} 
        />
        <Tabs.Screen 
          name="smartcare" 
          options={{ 
            tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" size={size} color={color} />, 
            tabBarLabel: "SmartCare" 
          }} 
        />
        <Tabs.Screen 
          name="safety" 
          options={{ 
            tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />, 
            tabBarLabel: "Safety" 
          }} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />, 
            tabBarLabel: "Profile" 
          }} 
        />
      </Tabs>
    </View>
  );
}