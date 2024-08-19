"use client";
import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import Image from "next/image";
import DataTable from "@/components/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Notice } from "./NoticePage"; // Adjust the import path as needed
import useGradYear from "@/constants/gradYearList";
import "@react-pdf-viewer/core/lib/styles/index.css";
import view from "@/public/view.png";
import { File } from "lucide-react";

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
          className="absolute top-2 right-2 z-[100] bg-red-500 text-white p-2 rounded-full"
        >
          Close
        </button>
        <div className="h-full w-full p-8 relative flex items-center justify-center">
          {isPDF ? (
            <div className="h-full w-[90%] overflow-hidden">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={contentUrl} />
              </Worker>
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

const checkIfPDF = (url: string) => {
  return url.split("?")[0].endsWith(".pdf");
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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
      const date = new Date(row.original.startDate.seconds * 1000);
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
      const date = new Date(row.original.endDate.seconds * 1000);
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
        {useGradYear().find((grad) => grad.gradYear === row.original.gradYear)
          ?.year || ""}
      </div>
    ),
  },
  {
    accessorKey: "docURL",
    header: () => <div className="text-[0.95rem] text-center">View</div>,
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [contentUrl, setContentUrl] = useState(row.original.docURL);
      const [isPDF, setIsPDF] = useState(checkIfPDF(contentUrl));

      const handleOpenModal = () => setIsModalOpen(true);
      const handleCloseModal = () => setIsModalOpen(false);

      return (
        <>
          <div
            className="flex justify-center cursor-pointer"
            onClick={handleOpenModal}
          >
            <File className="w-10 opacity-80" />
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            contentUrl={contentUrl}
            isPDF={isPDF}
          />
        </>
      );
    },
  },
];

const NoticeHistory: React.FC<{ notices: Notice[] }> = ({ notices }) => {
  return (
    <div className="p-10">
      <DataTable columns={columns} data={notices} showFilters={false} />
    </div>
  );
};

export default NoticeHistory;
