"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertJsonToCsv, downloadCsv } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import DownloadTable from "@/components/DownloadTable";

export interface Enquiry {
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

export interface BatchElement {
  enquiries: Enquiry[];
  fileName: string;
}

const Downloads: React.FC = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [batchedEnquiries, setBatchedEnquiries] = useState<BatchElement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBatches, setFilteredBatches] = useState<BatchElement[]>([]);
  const limit = 5; 
  const [date, setDate] = useState<any>([]);

  const fetchEnquiries = async () => {
    try {
      const concessionHistoryRef = collection(db, "ConcessionHistory");
      const querySnapshot = await getDocs(concessionHistoryRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      if (data.length > 0 && data[0].history) {
        makeBatches(data[0].history);
        setDate(data[0].csvUpdatedDate);
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
          fileName: `Z${i}-Z${i + limit - 1}.csv`,
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

      const csvContent = await convertJsonToCsv(enquiriesSubset.enquiries, columnsToInclude);

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
  }, []);

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
          <h2 className="text-2xl max-sm:text-xl font-semibold mr-4">Downloads</h2>
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
      <DownloadTable 
        batches={filteredBatches} 
        date={date} 
        handleDownloadBatchCSV={handleDownloadBatchCSV} 
        theme={theme}
      />
    </div>
  );
};

export default Downloads;
