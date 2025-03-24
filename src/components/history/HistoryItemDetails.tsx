
import { PredictionHistoryItem } from '@/hooks/use-history';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';

interface HistoryItemDetailsProps {
  item: PredictionHistoryItem;
}

export const HistoryItemDetails = ({ item }: HistoryItemDetailsProps) => {
  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  return (
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
  );
};
