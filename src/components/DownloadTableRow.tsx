import { BatchElement } from "@/app/dashboard/@railway/downloads/page";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DownloadTableRowProps {
  index: number;
  batch: BatchElement;
  date: any;
  handleDownloadBatchExcel: (batchIndex: number, fileName: string) => void;
  theme: string;
}

const DownloadTableRow: React.FC<DownloadTableRowProps> = ({
  index,
  batch,
  date,
  handleDownloadBatchExcel,
  theme,
}) => {
  const datePart = date?.date?.split(" at ")[0];
  const parsedDate = new Date(datePart);
  return (
    <TableRow className={cn("text-sm font-medium", {
      "text-gray-300": theme === "dark",
      "text-gray-700": theme === "light",
    })}>
      <TableCell className="text-left text-sm font-medium">
        <div className="flex items-center">
          <div>
            <div>
              {batch.fileName}
            </div>
            <div className="text-sm text-gray-500">
              {batch.centralEnquiries.length + batch.westernEnquiries.length} items
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-left text-sm font-medium">
        <button
          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
          onClick={() => handleDownloadBatchExcel(index, batch.fileName)}
        >
          Download
        </button>
      </TableCell>
      <TableCell className="text-left text-sm font-medium ml-4">
      <span className="ml-4">{batch.westernEnquiries.length}</span>
      </TableCell>
      <TableCell className="text-left text-sm font-medium light:text-gray-700">
        <span className="ml-4">{batch.centralEnquiries.length}</span>
      </TableCell>
      <TableCell
        className={cn("text-left text-sm font-medium", {
          "text-gray-300": theme === "dark",
          "text-gray-700": theme === "light",
        })}
      >
        {date && parsedDate.toLocaleDateString()}
      </TableCell>
    </TableRow>
  );
};

export default DownloadTableRow;
