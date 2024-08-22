import React from "react";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function UnprotectedNavabar() {
  return (
    <nav className="sticky top-0 shadow-sm z-50 bg-white dark:bg-slate-950">
      <div className=" mx-auto ">
        <div className="flex justify-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <ModeToggle />
            <Button variant={"link"}>
              <Link href="/about">About Us</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
