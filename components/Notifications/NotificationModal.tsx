import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AlertType } from "@/types/types";
import { NotificationDetailModal } from "./NotificationDetailModal";

type AlertWithIndex = AlertType & { index: number };

export const NotificationModal = ({
  visible,
  onClose,
  isDark,
}: {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithIndex | null>(null);
  // const [first, setfirst] = useState(second)
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetch("https://farmvichardatabase.onrender.com/api/users/h8BfY08KoqFKxNOoQc9o/alerts/");
        const data = await response.json();
        setAlerts(data);
        // console.log(response, data)
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    getNotifications();
  }, []);


  const handleAlertPress = (alert: AlertType, index: number) => {
    // Mark the alert as read
    setAlerts((prev) =>
      prev.map((a, i) => (i === index ? { ...a, status: "read" } : a))
    );
    setSelectedAlert({ ...alert, index, status: "read" });
  };

  const closeDetail = () => {
    // Do not remove the alert from the list, just close the detail modal
    setSelectedAlert(null);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
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

        {/* Main Content */}
        <ScrollView className="flex-1 px-4 py-2">
          {alerts ? (
            alerts.map((alert, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAlertPress(alert, index)}
                className={`p-4 mb-3 rounded-2xl shadow-sm border
                  ${
                    isDark
                      ? "bg-neutral-900 border-neutral-700"
                      : "bg-white border-gray-200"
                  }
                  ${alert.status === "read" ? "opacity-50" : ""}
                `}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text
                    className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${
                        alert.alertType.toLowerCase() === "weather"
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : ""
                      }
                      ${
                        alert.alertType.toLowerCase() === "scheme"
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : ""
                      }
                      ${
                        alert.alertType.toLowerCase() === "pest"
                          ? "bg-red-500/20 text-red-600 dark:text-red-400"
                          : ""
                      }
                      ${
                        alert.alertType.toLowerCase() === "market"
                          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                          : ""
                      }
                      ${
                        alert.alertType.toLowerCase() === "irrigation"
                          ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                          : ""
                      }
                    `}
                  >
                    {alert.alertType}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={isDark ? "#aaa" : "gray"}
                  />
                </View>

                <Text
                  numberOfLines={2}
                  className={`text-sm mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {alert.message}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View className="flex-1 justify-center items-center mt-20">
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={isDark ? "gray" : "black"}
              />
              <Text
                className={`mt-2 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No new notifications
              </Text>
            </View>
          )}
        </ScrollView>

        <NotificationDetailModal
          visible={!!selectedAlert}
          onClose={closeDetail}
          isDark={isDark}
          alert={selectedAlert}
        />
      </SafeAreaView>
    </Modal>
  );
};
