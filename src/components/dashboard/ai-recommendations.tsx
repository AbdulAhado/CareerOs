import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const recommendations = [
  {
    id: 1,
    category: "Resume",
    title: "Quantify your achievements",
    description: "Adding metrics to your recent role can boost your score by ~15%.",
    action: "Edit Resume",
    actionUrl: "/resume-builder"
  },
  {
    id: 2,
    category: "Skills",
    title: "Learn TypeScript",
    description: "80% of target roles require this. It's your highest priority gap.",
    action: "View Roadmap",
    actionUrl: "/skill-gap"
  }
]

export function AIRecommendations() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Recommendations</CardTitle>
        </div>
        <CardDescription>Personalized insights based on your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="rounded-lg border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
              </div>
              <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between" 
                render={<a href={rec.actionUrl} />}
                // @ts-ignore - Base UI nativeButton prop
                nativeButton={false}
              >
                {rec.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
