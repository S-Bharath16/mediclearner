
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { HistoryContent } from './HistoryContent';
import { initDatabase } from '@/utils/database';

export const HistoryTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    history, 
    loading, 
    error, 
    fetchAllHistory, 
    fetchHistoryByType, 
    removeFromHistory 
  } = useHistory();

  useEffect(() => {
    // Initialize database on component mount
    initDatabase();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full bg-medical-600 hover:bg-medical-700 shadow-lg"
          >
            <Clock className="h-6 w-6" />
            <span className="sr-only">View History</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center">
              <Clock className="mr-2 text-medical-600" />
              Prediction History
            </SheetTitle>
          </SheetHeader>

          <HistoryContent 
            history={history}
            loading={loading}
            error={error}
            fetchAllHistory={fetchAllHistory}
            fetchHistoryByType={fetchHistoryByType}
            removeFromHistory={removeFromHistory}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
