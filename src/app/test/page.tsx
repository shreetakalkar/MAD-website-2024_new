"use client";
import RailwayEntryInterface from "@/components/RailwayEntryInterface";
import RailwayUpdateConc from "@/pages/RailwayUpdateConc";
import PendingRequests from "@/pages/PendingRequests";
<<<<<<< Updated upstream
import CollectedPassTable from "@/components/Pass Collection/CollectedPass";
const pendingRequests = () => {
  return (
    <div className="h-[100vh]">
      <CollectedPassTable />
      {/* <RailwayUpdateConc /> */}
=======
import RailwayUpdateCard from "@/pages/RailwayUpdateConc";

const pendingRequests = () => {
  return (
    <div>
>>>>>>> Stashed changes
      {/* <RailwayEntryInterface /> */}
      {/* <PendingRequests /> */}
      <RailwayUpdateCard/>
    </div>
  );
};

export default pendingRequests;
