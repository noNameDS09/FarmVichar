import { NotificationModal } from "@/components/Notifications/NotificationModal";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Home from "../../components/Home/Home";
import ProfileDrawer from "../../components/Profile/ProfileDrawer";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const drawerRef = useRef<DrawerLayout>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const renderDrawer = () => (
    <ProfileDrawer
      onClose={() => drawerRef.current?.closeDrawer()}
      onLogout={() => console.log("🔒 Logout handled in ProfileDrawer")}
      isLoggingOut={false}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={250}
        drawerPosition="right"
        renderNavigationView={renderDrawer}
        onDrawerOpen={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: isDark ? "black" : "white" }}
        >
          <StatusBar style={isDark ? "light" : "dark"} />

          <ScrollView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{
                    position: "relative",
                    borderRadius: 50,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: isDark ? "#c2c2c2" : "#4a4b4d",
                  }}
                >
                  <Ionicons
                    name="notifications"
                    size={18}
                    color={isDark ? "#c2c2c2" : "#4a4b4d"}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "red",
                    }}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: isDark ? "white" : "black",
                  }}
                >
                  FarmVichar
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    drawerRef.current?.openDrawer();
                  }}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={35}
                    color={isDark ? "#c2c2c2" : "#333333"}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View
                style={{
                  backgroundColor: isDark ? "#333" : "#f0f0f0",
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  marginTop: 20,
                }}
              >
                <Ionicons
                  name="search"
                  size={30}
                  color={isDark ? "gray" : "black"}
                />
                <TextInput
                  placeholder="Upcoming Farm schemes..."
                  placeholderTextColor={isDark ? "gray" : "black"}
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 16,
                    color: isDark ? "white" : "black",
                  }}
                />
              </View>

              {/* Weather Info */}
              <ImageBackground
                source={{
                  uri: "https://plus.unsplash.com/premium_vector-1723658879791-519ef702df40?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0",
                }}
                style={{
                  width: "100%",
                  height: 400,
                  borderRadius: 15,
                  marginTop: 20,
                  overflow: "hidden",
                }}
                resizeMode="cover"
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: isDark
                      ? "rgba(45,45,45,0.7)"
                      : "rgba(245,245,245,0.5)",
                    padding: 24,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, color: isDark ? "white" : "black" }}
                  >
                    Kochi
                  </Text>
                  <Text
                    style={{
                      fontSize: 48,
                      fontWeight: "bold",
                      color: isDark ? "white" : "black",
                    }}
                  >
                    25°C
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 16,
                      color: isDark ? "lightgray" : "#4F200D",
                    }}
                  >
                    Mostly sunny
                  </Text>
                  <Text
                    style={{
                      marginTop: 16,
                      fontSize: 16,
                      fontStyle: "italic",
                      color: isDark ? "white" : "#4F200D",
                      textAlign: "center",
                    }}
                  >
                    "Keep your paddy well-watered on sunny days to protect the crop"
                  </Text>
                </View>
              </ImageBackground>

              {/* Home Component */}
              <Home />
            </View>
          </ScrollView>
        </SafeAreaView>
      </DrawerLayout>

      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isDark={isDark}
      />
    </GestureHandlerRootView>
  );
}
