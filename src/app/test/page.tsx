"use client";
import RailwayEntryInterface from "@/components/RailwayEntryInterface";
import RailwayUpdateConc from "@/pages/RailwayUpdateConc";
import PendingRequests from "@/pages/PendingRequests";
import CollectedPassTable from "@/components/Pass Collection/CollectedPass";
const pendingRequests = () => {
  return (
    <div className="h-[100vh]">
      <CollectedPassTable />
      {/* <RailwayUpdateConc /> */}
      {/* <RailwayEntryInterface /> */}
      {/* <PendingRequests /> */}
    </div>
  );
};

export default pendingRequests;
