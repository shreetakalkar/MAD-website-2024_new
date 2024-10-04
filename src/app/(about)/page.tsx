"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import UnprotectedNavbar from "@/components/UnprotectedNavbar";

const Team = () => {

  const carouselImageArray = [
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2FCover%20Page%20for%20Devs%20Play%20Store.png?alt=media&token=920eda3f-3b70-4c89-9309-4cc02ad41bb7`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F1.png?alt=media&token=3f4db1d7-394e-497d-a3bd-c1f3a85dbc22`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F2.png?alt=media&token=59f1fe57-50c5-41e7-bb82-ae5bd5a3a20c`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F3.png?alt=media&token=4494cb5b-5d76-4f74-b9a6-1af5d3321d60`,
    `https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCarousel%2F4.png?alt=media&token=f25e38ae-31dd-4a18-84bd-a1e30baa6dfb`,
  ];

  const webMembers = [
    {
      name: "Juhi Deore",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJuhi.jpg?alt=media&token=33b59920-a019-458e-a925-4cfda021d74a",
      linkedin: "https://www.linkedin.com/in/juhideore/",
    },
    {
      name: "Mayuresh Chavan",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FMayuresh.jpg?alt=media&token=c5668236-d83a-451e-a796-05248301795a",
      linkedin: "https://www.linkedin.com/in/mayuresh-chavan-04a3b5259/",
    },
    {
      name: "Anish Awasthi",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FAnish.jpeg?alt=media&token=aa0c7f5c-248b-4f32-94f2-f01f8d911326",
      linkedin: "https://linkedin.com/in/anish-awasthi-213106287",
    },
    {
      name: "Jash Rashne",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJash.JPG?alt=media&token=9bdc90ec-805b-46af-a9ce-43d0a66b4b66",
      linkedin: "https://www.linkedin.com/in/jashrashne",
    },
  ];

  const opsMembers = [
    {
      name: "Zoya Hassan",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FZoya.jpeg?alt=media&token=6854ba68-af9b-44c2-903f-61596e690252",
      linkedin: "https://www.linkedin.com/in/zoya-hassan-688470271/",
    },
    {
      name: "Herambh Vengurlekar",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fheramb.JPG?alt=media&token=e2c743ca-e812-4a43-a4ec-4bef248aa604",
      linkedin: "http://www.linkedin.com/in/herambve",
    },
    {
      name: "Suhani Poptani",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FSuhani.jpeg?alt=media&token=eeccf450-3d90-4c01-bdd6-f19c5c6700fc",
      linkedin: "", //not on linkedin
    },
  ];

  const appMembers = [
    {
      name: "Aryan Pathak",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FAryan.jpg?alt=media&token=c58aa850-6ff0-4597-8d50-886cd09ddf70",
      linkedin: "https://www.linkedin.com/in/aryan-pathak-67a39b290",
    },
    {
      name: "Shreya Bhatia",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FShreya.jpg?alt=media&token=d5a5410a-6a13-4d3c-98cd-c757df659b4c",
      linkedin: "http://www.linkedin.com/in/shreya-bhatia-6364ab2bb",
    },
    {
      name: "Siddhi Mehta",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FSiddhi.png?alt=media&token=5552fe08-ca67-4e88-840b-b305eefb6d1c",
      linkedin: "https://www.linkedin.com/in/siddhi-mehta-228048298/",
    },
  ];

  const designMembers = [
    {
      name: "Kashish Dodeja",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fkashish.JPG?alt=media&token=3e71f52b-b06f-4e65-89ba-d49569fd76d3",
      linkedin: "https://www.linkedin.com/in/kashishdodeja?trk=contact-info",
    },
    {
      name: "Malhaar Mirchandani",
      image:
        "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FMalhaar.jpg?alt=media&token=15ac7778-63a8-4529-85ff-13cc5916ba29",
      linkedin: "https://www.linkedin.com/in/malhaar-mirchandani-a8188b287",
    },
  ];

  return (
    <>

      <section className="mb-12 w-full">
        <Carousel opts={{ align: "center" }} className="w-full">
          <CarouselContent className="relative">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="w-full flex items-center justify-center"
              >
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

      <div className="flex flex-wrap justify-around p-6">
        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-full max-w-[15rem] sm:max-w-[15rem] md:max-w-sm lg:max-w-md m-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.madclubtsec.tsec_application"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-lg sm:text-sm md:text-xl lg:text-2xl font-bold mb-2">
              TSEC App On Playstore
            </h2>
          </a>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FplaystoreQR.jpg?alt=media&token=1cb6b370-f83c-46bd-b36e-1691ff467fec"
            alt="Card 1"
            className="h-auto rounded-md mb-2 w-full"
          />
          <p>Devs App is available on Playstore</p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-full max-w-[15rem] sm:max-w-[15rem] md:max-w-sm lg:max-w-md m-2">
          <h2 className="text-lg sm:text-sm md:text-xl lg:text-2xl font-bold mb-2">
            Devs Club Website
          </h2>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FApp%20Icon%20with%20Shadow.png?alt=media&token=11d0ab17-d538-4b3d-8480-cedc1d3936d7"
            alt="Card 2"
            className="w-full h-auto rounded-md mb-2"
          />
          <p>Devs Club Website is used by officials</p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-full max-w-[15rem] sm:max-w-[15rem] md:max-w-sm lg:max-w-md m-2">
          <a
            href="https://apps.apple.com/in/app/tsec-app/id6446188102"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-lg sm:text-sm md:text-xl lg:text-2xl font-bold mb-2">
              TSEC App On App Store
            </h2>
          </a>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FappStoreQR.jpg?alt=media&token=601f1bc3-2fdb-493f-9a42-4beff1087f1c"
            alt="Card 3"
            className="w-full h-auto rounded-md mb-2"
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
              href="https://www.linkedin.com/in/gopakumaran-thampi-79680727?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fdk_maam.jpg?alt=media&token=32d36076-687f-4dd7-beec-645a0035ef22"
              alt="Prof. Darakshan Khan"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Prof. Darakshan Khan</p>
            <p className="text-sm">Professor Incharge</p>
            <Link
              href="https://www.linkedin.com/in/darakshan-khan-2166132a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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
              href="https://www.linkedin.com/in/dr-shachi-natu-b796892?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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
        <h2 className="text-3xl font-semibold mb-4 text-center">Chairperson</h2>
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
              href="https://www.linkedin.com/in/fahed-khan-13b11025b"
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
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fatharva.png?alt=media&token=ababa798-5f3c-4e4e-bb17-c1a2b108f51b"
              alt="Atharva Khewle"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Atharva Khewle</p>
            {/* <p className="text-sm">Vice Chairperson</p> */}
            <Link
              href="https://www.linkedin.com/in/atharvakhewle"
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
              href="https://www.linkedin.com/in/ritojnanmukherjee/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 mt-4">
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
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fzeeshan.png?alt=media&token=4789696e-955a-4ba0-9738-eec09aebf1fc"
              alt="Zeeshan Sayed"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Zeeshan Sayed</p>
            <p className="text-sm">Head</p>
            <Link
              href="https://www.linkedin.com/in/zeeshan-hyder-sayed-63324b292"
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
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fsarthak.png?alt=media&token=1f33ee2e-92ce-43f7-9222-607615650805"
              alt="Sarthak Kuwar"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Sarthak Kuwar</p>
            <p className="text-sm">Head</p>
            <Link
              href="https://www.linkedin.com/in/sarthak-kuwar-95759226a"
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
    </>
  );
};

export default Team;
