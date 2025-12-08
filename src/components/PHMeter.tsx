"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Beaker } from "lucide-react";
import { motion } from "framer-motion";
import { useSensorData } from "@/hooks/useSensorData";
import { Badge } from "./ui/badge";

export default function PHHorizontalMeter({
  min = 0,
  max = 14,
}: {
  min?: number;
  max?: number;
}) {
  const { data, espOnline } = useSensorData();
  const value = espOnline ? data?.ph ?? 0 : 0; // show 0 if disconnected
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <Card className="bg-muted/40 shadow-xl rounded-2xl p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-center p-0 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          <Beaker
            className={`w-5 h-5 ${
              espOnline ? "text-blue-500" : "text-red-600"
            }`}
          />
          pH Level
        </CardTitle>
        {!espOnline && <Badge variant="destructive">ESP-01 Disconnected</Badge>}
      </CardHeader>

      <CardContent className="flex flex-col items-center w-full">
        <div className="text-3xl font-bold mb-4">{value}</div>

        <div className="relative w-full h-8 rounded-full overflow-hidden bg-gray-200 shadow-inner">
          {/* Gradient bar */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(to right, #ff4d4d 0%, #ffff66 35%, #66ff66 50%, #66ffff 75%, #b266ff 100%)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)",
            }}
          />

          {/* Needle glow */}
          <motion.div
            className="absolute top-0 h-8"
            style={{
              left: `calc(${percentage}% )`,
              transform: "translateX(-50%)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full blur-xl bg-black/20 pointer-events-none" />
            <svg width="16" height="16" viewBox="0 0 16 16">
              <polygon
                points="8,0 4,8 12,8"
                fill="#111"
                stroke="#000"
                strokeWidth="0.5"
              />
            </svg>
          </motion.div>
        </div>

        {/* Tick marks */}
        <div className="relative w-full mt-3 h-6">
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(
            (tick) => {
              const tickPercentage = ((tick - min) / (max - min)) * 100;
              return (
                <div
                  key={tick}
                  className="absolute top-0 w-0.5 h-3 rounded-full"
                  style={{
                    left: `calc(${tickPercentage}% - 1px)`,
                    backgroundColor: tick % 2 === 0 ? "#E5E7EB" : "#9CA3AF",
                  }}
                >
                  <span
                    className="absolute top-3 -translate-x-1/2 text-xs font-medium text-primary"
                    style={{ left: "50%" }}
                  >
                    {tick}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
}
