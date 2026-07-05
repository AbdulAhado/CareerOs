"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Play, Loader2 } from "lucide-react"

export default function InterviewCoach() {
  const [targetRole, setTargetRole] = useState("")
  const [sessionStarted, setSessionStarted] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [error, setError] = useState("")

  const handleStart = async () => {
    if (!targetRole) return
    setLoadingQuestions(true)
    setError("")

    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole })
      })

      if (!res.ok) throw new Error("Failed to generate questions")

      const data = await res.json()
      setQuestions(data.questions)
      setSessionStarted(true)
      setCurrentQuestionIndex(0)
      setFeedback(null)
      setAnswer("")
    } catch (err: any) {
      setError(err.message || "Failed to start session.")
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer) return
    setAnalyzing(true)
    setError("")

    try {
      const res = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: questions[currentQuestionIndex], 
          answer, 
          targetRole 
        })
      })

      if (!res.ok) throw new Error("Failed to evaluate")

      const data = await res.json()
      setFeedback(data)
    } catch (err: any) {
      setError(err.message || "Failed to evaluate answer.")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setAnswer("")
      setFeedback(null)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Interview Coach
          </h2>
          <p className="text-muted-foreground mt-1">Practice with AI-generated questions for any role.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
      )}

      {!sessionStarted ? (
        <Card className="max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle>Start a Mock Interview</CardTitle>
            <CardDescription>Enter your target role to get AI-generated interview questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="e.g. Senior Frontend Engineer" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            <Button className="w-full" onClick={handleStart} disabled={!targetRole || loadingQuestions}>
              {loadingQuestions ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Questions...</> : "Begin Session"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card className="border-primary/50 shadow-sm">
              <CardHeader className="bg-primary/5 pb-4 border-b">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>Role: {targetRole}</span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  &quot;{questions[currentQuestionIndex]}&quot;
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <span className="text-sm font-medium">Your Answer:</span>
                <Textarea 
                  placeholder="Type your answer here..." 
                  className="min-h-[200px]"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={analyzing || feedback !== null}
                />
                
                {!feedback && (
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSubmitAnswer} disabled={!answer || analyzing}>
                      {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</> : "Submit for Feedback"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {feedback && (
              <div className="flex justify-end">
                <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                  Next Question <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {feedback ? (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>AI Feedback</CardTitle>
                  <CardDescription>Evaluation based on the STAR method.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <span className="font-semibold">Answer Score</span>
                    <span className={feedback.score >= 80 ? "text-emerald-500 font-bold text-xl" : "text-amber-500 font-bold text-xl"}>
                      {feedback.score}/100
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-emerald-500 mb-2">What you did well</h4>
                    <p className="text-sm text-muted-foreground bg-emerald-500/10 p-3 rounded-md">
                      {feedback.strengths}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-rose-500 mb-2">Areas for improvement</h4>
                    <p className="text-sm text-muted-foreground bg-rose-500/10 p-3 rounded-md">
                      {feedback.weaknesses}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-primary">Suggested Answer</h4>
                    <div className="text-sm text-muted-foreground bg-background border p-4 rounded-md leading-relaxed">
                      {feedback.improvedAnswer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                <p>Submit your answer to receive detailed AI feedback.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
