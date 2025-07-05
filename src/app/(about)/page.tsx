"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing-page/navbar";
import AppRailway from "@/public/images/landing/app-railway.jpg";
import { PhoneMockup } from "@/components/landing-page/PhoneMockup";
import FeaturesSection from "./features";
import AppApply from "@/public/images/landing/app-apply.png";
import BgImageLight from "@/public/images/landing/app-bg-image-light.png";
import BgImageDark from "@/public/images/landing/app-bg-image-dark.png";
import AppFeatures from "@/public/images/landing/app-features.png";
import { useTheme } from "next-themes";
import AppAnnounce from "@/public/images/landing/app-announcement.png";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

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

export default function Page() {
  const { resolvedTheme } = useTheme();
  const BgImage = resolvedTheme === "light" ? BgImageLight : BgImageDark;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div
        className={`relative bg-top bg-no-repeat bg-contain sm:bg-cover min-w-full flex justify-center items-center p-0 m-0 backdrop-blur-md ${
          resolvedTheme === "dark"
            ? "dark:bg-[#0b1120] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-[90%] after:to-[#0b1120] after:to-100% after:pointer-events-none after:z-10"
            : "bg-white after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-[80%] after:to-white after:to-100% after:pointer-events-none after:z-10"
        }`}
        style={{ backgroundImage: `url(${BgImage.src})` }}
      >
        {/* Hero Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
          className="container flex flex-col md:flex-row items-center justify-center gap-12 pb-12 pt-32 sm:pt-32 md:py-24 px-4 md:px-10 mx-auto"
        >
          <div className="flex flex-col gap-8 max-w-2xl text-center md:text-left">
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Welcome to the{" "}
                <span className="text-[#2262C1]">TSEC Dev&apos;s Club</span>
              </h1>
              <motion.p
                variants={fadeInUp}
                className="sm:text-2xl font-semibold text-lg text-[#3082FD]"
              >
                Creators of the TSEC App
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col gap-4 items-center md:items-start"
            >
              <p className="text-sm text-muted-foreground font-semibold max-w-md">
                We&apos;re a team of passionate developers creating innovative
                solutions for TSEC students. Our flagship product, the TSEC App,
                enhances your academic experience and streamlines access to
                important college information.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <a href="/auth">
                  <button className="px-4 sm:px-6 py-3 font-normal text-white bg-[#35a7ff] hover:bg-blue-700 sm:text-lg text-sm rounded-full transition-colors duration-300 shadow-lg">
                    GET STARTED
                  </button>
                </a>
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex justify-center md:justify-start"
            >
              <Image
                className="py-5"
                src={AppFeatures}
                alt="App features"
                priority
              />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full max-w-sm md:max-w-md flex justify-center"
          >
            <div className="relative flex flex-col items-center justify-center">
              <PhoneMockup img={AppRailway} />

              {/* Announcement Box (Left) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                className="absolute -left-40 top-[35%] z-20 hidden xl:block"
              >
                <Image
                  src={AppAnnounce}
                  alt="Announcement preview"
                  width={203}
                  priority
                />
              </motion.div>

              {/* Apply Now Box (Right) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
                className="absolute -right-40 top-[45%] z-20 hidden xl:block"
              >
                <Image
                  src={AppApply}
                  alt="Apply now preview"
                  width={263}
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* App Download Section */}
      <div className="bg-[linear-gradient(180deg,_#ffffff_0%,_#e0f7ff_15%,_#ffffff_30%,_#d6f4ff_45%,_#ffffff_60%,_#c8f0ff_75%,_#ffffff_90%)] dark:bg-[linear-gradient(180deg,_#0b1120_0%,_#0b1120_15%,_#172554_30%,_#0b1120_50%,_#1e3a8a_65%,_#0b1120_85%,_#0b1120_100%)] dark:text-white">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          className="container py-20 px-5 mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-center text-2xl md:text-3xl font-bold mb-12"
          >
            Download Our App
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-md p-6 rounded-lg shadow-md border border-neutral-300 dark:border-[#3d4c63] 
              bg-white dark:bg-[radial-gradient(circle_at_top_left,_#111827,_#1f2937,_#0f172a)] 
              text-black dark:text-white transition-colors duration-300"
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.madclubtsec.tsec_application"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <h3 className="text-xl font-bold mb-4">TSEC App On Playstore</h3>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FplaystoreQR.jpg?alt=media&token=1cb6b370-f83c-46bd-b36e-1691ff467fec"
                  alt="Google Play Store QR Code"
                  width={250}
                  height={250}
                  className="rounded-md mb-4"
                />
                <p className="text-sm">Devs App is available on Playstore</p>
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="w-full max-w-md p-6 rounded-lg shadow-md border border-neutral-300 dark:border-[#3d4c63] 
              bg-white dark:bg-[radial-gradient(circle_at_top_left,_#111827,_#1f2937,_#0f172a)] 
              text-black dark:text-white transition-colors duration-300"
            >
              <a
                href="https://apps.apple.com/in/app/tsec-app/id6446188102"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <h3 className="text-xl font-bold mb-4">TSEC App On App Store</h3>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FappStoreQR.jpg?alt=media&token=601f1bc3-2fdb-493f-9a42-4beff1087f1c"
                  alt="Apple App Store QR Code"
                  width={250}
                  height={250}
                  className="rounded-md mb-4"
                />
                <p className="text-sm">Devs App is available on App Store</p>
              </a>
            </motion.div>
          </div>
        </motion.section>

        
        <FeaturesSection />

      
      </div>

      

    </div>
  );
}