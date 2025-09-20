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

        {/* Sowed Crop */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 mr-2">
            <Text className="text-base font-medium text-green-800">Sowed Crop</Text>
          </View>
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4">
            <Text className="text-lg">{predictions.recommended_crop}</Text>
          </View>
        </View>

        {/* Pest Risks */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 mr-2">
            <Text className="text-base font-medium text-green-800">Pest Risks</Text>
          </View>
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4">
            <Text className="text-lg">{predictions.pest_risk_percent}%</Text>
          </View>
        </View>

        {/* Grading Score */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 mr-2">
            <Text className="text-base font-medium text-green-800">Grading Score</Text>
          </View>
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4">
            <Text className="text-lg">{predictions.quality_grading_score}</Text>
          </View>
        </View>

        {/* Price Range */}
        <View className="flex-row mb-4">
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 mr-2">
            <Text className="text-base font-medium text-green-800">Price Range</Text>
          </View>
          <View className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4">
            <Text className="text-lg">
              {predictions.price_range_per_quintal.crop_name}: ₹
              {predictions.price_range_per_quintal.min_price} - ₹
              {predictions.price_range_per_quintal.max_price}
            </Text>
          </View>
        </View>

        {/* Applicable Schemes */}
        <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <Text className="text-base font-medium text-green-800 mb-2">
            Applicable Schemes
          </Text>
          {predictions.applicable_schemes.length > 0 ? (
            predictions.applicable_schemes.map((scheme, index) => (
              <Text key={index} className="text-lg">- {scheme}</Text>
            ))
          ) : (
            <Text className="text-lg">None</Text>
          )}
        </View>

        {/* Applied Schemes */}
        <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <Text className="text-base font-medium text-green-800 mb-2">
            Applied Schemes
          </Text>
          {predictions.applied_schemes.length > 0 ? (
            predictions.applied_schemes.map((scheme, index) => (
              <Text key={index} className="text-lg">- {scheme}</Text>
            ))
          ) : (
            <Text className="text-lg">None</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard