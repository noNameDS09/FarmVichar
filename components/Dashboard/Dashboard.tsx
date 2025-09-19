import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

interface PriceRange {
  crop_name: string
  min_price: number
  max_price: number
}

interface Predictions {
  recommended_crop: string
  yield_prediction_kg_acre: number
  pest_risk_percent: number
  quality_grading_score: number
  price_range_per_quintal: PriceRange
  applicable_schemes: string[]
  applied_schemes: string[]
}

interface Farmer {
  name: string
  location: string
  farm_size_acres: number
}

interface DashboardProps {
  predictions: Predictions
  farmer?: Farmer
}

const Dashboard: React.FC<DashboardProps> = ({ predictions, farmer }) => {
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4">Dashboard</Text>

        {farmer && (
          <View className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-xl font-semibold mb-2">Farmer Information</Text>
            <Text className="text-base">Name: {farmer.name}</Text>
            <Text className="text-base">Location: {farmer.location}</Text>
            <Text className="text-base">Farm Size: {farmer.farm_size_acres} acres</Text>
          </View>
        )}

        <View className="flex-row flex-wrap justify-between">
          <View className="w-1/2 p-2">
            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Text className="text-lg font-semibold">Recommended Crop</Text>
              <Text className="text-base">{predictions.recommended_crop}</Text>
            </View>
          </View>

          <View className="w-1/2 p-2">
            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Text className="text-lg font-semibold">Yield Prediction</Text>
              <Text className="text-base">{predictions.yield_prediction_kg_acre} kg/acre</Text>
            </View>
          </View>

          <View className="w-full p-2">
            <View className="bg-red-50 p-4 rounded-lg border border-red-200">
              <Text className="text-lg font-semibold">Pest Risk</Text>
              <Text className="text-base">{predictions.pest_risk_percent}%</Text>
            </View>
          </View>

          <View className="w-1/2 p-2">
            <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <Text className="text-lg font-semibold">Quality Score</Text>
              <Text className="text-base">{predictions.quality_grading_score}</Text>
            </View>
          </View>

          <View className="w-1/2 p-2">
            <View className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Text className="text-lg font-semibold">Price Range</Text>
              <Text className="text-base">
                {predictions.price_range_per_quintal.crop_name}: ₹{predictions.price_range_per_quintal.min_price} - ₹{predictions.price_range_per_quintal.max_price}
              </Text>
            </View>
          </View>

          <View className="w-full p-2">
            <View className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Text className="text-lg font-semibold">Applicable Schemes</Text>
              {predictions.applicable_schemes.length > 0 ? (
                predictions.applicable_schemes.map((scheme, index) => (
                  <Text key={index} className="text-base">- {scheme}</Text>
                ))
              ) : (
                <Text className="text-base">None</Text>
              )}
            </View>
          </View>

          <View className="w-full p-2">
            <View className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <Text className="text-lg font-semibold">Applied Schemes</Text>
              {predictions.applied_schemes.length > 0 ? (
                predictions.applied_schemes.map((scheme, index) => (
                  <Text key={index} className="text-base">- {scheme}</Text>
                ))
              ) : (
                <Text className="text-base">None</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard
