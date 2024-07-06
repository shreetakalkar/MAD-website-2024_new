import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "../ui/use-toast";
import { CollectionDisplayTable } from "./CollectionDisplayTable";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

interface Data {
  certNo: string;
  firstName: string;
  lastName: string;
  status: "Collected" | "Not Collected";
  branch: string;
  gradYear: string;
}

const CollectedPassTable: React.FC = () => {
  const columns: ColumnDef<Data, any>[] = [
    {
      id: "select",
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected() || row.original.status === "Collected"}
          onCheckedChange={(value) => {
            handleCheckboxChange(row, value);
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          disabled={row.original.status === "Collected"}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "certNo",
      header: "Certificate Number",
    },
    {
      accessorKey: "firstName",
      header: "Name",
    },
    {
      accessorKey: "lastName",
      header: "Surname",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "gradYear",
      header: "Graduation Year",
    },
  ];

  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const fetchedData: Data[] = [];
      try {
        const concessionRequestRef = collection(db, "ConcessionRequest");
        const q = query(
          concessionRequestRef,
          where("status", "in", ["serviced", "downloaded"])
        );

        const querySnapshot = await getDocs(q);

        for (const requestDoc of querySnapshot.docs) {
          const id = requestDoc.id;
          const concessionDetailsRef = doc(db, "ConcessionDetails", id);
          const detailsDoc = await getDoc(concessionDetailsRef);

          if (detailsDoc.exists()) {
            const detailsData = detailsDoc.data();
            const collectedValue = requestDoc.data().passCollected.collected;
            const studentDetails: Data = {
              certNo: requestDoc.data().passNum,
              firstName: detailsData?.firstName || "",
              lastName: detailsData?.lastName || "",
              status: collectedValue === "1" ? "Collected" : "Not Collected",
              branch: detailsData?.branch || "",
              gradYear: detailsData?.gradyear || "",
            };
            fetchedData.push(studentDetails);
          }
        }
        fetchedData.sort((a, b) => a.firstName.localeCompare(b.firstName));

        setData(fetchedData);
      } catch (error) {
        toast({ description: "Error fetching passes", variant: "destructive" });
        console.error("Error fetching passes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateCollectedField = async (certNo: string) => {
    try {
      const concessionRequestRef = collection(db, "ConcessionRequest");
      const q = query(
        concessionRequestRef,
        where("status", "in", ["serviced", "downloaded"]),
        where("passNum", "==", certNo)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        try {
          await updateDoc(docRef, {
            passCollected: {
              collected: "1",
              date: new Date(),
            },
          });
          toast({ description: "Pass marked as collected" });
        } catch (error) {
          console.error("Error updating document: ", error);
          toast({
            description: "Error updating pass status",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error updating status", error);
      toast({
        description: "Error updating pass status",
        variant: "destructive",
      });
    }
  };

  const handleCheckboxChange = async (row: any, value: boolean) => {
    const certNoToUpdate = data.find(
      (item) => item.certNo === row.original.certNo
    )?.certNo;

    const updatedData = data.map((item) =>
      item.certNo === row.original.certNo
        ? { ...item, status: value ? "Collected" : "Not Collected" }
        : item
    );

    setData(updatedData);
    await updateCollectedField(certNoToUpdate);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[75%] h-[90%] flex flex-col">
      <div className="flex items-center justify-center h-full">
        <div className="m-2 w-full h-full">
          <CollectionDisplayTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default CollectedPassTable;
