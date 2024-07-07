"use client";
import RailwayUpdateConc from "@/pages/RailwayUpdateConc";
import PendingRequests from "@/pages/PendingRequests";
import CollectedPassTable from "@/components/Pass Collection/CollectedPass";
import RailwayEntryInterface from "@/pages/RailwayEntryInterface";
const pendingRequests = () => {
  return (
    <div className="h-[100vh]">
      {/* <CollectedPassTable /> */}
      {/* <RailwayUpdateConc /> */}
      <RailwayEntryInterface />
      {/* <PendingRequests /> */}
      <RailwayUpdateCard/>
    </div>
  );
};

export default pendingRequests;
