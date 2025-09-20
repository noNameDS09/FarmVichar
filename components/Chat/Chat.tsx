import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MarkdownView } from "react-native-markdown-view";

type Message = {
  id: string;
  text?: string;
  imageUri?: string;
  audioUri?: string;
  createdAt: Date;
  userId: number;
  language?: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [playingSound, setPlayingSound] = useState<Audio.Sound | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("ml");

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Initial welcome message from bot
    const welcomeMessage: Message = {
      id: "bot-1",
      text: "Hello, how can I help you today?",
      createdAt: new Date(),
      userId: 2,
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    return () => {
      if (playingSound) {
        playingSound.unloadAsync();
      }
    };
  }, [playingSound]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPendingImage(result.assets[0].uri);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access microphone is required!"
        );
        return;
      }
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        sendMessage({ audioUri: uri, language: selectedLanguage });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  const sendMessage = async (messageData: Partial<Message> = {}) => {
    if (isSending) return;
    if (!inputText.trim() && !pendingImage && !messageData.audioUri) {
      Alert.alert(
        "Empty message",
        "Please enter a message or select media to send."
      );
      return;
    }

    setIsSending(true);

    const newMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim() || undefined,
      imageUri: pendingImage || undefined,
      audioUri: messageData.audioUri,
      createdAt: new Date(),
      userId: 1,
      language: messageData.language || selectedLanguage,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");
    setPendingImage(null);

    const formData = new FormData();
    formData.append("text_query", newMessage.text || "Audio message or Image");
    formData.append("language_code", newMessage.language || "ml");

    if (newMessage.imageUri) {
      const uriParts = newMessage.imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("image_file", {
        uri: newMessage.imageUri,
        name: `image_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    if (newMessage.audioUri) {
      const uriParts = newMessage.audioUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const mimeType = `audio/${fileType}`;

      // Append audio file as binary
      formData.append("audio_file", {
        uri: newMessage.audioUri,
        name: `audio_${Date.now()}.${fileType}`,
        type: mimeType,
      } as any);
    }

    try {
      const response = await fetch(
        "https://farmvichar-ml.onrender.com/chat/h8BfY08KoqFKxNOoQc9o",
        {
          method: "POST",
          body: formData,
          headers: {
            // 'Content-Type': 'multipart/form-data', // Let fetch handle this automatically
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: data.response_text,
        createdAt: new Date(),
        userId: 2,
      };
      setMessages((prev) => [botMessage, ...prev]);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("Error", `Failed to send message: ${(error as Error).message}`);
    } finally {
      setIsSending(false);
    }
  };

  const onPlayPauseAudio = async (message: Message) => {
    if (playingMessageId === message.id) {
      const status = await playingSound?.getStatusAsync();
      if (
        status &&
        "isLoaded" in status &&
        status.isLoaded &&
        status.isPlaying
      ) {
        await playingSound?.pauseAsync();
      } else {
        await playingSound?.playAsync();
      }
      return;
    }

    if (playingSound) {
      await playingSound.stopAsync();
      await playingSound.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: message.audioUri! },
      { shouldPlay: true }
    );
    setPlayingSound(sound);
    setPlayingMessageId(message.id);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
        setPlayingSound(null);
        setPlayingMessageId(null);
        sound.unloadAsync();
      }
    });
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.userId === 1;
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.messageRight : styles.messageLeft,
        ]}
      >
        {item.text ? (
          isUser ? (
            <Text style={[styles.messageText, styles.textRight]}>
              {item.text}
            </Text>
          ) : (
            <View style={{ paddingHorizontal: 8 }}>
              <MarkdownView
                style={{
                  body: { color: "#000", fontSize: 16, lineHeight: 20 },
                  strong: { fontWeight: "bold" },
                  em: { fontStyle: "italic" },
                  list_item: {
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginBottom: 6,
                  },
                  bullet_list: { marginLeft: 10 },
                  paragraph: { marginBottom: 10 },
                }}
              >
                {item.text}
              </MarkdownView>
            </View>
          )
        ) : null}
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
        ) : null}
        {item.audioUri ? (
          <TouchableOpacity
            style={[
              styles.audioButton,
              isUser ? styles.audioButtonRight : styles.audioButtonLeft,
            ]}
            onPress={() => onPlayPauseAudio(item)}
          >
            <Ionicons
              name={playingMessageId === item.id ? "pause" : "play"}
              size={24}
              color={isUser ? "#fff" : "#000"}
            />
            <Text
              style={[
                styles.audioText,
                isUser ? styles.textRight : styles.textLeft,
              ]}
            >
              Voice Message
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={45}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        inverted
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingVertical: 10, flexGrow: 1 }}
        style={{ flex: 1 }}
      />
      {pendingImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: pendingImage }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={() => setPendingImage(null)}
            style={styles.removeImageButton}
          >
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={styles.iconButton}
        >
          <Ionicons
            name={recording ? "stop-circle" : "mic"}
            size={28}
            color={recording ? "red" : "#555"}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder={
            selectedLanguage === "ml"
              ? "സന്ദേശം ടൈപ്പ് ചെയ്യൂ..."
              : "Type a message..."
          }
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          onPress={() => {
            setSelectedLanguage(selectedLanguage === "ml" ? "en" : "ml");
          }}
          style={styles.languageButton}
        >
          <Text style={styles.languageText}>
            {selectedLanguage === "ml" ? "EN" : "ML"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sendMessage({ language: selectedLanguage })}
          style={styles.sendButton}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <Ionicons name="image" size={28} color="#555" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  messageContainer: {
    marginVertical: 6,
    marginHorizontal: 12,
    maxWidth: "75%",
    borderRadius: 12,
    padding: 10,
  },
  messageLeft: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  messageRight: {
    backgroundColor: "#0078fe",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 6,
  },
  textLeft: {
    color: "#000",
  },
  textRight: {
    color: "#fff",
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginTop: 4,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 20,
  },
  audioButtonLeft: {
    backgroundColor: "#e0e0e0",
  },
  audioButtonRight: {
    backgroundColor: "#005bb5",
  },
  audioText: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#0078fe",
    borderRadius: 20,
    padding: 5,
  },
  iconButton: {
    padding: 6,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  removeImageButton: {
    marginLeft: 12,
  },
  languageButton: {
    backgroundColor: "#0078fe",
    borderRadius: 20,
    padding: 5,
    marginRight: 8,
  },
  languageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Chat;