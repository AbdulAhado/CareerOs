"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Network, RefreshCw, Sparkles, Copy, Check } from "lucide-react"

export default function LinkedInOptimizer() {
  const [profileUrl, setProfileUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleAnalyze = () => {
    if (!profileUrl) return
    setAnalyzing(true)
    
    // Simulate AI analysis of LinkedIn profile
    setTimeout(() => {
      setResult({
        currentHeadline: "Software Engineer at Tech Corp",
        optimizedHeadlines: [
          "Senior Software Engineer | React & Node.js Expert | Building Scalable SaaS Platforms",
          "Full Stack Developer | Cloud Architecture (AWS) | Passionate About Performance",
          "Software Engineer | TypeScript | Open Source Contributor | Turning Ideas into Code"
        ],
        aboutFeedback: "Your current 'About' section lacks a strong opening hook. Consider starting with your passion for problem-solving before listing your technical skills.",
        aboutOptimized: "With 5+ years of experience architecting high-performance web applications, I specialize in the React/Node.js ecosystem. I'm passionate about clean code, scalable architecture, and mentoring junior developers. Currently building the next generation of SaaS tools at Tech Corp.",
        actionItems: [
          "Ask for 2 recommendations from your current colleagues.",
          "Add 5 more relevant skills to max out your Top Skills section.",
          "Include a link to your deployed portfolio in your Featured section."
        ]
      })
      setAnalyzing(false)
    }, 2500)
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8 text-primary" />
          LinkedIn Optimizer
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Link</CardTitle>
              <CardDescription>Enter your LinkedIn public profile URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="https://linkedin.com/in/johndoe" 
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
              />
              <Button className="w-full" onClick={handleAnalyze} disabled={!profileUrl || analyzing}>
                {analyzing ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Optimize Profile"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why optimize?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Recruiters use LinkedIn Recruiter's search algorithm to find candidates. Optimizing your headline, about section, and skills ensures you rank higher in their search results.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Higher search visibility</li>
                <li>More inbound recruiter messages</li>
                <li>Stronger professional brand</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {!result ? (
            <Card className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-dashed min-h-[400px]">
              <Network className="h-16 w-16 mb-4 opacity-20" />
              <p>Paste your LinkedIn URL to get personalized headline suggestions and an optimized "About" section.</p>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Headline Suggestions
                  </CardTitle>
                  <CardDescription>
                    Current: <span className="italic">"{result.currentHeadline}"</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.optimizedHeadlines.map((headline: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                      <p className="text-sm font-medium">{headline}</p>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(headline, i)}>
                        {copiedIndex === i ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About Section Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-sm">
                    <strong>Feedback:</strong> {result.aboutFeedback}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Optimized Version:</h4>
                    <Textarea 
                      readOnly 
                      value={result.aboutOptimized} 
                      className="min-h-[120px] resize-none" 
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(result.aboutOptimized, 99)}>
                      {copiedIndex === 99 ? <><Check className="mr-2 h-4 w-4 text-emerald-500" /> Copied</> : <><Copy className="mr-2 h-4 w-4" /> Copy Text</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.actionItems.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
