"use client";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "@/components/modeToggle";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";

const Team = () => {
  const { user } = useUser();
  
  const carouselImageArray = [
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2FCover%20Page%20for%20Devs%20Play%20Store.png?alt=media&token=920eda3f-3b70-4c89-9309-4cc02ad41bb7` , 
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F1.png?alt=media&token=3f4db1d7-394e-497d-a3bd-c1f3a85dbc22`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F2.png?alt=media&token=59f1fe57-50c5-41e7-bb82-ae5bd5a3a20c`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F3.png?alt=media&token=4494cb5b-5d76-4f74-b9a6-1af5d3321d60`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F4.png?alt=media&token=f25e38ae-31dd-4a18-84bd-a1e30baa6dfb`,
  ]

  const webMembers = [
    {
      name: "Juhi Deore",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJuhi.jpg?alt=media&token=33b59920-a019-458e-a925-4cfda021d74a",
      linkedin: "https://linkedin.com/in/juhideore",
    },
    {
      name: "Anish Awasthi",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FAnish.jpeg?alt=media&token=aa0c7f5c-248b-4f32-94f2-f01f8d911326",
      linkedin: "https://linkedin.com/in/anishawasthi",
    },
    {
      name: "Mayuresh Chavan",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FMayuresh.jpg?alt=media&token=27bf9f19-5dd7-4631-8228-ba760ced9016",
      linkedin: "https://linkedin.com/in/mayureshchavan",
    },
    {
      name: "Jash Rashne",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJash.JPG?alt=media&token=9bdc90ec-805b-46af-a9ce-43d0a66b4b66",
      linkedin: "https://linkedin.com/in/jashrashne",
    },
  ];

  const opsMembers = [
    {
      name: "Zoya Hassan",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FZoya.jpeg?alt=media&token=6854ba68-af9b-44c2-903f-61596e690252",
      linkedin: "https://linkedin.com/in/zoyahassan",
    },
    {
      name: "Herambh Vengurlekar",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fheramb.JPG?alt=media&token=e2c743ca-e812-4a43-a4ec-4bef248aa604",
      linkedin: "https://linkedin.com/in/mayureshchavan",
    },
    {
      name: "Suhani Poptani",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FSuhani.jpeg?alt=media&token=eeccf450-3d90-4c01-bdd6-f19c5c6700fc",
      linkedin: "https://linkedin.com/in/jashrashne",
    },
  ];

  const appMembers = [
    {
      name: "Aryan Pathak",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FAryan.jpg?alt=media&token=c58aa850-6ff0-4597-8d50-886cd09ddf70",
      linkedin: "https://linkedin.com/in/aryanpathak",
    },
    {
      name: "Shreya Bhatia",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FShreya.jpg?alt=media&token=d5a5410a-6a13-4d3c-98cd-c757df659b4c",
      linkedin: "https://linkedin.com/in/shreyabhatia",
    },
    {
      name: 'Siddhi Mehta',
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FSiddhi.png?alt=media&token=5552fe08-ca67-4e88-840b-b305eefb6d1c",
      linkedin:'/'
    }
    
  ];

  const designMembers = [
    {
      name: "Kashish Dodeja",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fkashish.JPG?alt=media&token=3e71f52b-b06f-4e65-89ba-d49569fd76d3",
      linkedin: "https://linkedin.com/in/kashishdodeja",
    },
    {
      name: "Malhaar Mirchandani",
      image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FMalhaar.jpg?alt=media&token=15ac7778-63a8-4529-85ff-13cc5916ba29",
      linkedin: "https://linkedin.com/in/malhaarmirchandani",
    },
    
  ];
  
  

  const { theme } = useTheme();

  return (
    <div className="container mx-auto p-4">
      <nav className="sticky top-0 shadow-md z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex  justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Image
              src={theme === "dark" ? DevsDark : DevsLight}
              alt="logo"
              width={50}
              height={50}
              className="rounded-md"
            />
            <Link href="/about" className="text-xl font-semibold text-gray-800 dark:text-white">
              {`Developer's Club of TSEC`}
            </Link>
          </div>
          <div className="flex ml-auto">
          <Button variant={"link"}>
            <Link href="mailto:devsclubtsec@gmail.com" className="flex items-center">
              Contact us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
            {user?.name ? (
              <Button variant={"link"}>
                <Link href="/dashboard" className="flex items-center">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant={"link"}>
                <Link href="/" className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>

      <section className="mb-12 w-full">
        <Carousel
          opts={{ align: "center" }}
          className="w-full"
        >
          <CarouselContent className="relative">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="w-full flex items-center justify-center">
                <div className="w-full h-[calc(100vw*(9/16))] max-h-[2304px] flex items-center justify-center p-4">
                  <Card className="w-full h-full">
                    <CardContent className="flex items-center justify-center h-full p-6">
                      <img 
                        src={carouselImageArray[index]} 
                        alt={`Carousel Image ${index + 1}`} 
                        className="object-contain w-full h-full"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </section>

      <div className="flex justify-around p-6">
        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-90">
          <a href="https://play.google.com/store/apps/details?id=com.madclubtsec.tsec_application" target="blank">
            <h2 className="text-xl font-bold mb-2">TSEC App On PLaystore</h2>
          </a>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FplaystoreQR.jpg?alt=media&token=1cb6b370-f83c-46bd-b36e-1691ff467fec"
            alt="Card 1"
            className="w-full h-auto rounded-md mb-2 w-80"
          />
          <p>Devs App is available on Playstore</p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-90">
          <h2 className="text-xl font-bold mb-2">Devs Club Website</h2>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FApp%20Icon%20with%20Shadow.png?alt=media&token=11d0ab17-d538-4b3d-8480-cedc1d3936d7"
            alt="Card 2"
            className="w-full h-auto rounded-md mb-2 w-80"
          />
          <p>Devs Club Website is used By officials</p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-90">
          <a href="https://apps.apple.com/in/app/tsec-app/id6446188102" target="blank">
            <h2 className="text-xl font-bold mb-2">TSEC App On App Store</h2>
          </a>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FappStoreQR.jpg?alt=media&token=601f1bc3-2fdb-493f-9a42-4beff1087f1c"
            alt="Card 3"
            className="w-full h-auto rounded-md mb-2 w-80"
          />
          <p>Devs App is available on App Store</p>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">Meet Our Team</h1>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">Principal</h2>
        <div className="flex justify-center">
          <div className="text-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fgt_thampi.jpg?alt=media&token=a99a5fdc-3e17-41e9-8043-affe6fa00873"
              alt="Dr. G. T. Thampi"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Dr. G. T. Thampi</p>
            <p className="text-sm">Principal</p>
            <Link
              href="https://linkedin.com/in/johndoe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Professors Incharge
        </h2>
        <div className="flex  justify-center space-x-4 sm:space-x-8">
          <div className="text-center mb-4 sm:mb-0">
            <img
              src="https://via.placeholder.com/150"
              alt="Prof. Darakshan Khan"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Prof. Darakshan Khan</p>
            <p className="text-sm">Professor Incharge</p>
            <Link
              href="https://linkedin.com/in/darakshankhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
          <div className="text-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fsachimam.png?alt=media&token=1f41d84a-0627-4373-b20e-c5424306fcb9"
              alt="Dr. Sachi Natu"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Dr. Sachi Natu</p>
            <p className="text-sm">Professor Incharge</p>
            <Link
              href="https://linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Chairperson
        </h2>
        <div className="flex  justify-center space-x-4 sm:space-x-8">
          <div className="text-center mb-4 sm:mb-0">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Ffahed.png?alt=media&token=45721059-7939-4be2-acdf-a4c15150a30e"
              alt="Fahed Khan"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Fahed Khan</p>
            {/* <p className="text-sm">Chairperson</p> */}
            <Link
              href="https://linkedin.com/in/fahedkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Vice Chairperson
        </h2>
        <div className="flex  justify-center space-x-4 sm:space-x-8">
          <div className="text-center mb-4 sm:mb-0">
            <img
              src="https://via.placeholder.com/150"
              alt="Atharva Khewle"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Atharva Khewle</p>
            {/* <p className="text-sm">Vice Chairperson</p> */}
            <Link
              href="https://linkedin.com/in/charliejohnson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">Web Team</h2>
        <div className="flex justify-center">
          <div className="text-center mb-4">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fritojnan.jpeg?alt=media&token=5c08bd18-b645-4175-992f-2c66f728f9e6"
              alt="Ritojnan Mukherjee"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Ritojnan Mukherjee</p>
            <p className="text-sm">Head</p>
            <Link
              href="https://linkedin.com/in/evanparker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap  justify-center space-x-4 sm:space-x-8 mt-4">
        {webMembers.map((member, index) => (
            <div key={index} className="text-center mb-4 sm:mb-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
              />
              <p className="text-xl font-medium">{member.name}</p>
              <p className="text-sm">Member</p>
              <Link
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                LinkedIn
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">App Team</h2>
        <div className="flex justify-center">
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Zeeshan Sayed"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Zeeshan Sayed</p>
            <p className="text-sm">Head</p>
            <Link
              href="https://linkedin.com/in/fionagreen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="flex  justify-center space-x-4 sm:space-x-8 mt-4">
          {appMembers.map((member, index) => (
            <div key={index} className="text-center mb-4 sm:mb-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
              />
              <p className="text-xl font-medium">{member.name}</p>
              <p className="text-sm">Member</p>
              <Link
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                LinkedIn
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">Design Team</h2>
        <div className="flex  justify-center space-x-4 sm:space-x-8">
        {designMembers.map((member, index) => (
  <div key={index} className="text-center mb-4 sm:mb-0">
    <img
      src={member.image}
      alt={member.name}
      className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
    />
    <p className="text-xl font-medium">{member.name}</p>
    <p className="text-sm">Member</p>
    <Link
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600"
    >
      LinkedIn
    </Link>
  </div>
))}

        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Operations Team
        </h2>
        <div className="flex justify-center">
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Sarthak Kuwar"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Sarthak Kuwar</p>
            <p className="text-sm">Head</p>
            <Link
              href="https://linkedin.com/in/sarthakkuwar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 mt-4">
        {opsMembers.map((member, index) => (
        <div key={index} className="text-center mb-4 sm:mb-0">
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
          />
          <p className="text-xl font-medium">{member.name}</p>
          <p className="text-sm">Member</p>
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            LinkedIn
          </Link>
        </div>
      ))}

        </div>
      </div>
    </div>
  );
};

export default Team;
