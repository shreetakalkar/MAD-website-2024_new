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
          className="container grid items-center justify-center gap-12 pb-12 sm:pt-32 pt-20 md:grid-cols-2 md:gap-8 md:py-24 md:px-10 hero m-0"
        >
          <div className="flex flex-col gap-8">
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
              className="flex max-w-md flex-col gap-4"
            >
              <p className="text-sm text-muted-foreground font-semibold">
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
              className="flex flex-wrap items-center gap-4 sm:gap-8"
            >
              {/* {[
                "Timetable",
                "Notes",
                "Railway Concession",
                "Notifications",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs sm:text-sm font-medium text-muted-foreground"
                >
                  {feature}
                </motion.div>
              ))} */}
              <Image
                className="py-5 sm:pl-8 md:pl-14"
                src={AppFeatures || "/placeholder.svg"}
                alt="feature"
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-full max-w-sm md:max-w-md"
          >
            <div className="relative flex flex-col items-center justify-center">
              {/* Phone UI */}
              <div className="relative z-10">
                <PhoneMockup img={AppRailway} />

                {/* Announcement Box (Left) */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                  className="absolute -left-40 top-[35%] z-20 hidden xl:block"
                >
                  <Image
                    src={AppAnnounce || "/placeholder.svg"}
                    alt="announce"
                    width={203}
                    className="w-[203px] "
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
                    src={AppApply || "/placeholder.svg"}
                    alt="apply"
                    width={263}
                    className="w-[263px]"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* Barcodes Section */}
      <div className="bg-[linear-gradient(180deg,_#ffffff_0%,_#e0f7ff_15%,_#ffffff_30%,_#d6f4ff_45%,_#ffffff_60%,_#c8f0ff_75%,_#ffffff_90%)] dark:bg-[linear-gradient(180deg,_#0b1120_0%,_#0b1120_15%,_#172554_30%,_#0b1120_50%,_#1e3a8a_65%,_#0b1120_85%,_#0b1120_100%)] dark:text-white">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          className="container py-20 px-5"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-center text-2xl md:text-3xl font-bold mb-12"
          >
            Download Our App
          </motion.h2>
          <div className="flex flex-wrap justify-around py-6 px-3 gap-y-4">
            <motion.div
              variants={fadeInUp}
              className="rounded-lg p-4 text-center shadow-md w-full md:max-w-md lg:max-w-lg m-2 
             border border-neutral-500 dark:border-[#3d4c63] 
             bg-white dark:bg-[radial-gradient(circle_at_top_left,_#111827,_#536d93,_#0f172a)] 
             text-black dark:text-white 
             transition-colors duration-300"
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
              className="rounded-lg p-4 text-center shadow-md w-full md:max-w-md lg:max-w-lg m-2 
             border border-neutral-500 dark:border-[#3d4c63] 
             bg-white dark:bg-[radial-gradient(circle_at_top_left,_#111827,_#1f2937,_#0f172a)] 
             text-black dark:text-white 
             transition-colors duration-300"
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
