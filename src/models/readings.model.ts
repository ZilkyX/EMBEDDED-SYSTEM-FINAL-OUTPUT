
import mongoose, { Schema, models } from "mongoose";

const ReadingSchema = new Schema(
  {
    temperature: { type: Number, required: true },
    ph: { type: Number, required: true },
    tds: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor", "Critical"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Reading =
  models.Reading || mongoose.model("Reading", ReadingSchema);
