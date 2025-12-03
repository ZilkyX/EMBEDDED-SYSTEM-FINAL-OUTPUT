"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Droplet } from "lucide-react";
import { motion } from "framer-motion";

export default function TDSHorizontalMeter({
  value = 1900,
  min = 0,
  max = 2000,
}: {
  value?: number;
  min?: number;
  max?: number;
}) {
  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round(min + (i * (max - min)) / tickCount)
  );

  return (
    <Card className="bg-muted/40 border-none shadow-xl rounded-2xl p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-center p-0 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          <Droplet className="w-5 h-5 text-blue-400" />
          TDS Level
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center w-full">
        <div className="text-3xl font-bold mb-4">{value} ppm</div>

        <div className="relative w-full h-8 rounded-full overflow-hidden bg-gray-200 shadow-inner">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(to right, #10b981 0%, #facc15 25%, #f97316 50%, #ef4444 75%, #ef4444 100%)",
            }}
          />

          <motion.div
            className="absolute top-0 h-8 flex items-center justify-center"
            style={{
              left: `calc(${percentage}% )`,
              transform: "translateX(-50%)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <polygon points="8,0 4,8 12,8" fill="#111" />
            </svg>
          </motion.div>
        </div>

        <div className="relative w-full mt-2 h-4">
          {ticks.map((tick) => {
            const tickPercentage = ((tick - min) / (max - min)) * 100;
            return (
              <div
                key={tick}
                className="absolute top-0 w-0.5 h-3 rounded bg-primary"
                style={{ left: `calc(${tickPercentage}% - 1px)` }}
              >
                <span
                  className="absolute top-3 -translate-x-1/2 text-xs font-medium text-primary"
                  style={{ left: "50%" }}
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
