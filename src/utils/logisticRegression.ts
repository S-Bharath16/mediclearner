// A simple logistic regression implementation for client-side prediction
// In a production environment, this would typically be handled by a backend ML service

export interface LogisticRegressionModel {
  weights: number[];
  bias: number;
  featureNames: string[];
}

// Pre-trained diabetes prediction model (hypothetical weights based on medical literature)
export const diabetesModel: LogisticRegressionModel = {
  weights: [0.025, 0.035, 0.042, 0.019, 0.018, 0.012, 0.032], // Weights for: age, glucose, bmi, bloodPressure, insulin, skinThickness, pregnancies
  bias: -5.72,
  featureNames: ["age", "glucose", "bmi", "bloodPressure", "insulin", "skinThickness", "pregnancies"],
};

// Pre-trained heart disease prediction model
export const heartDiseaseModel: LogisticRegressionModel = {
  weights: [0.031, 0.022, 0.018, 0.42, -0.017, 0.48, 0.37], // Weights for: age, restingBP, cholesterol, fastingBS, maxHR, exerciseAngina, chestPainType
  bias: -5.1,
  featureNames: ["age", "restingBP", "cholesterol", "fastingBS", "maxHR", "exerciseAngina", "chestPainType"],
};

// Pre-trained lung cancer prediction model
export const lungCancerModel: LogisticRegressionModel = {
  weights: [0.018, 0.51, 0.025, 0.31, 0.15, 0.42, 0.38, 0.44], // Weights for: age, smoking, smokingYears, yellowFingers, anxiety, coughing, shortnessOfBreath, chestPain
  bias: -4.8,
  featureNames: ["age", "smoking", "smokingYears", "yellowFingers", "anxiety", "coughing", "shortnessOfBreath", "chestPain"],
};

// Pre-trained stroke prediction model
export const strokeModel: LogisticRegressionModel = {
  weights: [0.04, 0.58, 0.62, 0.025, 0.03, 0.38], // Weights for: age, hypertension, heartDisease, glucose, bmi, smoking
  bias: -6.2,
  featureNames: ["age", "hypertension", "heartDisease", "glucose", "bmi", "smoking"],
};

// Sigmoid function to convert linear prediction to probability
const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

// Normalize a feature value based on typical medical ranges
const normalizeFeature = (value: number | boolean | string, featureName: string): number => {
  if (typeof value === "boolean") return value ? 1 : 0;

  if (typeof value === "string") {
    const categoricalMaps: Record<string, Record<string, number>> = {
      chestPainType: { typical: 1, atypical: 0.7, nonanginal: 0.4, asymptomatic: 0.1 },
      smoking: { never: 0, formerly: 0.5, smokes: 1 },
    };
    return categoricalMaps[featureName]?.[value] ?? 0;
  }

  const normalizations: Record<string, (val: number) => number> = {
    age: (val) => (val - 40) / 20,
    glucose: (val) => (val - 120) / 40,
    bmi: (val) => (val - 25) / 8,
    bloodPressure: (val) => (val - 120) / 20,
    restingBP: (val) => (val - 120) / 20,
    cholesterol: (val) => (val - 200) / 50,
    insulin: (val) => (val - 80) / 40,
    skinThickness: (val) => (val - 20) / 10,
    pregnancies: (val) => val / 3,
    maxHR: (val) => (val - 150) / 30,
    smokingYears: (val) => val / 20,
  };

  return normalizations[featureName]?.(value) ?? value;
};

// Make prediction using logistic regression model
export const predict = (
  model: LogisticRegressionModel,
  features: Record<string, number | boolean | string>
): { probability: number; isPositive: boolean } => {
  let linearSum = model.bias;

  model.featureNames.forEach((featureName, index) => {
    if (Object.prototype.hasOwnProperty.call(features, featureName)) {
      linearSum += normalizeFeature(features[featureName], featureName) * model.weights[index];
    }
  });

  const probability = sigmoid(linearSum);
  return { probability, isPositive: probability > 0.3 };
};
