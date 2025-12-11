"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Cpu } from "lucide-react";
import { useSensorData } from "@/hooks/useSensorData";

export default function DashboardHeader() {
  const { espOnline, ws } = useSensorData();
  const [mode, setMode] = useState<"AUTO" | "SLEEP">("AUTO");

  const handleToggle = (checked: boolean) => {
    const newMode = checked ? "AUTO" : "SLEEP";
    setMode(newMode);

    // Send command to ESP via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "cmd", command: newMode }));
    }
  };

  return (
    <Card className="shadow-sm border bg-card p-3">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-gray-700" />
          <CardTitle className="text-xl sm:text-2xl font-semibold">
            Dashboard
          </CardTitle>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`text-sm font-medium ${
              mode === "AUTO" ? "text-green-600" : "text-gray-500"
            }`}
          >
            AUTO
          </span>

          <Switch
            checked={mode === "AUTO"}
            onCheckedChange={handleToggle}
            className="h-4 w-8"
          />

          <span
            className={`text-sm font-medium ${
              mode === "SLEEP" ? "text-red-600" : "text-gray-500"
            }`}
          >
            SLEEP
          </span>

          <span
            className={`ml-2 text-xs font-semibold ${
              espOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {espOnline ? "ESP Online" : "ESP Offline"}
          </span>
        </div>
      </CardHeader>
    </Card>
  );
}
