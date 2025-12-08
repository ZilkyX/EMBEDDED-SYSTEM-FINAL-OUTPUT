import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Reading } from "@/models/readings.model";
import { computeWaterStatus } from "@/utils/waterStatus";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { temperature, ph, tds } = await req.json();

    if (
      temperature === undefined ||
      ph === undefined ||
      tds === undefined
    ) {
      return NextResponse.json(
        { error: "Missing temperature, ph, or tds" },
        { status: 400 }
      );
    }

    const status = computeWaterStatus(temperature, ph, tds);

    const reading = await Reading.create({
      temperature,
      ph,
      tds,
      status,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        ...reading.toObject(),
        _id: reading._id.toString(),
        createdAt: reading.createdAt.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error saving reading:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
