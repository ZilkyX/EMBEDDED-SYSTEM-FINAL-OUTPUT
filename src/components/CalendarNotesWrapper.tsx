"use client";
import { Calendar } from "./ui/calendar";
import { NotesClient } from "./NotesClient";
import { useSidebar } from "@/components/ui/sidebar";

export default function CalendarNotesWrapper({
  initialNotes,
  userId,
  userName,
}: {
  initialNotes: any[];
  userId: string;
  userName: string;
}) {
  const { state } = useSidebar();

  if (state === "collapsed") return null;

  return (
    <div className="flex flex-col gap-2">
      <Calendar className="w-full" />
      <NotesClient
        initialNotes={initialNotes}
        userId={userId}
        userName={userName}
      />
    </div>
  );
}
