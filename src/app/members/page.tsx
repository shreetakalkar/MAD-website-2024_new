"use client";

import { motion } from "framer-motion";
import { teamData, Member } from "@/lib/memberData";
import { Navbar } from "@/components/landing-page/navbar";
import { useTheme } from "next-themes";
import React from "react";
import MemberCard from "@/components/Cards/MemberCards";

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const TeamSection = ({
  title,
  members,
}: {
  title: string;
  members: Member[];
}) => (
  <motion.section
    initial="initial"
    animate="animate"
    variants={stagger}
    className="w-full"
  >
    <div className="rounded-[60px] py-16 px-8">
      <motion.h2
        variants={fadeInUp}
        className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-12 text-center"
      >
        {title}
      </motion.h2>
      <div
        className={`grid ${
          members.length === 1
            ? "grid-cols-1 place-items-center"
            : "grid-cols-1 md:grid-cols-2 gap-8 place-items-center"
        } max-w-5xl mx-auto px-4`}
      >
        {members.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  </motion.section>
);

export default function MembersPage() {
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
            We&apos;re a diverse team of developers, designers, and innovators
            working together to create an amazing experience for TSEC students.
          </p>
          <div className="w-32 h-1 bg-blue-600 mx-auto mt-8 opacity-50"></div>
        </motion.div>
        
        {teamData.map((team) => (
          <div key={team.title} className="w-full dark:bg-gray-900/50 bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            
            <TeamSection
              title={team.title}
              members={team.members}
            />
          </div>
        ))}
      </main>
    </div>
  );
}