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

import { Button } from "@/components/ui/button";

// Chart configuration
const chartConfig = {
  ph: { label: "pH Level", color: "#3b82f6" },
  temperature: { label: "Temperature (°C)", color: "#ef4444" },
  tds: { label: "TDS (ppm)", color: "#22c55e" },
} satisfies ChartConfig;

export function DashboardCharts() {
  const [interval, setInterval] = React.useState("24h");
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // NEW: toggle states
  const [showPH, setShowPH] = React.useState(true);
  const [showTemp, setShowTemp] = React.useState(true);
  const [showTDS, setShowTDS] = React.useState(true);

  // ⭐ FETCH DATA FROM API
  React.useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await fetch("/api/readings");
        const json = await res.json();

        if (json.success) {
          const formatted = json.data.map((item: any) => ({
            date: new Date(item.createdAt),
            ph: item.ph,
            temperature: item.temperature,
            tds: item.tds,
          }));

          setChartData(formatted.reverse());
        }
      } catch (error) {
        console.error("Error loading readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  // ⭐ INTERVAL FILTERING (1 hour, 24 hours, 1 week)
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const now = new Date();
    let msRange = 24 * 60 * 60 * 1000; // default: 24 hours

    if (interval === "1h") msRange = 1 * 60 * 60 * 1000;
    if (interval === "24h") msRange = 24 * 60 * 60 * 1000;
    if (interval === "1w") msRange = 7 * 24 * 60 * 60 * 1000;

    return chartData.filter((item) => {
      return now.getTime() - new Date(item.date).getTime() <= msRange;
    });
  }, [chartData, interval]);

  // ⭐ LAST UPDATE
  const lastUpdate =
    filteredData.length > 0
      ? new Date(filteredData[filteredData.length - 1].date).toLocaleString()
      : "No data";

  if (loading) {
    return <Card className="p-6 text-center">Loading chart data...</Card>;
  }

  return (
    <Card className="pt-0 bg-muted/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all border border-border/40 rounded-2xl">
      <CardHeader className="flex items-center gap-4 space-y-0 border-b py-6 px-6 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Water Parameters
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            pH, Temperature, and TDS readings from database
          </CardDescription>
        </div>

        {/* Interval Selector */}
        <Select value={interval} onValueChange={setInterval}>
          <SelectTrigger className="hidden w-[160px] rounded-xl sm:ml-auto sm:flex bg-background border-muted shadow-sm hover:bg-accent transition">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>

          <SelectContent className="rounded-xl border border-border/40 shadow-md">
            <SelectItem value="1h">Last 1 Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="1w">Last 1 Week</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Toggle Buttons */}
      <div className="flex gap-2 px-6 pt-4">
        <Button
          variant={showPH ? "default" : "outline"}
          className="rounded-lg"
          onClick={() => setShowPH(!showPH)}
        >
          pH
        </Button>

        <Button
          variant={showTemp ? "default" : "outline"}
          className="rounded-lg"
          onClick={() => setShowTemp(!showTemp)}
        >
          Temperature
        </Button>

        <Button
          variant={showTDS ? "default" : "outline"}
          className="rounded-lg"
          onClick={() => setShowTDS(!showTDS)}
        >
          TDS
        </Button>
      </div>

      <CardContent className="px-4 pt-6 sm:px-8 sm:pt-8">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="phFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>

              <linearGradient id="tdsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

            {/* X-Axis with date + time */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveStartEnd"
              tickFormatter={(value) =>
                new Date(value).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="rounded-xl border bg-popover px-3 py-2 shadow-md" />
              }
            />

            {/* Conditional Rendering for Toggles */}
            {showPH && (
              <Area
                dataKey="ph"
                type="natural"
                fill="url(#phFill)"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            )}

            {showTemp && (
              <Area
                dataKey="temperature"
                type="natural"
                fill="url(#tempFill)"
                stroke="#ef4444"
                strokeWidth={2}
              />
            )}

            {showTDS && (
              <Area
                dataKey="tds"
                type="natural"
                fill="url(#tdsFill)"
                stroke="#22c55e"
                strokeWidth={2}
              />
            )}

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        {/* Last Update */}
        <div className="mt-4 text-right text-muted-foreground text-sm">
          Last Update: <span className="font-medium">{lastUpdate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
