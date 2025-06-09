"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";

const MemberCard = ({ member }: any) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-100/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-gray-800/50 dark:border-white/[0.2] border-black/[0.1] w-[320px] sm:w-[400px] md:w-[480px] h-auto rounded-xl p-8 border">
        <div className="flex flex-col md:flex-row gap-6 items-center">
      
          <CardItem translateZ="100" className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 ">
              <Image
                src={member.image}
                height={600}
                width={600}
                className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={member.name}
              />
            </div>
          </CardItem>

        
          <div className="flex flex-col w-full md:w-1/2">
            <CardItem
              translateZ="50"
              className="text-2xl font-bold text-gray-400 dark:text-gray-500"
            >
              <div className="min-h-16 break-words flex flex-col justify-end">
                <div>{member.name}</div>
              </div>
            </CardItem>

            <div className="w-12 h-0.5 bg-blue-600 my-4"></div>

            <CardItem
              translateZ="60"
              className="text-base text-gray-500 dark:text-gray-400"
            >
              <span className="min-h-12 break-words">
                {member.role}
              </span>
            </CardItem>

            <div className="flex gap-6 mt-6">
              {member.linkedin && (
                <CardItem
                  translateZ={20}
                  as={Link}
                  href={member.linkedin}
                  target="_blank"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-300 hover:-translate-y-1"
                >
                  LinkedIn
                </CardItem>
              )}
              <CardItem
                translateZ={20}
                as={Link}
                href={member.github || "#"}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-300 hover:-translate-y-1"
              >
                Github
              </CardItem>
              <CardItem
                translateZ={20}
                as={Link}
                href={member.website || "#"}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-300 hover:-translate-y-1"
              >
                Website
              </CardItem>
            </div>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default MemberCard;
