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
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
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
          <CardDescription>Latest readings from the sensor</CardDescription>
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

// ----------------------
// Page Component with Live Fetch
// ----------------------
export default function SensorReadingsPage() {
  const [sensorData, setSensorData] = React.useState<SensorReading[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch readings on mount
  React.useEffect(() => {
    async function fetchReadings() {
      try {
        const res = await fetch("/api/readings");
        const data = await res.json();

        if (data.success) {
          setSensorData(
            data.data.map((r: any) => ({
              timestamp: new Date(r.createdAt).toLocaleString(),
              temperature: r.temperature,
              ph: r.ph,
              tds: r.tds,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch readings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReadings();
  }, []);

  if (loading) return <p>Loading sensor data...</p>;

  return <SensorDataTable columns={sensorColumns} data={sensorData} />;
}
