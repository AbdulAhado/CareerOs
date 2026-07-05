"use client"

import * as React from "react"
import {
  Briefcase,
  FileText,
  FileCheck2,
  PenTool,
  Code,
  MonitorPlay,
  Network,
  MessageSquare,
  Target,
  Bot,
  LayoutDashboard,
  Sparkles,
  LogOut,
  User,
} from "lucide-react"

import { Logo } from "@/components/logo"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"

const data = {
  navMain: [
    {
      title: "Core",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "AI Career Coach",
          url: "/coach",
          icon: Bot,
        },
      ],
    },
    {
      title: "Analyzers",
      items: [
        {
          title: "Resume Analyzer",
          url: "/resume-analyzer",
          icon: FileText,
        },
        {
          title: "ATS Analyzer",
          url: "/ats-analyzer",
          icon: FileCheck2,
        },
        {
          title: "GitHub Analyzer",
          url: "/github-analyzer",
          icon: Code,
        },
        {
          title: "Portfolio Analyzer",
          url: "/portfolio-analyzer",
          icon: MonitorPlay,
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          title: "Proposal Generator",
          url: "/proposal-generator",
          icon: Sparkles,
        },
        {
          title: "Resume Builder",
          url: "/resume-builder",
          icon: PenTool,
        },
        {
          title: "LinkedIn Optimizer",
          url: "/linkedin-optimizer",
          icon: Network,
        },
        {
          title: "Interview Coach",
          url: "/interview-coach",
          icon: MessageSquare,
        },
        {
          title: "Skill Gap Analyzer",
          url: "/skill-gap",
          icon: Target,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const user = session?.user

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Logo className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-lg tracking-tight">CareerOS</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<a href={item.url} />}>
                      <item.icon className="text-primary" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {/* @ts-ignore */}
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  render={<div />}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "Guest User"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email || "Not signed in"}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-border bg-popover p-2 shadow-md"
                side="bottom"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-red-500 focus:bg-red-500/10 focus:text-red-600 cursor-pointer rounded-lg p-3 transition-colors flex items-center font-medium"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
