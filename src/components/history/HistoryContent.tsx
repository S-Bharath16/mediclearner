
import { useState } from 'react';
import { PredictionHistoryItem } from '@/hooks/use-history';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HistoryList } from './HistoryList';

type PredictionType = 'all' | 'diabetes' | 'heart' | 'lung' | 'stroke';

interface HistoryContentProps {
  history: PredictionHistoryItem[];
  loading: boolean;
  error: string | null;
  fetchAllHistory: () => Promise<void>;
  fetchHistoryByType: (type: string) => Promise<void>;
  removeFromHistory: (id: number) => Promise<boolean>;
}

export const HistoryContent = ({
  history,
  loading,
  error,
  fetchAllHistory,
  fetchHistoryByType,
  removeFromHistory
}: HistoryContentProps) => {
  const [activeTab, setActiveTab] = useState<PredictionType>('all');

  const handleFilterChange = (type: PredictionType) => {
    setActiveTab(type);
    if (type === 'all') {
      fetchAllHistory();
    } else {
      fetchHistoryByType(type);
    }
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => handleFilterChange(value as PredictionType)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="diabetes">Diabetes</TabsTrigger>
            <TabsTrigger value="heart">Heart</TabsTrigger>
            <TabsTrigger value="lung">Lung</TabsTrigger>
            <TabsTrigger value="stroke">Stroke</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="m-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-medical-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => activeTab === 'all' ? fetchAllHistory() : fetchHistoryByType(activeTab)}
              >
                Try Again
              </Button>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No prediction history found</p>
            </div>
          ) : (
            <HistoryList 
              historyItems={history} 
              removeFromHistory={removeFromHistory} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
