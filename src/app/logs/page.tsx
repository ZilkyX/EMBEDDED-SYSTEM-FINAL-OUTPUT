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
import { useState } from "react";

// ----------------------
// Dummy Sensor Logs
// ----------------------
const sensorLogs = [
  {
    id: 1,
    timestamp: "2025-12-02 08:00",
    temperature: 27.4,
    ph: 7.12,
    tds: 320,
  },
  {
    id: 2,
    timestamp: "2025-12-02 08:10",
    temperature: 27.6,
    ph: 7.1,
    tds: 322,
  },
  {
    id: 3,
    timestamp: "2025-12-02 08:20",
    temperature: 27.5,
    ph: 7.15,
    tds: 319,
  },
  {
    id: 4,
    timestamp: "2025-12-02 08:30",
    temperature: 27.7,
    ph: 7.18,
    tds: 325,
  },
  {
    id: 5,
    timestamp: "2025-12-02 08:40",
    temperature: 27.9,
    ph: 7.11,
    tds: 318,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
  {
    id: 6,
    timestamp: "2025-12-02 08:50",
    temperature: 28.0,
    ph: 7.19,
    tds: 330,
  },
];

// ----------------------
// Columns
// ----------------------
const columns: ColumnDef<(typeof sensorLogs)[number]>[] = [
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
];

export default function SensorLogsPage() {
  const [filter, setFilter] = useState("");

  const table = useReactTable({
    data: sensorLogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: filter,
    },
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
          const value = row[key];
          return value !== undefined && value !== null ? String(value) : "";
        }
        return "";
      })
    );

    autoTable(doc, { head: [headers], body, startY: 20, theme: "grid" });
    doc.save("sensor_logs.pdf");
  };

  return (
    <div className="p-6">
      <Card className="@container/card mt-5 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Sensor Readings</CardTitle>
            <CardDescription>Readings updated every 10 minutes</CardDescription>
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
