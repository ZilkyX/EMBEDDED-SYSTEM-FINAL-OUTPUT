"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import { useSensorData } from "@/hooks/useSensorData";
import { Badge } from "./ui/badge";

export default function TemperatureVertical({
  min = 0,
  max = 100,
}: {
  min?: number;
  max?: number;
}) {
  const { data, espOnline } = useSensorData();
  const value = espOnline ? data?.temperature ?? 0 : 0;
  const percent = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100)
  );

  const tickCount = 10;
  const tickValues = Array.from({ length: tickCount + 1 }).map(
    (_, i) => min + (i * (max - min)) / tickCount
  );

  const formatTick = (n: number) =>
    Number.isInteger(n) ? `${n}` : `${n.toFixed(1)}`;

  const getTempColor = (temp: number) => {
    if (temp <= max * 0.33) return "#3b82f6";
    if (temp <= max * 0.66) return "#facc15";
    return "#ef4444";
  };

  return (
    <Card className="bg-muted/40 shadow-xl rounded-2xl p-6 flex flex-col hover:shadow-2xl transition-shadow duration-300 h-full">
      <CardHeader className="text-center p-0 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          <Thermometer
            className={`w-5 h-5 ${
              espOnline ? "text-blue-500" : "text-red-600"
            }`}
          />
          Temperature
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center flex-1 p-0 w-full">
        {!espOnline && (
          <Badge variant="destructive" className=" text-center justify-center">
            ESP-01 Disconnected
          </Badge>
        )}
        <div className="text-3xl font-bold mb-4">{value}°C</div>

        {/* Vertical thermometer for large screens */}
        <div className="relative flex-1 w-24 items-end justify-center hidden [@media(min-width:1030px)]:flex">
          {tickValues.map((tick, i) => {
            const bottomPercent = ((tick - min) / (max - min)) * 100;
            const tickColor = value >= tick ? getTempColor(tick) : "#d1d5db";
            return (
              <div
                key={i}
                className="absolute flex items-center gap-2"
                style={{
                  bottom: `${bottomPercent}%`,
                  transform: "translateY(50%)",
                }}
              >
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {formatTick(tick)}
                </span>
                <div className={`h-[2px] w-6 rounded ${tickColor}`} />
              </div>
            );
          })}
          <div className="h-full w-6 rounded-full bg-muted relative overflow-hidden ml-8">
            <svg className="absolute bottom-0 w-full h-full">
              <defs>
                <linearGradient id="thermoGradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <motion.rect
                x={0}
                y={0}
                width="100%"
                height="100%"
                rx={12}
                ry={12}
                fill="url(#thermoGradient)"
                style={{ originY: 1 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: percent / 100 }}
                transition={{ duration: 0.9 }}
              />
            </svg>
          </div>
        </div>

        {/* Circular thermometer for mobile */}
        <div className="block [@media(min-width:1030px)]:hidden relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              className="text-gray-200"
              strokeWidth="4"
              fill="none"
              stroke="currentColor"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-blue-500"
              strokeWidth="4"
              fill="none"
              stroke="url(#circleGradient)"
              strokeLinecap="round"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percent / 100 }}
              transition={{ duration: 0.9 }}
            />
            <defs>
              <linearGradient
                id="circleGradient"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {value}°C
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
