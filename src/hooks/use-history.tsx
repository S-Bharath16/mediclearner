
import { useState, useEffect } from 'react';
import { 
  getAllPredictions, 
  getPredictionsByType, 
  savePrediction, 
  deletePrediction,
  PredictionHistoryItem
} from '@/utils/database';
import { useToast } from '@/hooks/use-toast';

export type { PredictionHistoryItem };

export function useHistory() {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const data = await getAllPredictions();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('Failed to load history');
      toast({
        title: 'Error',
        description: 'Failed to load prediction history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryByType = async (type: string) => {
    try {
      setLoading(true);
      const data = await getPredictionsByType(type);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(`Failed to load ${type} history`);
      toast({
        title: 'Error',
        description: `Failed to load ${type} prediction history`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (
    predictionType: string,
    inputData: any,
    result: any
  ) => {
    try {
      const id = await savePrediction(predictionType, inputData, result);
      if (id) {
        const newHistoryItem: PredictionHistoryItem = {
          id,
          prediction_type: predictionType,
          input_data: inputData,
          result,
          created_at: new Date().toISOString(),
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save prediction to history',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeFromHistory = async (id: number) => {
    try {
      const success = await deletePrediction(id);
      if (success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        toast({
          title: 'Success',
          description: 'Prediction removed from history',
        });
        return true;
      }
      return false;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove prediction from history',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Load history on mount
  useEffect(() => {
    fetchAllHistory();
  }, []);

  return {
    history,
    loading,
    error,
    fetchAllHistory,
    fetchHistoryByType,
    addToHistory,
    removeFromHistory,
  };
}
