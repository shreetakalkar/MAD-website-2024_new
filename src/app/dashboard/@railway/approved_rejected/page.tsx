"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { db } from "@/config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dateFormat} from "@/constants/dateFormat"
import { ClipLoader } from "react-spinners";

const parseDate = (dateStr: any) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

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
      header: "Gender",
      cell: ({ row }) => {
        let cellData = row.getValue("gender") as string;
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           Date of Issue
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "address",
      header: () => <div className="w-[200px] text-center">Address</div>,
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

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const concessionHistoryRef = collection(db, "ConcessionHistory");

  //       const querySnapshot = await getDocs(concessionHistoryRef);
      
  //       const userMap = new Map<string, {
  //         certificateNumber: string;
  //         name: string;
  //         gender: string;
  //         dob: string;
  //         from: string;
  //         to: string;
  //         class: string;
  //         mode: string;
  //         dateOfIssue: string;
  //         address: string;
  //         status: string;
  //         index: number;
  //       }>();
      
  //       querySnapshot.docs.forEach((doc) => {
  //         const history = doc.data().history;
      
  //         history.forEach((item: any, index: number) => {
  //           if (item.status === "serviced" || item.status === "cancelled") {
  //             const existingItem = userMap.get(item.passNum);
      
  //             if (!existingItem || existingItem.index < index) {
  //               userMap.set(item.passNum, {
  //                 certificateNumber: item.passNum || "N/A",
  //                 name: item.firstName || "N/A",
  //                 gender: item.gender || "N/A",
  //                 dob: item.dob?.seconds
  //                   ? dateFormat(item.dob.seconds)
  //                   : "N/A",
  //                 from: item.from || "N/A",
  //                 to: item.to || "N/A",
  //                 class: item.class || "N/A",
  //                 mode: item.duration || "N/A",
  //                 dateOfIssue: item.lastPassIssued?.seconds
  //                   ? dateFormat(item.lastPassIssued.seconds)
  //                   : "N/A",
  //                 address: item.address || "N/A",
  //                 status: item.status || "N/A",
  //                 index: index
  //               });
  //             }
  //           }
  //         });
  //       });

  //       const parseDate = (dateStr: string): Date => {
  //         const [day, month, year] = dateStr.split("/auth").map(Number);
  //         return new Date(year, month - 1, day);
  //       };

  //       const sortedUserArray = Array.from(userMap.values()).sort((a, b) => {
  //         const dateA =
  //           a.dateOfIssue !== "N/A" ? parseDate(a.dateOfIssue).getTime() : 0;
  //         const dateB =
  //           b.dateOfIssue !== "N/A" ? parseDate(b.dateOfIssue).getTime() : 0;
  //         return dateA - dateB; 
  //       });

  //       const userList = sortedUserArray.map(({ index, ...rest }) => rest);
      
      
  //       setData(userList);
  //     } catch (err) {
  //       console.error("Error fetching data: ", err);
  //     } finally {
  //       setLoading(false);
  //     }
          
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const concessionHistoryDoc = doc(db, 'ConcessionHistory', 'History');
        const docSnapshot = await getDoc(concessionHistoryDoc);
        
        if (docSnapshot.exists()) {
          const history = docSnapshot.data().history || [];

          const userMap = new Map();
          
          history.forEach((item: any, index: number) => {
            if (item.status === 'serviced' || item.status === 'cancelled') {
              const existingItem = userMap.get(item.passNum);
              
              if (!existingItem || existingItem.index < index) {
                userMap.set(item.passNum, {
                  certificateNumber: item.passNum || 'N/A',
                  name: item.firstName || 'N/A',
                  gender: item.gender || 'N/A',
                  dob: item.dob?.seconds ? dateFormat(item.dob.seconds) : 'N/A',
                  from: item.from || 'N/A',
                  to: item.to || 'N/A',
                  class: item.class || 'N/A',
                  mode: item.duration || 'N/A',
                  dateOfIssue: item.lastPassIssued?.seconds ? dateFormat(item.lastPassIssued.seconds) : 'N/A',
                  address: item.address || 'N/A',
                  status: item.status || 'N/A',
                  index: index
                });
              }
            }
          });

          const sortedUserArray = Array.from(userMap.values()).sort((a, b) => {
            const dateA = a.dateOfIssue !== 'N/A' ? parseDate(a.dateOfIssue).getTime() : 0;
            const dateB = b.dateOfIssue !== 'N/A' ? parseDate(b.dateOfIssue).getTime() : 0;
            return dateA - dateB;
          });

          const userList = sortedUserArray.map(({ index, ...rest }) => rest);
          setData(userList);
        } else {
          console.error('Document does not exist');
        }
      } catch (err) {
        console.error('Error fetching data: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  if (loading) {
    return         <div className="flex items-center justify-center h-screen">
                      <ClipLoader size={50} color={"#123abc"} loading={loading} />
                  </div>
  }
//test123
  return (
    <div>
      <div className="w-[99vw] h-[99vh] flex flex-col">
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