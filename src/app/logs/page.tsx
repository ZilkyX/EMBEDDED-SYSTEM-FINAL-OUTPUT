"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

// ----------------------
// Types
// ----------------------
export type SensorReading = {
  id: string;
  timestamp: string;
  temperature: number;
  ph: number;
  tds: number;
  status: string;
};

// ----------------------
// Columns
// ----------------------
const columns: ColumnDef<SensorReading>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "timestamp", header: "Timestamp" },
  {
    accessorKey: "temperature",
    header: "Temperature (°C)",
    cell: ({ row }) => row.original.temperature.toFixed(1),
  },
  {
    accessorKey: "ph",
    header: "pH Level",
    cell: ({ row }) => row.original.ph.toFixed(2),
  },
  { accessorKey: "tds", header: "TDS (ppm)" },

  // ✅ STATUS COLUMN (COLORED)
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusColors = {
        Excellent: "text-green-600",
        Good: "text-blue-600",
        Fair: "text-yellow-600",
        Warning: "text-orange-600",
        Poor: "text-red-600",
      };

      const color = statusColors[status] || "text-gray-600";

      return <span className={`${color} font-semibold`}>{status}</span>;
    },
  },
];

export default function SensorLogsPage() {
  const [sensorLogs, setSensorLogs] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // ----------------------
  // Fetch live readings
  // ----------------------
  useEffect(() => {
    async function fetchReadings() {
      try {
        const res = await fetch("/api/readings");
        const data = await res.json();

        if (data.success) {
          setSensorLogs(
            data.data.map((r: any, index: number) => ({
              id: r._id || index.toString(),
              timestamp: new Date(r.createdAt).toLocaleString(),
              temperature: r.temperature,
              ph: r.ph,
              tds: r.tds,
              status: r.status, // ✅ include status
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

  const table = useReactTable({
    data: sensorLogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
  });

  // ----------------------
  // Export Excel
  // ----------------------
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sensorLogs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sensor Logs");
    XLSX.writeFile(wb, "sensor_logs.xlsx");
  };

  // ----------------------
  // Export PDF
  // ----------------------
  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = columns.map((col) =>
      typeof col.header === "string" ? col.header : ""
    );
    const body = sensorLogs.map((row) =>
      columns.map((col) => {
        if ("accessorKey" in col && col.accessorKey) {
          const key = col.accessorKey as keyof typeof row;
          return row[key] !== null && row[key] !== undefined
            ? String(row[key])
            : "";
        }
        return "";
      })
    );

    autoTable(doc, { head: [headers], body, startY: 20, theme: "grid" });
    doc.save("sensor_logs.pdf");
  };

  if (loading) return <p>Loading sensor data...</p>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Sensor Logs</h1>
        </div>
      </div>
      <Card className="@container/card mt-5 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Sensor Readings</CardTitle>
            <CardDescription>Latest readings from the sensor</CardDescription>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={exportExcel}>
              Export Excel
            </Button>
            <Button size="sm" variant="outline" onClick={exportPDF}>
              Export PDF
            </Button>
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
              {table.getRowModel().rows.map((row) => (
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
    </div>
  );
}
