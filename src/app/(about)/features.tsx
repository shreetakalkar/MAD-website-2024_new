"use client";

import React from "react";
import AppTT from "@/public/images/landing/FeaturesCard/TT-phone.png";
import TTCard1 from "@/public/images/landing/FeaturesCard/TT-card1.png";
import AppPlacement from "@/public/images/landing/FeaturesCard/placement-phone.png";
import PlacementCard1 from "@/public/images/landing/FeaturesCard/placement-card1.png";
import PlacementCard2 from "@/public/images/landing/FeaturesCard/placement-card2.png";
import AppRailway from "@/public/images/landing/FeaturesCard/railway-phone.png";
import RailwayCard1 from "@/public/images/landing/FeaturesCard/railway-card1.png";
import RailwayCard2 from "@/public/images/landing/FeaturesCard/railway-card2.png";
import AppEvents from "@/public/images/landing/FeaturesCard/event-phone.png";
import EventCard1 from "@/public/images/landing/FeaturesCard/event-card1.png";
import EventCard2 from "@/public/images/landing/FeaturesCard/event-card2.png";
import AppDepartment from "@/public/images/landing/FeaturesCard/departments-phone.png";
import DepartmentCard1 from "@/public/images/landing/FeaturesCard/department-card1.png";
import DepartmentCard2 from "@/public/images/landing/FeaturesCard/department-card2.png";
import AppCommittees from "@/public/images/landing/FeaturesCard/committees-phone.png";
import CommitteeCard1 from "@/public/images/landing/FeaturesCard/committee-card1.png";
import CommitteeCard2 from "@/public/images/landing/FeaturesCard/committee-card2.png";
import PhoneDisplay from "@/components/PhoneDisplay";

function FeaturesSection() {
  const features = [
    {
      title: "Events",
      description: "Keep track of all the events happening in college.",
      image: AppEvents,
      overlayCards: [
        {
          src: EventCard1,
          alt: "Event Card",
          style: {
            bottom: "240px",
            left: "24%",
            width: "100px",
            height: "auto",
          },
        },
        {
          src: EventCard2,
          alt: "Event Card",
          style: {
            bottom: "188px",
            left: "51%",
            width: "150px",
            height: "50px",
          },
        },
      ],
    },
    {
      title: "Timetable",
      description:
        "Access your class-wise timetable for your specific batch and class.",
      image: AppTT,
      overlayCards: [
        {
          src: TTCard1,
          alt: "Time table Card",
          style: {
            bottom: "180px",
            left: "28%",
            width: "134px",
            height: "auto",
          },
        },
      ],
    },
    {
      title: "Railway Concession",
      description: "Simplify the process of requesting railway concessions.",
      image: AppRailway,
      overlayCards: [
        {
          src: RailwayCard1,
          alt: "Railway Card",
          style: {
            bottom: "290px",
            left: "25%",
            width: "130px",
            height: "auto",
          },
        },
        {
          src: RailwayCard2,
          alt: "Railway Card",
          style: {
            bottom: "-200px",
            left: "2%",
            width: "80%",
            height: "auto",
          },
        },
      ],
    },
    {
      title: "Department Section",
      description:
        "Find detailed information about every department within TSEC.",
      image: AppDepartment,
      overlayCards: [
        {
          src: DepartmentCard1,
          alt: "Department Card",
          style: {
            bottom: "250px",
            left: "23%",
            width: "130px",
            height: "auto",
          },
        },
        {
          src: DepartmentCard2,
          alt: "Department Card",
          style: {
            bottom: "180px",
            left: "58%",
            width: "130px",
            height: "auto",
          },
        },
      ],
    },
    {
      title: "Committees",
      description:
        "Learn about the various committees in the college and stay updated.",
      image: AppCommittees,
      overlayCards: [
        {
          src: CommitteeCard1,
          alt: "Committee Card",
          style: {
            bottom: "240px",
            left: "20%",
            width: "140px",
            height: "auto",
          },
        },
        {
          src: CommitteeCard2,
          alt: "Committee Card",
          style: {
            bottom: "120px",
            left: "50%",
            width: "100px",
            height: "auto",
          },
        },
      ],
    },
    {
      title: "Placement",
      description:
        "Students can view prospects for placements directly from the app.",
      image: AppPlacement,
      overlayCards: [
        {
          src: PlacementCard1,
          alt: "Placement Card",
          style: {
            bottom: "130px",
            left: "26%",
            width: "140px",
            height: "auto",
          },
        },
        {
          src: PlacementCard2,
          alt: "Placement Card",
          style: {
            bottom: "280px",
            left: "55%",
            width: "80px",
            height: "auto",
          },
        },
      ],
    },
  ];

  return (
    <section className="py-0 my-0">
      <div className="container space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Empowering TSEC Students with{" "}
          <span className="text-blue-600">Cutting-Edge Technology</span>
        </h2>

        <div className="space-y-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-0 py-4 md:py-2"
            >
              {/* Index based positioning, alternating order */}
              {/* Image Section */}
              <div
                className={
                  i % 2 === 0 ? "order-1 md:order-2" : "order-2 md:order-1"
                }
              >
                <PhoneDisplay
                  phoneImage={feature.image}
                  overlayCards={feature.overlayCards}
                />
              </div>

              {/* Description Section */}
              <div
                className={
                  i % 2 === 0 ? "order-1 text-center" : "order-2 text-center"
                }
              >
                <h3 className="text-2xl font-semibold mb-3 md:text-4xl">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
