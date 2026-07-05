import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileCheck2, Network, MessageSquare } from "lucide-react"

const actions = [
  {
    title: "Upload Resume",
    description: "Parse and analyze",
    icon: Upload,
    url: "/resume-analyzer"
  },
  {
    title: "Check ATS Match",
    description: "Compare with JD",
    icon: FileCheck2,
    url: "/ats-analyzer"
  },
  {
    title: "Optimize LinkedIn",
    description: "Boost your SEO",
    icon: Network,
    url: "/linkedin-optimizer"
  },
  {
    title: "Mock Interview",
    description: "Practice with AI",
    icon: MessageSquare,
    url: "/interview-coach"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump straight into your next career move.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 text-left hover:border-primary/50"
              render={<a href={action.url} />}
              // @ts-ignore - Base UI nativeButton prop
              nativeButton={false}
            >
              <action.icon className="h-5 w-5 text-primary" />
              <div className="space-y-1">
                <span className="block font-medium">{action.title}</span>
                <span className="block text-xs text-muted-foreground font-normal">{action.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
