"use client";

import { useEffect, useState } from "react";

export interface SensorData {
  temperature: number;
  ph: number;
  tds: number;
}

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [espOnline, setEspOnline] = useState<boolean>(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    let lastMessageTime = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeout = 10000;
      if (now - lastMessageTime > timeout) {
        setEspOnline(false);
      }
    }, 2000);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      ws.send(JSON.stringify({ type: "identify", client: "dashboard" }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "sensor") {
          lastMessageTime = Date.now();
          setEspOnline(true);
        }

        if (msg.type === "sensor") {
          setData(msg.data);
        }
      } catch (err) {
        console.error("WS message error:", err);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  return { data, espOnline };
}
