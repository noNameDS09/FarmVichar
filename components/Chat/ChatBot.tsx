import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  useColorScheme,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  Composer,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
// import { LinearGradient } from 'expo-linear-gradient';

const ChatbotScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [audioStates, setAudioStates] = useState<Map<string, Audio.Sound>>(
    new Map()
  ); // Using a Map to store audio states by message ID

  const getStyles = (isDark: boolean) => StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
      backgroundColor: isDark ? '#333' : 'transparent',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#555' : 'lightgreen',
      paddingVertical: 6,
      paddingHorizontal: 4,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    textInput: {
      flex: 1,
      backgroundColor: isDark ? '#555' : '#fff',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      lineHeight: 20,
      color: isDark ? '#fff' : '#000',
      marginRight: 10,
      textAlignVertical: 'center',
    },
    sendIcon: { marginRight: 5 },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    iconButton: { padding: 6 },
    audioBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      maxWidth: '80%',
    },
    audioBubbleRight: { backgroundColor: isDark ? '#1e40af' : '#0078fe', alignSelf: 'flex-end' },
    audioBubbleLeft: { backgroundColor: isDark ? '#374151' : '#e0e0e0', alignSelf: 'flex-start' },
    audioButton: { marginRight: 10 },
    audioText: { fontSize: 16 },
    previewBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 6,
      backgroundColor: isDark ? '#333' : '#fff',
      borderTopWidth: 1,
      borderColor: isDark ? '#555' : '#ddd',
    },
    previewImage: { width: 50, height: 50, borderRadius: 6 },
    removeImage: { marginLeft: 10 },
  });

  const styles = getStyles(isDark);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello, how can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // Handle sending message with pending image
  const handleSend = (newMessages: IMessage[] = []) => {
    if (pendingImage) {
      const messageWithImage: IMessage = {
        ...newMessages[0],
        image: pendingImage,
      };
      onSend([messageWithImage]);
      setPendingImage(null);
    } else {
      onSend(newMessages);
    }
  };

  // Image picker
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = result.assets[0].uri;
      setPendingImage(imageUrl);
    }
  };

  // Voice recording
  const handleVoiceInput = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        if (uri) {
          const audioMessage: IMessage = {
            _id: Math.random().toString(),
            text: "",
            createdAt: new Date(),
            user: { _id: 1 },
            audio: uri,
          };
          onSend([audioMessage]);
        }
      } catch (error) {
        console.error("Failed to stop recording", error);
      }
    } else {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }
      try {
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await newRecording.startAsync();
        setRecording(newRecording);
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    }
  };

  // Play/pause audio
  const onPlayPauseAudio = async (audioUri: string, messageId: string) => {
    try {
      // Check if the audio is already playing
      if (audioStates.has(messageId)) {
        const sound = audioStates.get(messageId);
        if (sound) {
          const status = await sound.getStatusAsync();
          await sound.pauseAsync(); // Pause audio

          if (status.isLoaded && status.isPlaying) {
          } else {
            await sound.playAsync(); // Play audio
          }
        }
      } else {
        // If no audio is playing, load the audio and start playback
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );

        // Store the sound instance in the audio states
        setAudioStates((prev) => new Map(prev).set(messageId, sound));

        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && !status.isPlaying) {
            // Once the audio is finished, remove it from the state
            setAudioStates((prev) => {
              const newMap = new Map(prev);
              newMap.delete(messageId);
              return newMap;
            });
          }
        });
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  // Custom bubble for audio
  const renderBubble = (props: any) => {
    const { currentMessage } = props;
    if (currentMessage.audio) {
      return (
        <View
          style={[
            styles.audioBubble,
            currentMessage.user._id === 1
              ? styles.audioBubbleRight
              : styles.audioBubbleLeft,
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              onPlayPauseAudio(currentMessage.audio, currentMessage._id)
            }
            style={styles.audioButton}
          >
            <Ionicons
              name={audioStates.has(currentMessage._id) ? "pause" : "play"}
              size={24}
              color={currentMessage.user._id === 1 ? "#fff" : (isDark ? '#fff' : '#000')}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.audioText,
              currentMessage.user._id === 1
                ? { color: "#fff" }
                : { color: isDark ? '#fff' : '#000' },
            ]}
          >
            Voice Message
          </Text>
        </View>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: isDark ? '#374151' : '#fff' },
          right: { backgroundColor: isDark ? '#1e40af' : '#0da60d' },
        }}
        textStyle={{
          left: { color: isDark ? '#fff' : '#000' },
          right: { color: '#fff' },
        }}
      />
    );
  };

  const renderActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleVoiceInput} style={styles.iconButton}>
          <Ionicons
            name={recording ? "stop-circle" : "mic"}
            size={26}
            color={recording ? "red" : (isDark ? "#ccc" : "#808080")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImagePicker} style={styles.iconButton}>
          <Ionicons name="image" size={24} color={isDark ? "#ccc" : "#808080"} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderInputToolbar = (props: any) => (
    <View>
      {pendingImage && (
        <View style={styles.previewBox}>
          <Image
            source={{ uri: pendingImage }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeImage}
            onPress={() => setPendingImage(null)}
          >
            <Ionicons name="close-circle" size={22} color="red" />
          </TouchableOpacity>
        </View>
      )}
      <InputToolbar
        {...props}
        containerStyle={styles.inputContainer}
        renderActions={renderActions}
        renderComposer={(composerProps) => (
          <Composer
            {...composerProps}
            placeholder="Type a message..."
            textInputStyle={styles.textInput}
          />
        )}
      />
    </View>
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      containerStyle={{ justifyContent: "center", alignItems: "center",  }}
    >
      <Ionicons name="send" size={24} color={isDark ? "#67c767":"#67c767"} style={styles.sendIcon} />
    </Send>
  );

  return (
    
      
    <View style={styles.container} >
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: 1 }}
        bottomOffset={-45}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderAvatar={() => null}
        renderBubble={renderBubble}
        />
    </View>
  );
};

export default ChatbotScreen;
