"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Copy, Check, RefreshCw, FileText } from "lucide-react"

export default function ProposalGenerator() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [generating, setGenerating] = useState(false)
  const [proposal, setProposal] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return
    setGenerating(true)
    setError("")
    setProposal("")

    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to generate proposal")
      }

      const data = await res.json()
      setProposal(data.proposal)

      // Save activity to dashboard
      const saved = JSON.parse(localStorage.getItem("careeros_stats") || "{}")
      const activities = saved.recentActivities || []
      activities.unshift({
        id: Date.now(),
        title: "Proposal generated",
        description: "AI created a tailored job proposal",
        time: "Just now",
        type: "success"
      })
      saved.recentActivities = activities.slice(0, 10)
      localStorage.setItem("careeros_stats", JSON.stringify(saved))
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Proposal Generator
          </h2>
          <p className="text-muted-foreground mt-1">Upload your resume + paste a job description → get a professional, ready-to-send proposal.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Resume / Experience</CardTitle>
              <CardDescription>Paste your resume or key experience details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste your resume content or relevant experience here..." 
                className="min-h-[200px] resize-none"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Description / Project Brief</CardTitle>
              <CardDescription>Paste the job posting or client&apos;s project requirements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste the job description or project requirements..." 
                className="min-h-[200px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
          )}

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleGenerate}
            disabled={!resumeText.trim() || !jobDescription.trim() || generating}
          >
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating Proposal...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Proposal
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {!proposal ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <FileText className="h-16 w-16 mb-4 opacity-20" />
              <p className="max-w-sm">Paste your resume and the job description, then click &quot;Generate Proposal&quot; to get a concise, professional, ready-to-send proposal.</p>
              <div className="mt-4 text-xs space-y-1">
                <p>✓ Bold, confident opening line</p>
                <p>✓ Concise and human-sounding</p>
                <p>✓ References specific JD requirements</p>
                <p>✓ Highlights your relevant experience</p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Proposal
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={generating}>
                      <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <><Check className="h-4 w-4 mr-1 text-emerald-500" /> Copied</> : <><Copy className="h-4 w-4 mr-1" /> Copy</>}
                    </Button>
                  </div>
                </div>
                <CardDescription>Ready to send. Copy and paste directly.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 border rounded-lg p-6 text-sm leading-relaxed whitespace-pre-wrap">
                  {proposal}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
