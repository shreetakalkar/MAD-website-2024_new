import React, { useEffect, useState } from 'react';
import DataTable from '@/app/dashboard/allrequests/page';
import { ColumnDef } from "@tanstack/react-table";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

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
    { accessorKey: "certificateNumber", header: "Certificate Number" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "dob", header: "Date of Birth" },
    { accessorKey: "from", header: "From" },
    { accessorKey: "to", header: "To" },
    { accessorKey: "class", header: "Class" },
    { accessorKey: "mode", header: "Mode" },
    { accessorKey: "dateOfIssue", header: "Date of Issue" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "status", header: "Status" },
  ];

  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const concessionHistoryRef = collection(db, "ConcessionHistory");
        const querySnapshot = await getDocs(concessionHistoryRef);
        
        const userList = querySnapshot.docs.flatMap((doc) => doc.data().history.map((item: any) => ({
          certificateNumber: item.passNum || "N/A",
          name: item.firstName || "N/A",
          gender: item.gender || "N/A",
          dob: item.dob.seconds ? new Date(item.dob.seconds * 1000).toLocaleDateString() : "N/A",
          from: item.from || "N/A",
          to: item.to || "N/A",
          class: item.class || "N/A",
          mode: item.duration || "N/A",
          dateOfIssue: item.lastPassIssued.seconds ? new Date(item.lastPassIssued.seconds * 1000).toLocaleDateString() : "N/A",
          address: item.address || "N/A",
          status: item.status || "N/A",
        })));
        setData(userList);
        setLoading(false);
      } catch (err) {
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
      <div className="w-[1200px] flex flex-col">
        <div className="h-[90%] flex items-center justify-center">
          <div className="overflow-auto">
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approved_Rejected;