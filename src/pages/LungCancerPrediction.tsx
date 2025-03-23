
import { useState } from "react";
import Layout from "../components/Layout";
import PredictionResult from "../components/PredictionResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  age: number;
  gender: string;
  smoking: boolean;
  smokingYears: number;
  yellowFingers: boolean;
  anxiety: boolean;
  peerPressure: boolean;
  chronicDisease: boolean;
  fatigue: boolean;
  allergies: boolean;
  wheezing: boolean;
  alcoholConsuming: boolean;
  coughing: boolean;
  shortnessOfBreath: boolean;
  swallowingDifficulty: boolean;
  chestPain: boolean;
}

const initialFormData: FormData = {
  age: 45,
  gender: "male",
  smoking: false,
  smokingYears: 0,
  yellowFingers: false,
  anxiety: false,
  peerPressure: false,
  chronicDisease: false,
  fatigue: false,
  allergies: false,
  wheezing: false,
  alcoholConsuming: false,
  coughing: false,
  shortnessOfBreath: false,
  swallowingDifficulty: false,
  chestPain: false,
};

const symptomsOptions = [
  { id: "yellowFingers", label: "Yellow Fingers" },
  { id: "anxiety", label: "Anxiety" },
  { id: "peerPressure", label: "Peer Pressure" },
  { id: "chronicDisease", label: "Chronic Disease" },
  { id: "fatigue", label: "Fatigue" },
  { id: "allergies", label: "Allergies" },
  { id: "wheezing", label: "Wheezing" },
  { id: "alcoholConsuming", label: "Alcohol Consumption" },
  { id: "coughing", label: "Persistent Coughing" },
  { id: "shortnessOfBreath", label: "Shortness of Breath" },
  { id: "swallowingDifficulty", label: "Difficulty Swallowing" },
  { id: "chestPain", label: "Chest Pain" },
];

const LungCancerPrediction = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<{ isPositive: boolean; probability: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to ML service
    setTimeout(() => {
      // Mock prediction result - in a real app, this would come from Azure/AWS
      const riskFactors = [
        formData.smoking, 
        formData.yellowFingers, 
        formData.coughing, 
        formData.shortnessOfBreath
      ].filter(Boolean).length;
      
      // Higher probability based on risk factors
      const baseProbability = 0.1 + (riskFactors * 0.1);
      const mockProbability = Math.min(Math.max(baseProbability + (Math.random() * 0.2 - 0.1), 0), 1);
      
      setResult({
        isPositive: mockProbability > 0.3,
        probability: mockProbability,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-50 text-medical-600 rounded-full text-sm font-medium">
            Lung Health Assessment
          </div>
          <h1 className="text-3xl font-bold mb-2">Lung Cancer Risk Prediction</h1>
          <p className="text-muted-foreground">
            Evaluate your risk of lung cancer based on symptoms and lifestyle factors
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
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smoking"
                      checked={formData.smoking}
                      onCheckedChange={(checked) => {
                        handleChange("smoking", !!checked);
                        if (!checked) handleChange("smokingYears", 0);
                      }}
                    />
                    <Label htmlFor="smoking" className="font-normal">Are you a smoker?</Label>
                  </div>

                  {formData.smoking && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="smokingYears">Years of smoking</Label>
                      <Input
                        id="smokingYears"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.smokingYears}
                        onChange={(e) => handleChange("smokingYears", Number(e.target.value))}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Select all symptoms that apply:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {symptomsOptions.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.id}
                          checked={formData[symptom.id as keyof FormData] as boolean}
                          onCheckedChange={(checked) => {
                            handleChange(symptom.id as keyof FormData, !!checked);
                          }}
                        />
                        <Label htmlFor={symptom.id} className="font-normal">{symptom.label}</Label>
                      </div>
                    ))}
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
                    ? "Higher risk of lung cancer detected"
                    : "Lower risk of lung cancer detected"
                }
                details={
                  result.isPositive
                    ? "Based on your input, our model detected factors that may indicate a higher risk of lung cancer. Please consult a healthcare professional for a proper diagnosis."
                    : "Based on your input, our model suggests a lower risk of lung cancer. Continue maintaining a healthy lifestyle."
                }
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LungCancerPrediction;
