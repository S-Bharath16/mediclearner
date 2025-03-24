
import { useState } from 'react';
import { PredictionHistoryItem } from '@/hooks/use-history';
import { HistoryItem } from './HistoryItem';

interface HistoryListProps {
  historyItems: PredictionHistoryItem[];
  removeFromHistory: (id: number) => Promise<boolean>;
}

export const HistoryList = ({ historyItems, removeFromHistory }: HistoryListProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
      {historyItems.map((item) => (
        <HistoryItem
          key={item.id}
          item={item}
          isExpanded={!!expandedItems[item.id]}
          toggleExpand={toggleExpand}
          removeFromHistory={removeFromHistory}
        />
      ))}
    </div>
  );
};
