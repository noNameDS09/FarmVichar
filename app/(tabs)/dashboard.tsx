import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import ProfileDrawer from '@/components/Profile/ProfileDrawer';

const mockPredictions = {
  recommended_crop: 'Wheat',
  yield_prediction_kg_acre: 2500,
  pest_risk_percent: 15,
  quality_grading_score: 85,
  price_range_per_quintal: {
    crop_name: 'Wheat',
    min_price: 1800,
    max_price: 2200,
  },
  applicable_schemes: ['PM-KISAN', 'Soil Health Card'],
  applied_schemes: ['PM-KISAN'],
};

// const mockFarmer = {
//   name: 'Rajesh Kumar',
//   location: 'Punjab, India',
//   farm_size_acres: 5,
// };

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

export default function DashboardScreen() {
  const [data, setData] = useState<BackendResponse | null>(null);

  useEffect(() => {
    const getFarmerDetails = async () => {
      try {
        const response = await fetch(`https://farmvichar-ml.onrender.com/dashboard/h8BfY08KoqFKxNOoQc9o`);
        if (response.ok) {
          const data_ = await response.json();
          setData(data_);
        }
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getFarmerDetails();
  }, []);

  if (!data) {
    return <Dashboard predictions={mockPredictions}  />;
  }

  return <Dashboard predictions={data.predictions}  />;
}
