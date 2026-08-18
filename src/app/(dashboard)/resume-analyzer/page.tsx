"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Award, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function ResumeAnalyzer() {
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
    if (!resumeText.trim()) return
    setAnalyzing(true)
    setError("")
    setResult(null)

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
              <FileText className="h-7 w-7" />
            </div>
            AI Resume Analyzer
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Get instant, executive-level feedback, score breakdown, and actionable improvements for your resume.
          </p>
        </div>
      </div>
      
      {/* Input Box Section */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Upload or Paste Your Resume</span>
            <span className="text-xs text-muted-foreground font-normal">
              {resumeText.length} characters
            </span>
          </CardTitle>
          <CardDescription className="text-xs">
            Upload PDF, DOCX, or TXT file — or paste your resume plain text below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Banner */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <Upload className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-medium truncate">
                {parsing ? (
                  <span className="text-primary animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin inline" /> Extracting text from file...
                  </span>
                ) : file ? (
                  <span className="text-foreground">{file.name}</span>
                ) : (
                  <span className="text-muted-foreground">Upload your resume file (.pdf, .docx, .txt)</span>
                )}
              </span>
            </div>
            <label htmlFor="resume-file-upload" className="cursor-pointer shrink-0">
              <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors">
                Choose File
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

          <Textarea 
            placeholder="Paste your resume content here..." 
            className="h-[220px] resize-none overflow-y-auto font-mono text-xs leading-relaxed"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button 
              size="lg"
              className="w-full sm:w-auto sm:min-w-[320px] h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 cursor-pointer" 
              onClick={handleAnalyze} 
              disabled={!resumeText.trim() || analyzing}
            >
              {analyzing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Resume with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Dashboard */}
      {result && (
        <div className="space-y-6 pt-4 animate-in fade-in-50 duration-300">
          <div className="border-t border-border/40 pt-6">
            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Resume Analysis Score &amp; Feedback
            </h3>
          </div>

          {/* Overall Score Banner */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border/60 bg-card sm:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Overall Score
                </span>
                <div className="text-5xl font-extrabold flex items-baseline gap-1 my-2">
                  <span className={(result.score ?? 80) >= 75 ? "text-emerald-500" : (result.score ?? 80) >= 50 ? "text-amber-500" : "text-rose-500"}>
                    {result.score ?? 80}
                  </span>
                  <span className="text-xl text-muted-foreground font-normal">/ 100</span>
                </div>
                <Progress value={result.score ?? 80} className="w-full h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 sm:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" /> Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/90 leading-relaxed font-medium">
                {result.summary || "Your resume has been processed against industry benchmarks."}
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Needs Improvement Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" /> Key Strengths
                </CardTitle>
                <CardDescription className="text-xs">
                  Standout elements and well-structured sections in your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths?.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-foreground/90 font-medium">{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-500">
                  <AlertCircle className="h-5 w-5" /> Areas for Improvement
                </CardTitle>
                <CardDescription className="text-xs">
                  High-leverage gaps to fix for a stronger impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses?.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 font-bold">!</span>
                      <span className="text-foreground/90 font-medium">{w}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actionable Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/40 text-sm">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-foreground/90 font-medium leading-relaxed">{r}</span>
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
