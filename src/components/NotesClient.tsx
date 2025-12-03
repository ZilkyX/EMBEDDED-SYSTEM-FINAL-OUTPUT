"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { addNoteAction, deleteNoteAction } from "@/actions/note.action";

interface Note {
  _id: string;
  description: string;
  date: string;
  userName: string;
}

interface NotesClientProps {
  initialNotes: Note[];
  userId: string;
  userName: string;
}

export function NotesClient({
  initialNotes,
  userId,
  userName,
}: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [modalOpen, setModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(false);

  const addNote = async () => {
    if (!newNote) return;

    const note = await addNoteAction(userId, newNote, userName);
    setNotes([
      { ...note, _id: note._id.toString(), date: note.date.toString() },
      ...notes,
    ]);
    setNewNote("");
    setModalOpen(false);
  };

  const deleteNote = async (id: string) => {
    await deleteNoteAction(id);
    setNotes(notes.filter((note) => note._id !== id));
  };

  const visibleNotes = showAll ? notes : notes.slice(0, 3);

  return (
    <div className="bg-muted p-4 rounded-2xl shadow-sm">
      <Button
        size="sm"
        className="flex items-center gap-1 mb-2"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="w-4 h-4" /> Add Note
      </Button>

      <div className="h-36 overflow-y-auto">
        <ul className="space-y-2">
          {visibleNotes.map((note) => (
            <li
              key={note._id}
              className="bg-muted p-3 rounded-xl flex flex-col gap-1 hover:bg-muted/80 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {note.userName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-red-50"
                  onClick={() => deleteNote(note._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {note.description}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(note.date).toLocaleDateString()}
              </span>
            </li>
          ))}
          {notes.length === 0 && (
            <li className="text-sm text-gray-500 dark:text-gray-400">
              No notes available
            </li>
          )}
        </ul>

        {notes.length > 3 && (
          <Button
            size="sm"
            variant="link"
            className="mt-2 text-blue-500 hover:underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "See More"}
          </Button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-muted p-5 rounded-2xl w-80 shadow-lg flex flex-col gap-3">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Add New Note
            </h4>
            <Input
              placeholder="Type your note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-muted"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={addNote}>
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
