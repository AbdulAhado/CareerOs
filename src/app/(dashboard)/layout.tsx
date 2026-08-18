import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col min-h-screen relative w-full min-w-0 max-w-full overflow-x-hidden">
            <div className="absolute top-4 left-4 z-50 md:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </SessionProvider>
  );
}
