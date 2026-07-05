"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFile(f)
      // Read text from file
      const text = await f.text()
      setResumeText(text)
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
      saved.resumeScore = data.score
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "Resume analyzed",
        description: `Your resume scored ${data.score}%`,
        time: "Just now",
        type: data.score >= 70 ? "success" : "warning"
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
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resume Analyzer</h2>
          <p className="text-muted-foreground mt-1">Get AI-powered feedback on your resume.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload or Paste Resume</CardTitle>
              <CardDescription>Upload a file or paste your resume text below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 bg-muted/10 hover:bg-muted/20 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm">
                    Select File
                  </span>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                {file && <p className="mt-3 text-sm text-muted-foreground">{file.name}</p>}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or paste text</span></div>
              </div>

              <Textarea 
                placeholder="Paste your resume content here..." 
                className="min-h-[200px] resize-none"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
              )}

              <Button 
                className="w-full" 
                onClick={handleAnalyze} 
                disabled={!resumeText.trim() || analyzing}
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <p>Upload or paste your resume, then click "Analyze Resume" to get detailed AI feedback.</p>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                      <circle 
                        cx="64" cy="64" r="60" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="377" 
                        strokeDashoffset={377 - (377 * result.score) / 100}
                        className="text-primary transition-all duration-1000" 
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">{result.score}%</span>
                  </div>
                  <Progress value={result.score} className="w-full" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center text-emerald-500 mb-2">
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Strengths
                      </h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {result.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center text-amber-500 mb-2">
                        <AlertCircle className="h-4 w-4 mr-2" /> Needs Improvement
                      </h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {result.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                    {result.recommendations && (
                      <div>
                        <h4 className="font-medium flex items-center text-primary mb-2">
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((r: string, i: number) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">{i+1}</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
