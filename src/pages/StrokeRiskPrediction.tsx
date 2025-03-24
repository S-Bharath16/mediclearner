
import { useState } from "react";
import Layout from "../components/Layout";
import PredictionResult from "../components/PredictionResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { strokeModel, predict } from "../utils/logisticRegression";
import { useHistory } from "@/hooks/use-history";

interface FormData {
  age: number;
  gender: string;
  hypertension: boolean;
  heartDisease: boolean;
  married: boolean;
  workType: string;
  residenceType: string;
  glucose: number;
  bmi: number;
  smoking: string;
}

const initialFormData: FormData = {
  age: 50,
  gender: "male",
  hypertension: false,
  heartDisease: false,
  married: false,
  workType: "private",
  residenceType: "urban",
  glucose: 100,
  bmi: 25,
  smoking: "never",
};

const StrokeRiskPrediction = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<{ isPositive: boolean; probability: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToHistory } = useHistory();

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API latency for a more realistic experience
    setTimeout(() => {
      // Use our logistic regression model to make a prediction
      const features = {
        age: formData.age,
        hypertension: formData.hypertension,
        heartDisease: formData.heartDisease,
        glucose: formData.glucose,
        bmi: formData.bmi,
        smoking: formData.smoking
      };
      
      const prediction = predict(strokeModel, features);
      
      const predictionResult = {
        isPositive: prediction.isPositive,
        probability: prediction.probability,
      };
      
      setResult(predictionResult);
      
      // Save prediction to history
      addToHistory('stroke', formData, predictionResult);
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-50 text-medical-600 rounded-full text-sm font-medium">
            Stroke Risk Assessment
          </div>
          <h1 className="text-3xl font-bold mb-2">Stroke Risk Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your stroke risk based on medical history and lifestyle factors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 lg:col-start-3">
            <div className="bg-white shadow-sm rounded-xl border border-border/50 p-6 form-container">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleChange("age", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hypertension">Hypertension</Label>
                    <RadioGroup
                      value={formData.hypertension ? "yes" : "no"}
                      onValueChange={(value) => handleChange("hypertension", value === "yes")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="hypertension-yes" />
                        <Label htmlFor="hypertension-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="hypertension-no" />
                        <Label htmlFor="hypertension-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heartDisease">Heart Disease</Label>
                    <RadioGroup
                      value={formData.heartDisease ? "yes" : "no"}
                      onValueChange={(value) => handleChange("heartDisease", value === "yes")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="heartDisease-yes" />
                        <Label htmlFor="heartDisease-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="heartDisease-no" />
                        <Label htmlFor="heartDisease-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="married">Ever Married</Label>
                    <RadioGroup
                      value={formData.married ? "yes" : "no"}
                      onValueChange={(value) => handleChange("married", value === "yes")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="married-yes" />
                        <Label htmlFor="married-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="married-no" />
                        <Label htmlFor="married-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select
                      value={formData.workType}
                      onValueChange={(value) => handleChange("workType", value)}
                    >
                      <SelectTrigger id="workType">
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="govt">Government Job</SelectItem>
                        <SelectItem value="children">Children</SelectItem>
                        <SelectItem value="never_worked">Never Worked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residenceType">Residence Type</Label>
                    <Select
                      value={formData.residenceType}
                      onValueChange={(value) => handleChange("residenceType", value)}
                    >
                      <SelectTrigger id="residenceType">
                        <SelectValue placeholder="Select residence type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urban">Urban</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
                    <Input
                      id="glucose"
                      type="number"
                      min="70"
                      max="300"
                      value={formData.glucose}
                      onChange={(e) => handleChange("glucose", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI (kg/m²)</Label>
                    <Input
                      id="bmi"
                      type="number"
                      step="0.1"
                      min="10"
                      max="50"
                      value={formData.bmi}
                      onChange={(e) => handleChange("bmi", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smoking">Smoking Status</Label>
                    <Select
                      value={formData.smoking}
                      onValueChange={(value) => handleChange("smoking", value)}
                    >
                      <SelectTrigger id="smoking">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never Smoked</SelectItem>
                        <SelectItem value="formerly">Formerly Smoked</SelectItem>
                        <SelectItem value="smokes">Smokes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Get Prediction"}
                  </Button>
                </div>
              </form>
            </div>

            {result && (
              <PredictionResult
                isPositive={result.isPositive}
                probability={result.probability}
                message={
                  result.isPositive
                    ? "Higher risk of stroke detected"
                    : "Lower risk of stroke detected"
                }
                details={
                  result.isPositive
                    ? "Based on your input, our model detected factors that may indicate a higher risk of stroke. Please consult a healthcare professional for a proper diagnosis."
                    : "Based on your input, our model suggests a lower risk of stroke. Continue maintaining a healthy lifestyle."
                }
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StrokeRiskPrediction;
