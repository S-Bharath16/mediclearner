
import { CheckCircle, AlertCircle } from "lucide-react";

interface PredictionResultProps {
  isPositive: boolean;
  probability?: number;
  message: string;
  details?: string;
}

const PredictionResult = ({
  isPositive,
  probability,
  message,
  details,
}: PredictionResultProps) => {
  return (
    <div className="result-container mt-8 rounded-xl border border-border/50 p-6 bg-white shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-4 p-3 rounded-full ${
            isPositive
              ? "bg-red-50 text-red-500"
              : "bg-green-50 text-green-500"
          }`}
        >
          {isPositive ? (
            <AlertCircle className="h-8 w-8" />
          ) : (
            <CheckCircle className="h-8 w-8" />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">{message}</h3>
        {probability !== undefined && (
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">Probability: </span>
            <span className={`font-semibold ${isPositive ? "text-red-500" : "text-green-500"}`}>
              {(probability * 100).toFixed(1)}%
            </span>
          </div>
        )}
        {details && <p className="text-sm text-muted-foreground">{details}</p>}
      </div>
    </div>
  );
};

export default PredictionResult;
