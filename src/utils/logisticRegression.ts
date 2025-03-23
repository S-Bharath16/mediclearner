
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

// Pre-trained heart disease prediction model
export const heartDiseaseModel: LogisticRegressionModel = {
  // Weights for: age, restingBP, cholesterol, fastingBS, maxHR, exerciseAngina, chestPainType (encoded)
  weights: [0.031, 0.022, 0.018, 0.42, -0.017, 0.48, 0.37],
  bias: -5.1,
  featureNames: ["age", "restingBP", "cholesterol", "fastingBS", "maxHR", "exerciseAngina", "chestPainType"]
};

// Pre-trained lung cancer prediction model
export const lungCancerModel: LogisticRegressionModel = {
  // Weights for: age, smoking, smokingYears, yellowFingers, anxiety, coughing, shortnessOfBreath, chestPain
  weights: [0.018, 0.51, 0.025, 0.31, 0.15, 0.42, 0.38, 0.44],
  bias: -4.8,
  featureNames: ["age", "smoking", "smokingYears", "yellowFingers", "anxiety", "coughing", "shortnessOfBreath", "chestPain"]
};

// Pre-trained stroke prediction model
export const strokeModel: LogisticRegressionModel = {
  // Weights for: age, hypertension, heartDisease, glucose, bmi, smoking (encoded)
  weights: [0.04, 0.58, 0.62, 0.025, 0.03, 0.38],
  bias: -6.2,
  featureNames: ["age", "hypertension", "heartDisease", "glucose", "bmi", "smoking"]
};

// Sigmoid function to convert linear prediction to probability
const sigmoid = (z: number): number => {
  return 1 / (1 + Math.exp(-z));
};

// Normalize a feature value based on typical medical ranges
const normalizeFeature = (value: number | boolean | string, featureName: string): number => {
  // Convert boolean to number if needed
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  
  // Handle categorical features encoded as strings
  if (typeof value === "string") {
    switch (featureName) {
      case "chestPainType":
        // Map chest pain types to numeric values
        const chestPainMap: Record<string, number> = {
          "typical": 1,
          "atypical": 0.7,
          "nonanginal": 0.4,
          "asymptomatic": 0.1
        };
        return chestPainMap[value] || 0;
      
      case "smoking":
        // Map smoking status to numeric values
        const smokingMap: Record<string, number> = {
          "never": 0,
          "formerly": 0.5,
          "smokes": 1
        };
        return smokingMap[value] || 0;
        
      default:
        return 0;
    }
  }
  
  // Normalize numeric features
  switch (featureName) {
    case "age":
      return (value - 40) / 20; // Normalize around 40 years with std dev of 20
    case "glucose":
      return (value - 120) / 40; // Normalize around 120 mg/dL with std dev of 40
    case "bmi":
      return (value - 25) / 8; // Normalize around 25 kg/m² with std dev of 8
    case "bloodPressure":
    case "restingBP":
      return (value - 120) / 20; // Normalize around 120 mmHg with std dev of 20
    case "cholesterol":
      return (value - 200) / 50; // Normalize around 200 mg/dL with std dev of 50
    case "insulin":
      return (value - 80) / 40; // Normalize around 80 µU/ml with std dev of 40
    case "skinThickness":
      return (value - 20) / 10; // Normalize around 20 mm with std dev of 10
    case "pregnancies":
      return value / 3; // Normalize by typical max number of pregnancies
    case "maxHR":
      return (value - 150) / 30; // Normalize around 150 bpm with std dev of 30
    case "smokingYears":
      return value / 20; // Normalize by 20 years of smoking
    default:
      return value;
  }
};

// Make prediction using logistic regression model
export const predict = (
  model: LogisticRegressionModel,
  features: Record<string, number | boolean | string>
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
  
  // Determine prediction (threshold at 0.3 for higher sensitivity)
  const isPositive = probability > 0.3;
  
  return { probability, isPositive };
};
