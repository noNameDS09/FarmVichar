import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ActivityScreen from "@/components/ActivityLog/ActivityScreen";
import { SafeAreaView } from "react-native-safe-area-context";
const activitylog = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <ActivityScreen />
      </View>
    </SafeAreaView>
  );
};

export default activitylog;

const styles = StyleSheet.create({});
