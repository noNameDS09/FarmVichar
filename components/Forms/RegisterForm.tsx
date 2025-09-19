import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type FormData = {
  fullName: string;
  phone: string;
  preferredLanguage: "Malayalam" | "English";
  password: string;
};

export default function RegisterForm() {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      preferredLanguage: "Malayalam",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Dummy fetch call
      const response = await fetch("https://farmvichardatabase.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        Alert.alert("Success", "User registered successfully!");
        reset();
      } else {
        Alert.alert("Error", "Failed to register user.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during registration.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Phone */}
      <Text style={styles.label}>Phone</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />

      {/* Preferred Language */}
      <Text style={styles.label}>Preferred Language</Text>
      <Controller
        control={control}
        name="preferredLanguage"
        render={({ field: { onChange, value } }) => (
          <View style={styles.languageContainer}>
            <Text
              style={[
                styles.languageOption,
                value === "Malayalam" && styles.languageSelected,
              ]}
              onPress={() => onChange("Malayalam")}
            >
              Malayalam
            </Text>
            <Text
              style={[
                styles.languageOption,
                value === "English" && styles.languageSelected,
              ]}
              onPress={() => onChange("English")}
            >
              English
            </Text>
          </View>
        )}
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={value}
            onChangeText={onChange}
            secureTextEntry={true}
          />
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Register" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  languageContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  languageOption: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 5,
    color: "#333",
  },
  languageSelected: {
    backgroundColor: "#007AFF",
    color: "white",
  },
});
