"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Sample data including pH, temperature, and TDS
const chartData = [
  { date: "2024-04-01", ph: 7.2, temperature: 26.5, tds: 35 },
  { date: "2024-04-02", ph: 7.1, temperature: 27.0, tds: 36 },
  { date: "2024-04-03", ph: 7.3, temperature: 26.8, tds: 34 },
  { date: "2024-04-04", ph: 6.9, temperature: 27.2, tds: 37 },
  { date: "2024-04-05", ph: 7.0, temperature: 26.9, tds: 35 },
  { date: "2024-04-06", ph: 7.2, temperature: 27.1, tds: 36 },
  { date: "2024-04-07", ph: 7.1, temperature: 26.7, tds: 34 },
  { date: "2024-04-08", ph: 6.8, temperature: 27.3, tds: 37 },
  { date: "2024-04-09", ph: 7.0, temperature: 26.6, tds: 34 },
  { date: "2024-04-10", ph: 7.2, temperature: 27.0, tds: 36 },
];

const chartConfig = {
  ph: { label: "pH Level", color: "#3b82f6" }, // Blue
  temperature: { label: "Temperature (°C)", color: "#ef4444" }, // Red
  tds: { label: "TDS (ppm)", color: "#22c55e" }, // Green
} satisfies ChartConfig;

export function DashboardCharts() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;

    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="pt-0 bg-muted/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all border border-border/40 rounded-2xl">
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-6 px-6 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Water Parameters — Interactive
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            pH, Temperature, and TDS readings over time
          </CardDescription>
        </div>

        {/* Select Filter */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-xl sm:ml-auto sm:flex bg-background border-muted shadow-sm hover:bg-accent transition">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-border/40 shadow-md">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-4 pt-6 sm:px-8 sm:pt-8">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id="fillTDS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="rounded-xl border bg-popover px-3 py-2 shadow-md"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            {/* Lines */}
            <Area
              dataKey="ph"
              type="natural"
              fill="url(#fillPh)"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Area
              dataKey="temperature"
              type="natural"
              fill="url(#fillTemperature)"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Area
              dataKey="tds"
              type="natural"
              fill="url(#fillTDS)"
              stroke="#22c55e"
              strokeWidth={2}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
