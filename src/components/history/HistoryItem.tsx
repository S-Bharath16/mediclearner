
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { PredictionHistoryItem } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { HistoryItemDetails } from './HistoryItemDetails';

interface HistoryItemProps {
  item: PredictionHistoryItem;
  isExpanded: boolean;
  toggleExpand: (id: number) => void;
  removeFromHistory: (id: number) => Promise<boolean>;
}

export const HistoryItem = ({ 
  item, 
  isExpanded, 
  toggleExpand, 
  removeFromHistory 
}: HistoryItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getDisplayTitle = (predictionType: string): string => {
    switch (predictionType) {
      case 'diabetes':
        return 'Diabetes Prediction';
      case 'heart':
        return 'Heart Disease Prediction';
      case 'lung':
        return 'Lung Cancer Prediction';
      case 'stroke':
        return 'Stroke Risk Prediction';
      default:
        return predictionType;
    }
  };

  const getResultSummary = (item: PredictionHistoryItem): string => {
    const result = item.result;
    if (result && 'isPositive' in result) {
      return result.isPositive 
        ? `Higher risk detected (${Math.round(result.probability * 100)}%)`
        : `Lower risk detected (${Math.round((1 - result.probability) * 100)}%)`;
    }
    return 'Result unavailable';
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div 
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => toggleExpand(item.id)}
      >
        <div>
          <div className="font-medium">{getDisplayTitle(item.prediction_type)}</div>
          <div className="text-sm text-muted-foreground">{formatDate(item.created_at)}</div>
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">{getResultSummary(item)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              removeFromHistory(item.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </div>
      
      {isExpanded && <HistoryItemDetails item={item} />}
    </div>
  );
};
