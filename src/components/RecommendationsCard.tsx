"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Clock, Droplet, Lightbulb, Thermometer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSensorData } from "@/hooks/useSensorData";
import { computeWaterStatus } from "@/utils/waterStatus";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Recommendation {
  id: number;
  type: "Maintenance" | "WaterChange";
  dueDate: string;
  message: string;
}

const sampleRecommendations: Recommendation[] = [
  {
    id: 2,
    type: "Maintenance",
    dueDate: "2025-12-10",
    message: "Check pins of the arduino.",
  },
  {
    id: 3,
    type: "WaterChange",
    dueDate: "2025-12-06",
    message: "Change 20% of the water to keep the tank healthy.",
  },
  {
    id: 4,
    type: "Maintenance",
    dueDate: "2025-12-12",
    message: "Clean water pump filter to improve circulation.",
  },
];

const statusScoreMap: Record<string, { score: number; color: string }> = {
  Excellent: { score: 100, color: "#22c55e" },
  Good: { score: 80, color: "#4ade80" },
  Fair: { score: 60, color: "#facc15" },
  Poor: { score: 40, color: "#f97316" },
  Critical: { score: 20, color: "#dc2626" },
  Unknown: { score: 0, color: "#9ca3af" },
};

const recommendedLevels = {
  temp: "24°C - 30°C",
  ph: "6.5 - 8",
  tds: "100 - 300 ppm",
};

export default function RecommendationsCard() {
  const router = useRouter();
  const { data, espOnline } = useSensorData();

  const handleRedirect = (type: Recommendation["type"]) => {
    switch (type) {
      case "Maintenance":
        router.push("/settings");
        break;
      case "WaterChange":
        router.push("/dashboard");
        break;
    }
  };

  const waterStatus = data
    ? computeWaterStatus(data.temperature, data.ph, data.tds)
    : "Unknown";

  const { score, color } =
    statusScoreMap[waterStatus] || statusScoreMap["Unknown"];

  return (
    <Card className="w-full rounded-2xl shadow-lg border border-border">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                espOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm font-medium">
              {espOnline ? "ESP-01 Connected" : "ESP-01 Disconnected"}
            </span>
          </div>
        </div>

        <CardDescription className="text-gray-500 text-sm">
          Suggestions for sensor maintenance and water changes.
        </CardDescription>

        {data && (
          <div className="flex items-center gap-6 mt-4">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={score}
                text={` ${waterStatus}`}
                styles={buildStyles({
                  textSize: "0.8rem",
                  pathColor: color,
                  textColor: color,
                  trailColor: "#e5e7eb",
                })}
              />
            </div>

            {/* Recommended sensor levels */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-500" />
                <span className="text-sm">
                  Temp: {data.temperature}°C (Recommended:{" "}
                  {recommendedLevels.temp})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                <span className="text-sm">
                  pH: {data.ph} (Recommended: {recommendedLevels.ph})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">
                  TDS: {data.tds} ppm (Recommended: {recommendedLevels.tds})
                </span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 mt-2">
        {sampleRecommendations.map((rec) => {
          const Icon = rec.type === "Maintenance" ? Clock : Droplet;
          const iconColor =
            rec.type === "Maintenance" ? "text-green-500" : "text-cyan-500";

          return (
            <div
              key={rec.id}
              className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <div className="flex-1 text-sm text-muted-foreground flex flex-col">
                <span>{rec.message}</span>

                {rec.type === "WaterChange" && (
                  <span className="mt-1 text-xs font-medium" style={{ color }}>
                    Water Level : {data?.waterPercent}%
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRedirect(rec.type)}
              >
                Go
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
