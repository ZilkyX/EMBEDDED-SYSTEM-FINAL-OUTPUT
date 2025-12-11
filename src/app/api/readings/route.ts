import { NextRequest, NextResponse } from "next/server";
import { getAllReadings } from "@/actions/reading.action";

export async function GET(req: NextRequest) {
  const result = await getAllReadings();
  return NextResponse.json(result);
}
