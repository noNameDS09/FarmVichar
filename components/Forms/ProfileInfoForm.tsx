import React from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";

export default function MyForm() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      age: "",
      education: "",
      experience: "",
      gender: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    Alert.alert("Form Submitted", JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter name"
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
            placeholder="Enter contact no:"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />

      {/* Age */}
      <Text style={styles.label}>Age</Text>
      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />

      {/* Education */}
      <Text style={styles.label}>Education</Text>
      <Controller
        control={control}
        name="education"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter educational qualifications"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Farming Experience */}
      <Text style={styles.label}>Farming Experience (Years)</Text>
      <Controller
        control={control}
        name="experience"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Number of years"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
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
});
