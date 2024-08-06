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
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="w-full h-[75vh] flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <Card className="w-4/5 h-4/5">
                    <CardContent className="flex items-center justify-center h-full p-6">
                      <span className="text-4xl font-bold text-gray-700 dark:text-gray-300">
                        {index + 1}
                      </span>
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
              src="https://via.placeholder.com/150"
              alt="Dr. John Doe"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Dr. John Doe</p>
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
              alt="Prof. Alice Smith"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Prof. Alice Smith</p>
            <p className="text-sm">Professor Incharge</p>
            <Link
              href="https://linkedin.com/in/alicesmith"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Prof. Bob Brown"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Prof. Bob Brown</p>
            <p className="text-sm">Professor Incharge</p>
            <Link
              href="https://linkedin.com/in/bobbrown"
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
              src="https://via.placeholder.com/150"
              alt="Mr. Charlie Johnson"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Mr. Charlie Johnson</p>
            <p className="text-sm">Chairperson</p>
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
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Chairpersons
        </h2>
        <div className="flex  justify-center space-x-4 sm:space-x-8">
          <div className="text-center mb-4 sm:mb-0">
            <img
              src="https://via.placeholder.com/150"
              alt="Mr. Charlie Johnson"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Mr. Charlie Johnson</p>
            <p className="text-sm">Chairperson</p>
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
              src="https://via.placeholder.com/150"
              alt="Mr. Evan Parker"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Mr. Evan Parker</p>
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
          {["Member 1", "Member 2", "Member 3", "Member 4"].map(
            (member, index) => (
              <div key={index} className="text-center mb-4 sm:mb-0">
                <img
                  src="https://via.placeholder.com/150"
                  alt={member}
                  className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
                />
                <p className="text-xl font-medium">{member}</p>
                <p className="text-sm">Member</p>
                <Link
                  href={`https://linkedin.com/in/${member
                    .toLowerCase()
                    .replace(" ", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  LinkedIn
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">App Team</h2>
        <div className="flex justify-center">
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Ms. Fiona Green"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Ms. Fiona Green</p>
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
          {["Member 1", "Member 2"].map((member, index) => (
            <div key={index} className="text-center mb-4 sm:mb-0">
              <img
                src="https://via.placeholder.com/150"
                alt={member}
                className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
              />
              <p className="text-xl font-medium">{member}</p>
              <p className="text-sm">Member</p>
              <Link
                href={`https://linkedin.com/in/${member
                  .toLowerCase()
                  .replace(" ", "")}`}
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
          {["Member 1", "Member 2"].map((member, index) => (
            <div key={index} className="text-center mb-4 sm:mb-0">
              <img
                src="https://via.placeholder.com/150"
                alt={member}
                className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
              />
              <p className="text-xl font-medium">{member}</p>
              <p className="text-sm">Member</p>
              <Link
                href={`https://linkedin.com/in/${member
                  .toLowerCase()
                  .replace(" ", "")}`}
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
              alt="Mr. George Harris"
              className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
            />
            <p className="text-xl font-medium">Mr. George Harris</p>
            <p className="text-sm">Head</p>
            <Link
              href="https://linkedin.com/in/georgeharris"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 mt-4">
          {["Member 1", "Member 2", "Member 3"].map((member, index) => (
            <div key={index} className="text-center mb-4 sm:mb-0">
              <img
                src="https://via.placeholder.com/150"
                alt={member}
                className="w-32 h-32 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full mx-auto mb-2"
              />
              <p className="text-xl font-medium">{member}</p>
              <p className="text-sm">Member</p>
              <Link
                href={`https://linkedin.com/in/${member
                  .toLowerCase()
                  .replace(" ", "")}`}
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
