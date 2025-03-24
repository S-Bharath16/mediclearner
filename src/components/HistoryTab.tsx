
import { useState, useEffect } from 'react';
import { Clock, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useHistory, PredictionHistoryItem } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { initDatabase } from '@/utils/database';

type PredictionType = 'all' | 'diabetes' | 'heart' | 'lung' | 'stroke';

const HistoryTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    history, 
    loading, 
    error, 
    fetchAllHistory, 
    fetchHistoryByType, 
    removeFromHistory 
  } = useHistory();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<PredictionType>('all');

  useEffect(() => {
    // Initialize database on component mount
    initDatabase();
  }, []);
  
  const handleFilterChange = (type: PredictionType) => {
    setActiveTab(type);
    if (type === 'all') {
      fetchAllHistory();
    } else {
      fetchHistoryByType(type);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
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
                  <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="border rounded-md overflow-hidden bg-white">
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
                            {expandedItems[item.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </div>
                        </div>
                        
                        {expandedItems[item.id] && (
                          <div className="p-3 border-t bg-gray-50">
                            <div className="mb-3">
                              <h4 className="text-sm font-medium mb-1">Input Data</h4>
                              <Table>
                                <TableBody>
                                  {Object.entries(item.input_data).map(([key, value]) => (
                                    <TableRow key={key}>
                                      <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                                      <TableCell>{renderValue(value)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-1">Result</h4>
                              <Table>
                                <TableBody>
                                  {Object.entries(item.result).map(([key, value]) => (
                                    <TableRow key={key}>
                                      <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                                      <TableCell>{renderValue(value)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HistoryTab;
