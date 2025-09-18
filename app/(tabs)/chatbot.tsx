import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatbotScreen from '@/components/Chat/ChatBot'
const chatbot = () => {
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{flex:1}}>
      {/* <Text>chatbot</Text> */}
      <ChatbotScreen />
      {/* <Text>chatbot</Text> */}

    </View>
    </SafeAreaView>
  )
}

export default chatbot

const styles = StyleSheet.create({})