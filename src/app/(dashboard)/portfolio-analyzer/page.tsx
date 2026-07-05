"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { MonitorPlay, Search, RefreshCw, Eye, Zap, Accessibility, Laptop } from "lucide-react"

export default function PortfolioAnalyzer() {
  const [url, setUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = () => {
    if (!url) return
    setAnalyzing(true)
    
    // Simulate Vision API parsing of portfolio
    setTimeout(() => {
      setResult({
        score: 74,
        metrics: {
          ux: 82,
          performance: 65,
          accessibility: 90,
          content: 70
        },
        feedback: [
          "Good use of whitespace and typography.",
          "High contrast ratios make text easy to read.",
          "Missing clear call-to-action (CTA) for recruiters.",
          "Hero section image is too large, impacting LCP (Largest Contentful Paint)."
        ],
        recommendations: [
          "Add a prominent 'Download Resume' button in the hero section.",
          "Optimize hero images to WebP to improve load times.",
          "Include a brief case study format for your projects instead of just links."
        ]
      })
      setAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MonitorPlay className="h-8 w-8 text-primary" />
          Portfolio Analyzer
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio URL</CardTitle>
              <CardDescription>Enter the link to your personal website.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input 
                  placeholder="https://yourportfolio.com" 
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button onClick={handleAnalyze} disabled={!url || analyzing}>
                  {analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2 flex items-baseline gap-1">
                  <span className={result.score >= 80 ? "text-emerald-500" : result.score >= 60 ? "text-amber-500" : "text-rose-500"}>
                    {result.score}
                  </span>
                  <span className="text-2xl text-muted-foreground">/ 100</span>
                </div>
                <Progress value={result.score} className="w-full h-3 mt-4" />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <MonitorPlay className="h-16 w-16 mb-4 opacity-20" />
              <p>We use AI Vision to analyze your portfolio's UX, accessibility, and content structure.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" /> UI/UX Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.metrics.ux}/100</div>
                    <Progress value={result.metrics.ux} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" /> Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.metrics.performance}/100</div>
                    <Progress value={result.metrics.performance} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Accessibility className="h-4 w-4 text-emerald-500" /> Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.metrics.accessibility}/100</div>
                    <Progress value={result.metrics.accessibility} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-blue-500" /> Content Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.metrics.content}/100</div>
                    <Progress value={result.metrics.content} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Vision Analysis & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Observations</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {result.feedback.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Recommended Fixes</h4>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm p-3 bg-muted/20 rounded-md border border-border/50">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
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
