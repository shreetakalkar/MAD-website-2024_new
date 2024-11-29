"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InputDialogWithToastAndRefresh() {
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [travelLane, setTravelLane] = useState("Select Lane");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!rangeStart.trim() || !rangeEnd.trim()) {
      toast({
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const docRef = doc(db, "ConcessionHistory", "PassBook");

      const newEntry = {
        [`${rangeStart}-${rangeEnd}`]: {
          date: Timestamp.now(),
          travelLane: travelLane,
        },
      };

      await updateDoc(docRef, newEntry);

      toast({
        description: "Input saved successfully.",
      });

      setRangeStart("");
      setRangeEnd("");
      setTravelLane("Western");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving input:", error);
      toast({
        description: "Failed to save input. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Pass Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pass Book</DialogTitle>
          <DialogDescription>
            Enter the details of the Railway Pass Book
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rangeStart" className="text-right">
              Book Start
            </Label>
            <Input
              id="rangeStart"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rangeEnd" className="text-right">
              Book End
            </Label>
            <Input
              id="rangeEnd"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Travel Lane</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="col-span-3">
                  {travelLane}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTravelLane("Western")}>
                  Western
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTravelLane("Central")}>
                  Central
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
