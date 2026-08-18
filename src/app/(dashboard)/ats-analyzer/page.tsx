"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileCheck2, AlertTriangle, CheckCircle2, RefreshCw, Upload, Sparkles, Target, Zap, Award } from "lucide-react"

export default function ATSAnalyzer() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

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
    if (!jobDescription.trim() || !resumeText.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)
    
    try {
      const res = await fetch("/api/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Analysis failed")
      }

      const data = await res.json()
      setResult(data)

      // Save score to dashboard
      const saved = JSON.parse(localStorage.getItem("careeros_stats") || "{}")
      saved.atsScore = data.score ?? 75
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "ATS match completed",
        description: `Your resume scored ${data.score}% match against the JD`,
        time: "Just now",
        type: (data.score ?? 75) >= 70 ? "success" : "warning"
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileCheck2 className="h-7 w-7" />
            </div>
            ATS Resume Analyzer
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Simulate real-world ATS algorithms (Workday, Lever, Greenhouse) to optimize keyword matching &amp; land interviews.
          </p>
        </div>
      </div>

      {/* Side-by-Side Fixed Height Inputs Grid */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* Left Box: Job Description */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>Target Job Description</span>
              <span className="text-xs text-muted-foreground font-normal">
                {jobDescription.length} chars
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Paste the full job description you are applying for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Paste job title, requirements, responsibilities, and qualifications..." 
              className="h-[240px] resize-none overflow-y-auto font-mono text-xs leading-relaxed"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Right Box: Your Resume */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>Your Resume</span>
              <span className="text-xs text-muted-foreground font-normal">
                {resumeText.length} chars
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Upload PDF / DOCX file or paste text below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* File Upload Trigger */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Upload className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-medium truncate">
                  {parsing ? (
                    <span className="text-primary animate-pulse flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin inline" /> Parsing file...
                    </span>
                  ) : file ? (
                    <span className="text-foreground">{file.name}</span>
                  ) : (
                    <span className="text-muted-foreground">Upload PDF, DOCX, or TXT file</span>
                  )}
                </span>
              </div>
              <label htmlFor="ats-file-upload" className="cursor-pointer shrink-0">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors">
                  Choose File
                </span>
                <input 
                  id="ats-file-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <Textarea 
              placeholder="Paste your resume content here..." 
              className="h-[175px] resize-none overflow-y-auto font-mono text-xs leading-relaxed"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          size="lg"
          className="w-full sm:w-auto sm:min-w-[320px] h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 cursor-pointer"
          onClick={handleAnalyze}
          disabled={!jobDescription.trim() || !resumeText.trim() || analyzing}
        >
          {analyzing ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Running ATS Engine...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Compare &amp; Analyze ATS Match
            </>
          )}
        </Button>
      </div>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
          <div className="border-t border-border/40 pt-6">
            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              ATS Analysis Results
            </h3>
          </div>

          {/* Metric Cards Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  ATS Match Score
                </span>
                <div className="text-4xl font-extrabold flex items-baseline gap-1">
                  <span className={result.score >= 75 ? "text-emerald-500" : result.score >= 50 ? "text-amber-500" : "text-rose-500"}>
                    {result.score}
                  </span>
                  <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                </div>
                <Progress value={result.score} className="w-full h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Impact Score
                </span>
                <div className="text-4xl font-extrabold text-primary">
                  {result.impactScore ?? 80}
                  <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                </div>
                <Progress value={result.impactScore ?? 80} className="w-full h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Leadership Score
                </span>
                <div className="text-4xl font-extrabold text-blue-500">
                  {result.leadershipScore ?? 70}
                  <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                </div>
                <Progress value={result.leadershipScore ?? 70} className="w-full h-2 mt-3" />
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  ATS Readability
                </span>
                <div className="text-4xl font-extrabold text-emerald-500">
                  {result.formatting?.atsCompatibilityScore ?? 90}%
                </div>
                <Badge variant="secondary" className="mt-2 text-xs bg-emerald-500/10 text-emerald-500">
                  High Compatibility
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary Box */}
          {result.summary && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" /> AI Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/90 leading-relaxed font-medium">
                {result.summary}
              </CardContent>
            </Card>
          )}

          {/* Keyword & Skill Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" /> Matched Keywords &amp; Skills
                </CardTitle>
                <CardDescription className="text-xs">
                  Skills and keywords from the job description detected in your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(result.hardSkillsFound && result.hardSkillsFound.length > 0) ? (
                    result.hardSkillsFound.map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 text-xs">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">General keyword alignment detected.</p>
                  )}
                  {result.softSkillsFound?.map((skill: string, i: number) => (
                    <Badge key={`soft-${i}`} variant="secondary" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-rose-500">
                  <AlertTriangle className="h-5 w-5" /> Missing Keywords to Add
                </CardTitle>
                <CardDescription className="text-xs">
                  Crucial keywords missing from your resume that ATS scanners look for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(result.hardSkillsMissing && result.hardSkillsMissing.length > 0) ? (
                    result.hardSkillsMissing.map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-rose-500/30 text-rose-500 bg-rose-500/5 px-2.5 py-1 text-xs font-medium">
                        + {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> No critical keyword gaps identified!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actionable Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Actionable Recommendations to Boost Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/40 text-sm">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-foreground/90 font-medium leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
