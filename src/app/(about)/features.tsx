"use client";

import React from "react";
import AppTT from "@/public/images/landing/FeaturesCard/TT-phone-1.svg";
import TTCard1 from "@/public/images/landing/FeaturesCard/TT-card1.png";
import AppPlacement from "@/public/images/landing/FeaturesCard/placement-phone.svg";
import PlacementCard1 from "@/public/images/landing/FeaturesCard/placement-card1.svg";
import PlacementCard2 from "@/public/images/landing/FeaturesCard/placement-card2.svg";
import AppRailway from "@/public/images/landing/FeaturesCard/railway-phone-1.svg";
import RailwayCard1 from "@/public/images/landing/FeaturesCard/railway-card1.svg";
import RailwayCard2 from "@/public/images/landing/FeaturesCard/railway-card2.svg";
import AppEvents from "@/public/images/landing/FeaturesCard/event-phone.svg";
import EventCard1 from "@/public/images/landing/FeaturesCard/event-card1.svg";
import EventCard2 from "@/public/images/landing/FeaturesCard/event-card2.png";
import AppDepartment from "@/public/images/landing/FeaturesCard/departments-phone.svg";
import DepartmentCard1 from "@/public/images/landing/FeaturesCard/department-card1.svg";
import DepartmentCard2 from "@/public/images/landing/FeaturesCard/department-card2.svg";
import AppCommittees from "@/public/images/landing/FeaturesCard/committe-phone.svg";
import CommitteeCard1 from "@/public/images/landing/FeaturesCard/committee-card1.svg";
import CommitteeCard2 from "@/public/images/landing/FeaturesCard/committee-card2.svg";
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
            bottom: "44%",
            left: "18%",
            width: "30%",
            height: "auto",
          },
        },
        {
          src: EventCard2,
          alt: "Event Card",
          style: {
            bottom: "27%",
            left: "53%",
            width: "44%",
            height: "auto",
          },
        },
      ],
      podiumStyle: {
        marginRight: "45px",
      },
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
            bottom: "28%",
            left: "14%",
            width: "40%",
            height: "auto",
          },
        },
      ],
      podiumStyle: {
        marginLeft: "50px",
      },
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
            bottom: "56%",
            left: "15%",
            width: "38%",
            height: "auto",
          },
        },
        {
          src: RailwayCard2,
          alt: "Railway Card",
          style: {
            bottom: "20%",
            left: "56%",
            width: "30%",
            height: "auto",
          },
        },
      ],

      podiumStyle: {
        marginRight: "50px",
      },
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
            bottom: "50%",
            left: "12%",
            width: "40%",
            height: "auto",
            
          },
        },
        {
          src: DepartmentCard2,
          alt: "Department Card",
          style: {
            bottom: "28%",
            left: "59%",
            width: "40%",
            height: "auto",
          },
        },
      ],

      podiumStyle: {
        marginLeft: "50px",
      },
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
            bottom: "40%",
            left: "12%",
            width: "38%",
            height: "auto",
          },
        },
        {
          src: CommitteeCard2,
          alt: "Committee Card",
          style: {
            bottom: "18%",
            left: "50%",
            width: "22%",
            height: "auto",
          },
        },
      ],

      podiumStyle: {
        marginRight: "50px",
      },
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
            bottom: "20%",
            left: "14%",
            width: "40%",
            height: "auto",
          },
        },
        {
          src: PlacementCard2,
          alt: "Placement Card",
          style: {
            bottom: "52%",
            left: "55%",
            width: "26%",
            height: "auto",
          },
        },
      ],

      podiumStyle: {
        marginLeft: "70px",
      },
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
                  podiumStyle={feature.podiumStyle}
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
