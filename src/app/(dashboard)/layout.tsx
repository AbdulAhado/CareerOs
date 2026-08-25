import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background text-foreground">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
              {/* Sticky Top Navbar */}
              <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 md:px-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="cursor-pointer hover:bg-accent/80 transition-colors" />
                  <div className="h-4 w-px bg-border/60 hidden sm:block" />
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                    <span className="text-foreground font-semibold">CareerOS</span>
                    <span>/</span>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 inline" /> AI Suite
                    </span>
                  </div>
                </div>

              </header>

              {/* Main Content Viewport */}
              <div className="flex-1 p-3 sm:p-4 md:p-5 w-full max-w-7xl mx-auto flex flex-col min-h-0">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </SessionProvider>
  );
}

