"use client"

import { FileText, FileCheck2, Code, MonitorPlay, Sparkles, ArrowRight, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface UserStats {
  resumeScore: number | null
  atsScore: number | null
  githubScore: number | null
  portfolioScore: number | null
  recentActivities: Activity[]
}

interface Activity {
  id: number
  title: string
  description: string
  time: string
  type: "success" | "info" | "warning"
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats>({
    resumeScore: null,
    atsScore: null,
    githubScore: null,
    portfolioScore: null,
    recentActivities: []
  })

  // Load persisted stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("careeros_stats")
    if (saved) {
      try { setStats(JSON.parse(saved)) } catch {}
    }
  }, [])

  const scores = [
    { title: "Resume Score", score: stats.resumeScore, icon: FileText, href: "/resume-analyzer", cta: "Analyze Resume" },
    { title: "ATS Match", score: stats.atsScore, icon: FileCheck2, href: "/ats-analyzer", cta: "Check ATS" },
    { title: "GitHub Impact", score: stats.githubScore, icon: Code, href: "/github-analyzer", cta: "Scan GitHub" },
    { title: "Portfolio Score", score: stats.portfolioScore, icon: MonitorPlay, href: "/portfolio-analyzer", cta: "Scan Portfolio" },
  ]

  const quickActions = [
    { title: "Analyze Resume", description: "Upload & get AI feedback", href: "/resume-analyzer", icon: FileText },
    { title: "Generate Proposal", description: "Resume + JD → Proposal", href: "/proposal-generator", icon: Sparkles },
    { title: "Check ATS Match", description: "Compare resume vs JD", href: "/ats-analyzer", icon: FileCheck2 },
    { title: "Build Resume", description: "Professional templates", href: "/resume-builder", icon: FileText },
  ]

  const hasAnyData = scores.some(s => s.score !== null)

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Your career intelligence at a glance.</p>
        </div>
      </div>
      
      {/* Score Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {scores.map((item) => (
          <Card key={item.title} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {item.score !== null ? (
                <>
                  <div className="text-2xl font-bold">{item.score}%</div>
                  <Progress value={item.score} className="mt-3 h-1.5" />
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-lg text-muted-foreground font-medium">No data yet</div>
                  <a href={item.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      {item.cta} <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and AI insights.</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivities.length > 0 ? (
                <div className="space-y-6">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mr-4 mt-0.5">
                        <div className={cn(
                          "p-2 rounded-full flex items-center justify-center",
                          activity.type === "success" && "bg-emerald-500/10 text-emerald-500",
                          activity.type === "info" && "bg-primary/10 text-primary",
                          activity.type === "warning" && "bg-amber-500/10 text-amber-500"
                        )}>
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground ml-auto whitespace-nowrap">{activity.time}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No activity yet. Start by analyzing your resume or checking an ATS match.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* AI Recommendations */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Get Started</CardTitle>
              </div>
              <CardDescription>Use these tools to build your career profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border bg-background p-4 shadow-sm">
                  <Badge variant="secondary" className="text-xs mb-2">New Feature</Badge>
                  <h4 className="font-semibold text-sm mb-1">Proposal Generator</h4>
                  <p className="text-sm text-muted-foreground mb-3">Upload resume + paste JD to get a professional, concise proposal ready to send.</p>
                  <a href="/proposal-generator">
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Generate Proposal <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
                <div className="rounded-lg border bg-background p-4 shadow-sm">
                  <Badge variant="secondary" className="text-xs mb-2">Resume</Badge>
                  <h4 className="font-semibold text-sm mb-1">Build with Templates</h4>
                  <p className="text-sm text-muted-foreground mb-3">Choose from professional templates and customize with AI assistance.</p>
                  <a href="/resume-builder">
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Open Builder <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump straight into your next career move.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <a key={action.title} href={action.href} className="block">
                    <div className="h-full border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/20 transition-colors cursor-pointer">
                      <action.icon className="h-5 w-5 text-primary mb-2" />
                      <span className="block font-medium text-sm">{action.title}</span>
                      <span className="block text-xs text-muted-foreground mt-1">{action.description}</span>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
