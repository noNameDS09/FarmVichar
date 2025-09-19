import { View, Text } from 'react-native'
import { MotiView } from 'moti'

type ActivityProps = {
  farmId: string
  activityType: string
  description: string
  geoLocation: any | null
  id: string
  timestamp: string
}

export default function ActivityCard({ farmId, activityType, description, geoLocation, id, timestamp }: ActivityProps) {
  // console.log('ActivityCard is rendering for', activityType)
  const date = timestamp.split('T')[0] // Extract date from timestamp
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="bg-white shadow-lg rounded-xl p-4 mb-4 mx-4"
    >
      {/* <Text className="text-xs text-gray-400">Farm ID: {farmId} | Date: {date} | ID: {id}</Text> */}
      <Text className="text-lg font-semibold text-blue-600 mt-1">{activityType}</Text>
      <Text className="text-sm text-gray-700 mt-2">{description}</Text>
      <Text className="text-xs text-gray-500 mt-1">Timestamp: {timestamp}</Text>
    </MotiView>
  )
}
