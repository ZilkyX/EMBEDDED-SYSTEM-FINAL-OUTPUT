import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Note = models.Note || model("Note", NoteSchema);
export default Note;
