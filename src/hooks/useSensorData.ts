"use client";

import { useEffect, useRef, useState } from "react";

export interface SensorData {
  temperature: number;
  ph: number;
  tds: number;
  waterPercent: number;
  waterStatus?: string;
}

export interface PinData {
  analog: Record<string, number>;
  digital: Record<string, "HIGH" | "LOW">;
}

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [pinData, setPinData] = useState<PinData | null>(null);

  const [espOnline, setEspOnline] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3001");
    let lastMessageTime = 0;

    // Auto-detect ESP disconnection
    const interval = setInterval(() => {
      const now = Date.now();
      const timeout = 10000; // 10 sec
      if (now - lastMessageTime > timeout) {
        setEspOnline(false);
      }
    }, 2000);

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket");
      wsRef.current?.send(
        JSON.stringify({ type: "identify", client: "dashboard" })
      );
    };

    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "sensor") {
          lastMessageTime = Date.now();
          setEspOnline(true);
          setData(msg.data);
        }

        if (msg.type === "pims") {
          lastMessageTime = Date.now();
          setEspOnline(true);
          setPinData(msg.data);
        }

        if (msg.type === "status") {
          setEspOnline(msg.espOnline);
        }
      } catch (err) {
        console.error("WS message error:", err);
      }
    };

    wsRef.current.onclose = () => console.log("WebSocket disconnected");

    return () => {
      clearInterval(interval);
      wsRef.current?.close();
    };
  }, []);

  // Function to send commands to ESP
  const sendCommand = (
    command:
      | "AUTO"
      | "SLEEP"
      | "PING"
      | "WATER_ON"
      | "WATER_OFF"
      | "REFILL_ON"
      | "REFILL_OFF"
  ) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "cmd", command }));
      console.log("Sent command:", command);
    }
  };

  return {
    data,
    pinData,
    espOnline,
    sendCommand,
    ws: wsRef.current,
  };
}
