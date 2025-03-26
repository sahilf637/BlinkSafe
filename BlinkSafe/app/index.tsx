import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { welcomeStyles } from "../styles/wellcomeStyles";

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          router.replace("./(tabs)/home"); // User is authenticated
        } else {
          router.replace("./(auth)/login"); // No user, go to login
        }
      }, 2000);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // Show nothing while checking auth

  return (
    <Animated.View 
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={welcomeStyles.container}
    >
      <Image source={require("../assets/logo.jpeg")} style={welcomeStyles.logo} resizeMode="contain" />
    </Animated.View>
  );
}
