"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  X,
  Clock,
  Zap,
  Check,
  Copy,
  ExternalLink,
  Layers,
  GraduationCap,
  ShieldCheck,
  RotateCcw,
  CheckSquare,
  Square,
  Compass,
  Code2,
  Lightbulb
} from "lucide-react"

const EXPERIENCE_LEVELS = [
  { id: "Entry Level (0–2 yrs)", label: "Entry Level", sub: "0–2 yrs" },
  { id: "Mid-Level (2–5 yrs)", label: "Mid-Level", sub: "2–5 yrs" },
  { id: "Senior (5–8 yrs)", label: "Senior", sub: "5–8 yrs" },
  { id: "Lead / Architect (8+ yrs)", label: "Lead / Staff", sub: "8+ yrs" }
]

const POPULAR_ROLES = [
  "Senior Frontend Engineer",
  "Full-Stack Developer",
  "Backend Engineer (Node/Python)",
  "AI & ML Systems Engineer",
  "DevOps / Cloud Architect",
  "Product Manager"
]

const QUICK_SKILL_SUGGESTIONS = [
  "React", "TypeScript", "Next.js", "Node.js", "Python", "Docker", "AWS", "PostgreSQL", "TailwindCSS", "Git", "GraphQL", "Kubernetes"
]

const SAMPLE_PROFILE = {
  role: "Full-Stack Developer",
  skills: ["React", "Next.js", "Node.js", "TailwindCSS", "Git"],
  level: "Mid-Level (2–5 yrs)"
}

export default function SkillGapAnalyzer() {
  const [targetRole, setTargetRole] = useState("")
  const [currentSkills, setCurrentSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level (2–5 yrs)")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedRoadmap, setCopiedRoadmap] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})
  const [activeTab, setActiveTab] = useState<"roadmap" | "skills" | "quickwins">("roadmap")

  const addSkill = (s: string) => {
    const t = s.trim()
    if (t && !currentSkills.includes(t)) {
      setCurrentSkills(prev => [...prev, t])
    }
    setSkillInput("")
  }

  const removeSkill = (s: string) => {
    setCurrentSkills(prev => prev.filter(x => x !== s))
  }

  const handleLoadSample = () => {
    setTargetRole(SAMPLE_PROFILE.role)
    setCurrentSkills(SAMPLE_PROFILE.skills)
    setExperienceLevel(SAMPLE_PROFILE.level)
    setError("")
  }

  const handleReset = () => {
    setTargetRole("")
    setCurrentSkills([])
    setSkillInput("")
    setResult(null)
    setError("")
    setCompletedSteps({})
  }

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const completedCount = Object.values(completedSteps).filter(Boolean).length
  const totalRoadmapSteps = result?.learningRoadmap?.length || 0
  const progressPercent = totalRoadmapSteps > 0 ? Math.round((completedCount / totalRoadmapSteps) * 100) : 0

  const handleCopyRoadmap = () => {
    if (!result) return
    const text = `🎯 SKILL GAP ROADMAP FOR: ${targetRole}\nTarget Readiness: ${result.overallMatch}%\n\n` +
      `📌 MISSING CRITICAL SKILLS:\n${result.missingCriticalSkills?.join(", ") || "None"}\n\n` +
      `📚 STEP-BY-STEP LEARNING ROADMAP:\n` +
      (result.learningRoadmap?.map((item: any, i: number) => 
        `Step ${i + 1}: ${item.skill} [${item.priority} Priority] (Est: ${item.timeToLearn})\n` +
        `• Why: ${item.whyItMatters}\n` +
        (item.practicalProject ? `• Project: ${item.practicalProject}\n` : "") +
        `• Resources: ${item.resources?.join(", ")}`
      ).join("\n\n") || "")
    
    navigator.clipboard.writeText(text)
    setCopiedRoadmap(true)
    setTimeout(() => setCopiedRoadmap(false), 2000)
  }

  const handleAnalyze = async () => {
    if (!targetRole.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)
    setCompletedSteps({})

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
      setActiveTab("roadmap")

      const saved = JSON.parse(localStorage.getItem("careeros_stats") || "{}")
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "Skill gap analyzed",
        description: `Career readiness for ${targetRole}: ${data.overallMatch}%`,
        time: "Just now",
        type: (data.overallMatch ?? 65) >= 70 ? "success" : "warning"
      })
      saved.recentActivities = activities.slice(0, 10)
      localStorage.setItem("careeros_stats", JSON.stringify(saved))
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 75) {
      return {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        label: "High Match",
        desc: "Strong core foundation ready for rapid upskilling"
      }
    }
    if (score >= 50) {
      return {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        label: "Moderate Gap",
        desc: "Bridgeable with 4–6 weeks of targeted practice"
      }
    }
    return {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      label: "Significant Gap",
      desc: "Structured full roadmap recommended"
    }
  }

  const scoreInfo = result ? getScoreBadge(result.overallMatch ?? 65) : getScoreBadge(0)

  return (
    <div className="flex-1 space-y-8 p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Compass className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Skill Gap &amp; Career Roadmap
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Bite-sized market gap analysis with step-by-step milestones and practical projects.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="text-xs gap-1.5 h-9 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Try Example
          </Button>
          {(targetRole || currentSkills.length > 0 || result) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground h-9 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Input Configuration Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Configure Your Target Path
          </CardTitle>
          <CardDescription className="text-xs">
            Select your target job role and current skills to pinpoint exact missing competencies.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Target Role */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Target Role / Job Title <span className="text-destructive">*</span></span>
            </label>
            <Input
              placeholder="e.g. Senior Frontend Engineer, Full-Stack Developer, AI Engineer..."
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="h-10 text-sm"
            />
            {/* Quick role pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-muted-foreground font-medium mr-1">Popular:</span>
              {POPULAR_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                    targetRole === role
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Current Skills Cloud */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Your Current Skills
              </label>
              <span className="text-xs text-muted-foreground">
                {currentSkills.length} added
              </span>
            </div>

            <div
              className="min-h-[52px] flex flex-wrap items-center gap-1.5 p-2 rounded-lg border border-input bg-background focus-within:ring-1 focus-within:ring-ring cursor-text"
              onClick={() => document.getElementById("skill-input")?.focus()}
            >
              {currentSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 pl-2.5 pr-1.5 py-1 text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSkill(skill)
                    }}
                    className="hover:text-destructive text-muted-foreground transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <input
                id="skill-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
                    e.preventDefault()
                    addSkill(skillInput)
                  }
                }}
                placeholder={currentSkills.length === 0 ? "Type a skill (e.g. React, Python, Docker) & press Enter..." : "Add skill..."}
                className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-muted-foreground font-sans px-1 py-0.5"
              />
            </div>

            {/* Quick-add suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-muted-foreground font-medium mr-1">Suggestions:</span>
              {QUICK_SKILL_SUGGESTIONS.filter(s => !currentSkills.includes(s)).slice(0, 8).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="text-xs px-2 py-0.5 rounded border border-border/50 bg-muted/20 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Seniority Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Target Experience Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXPERIENCE_LEVELS.map((lvl) => {
                const isSelected = experienceLevel === lvl.id
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-medium shadow-2xs"
                        : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="text-xs font-medium">{lvl.label}</div>
                    <div className="text-[11px] opacity-75">{lvl.sub}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-2">
            <Button
              className="w-full sm:w-auto min-w-[200px] h-10 text-sm font-semibold gap-2 cursor-pointer"
              onClick={handleAnalyze}
              disabled={!targetRole.trim() || analyzing}
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing Skill Gaps...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Skill Gap
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pre-analysis Info Cards (when no result yet) */}
      {!result && !analyzing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl border border-border/50 bg-card/50 space-y-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Market Benchmarks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time competency matching based on current top job postings.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/50 bg-card/50 space-y-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 w-fit">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Missing Tech Vectors</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Detects databases, cloud stacks, testing tools, and design patterns needed.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/50 bg-card/50 space-y-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Actionable Milestones</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Practical micro-projects and curated links without lengthy fluff.
            </p>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Executive Overview Card */}
          <Card className="border-border/60 shadow-xs">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Score Badge & Target */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border ${scoreInfo.border} ${scoreInfo.bg} shrink-0`}>
                    <span className={`text-2xl font-bold ${scoreInfo.text}`}>
                      {result.overallMatch ?? 65}%
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                      Match
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        {targetRole}
                      </h2>
                      <Badge variant="outline" className={`text-xs ${scoreInfo.border} ${scoreInfo.text}`}>
                        {scoreInfo.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target Level: <span className="font-medium text-foreground">{experienceLevel}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scoreInfo.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Quick actions */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyRoadmap}
                    className="text-xs gap-1.5 h-9 cursor-pointer"
                  >
                    {copiedRoadmap ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Roadmap
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Verdict Summary & Key Highlights */}
              <div className="mt-5 pt-4 border-t border-border/40 space-y-3">
                {result.summary && (
                  <div className="flex items-start gap-2 text-sm font-medium text-foreground/90">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{result.summary}</span>
                  </div>
                )}

                {result.keyHighlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.keyHighlights.map((highlight: string, hIdx: number) => (
                      <div
                        key={hIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/50 border border-border/40 text-xs text-foreground/80 font-medium"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="text-[11px] text-muted-foreground font-medium">Matching Skills</div>
                  <div className="text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    {result.currentSkillsFound?.length || currentSkills.length} Verified
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="text-[11px] text-muted-foreground font-medium">Critical Gaps</div>
                  <div className="text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    {result.missingCriticalSkills?.length || 0} to learn
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="text-[11px] text-muted-foreground font-medium">Milestones</div>
                  <div className="text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {totalRoadmapSteps} Steps
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="text-[11px] text-muted-foreground font-medium">Progress</div>
                  <div className="text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {progressPercent}% Done
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clean Segmented Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border/60 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "roadmap"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Learning Roadmap ({totalRoadmapSteps})
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "skills"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Skills Breakdown
            </button>

            {result.quickWins?.length > 0 && (
              <button
                onClick={() => setActiveTab("quickwins")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "quickwins"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Quick Wins ({result.quickWins.length})
              </button>
            )}
          </div>

          {/* TAB 1: ROADMAP */}
          {activeTab === "roadmap" && (
            <div className="space-y-3.5">
              {totalRoadmapSteps > 0 && (
                <div className="flex items-center justify-between px-1">
                  <div className="text-xs text-muted-foreground">
                    Check off milestones as you master them ({completedCount}/{totalRoadmapSteps} completed)
                  </div>
                  {completedCount > 0 && (
                    <button
                      onClick={() => setCompletedSteps({})}
                      className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      Reset progress
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {result.learningRoadmap?.map((item: any, idx: number) => {
                  const isDone = completedSteps[idx]
                  const priorityVariant =
                    item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"

                  return (
                    <Card
                      key={idx}
                      className={`border transition-all ${
                        isDone
                          ? "border-emerald-500/30 bg-emerald-500/5 opacity-75"
                          : "border-border/60 bg-card hover:border-border"
                      }`}
                    >
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-3.5">
                          {/* Checkbox button */}
                          <button
                            type="button"
                            onClick={() => toggleStepCompleted(idx)}
                            className="mt-0.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                            title={isDone ? "Mark incomplete" : "Mark completed"}
                          >
                            {isDone ? (
                              <CheckSquare className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>

                          {/* Milestone Details */}
                          <div className="flex-1 space-y-2.5 min-w-0">
                            {/* Header row */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground">
                                  Step {idx + 1}:
                                </span>
                                <h3 className={`text-sm font-bold ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                  {item.skill}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge variant={priorityVariant} className="text-[10px] px-2 py-0">
                                  {item.priority} Priority
                                </Badge>
                                {item.timeToLearn && (
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                                    <Clock className="h-3 w-3" />
                                    {item.timeToLearn}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Why it matters (concise 1-liner) */}
                            {item.whyItMatters && (
                              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item.whyItMatters}</span>
                              </div>
                            )}

                            {/* Practical project / Task */}
                            {item.practicalProject && (
                              <div className="flex items-start gap-1.5 text-xs font-medium text-foreground/90 bg-muted/30 p-2 rounded-md border border-border/40">
                                <Code2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                <span><strong>Project:</strong> {item.practicalProject}</span>
                              </div>
                            )}

                            {/* Curated Resources */}
                            {item.resources?.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="text-[11px] text-muted-foreground font-medium">Resources:</span>
                                {item.resources.map((res: string, rIdx: number) => (
                                  <a
                                    key={rIdx}
                                    href={`https://www.google.com/search?q=${encodeURIComponent(res + " tutorial documentation")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 text-[11px] text-muted-foreground transition-colors cursor-pointer"
                                  >
                                    <GraduationCap className="h-3 w-3" />
                                    <span>{res}</span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS BREAKDOWN */}
          {activeTab === "skills" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Verified Skills */}
              <Card className="border-border/60">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Skills You Have ({result.currentSkillsFound?.length || currentSkills.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Competencies from your profile that directly match this role.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {(result.currentSkillsFound?.length > 0 || currentSkills.length > 0) ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(result.currentSkillsFound?.length > 0 ? result.currentSkillsFound : currentSkills).map((s: string) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium"
                        >
                          ✓ {s}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No matching skills detected.</p>
                  )}
                </CardContent>
              </Card>

              {/* Missing Skills */}
              <Card className="border-border/60">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    Critical Gaps to Fill ({result.missingCriticalSkills?.length || 0})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    High-demand competencies required to qualify for top offers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {result.missingCriticalSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingCriticalSkills.map((s: string) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 text-xs font-medium"
                        >
                          + {s}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No critical skill gaps identified!</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: QUICK WINS */}
          {activeTab === "quickwins" && result.quickWins?.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Immediate Action Checklist
                </CardTitle>
                <CardDescription className="text-xs">
                  Direct, high-impact tasks to quickly bridge initial gaps this week.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {result.quickWins.map((win: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/40 text-xs font-medium text-foreground/90"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{win}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
