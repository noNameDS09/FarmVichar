import { Text, View } from "react-native";

export default function ActivityLog() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-2xl">Logs</Text>
    </View>
  );
}