import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ScoreCardProps {
  title: string
  score: number
  trend: number
  icon: React.ElementType
  className?: string
}

export function ScoreCard({ title, score, trend, icon: Icon, className }: ScoreCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}%</div>
        <div className="flex items-center space-x-2 mt-1">
          <p className={cn("text-xs font-medium", trend > 0 ? "text-emerald-500" : "text-destructive")}>
            {trend > 0 ? "+" : ""}{trend}%
          </p>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
        <Progress value={score} className="mt-3 h-1.5" />
      </CardContent>
    </Card>
  )
}
