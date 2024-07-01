"use client";
import { ComboboxPopover } from "@/components/FilterEmails";
import RailwayEntryInterface from "@/components/RailwayEntryInterface";
import RailwayUpdateConc from "@/pages/RailwayUpdateConc";
import PendingRequests from "@/pages/PendingRequests";

const pendingRequests = () => {
  return (
    <div>
      <PendingRequests />
    </div>
  );
};

export default pendingRequests;
