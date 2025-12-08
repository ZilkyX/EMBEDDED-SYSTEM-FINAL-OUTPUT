"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";
import { motion } from "framer-motion";
import { useSensorData } from "@/hooks/useSensorData";

interface TDSHorizontalMeterProps {
  min?: number;
  max?: number;
}

export default function TDSHorizontalMeter({
  min = 0,
  max = 2000,
}: TDSHorizontalMeterProps) {
  const { data, espOnline } = useSensorData();
  const value = espOnline ? data?.tds ?? 0 : 0;
  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round(min + (i * (max - min)) / tickCount)
  );

  return (
    <Card className="bg-muted/40 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center">
      <CardHeader className="flex flex-col items-center gap-2 p-0 mb-4">
        <div className="flex items-center gap-2">
          <Droplet
            className={`w-5 h-5 ${
              espOnline ? "text-blue-500" : "text-red-600"
            }`}
          />
          <CardTitle className="text-lg font-semibold">TDS Level</CardTitle>
        </div>
        <Badge
          variant={espOnline ? "default" : "destructive"}
          className={` ${espOnline ? "hidden" : ""}`}
        >
          {espOnline ? "" : "ESP-01 Disconnected"}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col items-center w-full gap-4">
        <div
          className={`text-3xl font-bold ${
            espOnline ? "text-foreground" : "text-red-600"
          }`}
        >
          {value} ppm
        </div>

        <div className="relative w-full h-4 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: espOnline
                ? "linear-gradient(to right, #10b981 0%, #facc15 25%, #f97316 50%, #ef4444 75%, #ef4444 100%)"
                : "linear-gradient(to right, #fca5a5 0%, #f87171 50%, #ef4444 100%)",
            }}
          />

          <motion.div
            className="absolute top-0 h-4 flex items-center justify-center"
            style={{
              left: `calc(${percentage}% )`,
              transform: "translateX(-50%)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <polygon
                points="8,0 4,8 12,8"
                fill={espOnline ? "#111" : "#b91c1c"}
              />
            </svg>
          </motion.div>
        </div>

        <div className="relative w-full h-6">
          {ticks.map((tick) => {
            const tickPercentage = ((tick - min) / (max - min)) * 100;
            return (
              <div
                key={tick}
                className={`absolute top-0 w-px h-3 ${
                  espOnline ? "bg-primary" : "bg-red-600"
                }`}
                style={{ left: `calc(${tickPercentage}% - 1px)` }}
              >
                <span
                  className="absolute top-3 -translate-x-1/2 text-xs font-medium"
                  style={{
                    left: "50%",
                    color: espOnline ? undefined : "#b91c1c",
                  }}
                >
                  {tick}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
