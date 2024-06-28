"use client";

import Link from "next/link";
import {
  Bell,
  Package2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "./Header";
import LeftSideLinks from "./LeftSideLinks";
import { ModeToggle } from "@/components/modeToggle";
import Image from "next/image";
import { UserContext } from "../layout";
import DevsDark from "../../public/images/devs-dark.png";
import DevsLight from "../../public/images/devs-light.png";
import React from "react";
import { useTheme } from "next-themes";
import { Payment, columns } from "../../components/columnDef";
import { DataTable } from "../../components/dataTable";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import UpdatePassDetails from "@/pages/UpdatePassDetails";
import RailwayEntryInterface from "@/components/RailwayEntryInterface";

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.

//   return [
//     {
//       certificateNumber: "CSDSDF3e423",
//       name: "Jash",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Pending",
//     },
//     {
//       certificateNumber: "CSDSasd423",
//       name: "NIEANDER",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address:
//         "ABCD Bld, Flat 007, Goregaon EastABCD Bld, Flat 007, Goregaon EastABCD Bld, Flat 007, Goregaon East",
//       status: "Confirmed",
//     },
//     {
//       certificateNumber: "CSDasere3F3e423",
//       name: "Jash",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Confirmed",
//     },
//     {
//       certificateNumber: "23432jnasdn",
//       name: "Jash",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Confirmed",
//     },
//     {
//       certificateNumber: "1234asda",
//       name: "Jash",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Pending",
//     },
//     {
//       certificateNumber: "12eads23d",
//       name: "Jash",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Pending",
//     },
//     {
//       certificateNumber: "12eads23d",
//       name: "Jash",
//       gender: "M",
//       dob: "22/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Rejected",
//     },
//     {
//       certificateNumber: "12eads23d",
//       name: "Jash",
//       gender: "M",
//       dob: "29/07/2005",
//       from: "Goregaon",
//       to: "Bandra",
//       class: 1,
//       mode: "Quarterly",
//       dateOfIssue: "25/06/2024",
//       address: "ABCD Bld, Flat 007, Goregaon East",
//       status: "Rejected",
//     },
//   ];
// }

export default function Home() {
  // const { loggedIn, setLoggedIn, user, setUser } = React.useContext(UserContext);

  const { theme } = useTheme();

  // const [data, setData] = useState<Payment[]>([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async ({ uid }: { uid: string }) => {
      const facultyRef = doc(db, "Faculty", uid);
      const docSnap = await getDoc(facultyRef);
      console.log(docSnap.data());
      setUserType(docSnap.data()?.type);
    };

    fetchUserType({ uid: "MWJbMeMRwHjYcMxQeL2w" }); //railway
  }, []);
  console.log(userType);

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await getData();
  //     setData(result);
  //   }
  //   fetchData();
  // }, []);



  return (
    <>
      <div className={`grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ${theme} `}>

        {/* Left Side Block */}
        <div className={`hidden border-r  md:block `}>
          <div className="flex h-full max-h-screen flex-col gap-2">

            {/* Mode Toggle */}
            <div className="h-[10%] flex justify-between ">
              <div className="mt-2 ml-5">
                <Image src={theme == "dark" ? DevsDark : DevsLight} alt="logo" width={75} height={75} />
              </div>
              <div className="mt-5 mr-2">
                <ModeToggle />
              </div>
            </div>

            {/* Links */}
            <div className="flex-1 mt-5">
              <LeftSideLinks userType={userType ? userType : ""} />
            </div>

            {/* Logout Button */}
            <div className="p-8">
              <div>{session?.data?.user?.email}</div>
              <button onClick={() => signOut()}>
                Logout
              </button>
            </div>

          </div>
        </div>

        {/* Right Side Block */}
        <div className="flex flex-col">
          <Header userType={userType ? userType : ""} />

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
            </div>
            <div
              className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
              x-chunk="dashboard-02-chunk-1"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no products
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can start selling as soon as you add a product.
                </p>
                <Button className="mt-4">Add Product</Button>
              </div>
            </div>
          </main>


          {/* <div className="w-[100%] h-[100%] flex flex-col">
        <div className="h-[90%] flex items-center justify-center">

          <RailwayEntryInterface /> 
          <div className="w-[70%] overflow-x-auto">
            <DataTable data={data} columns={columns} />
          </div>
          <UpdatePassDetails />
          <div className="w-[70%] overflow-x-auto">
            <DataTable data={data} columns={columns} />
          </div>
           <Login
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            setUser={setUser}
          />
        </div>
      </div> */}
        </div>
      </div>
    </>
  );
}

Home.requireAuth = true;