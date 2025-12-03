"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// ----------------------
// Types
// ----------------------
export type SensorReading = {
  timestamp: string;
  temperature: number;
  ph: number;
  tds: number;
};

// ----------------------
// Dummy Data (10-min intervals)
// ----------------------
const sensorData: SensorReading[] = [
  { timestamp: "2025-12-02 08:00", temperature: 27.4, ph: 7.12, tds: 320 },
  { timestamp: "2025-12-02 08:10", temperature: 27.6, ph: 7.1, tds: 322 },
  { timestamp: "2025-12-02 08:20", temperature: 27.5, ph: 7.15, tds: 319 },
  { timestamp: "2025-12-02 08:30", temperature: 27.7, ph: 7.18, tds: 325 },
  { timestamp: "2025-12-02 08:40", temperature: 27.9, ph: 7.11, tds: 318 },
  { timestamp: "2025-12-02 08:50", temperature: 28.0, ph: 7.19, tds: 330 },
  { timestamp: "2025-12-02 09:00", temperature: 28.1, ph: 7.22, tds: 335 },
  { timestamp: "2025-12-02 09:10", temperature: 28.3, ph: 7.2, tds: 340 },
  { timestamp: "2025-12-02 09:20", temperature: 28.2, ph: 7.25, tds: 338 },
  { timestamp: "2025-12-02 09:30", temperature: 28.4, ph: 7.23, tds: 342 },
];

// ----------------------
// Columns
// ----------------------
const sensorColumns: ColumnDef<SensorReading>[] = [
  { accessorKey: "timestamp", header: "Timestamp" },
  {
    accessorKey: "temperature",
    header: "Temp (°C)",
    cell: ({ row }) => <span>{row.original.temperature.toFixed(1)}</span>,
  },
  {
    accessorKey: "ph",
    header: "pH Level",
    cell: ({ row }) => <span>{row.original.ph.toFixed(2)}</span>,
  },
  {
    accessorKey: "tds",
    header: "TDS (ppm)",
    cell: ({ row }) => <span>{row.original.tds}</span>,
  },
];

// ----------------------
// Table Component
// ----------------------
export function SensorDataTable({
  columns,
  data,
}: {
  columns: ColumnDef<SensorReading>[];
  data: SensorReading[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filter, setFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="@container/card mt-5 bg-muted/40">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Sensor Readings</CardTitle>
          <CardDescription>Readings updated every 10 minutes</CardDescription>
        </div>

        <div className="flex gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectContent>
              {[5, 10, 20, 50].map((v) => (
                <SelectItem key={v} value={`${v}`}>
                  {v} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" && " ↑"}
                    {header.column.getIsSorted() === "desc" && " ↓"}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table
              .getRowModel()
              .rows.filter((row) =>
                JSON.stringify(row.original)
                  .toLowerCase()
                  .includes(filter.toLowerCase())
              )
              .map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SensorReadingsPage() {
  return <SensorDataTable columns={sensorColumns} data={sensorData} />;
}
