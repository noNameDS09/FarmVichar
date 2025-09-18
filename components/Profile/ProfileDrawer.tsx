import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Appearance, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileDrawer({ onClose, onLogout, isLoggingOut }: { onClose: () => void; onLogout: () => void; isLoggingOut: boolean }) {
  // Set the color scheme state to accept 'dark', 'light', or undefined initially
  const [colorScheme, setColorSchemeState] = useState<
    "dark" | "light" | undefined
  >(undefined);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");

      if (savedTheme) {
        setColorSchemeState(savedTheme as "dark" | "light");
        Appearance.setColorScheme(savedTheme as "dark" | "light");
      } else {
        setColorSchemeState("light");
        Appearance.setColorScheme("light");
      }
    };

    loadTheme();
  }, []);

  // Save theme preference to AsyncStorage
  const saveTheme = async (theme: "dark" | "light") => {
    await AsyncStorage.setItem("theme", theme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    Appearance.setColorScheme(newScheme);
    setColorSchemeState(newScheme);
    saveTheme(newScheme); // Save the updated theme preference
  };

  const Logout = async () => {
    await onLogout();
    onClose();
  };

  // Render appropriate icon based on the current theme
  const themeIcon =
    colorScheme === "dark" ? (
      <Feather name="sun" size={24} color="white" />
    ) : (
      <Feather name="moon" size={24} color="black" />
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-zinc-900 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-black dark:text-white">
          Menu
        </Text>
        <TouchableOpacity onPress={toggleTheme}>{themeIcon}</TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mb-4"
        onPress={() => alert("Profile pressed")}
      >
        <Text className="text-lg text-black dark:text-white">Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mb-4"
        onPress={() => alert("Edit Profile pressed")}
      >
        <Text className="text-lg text-black dark:text-white">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={Logout}>
        <Text className="text-red-500 mt-6">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text className="text-red-500 mt-6">Close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
