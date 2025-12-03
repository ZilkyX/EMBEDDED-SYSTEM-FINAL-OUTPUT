"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Droplet, Repeat, Fish, Cpu } from "lucide-react";

export default function MaintenancePage() {
  const [mode, setMode] = useState<"automatic" | "manual">("manual");
  const [waterPumpOn, setWaterPumpOn] = useState(false);
  const [fishFeederOn, setFishFeederOn] = useState(false);
  const [pneumaticPumpOn, setPneumaticPumpOn] = useState(false);

  const isAutomatic = mode === "automatic";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Maintenance Panel</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {isAutomatic
              ? "System is in automatic mode. Manual controls are disabled."
              : "System is in manual mode. You can control all components."}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Cpu className="w-5 h-5 text-gray-600" />
          <span className="font-semibold">Mode:</span>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm sm:text-base"
            value={mode}
            onChange={(e) => setMode(e.target.value as "automatic" | "manual")}
          >
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>
      </div>

      {/* Grid layout for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Water Pump Card */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex items-center gap-3">
            <Droplet className="w-6 h-6 text-blue-500" />
            <div>
              <CardTitle className="text-sm sm:text-base">
                Water Pump - Draining
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Toggle the pump to drain water from the tank.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 mt-2">
            <Switch
              checked={waterPumpOn}
              onCheckedChange={() => setWaterPumpOn(!waterPumpOn)}
              disabled={isAutomatic}
            />
            <span
              className={`font-semibold ${
                waterPumpOn ? "text-green-600" : "text-red-600"
              }`}
            >
              {waterPumpOn ? "ON" : "OFF"}
            </span>
          </CardContent>
        </Card>

        {/* Fish Feeder Card */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex items-center gap-3">
            <Fish className="w-6 h-6 text-orange-500" />
            <div>
              <CardTitle className="text-sm sm:text-base">
                Fish Feeder
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Activate the feeder to dispense fish food.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="mt-2">
            <Button
              size="sm"
              variant={fishFeederOn ? "destructive" : "default"}
              onClick={() => setFishFeederOn(!fishFeederOn)}
              className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
              disabled={isAutomatic}
            >
              {fishFeederOn ? "Feeding..." : "Feed Now"}
            </Button>
          </CardContent>
        </Card>

        {/* Pneumatic Pump Card */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex items-center gap-3">
            <Repeat className="w-6 h-6 text-purple-500" />
            <div>
              <CardTitle className="text-sm sm:text-base">
                Pneumatic Pump - Refilling
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Toggle the pump to refill water.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 mt-2">
            <Switch
              checked={pneumaticPumpOn}
              onCheckedChange={() => setPneumaticPumpOn(!pneumaticPumpOn)}
              disabled={isAutomatic}
            />
            <span
              className={`font-semibold ${
                pneumaticPumpOn ? "text-green-600" : "text-red-600"
              }`}
            >
              {pneumaticPumpOn ? "ON" : "OFF"}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
