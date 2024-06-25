"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "./ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  certificateNumber: string
  name: string
  gender: string
  dob: string
  from: string
  to: string
  class: number
  mode: string
  dateOfIssue: string
  address: string
  status: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "certificateNumber",
        header: "Certificate Number",
},
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "dob",
    header: "DOB",
  },
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "to",
    header: "To",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "mode",
    header: "Mode",
  },
  {
    accessorKey: "dateOfIssue",
    header: "Date Of Issue",
  },
  {
    accessorKey: "address",
    header: () => <div className="w-[200px]">Address</div>,
    cell: ({row}) =>{
        let cellData = row.getValue("address") as string
     return (<div className="w-[200px]">{cellData}</div>)   
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  
  },

]
