'use client';

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { useLoading } from "@/providers/LoadingContext";

export const Footer = () => {

  const { loading } = useLoading();

  if (loading) return null;
  return (
    <footer className="bg-transparent border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-50">
        
        <p className="text-center">
          © {new Date().getFullYear()} TSEC Dev&apos;s Club. All rights reserved.
        </p>
        

        <div className="flex flex-row items-center gap-6">

          <Link
            href="https://github.com/TSEC-MAD-Club"
            target="_blank"
            rel="noopener noreferrer"

            className="hover:text-[#2262C1] transition-colors"

          >
            <FaGithub size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/devs-club-tsec/"
            target="_blank"
            rel="noopener noreferrer"

            className="hover:text-[#2262C1] transition-colors"
          >
            <BsLinkedin size={24} />

          </Link>
          <Link
            href="https://www.instagram.com/devsclubtsec/"
            target="_blank"
            rel="noopener noreferrer"

            className="hover:text-[#2262C1] transition-colors"
          >
            <FaInstagram size={24} />

          </Link>
        </div>
      </div>
    </footer>
  );
};
