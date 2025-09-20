import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface UserProfile {
  fullName: string;
  phone: string;
  age: number;
  gender: string;
  educationLevel: string;
  farmingExperienceYears: number;
  id: string;
}

interface Farm {
  village: string;
  taluka: string;
  district: string;
  state: string;
  pinCode: string;
  totalFarmArea: number;
  soilType: string;
  waterSource: string;
  irrigationMethod: string;
  climateNotes: string;
  id: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userInfoString = await AsyncStorage.getItem("user_info");
      if (!userInfoString) {
        throw new Error("User not logged in.");
      }
      const userInfo = JSON.parse(userInfoString);
      const userId = userInfo.id;

      const [profileResponse, farmsResponse] = await Promise.all([
        fetch(`https://farmvichardatabase.onrender.com/api/users/${userId}`),
        fetch(`https://farmvichardatabase.onrender.com/api/users/${userId}/farms/`),
      ]);

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile data.");
      }
      const profileData: UserProfile = await profileResponse.json();
      setProfile(profileData);

      if (farmsResponse.ok) {
        const farmsData: Farm[] = await farmsResponse.json();
        setFarms(farmsData);
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderLoadingState = () => (
    <View style={styles.centered}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centered}>
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={80} color="#EF4444" />
        <Text style={styles.errorText}>
          {error || "Something went wrong. Please try again later."}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDetailRow = (
    iconName: keyof typeof Ionicons.glyphMap,
    iconColor: string,
    label: string,
    value: string | number
  ) => (
    <View style={styles.detailRow}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Quick Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{farms.length}</Text>
          <Text style={styles.statLabel}>Farms</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {farms.reduce((total, farm) => total + farm.totalFarmArea, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Acres</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {profile?.farmingExperienceYears || 0}
          </Text>
          <Text style={styles.statLabel}>Years Exp.</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <SafeAreaView style={styles.container}>{renderLoadingState()}</SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={styles.container}>{renderErrorState()}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      {/* <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </LinearGradient> */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {profile && (
            <>
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <LinearGradient
                    colors={['#10B981', '#34D399']}
                    style={styles.avatar}
                  >
                    <Ionicons name="person" size={50} color="white" />
                  </LinearGradient>
                  <View style={styles.profileInfo}>
                    <Text style={styles.userName}>{profile.fullName}</Text>
                    <Text style={styles.userSubtitle}>Farmer & Agriculture Enthusiast</Text>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                </View>
              </View>

              {renderStatsCard()}

              <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.detailsContent}>
                  {renderDetailRow(
                    "call-outline",
                    "#059669",
                    "Phone Number",
                    profile.phone
                  )}
                  {renderDetailRow(
                    "person-outline",
                    "#3B82F6",
                    "Age & Gender",
                    `${profile.age} years • ${profile.gender}`
                  )}
                  {renderDetailRow(
                    "school-outline",
                    "#8B5CF6",
                    "Education Level",
                    profile.educationLevel || "Not specified"
                  )}
                  {renderDetailRow(
                    "trending-up-outline",
                    "#F59E0B",
                    "Farming Experience",
                    `${profile.farmingExperienceYears} years`
                  )}
                </View>
              </View>
            </>
          )}

          <View style={styles.farmsSection}>
            <View style={styles.farmsSectionHeader}>
              <Text style={styles.sectionTitle}>My Farms</Text>
              {farms.length > 0 && (
                <TouchableOpacity style={styles.addFarmButton}>
                  <Ionicons name="add" size={20} color="#10B981" />
                </TouchableOpacity>
              )}
            </View>

            {farms.length > 0 ? (
              farms.map((farm, index) => (
                <Animated.View
                  key={farm.id}
                  style={[
                    styles.farmCard,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 + index * 10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.farmHeader}>
                    <View>
                      <Text style={styles.farmName}>{farm.village}</Text>
                      <Text style={styles.farmLocation}>
                        {farm.taluka}, {farm.state} • {farm.pinCode}
                      </Text>
                    </View>
                    <View style={styles.farmArea}>
                      <Text style={styles.farmAreaNumber}>{farm.totalFarmArea}</Text>
                      <Text style={styles.farmAreaUnit}>acres</Text>
                    </View>
                  </View>

                  <View style={styles.farmDetails}>
                    {renderDetailRow(
                      "layers-outline",
                      "#8B5CF6",
                      "Soil Type",
                      farm.soilType
                    )}
                    {renderDetailRow(
                      "water-outline",
                      "#06B6D4",
                      "Water & Irrigation",
                      `${farm.waterSource} • ${farm.irrigationMethod}`
                    )}
                  </View>

                  <TouchableOpacity style={styles.viewFarmButton}>
                    <Text style={styles.viewFarmButtonText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={18} color="#10B981" />
                  </TouchableOpacity>
                </Animated.View>
              ))
            ) : (
              <View style={styles.emptyStateCard}>
                <LinearGradient
                  colors={['#F0FDF4', '#DCFCE7']}
                  style={styles.emptyStateContent}
                >
                  <Ionicons name="leaf-outline" size={60} color="#10B981" />
                  <Text style={styles.emptyTitle}>No Farms Added Yet</Text>
                  <Text style={styles.emptyDescription}>
                    Start your farming journey by adding your first farm details
                  </Text>
                  <Link href="/add-farm" asChild>
                    <TouchableOpacity style={styles.addFirstFarmButton}>
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.buttonGradient}
                      >
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.addFirstFarmText}>Add Your First Farm</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Link>
                </LinearGradient>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  content: {
    marginTop: -10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  errorText: {
    marginTop: 20,
    marginBottom: 30,
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 10,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  verifiedText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  detailsContent: {
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 16,
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  farmsSection: {
    marginBottom: 20,
  },
  farmsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addFarmButton: {
    backgroundColor: "#F0FDF4",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  farmCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  farmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  farmName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  farmLocation: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  farmArea: {
    alignItems: "flex-end",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  farmAreaNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
  },
  farmAreaUnit: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
    
  },
  farmDetails: {
    marginBottom: 16,
  },
  viewFarmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  viewFarmButtonText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
    marginRight: 8,
  },
  emptyStateCard: {
    marginTop: 20,
  },
  emptyStateContent: {
    alignItems: "center",
    padding: 40,
    borderRadius: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  addFirstFarmButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addFirstFarmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});