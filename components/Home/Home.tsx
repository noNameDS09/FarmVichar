import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ padding: 16, backgroundColor: isDark ? "black" : "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: isDark ? "white" : "black" }}>
        KrishiSakhi: AI-Powered Personal Farming Assistant
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 12, color: isDark ? "white" : "black" }}>
        Executive Summary
      </Text>
      <Text numberOfLines={3} ellipsizeMode="tail" style={{ fontSize: 14, lineHeight: 20, color: isDark ? "white" : "black" }}>
        Indian agriculture stands at a critical juncture. It is the backbone of the national economy, yet the majority of its practitioners—over 100 million small and marginal farmers—are ensnared in a web of interconnected challenges spanning economic distress, climate volatility, and infrastructural deficits. The existing digital landscape, while burgeoning, remains a fragmented ecosystem of single-purpose government applications and commercially-focused private platforms. This creates a significant gap in the market for a truly integrated, farmer-centric solution.
      </Text>
      <View style={{ marginTop: 8, marginLeft: 12 }}>
        <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "white" : "black" }}>• Personalized, predictive, and prescriptive advisory</Text>
        <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "white" : "black" }}>• Seamless access to quality inputs and services</Text>
        <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "white" : "black" }}>• Integrated financial services, including credit and insurance</Text>
        <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "white" : "black" }}>• Transparent market linkages for fair price realization</Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginTop: 12 }}>
        <Text style={{ color: isDark ? "#03e3fc":"blue", fontWeight: "bold" }}>Learn more about us... </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#212121" : "white" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: isDark ? "#d1cfcf" : "black" }}>
              About Us
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={isDark ? "#c2c2c2" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1, backgroundColor: isDark ? "#212121" : "white" }}>
            <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: isDark ? "white" : "black" }}>
                KrishiSakhi: AI-Powered Personal Farming Assistant
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 12, color: isDark ? "white" : "black" }}>
                Executive Summary
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "#d1cfcf" : "black" }}>
                Indian agriculture stands at a critical juncture. It is the backbone of the national economy, yet the majority of its practitioners—over 100 million small and marginal farmers—are ensnared in a web of interconnected challenges spanning economic distress, climate volatility, and infrastructural deficits. The existing digital landscape, while burgeoning, remains a fragmented ecosystem of single-purpose government applications and commercially-focused private platforms. This creates a significant gap in the market for a truly integrated, farmer-centric solution.
              </Text>
              <View style={{ marginTop: 8, marginLeft: 12 }}>
                <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "#d1cfcf" : "black" }}>• Personalized, predictive, and prescriptive advisory</Text>
                <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "#d1cfcf" : "black" }}>• Seamless access to quality inputs and services</Text>
                <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "#d1cfcf" : "black" }}>• Integrated financial services, including credit and insurance</Text>
                <Text style={{ fontSize: 14, lineHeight: 20, color: isDark ? "#d1cfcf" : "black" }}>• Transparent market linkages for fair price realization</Text>
              </View>
              <Text style={{ fontSize: 14, lineHeight: 20, marginTop: 12, color: isDark ? "#d1cfcf" : "black" }}>
                This report presents a strategic blueprint for the development of an AI-powered personal farming assistant designed to fill this void. The core strategic recommendation is to move beyond the current paradigm of simple information delivery and build a full-stack, hyper-localized, conversational AI platform. This platform will serve as an indispensable partner for the farmer, guiding them through every stage of the crop lifecycle, from pre-sowing planning to post-harvest sales.
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 20, marginTop: 12, color: isDark ? "#d1cfcf" : "black" }}>
                The analysis reveals that the key to unlocking this market lies in addressing the fundamental barriers to technology adoption: digital literacy and trust. Therefore, the proposed solution is architected around a voice-first, vernacular, conversational interface, making advanced agricultural intelligence as accessible as a simple conversation. This AI core will unify four critical pillars of the agricultural value chain: (1) personalized, predictive, and prescriptive advisory; (2) seamless access to quality inputs and services; (3) integrated financial services, including credit and insurance; and (4) transparent market linkages for fair price realization.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
