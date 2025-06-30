"use client"

import Image from "next/image"
import { CardBody, CardContainer, CardItem } from "../ui/3d-card"
import Link from "next/link"
import type { Member } from "@/lib/memberData"

interface MemberCardProps {
  member: Member
}

const MemberCard = ({ member }: MemberCardProps) => {
  const isPriority = member.role.includes("Principal") || member.role.includes("Chairperson")
  
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-100/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-gray-800/50 dark:border-white/[0.2] border-black/[0.1] w-[320px] sm:w-[400px] md:w-[480px] h-auto rounded-xl p-8 border">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <CardItem translateZ="100" className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
              <Image
                src={member.image || "/placeholder.svg?height=400&width=400"}
                alt={`${member.name} - ${member.role}`}
                fill
                sizes="(max-width: 768px) 160px, 160px"
                className="object-cover group-hover/card:shadow-xl transition-transform duration-300 group-hover/card:scale-105"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                priority={isPriority}
                loading={isPriority ? "eager" : "lazy"}
              />
            </div>
          </CardItem>

          <div className="flex flex-col w-full md:w-1/2">
            <CardItem translateZ="50" className="text-2xl font-bold text-gray-400 dark:text-gray-500">
              <div className="min-h-[4rem] break-words flex flex-col justify-end">
                <div>{member.name}</div>
              </div>
            </CardItem>
            <div className="w-12 h-0.5 bg-blue-600 my-4"></div>
            <CardItem translateZ="60" className="text-base text-gray-500 dark:text-gray-400">
              <span className="min-h-[3rem] break-words">{member.role}</span>
            </CardItem>
            <div className="flex gap-6 mt-6">
              {member.linkedin && (
                <CardItem
                  translateZ={20}
                  as={Link}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-300 hover:-translate-y-1"
                >
                  LinkedIn
                </CardItem>
              )}
              {member.github && (
                <CardItem
                  translateZ={20}
                  as={Link}
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-all duration-300 hover:-translate-y-1"
                >
                  GitHub
                </CardItem>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  )
}

export default MemberCard