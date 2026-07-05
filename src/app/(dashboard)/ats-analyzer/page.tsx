"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileCheck2, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react"

export default function ATSAnalyzer() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeText) return
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
      saved.atsScore = data.score
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "ATS match completed",
        description: `Your resume scored ${data.score}% match against the JD`,
        time: "Just now",
        type: data.score >= 70 ? "success" : "warning"
      })
      saved.recentActivities = activities.slice(0, 10)
      localStorage.setItem("careeros_stats", JSON.stringify(saved))
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileCheck2 className="h-8 w-8 text-primary" />
            ATS Analyzer
          </h2>
          <p className="text-muted-foreground mt-1">Compare your resume against any job description.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Paste the target job description here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste the full job description..." 
                className="min-h-[200px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
              <CardDescription>Paste your resume text to compare.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste your resume content..." 
                className="min-h-[200px] resize-none"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
          )}
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleAnalyze}
            disabled={!jobDescription || !resumeText || analyzing}
          >
            {analyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              "Compare & Analyze"
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <FileCheck2 className="h-16 w-16 mb-4 opacity-20" />
              <p>Paste your resume and job description, then click &quot;Compare &amp; Analyze&quot; to see your ATS match score and keyword gaps.</p>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Match Score</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 
                      Matched Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.hardSkillsFound?.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{skill}</Badge>
                      ))}
                      {result.softSkillsFound?.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-rose-500" /> 
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.hardSkillsMissing?.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="border-rose-500/30 text-rose-500">{skill}</Badge>
                      ))}
                      {result.softSkillsMissing?.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="border-rose-500/30 text-rose-500">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result.recommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {i + 1}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
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
