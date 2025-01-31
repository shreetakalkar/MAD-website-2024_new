"use client";

import { db } from "@/config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PendingCard from "@/components/Cards/pendingCard";
import { Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const PendingRequests = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  interface Data {
    id: string;
    address: string;
    ageMonths: number;
    ageYears: number;
    branch: string;
    class: string;
    dob: string;
    duration: string;
    firstName: string;
    from: string;
    gender: string;
    gradyear: string;
    lastName: string;
    lastPassIssued: string;
    middleName: string;
    phoneNum: number;
    status: string;
    statusMessage: string;
    to: string;
    travelLane: string;
    idCardURL: string;
    idCardURL2: string;
    previousPassURL: string;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const concessionDetailsRef = collection(db, "ConcessionDetails");
        const querySnapshot = await getDocs(concessionDetailsRef);
        // console.log(querySnapshot);

        const userList = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              address: data.address || "N/A",
              ageMonths: data.ageMonths || 0,
              ageYears: data.ageYears || 0,
              branch: data.branch || "N/A",
              class: data.class || "N/A",
              dob:
                data.dob && data.dob.seconds
                  ? new Date(data.dob.seconds * 1000).toLocaleDateString()
                  : "N/A",
              duration: data.duration || "N/A",
              firstName: data.firstName || "N/A",
              from: data.from || "N/A",
              gender: data.gender || "N/A",
              gradyear: data.gradyear || "N/A",
              lastName: data.lastName || "N/A",
              lastPassIssued:
                data.lastPassIssued && data.lastPassIssued.seconds
                  ? new Date(
                      data.lastPassIssued.seconds * 1000
                    ).toLocaleDateString()
                  : "No pass",
              middleName: data.middleName || "N/A",
              phoneNum: data.phoneNum || 0,
              status: data.status || "N/A",
              statusMessage: data.statusMessage || "N/A",
              to: data.to || "N/A",
              travelLane: data.travelLane || "N/A",
              idCardURL: data.idCardURL || "",
              idCardURL2: data.idCardURL2 || "",
              previousPassURL: data.previousPassURL || "",
            };
          })
          .filter((item) => item.status === "unserviced");

        userList.forEach((item) => {
          // console.log(item.id);
        });

        //Fetching to sort acc to time of application
        const userWithTimes = await Promise.all(
          userList.map(async (item) => {
            try {
              const docRef = doc(db, "ConcessionRequest", item.id);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                const time = docSnap.data().time;
                return {
                  ...item,
                  time: time ? new Date(time.seconds * 1000) : new Date(0),
                };
              } else {
                // console.log(`No data found for user ${item.id}`);
                return { ...item, time: new Date(0) };
              }
            } catch (error) {
              console.error(`Error fetching data for user ${item.id}:`, error);
              return { ...item, time: new Date(0) };
            }
          })
        );

        //sorting
        const sortedUserList = userWithTimes.sort((a, b) => {
          return a.time.getTime() - b.time.getTime();
        });

        setData(sortedUserList);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to the first page when filtering

    if (value === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.phoneNum.toString().includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const handleCardUpdate = (id: string) => {
    // Update the state to remove the card with the specified id
    setData(data.filter((item) => item.id !== id));
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-2">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : data.length > 0 ? (
        <div className="flex flex-col space-y-2">

          {/* Pagination Buttons */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
            >
              Previous
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200">
                {`Page ${currentPage} of ${totalPages}`}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                {Array.from({ length: totalPages }, (_, index) => (
                  <DropdownMenuItem
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "font-bold" : ""}
                  >
                    {`Page ${index + 1}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* No of passes pending */}
          <div className="w-[100%] text-right">
            <h2 className="float-right p-5 rounded-md text-[#3a3737b1]">
              Passes remaining: {data.length}
            </h2>
          </div>

          {/* Pending Cards */}
          {paginatedData.map((item, index) => (
            <PendingCard
              key={index}
              id={item.id}
              firstName={item.firstName}
              middleName={item.middleName}
              lastName={item.lastName}
              gender={item.gender}
              from={item.from}
              to={item.to}
              travelLane={item.travelLane}
              travelClass={item.class}
              duration={item.duration}
              lastPassIssued={item.lastPassIssued}
              branch={item.branch}
              gradyear={item.gradyear}
              address={item.address}
              dob={item.dob}
              ageYears={item.ageYears}
              ageMonths={item.ageMonths}
              phoneNum={item.phoneNum}
              statusMessage={item.statusMessage}
              onCardUpdate={handleCardUpdate}
              idCardURL={item.idCardURL}
              idCardURL2={item.idCardURL2}
              previousPassURL={item.previousPassURL}
            />
          ))}

          {/* Pagination Buttons */}
          <div className="flex justify-center space-x-2 mt-4 pt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
            >
              Previous
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200">
                {`Page ${currentPage} of ${totalPages}`}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                {Array.from({ length: totalPages }, (_, index) => (
                  <DropdownMenuItem
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "font-bold" : ""}
                  >
                    {`Page ${index + 1}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
      ) : (
        <p className="text-center">No pending requests</p>
      )}
    </div>
  );
};

export default PendingRequests;
