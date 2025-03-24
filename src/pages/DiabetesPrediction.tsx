
import { useState } from "react";
import Layout from "../components/Layout";
import PredictionResult from "../components/PredictionResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { diabetesModel, predict } from "../utils/logisticRegression";
import { useHistory } from "@/hooks/use-history";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  age: number;
  gender: string;
  glucose: number;
  bmi: number;
  bloodPressure: number;
  insulin: number;
  skinThickness: number;
  pregnancies: number;
}

const initialFormData: FormData = {
  age: 30,
  gender: "female",
  glucose: 100,
  bmi: 25,
  bloodPressure: 120,
  insulin: 80,
  skinThickness: 20,
  pregnancies: 0,
};

const DiabetesPrediction = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<{ isPositive: boolean; probability: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToHistory } = useHistory();
  const { toast } = useToast();

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
    setTimeout(async () => {
      // Use our logistic regression model to make a prediction
      const features = {
        age: formData.age,
        glucose: formData.glucose,
        bmi: formData.bmi,
        bloodPressure: formData.bloodPressure,
        insulin: formData.insulin,
        skinThickness: formData.skinThickness,
        // Only include pregnancies for females
        ...(formData.gender === "female" ? { pregnancies: formData.pregnancies } : {})
      };
      
      const prediction = predict(diabetesModel, features);
      
      const predictionResult = {
        isPositive: prediction.isPositive,
        probability: prediction.probability,
      };
      
      setResult(predictionResult);
      
      // Save to history
      try {
        const saved = await addToHistory('diabetes', formData, predictionResult);
        if (saved) {
          toast({
            title: "Success",
            description: "Prediction saved to history",
          });
        }
      } catch (error) {
        console.error("Error saving to history:", error);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-50 text-medical-600 rounded-full text-sm font-medium">
            Diabetes Risk Assessment
          </div>
          <h1 className="text-3xl font-bold mb-2">Diabetes Prediction</h1>
          <p className="text-muted-foreground">
            Enter your health information to assess your risk of diabetes using our AI model
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
                    <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                    <Input
                      id="bloodPressure"
                      type="number"
                      min="80"
                      max="200"
                      value={formData.bloodPressure}
                      onChange={(e) => handleChange("bloodPressure", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insulin">Insulin Level (µU/ml)</Label>
                    <Input
                      id="insulin"
                      type="number"
                      min="0"
                      max="300"
                      value={formData.insulin}
                      onChange={(e) => handleChange("insulin", Number(e.target.value))}
                      required
                    />
                  </div>

                  {formData.gender === "female" && (
                    <div className="space-y-2">
                      <Label htmlFor="pregnancies">Number of Pregnancies</Label>
                      <Input
                        id="pregnancies"
                        type="number"
                        min="0"
                        max="20"
                        value={formData.pregnancies}
                        onChange={(e) => handleChange("pregnancies", Number(e.target.value))}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="skinThickness">Skin Thickness (mm)</Label>
                    <Input
                      id="skinThickness"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.skinThickness}
                      onChange={(e) => handleChange("skinThickness", Number(e.target.value))}
                      required
                    />
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
                    ? "Higher risk of diabetes detected"
                    : "Lower risk of diabetes detected"
                }
                details={
                  result.isPositive
                    ? "Based on your input, our model detected factors that may indicate a higher risk of diabetes. Please consult a healthcare professional for a proper diagnosis."
                    : "Based on your input, our model suggests a lower risk of diabetes. Continue maintaining a healthy lifestyle."
                }
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiabetesPrediction;
