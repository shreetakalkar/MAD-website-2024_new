"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Approved_Rejected = () => {
  interface Data {
    certificateNumber: string;
    name: string;
    gender: string;
    dob: string;
    from: string;
    to: string;
    class: string;
    mode: string;
    dateOfIssue: string;
    address: string;
    status: string;
  }

  const columns: ColumnDef<Data, any>[] = [
    {
      accessorKey: "certificateNumber",
      header: "Certificate Number",
      cell: ({ row }) => {
        let cellData = row.getValue("certificateNumber") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        let cellData = row.getValue("name") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "gender",
      cell: ({ row }) => {
        let cellData = row.getValue("class") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ row }) => {
        let cellData = row.getValue("dob") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "from",
      header: "From",
      cell: ({ row }) => {
        let cellData = row.getValue("from") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "to",
      header: "To",
      cell: ({ row }) => {
        let cellData = row.getValue("to") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "class",
      header: "Class",
      cell: ({ row }) => {
        let cellData = row.getValue("class") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: ({ row }) => {
        let cellData = row.getValue("mode") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "dateOfIssue",
      header: "Date of Issue",
      cell: ({ row }) => {
        let cellData = row.getValue("dateOfIssue") as string;
        return (
          <div className="flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: () => <div className="w-[200px]">Address</div>,
      cell: ({ row }) => {
        let cellData = row.getValue("address") as string;
        return (
          <div className="w-[200px] flex h-[6vh] text-center items-center justify-center ">
            {cellData}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const concessionHistoryRef = collection(db, "ConcessionHistory");
        const querySnapshot = await getDocs(concessionHistoryRef);

        const userList = querySnapshot.docs.flatMap((doc) =>
          doc.data().history.map((item: any) => ({
            certificateNumber: item.passNum || "N/A",
            name: item.firstName || "N/A",
            gender: item.gender || "N/A",
            dob: item.dob?.seconds
              ? new Date(item.dob.seconds * 1000).toLocaleDateString()
              : "N/A",
            from: item.from || "N/A",
            to: item.to || "N/A",
            class: item.class || "N/A",
            mode: item.duration || "N/A",
            dateOfIssue: item.lastPassIssued?.seconds
              ? new Date(
                  item.lastPassIssued.seconds * 1000
                ).toLocaleDateString()
              : "N/A",
            address: item.address || "N/A",
            status: item.status || "N/A",
          }))
        );

        setData(userList);
      } catch (err) {
        console.error("Error fetching data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-[85vw] h-[100vh] flex flex-col">
        <div className="h-[100%] flex items-center justify-center">
          <div className="overflow-auto m-2 w-[100%] h-[100%]">
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approved_Rejected;
