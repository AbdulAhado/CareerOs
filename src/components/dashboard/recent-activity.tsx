import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Resume parsed successfully",
    description: "Your latest resume scored 82% against target roles.",
    time: "2 hours ago",
    icon: FileText,
    type: "success"
  },
  {
    id: 2,
    title: "New AI Recommendation",
    description: "Consider adding 'Next.js' to your skills section.",
    time: "5 hours ago",
    icon: Sparkles,
    type: "info"
  },
  {
    id: 3,
    title: "ATS match dropped",
    description: "Recent JD 'Senior Frontend' match is below 60%.",
    time: "1 day ago",
    icon: AlertCircle,
    type: "warning"
  },
  {
    id: 4,
    title: "LinkedIn Profile Optimized",
    description: "Headline updated for SEO.",
    time: "2 days ago",
    icon: CheckCircle2,
    type: "success"
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest career moves and AI insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-4 mt-0.5">
                <div className={`p-2 rounded-full flex items-center justify-center
                  ${activity.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                  ${activity.type === 'info' ? 'bg-primary/10 text-primary' : ''}
                  ${activity.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : ''}
                `}>
                  <activity.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
