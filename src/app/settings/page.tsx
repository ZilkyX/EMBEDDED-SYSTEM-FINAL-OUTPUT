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
import { Droplet, Repeat, Cpu } from "lucide-react";
import { useSensorData } from "@/hooks/useSensorData";

type PingState = "idle" | "loading" | "success";

export default function MaintenancePage() {
  const [mode, setMode] = useState<"automatic" | "manual">("manual");
  const [waterPumpOn, setWaterPumpOn] = useState(false);
  const [pneumaticPumpOn, setPneumaticPumpOn] = useState(false);
  const [pingStatus, setPingStatus] = useState<PingState>("idle");

  const { ws, espOnline, pinData } = useSensorData();

  const isAutomatic = mode === "automatic";

  // Ping Arduino
  const handlePing = () => {
    if (!ws) return;

    if (pingStatus === "idle") {
      setPingStatus("loading");
      ws.send(JSON.stringify({ type: "cmd", command: "PING" }));

      setTimeout(() => {
        setPingStatus("success");
      }, 1500);
    } else {
      setPingStatus("idle");
    }
  };

  // Water Pump toggle
  const toggleWaterPump = () => {
    if (!ws) return;
    const newState = !waterPumpOn;
    setWaterPumpOn(newState);

    ws.send(
      JSON.stringify({
        type: "cmd",
        command: newState ? "WATER_ON" : "WATER_OFF",
      })
    );
  };

  // Pneumatic Pump toggle
  const togglePneumaticPump = () => {
    if (!ws) return;

    const newState = !pneumaticPumpOn;
    setPneumaticPumpOn(newState);

    ws.send(
      JSON.stringify({
        type: "cmd",
        command: newState ? "REFILL_ON" : "REFILL_OFF",
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Maintenance Panel</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {isAutomatic
              ? "System is in automatic mode. Manual controls disabled."
              : "System is in manual mode. You may control components."}
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Maintenance - Ping Arduino */}
        <Card className="shadow-md border bg-card">
          <CardHeader className="flex items-center gap-3">
            <Cpu className="w-7 h-7 text-orange-500" />
            <div>
              <CardTitle className="text-base sm:text-lg">
                Maintenance – Ping Arduino Pins
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Test analog & digital pin responses.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 mt-2">
            <Button
              onClick={handlePing}
              className="px-6 py-2 rounded-lg shadow-sm"
            >
              {pingStatus === "idle" && "Ping Arduino Pins"}
              {pingStatus === "loading" && "Pinging..."}
              {pingStatus === "success" && "Hide Results"}
            </Button>

            <div className="w-full bg-muted/40 rounded-xl p-4 border">
              {pingStatus === "idle" && (
                <p className="text-gray-600 text-sm text-center">
                  Awaiting action...
                </p>
              )}

              {pingStatus === "loading" && (
                <p className="text-blue-600 font-semibold text-sm text-center animate-pulse">
                  Pinging pins...
                </p>
              )}

              {pingStatus === "success" && (
                <>
                  {/* ANALOG PINS */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">
                      🟢 Analog Pins
                    </h3>

                    {!pinData?.analog && (
                      <p className="text-gray-500 text-center text-sm">
                        No analog data received yet.
                      </p>
                    )}

                    {pinData?.analog && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {Object.entries(pinData.analog).map(([pin, value]) => (
                          <div
                            key={pin}
                            className="bg-muted/70 text-xs rounded-lg shadow-sm p-2 text-center border"
                          >
                            <p className="font-semibold text-gray-700">{pin}</p>
                            <p className="text-blue-600 font-bold">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DIGITAL PINS */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">
                      🔵 Digital Pins
                    </h3>

                    {!pinData?.digital && (
                      <p className="text-gray-500 text-center text-sm">
                        No digital data received yet.
                      </p>
                    )}

                    {pinData?.digital && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {Object.entries(pinData.digital).map(([pin, state]) => (
                          <div
                            key={pin}
                            className="bg-muted/70 text-xs rounded-lg shadow-sm p-2 text-center border"
                          >
                            <p className="font-semibold text-gray-700">{pin}</p>
                            <p
                              className={`font-bold ${
                                state === "HIGH"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {state}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Pumps */}
        <div className="space-y-4">
          {/* Water Pump */}
          <Card className="shadow-md border bg-card">
            <CardHeader className="flex items-center gap-3">
              <Droplet className="w-6 h-6 text-blue-500" />
              <div>
                <CardTitle className="text-sm sm:text-base">
                  Water Pump - Draining
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Toggle the pump to drain water.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 mt-2">
              <Switch checked={waterPumpOn} onCheckedChange={toggleWaterPump} />
              <span
                className={`font-semibold ${
                  waterPumpOn ? "text-green-600" : "text-red-600"
                }`}
              >
                {waterPumpOn ? "ON" : "OFF"}
              </span>
            </CardContent>
          </Card>

          {/* Pneumatic Pump */}
          <Card className="shadow-md border bg-card">
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
                onCheckedChange={togglePneumaticPump}
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
    </div>
  );
}
