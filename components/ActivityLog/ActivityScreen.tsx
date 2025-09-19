import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import ActivityCard from './ActivityCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockDataOfLog } from '@/data/data';
import { DataOfLogType } from '@/types/types';

export default function ActivityScreen() {
  const [data, setData] = useState<DataOfLogType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  useEffect(() => {
    if (Array.isArray(mockDataOfLog)) {
      setData(mockDataOfLog);
    } else {
      setData([]);
    }
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => item.timestamp.startsWith(selectedDate));
  }, [data, selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Calendar Component with padding */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
            }}
            style={styles.calendar}
          />
        </View>
        
        <Text style={styles.heading}>Logs for {selectedDate}</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <ActivityCard key={item.id} {...item} />
            ))
          ) : (
            <Text style={styles.noLogsText}>No logs for this date.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    paddingTop: 0
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
  heading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  noLogsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 16,
  },
});
