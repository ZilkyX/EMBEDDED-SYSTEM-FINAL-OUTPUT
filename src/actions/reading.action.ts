"use server";

import { computeWaterStatus } from "@/utils/waterStatus";
import dbConnect from "@/lib/mongodb";
import { Reading } from "@/models/readings.model";

export async function saveReading({
  temperature,
  ph,
  tds,
}: {
  temperature: number;
  ph: number;
  tds: number;
}) {
  try {
    await dbConnect();

    const status = computeWaterStatus(temperature, ph, tds);

    const reading = await Reading.create({
      temperature,
      ph,
      tds,
      status,
    });

    return {
      success: true,
      message: "Reading saved successfully",
      data: reading,
    };
  } catch (err: any) {
    console.error("Error saving reading:", err);
    return {
      success: false,
      message: "Error saving reading",
      error: err.message,
    };
  }
}
