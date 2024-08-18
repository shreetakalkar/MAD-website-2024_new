"use client";
import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Notice } from "../Notices/NoticePage"; // Adjust the import path as needed
import useGradYear from "@/constants/gradYearList";
import "@react-pdf-viewer/core/lib/styles/index.css";
import pdfIcon from "@/public/pdf-icon.png";

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
      <div className="relative bg-white p-4 rounded-md w-[80%] h-[80%]">
        <button
          onClick={() => {
            console.log("Close button clicked");
            onClose();
          }}
          className="absolute top-2 right-2 z-[100] bg-red-500 text-white p-2 rounded-full"
        >
          Close
        </button>
        <div className="h-full w-full flex items-center justify-center">
          {isPDF ? (
            <div className="h-full w-[90%] overflow-hidden ">
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

// NoticeCard Component
const NoticeCard: React.FC<{ notice: Notice }> = ({ notice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [isPDF, setIsPDF] = useState(false);
  const gradYearList = useGradYear();

  // Utility function to check if the URL is a PDF
  const checkIfPDF = (url: string) => {
    return url.split("?")[0].endsWith(".pdf");
  };

  const handleOpenModal = (url: string) => {
    setIsPDF(checkIfPDF(url));
    setContentUrl(url);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        key={notice.title}
        className="bg-blue-300 p-5 rounded-md w-[32%] h-[50%]"
      >
        <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
          <h1 className="text-[2.4rem] font-medium h-[20%] mb-2">
            {notice.title}
          </h1>
          <div className="w-[100%] h-[80%] flex gap-2 items-center justify-center">
            <div
              className="w-[40%] h-[100%]  flex items-center justify-center cursor-pointer"
              onClick={() => handleOpenModal(notice.docURL)}
            >
              {checkIfPDF(notice.docURL) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={notice.docURL}
                    alt="Preview"
                    width={200}
                    height={50}
                    priority
                  />
                </div>
              ) : (
                <Image
                  src={notice.docURL}
                  alt="Preview"
                  width={220}
                  height={50}
                  priority
                />
              )}
            </div>
            <div className="w-[60%] h-[100%] pr-2 pb-2 grid grid-cols-2 gap-2 items-center justify-center">
              {["batch", "div", "branch", "gradYear"].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  {field === "gradYear" ? (
                    <>
                      <Label className="text-[1rem]">Year</Label>
                      <Input
                        disabled
                        className="disabled:opacity-100 disabled:cursor-default"
                        value={
                          gradYearList.find(
                            (grad) => grad.gradYear === notice.gradYear
                          )?.year || ""
                        }
                      />
                    </>
                  ) : (
                    <>
                      <Label className="text-[1rem]">
                        {capitalizeFirstLetter(field)}
                      </Label>
                      <Input
                        value={notice[field]}
                        disabled
                        className="disabled:opacity-100 disabled:cursor-default"
                      />
                    </>
                  )}
                </div>
              ))}
              {["startDate", "endDate"].map((dateField) => {
                const timestampInSeconds = notice[dateField].seconds;
                const date = new Date(timestampInSeconds * 1000);
                const formattedDate = date.toISOString().split("T")[0];
                return (
                  <div key={dateField} className="flex flex-col gap-1">
                    <Label className="text-[1rem]">
                      {capitalizeFirstLetter(
                        dateField.replace(/([A-Z])/g, " $1")
                      )}
                    </Label>
                    <Input
                      type="date"
                      defaultValue={formattedDate}
                      placeholder={capitalizeFirstLetter(dateField)}
                      disabled
                      className="disabled:opacity-100 disabled:cursor-default"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>{" "}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contentUrl={contentUrl}
        isPDF={isPDF}
      />
    </>
  );
};

interface NoticeHistoryProps {
  notices: Notice[];
}

// NoticeHistory Component
const NoticeHistory: React.FC<NoticeHistoryProps> = ({ notices }) => {
  return (
    <div className="w-[100%] min-h-[100vh] flex justify-center">
      <div
        style={{
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="w-[100%] max-h-[90vh] flex justify-center flex-wrap gap-3"
      >
        {notices.map((notice, index) => (
          <NoticeCard key={index} notice={notice} />
        ))}
      </div>
    </div>
  );
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default NoticeHistory;
