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
import { Enquiry } from "@/constants/types/userTypes";
import { parse } from "path";
import { AnyRecord } from "dns";
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

interface PassBookRange {
  low: number;
  high: number;
}

interface PassBookRanges {
  [key: string]: PassBookRange;
}

const Downloads: React.FC = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [batchedEnquiries, setBatchedEnquiries] = useState<BatchElement[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBatches, setFilteredBatches] = useState<BatchElement[]>([]);

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

  const fetchPassBookDetails = async () => {
    try {
      const passBookRef = doc(db, "ConcessionHistory", "PassBook");
      const docSnap = await getDoc(passBookRef);
      if (docSnap.exists() && docSnap.data()) {
        return docSnap.data();
      }
      return [];
    } catch (error) {
      console.error("Error fetching pass book details:", error);
      return [];
    }
  };

  const parseKeyRanges = (data: any) => {
    return Object.keys(data).reduce((acc: any, key: string) => {
      const [start, end] = key.split("-");
      
      // remove prefix if exists in the ranges of the filename
      const low = parseInt(start.replace(/^[A-Za-z]\s*/, ""));
      const high = parseInt(end.replace(/^[A-Za-z]\s*/, ""));

      acc[key] = { low, high };
      return acc;
    }, {});
  }

  const makeBatches = (
    data: Enquiry[],
    downloadHistory: Download[],
    passBookRanges: PassBookRanges
  ) => {
    const seenPassNums = new Set<string>();
    const uniqueData: Enquiry[] = [];
    const batchedEnquiries: BatchElement[] = [];

    // Get unique entries (latest first)
    for (let i = data.length - 1; i >= 0; i--) {
      const enquiry = data[i];
      if (!seenPassNums.has(enquiry.passNum)) {
        seenPassNums.add(enquiry.passNum);
        uniqueData.push(enquiry);
      }
    }

    const isDownloaded = (fileName: string) => {
      return downloadHistory.some((d) => d.filename === fileName);
    };

    const getDownloadDate = (fileName: string) => {
      const download = downloadHistory.find((d) => d.filename === fileName);
      return download ? new Date(download.date) : null;
    };

    Object.entries(passBookRanges).forEach(([rangeKey, range]) => {
      const enquiriesInRange = uniqueData.filter((enquiry) => {
        const passNum = parseInt(enquiry.passNum.replace(/^[A-Za-z]\s*/, ""));


        return (
          (enquiry.status === "serviced" || enquiry.status === "cancelled") &&
          passNum >= range.low &&
          passNum <= range.high
        );
      });

      if (enquiriesInRange.length > 0) {
        const fileName = rangeKey; // Using the original range key as filename
        batchedEnquiries.push({
          enquiries: enquiriesInRange,
          fileName: fileName,
          lane: enquiriesInRange[0].travelLane as "Central" | "Western", // Taking first entry's lane
          isDownloaded: isDownloaded(fileName),
          date: getDownloadDate(fileName),
        });
      }
    });

    // Sort batches by filename
    const sortedBatches = batchedEnquiries.sort((a, b) => {
      // Extract numbers from filenames for proper numeric sorting
      const aNum = parseInt(
        a.fileName.replace(/^[A-Za-z]\s*/, "").split("-")[0]
      );
      const bNum = parseInt(
        b.fileName.replace(/^[A-Za-z]\s*/, "").split("-")[0]
      );
      return aNum - bNum;
    });

    // console.log(sortedBatches);

    return sortedBatches;
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

      setBatchedEnquiries(updateBatches(batchedEnquiries))

    } catch (error) {
      console.error("Error handling Excel download:", error);
      toast({
        title: "Error",
        description: "Failed to download Excel file. Please try again later.",
      });
    }
  };

  const fetchEnquiries = async () => {
    try {
      const concessionHistoryRef = doc(db, "ConcessionHistory", "History");
      const docSnap = await getDoc(concessionHistoryRef);
      const downloadHistory = await fetchDownloadHistory();
      const passBookDetails = await fetchPassBookDetails();

      if (!docSnap.exists() || !docSnap.data().history) {
        setFilteredBatches([]);
        return;
      }

      if (!passBookDetails) {
        toast({
          title: "Error",
          description: "Failed to fetch passbook ranges.",
        });
        return;
      }

      const keyRangeMap = parseKeyRanges(passBookDetails);

      const sortedData = docSnap
        .data()
        .history.sort((a: any, b: any) => a.passNum.localeCompare(b.passNum))
        .reverse();

      const batches = makeBatches(sortedData, downloadHistory, keyRangeMap);
      setBatchedEnquiries(batches)
      setFilteredBatches(batches);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
      });
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    let allBatches = batchedEnquiries;

    const filtered = allBatches.filter((batch) =>
      batch.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBatches(filtered);
  }, [
    searchTerm,
    batchedEnquiries
  ]);

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "dark" : ""}`}>
      <div
        style={{
          color: "red",
          fontWeight: "bold",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        Download Excel Files ONLY when All passes are collected. If there are
        few passes which are not Collected then Cancel those passes from Update
        Pass.
      </div>
      <div className="flex items-center justify-between mb-4 p-5">
  <div className="flex w-full justify-between flex-wrap items-center">
    <h2 className="text-2xl max-sm:text-xl font-semibold mr-4">
      Downloads
    </h2>
    <div className="flex space-x-4 relative">
      <div className="relative flex items-center">
        <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-2l4 4"
            />
          </svg>
        </span>
        <Input
          className="pl-10 ring-1 ring-gray-400 focus:ring-gray-400"
          type="text"
          placeholder="Search batch names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
