import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CollectionDisplayTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<Record<string, any>>(
    {}
  );

  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const setStatusFilter = (status: string | null) => {
    setFilterStatus(status);
    table.getColumn("status")?.setFilterValue(status);
  };

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
  <Input
    placeholder="Filter certificate numbers..."
    value={(table.getColumn("certNo")?.getFilterValue() as string) ?? ""}
    onChange={(event) =>
      table.getColumn("certNo")?.setFilterValue(event.target.value)
    }
    className="max-w-sm"
  />

  {/* Collected Button */}
  <Button
    onClick={() => setStatusFilter("Collected")}
    disabled={filterStatus === "Collected"}
    className={`bg-blue-200 hover:bg-blue-300 text-blue-700 px-4 py-2 rounded-md ${
      filterStatus === "Collected" ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Collected
  </Button>

  {/* Not Collected Button */}
  <Button
    onClick={() => setStatusFilter("Not Collected")}
    disabled={filterStatus === "Not Collected"}
    className={`bg-blue-200 hover:bg-blue-300 text-blue-700 px-4 py-2 rounded-md ${
      filterStatus === "Not Collected" ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Not Collected
  </Button>

  {/* Clear Button */}
  <Button
    onClick={() => setStatusFilter(null)}
    disabled={!filterStatus}
    className={`bg-blue-200 hover:bg-blue-300 text-blue-700 px-4 py-2 rounded-md ${
      !filterStatus ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Clear
  </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
