"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MonitorPlay,
  Search,
  RefreshCw,
  Zap,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Target,
  Globe,
  FolderGit2,
  LayoutTemplate,
  UserCheck,
  ListChecks
} from "lucide-react"

const priorityConfig = {
  HIGH: { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "High" },
  MEDIUM: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium" },
  LOW: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Low" },
}

export default function PortfolioAnalyzer() {
  const [url, setUrl] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [description, setDescription] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set([0]))
  const [activeTab, setActiveTab] = useState("impression")

  const handleAnalyze = async () => {
    if (!url.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/portfolio-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, targetRole, description })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Portfolio analysis failed")
      }

      const data = await res.json()
      setResult(data)
      setActiveTab("impression")
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

  const toggleProject = (index: number) => {
    setExpandedProjects(prev => {
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
              <MonitorPlay className="h-5 w-5" />
            </div>
            Portfolio &amp; Website Optimizer
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Audit your developer website for 10-second recruiter clarity, hero positioning, and project evidence.
          </p>
        </div>
        {result?.targetRoleDetected && (
          <Badge variant="outline" className="self-start sm:self-auto text-xs px-2.5 py-1">
            Target: <span className="font-semibold text-foreground ml-1">{result.targetRoleDetected}</span>
          </Badge>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr] items-start">
        {/* Left Column: Form & Score Card */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Portfolio URL</CardTitle>
              <CardDescription className="text-xs">Enter your personal website link.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Website URL *
                </label>
                <Input 
                  className="h-9 text-xs"
                  placeholder="https://yourname.dev" 
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Role (Optional)
                </label>
                <Input 
                  className="h-9 text-xs"
                  placeholder="e.g. Frontend Developer" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Notes / Focus (Optional)
                </label>
                <Textarea 
                  className="text-xs resize-none"
                  placeholder="Key projects or specific technologies..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <Button size="sm" className="w-full text-xs font-semibold h-9" onClick={handleAnalyze} disabled={!url.trim() || analyzing}>
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Auditing Portfolio...
                  </>
                ) : (
                  <>
                    <Search className="mr-1.5 h-3.5 w-3.5" />
                    Audit Portfolio
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
              {/* Overall Score Card */}
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="p-4 pb-2 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Overall Portfolio Score
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
                    <CardTitle className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">Metric Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 space-y-2">
                    {[
                      { label: "10s First Impression", value: result.scores.firstImpression },
                      { label: "Role & Stack Clarity", value: result.scores.roleClarity },
                      { label: "Project Proof", value: result.scores.projects },
                      { label: "Content Quality", value: result.scores.content },
                      { label: "UI / UX Design", value: result.scores.uxDesign },
                      { label: "SEO & Meta Signals", value: result.scores.seo },
                      { label: "Recruiter Appeal", value: result.scores.recruiterReadiness },
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
              <MonitorPlay className="h-10 w-10 mb-3 opacity-20" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Audit Your Developer Site</h3>
              <p className="max-w-sm text-xs leading-relaxed">
                Analyze your hero positioning, rewritten case studies, recruiter shortlist decisions, and SEO tags.
              </p>
            </Card>
          )}

          {analyzing && (
            <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[340px]">
              <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
              <h3 className="text-sm font-semibold mb-1">Auditing Portfolio Experience...</h3>
              <p className="text-xs text-muted-foreground max-w-sm">Inspecting page structure, evaluating hero clarity, and simulating a 10-second recruiter review.</p>
            </Card>
          )}

          {result && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full h-9 bg-muted/60 p-0.5 rounded-lg">
                <TabsTrigger value="impression" className="text-xs py-1">
                  10s Review
                </TabsTrigger>
                <TabsTrigger value="hero" className="text-xs py-1">
                  Hero &amp; About
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-xs py-1">
                  Projects ({result.projectsAnalysis?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs py-1">
                  SEO &amp; Actions
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: 10S REVIEW */}
              <TabsContent value="impression" className="space-y-4">
                {/* Shortlist Decision Banner */}
                {result.recruiterTest && (
                  <div className="p-3.5 rounded-lg bg-card border border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-foreground">Recruiter Shortlist Decision: </span>
                        <span className="text-xs text-muted-foreground">{result.recruiterTest.reasoning}</span>
                      </div>
                    </div>
                    <Badge className={
                      result.recruiterTest.shortlistDecision === "YES" ? "bg-emerald-500 text-white font-bold text-xs" :
                      result.recruiterTest.shortlistDecision === "MAYBE" ? "bg-amber-500 text-white font-bold text-xs" :
                      "bg-rose-500 text-white font-bold text-xs"
                    }>
                      {result.recruiterTest.shortlistDecision}
                    </Badge>
                  </div>
                )}

                {/* First Impression Breakdown */}
                {result.firstImpression && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-primary" /> 10-Second First Impression
                        </CardTitle>
                        {typeof result.firstImpression.tenSecondScore === "number" && (
                          <Badge variant="outline" className="text-[11px] font-bold">
                            {result.firstImpression.tenSecondScore}/100 Clarity
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-3">
                      {result.firstImpression.verdict && (
                        <p className="text-xs italic text-muted-foreground bg-muted/20 p-2.5 rounded-md border border-border/40">
                          &ldquo;{result.firstImpression.verdict}&rdquo;
                        </p>
                      )}

                      <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Identity Clarity:</span>
                          <span className="text-foreground">{result.firstImpression.whoIsThisPerson || "Unclear"}</span>
                        </div>
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Role Clarity:</span>
                          <span className="text-foreground">{result.firstImpression.roleClarity || "Unclear"}</span>
                        </div>
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Tech Stack Above Fold:</span>
                          <span className="text-foreground">{result.firstImpression.techStackVisible || "Not visible"}</span>
                        </div>
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Call To Action:</span>
                          <span className="text-foreground">{result.firstImpression.ctaPresent || "Missing"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Evidence & Insights */}
                {result.recruiterTest && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.recruiterTest.strongestProjects?.length > 0 && (
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Strongest Projects</span>
                        {result.recruiterTest.strongestProjects.map((p: string, i: number) => (
                          <p key={i} className="text-xs text-muted-foreground">• {p}</p>
                        ))}
                      </div>
                    )}
                    {result.recruiterTest.missingEvidence?.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block mb-1">Missing Evidence</span>
                        {result.recruiterTest.missingEvidence.map((m: string, i: number) => (
                          <p key={i} className="text-xs text-muted-foreground">• {m}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: HERO & ABOUT */}
              <TabsContent value="hero" className="space-y-4">
                {/* Hero Section Optimizer */}
                {result.heroAnalysis && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <LayoutTemplate className="h-3.5 w-3.5 text-primary" /> Hero Section Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-3">
                      {/* Current Headline */}
                      <div className="p-2.5 rounded-md bg-muted/20 border border-border/40 text-xs">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-0.5">Observed Headline:</span>
                        <span className="text-foreground">{result.heroAnalysis.currentHeadline}</span>
                      </div>

                      {/* Recommended Headline */}
                      {result.heroAnalysis.recommendedHeadline && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-primary uppercase">✨ Recommended Headline &amp; Subheadline</span>
                            <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={() => handleCopy(`${result.heroAnalysis.recommendedHeadline}\n${result.heroAnalysis.recommendedSubheadline || ''}`, "hero-rec")}>
                              {copiedKey === "hero-rec" ? <><Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3 mr-1" /> Copy Hero</>}
                            </Button>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-foreground">{result.heroAnalysis.recommendedHeadline}</h4>
                          {result.heroAnalysis.recommendedSubheadline && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{result.heroAnalysis.recommendedSubheadline}</p>
                          )}
                        </div>
                      )}

                      {/* Alternative Angles */}
                      {result.heroAnalysis.alternativeHeadlines?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground">Alternative Headline Angles:</span>
                          {result.heroAnalysis.alternativeHeadlines.map((alt: string, i: number) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded-md border border-border/40 gap-2">
                              <p className="text-xs text-foreground leading-relaxed">{alt}</p>
                              <Button variant="ghost" size="sm" className="shrink-0 h-5 w-5 p-0" onClick={() => handleCopy(alt, `hero-alt-${i}`)}>
                                {copiedKey === `hero-alt-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* About Section Enhancement */}
                {result.aboutAnalysis?.improvedAbout && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-primary" /> Optimized About Narrative
                        </CardTitle>
                        <Button variant="outline" size="sm" className="h-6 text-[11px]" onClick={() => handleCopy(result.aboutAnalysis.improvedAbout, "about-rec")}>
                          {copiedKey === "about-rec" ? <><Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3 mr-1" /> Copy</>}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0">
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-3 rounded-md border border-border/40">
                        {result.aboutAnalysis.improvedAbout}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* TAB 3: PROJECTS */}
              <TabsContent value="projects" className="space-y-3">
                {result.projectsAnalysis?.length > 0 ? (
                  result.projectsAnalysis.map((proj: any, i: number) => {
                    const isExpanded = expandedProjects.has(i)
                    return (
                      <Card key={i} className="border-border/60 shadow-xs overflow-hidden">
                        <button
                          onClick={() => toggleProject(i)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold truncate">{proj.name}</span>
                            {proj.technicalComplexity && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {proj.technicalComplexity}
                              </Badge>
                            )}
                            {proj.provesTargetRole && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0">
                                ✓ Aligned
                              </Badge>
                            )}
                          </div>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-border/30 text-xs">
                            {proj.technologies?.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-[10px] font-semibold text-muted-foreground mr-1">Stack:</span>
                                {proj.technologies.map((t: string, ti: number) => (
                                  <Badge key={ti} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                                ))}
                              </div>
                            )}

                            {/* Improved Description Case Study */}
                            {proj.improvedDescription && (
                              <div className="p-2.5 rounded-md bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold text-primary uppercase">Rewritten Case Study Format</span>
                                  <Button variant="ghost" size="sm" className="h-5 text-[11px] px-1.5" onClick={() => handleCopy(proj.improvedDescription, `proj-desc-${i}`)}>
                                    {copiedKey === `proj-desc-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                                <p className="text-xs text-foreground leading-relaxed">{proj.improvedDescription}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No projects detected from site content.</p>
                )}
              </TabsContent>

              {/* TAB 4: SEO & ACTIONS */}
              <TabsContent value="seo" className="space-y-4">
                {/* SEO Snippets */}
                {result.seoAnalysis && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-primary" /> SEO &amp; Social Previews
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-2.5">
                      {result.seoAnalysis.recommendedTitle && (
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Recommended Page Title</span>
                            <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => handleCopy(result.seoAnalysis.recommendedTitle, "seo-title")}>
                              {copiedKey === "seo-title" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                          <p className="text-xs font-semibold text-foreground">{result.seoAnalysis.recommendedTitle}</p>
                        </div>
                      )}

                      {result.seoAnalysis.recommendedMetaDescription && (
                        <div className="p-2.5 rounded-md bg-muted/20 border border-border/40">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Recommended Meta Description</span>
                            <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1" onClick={() => handleCopy(result.seoAnalysis.recommendedMetaDescription, "seo-desc")}>
                              {copiedKey === "seo-desc" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{result.seoAnalysis.recommendedMetaDescription}</p>
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
                        <ListChecks className="h-3.5 w-3.5 text-primary" /> Prioritized Portfolio Action Plan
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
