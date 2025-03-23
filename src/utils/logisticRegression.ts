
// A simple logistic regression implementation for client-side prediction
// In a production environment, this would typically be handled by a backend ML service

export interface LogisticRegressionModel {
  weights: number[];
  bias: number;
  featureNames: string[];
}

// Pre-trained diabetes prediction model (hypothetical weights based on medical literature)
// These weights would typically come from a trained model on a medical dataset
export const diabetesModel: LogisticRegressionModel = {
  // Weights for: age, glucose, bmi, bloodPressure, insulin, skinThickness, pregnancies (female only)
  weights: [0.025, 0.035, 0.042, 0.019, 0.018, 0.012, 0.032],
  bias: -5.72, // Intercept
  featureNames: ["age", "glucose", "bmi", "bloodPressure", "insulin", "skinThickness", "pregnancies"]
};

// Sigmoid function to convert linear prediction to probability
const sigmoid = (z: number): number => {
  return 1 / (1 + Math.exp(-z));
};

// Normalize a feature value based on typical medical ranges
const normalizeFeature = (value: number, featureName: string): number => {
  switch (featureName) {
    case "age":
      return (value - 40) / 20; // Normalize around 40 years with std dev of 20
    case "glucose":
      return (value - 120) / 40; // Normalize around 120 mg/dL with std dev of 40
    case "bmi":
      return (value - 25) / 8; // Normalize around 25 kg/m² with std dev of 8
    case "bloodPressure":
      return (value - 120) / 20; // Normalize around 120 mmHg with std dev of 20
    case "insulin":
      return (value - 80) / 40; // Normalize around 80 µU/ml with std dev of 40
    case "skinThickness":
      return (value - 20) / 10; // Normalize around 20 mm with std dev of 10
    case "pregnancies":
      return value / 3; // Normalize by typical max number of pregnancies
    default:
      return value;
  }
};

// Make prediction using logistic regression model
export const predict = (
  model: LogisticRegressionModel,
  features: Record<string, number>
): { probability: number; isPositive: boolean } => {
  // Initialize linear sum with bias
  let linearSum = model.bias;
  
  // Add weighted features
  model.featureNames.forEach((featureName, index) => {
    // If feature exists (e.g., pregnancies might not exist for males)
    if (features[featureName] !== undefined) {
      const normalizedValue = normalizeFeature(features[featureName], featureName);
      linearSum += normalizedValue * model.weights[index];
    }
  });
  
  // Convert to probability using sigmoid function
  const probability = sigmoid(linearSum);
  
  // Determine prediction (threshold at 0.5)
  const isPositive = probability > 0.3;
  
  return { probability, isPositive };
};
