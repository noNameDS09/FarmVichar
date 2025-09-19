import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ProfileInfoForm from '../components/Forms/ProfileInfoForm';

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();

  const loadProfile = async () => {
    const data = await AsyncStorage.getItem('profile_info');
    if (data) {
      setProfileData(JSON.parse(data));
    } else {
      setProfileData(null);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Profile</Text>
        <View className="w-10" /> {/* Spacer for center alignment */}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        {profileData ? (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            {/* Profile Header */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full items-center justify-center mb-3">
                <Ionicons name="person" size={40} color="#4F46E5" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.fullName || 'N/A'}</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">Farmer</Text>
            </View>

            {/* Profile Details */}
            <View className="space-y-4">
              <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Ionicons name="call" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Phone: {profileData.phone || 'N/A'}</Text>
              </View>

              <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Age: {profileData.age || 'N/A'}</Text>
              </View>

              <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Ionicons name="school" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Education Level: {profileData.educationLevel || 'N/A'}</Text>
              </View>

              <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Ionicons name="leaf" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Farming Experience: {profileData.farmingExperienceYears || 'N/A'} years</Text>
              </View>

              <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Ionicons name="person" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Gender: {profileData.gender || 'N/A'}</Text>
              </View>

              <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Ionicons name="language" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Preferred Language: {profileData.preferredLanguage || 'N/A'}</Text>
              </View>
            </View>
          </View>
        ) : (
          <ProfileInfoForm onSubmitSuccess={loadProfile} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
