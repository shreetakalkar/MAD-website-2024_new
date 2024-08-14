"use client";
import CollectedPassTable from "@/components/Pass Collection/CollectedPass";
import TableDemo from "../launchDashboard/page";
import LaunchForm from "../launchForm/page";

const pendingRequests = () => {
  return (
    <div className="h-[100vh]">
      <LaunchForm />
      {/* <TableDemo /> */}
      {/* <CollectedPassTable /> */}
      {/* <RailwayUpdateConc /> */}
      {/* <RailwayEntryInterface /> */}
      {/* <PendingRequests /> */}
      {/* <RailwayUpdateCard/> */}
    </div>
  );
};

export default pendingRequests;
