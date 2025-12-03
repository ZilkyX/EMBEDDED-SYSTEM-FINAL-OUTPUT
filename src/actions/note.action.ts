"use server";
import Note from "@/models/note.model";
import dbConnect from "@/lib/mongodb";

export async function fetchNotes() {
  await dbConnect(); 
  const notes = await Note.find({}).sort({ date: -1 }).lean();
  return notes.map((note) => ({
    ...note,
    _id: note._id.toString(),
    date: note.date.toString(),
  }));
}

export async function addNoteAction(
  userId: string,
  userName: string,
  description?: string
) {
  await dbConnect();
  const note = await Note.create({
    userId,
    userName,
    description,
    date: new Date(),
  });

  return note.toObject();
}

export async function deleteNoteAction(noteId: string) {
  await dbConnect();
  await Note.findByIdAndDelete(noteId);
  return { success: true };
}
