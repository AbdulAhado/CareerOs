"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Code, GitCommit, Star, GitPullRequest, Search, RefreshCw, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react"

export default function GitHubAnalyzer() {
  const [username, setUsername] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!username.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/github-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, targetRole })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to analyze GitHub profile")
      }

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Code className="h-8 w-8 text-primary" />
            GitHub Analyzer
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Get an AI code audit & recruiter impact assessment of your public repositories.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Search</CardTitle>
              <CardDescription>Enter GitHub username or profile link.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  GitHub Handle / URL *
                </label>
                <Input 
                  placeholder="e.g. torvalds or github.com/username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Role (Optional)
                </label>
                <Input 
                  placeholder="e.g. Senior Frontend Engineer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleAnalyze} disabled={!username.trim() || analyzing}>
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze GitHub
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive bg-destructive/10">
              <CardContent className="p-4 flex items-center gap-3 text-destructive text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                {error}
              </CardContent>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-sm uppercase text-muted-foreground tracking-wider">
                  Recruiter Impact Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2 flex items-baseline gap-1">
                  <span className={result.score >= 80 ? "text-emerald-500" : result.score >= 60 ? "text-amber-500" : "text-rose-500"}>
                    {result.score}
                  </span>
                  <span className="text-2xl text-muted-foreground">/ 100</span>
                </div>
                <Progress value={result.score} className="w-full h-3 mt-3" />
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Evaluated on commit frequency, project complexity, documentation quality, and production readiness.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {!result && !analyzing && (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <Code className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-1">Analyze Your Technical Footprint</h3>
              <p className="max-w-md text-sm">
                See how tech leads and engineering managers perceive your open-source work, repository structure, and code quality.
              </p>
            </Card>
          )}

          {analyzing && (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-semibold mb-1">Evaluating GitHub Profile...</h3>
              <p className="text-sm text-muted-foreground">Reading repositories, commit patterns, and code structure.</p>
            </Card>
          )}

          {result && (
            <>
              {result.stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Code className="h-5 w-5 text-primary mb-1" />
                      <div className="text-2xl font-bold">{result.stats.repos ?? "--"}</div>
                      <div className="text-xs text-muted-foreground">Repositories</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Star className="h-5 w-5 text-amber-500 mb-1" />
                      <div className="text-2xl font-bold">{result.stats.stars ?? "--"}</div>
                      <div className="text-xs text-muted-foreground">Stars Earned</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <GitCommit className="h-5 w-5 text-emerald-500 mb-1" />
                      <div className="text-2xl font-bold">{result.stats.commits ?? "--"}</div>
                      <div className="text-xs text-muted-foreground">Recent Commits</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <GitPullRequest className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-2xl font-bold">{result.stats.prs ?? "--"}</div>
                      <div className="text-xs text-muted-foreground">PRs & Contributions</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> AI Technical Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.topLanguages && result.topLanguages.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Primary Languages & Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.topLanguages.map((lang: string, i: number) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-medium">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {result.strengths && result.strengths.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Codebase Strengths
                        </h4>
                        <ul className="space-y-2">
                          {result.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-sm bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 p-2.5 rounded-md border border-emerald-500/20">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.weaknesses && result.weaknesses.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" /> Areas For Improvement
                        </h4>
                        <ul className="space-y-2">
                          {result.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="text-sm bg-amber-500/10 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 p-2.5 rounded-md border border-amber-500/20">
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Recommended Action Plan
                      </h4>
                      <div className="space-y-2.5">
                        {result.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="flex gap-3 text-sm p-3 bg-muted/30 rounded-lg border border-border/60">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {i + 1}
                            </span>
                            <p className="self-center">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
