import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import SidebarFooterClient from "./SidebarFooterCllient";
import CalendarNotesWrapper from "./CalendarNotesWrapper";
import { fetchNotes } from "@/actions/note.action";

export default async function AppSidebar() {
  const user = await currentUser();
  const notes = await fetchNotes();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        logoSrc="https://tse4.mm.bing.net/th/id/OIP.Sr71cayIT98WV5c0McgggQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
        title="HydroSense"
      />
      <SidebarContent className="flex flex-col">
        <NavMain
          items={[
            { title: "Dashboard", url: "/dashboard", iconName: "Dashboard" },
            {
              title: "Real-time Monitoring",
              url: "/monitoring",
              iconName: "Real-time Monitoring",
            },
            { title: "Sensor Logs", url: "/logs", iconName: "Sensor Logs" },
            { title: "Maintenance", url: "/settings", iconName: "Maintenance" },
          ]}
        />

        <SidebarGroup>
          <SidebarGroupLabel>Calendar</SidebarGroupLabel>
          <CalendarNotesWrapper
            initialNotes={notes}
            userId={user?.id || ""}
            userName={user?.fullName || "Guest"}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <SidebarFooterClient
            fullName={user.fullName || "Guest"}
            email={user.emailAddresses?.[0]?.emailAddress}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
