import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatbotScreen from "@/components/Chat/ChatBot";
import { LinearGradient } from "expo-linear-gradient";
import Chat from "@/components/Chat/Chat";
const chatbot = () => {
  return (
    <LinearGradient
      colors={["#65a66b", "#fff"]} // Gradient from red to blue
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* <Text>chatbot</Text> */}
          {/* <ChatbotScreen /> */}
          <Chat />
          {/* <Text>chatbot</Text> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default chatbot;

const styles = StyleSheet.create({});
// 65a66b