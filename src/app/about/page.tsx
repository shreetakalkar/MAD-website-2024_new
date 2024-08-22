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

const Team = () => {
  const { user } = useUser();
  
  const carouselImageArray = [
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Ftitle.JPG?alt=media&token=12cb53fd-ebdf-4aba-9b15-0eef01c9f41e` , 
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Fapp1.png?alt=media&token=061c8eb8-276a-42e0-975f-3469b5598af3`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Fapp2.png?alt=media&token=2b456034-344d-4d55-9dc6-7f19a25989ff`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Frailwayhome-light.png?alt=media&token=0c789c81-7558-430d-bb33-8bb836809159`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Fnewpass-light.png?alt=media&token=2b984c15-5508-42e3-81a5-bbe0ef76e17b`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Fpasscheck-light.png?alt=media&token=17bb1957-3404-482c-9e4e-d12f04938adf`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Fdownload-light.png?alt=media&token=f435c6b1-4e3d-4a8f-bbbe-9038ae4eeb49`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2Fcommittee-light.png?alt=media&token=f0d20b6e-1ebb-4d8f-ad8e-79105747500d`,
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
  
  


  return (
    <div className="container mx-auto p-4">
      <nav className="sticky top-0 shadow-sm z-50 bg-white dark:bg-slate-950">
        <div className=" mx-auto ">
          <div className="flex justify-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <ModeToggle  />
              {user?.name ?
              <Button variant={"link"} >
              <Link href="/dashboard">Dashboard</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
              </Button>:<Button variant={"link"}>
                  <Link href="/">Sign In</Link>
                  <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              }
            </div>
          </div>
        </div>
      </nav>

      <section className="mb-12 w-full">
        <Carousel
          opts={{ align: "center" }}
          className="w-ful"
        >
          <CarouselContent className="relative">
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem key={index} className="w-full h-[75vh] flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <Card className="w-4/5 h-4/5">
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



      <h1 className="text-4xl font-bold mb-8 text-center">Our Team</h1>

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
          Chairpersons
        </h2>
        <div className="flex  justify-center space-x-4 sm:space-x-8">
          <div className="text-center mb-4 sm:mb-0">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Ffahed.png?alt=media&token=45721059-7939-4be2-acdf-a4c15150a30e"
              alt="Fahed Khan"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Fahed Khan</p>
            <p className="text-sm">Chairperson</p>
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
            <p className="text-sm">Vice Chairperson</p>
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
