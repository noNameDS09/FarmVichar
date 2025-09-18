import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Modal,
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
import Home from "../../components/Home/Home";
import ProfileDrawer from "../../components/Profile/ProfileDrawer";
import MyForm from "@/components/Home/Login";
const NotificationModal = ({
  visible,
  onClose,
  isDark,
}: {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: isDark ? "black" : "white" }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDark ? "white" : "black",
            }}
          >
            Notifications
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "#c2c2c2" : "black"}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: isDark ? "gray" : "black" }}>
            No new notifications
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const drawerRef = useRef<DrawerLayout>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const renderDrawer = () => (
    <ProfileDrawer onClose={() => drawerRef.current?.closeDrawer()} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
  );
  
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("access_token");
    const userName = await AsyncStorage.getItem("user_name");

    if (token) {
      setIsLoggedIn(true);
      console.log("✅ Logged in as:", userName);
    } else {
      setIsLoggedIn(false);
      console.log("🔒 Not logged in");
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay to simulate logout
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("user_name");
    setIsLoggedIn(false);
    setIsLoggingOut(false);
    console.log("🔒 Logged out");
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (!isLoggedIn) {
    return <MyForm onLoginSuccess={checkLoginStatus} />;
  }

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
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Ionicons
                    name="notifications"
                    size={25}
                    color={isDark ? "#c2c2c2" : "black"}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: isDark ? "white" : "black",
                  }}
                >
                  KrishiVichar
                </Text>
                <TouchableOpacity
                  onPress={() => drawerRef.current?.openDrawer()}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={35}
                    color={isDark ? "#c2c2c2" : "black"}
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
                  placeholder="Upcoming krishi schemes..."
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
                  uri: "https://plus.unsplash.com/premium_vector-1723658879791-519ef702df40?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                style={{
                  width: "100%",
                  height: 300, // Adjust this to fit your needs
                  borderRadius: 15,
                  marginTop: 20,
                  overflow: "hidden", // Ensures children respect borderRadius
                }}
                resizeMode="cover"
              >
                {/* Overlay: Location and Weather Details */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: isDark
                      ? "rgba(45,45,45,0.7)"
                      : "rgba(245,245,245,0.5)", // semi-transparent background
                    padding: 24,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, color: isDark ? "white" : "black" }}
                    className="font-bold "
                  >
                    Kochi
                  </Text>
                  <Text
                    style={{
                      fontSize: 48,
                      fontWeight: "bold",
                      color: isDark ? "white" : "black",
                    }}
                    className="font-bold"
                  >
                    25°C
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 16,
                      color: isDark ? "lightgray" : "#4F200D",
                      // fontWeight: "800"
                    }}
                    className="font-bold"
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
                    className="font-bold"
                  >
                    "Keep your paddy well-watered on sunny days to protect the
                    crop"
                  </Text>
                </View>
              </ImageBackground>
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
