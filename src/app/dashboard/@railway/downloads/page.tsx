"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
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
  date: Date | null;
}

export interface Download {
  from: number;
  to: number;
  date: Date;
  filename: string;
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
  const limit = 100;
  // const [downloadDate, setDownloadDate] = useState<any>([]);

  const fetchDownloadHistory = async () => {
    try {
      const concessionHistoryRef = doc(db, "ConcessionHistory", "History");
      const docSnap = await getDoc(concessionHistoryRef);
      if (docSnap.exists() && docSnap.data().downloaded) {
        return docSnap.data().downloaded;
      }
      return [];
    } catch (error) {
      console.error("Error fetching download history:", error);
      return [];
    }
  };

  const fetchEnquiries = async () => {
    try {
      const concessionHistoryRef = doc(db, "ConcessionHistory", "History");
      const docSnap = await getDoc(concessionHistoryRef);
  
      const downloadHistory = await fetchDownloadHistory();
  
      if (docSnap.exists() && docSnap.data().history) {

        // console.log("Doc Snap: ", docSnap.data().history)
        // Yeh chal rha hai jaisa chalna chahiye, contact fahed before making ANY CHANGES
        const sortedData = (docSnap.data().history.sort((a: any, b: any) => a.passNum.localeCompare(b.passNum))).reverse();
        makeBatches(sortedData  , downloadHistory);
      } else {
        setWesternBatchedEnquiries([]);
        setCentralBatchedEnquiries([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
      });
    }
  };
  
  const makeBatches = (data: Enquiry[], downloadHistory: Download[]) => {
    const seenPassNums = new Set<string>();
    const uniqueData: Enquiry[] = [];

    // console.log("raw data", data);
    
    for (let i = data.length - 1; i >= 0; i--) {
      const enquiry = data[i];
      if (!seenPassNums.has(enquiry.passNum)) {
        seenPassNums.add(enquiry.passNum);
        uniqueData.push(enquiry); // making the array in reverse order to get the latest enquiry first
      }
    }
    // console.log("unique data", uniqueData);

    const westernBatches: BatchElement[] = [];
    const centralBatches: BatchElement[] = [];

    let westernIndex = 0;
    let centralIndex = 0;

    const isDownloaded = (fileName: string) => {
      return downloadHistory.some((d) => d.filename === fileName);
    };

    const getDownloadDate = (fileName: string) => {
      const download = downloadHistory.find((d) => d.filename === fileName);
      return download ? new Date(download.date) : null;
    };

    for (let i = 0; i < uniqueData.length; i++) {
      const enquiry = uniqueData[i];

      if (
        (enquiry.status === "serviced" || enquiry.status === "cancelled") &&
        (enquiry.travelLane === "Western")
      ) {
        if (
          westernBatches.length === 0 ||
          westernBatches[westernBatches.length - 1]?.enquiries?.length === limit
        ) {
          // const isDownload = downloadDate.find((d : any)=> d.from === westernIndex+1 && d.to === westernIndex+limit)
          const fileName = `W${westernIndex + 1}-${westernIndex + limit}`;

          westernBatches.push({
            enquiries: [enquiry],
            fileName: fileName,
            lane: "Western",
            isDownloaded: isDownloaded(fileName),
            date: getDownloadDate(fileName),
          });

          westernIndex += limit;
        } else {
          westernBatches[westernBatches.length - 1]?.enquiries.push(enquiry);
        }
      } else if (
        (enquiry.status === "serviced") && (enquiry.travelLane === "Central" || enquiry.travelLane === "Harbour")
        
      ) {
        if (
          centralBatches.length === 0 ||
          centralBatches[centralBatches.length - 1]?.enquiries.length === limit
        ) {
          const fileName = `C${centralIndex + 1}-${centralIndex + limit}`;
          centralBatches.push({
            enquiries: [enquiry],
            fileName,
            lane: "Central",
            isDownloaded: isDownloaded(fileName),
            date: getDownloadDate(fileName),
          });
          centralIndex += limit;
        } else {
          centralBatches[centralBatches.length - 1]?.enquiries.push(enquiry);
        }
      }
    }

    if (westernBatches[westernBatches.length - 1]?.enquiries?.length < limit) {
      westernBatches.pop();
    }

    if (centralBatches[centralBatches.length - 1]?.enquiries?.length < limit) {
      centralBatches.pop();
    }

    // console.log("western batches", westernBatches);
    // console.log("central batches", centralBatches);

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

      const newDownload = {
        from: batch?.enquiries[0].passNum,
        to: batch?.enquiries[batch?.enquiries?.length - 1].passNum,
        date: new Date().toISOString(),
        filename: batch.fileName,
      };

      batch.date = new Date();
      batch.isDownloaded = true;

      const concessionHistoryRef = doc(db, "ConcessionHistory", "History");

      // Fetch the current document
      const docSnap = await getDoc(concessionHistoryRef);

      if (docSnap.exists()) {
        let downloadedArray = docSnap.data().downloaded || [];
        const existingIndex = downloadedArray.findIndex(
          (item: any) => item.filename === newDownload.filename
        );

        if (existingIndex !== -1) {
          downloadedArray[existingIndex] = newDownload;
        } else {
          downloadedArray.push(newDownload);
        }

        await updateDoc(concessionHistoryRef, {
          downloaded: downloadedArray,
        });
      } else {
        await setDoc(concessionHistoryRef, {
          downloaded: [newDownload],
        });
      }

      //updating local state
      const updateBatches = (batches: BatchElement[]) =>
        batches.map((b) =>
          b.fileName === batch.fileName
            ? { ...b, isDownloaded: true, date: new Date() }
            : b
        );

      setWesternBatchedEnquiries(updateBatches(westernBatchedEnquiries));
      setCentralBatchedEnquiries(updateBatches(centralBatchedEnquiries));
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
      <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center'}}>
        Download Excel Files ONLY when All passes are collected. If there are few passes which are not Collected then Cancel those passes from Update Pass.
      </div>
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
        handleDownloadBatchExcel={handleDownloadBatchExcel}
        theme={theme || "dark"}
      />
    </div>
  );
};

export default Downloads;
