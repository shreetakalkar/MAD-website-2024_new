"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { createExcelFile, downloadExcelFile } from "@/lib/excelUtils";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import DownloadTable from "@/components/DownloadTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Enquiry } from "@/constants/types/userTypes";
export interface BatchElement {
  enquiries: Enquiry[];
  fileName: string;
  lane: "Central" | "Western";
  isDownloaded: boolean;
}

const Downloads: React.FC = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [westernBatchedEnquiries, setWesternBatchedEnquiries] = useState<
    BatchElement[]
  >([]);
  const [centralBatchedEnquiries, setCentralBatchedEnquiries] = useState<
    BatchElement[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLane, setSelectedLane] = useState<
    "All" | "Central" | "Western"
  >("All");
  const [filteredBatches, setFilteredBatches] = useState<BatchElement[]>([]);
  const limit = 2;
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
        setWesternBatchedEnquiries([]);
        setCentralBatchedEnquiries([]);
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
    const seenPassNums = new Set<string>();
    const uniqueData: Enquiry[] = [];

    console.log("raw data", data);
    for (let i = data.length - 1; i >= 0; i--) {
      const enquiry = data[i];
      if (!seenPassNums.has(enquiry.passNum)) {
        seenPassNums.add(enquiry.passNum);
        uniqueData.push(enquiry); // making the array in reverse order to get the latest enquiry first
      }
    }
    console.log("unique data", uniqueData);

    const westernBatches: BatchElement[] = [];
    const centralBatches: BatchElement[] = [];

    let westernIndex = 0;
    let centralIndex = 0;

    for (let i = 0; i < uniqueData.length; i++) {
      const enquiry = uniqueData[i];

      if (
        enquiry.status === "serviced" &&
        (enquiry.travelLane === "Western" || enquiry.travelLane === "Harbour")
      ) {
        if (
          westernBatches.length === 0 ||
          westernBatches[westernBatches.length - 1].enquiries.length === limit
        ) {
          westernBatches.push({
            enquiries: [enquiry],
            fileName: `W${westernIndex + 1}-${westernIndex + limit}`,
            lane: "Western",
            isDownloaded: false,
          });
          westernIndex += limit;
        } else {
          westernBatches[westernBatches.length - 1].enquiries.push(enquiry);
        }
      } else if (
        enquiry.status === "serviced" &&
        enquiry.travelLane === "Central"
      ) {
        if (
          centralBatches.length === 0 ||
          centralBatches[centralBatches.length - 1].enquiries.length === limit
        ) {
          centralBatches.push({
            enquiries: [enquiry],
            fileName: `C${centralIndex + 1}-${centralIndex + limit}`,
            lane: "Central",
            isDownloaded: false,
          });
          centralIndex += limit;
        } else {
          centralBatches[centralBatches.length - 1].enquiries.push(enquiry);
        }
      }
    }

    if (westernBatches[westernBatches.length - 1].enquiries.length < limit) {
      westernBatches.pop();
    }

    if (centralBatches[centralBatches.length - 1].enquiries.length < limit) {
      centralBatches.pop();
    }

    console.log("western batches", westernBatches);
    console.log("central batches", centralBatches);

    setWesternBatchedEnquiries(westernBatches);
    setCentralBatchedEnquiries(centralBatches);
  };

  const handleDownloadBatchExcel = async (batch: BatchElement) => {
    try {
      const excelContent = await createExcelFile(batch);

      if (!excelContent) {
        toast({
          title: "Error",
          description: "Failed to generate Excel content.",
        });
        return;
      }

      downloadExcelFile(excelContent, batch.fileName);

      // Update the isDownloaded status
      if (batch.lane === "Western") {
        setWesternBatchedEnquiries((prev) =>
          prev.map((b) =>
            b.fileName === batch.fileName ? { ...b, isDownloaded: true } : b
          )
        );
      } else {
        setCentralBatchedEnquiries((prev) =>
          prev.map((b) =>
            b.fileName === batch.fileName ? { ...b, isDownloaded: true } : b
          )
        );
      }
    } catch (error) {
      console.error("Error handling Excel download:", error);
      toast({
        title: "Error",
        description: "Failed to download Excel file. Please try again later.",
      });
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    let allBatches = [...westernBatchedEnquiries, ...centralBatchedEnquiries];

    if (selectedLane !== "All") {
      allBatches = allBatches.filter((batch) => batch.lane === selectedLane);
    }

    const filtered = allBatches.filter((batch) =>
      batch.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBatches(filtered);
  }, [
    searchTerm,
    selectedLane,
    westernBatchedEnquiries,
    centralBatchedEnquiries,
  ]);

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex items-center justify-between mb-4 p-5">
        <div className="flex w-full justify-between flex-wrap items-center">
          <h2 className="text-2xl max-sm:text-xl font-semibold mr-4">
            Downloads
          </h2>
          <div className="flex space-x-4">
            <Select
              value={selectedLane}
              onValueChange={(value: "All" | "Central" | "Western") =>
                setSelectedLane(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Lane" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="Western">Western</SelectItem>
              </SelectContent>
            </Select>
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
        handleDownloadBatchExcel={handleDownloadBatchExcel}
        theme={theme || "dark"}
      />
    </div>
  );
};

export default Downloads;
