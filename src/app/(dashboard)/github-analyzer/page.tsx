"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Code, GitCommit, Star, GitPullRequest, Search, RefreshCw } from "lucide-react"

export default function GitHubAnalyzer() {
  const [username, setUsername] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = () => {
    if (!username) return
    setAnalyzing(true)
    
    // Simulate AI match analysis of GitHub profile
    setTimeout(() => {
      setResult({
        score: 88,
        stats: {
          repos: 42,
          stars: 128,
          commits: 1045,
          prs: 56
        },
        topLanguages: ["TypeScript", "Rust", "Python"],
        strengths: ["Consistent commit history", "High code quality in top repos", "Good use of modern frameworks"],
        weaknesses: ["Lack of unit tests in recent projects", "Documentation could be more comprehensive"],
        recommendations: [
          "Add README.md files to your top 3 repositories detailing setup instructions.",
          "Write tests for the 'career-os' repository to show production readiness."
        ]
      })
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Code className="h-8 w-8 text-primary" />
          GitHub Analyzer
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Enter your GitHub username or repo URL.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input 
                  placeholder="e.g. torvalds" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button onClick={handleAnalyze} disabled={!username || analyzing}>
                  {analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Impact Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2 flex items-baseline gap-1">
                  <span className={result.score >= 80 ? "text-emerald-500" : "text-amber-500"}>
                    {result.score}
                  </span>
                  <span className="text-2xl text-muted-foreground">/ 100</span>
                </div>
                <Progress value={result.score} className="w-full h-3 mt-4" />
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Based on code complexity, consistency, and community impact.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <Code className="h-16 w-16 mb-4 opacity-20" />
              <p>Analyze your GitHub profile to see how recruiters and engineering managers view your code.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Code className="h-5 w-5 text-muted-foreground mb-2" />
                    <div className="text-2xl font-bold">{result.stats.repos}</div>
                    <div className="text-xs text-muted-foreground">Repositories</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Star className="h-5 w-5 text-amber-500 mb-2" />
                    <div className="text-2xl font-bold">{result.stats.stars}</div>
                    <div className="text-xs text-muted-foreground">Stars Earned</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <GitCommit className="h-5 w-5 text-emerald-500 mb-2" />
                    <div className="text-2xl font-bold">{result.stats.commits}</div>
                    <div className="text-xs text-muted-foreground">Commits (1y)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <GitPullRequest className="h-5 w-5 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{result.stats.prs}</div>
                    <div className="text-xs text-muted-foreground">PRs Opened</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Technical Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.topLanguages.map((lang: string) => (
                        <Badge key={lang} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-emerald-500 mb-2">Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {result.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-amber-500 mb-2">Areas for Growth</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {result.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-2">Action Items</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-bold">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
