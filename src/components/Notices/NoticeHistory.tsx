"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import DataTable from "@/components/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Notice } from "./NoticePage"; // Adjust the import path as needed
import useGradYear from "@/constants/gradYearList";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { File } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contentUrl: string;
  isPDF: boolean;
}> = ({ isOpen, onClose, contentUrl, isPDF }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white dark:bg-muted p-4 rounded-md w-[60%] h-[80%]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-100 bg-red-500 text-white p-2 rounded-full"
        >
          Close
        </button>
        <div className="h-full w-full p-8 relative flex items-center justify-center">
          {isPDF ? (
            <div className="h-full w-[90%] overflow-hidden">
              <Document file={contentUrl}>
                <Page pageNumber={1} width={600} />
              </Document>
            </div>
          ) : (
            <Image
              src={contentUrl}
              alt="Notice Image"
              layout="fill"
              objectFit="contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const checkIfPDF = (url: string) => url.split("?")[0].endsWith(".pdf");

const NoticeHistory: React.FC<{ notices: Notice[] }> = ({ notices }) => {
  const gradYearList = useGradYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [isPDF, setIsPDF] = useState(false);

  const handleOpenModal = (url: string) => {
    setContentUrl(url);
    setIsPDF(checkIfPDF(url));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const columns: ColumnDef<Notice, any>[] = [
    {
      accessorKey: "title",
      header: () => <div className="text-[0.95rem] text-center">Title</div>,
      cell: ({ row }) => (
        <div className="text-[0.92rem] text-center">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "batch",
      header: () => <div className="text-[0.95rem] text-center">Batch</div>,
      cell: ({ row }) => (
        <div className="text-[0.92rem] text-center">{row.original.batch}</div>
      ),
    },
    {
      accessorKey: "div",
      header: () => <div className="text-[0.95rem] text-center">Division</div>,
      cell: ({ row }) => (
        <div className="text-[0.92rem] text-center">{row.original.div}</div>
      ),
    },
    {
      accessorKey: "branch",
      header: () => <div className="text-[0.95rem] text-center">Branch</div>,
      cell: ({ row }) => (
        <div className="text-[0.92rem] text-center">{row.original.branch}</div>
      ),
    },
    {
      accessorKey: "startDate",
      header: () => <div className="text-[0.95rem] text-center">Start Date</div>,
      cell: ({ row }) => {
        const date = new Date(row.original.startDate);
        return (
          <div className="text-[0.92rem] text-center">
            {date.toISOString().split("T")[0]}
          </div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-[0.95rem] text-center">End Date</div>,
      cell: ({ row }) => {
        const date = new Date(row.original.endDate);
        return (
          <div className="text-[0.92rem] text-center">
            {date.toISOString().split("T")[0]}
          </div>
        );
      },
    },
    {
      accessorKey: "gradYear",
      header: () => <div className="text-[0.95rem] text-center">Year</div>,
      cell: ({ row }) => (
        <div className="text-[0.92rem] text-center">
          {gradYearList.find((grad) => grad.gradYear === row.original.gradYear)
            ?.year || ""}
        </div>
      ),
    },
    {
      accessorKey: "docURL",
      header: () => <div className="text-[0.95rem] text-center">View</div>,
      cell: ({ row }) => (
        <div
          className="flex justify-center cursor-pointer"
          onClick={() => handleOpenModal(row.original.docURL)}
        >
          <File className="w-10 opacity-80" />
        </div>
      ),
    },
  ];

  return (
    <div className="p-10">
      <DataTable columns={columns} data={notices} showFilters={false} />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contentUrl={contentUrl}
        isPDF={isPDF}
      />
    </div>
  );
};

export default NoticeHistory;
