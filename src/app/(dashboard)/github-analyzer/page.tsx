"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Star,
  Users,
  Search,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Lightbulb,
  Pin,
  FileText,
  UserCheck,
  ListChecks,
  Layers
} from "lucide-react"

const priorityConfig = {
  HIGH: { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "High" },
  MEDIUM: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium" },
  LOW: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Low" },
}

export default function GitHubAnalyzer() {
  const [username, setUsername] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [expandedRepos, setExpandedRepos] = useState<Set<number>>(new Set([0]))
  const [activeTab, setActiveTab] = useState("overview")

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
      setActiveTab("overview")
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

  const toggleRepo = (index: number) => {
    setExpandedRepos(prev => {
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
      {/* Gentle Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Code className="h-5 w-5" />
            </div>
            GitHub Profile Optimizer
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Recruiter-grade audit of your repositories, technical bio, and code quality signals.
          </p>
        </div>
        {result?.targetRoleDetected && (
          <Badge variant="outline" className="self-start sm:self-auto text-xs px-2.5 py-1">
            Target: <span className="font-semibold text-foreground ml-1">{result.targetRoleDetected}</span>
          </Badge>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr] items-start">
        {/* Left Column: Search & Score Overview */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Profile Search</CardTitle>
              <CardDescription className="text-xs">Enter GitHub username or URL.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  GitHub Handle / URL *
                </label>
                <Input
                  className="h-9 text-xs"
                  placeholder="e.g. torvalds or github.com/username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Target Role (Optional)
                </label>
                <Input
                  className="h-9 text-xs"
                  placeholder="e.g. Full-Stack Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <Button size="sm" className="w-full text-xs font-semibold h-9" onClick={handleAnalyze} disabled={!username.trim() || analyzing}>
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Search className="mr-1.5 h-3.5 w-3.5" />
                    Analyze GitHub
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

          {/* Left Panel: Score Card & Quick Metrics */}
          {result && (
            <div className="space-y-3">
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="p-4 pb-2 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Recruiter Impact Score
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

                  {/* Profile Links Check */}
                  {result.profileAnalysis && (
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/40 w-full text-[11px]">
                      <span className="flex items-center gap-1">
                        {result.profileAnalysis.portfolioLinked?.present ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                        Portfolio
                      </span>
                      <span className="flex items-center gap-1">
                        {result.profileAnalysis.linkedinLinked?.present ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                        LinkedIn
                      </span>
                      <span className="flex items-center gap-1">
                        {result.profileAnalysis.profilePhotoPresent ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                        Photo
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Score Breakdown Bars */}
              {result.scores && (
                <Card className="border-border/60 shadow-xs">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 space-y-2">
                    {[
                      { label: "Profile Setup", value: result.scores.profile },
                      { label: "Repository Quality", value: result.scores.repositoryQuality },
                      { label: "Documentation", value: result.scores.documentation },
                      { label: "Role Alignment", value: result.scores.projectRelevance },
                      { label: "Technical Depth", value: result.scores.technicalCredibility },
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

        {/* Right Column: Tabbed Clean Results (No Endless Scrolling) */}
        <div>
          {!result && !analyzing && (
            <Card className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[340px]">
              <Code className="h-10 w-10 mb-3 opacity-20" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Analyze Your GitHub Footprint</h3>
              <p className="max-w-sm text-xs leading-relaxed">
                Enter your GitHub handle to see how engineering managers and recruiters evaluate your repos, documentation, and technical depth.
              </p>
            </Card>
          )}

          {analyzing && (
            <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[340px]">
              <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
              <h3 className="text-sm font-semibold mb-1">Auditing GitHub Profile...</h3>
              <p className="text-xs text-muted-foreground max-w-sm">Fetching repository metadata, analyzing tech stack breadth, and evaluating recruiter signals.</p>
            </Card>
          )}

          {result && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full h-9 bg-muted/60 p-0.5 rounded-lg">
                <TabsTrigger value="overview" className="text-xs py-1">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="bio" className="text-xs py-1">
                  Bio &amp; Copy
                </TabsTrigger>
                <TabsTrigger value="repos" className="text-xs py-1">
                  Repositories ({result.repositoryAnalysis?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="recruiter" className="text-xs py-1">
                  Recruiter View
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: OVERVIEW */}
              <TabsContent value="overview" className="space-y-4">
                {/* Stats Row */}
                {result.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-card border border-border/60 text-center">
                      <Code className="h-4 w-4 text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold">{result.stats.repos ?? "--"}</div>
                      <div className="text-[11px] text-muted-foreground">Public Repos</div>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border/60 text-center">
                      <Star className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                      <div className="text-lg font-bold">{result.stats.stars ?? "--"}</div>
                      <div className="text-[11px] text-muted-foreground">Total Stars</div>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border/60 text-center">
                      <Users className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-lg font-bold">{result.stats.followers ?? "--"}</div>
                      <div className="text-[11px] text-muted-foreground">Followers</div>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border/60 text-center flex flex-col justify-center items-center">
                      <ExternalLink className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                      <a href={result.stats.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline">
                        Open GitHub ↗
                      </a>
                      <div className="text-[11px] text-muted-foreground">Live Profile</div>
                    </div>
                  </div>
                )}

                {/* Primary Languages */}
                {result.topLanguages?.length > 0 && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" /> Primary Languages &amp; Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0">
                      <div className="flex flex-wrap gap-1.5">
                        {result.topLanguages.map((lang: string, i: number) => (
                          <Badge key={i} variant="secondary" className="px-2.5 py-0.5 text-xs font-medium">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Profile Audit Details */}
                {result.profileAnalysis && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-primary" /> Profile Setup Audit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-2.5">
                      {[
                        { label: "Role Clarity", data: result.profileAnalysis.roleClarity },
                        { label: "Bio Positioning", data: result.profileAnalysis.bioQuality },
                        { label: "Tech Stack Visibility", data: result.profileAnalysis.techStackVisibility },
                        { label: "Pinned Repositories", data: result.profileAnalysis.pinnedReposEffective },
                      ].filter(item => item.data).map((item) => (
                        <div key={item.label} className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
                          <div className="flex items-center justify-between text-xs mb-0.5">
                            <span className="font-semibold">{item.label}</span>
                            {typeof item.data.score === "number" && (
                              <span className={`font-bold ${getScoreColor(item.data.score)}`}>
                                {item.data.score}/100
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.data.assessment}</p>
                          {item.data.recommendation && (
                            <p className="text-[11px] text-primary/90 mt-1">💡 {item.data.recommendation}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Top Action Items Checklist */}
                {result.actionPlan?.length > 0 && (
                  <Card className="border-border/60 shadow-xs">
                    <CardHeader className="p-3.5 pb-2">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <ListChecks className="h-3.5 w-3.5 text-primary" /> High Priority Quick Wins
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3.5 pt-0 space-y-2">
                      {result.actionPlan.slice(0, 3).map((act: any, i: number) => {
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

              {/* TAB 2: BIO & COPY */}
              <TabsContent value="bio" className="space-y-4">
                {result.bioOptimization && (
                  <div className="space-y-3">
                    {/* Current Bio */}
                    {result.bioOptimization.currentBio && (
                      <div className="p-3 rounded-lg bg-muted/20 border border-border/40 text-xs">
                        <span className="font-semibold text-muted-foreground block mb-0.5 uppercase tracking-wider text-[10px]">Current GitHub Bio:</span>
                        <span className="text-foreground">{result.bioOptimization.currentBio}</span>
                      </div>
                    )}

                    {/* Recommended Primary Bio */}
                    {result.bioOptimization.recommendedBio && (
                      <Card className="border-primary/30 bg-primary/5 shadow-xs">
                        <CardHeader className="p-3.5 pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5" /> Recommended Bio
                            </CardTitle>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleCopy(result.bioOptimization.recommendedBio, "bio-rec")}>
                              {copiedKey === "bio-rec" ? <><Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3 mr-1" /> Copy Bio</>}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3.5 pt-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                            {result.bioOptimization.recommendedBio}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Alternative Angles */}
                    {result.bioOptimization.alternativeBios?.length > 0 && (
                      <Card className="border-border/60 shadow-xs">
                        <CardHeader className="p-3.5 pb-2">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alternative Bios</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3.5 pt-0 space-y-2">
                          {result.bioOptimization.alternativeBios.map((bio: string, i: number) => (
                            <div key={i} className="flex items-center justify-between p-2.5 bg-muted/20 rounded-md border border-border/40 gap-3">
                              <p className="text-xs text-foreground leading-relaxed">{bio}</p>
                              <Button variant="ghost" size="sm" className="shrink-0 h-6 w-6 p-0" onClick={() => handleCopy(bio, `bio-alt-${i}`)}>
                                {copiedKey === `bio-alt-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Keywords Tag Cloud */}
                    {result.bioOptimization.keywordsToInclude?.length > 0 && (
                      <div className="p-3 rounded-lg bg-card border border-border/60">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Recommended Keywords to Include:</span>
                        <div className="flex flex-wrap gap-1">
                          {result.bioOptimization.keywordsToInclude.map((kw: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-[11px]">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* TAB 3: REPOSITORIES */}
              <TabsContent value="repos" className="space-y-3">
                {result.repositoryAnalysis?.length > 0 ? (
                  result.repositoryAnalysis.map((repo: any, i: number) => {
                    const priority = getPriority(repo.priority)
                    const isExpanded = expandedRepos.has(i)
                    return (
                      <Card key={i} className="border-border/60 shadow-xs overflow-hidden">
                        <button
                          onClick={() => toggleRepo(i)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Badge variant="outline" className={`text-[10px] ${priority.color} shrink-0 px-1.5 py-0`}>
                              {priority.label}
                            </Badge>
                            <span className="text-xs font-bold truncate">{repo.name}</span>
                            {repo.shouldPin && (
                              <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-1.5 py-0 gap-0.5">
                                <Pin className="h-2.5 w-2.5" /> Pin
                              </Badge>
                            )}
                            {repo.language && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{repo.language}</Badge>
                            )}
                          </div>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-border/30 text-xs">
                            <p className="text-muted-foreground text-xs">{repo.description || "No description set."}</p>

                            {/* Improved Description */}
                            {repo.improvedDescription && (
                              <div className="p-2.5 rounded-md bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold text-primary uppercase">Optimized Repo Description</span>
                                  <Button variant="ghost" size="sm" className="h-5 text-[11px] px-1.5" onClick={() => handleCopy(repo.improvedDescription, `repo-desc-${i}`)}>
                                    {copiedKey === `repo-desc-${i}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  </Button>
                                </div>
                                <p className="text-xs text-foreground leading-relaxed">{repo.improvedDescription}</p>
                              </div>
                            )}

                            {/* Recommendations */}
                            {repo.recommendations?.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                {repo.recommendations.map((rec: any, ri: number) => (
                                  <div key={ri} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <span className="text-primary font-bold">→</span>
                                    <div>
                                      <span className="font-semibold text-foreground">{rec.exactFix} </span>
                                      <span className="text-[11px] text-muted-foreground">({rec.whyItMatters})</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No repositories analyzed.</p>
                )}
              </TabsContent>

              {/* TAB 4: RECRUITER VIEW */}
              <TabsContent value="recruiter" className="space-y-4">
                {result.recruiterImpression && (
                  <div className="space-y-3">
                    {/* 30-Second Takeaway */}
                    {result.recruiterImpression.thirtySecondVerdict && (
                      <div className="p-3 rounded-lg bg-muted/20 border border-border/40 text-xs italic leading-relaxed">
                        <span className="font-semibold text-muted-foreground not-italic block mb-0.5 text-[10px] uppercase">30-Second Recruiter Takeaway:</span>
                        &ldquo;{result.recruiterImpression.thirtySecondVerdict}&rdquo;
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3">
                      {/* Strong Signals */}
                      {result.recruiterImpression.strongSignals?.length > 0 && (
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Strong Signals
                          </span>
                          {result.recruiterImpression.strongSignals.map((s: string, i: number) => (
                            <p key={i} className="text-xs text-muted-foreground">• {s}</p>
                          ))}
                        </div>
                      )}

                      {/* Weak / Missing Signals */}
                      {result.recruiterImpression.weakSignals?.length > 0 && (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Weak / Missing Signals
                          </span>
                          {result.recruiterImpression.weakSignals.map((s: string, i: number) => (
                            <p key={i} className="text-xs text-muted-foreground">• {s}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Top 5 Recruiter Improvements */}
                    {result.recruiterImpression.topImprovements?.length > 0 && (
                      <Card className="border-border/60 shadow-xs">
                        <CardHeader className="p-3.5 pb-2">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-primary" /> Top Recruiter Improvements
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3.5 pt-0 space-y-1.5">
                          {result.recruiterImpression.topImprovements.map((imp: string, i: number) => (
                            <div key={i} className="flex gap-2 text-xs p-1.5 rounded-md bg-muted/20">
                              <span className="font-bold text-primary">{i + 1}.</span>
                              <p className="text-foreground/90">{imp}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
