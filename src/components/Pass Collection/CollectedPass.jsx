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
  setDoc,
} from "firebase/firestore";
import { toast } from "../ui/use-toast";
import { CollectionDisplayTable } from "./CollectionDisplayTable";
import { Loader } from "lucide-react";

const CollectedPassTable = () => {
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const currentUserYear = (gradyear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const gradYear = parseInt(gradyear);

    if (
      (currentMonth >= 6 && gradYear === currentYear + 4) ||
      (currentMonth <= 5 && gradYear === currentYear + 3)
    ) {
      return "FE";
    } else if (
      (currentMonth >= 6 && gradYear === currentYear + 3) ||
      (currentMonth <= 5 && gradYear === currentYear + 2)
    ) {
      return "SE";
    } else if (
      (currentMonth >= 6 && gradYear === currentYear + 2) ||
      (currentMonth <= 5 && gradYear === currentYear + 1)
    ) {
      return "TE";
    } else if (
      (currentMonth >= 6 && gradYear === currentYear + 1) ||
      (currentMonth <= 5 && gradYear === currentYear)
    ) {
      return "BE";
    }
  };

  const columns = [
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
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phoneNum",
      header: "Phone No",
    },
    {
      accessorKey: "gradYear",
      header: "Year",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "lastPassIssued",
      header: "Issued Date",
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "collectedDate",
      header: "Collected Date",
    },
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const concessionRequestRef = collection(db, "ConcessionRequest");
        const q = query(
          concessionRequestRef,
          where("status", "in", ["serviced", "downloaded"])
        );

        const querySnapshot = await getDocs(q);
        const fetchedData = await Promise.all(
          querySnapshot.docs.map(async (requestDoc) => {
            const id = requestDoc.id;
            const concessionDetailsRef = doc(db, "ConcessionDetails", id);
            const detailsDoc = await getDoc(concessionDetailsRef);

            if (detailsDoc.exists()) {
              const detailsData = detailsDoc.data();
              const collectedValue = requestDoc.data().passCollected?.collected;
              return {
                certNo: requestDoc.data().passNum,
                name: `${detailsData?.lastName} ${detailsData?.firstName} ${detailsData?.middleName}`.toUpperCase(),
                status: collectedValue === "1" ? "Collected" : "Not Collected",
                branch: (detailsData?.branch || "").toUpperCase(),
                gradYear: currentUserYear(detailsData?.gradyear) || "",
                lastPassIssued: detailsData.lastPassIssued?.toDate(),
                phoneNum: detailsData.phoneNum || "",
                collectedDate:
                  collectedValue === "1"
                    ? formatDate(requestDoc.data().passCollected.date.toDate())
                    : "-",
              };
            }
            return null;
          })
        );

        setData(
          fetchedData
            .filter((studentDetails) => studentDetails !== null)
            .sort(
              (a, b) => b.lastPassIssued.getTime() - a.lastPassIssued.getTime()
            )
        );
      } catch (error) {
        toast({ description: "Error fetching passes", variant: "destructive" });
        console.error("Error fetching passes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateCollectedField = async (certNo) => {
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

          const concessionHistoryRef = doc(
            db,
            "ConcessionHistory",
            "DailyStats"
          );
          const concessionHistorySnap = await getDoc(concessionHistoryRef);
          const currentDate = new Date().toLocaleDateString();

          if (concessionHistorySnap.exists()) {
            const historyData = concessionHistorySnap.data();
            let statsArray = historyData.stats || [];
            const dateIndex = statsArray.findIndex(
              (entry) => entry.date === currentDate
            );

            if (dateIndex >= 0) {
              if (typeof statsArray[dateIndex].collectedPass !== "number") {
                statsArray[dateIndex].collectedPass = 0;
              }
              statsArray[dateIndex].collectedPass += 1;
            } else {
              statsArray.push({
                date: currentDate,
                collectedPass: 1,
              });
            }

            await updateDoc(concessionHistoryRef, { stats: statsArray });
          } else {
            await setDoc(concessionHistoryRef, {
              stats: [
                {
                  date: currentDate,
                  collectedPass: 1,
                },
              ],
            });
          }

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

  const handleCheckboxChange = async (row, value) => {
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
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-[99%] h-[90%] flex flex-col">
      <div className="flex items-center justify-center h-full">
        <div className="m-2 w-full h-full">
          <CollectionDisplayTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default CollectedPassTable;
