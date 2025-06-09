import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BatchElement } from "@/app/dashboard/@railway/downloads/page";
import { dateFormat } from "@/constants/dateFormat";

interface DownloadTableRowProps {
  srNo: number;
  batch: BatchElement;
  handleDownloadBatchExcel: (batch: BatchElement) => void;
  theme: string;
}

const DownloadTableRow: React.FC<DownloadTableRowProps> = ({
  srNo,
  batch,
  handleDownloadBatchExcel,
  theme,
}) => {
  return (
    <TableRow>
      <TableCell>{srNo}</TableCell>
      <TableCell>{batch.fileName}</TableCell>
      <TableCell>
        <Button 
          onClick={() => handleDownloadBatchExcel(batch)}
          variant="outline"
          className={`${theme === "dark" ? "text-white" : "text-black"}`}
        >
          Download
        </Button>
      </TableCell>
      <TableCell>{batch.isDownloaded ? 'Yes' : 'No'}</TableCell>
      <TableCell className="pl-8">{batch.date ?dateFormat(batch.date) : '-'}</TableCell>
    </TableRow>
  );
};

export default DownloadTableRow;