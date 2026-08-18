"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Network, RefreshCw, Sparkles, Copy, Check, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react"

export default function LinkedInOptimizer() {
  const [targetRole, setTargetRole] = useState("")
  const [currentHeadline, setCurrentHeadline] = useState("")
  const [currentAbout, setCurrentAbout] = useState("")
  const [skills, setSkills] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleAnalyze = async () => {
    if (!targetRole.trim() && !currentHeadline.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/linkedin-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          currentHeadline,
          currentAbout,
          skills
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Optimization failed")
      }

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Network className="h-8 w-8 text-primary" />
            LinkedIn Profile Optimizer
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Boost recruiter search ranking and turn profile views into interview invitations.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Enter your current profile info or target role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Role *
                </label>
                <Input 
                  placeholder="e.g. Senior Full Stack Engineer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Current Headline
                </label>
                <Input 
                  placeholder="e.g. Software Engineer at Tech Corp" 
                  value={currentHeadline}
                  onChange={(e) => setCurrentHeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Current About Section
                </label>
                <Textarea 
                  placeholder="Paste your current LinkedIn About summary..." 
                  value={currentAbout}
                  onChange={(e) => setCurrentAbout(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Top Skills (comma-separated)
                </label>
                <Input 
                  placeholder="React, Node.js, AWS, TypeScript..." 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleAnalyze} 
                disabled={(!targetRole.trim() && !currentHeadline.trim()) || analyzing}
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Optimized Profile
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

          {result && typeof result.overallScore === "number" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-sm uppercase text-muted-foreground tracking-wider">
                  LinkedIn Optimization Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2 flex items-baseline gap-1">
                  <span className={result.overallScore >= 80 ? "text-emerald-500" : result.overallScore >= 60 ? "text-amber-500" : "text-rose-500"}>
                    {result.overallScore}
                  </span>
                  <span className="text-2xl text-muted-foreground">/ 100</span>
                </div>
                <Progress value={result.overallScore} className="w-full h-3 mt-3" />
                {result.summary && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    {result.summary}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {!result && !analyzing && (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <Network className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-1">Maximize Recruiter Reach</h3>
              <p className="max-w-md text-sm">
                Provide your target role and current LinkedIn content to generate high-converting headlines and a compelling About section.
              </p>
            </Card>
          )}

          {analyzing && (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-semibold mb-1">Crafting Profile Copy...</h3>
              <p className="text-sm text-muted-foreground">Optimizing for recruiter search keywords & personal branding impact.</p>
            </Card>
          )}

          {result && (
            <>
              {result.headlineSuggestions && result.headlineSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" /> High-Impact Headline Suggestions
                    </CardTitle>
                    <CardDescription>
                      Copy and paste into your LinkedIn profile header.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.headlineSuggestions.map((headline: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border gap-4">
                        <p className="text-sm font-medium">{headline}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shrink-0"
                          onClick={() => handleCopy(headline, i)}
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1.5 h-4 w-4" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {result.aboutSectionOptimized && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimized "About" Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.aboutFeedback && (
                      <div className="p-3.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-lg text-sm border border-amber-500/20">
                        <strong>AI Audit:</strong> {result.aboutFeedback}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Rewritten Section (Copy Ready)
                      </h4>
                      <Textarea 
                        readOnly 
                        value={result.aboutSectionOptimized} 
                        className="min-h-[140px] resize-none font-sans text-sm leading-relaxed" 
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(result.aboutSectionOptimized, 99)}>
                        {copiedIndex === 99 ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-emerald-500" /> Copied to Clipboard
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" /> Copy Entire About Section
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.skillsToAdd && result.skillsToAdd.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" /> Recommended Skills to Feature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.skillsToAdd.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-medium">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.actionItems && result.actionItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profile Action Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {result.actionItems.map((item: string, i: number) => (
                        <div key={i} className="flex gap-3 text-sm p-3 bg-muted/20 rounded-lg border border-border/50">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
