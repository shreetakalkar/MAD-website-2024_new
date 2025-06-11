"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing-page/navbar";
import React from "react";
import AppTT from "@/public/images/landing/app-tt.jpg";
import AppPlacement from "@/public/images/landing/app-placement.jpg";
import AppRailway from "@/public/images/landing/app-railway.jpg";
import AppEvents from "@/public/images/landing/app-events.jpg";
import AppDepartment from "@/public/images/landing/app-dept.jpg";
import AppCommittees from "@/public/images/landing/app-committees.jpg";
import { PhoneMockup } from "@/components/landing-page/PhoneMockup";
import FeaturesSection from "./features"

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
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={stagger}
        className="container grid items-center gap-12 pb-8 pt-32 md:grid-cols-2 md:gap-8 md:py-24 md:px-10"
      >
        <div className="flex flex-col gap-8">
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to the{" "}
              <span className="text-blue-600">TSEC Dev&apos;s Club</span>
            </h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-blue-600"
            >
              Creators of the TSEC App
            </motion.p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="flex max-w-md flex-col gap-4"
          >
            <p className="text-sm text-muted-foreground">
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
              <button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-300 shadow-lg">
                Get Started
              </button>
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-4 sm:gap-8"
          >
            {["Timetable", "Notes", "Railway Concession", "Notifications"].map(
              (feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs sm:text-sm font-medium text-muted-foreground"
                >
                  {feature}
                </motion.div>
              )
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm md:max-w-md"
        >
          <PhoneMockup img={AppRailway} />
        </motion.div>
      </motion.section>

      {/* Barcodes Section */}
      <div className="bg-[linear-gradient(180deg,_#ffffff_0%,_#e0f7ff_15%,_#ffffff_30%,_#d6f4ff_45%,_#ffffff_60%,_#c8f0ff_75%,_#ffffff_90%)] dark:bg-[linear-gradient(180deg,_#0b1120_0%,_#0b1120_15%,_#172554_30%,_#0b1120_50%,_#1e3a8a_65%,_#0b1120_85%,_#0b1120_100%)] dark:text-white">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
        className="container py-16"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-center text-2xl md:text-3xl font-bold mb-12"
        >
          Download Our App
        </motion.h2>
        <div className="flex flex-wrap justify-around p-6">
          <motion.div
            variants={fadeInUp}
            className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-full max-w-[15rem] sm:max-w-[15rem] md:max-w-sm lg:max-w-md m-2"
          >
            <a
              href="https://play.google.com/store/apps/details?id=com.madclubtsec.tsec_application"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="text-lg sm:text-sm md:text-xl lg:text-2xl font-bold mb-2">
                TSEC App On Playstore
              </h2>
            </a>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FplaystoreQR.jpg?alt=media&token=1cb6b370-f83c-46bd-b36e-1691ff467fec"
              alt="Download TSEC App on Google Play - QR Code"
              className="h-auto rounded-md mb-2 w-full"
              width={300}
              height={300}
            />
            <p>Devs App is available on Playstore</p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="border border-gray-300 rounded-lg p-4 text-center shadow-md w-full max-w-[15rem] sm:max-w-[15rem] md:max-w-sm lg:max-w-md m-2"
          >
            <a
              href="https://apps.apple.com/in/app/tsec-app/id6446188102"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="text-lg sm:text-sm md:text-xl lg:text-2xl font-bold mb-2">
                TSEC App On App Store
              </h2>
            </a>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2FCard%2FappStoreQR.jpg?alt=media&token=601f1bc3-2fdb-493f-9a42-4beff1087f1c"
              alt="Card 3"
              className="w-full h-auto rounded-md mb-2"
              width={300}
              height={300}
            />
            <p>Devs App is available on App Store</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <FeaturesSection />
      </div> 
      {/* barcode+features div for bg */}
    </div>
  );
}