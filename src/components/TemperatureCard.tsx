"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import { motion } from "framer-motion";

export default function TemperatureVertical({
  value = 36,
  min = 0,
  max = 100,
}: {
  value?: number;
  min?: number;
  max?: number;
}) {
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
    <Card className="bg-muted/40 border-none shadow-xl rounded-2xl p-6 flex flex-col hover:shadow-2xl transition-shadow duration-300 h-full">
      <CardHeader className="text-center p-0 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-500" />
          Temperature
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center flex-1 p-0 w-full">
        {/* VALUE */}
        <div className="text-3xl font-bold mb-4">{value}°C</div>

        {/* GAUGE WRAPPER */}
        <div className="relative flex-1 w-24 items-end justify-center hidden [@media(min-width:1030px)]:flex">
          {/* Gauge content here */}

          {/* TICKS + Numbers */}
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

          {/* GAUGE BACKGROUND */}
          <div className="h-full w-6 rounded-full bg-muted relative overflow-hidden ml-8">
            {/* FILL with gradient */}
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
      </CardContent>
    </Card>
  );
}
