"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Lightbulb, Wrench, Clock, Droplet, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Recommendation type
interface Recommendation {
  id: number;
  type: "Clean" | "Maintenance" | "WaterChange" | "FeedFish";
  dueDate: string;
  message: string;
}

const sampleRecommendations: Recommendation[] = [
  {
    id: 1,
    type: "Clean",
    dueDate: "2025-12-05",
    message: "Clean the sensor to ensure accurate readings.",
  },
  {
    id: 2,
    type: "Maintenance",
    dueDate: "2025-12-10",
    message: "Check wiring and calibration.",
  },
  {
    id: 3,
    type: "WaterChange",
    dueDate: "2025-12-06",
    message: "Change 20% of the water to keep the tank healthy.",
  },
  {
    id: 4,
    type: "FeedFish",
    dueDate: "2025-12-03",
    message: "Feed the fish according to their schedule.",
  },
];

export default function RecommendationsCard() {
  const router = useRouter();

  const handleRedirect = (type: Recommendation["type"]) => {
    // You can customize the routes for each recommendation type
    switch (type) {
      case "Clean":
      case "Maintenance":
        router.push("/settings"); // Maintenance page
        break;
      case "WaterChange":
      case "FeedFish":
        router.push("/dashboard"); // Or some other page
        break;
    }
  };

  return (
    <Card className="w-full rounded-2xl shadow-sm border border-border">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <CardTitle>Recommendations</CardTitle>
        </div>
        <CardDescription className="text-gray-500 text-sm">
          Suggestions for sensor care, water change, and fish feeding.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {sampleRecommendations.map((rec) => {
          let Icon;
          let iconColor = "text-gray-500";

          switch (rec.type) {
            case "Clean":
              Icon = Wrench;
              iconColor = "text-blue-500";
              break;
            case "Maintenance":
              Icon = Clock;
              iconColor = "text-green-500";
              break;
            case "WaterChange":
              Icon = Droplet;
              iconColor = "text-cyan-500";
              break;
            case "FeedFish":
              Icon = Fish;
              iconColor = "text-orange-500";
              break;
            default:
              Icon = Lightbulb;
          }

          return (
            <div
              key={rec.id}
              className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <div className="flex-1 text-sm text-muted-foreground">
                {rec.message}
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
