'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LinkedinIcon, GithubIcon, Globe } from 'lucide-react'
import { teamData, Member } from '@/lib/memberData'
import { Navbar } from '@/components/landing-page/navbar'
import { useTheme } from 'next-themes'

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";


const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const MemberCard = ({ member } : any) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-2xl font-bold text-neutral-600 dark:text-white"
        >
          {member.name}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {member.role}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={member.image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={member.name}
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          {member.linkedin && (
            <CardItem
              translateZ={20}
              as={Link}
              href={member.linkedin}
              target="_blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              LinkedIn →
            </CardItem>
          )}
          <CardItem
            translateZ={20}
            as={Link}
            href="#"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Visit Website
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

const TeamSection = ({ title, members }: { title: string; members: Member[] }) => (
  <motion.section
    initial="initial"
    animate="animate"
    variants={stagger}
    className="mb-24"
  >
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[60px] py-16 px-8">
      <motion.h2
        variants={fadeInUp}
        className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-12 text-center"
      >
        {title}
      </motion.h2>
      <div className="flex flex-wrap justify-center">
        {members.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  </motion.section>
)

export default function MembersPage() {
  const { theme } = useTheme();
  
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-32">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center mb-24"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Meet Our Team
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're a diverse team of developers, designers, and innovators working together 
            to create an amazing experience for TSEC students.
          </p>
          <div className="w-32 h-1 bg-[#4339F2] mx-auto mt-8 opacity-50"></div>
        </motion.div>
        {teamData.map((team) => (
          <TeamSection key={team.title} title={team.title} members={team.members} />
        ))}
      </main>
    </div>
  )
}