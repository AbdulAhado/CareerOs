"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { MonitorPlay, Search, RefreshCw, Eye, Zap, Accessibility, Laptop, AlertTriangle, Sparkles } from "lucide-react"

export default function PortfolioAnalyzer() {
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!url.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/portfolio-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, description })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Portfolio analysis failed")
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
            <MonitorPlay className="h-8 w-8 text-primary" />
            Portfolio UX & Design Analyzer
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            AI assessment of your developer website UI, UX hierarchy, performance, and accessibility.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Details</CardTitle>
              <CardDescription>Enter link and key highlights of your portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Portfolio Website URL *
                </label>
                <Input 
                  placeholder="https://yourportfolio.com" 
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Role / Focus (Optional)
                </label>
                <Input 
                  placeholder="e.g. Frontend Developer, UI Engineer" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleAnalyze} disabled={!url.trim() || analyzing}>
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Portfolio...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Website
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

          {result && typeof result.score === "number" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-sm uppercase text-muted-foreground tracking-wider">
                  Overall UX & Quality Score
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
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {!result && !analyzing && (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <MonitorPlay className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-1">Evaluate Your Personal Site</h3>
              <p className="max-w-md text-sm">
                Analyze visual design, readability, recruiters call-to-actions, and accessibility scores for your portfolio.
              </p>
            </Card>
          )}

          {analyzing && (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-semibold mb-1">Evaluating Portfolio UX...</h3>
              <p className="text-sm text-muted-foreground">Analyzing visual hierarchy, performance factors, and recruiter readability.</p>
            </Card>
          )}

          {result && (
            <>
              {result.metrics && (
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" /> UI/UX Design
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{result.metrics.ux ?? "--"}/100</div>
                      <Progress value={result.metrics.ux ?? 0} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" /> Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{result.metrics.performance ?? "--"}/100</div>
                      <Progress value={result.metrics.performance ?? 0} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Accessibility className="h-4 w-4 text-emerald-500" /> Accessibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{result.metrics.accessibility ?? "--"}/100</div>
                      <Progress value={result.metrics.accessibility ?? 0} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-blue-500" /> Content Quality
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{result.metrics.content ?? "--"}/100</div>
                      <Progress value={result.metrics.content ?? 0} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> AI UX Analysis & Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.feedback && result.feedback.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Design & UX Observations
                      </h4>
                      <ul className="space-y-2">
                        {result.feedback.map((item: string, i: number) => (
                          <li key={i} className="text-sm bg-muted/30 p-3 rounded-md border border-border/50">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Recommended Optimizations
                      </h4>
                      <div className="space-y-2.5">
                        {result.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="flex gap-3 text-sm p-3 bg-muted/20 rounded-md border border-border/50">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold mt-0.5">
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
