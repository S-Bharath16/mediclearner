
import { useState } from "react";
import Layout from "../components/Layout";
import PredictionResult from "../components/PredictionResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { heartDiseaseModel, predict } from "../utils/logisticRegression";
import { useHistory } from "@/hooks/use-history";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  age: number;
  gender: string;
  chestPain: string;
  restingBP: number;
  cholesterol: number;
  fastingBS: boolean;
  restingECG: string;
  maxHR: number;
  exerciseAngina: boolean;
}

const initialFormData: FormData = {
  age: 45,
  gender: "male",
  chestPain: "typical",
  restingBP: 120,
  cholesterol: 200,
  fastingBS: false,
  restingECG: "normal",
  maxHR: 150,
  exerciseAngina: false,
};

const HeartDiseasePrediction = () => {
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
        restingBP: formData.restingBP,
        cholesterol: formData.cholesterol,
        fastingBS: formData.fastingBS,
        maxHR: formData.maxHR,
        exerciseAngina: formData.exerciseAngina,
        chestPainType: formData.chestPain
      };
      
      const prediction = predict(heartDiseaseModel, features);
      
      const predictionResult = {
        isPositive: prediction.isPositive,
        probability: prediction.probability,
      };
      
      setResult(predictionResult);
      
      // Save to history
      try {
        const saved = await addToHistory('heart', formData, predictionResult);
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
            Cardiovascular Assessment
          </div>
          <h1 className="text-3xl font-bold mb-2">Heart Disease Prediction</h1>
          <p className="text-muted-foreground">
            Enter your cardiac health information to evaluate your risk of heart disease
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
                    <Label htmlFor="chestPain">Chest Pain Type</Label>
                    <Select
                      value={formData.chestPain}
                      onValueChange={(value) => handleChange("chestPain", value)}
                    >
                      <SelectTrigger id="chestPain">
                        <SelectValue placeholder="Select chest pain type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="typical">Typical Angina</SelectItem>
                        <SelectItem value="atypical">Atypical Angina</SelectItem>
                        <SelectItem value="nonanginal">Non-anginal Pain</SelectItem>
                        <SelectItem value="asymptomatic">Asymptomatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restingBP">Resting Blood Pressure (mmHg)</Label>
                    <Input
                      id="restingBP"
                      type="number"
                      min="80"
                      max="200"
                      value={formData.restingBP}
                      onChange={(e) => handleChange("restingBP", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                    <Input
                      id="cholesterol"
                      type="number"
                      min="100"
                      max="600"
                      value={formData.cholesterol}
                      onChange={(e) => handleChange("cholesterol", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fastingBS">Fasting Blood Sugar &gt; 120 mg/dL</Label>
                    <RadioGroup
                      value={formData.fastingBS ? "yes" : "no"}
                      onValueChange={(value) => handleChange("fastingBS", value === "yes")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="fastingBS-yes" />
                        <Label htmlFor="fastingBS-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="fastingBS-no" />
                        <Label htmlFor="fastingBS-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restingECG">Resting ECG</Label>
                    <Select
                      value={formData.restingECG}
                      onValueChange={(value) => handleChange("restingECG", value)}
                    >
                      <SelectTrigger id="restingECG">
                        <SelectValue placeholder="Select resting ECG" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="st-abnormality">ST-T Wave Abnormality</SelectItem>
                        <SelectItem value="hypertrophy">Left Ventricular Hypertrophy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxHR">Maximum Heart Rate</Label>
                    <Input
                      id="maxHR"
                      type="number"
                      min="60"
                      max="220"
                      value={formData.maxHR}
                      onChange={(e) => handleChange("maxHR", Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exerciseAngina">Exercise-Induced Angina</Label>
                    <RadioGroup
                      value={formData.exerciseAngina ? "yes" : "no"}
                      onValueChange={(value) => handleChange("exerciseAngina", value === "yes")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="exerciseAngina-yes" />
                        <Label htmlFor="exerciseAngina-yes" className="font-normal">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="exerciseAngina-no" />
                        <Label htmlFor="exerciseAngina-no" className="font-normal">No</Label>
                      </div>
                    </RadioGroup>
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
                    ? "Higher risk of heart disease detected"
                    : "Lower risk of heart disease detected"
                }
                details={
                  result.isPositive
                    ? "Based on your input, our model detected factors that may indicate a higher risk of heart disease. Please consult a healthcare professional for a proper diagnosis."
                    : "Based on your input, our model suggests a lower risk of heart disease. Continue maintaining a healthy lifestyle."
                }
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HeartDiseasePrediction;
