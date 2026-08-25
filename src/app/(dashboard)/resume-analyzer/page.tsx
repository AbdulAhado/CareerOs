"use client"

import { useState } from "react"
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Zap, 
  Target, 
  Copy, 
  Check, 
  Trash2, 
  TrendingUp,
  ShieldCheck,
  FileCode2,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const SAMPLE_RESUME = `ABDUL AHAD SAEED
Full Stack & AI Systems Engineer | Multan, Pakistan | github.com/AbdulAhado

SUMMARY
Results-driven Full Stack Engineer with expertise in React, Next.js, Node.js, and AI integrations (OpenAI, WebRTC). Built high-performance web applications handling video playback, AI interview simulations, and resume processing.

SKILLS
- Languages: TypeScript, JavaScript, Python, HTML5, CSS3
- Frontend: Next.js 14, React, TailwindCSS, Redux Toolkit
- Backend: Node.js, Express.js, MongoDB, PostgreSQL, REST APIs
- AI & Tools: OpenAI API, WebRTC, Docker, Git, Vercel

PROJECTS
VideoTube (YouTube-style App)
- Engineered high-capacity video streaming frontend with full playback controls, search, and responsive dark UI using React & Material-UI.
- Optimized asset loading and search indexing to deliver 30% faster initial frame renders.

Spotify Clone
- Developed full-featured audio music player with playlist creation, interactive playback controls, and responsive UI layout.

AI Resume & Interview Assistant
- Integrated OpenAI GPT-4 APIs to deliver real-time AI feedback on candidate resumes and automated interview simulations.
- Implemented smart silence detection and audio waveform visualization using WebRTC and Web Audio API.

EDUCATION
BS-IT (2nd Semester) | Bahauddin Zakariya University (BZU), Multan (2024 - 2028)
`

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFile(f)
      setParsing(true)
      setError("")

      try {
        const formData = new FormData()
        formData.append("file", f)

        const res = await fetch("/api/parse-file", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to read file")
        }

        setResumeText(data.text)
      } catch (err: any) {
        setError(err.message || "Failed to read file. Please paste text directly.")
      } finally {
        setParsing(false)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return
    setAnalyzing(true)
    setAnalyzeStep(1)
    setError("")
    setResult(null)

    const stepInterval = setInterval(() => {
      setAnalyzeStep((prev) => (prev < 3 ? prev + 1 : prev))
    }, 1200)

    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Analysis failed")
      }

      const data = await res.json()
      setResult(data)

      // Save score to dashboard
      const saved = JSON.parse(localStorage.getItem("careeros_stats") || "{}")
      saved.resumeScore = data.score ?? 80
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "Resume analyzed",
        description: `Your resume scored ${data.score}%`,
        time: "Just now",
        type: (data.score ?? 80) >= 70 ? "success" : "warning"
      })
      saved.recentActivities = activities.slice(0, 10)
      localStorage.setItem("careeros_stats", JSON.stringify(saved))
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      clearInterval(stepInterval)
      setAnalyzing(false)
      setAnalyzeStep(0)
    }
  }

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME)
    setFile(null)
    setError("")
  }

  const handleCopyRecommendation = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0

  // Format string with title: body
  const parsePoint = (str: string) => {
    const colonIndex = str.indexOf(":")
    if (colonIndex > 0 && colonIndex < 35) {
      return {
        tag: str.substring(0, colonIndex).trim(),
        text: str.substring(colonIndex + 1).trim()
      }
    }
    return { tag: null, text: str }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return { text: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500/30", label: "Executive Ready" }
    if (score >= 55) return { text: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/30", label: "Needs Polish" }
    return { text: "text-rose-500", bg: "bg-rose-500", border: "border-rose-500/30", label: "Critical Gaps" }
  }

  const currentScore = result ? (result.score ?? 80) : 0
  const scoreTheme = getScoreColor(currentScore)

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-red-500/10 via-primary/5 to-purple-500/10 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-semibold px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 mr-1 inline" /> AI Engine 3.0
              </Badge>
              <Badge variant="outline" className="border-border bg-background/50 text-muted-foreground text-xs">
                ATS &amp; Executive Benchmark
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
              Scan your resume against top industry standards. Get instant feedback on executive presence, business impact, technical depth, and actionable fixes.
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLoadSample} 
            className="self-start md:self-auto border-border/80 bg-background/60 hover:bg-accent text-xs font-medium gap-2 cursor-pointer shadow-xs"
          >
            <FileCode2 className="h-4 w-4 text-primary" />
            Load Sample Resume
          </Button>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-border/80 shadow-md bg-card/80 backdrop-blur-xs">
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload or Paste Resume
              </CardTitle>
              <CardDescription>
                Upload a document (.pdf, .docx, .txt) or paste your plain text content.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-mono bg-muted/50 px-2.5 py-1 rounded-md border border-border/40">
                {wordCount} words
              </span>
              <span className="inline-flex items-center gap-1 font-mono bg-muted/50 px-2.5 py-1 rounded-md border border-border/40">
                {resumeText.length} chars
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* File Upload Dropzone Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                <Upload className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                {parsing ? (
                  <span className="text-primary font-medium text-sm animate-pulse flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin inline" /> Extracting text from document...
                  </span>
                ) : file ? (
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • File parsed successfully</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">Upload Resume File</p>
                    <p className="text-xs text-muted-foreground">Supports PDF, DOCX, DOC, or TXT up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {file && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setFile(null); setResumeText(""); }}
                  className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
              <label htmlFor="resume-file-upload" className="cursor-pointer">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm inline-flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  {file ? "Change File" : "Select File"}
                </span>
                <input 
                  id="resume-file-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-1">
              <span>Resume Content</span>
              {resumeText.length > 0 && (
                <button 
                  onClick={() => setResumeText("")} 
                  className="hover:text-destructive cursor-pointer transition-colors"
                >
                  Clear Text
                </button>
              )}
            </div>
            <Textarea 
              placeholder="Paste your full resume text here (experience, skills, summary, projects)..." 
              className="min-h-[220px] max-h-[400px] resize-y font-sans text-sm leading-relaxed p-4 bg-background border-border/80 focus-visible:ring-primary/40 rounded-xl"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm font-medium flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button 
              size="lg"
              className="w-full sm:w-auto min-w-[300px] h-13 text-base font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]" 
              onClick={handleAnalyze} 
              disabled={!resumeText.trim() || analyzing || parsing}
            >
              {analyzing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  <span>
                    {analyzeStep === 1 ? "Parsing resume architecture..." : analyzeStep === 2 ? "Benchmarking executive signals..." : "Generating actionable insights..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 fill-white/20" />
                  <span>Analyze Resume with AI</span>
                  <ArrowRight className="h-5 w-5 ml-1" />
                </div>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              ⚡ Instant AI analysis using 6-point Executive Framework
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-500 pt-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Executive Analysis Report
                </h2>
                <p className="text-xs text-muted-foreground">
                  Comprehensive audit score &amp; improvement roadmap
                </p>
              </div>
            </div>
            <Badge className={`${scoreTheme.bg} text-white font-bold text-xs px-3 py-1`}>
              {scoreTheme.label}
            </Badge>
          </div>

          {/* Top Score Banner Grid */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Overall Score Card */}
            <Card className="md:col-span-4 border-border/80 shadow-sm bg-card flex flex-col justify-between">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Overall Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-muted/30"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="10"
                      className={`${scoreTheme.text} transition-all duration-1000 ease-out`}
                      fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * currentScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className={`text-4xl font-extrabold tracking-tight ${scoreTheme.text}`}>
                      {currentScore}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold uppercase">out of 100</span>
                  </div>
                </div>

                <div className="mt-4 w-full space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">ATS Readiness</span>
                    <span className="text-foreground">{currentScore >= 70 ? "High Pass Rate" : "Medium Pass Rate"}</span>
                  </div>
                  <Progress value={currentScore} className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Executive Summary Card */}
            <Card className="md:col-span-8 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                  <Zap className="h-5 w-5 fill-primary/20" /> Executive Summary &amp; Positioning
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm text-foreground/90 leading-relaxed space-y-4">
                <p className="font-medium text-base leading-relaxed">
                  {result.summary || "Your resume has been audited across executive clarity, technical depth, and quantifiable achievement signals."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-background/80 border border-border/50">
                    <p className="text-xs text-muted-foreground font-medium">Impact Signals</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      {currentScore >= 70 ? "Strong" : "Moderate"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/80 border border-border/50">
                    <p className="text-xs text-muted-foreground font-medium">ATS Formatting</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Clean Layout
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/80 border border-border/50 col-span-2 sm:col-span-1">
                    <p className="text-xs text-muted-foreground font-medium">Seniority Signal</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {currentScore >= 80 ? "Senior / Staff" : currentScore >= 60 ? "Mid Level" : "Early Career"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Key Strengths */}
            <Card className="border-emerald-500/30 bg-card shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40 bg-emerald-500/5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5 shrink-0" /> Standout Strengths
                </CardTitle>
                <CardDescription>
                  High-value section structure and strong resume signals.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {result.strengths?.map((item: string, i: number) => {
                  const parsed = parsePoint(item)
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </div>
                      <div className="space-y-1">
                        {parsed.tag && (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-bold text-[10px] uppercase">
                            {parsed.tag}
                          </Badge>
                        )}
                        <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                          {parsed.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-amber-500/30 bg-card shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40 bg-amber-500/5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="h-5 w-5 shrink-0" /> Areas for Growth
                </CardTitle>
                <CardDescription>
                  Key gaps and improvements needed to maximize interviewer response.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {result.weaknesses?.map((item: string, i: number) => {
                  const parsed = parsePoint(item)
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                      <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        !
                      </div>
                      <div className="space-y-1">
                        {parsed.tag && (
                          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 font-bold text-[10px] uppercase">
                            {parsed.tag}
                          </Badge>
                        )}
                        <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                          {parsed.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Actionable Recommendations Section */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="border-border/80 bg-card shadow-md">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recommended Action Roadmap
                </CardTitle>
                <CardDescription>
                  Follow these prioritized steps to elevate your resume score into the top tier.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {result.recommendations.map((rec: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/60 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-extrabold mt-0.5">
                        0{i + 1}
                      </span>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {rec}
                      </p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopyRecommendation(rec, i)}
                      className="shrink-0 text-xs font-semibold border-border/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1" /> Copy Recommendation
                        </>
                      )}
                    </Button>
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
