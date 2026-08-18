"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Target, Search, ArrowRight, BookOpen, AlertTriangle, RefreshCw,
  CheckCircle2, Sparkles, Loader2, X, Clock, TrendingUp, Zap
} from "lucide-react"

const EXPERIENCE_LEVELS = ["Entry Level (0–2 yrs)", "Mid-Level (2–5 yrs)", "Senior (5–8 yrs)", "Lead / Architect (8+ yrs)"]

export default function SkillGapAnalyzer() {
  const [targetRole, setTargetRole] = useState("")
  const [currentSkills, setCurrentSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level (2–5 yrs)")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const addSkill = (s: string) => {
    const t = s.trim()
    if (t && !currentSkills.includes(t)) setCurrentSkills(prev => [...prev, t])
    setSkillInput("")
  }
  const removeSkill = (s: string) => setCurrentSkills(prev => prev.filter(x => x !== s))

  const handleAnalyze = async () => {
    if (!targetRole.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          currentSkills: currentSkills.length > 0 ? currentSkills.join(", ") : undefined,
          experienceLevel
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Analysis failed")
      }

      const data = await res.json()
      setResult(data)

      const saved = JSON.parse(localStorage.getItem("careeros_stats") || "{}")
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "Skill gap analyzed",
        description: `Career readiness for ${targetRole}: ${data.overallMatch}%`,
        time: "Just now",
        type: data.overallMatch >= 70 ? "success" : "warning"
      })
      saved.recentActivities = activities.slice(0, 10)
      localStorage.setItem("careeros_stats", JSON.stringify(saved))
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Target className="h-7 w-7" />
            </div>
            Skill Gap & Career Roadmap
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Discover exactly which skills you need to land your target role — with a personalized AI learning roadmap.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          {/* Target Role */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Target Role</CardTitle>
              <CardDescription className="text-xs">What job title are you aiming for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="e.g. Senior Frontend Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="h-10"
              />
              <div className="flex flex-wrap gap-1.5">
                {["Senior Frontend Engineer", "Full-Stack Developer", "DevOps Engineer", "Data Scientist", "Product Manager"].map(r => (
                  <button
                    key={r}
                    onClick={() => setTargetRole(r)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${targetRole === r ? "bg-primary text-primary-foreground border-primary" : "border-border bg-muted/40 hover:border-primary/40"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Skills */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Your Current Skills</CardTitle>
              <CardDescription className="text-xs">Add skills you already have (optional but improves accuracy).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="min-h-[52px] flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-input bg-background focus-within:ring-1 focus-within:ring-ring cursor-text"
                onClick={() => document.getElementById("skill-input")?.focus()}
              >
                {currentSkills.map(s => (
                  <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    {s}
                    <button onClick={() => removeSkill(s)} className="hover:text-primary/60"><X className="h-2.5 w-2.5" /></button>
                  </span>
                ))}
                <input
                  id="skill-input"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => (e.key === "Enter" || e.key === ",") && skillInput.trim() && (e.preventDefault(), addSkill(skillInput))}
                  placeholder={currentSkills.length === 0 ? "Type a skill, press Enter..." : "Add more..."}
                  className="flex-1 min-w-[120px] bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience Level */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Experience Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EXPERIENCE_LEVELS.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`w-full text-left p-2.5 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${experienceLevel === lvl ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 hover:border-primary/40"}`}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 opacity-60" /> {lvl}
                </button>
              ))}
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium">
              {error}
            </div>
          )}

          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/25"
            onClick={handleAnalyze}
            disabled={!targetRole.trim() || analyzing}
          >
            {analyzing ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Skill Gap...</>
            ) : (
              <><Search className="mr-2 h-5 w-5" /> Analyze Skill Gap</>
            )}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {!result && !analyzing ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px] bg-muted/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-foreground mb-1">Discover Your Skill Gaps</h4>
              <p className="max-w-xs text-sm">Enter your target role and current skills to get a personalized AI learning roadmap with time estimates and curated resources.</p>
            </Card>
          ) : analyzing ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-sm">Analyzing market demand and your skill profile...</p>
            </Card>
          ) : result && (
            <>
              {/* Score + Summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-border/60 sm:col-span-1">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Role Readiness</span>
                    <div className={`text-5xl font-extrabold mt-1 ${result.overallMatch >= 75 ? "text-emerald-500" : result.overallMatch >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                      {result.overallMatch}%
                    </div>
                    <Progress value={result.overallMatch} className="w-full h-2 mt-3" />
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-primary/5 sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> AI Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-foreground/90 leading-relaxed">
                    {result.summary}
                  </CardContent>
                </Card>
              </div>

              {/* Skills comparison */}
              <div className="grid gap-4 md:grid-cols-2">
                {result.currentSkillsFound?.length > 0 && (
                  <Card className="border-border/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" /> Skills You Have
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.currentSkillsFound.map((s: string) => (
                          <Badge key={s} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs">{s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {result.missingCriticalSkills?.length > 0 && (
                  <Card className="border-border/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-500">
                        <AlertTriangle className="h-4 w-4" /> Critical Gaps to Fill
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.missingCriticalSkills.map((s: string) => (
                          <Badge key={s} variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-500/5 text-xs">+ {s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Learning Roadmap */}
              {result.learningRoadmap?.length > 0 && (
                <>
                  <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 pt-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Personalized Learning Roadmap
                  </h3>
                  <div className="space-y-4">
                    {result.learningRoadmap.map((item: any, i: number) => (
                      <Card key={i} className="border-l-4 border-l-primary border-border/60">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <CardTitle className="text-base font-bold">{item.skill}</CardTitle>
                              <CardDescription className="text-xs mt-0.5">{item.whyItMatters}</CardDescription>
                            </div>
                            <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"} className="shrink-0 text-xs">
                              {item.priority} Priority
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> Est. time: <strong className="text-foreground">{item.timeToLearn}</strong>
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.resources?.map((res: string, j: number) => (
                                  <span key={j} className="px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-xs text-muted-foreground font-medium">{res}</span>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs shrink-0">
                              Find Courses <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Quick Wins */}
              {result.quickWins?.length > 0 && (
                <Card className="border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" /> Quick Wins — Start This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.quickWins.map((w: string, i: number) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/40 text-sm">
                          <TrendingUp className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-foreground/90 font-medium">{w}</span>
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
