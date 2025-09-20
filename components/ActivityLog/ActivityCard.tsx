import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// These are the props being passed from ActivityScreen:
// { activityType, description, timestamp, id, ... }
interface ActivityCardProps {
  activityType: string;
  description: string;
  timestamp: string;
}

// A helper function to choose an icon based on the activity type
const getActivityIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  if (!type) return 'document-text-outline';
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('observation')) return 'eye-outline';
  if (lowerType.includes('weeding')) return 'leaf-outline';
  if (lowerType.includes('irrigation')) return 'water-outline';
  if (lowerType.includes('fertilizer')) return 'flask-outline';
  if (lowerType.includes('pesticide')) return 'bug-outline';
  if (lowerType.includes('planting')) return 'trending-up-outline';
  if (lowerType.includes('maintenance')) return 'build-outline';
  if (lowerType.includes('pest')) return 'alert-circle-outline';
  
  return 'document-text-outline'; // Default icon for other types
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  activityType,
  description,
  timestamp,
}) => {
  // Format the timestamp to show only the time (e.g., "06:23 PM")
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getActivityIcon(activityType)}
          size={24}
          color="#10B981"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{activityType}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.time}>{formattedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#E6F9F1',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827', // Dark text color
  },
  description: {
    fontSize: 14,
    color: '#6B7280', // Gray text color
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'flex-start',
  },
});

export default ActivityCard;