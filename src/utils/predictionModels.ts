
// Centralized utility for all prediction models using logistic regression

// Common function to normalize input values
export const normalizeInput = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

// Sigmoid function for logistic regression
export const sigmoid = (z: number): number => {
  return 1 / (1 + Math.exp(-z));
};

// Diabetes prediction model
interface DiabetesInput {
  glucose: number;
  bmi: number;
  age: number;
  bloodPressure: number;
  insulinLevel: number;
  pregnancies?: number; // Optional for male patients
}

export const predictDiabetes = (input: DiabetesInput): number => {
  // Normalize inputs
  const normalizedGlucose = normalizeInput(input.glucose, 0, 200);
  const normalizedBMI = normalizeInput(input.bmi, 15, 50);
  const normalizedAge = normalizeInput(input.age, 18, 100);
  const normalizedBloodPressure = normalizeInput(input.bloodPressure, 60, 200);
  const normalizedInsulin = normalizeInput(input.insulinLevel, 0, 300);
  const normalizedPregnancies = input.pregnancies ? normalizeInput(input.pregnancies, 0, 17) : 0;

  // Feature weights (would be trained in a real model)
  const weights = {
    glucose: 0.35,
    bmi: 0.25,
    age: 0.2,
    bloodPressure: 0.1,
    insulin: 0.08,
    pregnancies: 0.02,
    intercept: -1.2
  };

  // Calculate logistic regression
  const z = 
    weights.glucose * normalizedGlucose +
    weights.bmi * normalizedBMI +
    weights.age * normalizedAge +
    weights.bloodPressure * normalizedBloodPressure +
    weights.insulin * normalizedInsulin +
    weights.pregnancies * normalizedPregnancies +
    weights.intercept;

  // Apply sigmoid function to get probability
  return sigmoid(z);
};

// Heart disease prediction model
interface HeartInput {
  age: number;
  cholesterol: number;
  bloodPressure: number;
  heartRate: number;
  exerciseHours: number;
  isMale: boolean;
  smoker: boolean;
  diabetic: boolean;
}

export const predictHeartDisease = (input: HeartInput): number => {
  // Normalize inputs
  const normalizedAge = normalizeInput(input.age, 18, 100);
  const normalizedCholesterol = normalizeInput(input.cholesterol, 120, 300);
  const normalizedBloodPressure = normalizeInput(input.bloodPressure, 90, 200);
  const normalizedHeartRate = normalizeInput(input.heartRate, 40, 200);
  const normalizedExercise = normalizeInput(input.exerciseHours, 0, 20);
  
  // Feature weights
  const weights = {
    age: 0.3,
    cholesterol: 0.25,
    bloodPressure: 0.2,
    heartRate: 0.1,
    exercise: -0.15, // Negative because more exercise reduces risk
    isMale: 0.1,
    smoker: 0.2,
    diabetic: 0.15,
    intercept: -1.5
  };

  // Calculate logistic regression
  const z = 
    weights.age * normalizedAge +
    weights.cholesterol * normalizedCholesterol +
    weights.bloodPressure * normalizedBloodPressure +
    weights.heartRate * normalizedHeartRate +
    weights.exercise * normalizedExercise +
    (input.isMale ? weights.isMale : 0) +
    (input.smoker ? weights.smoker : 0) +
    (input.diabetic ? weights.diabetic : 0) +
    weights.intercept;

  // Apply sigmoid function to get probability
  return sigmoid(z);
};

// Lung cancer prediction model
interface LungInput {
  age: number;
  smokingYears: number;
  cigarettesPerDay: number;
  exposureToToxins: boolean;
  familyHistory: boolean;
  chronicCough: boolean;
  shortnessOfBreath: boolean;
  chestPain: boolean;
}

export const predictLungCancer = (input: LungInput): number => {
  // Normalize inputs
  const normalizedAge = normalizeInput(input.age, 18, 100);
  const normalizedSmokingYears = normalizeInput(input.smokingYears, 0, 60);
  const normalizedCigarettes = normalizeInput(input.cigarettesPerDay, 0, 40);
  
  // Feature weights
  const weights = {
    age: 0.2,
    smokingYears: 0.3,
    cigarettesPerDay: 0.25,
    exposureToToxins: 0.15,
    familyHistory: 0.1,
    chronicCough: 0.2,
    shortnessOfBreath: 0.15,
    chestPain: 0.1,
    intercept: -2.0
  };

  // Calculate logistic regression
  const z = 
    weights.age * normalizedAge +
    weights.smokingYears * normalizedSmokingYears +
    weights.cigarettesPerDay * normalizedCigarettes +
    (input.exposureToToxins ? weights.exposureToToxins : 0) +
    (input.familyHistory ? weights.familyHistory : 0) +
    (input.chronicCough ? weights.chronicCough : 0) +
    (input.shortnessOfBreath ? weights.shortnessOfBreath : 0) +
    (input.chestPain ? weights.chestPain : 0) +
    weights.intercept;

  // Apply sigmoid function to get probability
  return sigmoid(z);
};

// Stroke risk prediction model
interface StrokeInput {
  age: number;
  bloodPressure: number;
  cholesterol: number;
  diabetic: boolean;
  smoker: boolean;
  heartDisease: boolean;
  bmi: number;
  physicalActivity: number;
}

export const predictStrokeRisk = (input: StrokeInput): number => {
  // Normalize inputs
  const normalizedAge = normalizeInput(input.age, 18, 100);
  const normalizedBloodPressure = normalizeInput(input.bloodPressure, 90, 200);
  const normalizedCholesterol = normalizeInput(input.cholesterol, 120, 300);
  const normalizedBMI = normalizeInput(input.bmi, 15, 50);
  const normalizedActivity = normalizeInput(input.physicalActivity, 0, 20);
  
  // Feature weights
  const weights = {
    age: 0.35,
    bloodPressure: 0.25,
    cholesterol: 0.15,
    diabetic: 0.15,
    smoker: 0.1,
    heartDisease: 0.2,
    bmi: 0.1,
    physicalActivity: -0.1, // Negative because more activity reduces risk
    intercept: -1.8
  };

  // Calculate logistic regression
  const z = 
    weights.age * normalizedAge +
    weights.bloodPressure * normalizedBloodPressure +
    weights.cholesterol * normalizedCholesterol +
    weights.bmi * normalizedBMI +
    weights.physicalActivity * normalizedActivity +
    (input.diabetic ? weights.diabetic : 0) +
    (input.smoker ? weights.smoker : 0) +
    (input.heartDisease ? weights.heartDisease : 0) +
    weights.intercept;

  // Apply sigmoid function to get probability
  return sigmoid(z);
};
