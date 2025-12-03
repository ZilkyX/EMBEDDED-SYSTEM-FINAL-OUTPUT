"use client";

import * as React from "react";
import { UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarFooterClientProps {
  fullName: string;
  email?: string;
}

export default function SidebarFooterClient({
  fullName,
  email,
}: SidebarFooterClientProps) {
  const { state } = useSidebar();

  return (
    <div
      className={`rounded-xl bg-muted/40 w-full flex items-center justify-between ${
        state === "collapsed" ? "p-0" : "p-2"
      }`}
    >
      {state === "collapsed" ? (
        <div className="w-full flex justify-center">
          <UserButton /> {/* Centered avatar when collapsed */}
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 overflow-hidden">
            <UserButton /> {/* Avatar + dropdown */}
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium truncate max-w-[120px]">
                {fullName}
              </span>
              {email && (
                <span className="text-muted-foreground text-xs truncate max-w-[120px]">
                  {email}
                </span>
              )}
            </div>
          </div>
          <ModeToggle />
        </div>
      )}
    </div>
  );
}
