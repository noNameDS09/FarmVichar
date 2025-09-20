import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityCard from "./ActivityCard";
import AddLogForm from "./AddLogForm";

interface Log {
  id: string;
  farmId: string;
  activityType: string;
  description: string;
  timestamp: string;
  geoLocation?: string | null;
}

interface Farm {
  id: string;
  village: string;
  district: string;
}

export default function ActivityScreen() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchLogsForFarm = async (farmId: string): Promise<Log[] | null> => {
    // ... (This function remains unchanged)
    try {
      const logsResponse = await fetch(
        `https://farmvichardatabase.onrender.com/api/farms/${farmId}/logs/`
      );
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData);
        return logsData;
      } else {
        console.warn("Could not fetch logs for farm:", logsResponse.status);
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setError("Failed to fetch logs.");
    }
    return null;
  };
  
  useEffect(() => {
    // ... (This function remains unchanged)
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userInfoString = await AsyncStorage.getItem("user_info");
        if (!userInfoString) throw new Error("User not logged in.");
        const userInfo = JSON.parse(userInfoString);
        setUserId(userInfo.id);

        const farmsResponse = await fetch(
          `https://farmvichardatabase.onrender.com/api/users/${userInfo.id}/farms/`
        );
        if (farmsResponse.ok) {
          const farmsData = await farmsResponse.json();
          setFarms(farmsData);
          if (farmsData.length > 0) {
            const firstFarmId = farmsData[0].id;
            setSelectedFarmId(firstFarmId);
            const initialLogs = await fetchLogsForFarm(firstFarmId);

            if (initialLogs && initialLogs.length > 0) {
              const mostRecentTimestamp = initialLogs[0].timestamp;
              if (mostRecentTimestamp) {
                setSelectedDate(mostRecentTimestamp.split("T")[0]);
              }
            }
          } else {
            setLogs([]);
          }
        } else {
          setFarms([]);
          setLogs([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    // ... (This function remains unchanged)
    return logs.filter((item) => {
      if (!item.timestamp) return false;
      const logDate = item.timestamp.split("T")[0];
      return logDate === selectedDate;
    });
  }, [logs, selectedDate]);

  // ✅ This function now performs the optimistic update
  const handleLogAdded = (newLog: Log) => {
    // 1. Close the modal
    setModalVisible(false);

    // 2. Instantly add the new log to the top of the list in the UI
    setLogs((currentLogs) => [newLog, ...currentLogs]);

    // 3. (Optional but recommended) After a short delay, re-fetch from the database
    // to ensure full consistency with the backend.
    setTimeout(() => {
      if (selectedFarmId) {
        fetchLogsForFarm(selectedFarmId);
      }
    }, 2000); // 2-second delay to give the backend time
  };

  const handleFarmChange = async (farmId: string) => {
    // ... (This function remains unchanged)
    if (!farmId || farmId === selectedFarmId) return;
    setSelectedFarmId(farmId);
    setLoading(true);
    await fetchLogsForFarm(farmId);
    setLoading(false);
  };
  
  // The rest of the file (return statement and styles) is exactly the same
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text>Loading activities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "blue",
              },
            }}
            key={selectedDate}
            current={selectedDate}
            style={styles.calendar}
          />
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Logs for {selectedDate}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {farms.length > 0 && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFarmId}
              style={styles.picker}
              onValueChange={(itemValue) => handleFarmChange(itemValue)}
            >
              {farms.map((farm) => (
                <Picker.Item
                  key={farm.id}
                  label={`${farm.village}, ${farm.district}`}
                  value={farm.id}
                />
              ))}
            </Picker>
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => <ActivityCard key={item.id} {...item} />)
          ) : (
            <Text style={styles.noLogsText}>No logs for this date.</Text>
          )}
        </ScrollView>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <AddLogForm
          farmId={selectedFarmId}
          selectedDate={selectedDate}
          userId={userId}
          onLogAdded={handleLogAdded}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    content: { flex: 1 },
    calendarContainer: {
      paddingHorizontal: 16,
      paddingVertical: 4,
      paddingTop: 0,
    },
    calendar: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e3e3e3",
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 2,
      elevation: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    heading: { fontSize: 18, fontWeight: "600" },
    addButton: {
      backgroundColor: "#10B981",
      borderRadius: 50,
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    noLogsText: { textAlign: "center", color: "gray", marginTop: 16 },
    pickerContainer: {
      marginHorizontal: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 8,
      backgroundColor: "#fff",
    },
    picker: { height: 50, width: "100%" },
  });