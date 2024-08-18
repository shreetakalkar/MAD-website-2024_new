"use client";
import CollectedPassTable from "@/components/Pass Collection/CollectedPass";
import TableDemo from "../launchDashboard/page";
import LaunchForm from "../launchForm/page";
import NoticeHistory from "@/components/Notices/NoticeHistory";
import ImportantNotices from "@/components/Notices/NoticePage";

const pendingRequests = () => {
  return (
    <div className="h-[100vh]">
      <ImportantNotices />
      {/* <NoticeHistory /> */}
      {/* <LaunchForm /> */}
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
