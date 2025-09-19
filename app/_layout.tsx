import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginForm from "@/components/Forms/LoginForm";
import { View, ActivityIndicator, Text } from "react-native";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDark ? "black" : "white" }}>
        <ActivityIndicator size="large" color={isDark ? "#c2c2c2" : "#212121"} />
        <Text style={{ marginTop: 10, color: isDark ? "white" : "black" }}>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={checkLoginStatus} />;
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
