'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/landing-page/navbar'
import Link from 'next/link'

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

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={stagger}
        className="container grid items-center gap-12 pb-8 pt-32 md:grid-cols-2 md:gap-8 md:py-40"
      >
        <div className="flex flex-col gap-8">
          <motion.div 
            variants={fadeInUp}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to the{' '}
              <span className="text-[#4339F2]">TSEC Dev's Club</span>
            </h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-[#4339F2]"
            >
              Creators of the TSEC App
            </motion.p>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="flex max-w-md flex-col gap-4"
          >
            <p className="text-sm text-muted-foreground">
              We're a team of passionate developers creating innovative solutions for TSEC students. Our flagship product, the TSEC App, enhances your academic experience and streamlines access to important college information.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <button className="px-6 py-3 text-lg font-semibold text-white bg-[#4339F2] hover:bg-[#4339F2]/90 rounded-full transition-colors duration-300 shadow-lg">
                Get Started
              </button>
            </motion.div>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-4 sm:gap-8"
          >
            {['Timetable', 'Notes', 'Railway Concession', 'Notifications'].map((feature, i) => (
              <motion.div 
                key={feature}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs sm:text-sm font-medium text-muted-foreground"
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm md:max-w-md"
        >
          <Image
            src="/placeholder.svg?height=600&width=300"
            width={300}
            height={600}
            alt="TSEC App interface mockup"
            className="rounded-[2rem] shadow-2xl"
          />
        </motion.div>
      </motion.section>

      {/* Barcodes Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
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
              alt="Playstore QR"
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
      <section className="bg-black py-16 md:py-24 text-white rounded-[15px]">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="container space-y-12"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-center text-2xl md:text-3xl font-bold"
          >
            Empowering TSEC Students with{' '}
            <span className="text-[#4339F2]">Cutting-Edge Technology</span>
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: 'Timetable',
                description: 'Access your class-wise timetable customized for your specific batch and class.',
                image: '/placeholder.svg?height=400&width=200'
              },
              {
                title: 'Notes',
                description: 'Teachers can upload lecture notes and study materials directly to the app.',
                image: '/placeholder.svg?height=400&width=200'
              },
              {
                title: 'Railway Concession',
                description: 'Simplify the process of requesting railway concessions through the app.',
                image: '/placeholder.svg?height=400&width=200'
              },
              {
                title: 'Department Section',
                description: 'Find detailed information about every department within TSEC.',
                image: '/placeholder.svg?height=400&width=200'
              },
              {
                title: 'Committees',
                description: 'Learn about the various committees in the college and stay updated.',
                image: '/placeholder.svg?height=400&width=200'
              },
              {
                title: 'Events',
                description: 'Keep track of all the events happening in college.',
                image: '/placeholder.svg?height=400&width=200'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative mx-auto h-[300px] sm:h-[400px] w-[150px] sm:w-[200px]"
                >
                  <Image
                    src={feature.image}
                    fill
                    alt={feature.title}
                    className="rounded-[1.5rem] object-cover"
                  />
                </motion.div>
                <h3 className="text-center text-lg font-semibold">{feature.title}</h3>
                <p className="text-center text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  )
}

