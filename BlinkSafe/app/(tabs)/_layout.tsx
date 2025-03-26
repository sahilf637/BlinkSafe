import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("./(auth)/login");
      setAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (!authenticated) return null;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />, tabBarLabel: "Home" }} />
      <Tabs.Screen name="stats" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />, tabBarLabel: "Stats" }} />
      <Tabs.Screen name="safety" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />, tabBarLabel: "Safety" }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />, tabBarLabel: "Profile" }} />
    </Tabs>
  );
}
