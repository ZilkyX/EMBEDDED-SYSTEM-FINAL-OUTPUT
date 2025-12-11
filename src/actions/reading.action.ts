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

export async function getAllReadings() {
  try {
    await dbConnect();

    // Fetch all readings, sorted by creation date descending
    const readings = await Reading.find({}).sort({ createdAt: -1 });

    return {
      success: true,
      data: readings,
      message: "All readings fetched successfully",
    };
  } catch (err: any) {
    console.error("Error fetching readings:", err);
    return {
      success: false,
      message: "Error fetching readings",
      error: err.message,
    };
  }
}
