'use client';
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertJsonToCsv, downloadCsv } from "@/lib/utils";

interface Enquiry {
  fileName: string;
  content: string;
  timestamp: Timestamp;
}

interface BatchElement {
  enquiries: Enquiry[];
  fileName: string;
}

const Downloads: React.FC = () => {
  const { toast } = useToast();
  const [batchedEnquiries, setBatchedEnquiries] = useState<BatchElement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBatches, setFilteredBatches] = useState<BatchElement[]>([]); // State for filtered batches // State for search term
  const limit = 3; // Number of items per CSV file

  const fetchEnquiries = async () => {
    try {
      const concessionHistoryRef = collection(db, "ConcessionHistory");
      const querySnapshot = await getDocs(concessionHistoryRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      if (data.length > 0 && data[0].history) {
        makeBatches(data[0].history);
      } else {
        setBatchedEnquiries([]);
      }
    } catch (error) {
      console.error("Error fetching ConcessionHistory:", error);
      toast({
        title: "Error",
        description: "Failed to fetch ConcessionHistory. Please try again later.",
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
          fileName: `Z${i}-Z${i+limit-1}.csv`,
        });
      }
      i += limit;
    }
    setBatchedEnquiries(batches);
    setFilteredBatches(batches);
  };

  const handleDownloadBatchCSV = async (batchIndex: number, fileName: string) => {
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

      downloadCsv(
        csvContent,
        fileName
      );
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
    const filtered = batchedEnquiries.filter(batch =>
      batch.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBatches(filtered);
  }, [searchTerm, batchedEnquiries]); 

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search batch names..."
          className="border border-gray-300 rounded px-3 py-1 outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Batch
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredBatches.map((batch, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {batch.fileName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {batch.enquiries.length} items
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <button
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  onClick={() => handleDownloadBatchCSV(index, batch.fileName)}
                >
                  Download CSV
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredBatches.length === 0 && (
        <p className="text-gray-600 mt-4">No enquiries available.</p>
      )}
    </div>
  );
};

export default Downloads;
