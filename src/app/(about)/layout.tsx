"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import UnprotectedNavbar from "@/components/UnprotectedNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useUser();


  return (
    <div className="container mx-auto p-4">
      <UnprotectedNavbar />
        {children}
    </div>
  );
};

export default Layout;
