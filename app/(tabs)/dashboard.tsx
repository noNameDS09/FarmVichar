import React, { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface BackendResponse {
  user_profile: Record<string, any>;
  weather: Record<string, any>;
  predictions: {
    recommended_crop: string;
    yield_prediction_kg_acre: number;
    pest_risk_percent: number;
    quality_grading_score: number;
    price_range_per_quintal: {
      crop_name: string;
      min_price: number;
      max_price: number;
    };
    applicable_schemes: string[];
    applied_schemes: string[];
  };
}

export default function App() {
  const [data, setData] = useState<BackendResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFarmerDetails = async () => {
      try {
        const response = await fetch(
          `https://farmvichar-ml.onrender.com/dashboard/h8BfY08KoqFKxNOoQc9o`
        );
        if (response.ok) {
          const data_ = await response.json();
          setData(data_);
        } else {
          console.error("Failed to fetch data", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getFarmerDetails();
  }, []);

  // Show a loading state while fetching data
  if (loading) {
    return <SafeAreaView className="flex-1 items-center justify-center"><Text className="flex-1 items-center justify-center">Loading...</Text></SafeAreaView>; // Or you can replace it with a loader/spinner component
  }

  // If there's no data or an error in fetching, handle it gracefully
  if (!data) {
    return <Text>Error loading data. Please try again later.</Text>;
  }

  return (
    <Dashboard predictions={data.predictions} />
  );
}
