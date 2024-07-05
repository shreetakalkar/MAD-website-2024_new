import { BatchElement } from "@/app/dashboard/@railway/downloads/page";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DownloadTableRowProps {
  index: number;
  batch: BatchElement;
  date: any;
  handleDownloadBatchCSV: (batchIndex: number, fileName: string) => void;
  theme: string;
}

const DownloadTableRow: React.FC<DownloadTableRowProps> = ({
  index,
  batch,
  date,
  handleDownloadBatchCSV,
  theme,
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <div className="ml-4">
            <div
              className={cn("text-sm font-medium", {
                "text-gray-300": theme === "dark",
                "text-gray-700": theme === "light",
              })}
            >
              {batch.fileName}
            </div>
            <div className="text-sm text-gray-500">
              {batch.enquiries.length} items
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-left text-sm font-medium">
        <button
          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
          onClick={() => handleDownloadBatchCSV(index, batch.fileName)}
        >
          Download CSV
        </button>
      </TableCell>
      <TableCell
        className={cn("text-left text-sm font-medium", {
          "text-gray-300": theme === "dark",
          "text-gray-700": theme === "light",
        })}
      >
        {date && new Date(date.date).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};

export default DownloadTableRow;
