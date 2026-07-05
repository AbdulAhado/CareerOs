"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Search, ArrowRight, BookOpen, AlertTriangle, RefreshCw } from "lucide-react"

export default function SkillGapAnalyzer() {
  const [targetRole, setTargetRole] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = () => {
    if (!targetRole) return
    setAnalyzing(true)
    
    // Simulate AI match analysis based on user's parsed resume/skills vs Target Role
    setTimeout(() => {
      setResult({
        overallMatch: 72,
        coreSkillsFound: ["React", "TypeScript", "Node.js", "Git"],
        coreSkillsMissing: ["GraphQL", "Docker", "AWS"],
        learningRoadmap: [
          {
            skill: "GraphQL",
            priority: "High",
            timeToLearn: "2 weeks",
            resources: ["Apollo Odyssey", "Official Docs"],
            reason: "Required by 85% of Senior Frontend roles"
          },
          {
            skill: "Docker",
            priority: "Medium",
            timeToLearn: "1 week",
            resources: ["Docker 101", "Frontend Deployment Guides"],
            reason: "Increasingly common for full-stack ownership"
          },
          {
            skill: "AWS",
            priority: "Medium",
            timeToLearn: "3 weeks",
            resources: ["AWS Cloud Practitioner", "Serverless Stack"],
            reason: "Preferred skill for 60% of target jobs"
          }
        ]
      })
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Skill Gap Analyzer
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Role</CardTitle>
              <CardDescription>Enter the job title you want to transition into.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input 
                  placeholder="e.g. Senior Frontend Engineer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button onClick={handleAnalyze} disabled={!targetRole || analyzing}>
                  {analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Role Readiness</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2 flex items-baseline gap-1">
                  <span className={result.overallMatch >= 80 ? "text-emerald-500" : result.overallMatch >= 60 ? "text-amber-500" : "text-rose-500"}>
                    {result.overallMatch}%
                  </span>
                </div>
                <Progress value={result.overallMatch} className="w-full h-3 mt-4" />
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Based on your current resume profile vs industry requirements for {targetRole}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <Target className="h-16 w-16 mb-4 opacity-20" />
              <p>Discover exactly which skills you need to learn to land your dream role. We analyze millions of job descriptions to find your gaps.</p>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Skill Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Skills You Have</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.coreSkillsFound.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center text-amber-500 gap-2">
                      <AlertTriangle className="h-4 w-4" /> Missing Core Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.coreSkillsMissing.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-xl font-bold tracking-tight mt-8 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Personalized Learning Roadmap
              </h3>
              
              <div className="space-y-4">
                {result.learningRoadmap.map((item: any, i: number) => (
                  <Card key={i} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.skill}</CardTitle>
                          <CardDescription className="mt-1">{item.reason}</CardDescription>
                        </div>
                        <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                          {item.priority} Priority
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-end mt-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Est. Time: <span className="text-muted-foreground">{item.timeToLearn}</span></p>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            {item.resources.map((res: string, j: number) => (
                              <span key={j} className="underline cursor-pointer hover:text-primary">{res}</span>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Find Courses <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
