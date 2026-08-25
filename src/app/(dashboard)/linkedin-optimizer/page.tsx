"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Network,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Search,
  Briefcase,
  Layers,
  FileCheck,
  UserCheck,
  ListChecks
} from "lucide-react"

const priorityConfig = {
  HIGH: { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "High" },
  MEDIUM: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium" },
  LOW: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Low" },
}

export default function LinkedInOptimizer() {
  const [targetRole, setTargetRole] = useState("")
  const [currentHeadline, setCurrentHeadline] = useState("")
  const [currentAbout, setCurrentAbout] = useState("")
  const [skills, setSkills] = useState("")
  const [experience, setExperience] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [featured, setFeatured] = useState("")
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false)

  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [aboutTab, setAboutTab] = useState<"short" | "detailed">("detailed")
  const [expandedExperience, setExpandedExperience] = useState<Set<number>>(new Set([0]))
  const [activeTab, setActiveTab] = useState("headlines")

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
          skills,
          experience,
          yearsExperience,
          featured
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Optimization failed")
      }

      const data = await res.json()
      setResult(data)
      setActiveTab("headlines")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const toggleExp = (index: number) => {
    setExpandedExperience(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-500"
    if (score >= 50) return "text-amber-500"
    return "text-rose-500"
  }

  const getPriority = (p: string) => priorityConfig[p as keyof typeof priorityConfig] || priorityConfig.MEDIUM

  return (
    <div className="flex-1 space-y-5 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Gentle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Network className="h-5 w-5" />
            </div>
            LinkedIn Profile Optimizer
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Optimize for recruiter search discoverability, high-converting headlines, and executive About narratives.
          </p>
        </div>
        {result?.targetRole && (
          <Badge variant="outline" className="self-start sm:self-auto text-xs px-2.5 py-1">
            Target: <span className="font-semibold text-foreground ml-1">{result.targetRole}</span>
          </Badge>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr] items-start">
        {/* Left Column: Input Form & Scores */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Profile Input</CardTitle>
              <CardDescription className="text-xs">Enter your role and current profile info.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Role *
                </label>
                <Input 
                  className="h-9 text-xs"
                  placeholder="e.g. Senior Full-Stack Engineer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Current Headline
                </label>
                <Input 
                  className="h-9 text-xs"
                  placeholder="e.g. Software Engineer at Tech Corp" 
                  value={currentHeadline}
                  onChange={(e) => setCurrentHeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Current About Summary
                </label>
                <Textarea 
                  className="text-xs resize-none"
                  placeholder="Paste your current LinkedIn summary..." 
                  value={currentAbout}
                  onChange={(e) => setCurrentAbout(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Top Skills (comma-separated)
                </label>
                <Input 
                  className="h-9 text-xs"
                  placeholder="React, Next.js, Node.js, TypeScript..." 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              {/* Advanced optional inputs toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                  className="text-[11px] text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {showAdvancedInputs ? "Hide Work History & Featured" : "+ Add Work History & Featured"}
                </button>
              </div>

              {showAdvancedInputs && (
                <div className="space-y-2.5 pt-2 border-t border-border/40">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Experience Bullet Points
                    </label>
                    <Textarea 
                      className="text-xs resize-none"
                      placeholder="Paste 1-2 job roles for AI rewriting..." 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Featured Items or Projects
                    </label>
                    <Input 
                      className="h-8 text-xs"
                      placeholder="e.g. Portfolio link, SaaS demo..." 
                      value={featured}
                      onChange={(e) => setFeatured(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button 
                size="sm"
                className="w-full text-xs font-semibold h-9" 
                onClick={handleAnalyze} 
                disabled={(!targetRole.trim() && !currentHeadline.trim()) || analyzing}
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Optimizing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Optimize LinkedIn Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-3 flex items-center gap-2.5 text-destructive text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-3">
              {/* Overall Score */}
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="p-4 pb-2 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    LinkedIn Brand Score
                  </span>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col items-center">
                  <div className="text-3xl font-bold flex items-baseline gap-1 my-1">
                    <span className={result.overallScore >= 80 ? "text-emerald-500" : result.overallScore >= 60 ? "text-amber-500" : "text-rose-500"}>
                      {result.overallScore}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                  </div>
                  <Progress value={result.overallScore} className="w-full h-1.5 mt-1" />
                </CardContent>
              </Card>

              {/* Granular Scores */}
              {result.scores && (
                <Card className="border-border/60 shadow-xs">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">Optimization Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 space-y-2">
                    {[
                      { label: "Search Discoverability", value: result.scores.discoverability },
                      { label: "Headline Impact", value: result.scores.headline },
                      { label: "About Narrative", value: result.scores.about },
                      { label: "Experience Impact", value: result.scores.experience },
                      { label: "Skills Matching", value: result.scores.skills },
                      { label: "Featured Credibility", value: result.scores.featured },
                      { label: "Profile Completeness", value: result.scores.completeness },
                      { label: "Recruiter Conversion", value: result.scores.recruiterReadiness },
                    ].filter(s => typeof s.value === "number").map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className={`font-semibold ${getScoreColor(s.value)}`}>{s.value}</span>
                        </div>
                        <Progress value={s.value} className="h-1" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Tabbed Views */}
        <div>
          {!result && !analyzing && (
            <Card className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[340px]">
              <Network className="h-10 w-10 mb-3 opacity-20" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Elevate Your LinkedIn Presence</h3>
              <p className="max-w-sm text-xs leading-relaxed">
                Generate recruiter-tested headlines, structured experience narratives, high-impact About copy, and discoverability keyword mapping.
              </p>
            </Card>
          )}

          {analyzing && (
            <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[340px]">
              <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
              <h3 className="text-sm font-semibold mb-1">Simulating Recruiter Search &amp; Audit...</h3>
              <p className="text-xs text-muted-foreground max-w-sm">Evaluating keyword placement, formulating high-converting headlines, and rewriting narratives.</p>
            </Card>
          )}

          {result && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full h-9 bg-muted/60 p-0.5 rounded-lg">
                <TabsTrigger value="headlines" className="text-xs py-1">
                  Headlines
                </TabsTrigger>
                <TabsTrigger value="about" className="text-xs py-1">
                  About &amp; Keywords
                </TabsTrigger>
                <TabsTrigger value="experience" className="text-xs py-1">
                  Experience ({result.experienceAnalysis?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-xs py-1">
                  Skills &amp; Actions
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: HEADLINES & RECRUITER */}
              <TabsContent value="headlines" className="space-y-4">
                {/* Recruiter Shortlist Summary */}
                {result.recruiterSimulation && (
                  <div className="p-3.5 rounded-lg bg-card border border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-foreground">Recruiter Shortlist Decision: </span>
                        <span className="text-xs text-muted-foreground">{result.recruiterSimulation.tenSecondUnderstanding || "Profile evaluated."}</span>
                      </div>
                    </div>
                    <Badge className={
                      result.recruiterSimulation.shortlistDecision === "YES" ? "bg-emerald-500 text-white font-bold text-xs" :
                      result.recruiterSimulation.shortlistDecision === "MAYBE" ? "bg-amber-500 text-white font-bold text-xs" :
                      "bg-rose-500 text-white font-bold text-xs"
                    }>
                      {result.recruiterSimulation.shortlistDecision}
                    </Badge>
                  </div>
                )}

                {/* Headline Suggestions */}
                {result.headlineAnalysis && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> High-Impact Headline Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-3">
                      {/* Primary Headline */}
                      {result.headlineAnalysis.recommendedHeadline && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-primary uppercase">✨ Recommended Primary Headline</span>
                            <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={() => handleCopy(result.headlineAnalysis.recommendedHeadline, "head-primary")}>
                              {copiedKey === "head-primary" ? <><Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3 mr-1" /> Copy</>}
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                            {result.headlineAnalysis.recommendedHeadline}
                          </p>
                        </div>
                      )}

                      {/* Alternatives */}
                      {result.headlineAnalysis.alternativeHeadlines?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground">Alternative Angles:</span>
                          {result.headlineAnalysis.alternativeHeadlines.map((alt: string, i: number) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded-md border border-border/40 gap-2">
                              <p className="text-xs text-foreground leading-relaxed">{alt}</p>
                              <Button variant="ghost" size="sm" className="shrink-0 h-5 w-5 p-0" onClick={() => handleCopy(alt, `head-alt-${i}`)}>
                                {copiedKey === `head-alt-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Recruiter Strengths & Concerns */}
                {result.recruiterSimulation && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.recruiterSimulation.recruiterStrengths?.length > 0 && (
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Recruiter Strengths</span>
                        {result.recruiterSimulation.recruiterStrengths.map((s: string, i: number) => (
                          <p key={i} className="text-xs text-muted-foreground">• {s}</p>
                        ))}
                      </div>
                    )}
                    {result.recruiterSimulation.recruiterConcerns?.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block mb-1">Recruiter Concerns</span>
                        {result.recruiterSimulation.recruiterConcerns.map((c: string, i: number) => (
                          <p key={i} className="text-xs text-muted-foreground">• {c}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: ABOUT & KEYWORDS */}
              <TabsContent value="about" className="space-y-4">
                {/* About Section Switcher */}
                {result.aboutAnalysis && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <FileCheck className="h-3.5 w-3.5 text-primary" /> Optimized "About" Narrative
                        </CardTitle>
                        <div className="flex rounded-md bg-muted p-0.5 text-[11px] font-medium">
                          <button
                            onClick={() => setAboutTab("detailed")}
                            className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${aboutTab === "detailed" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"}`}
                          >
                            Detailed
                          </button>
                          <button
                            onClick={() => setAboutTab("short")}
                            className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${aboutTab === "short" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"}`}
                          >
                            Short
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-2.5">
                      <div className="p-3 rounded-lg bg-muted/20 border border-border/40 space-y-2">
                        <Textarea 
                          readOnly 
                          value={aboutTab === "detailed" ? result.aboutAnalysis.detailedVersion : result.aboutAnalysis.shortVersion} 
                          className="min-h-[140px] resize-none font-sans text-xs leading-relaxed bg-background" 
                        />
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-6 text-[11px]"
                            onClick={() => handleCopy(aboutTab === "detailed" ? result.aboutAnalysis.detailedVersion : result.aboutAnalysis.shortVersion, "about-copy")}
                          >
                            {copiedKey === "about-copy" ? <><Check className="mr-1 h-3 w-3 text-emerald-500" /> Copied</> : <><Copy className="mr-1 h-3 w-3" /> Copy About Text</>}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Keyword Placement Matrix */}
                {result.searchDiscoverability?.keywordPlacement && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Search className="h-3.5 w-3.5 text-primary" /> Keyword Placement Matrix
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0">
                      <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase mb-1">Headline Keywords</span>
                          <div className="flex flex-wrap gap-1">
                            {result.searchDiscoverability.keywordPlacement.headline?.map((kw: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase mb-1">About Summary Keywords</span>
                          <div className="flex flex-wrap gap-1">
                            {result.searchDiscoverability.keywordPlacement.about?.map((kw: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* TAB 3: EXPERIENCE */}
              <TabsContent value="experience" className="space-y-3">
                {result.experienceAnalysis?.length > 0 ? (
                  result.experienceAnalysis.map((exp: any, i: number) => {
                    const isExpanded = expandedExperience.has(i)
                    return (
                      <Card key={i} className="border-border/60 shadow-xs overflow-hidden">
                        <button
                          onClick={() => toggleExp(i)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors cursor-pointer text-left"
                        >
                          <span className="text-xs font-bold text-foreground">{exp.title || `Role ${i + 1}`}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-border/30 text-xs">
                            {exp.improvedDescription && (
                              <div className="p-2.5 rounded-md bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold text-primary uppercase">Action + Tech + Result Format</span>
                                  <Button variant="ghost" size="sm" className="h-5 text-[11px] px-1.5" onClick={() => handleCopy(exp.improvedDescription, `exp-desc-${i}`)}>
                                    {copiedKey === `exp-desc-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                                <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{exp.improvedDescription}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No experience entries provided for rewriting.</p>
                )}
              </TabsContent>

              {/* TAB 4: SKILLS & ACTIONS */}
              <TabsContent value="skills" className="space-y-4">
                {/* Skills Breakdown */}
                {result.skillsAnalysis && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" /> Skills Categorization &amp; Prioritization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-3">
                      {result.skillsAnalysis.skillsToPinToTop?.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Top 3 Skills to Pin:</span>
                          <div className="flex flex-wrap gap-1">
                            {result.skillsAnalysis.skillsToPinToTop.map((s: string, i: number) => (
                              <Badge key={i} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                                ★ {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.skillsAnalysis.primarySkills?.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Primary Role Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {result.skillsAnalysis.primarySkills.map((s: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.skillsAnalysis.missingSkills?.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-rose-500 block mb-1">High-Demand Missing Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {result.skillsAnalysis.missingSkills.map((s: string, i: number) => (
                              <Badge key={i} variant="outline" className="border-rose-500/30 text-rose-500 text-xs">+ {s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Prioritized Action Plan */}
                {result.actionPlan?.length > 0 && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <ListChecks className="h-3.5 w-3.5 text-primary" /> Prioritized Action Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-2">
                      {result.actionPlan.map((act: any, i: number) => {
                        const pri = getPriority(act.priority)
                        return (
                          <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-md bg-muted/20 border border-border/40">
                            <Badge variant="outline" className={`text-[10px] ${pri.color} shrink-0 px-1.5 py-0`}>
                              {pri.label}
                            </Badge>
                            <div className="min-w-0">
                              <span className="font-semibold text-foreground">{act.title}: </span>
                              <span className="text-muted-foreground">{act.exactAction}</span>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
