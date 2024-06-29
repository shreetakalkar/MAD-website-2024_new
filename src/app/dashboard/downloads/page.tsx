"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertJsonToCsv, downloadCsv } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface Enquiry {
  id: string;
  address: string;
  ageMonths: number;
  ageYears: number;
  branch: string;
  class: string;
  dob: Timestamp;
  duration: string;
  firstName: string;
  from: string;
  gender: string;
  gradyear: string;
  idCardURL: string;
  lastName: string;
  lastPassIssued: Timestamp;
  middleName: string;
  passNum: string;
  phoneNum: number;
  previousPassURL: string;
  status: string;
  statusMessage: string;
  to: string;
  travelLane: string;
}


interface BatchElement {
  enquiries: Enquiry[];
  fileName: string;
}

const Downloads: React.FC = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [batchedEnquiries, setBatchedEnquiries] = useState<BatchElement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBatches, setFilteredBatches] = useState<BatchElement[]>([]); // State for filtered batches // State for search term
  const limit = 5; // Number of items per CSV file
  const [date, setDate] = useState<any>([]);

  const fetchEnquiries = async () => {
    try {
      const concessionHistoryRef = collection(db, "ConcessionHistory");
      const querySnapshot = await getDocs(concessionHistoryRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      if (data.length > 0 && data[0].history) {
        console.log(data[0].history); 
        makeBatches(data[0].history);
        setDate(data[0].csvUpdatedDate);
      } else {
        setBatchedEnquiries([]);
      }
    } catch (error) {
      console.error("Error fetching ConcessionHistory:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch ConcessionHistory. Please try again later.",
      });
    }
  };

  const makeBatches = (data: Enquiry[]) => {
    const batches: BatchElement[] = [];
    let i = 0;

    while (i < data.length) {
      const currentBatch = data.slice(i, i + limit);
      if (currentBatch.length === limit) {
        batches.push({
          enquiries: currentBatch,
          fileName: `Z${i}-Z${i + limit - 1}.csv`,
        });
      }
      i += limit;
    }
    setBatchedEnquiries(batches);
    setFilteredBatches(batches);
  };

  const handleDownloadBatchCSV = async (
    batchIndex: number,
    fileName: string
  ) => {
    try {
      const columnsToInclude = ["fileName", "content", "timestamp"];
      const enquiriesSubset = batchedEnquiries[batchIndex];

      if (!enquiriesSubset) {
        toast({
          title: "Error",
          description: "Batch not found.",
        });
        return;
      }

      const csvContent = await convertJsonToCsv(
        enquiriesSubset.enquiries,
        columnsToInclude
      );

      if (!csvContent) {
        toast({
          title: "Error",
          description: "Failed to generate CSV content.",
        });
        return;
      }

      downloadCsv(csvContent, fileName);
    } catch (error) {
      console.error("Error handling CSV download:", error);
      toast({
        title: "Error",
        description: "Failed to download CSV file. Please try again later.",
      });
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []); // Fetch enquiries on initial render

  useEffect(() => {
    const filtered = batchedEnquiries.filter((batch) =>
      batch.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBatches(filtered);
  }, [searchTerm, batchedEnquiries]);

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex items-center justify-between mb-4 p-5">
        <div className="flex w-full justify-between flex-wrap items-center">
          <h2 className="text-2xl max-sm:text-xl font-semibold mr-4">
            Downloads
          </h2>
          <div>
            <Input
              className="ring-1 ring-gray-400 focus:ring-gray-400"
              type="text"
              placeholder="Search batch names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {" "} */}
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-300">
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
                    onClick={() =>
                      handleDownloadBatchCSV(index, batch.fileName)
                    }
                  >
                    Download CSV
                  </button>
                </TableCell>
                <TableCell className="text-left text-sm font-medium text-gray-300">
                {new Date(date[index].date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="px-6 py-4 text-gray-600">
                {" "}
                No enquiries available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// export function TableDemo() {
//   return (
//     <Table>
//       <TableCaption>A list of your recent invoices.</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">Invoice</TableHead>
//           <TableHead>Status</TableHead>
//           <TableHead>Method</TableHead>
//           <TableHead className="text-right">Amount</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {invoices.map((invoice) => (
//           <TableRow key={invoice.invoice}>
//             <TableCell className="font-medium">{invoice.invoice}</TableCell>
//             <TableCell>{invoice.paymentStatus}</TableCell>
//             <TableCell>{invoice.paymentMethod}</TableCell>
//             <TableCell className="text-right">{invoice.totalAmount}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//       <TableFooter>
//         <TableRow>
//           <TableCell colSpan={3}>Total</TableCell>
//           <TableCell className="text-right">$2,500.00</TableCell>
//         </TableRow>
//       </TableFooter>
//     </Table>
//   )
// }

export default Downloads;
