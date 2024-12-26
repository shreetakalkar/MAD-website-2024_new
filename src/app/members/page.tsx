'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LinkedinIcon, GithubIcon, Globe } from 'lucide-react'
import { teamData, Member } from '@/lib/memberData'
import { Navbar } from '@/components/landing-page/navbar'
import { useTheme } from 'next-themes'

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

const MemberCard = ({ member }: { member: Member }) => (
  <div className="m-6 rounded-2xl p-6 bg-gray-100/50 dark:bg-gray-800/50 shadow-sm w-80 hover:shadow-md transition-all duration-300">
    <div className="space-y-4">
      <div className="text-5xl font-semibold text-gray-400 dark:text-gray-500">
        {member.name}
      </div>
      
      <div className="w-8 h-0.5 bg-pink-500"></div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
      
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 288px"
        />
      </div>
      
      <div className="flex gap-4 pt-2">
        {member.linkedin && (
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
          >
            <LinkedinIcon size={20} />
          </Link>
        )}
        <Link
          href="#"
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
        >
          <GithubIcon size={20} />
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
        >
          <Globe size={20} />
        </Link>
      </div>
    </div>
  </div>
);

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