import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Weather {
  temperature: number;
  condition: string;
}

interface DashboardData {
  weather: Weather;
  pestRisk: number;
  gradingFactor: number;
  cropPrice: number;
}

const dummyData: DashboardData = {
  weather: { temperature: 25, condition: 'Sunny' },
  pestRisk: 15,
  gradingFactor: 8.5,
  cropPrice: 120.50,
};

const Dashboard = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('user_name');
      setUserName(name);
    };

    fetchUserName();
  }, []);
useEffect(() => {
  const fetchUserName = async () => {
    const name = await AsyncStorage.getItem('user_name');
    console.log("Loaded user_name:", name); // ✅ Debug
    setUserName(name);
  };

  fetchUserName();
}, []);
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 bg-white/40 dark:bg-black/70 px-4">
        {/* User greeting */}
        {userName && (
          <Text className="text-xl font-semibold text-center text-black dark:text-white mt-4">
            Welcome, {userName} 👋
          </Text>
        )}
        <Text>{userName}</Text>
        <Text className="text-2xl font-bold mb-4 text-center text-black dark:text-white mt-2">
          Dashboard
        </Text>

        <View className="bg-white/90 dark:bg-zinc-800/90 p-4 rounded-2xl mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-2 text-black dark:text-white">Current Weather</Text>
          <Text className="text-base text-gray-600 dark:text-gray-300">
            {dummyData.weather.temperature}°C - {dummyData.weather.condition}
          </Text>
        </View>

        <View className="bg-white/90 dark:bg-zinc-800/90 p-4 rounded-2xl mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-2 text-black dark:text-white">Pest Risk</Text>
          <Text className="text-base text-red-600 dark:text-red-400 mb-2">{dummyData.pestRisk}%</Text>
          <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <View
              className="bg-red-500 dark:bg-red-400 h-4 rounded-full"
              style={{ width: `${dummyData.pestRisk}%` }}
            />
          </View>
        </View>

        <View className="bg-white/90 dark:bg-zinc-800/90 p-4 rounded-2xl mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-2 text-black dark:text-white">Grading Factor</Text>
          <Text className="text-base text-gray-600 dark:text-gray-300">{dummyData.gradingFactor}/10</Text>
        </View>

        <View className="bg-white/90 dark:bg-zinc-800/90 p-4 rounded-2xl mb-4 shadow-md">
          <Text className="text-lg font-semibold mb-2 text-black dark:text-white">Crop Price</Text>
          <Text className="text-base text-green-600 dark:text-green-400">${dummyData.cropPrice} per unit</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
