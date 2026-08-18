"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Loader2,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  BookOpen,
  Wrench,
  Code2,
  Send,
  Award,
  ChevronRight,
  RefreshCw,
  X,
  ArrowRight,
  Layers,
  Clock,
} from "lucide-react"

interface QuestionItem {
  question: string
  category?: string
  type?: string
  difficulty?: string
  evaluationCriteria?: string
}

// Common tech stacks for quick-add chips
const TECH_PRESETS: Record<string, string[]> = {
  "Frontend": ["React", "TypeScript", "Next.js", "CSS", "Redux", "Tailwind"],
  "Backend": ["Node.js", "Express", "PostgreSQL", "REST APIs", "Redis", "Docker"],
  "Full-Stack": ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Docker"],
  "Data/AI": ["Python", "Pandas", "NumPy", "SQL", "Machine Learning", "PyTorch"],
  "DevOps": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Linux"],
  "Mobile": ["React Native", "TypeScript", "iOS", "Android", "Expo", "Firebase"],
}

const EXPERIENCE_LEVELS = [
  { label: "Junior (0–2 yrs)", value: "junior" },
  { label: "Mid-Level (2–5 yrs)", value: "mid" },
  { label: "Senior (5–8 yrs)", value: "senior" },
  { label: "Lead / Architect (8+ yrs)", value: "lead" },
]

export default function InterviewCoach() {
  // Setup flow state
  const [setupStep, setSetupStep] = useState<1 | 2>(1)
  const [targetRole, setTargetRole] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")

  // Session state
  const [sessionStarted, setSessionStarted] = useState(false)
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [activeCategory, setActiveCategory] = useState<"All" | "Theoretical" | "Practical" | "Technical">("All")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [error, setError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // SpeechRecognition setup
  useEffect(() => {
    if (typeof window === "undefined") return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = "en-US"
    rec.onresult = (e: any) => {
      let text = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) text += e.results[i][0].transcript + " "
      }
      if (text) setAnswer(prev => (prev ? prev + " " + text.trim() : text.trim()))
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Voice dictation isn't supported in your browser. Please type your answer.")
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.92
    utt.onend = () => setIsPlayingAudio(false)
    utt.onerror = () => setIsPlayingAudio(false)
    setIsPlayingAudio(true)
    window.speechSynthesis.speak(utt)
  }

  // Technology chip management
  const addTech = (tech: string) => {
    const t = tech.trim()
    if (t && !technologies.includes(t)) setTechnologies(prev => [...prev, t])
    setTechInput("")
  }

  const removeTech = (t: string) => setTechnologies(prev => prev.filter(x => x !== t))

  const addPresetStack = (preset: string[]) => {
    setTechnologies(prev => {
      const merged = [...prev]
      preset.forEach(t => { if (!merged.includes(t)) merged.push(t) })
      return merged
    })
  }

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && techInput.trim()) {
      e.preventDefault()
      addTech(techInput)
    }
    if (e.key === "Backspace" && !techInput && technologies.length > 0) {
      setTechnologies(prev => prev.slice(0, -1))
    }
  }

  // Start interview session
  const handleStart = async () => {
    if (!targetRole.trim() || technologies.length === 0) return
    setLoadingQuestions(true)
    setError("")

    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, technologies, experienceLevel }),
      })

      if (!res.ok) throw new Error("Failed to generate questions")

      const data = await res.json()
      const raw: any[] = Array.isArray(data.questions) ? data.questions : (Array.isArray(data) ? data : [])

      if (raw.length === 0) throw new Error("No questions generated. Please try again.")

      const CATS = ["Theoretical", "Practical", "Technical"]
      const formatted: QuestionItem[] = raw.map((q: any, idx: number) => {
        if (typeof q === "string") {
          return { question: q, category: CATS[idx % 3], difficulty: "medium" }
        }
        const cat = q.category || q.type
        const normalizedCat = CATS.find(c => c.toLowerCase() === cat?.toLowerCase()) || CATS[idx % 3]
        return {
          question: q.question || "",
          category: normalizedCat,
          difficulty: q.difficulty || "medium",
          evaluationCriteria: q.evaluationCriteria,
        }
      })

      setQuestions(formatted)
      setSessionStarted(true)
      setActiveCategory("All")
      setCurrentQuestionIndex(0)
      setFeedback(null)
      setAnswer("")
    } catch (err: any) {
      setError(err.message || "Failed to start session.")
    } finally {
      setLoadingQuestions(false)
    }
  }

  const filteredQuestions = questions.filter(q =>
    activeCategory === "All" ? true : (q.category || "").toLowerCase() === activeCategory.toLowerCase()
  )

  const currentQ: QuestionItem = filteredQuestions[currentQuestionIndex] || { question: "What is your primary area of expertise?", category: "Theoretical", difficulty: "easy" }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || analyzing) return
    setAnalyzing(true)
    setError("")

    try {
      const res = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQ.question, answer, targetRole }),
      })

      if (!res.ok) throw new Error("Failed to evaluate answer")
      const data = await res.json()
      setFeedback(data)
    } catch (err: any) {
      setError(err.message || "Failed to evaluate answer.")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => (prev < filteredQuestions.length - 1 ? prev + 1 : 0))
    setAnswer("")
    setFeedback(null)
    textareaRef.current?.focus()
  }

  const handleReset = () => {
    setSessionStarted(false)
    setSetupStep(1)
    setQuestions([])
    setFeedback(null)
    setAnswer("")
    setError("")
  }

  // Safely extract feedback fields
  const score = feedback ? (feedback.overallScore ?? feedback.score ?? 0) : 0
  const strengths = feedback?.deepAnalysis?.strengths ?? feedback?.strengths ?? ""
  const weaknesses = feedback?.deepAnalysis?.weaknesses ?? feedback?.weaknesses ?? ""
  const improvedAnswer = feedback?.improvedAnswer ?? feedback?.idealAnswer ?? ""

  const categoryCounts = {
    Theoretical: questions.filter(q => q.category?.toLowerCase() === "theoretical").length,
    Practical: questions.filter(q => q.category?.toLowerCase() === "practical").length,
    Technical: questions.filter(q => q.category?.toLowerCase() === "technical").length,
  }

  // ─── RENDER ──────────────────────────────────────────────────────────

  return (
    <div className="flex-1 p-6 sm:p-8 pt-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <MessageSquare className="h-7 w-7 text-primary" />
            AI Mock Interview Coach
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-world questions from Glassdoor, LeetCode, and top-company interview banks.
          </p>
        </div>

        {sessionStarted && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs font-semibold px-3 py-1">
              {targetRole}
            </Badge>
            <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> New Session
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SETUP WIZARD — Not yet started             */}
      {/* ═══════════════════════════════════════════ */}
      {!sessionStarted && (
        <div className="max-w-xl mx-auto mt-4 space-y-6">

          {/* Step Indicator */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-sm font-semibold ${setupStep === 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${setupStep === 1 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground bg-muted"}`}>1</div>
              Role & Experience
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className={`flex items-center gap-2 text-sm font-semibold ${setupStep === 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${setupStep === 2 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground bg-muted"}`}>2</div>
              Technologies
            </div>
          </div>

          {/* STEP 1: Role + Experience */}
          {setupStep === 1 && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">What role are you interviewing for?</CardTitle>
                <CardDescription>Enter the exact job title and your experience level so questions are properly calibrated.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Job Title</label>
                  <Input
                    placeholder="e.g. Senior Frontend Engineer, Full-Stack Developer, DevOps Lead"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && targetRole.trim() && setSetupStep(2)}
                    className="h-11 text-sm"
                    autoFocus
                  />
                  {/* Quick role shortcuts */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Software Engineer", "Full-Stack Developer", "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "Data Scientist", "Product Manager"].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setTargetRole(r)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${targetRole === r ? "bg-primary text-primary-foreground border-primary" : "bg-secondary hover:bg-primary/10 hover:text-primary border-transparent"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map(lvl => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setExperienceLevel(lvl.value)}
                        className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${experienceLevel === lvl.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/40 hover:border-primary/40 text-foreground"}`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 opacity-60" />
                          {lvl.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-11 font-semibold shadow-md shadow-primary/20"
                  onClick={() => setSetupStep(2)}
                  disabled={!targetRole.trim()}
                >
                  Continue to Tech Stack <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Technologies */}
          {setupStep === 2 && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Which technologies are you being assessed on?</CardTitle>
                    <CardDescription className="mt-1">
                      Questions will be tailored specifically to these. Add your full stack.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-medium text-xs">{targetRole}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">

                {/* Quick-add preset stacks */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Quick-Add Tech Stacks
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(TECH_PRESETS).map(([label, stack]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => addPresetStack(stack)}
                        className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all"
                      >
                        + {label} Stack
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tag input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Add Individual Technologies
                  </label>
                  <div className="min-h-[56px] flex flex-wrap gap-2 p-3 rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring cursor-text" onClick={() => document.getElementById("tech-input")?.focus()}>
                    {technologies.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                        {t}
                        <button type="button" onClick={() => removeTech(t)} className="hover:text-primary/60 ml-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="tech-input"
                      type="text"
                      value={techInput}
                      onChange={e => setTechInput(e.target.value)}
                      onKeyDown={handleTechKeyDown}
                      placeholder={technologies.length === 0 ? "Type a technology and press Enter (e.g. React, Node.js, PostgreSQL)..." : "Add more..."}
                      className="flex-1 min-w-[180px] bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Press <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">,</kbd> to add each technology</p>
                </div>

                {technologies.length > 0 && (
                  <div className="p-3 rounded-xl bg-muted/50 border text-xs text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      AI will generate questions specifically using: <strong className="text-foreground">{technologies.join(", ")}</strong> — from real interview sources like Glassdoor and LeetCode.
                    </span>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button variant="outline" onClick={() => setSetupStep(1)} className="flex-shrink-0">
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-11 font-semibold shadow-md shadow-primary/20"
                    onClick={handleStart}
                    disabled={technologies.length === 0 || loadingQuestions}
                  >
                    {loadingQuestions ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Real Questions...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" /> Start Interview Session</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ACTIVE INTERVIEW SESSION                   */}
      {/* ═══════════════════════════════════════════ */}
      {sessionStarted && (
        <div className="space-y-5">

          {/* Category Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-2.5 rounded-2xl border">
            <Tabs
              value={activeCategory}
              onValueChange={(v: any) => { setActiveCategory(v); setCurrentQuestionIndex(0); setFeedback(null); setAnswer("") }}
            >
              <TabsList className="h-10 grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="All" className="text-xs font-medium gap-1">
                  All <span className="ml-1 text-muted-foreground">({questions.length})</span>
                </TabsTrigger>
                <TabsTrigger value="Theoretical" className="text-xs font-medium gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  Theory <span className="ml-1 text-muted-foreground">({categoryCounts.Theoretical})</span>
                </TabsTrigger>
                <TabsTrigger value="Practical" className="text-xs font-medium gap-1">
                  <Wrench className="h-3.5 w-3.5 text-amber-500" />
                  Practical <span className="ml-1 text-muted-foreground">({categoryCounts.Practical})</span>
                </TabsTrigger>
                <TabsTrigger value="Technical" className="text-xs font-medium gap-1">
                  <Code2 className="h-3.5 w-3.5 text-purple-500" />
                  Technical <span className="ml-1 text-muted-foreground">({categoryCounts.Technical})</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 shrink-0">
              <span className="font-medium">Q {currentQuestionIndex + 1}/{filteredQuestions.length}</span>
              <Button size="sm" variant="outline" onClick={handleStart} disabled={loadingQuestions} className="h-8 text-xs gap-1">
                {loadingQuestions ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                New Set
              </Button>
            </div>
          </div>

          {/* Split View */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">

            {/* LEFT — Question + Answer */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="border-primary/25 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b pb-4 space-y-3">
                  {/* Badges row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {currentQ.category?.toLowerCase() === "theoretical" && (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 flex items-center gap-1 text-xs font-semibold">
                          <BookOpen className="h-3 w-3" /> Theory
                        </Badge>
                      )}
                      {currentQ.category?.toLowerCase() === "practical" && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center gap-1 text-xs font-semibold">
                          <Wrench className="h-3 w-3" /> Practical
                        </Badge>
                      )}
                      {currentQ.category?.toLowerCase() === "technical" && (
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 flex items-center gap-1 text-xs font-semibold">
                          <Code2 className="h-3 w-3" /> Technical
                        </Badge>
                      )}
                      {currentQ.difficulty && (
                        <Badge variant="outline" className={`capitalize text-xs ${currentQ.difficulty === "hard" ? "border-rose-400 text-rose-500" : currentQ.difficulty === "easy" ? "border-emerald-400 text-emerald-600" : "border-amber-400 text-amber-600"}`}>
                          {currentQ.difficulty}
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakQuestion(currentQ.question)}
                      className={`h-8 text-xs gap-1.5 ${isPlayingAudio ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                    >
                      <Volume2 className="h-4 w-4" />
                      {isPlayingAudio ? "Playing..." : "Listen"}
                    </Button>
                  </div>

                  {/* Question text */}
                  <CardTitle className="text-xl sm:text-2xl font-bold leading-snug text-foreground">
                    &quot;{currentQ.question}&quot;
                  </CardTitle>

                  {/* Evaluation hint */}
                  {currentQ.evaluationCriteria && (
                    <div className="p-3 bg-background/80 rounded-xl border text-xs text-muted-foreground flex items-start gap-2.5 shadow-sm">
                      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-px" />
                      <span><strong className="text-foreground">What they look for: </strong>{currentQ.evaluationCriteria}</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  {/* Answer header */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your Answer
                      <span className="ml-2 text-[11px] font-normal normal-case">
                        ({answer.trim().split(/\s+/).filter(Boolean).length} words)
                      </span>
                    </label>
                    <Button
                      size="sm"
                      variant={isListening ? "destructive" : "outline"}
                      onClick={toggleMic}
                      className="h-8 text-xs gap-1.5"
                    >
                      {isListening ? (
                        <><MicOff className="h-3.5 w-3.5 animate-pulse" /> Stop Dictation</>
                      ) : (
                        <><Mic className="h-3.5 w-3.5 text-primary" /> Speak Answer</>
                      )}
                    </Button>
                  </div>

                  <Textarea
                    ref={textareaRef}
                    placeholder={
                      currentQ.category?.toLowerCase() === "practical"
                        ? "Structure your answer: Situation → Task → Action → Result (STAR method)..."
                        : currentQ.category?.toLowerCase() === "technical"
                        ? "Be precise: mention exact data structures, time/space complexity, or architecture patterns..."
                        : "Explain the concept clearly, then give a real-world example from your experience..."
                    }
                    className="min-h-[180px] text-sm leading-relaxed resize-y focus-visible:ring-primary"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={analyzing}
                  />

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setAnswer(""); setFeedback(null); }}
                      disabled={!answer && !feedback}
                      className="text-xs text-muted-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Clear
                    </Button>

                    <div className="flex items-center gap-2">
                      {feedback && (
                        <Button variant="outline" size="sm" onClick={handleNextQuestion} className="text-xs h-9">
                          Next Q <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      )}
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!answer.trim() || analyzing}
                        className="font-semibold shadow-md shadow-primary/20 h-9"
                      >
                        {analyzing ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</>
                        ) : (
                          <><Send className="mr-2 h-4 w-4" />{feedback ? "Re-Evaluate" : "Submit Answer"}</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT — Feedback Panel */}
            <div className="lg:col-span-5">
              {feedback ? (
                <Card className="border-emerald-500/30 shadow-lg">
                  <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-emerald-500" />
                        <CardTitle className="text-base font-bold">AI Evaluation</CardTitle>
                      </div>
                      <div className={`text-2xl font-extrabold tabular-nums ${score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                        {score}/100
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4 text-sm">
                    {strengths && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> What you nailed
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-muted-foreground leading-relaxed">
                          {typeof strengths === "string" ? strengths : JSON.stringify(strengths)}
                        </div>
                      </div>
                    )}

                    {weaknesses && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                          <AlertTriangle className="h-3.5 w-3.5" /> Needs improvement
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-muted-foreground leading-relaxed">
                          {typeof weaknesses === "string" ? weaknesses : JSON.stringify(weaknesses)}
                        </div>
                      </div>
                    )}

                    {improvedAnswer && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <Sparkles className="h-3.5 w-3.5" /> Exemplar Answer (STAR format)
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/60 border text-xs text-muted-foreground leading-relaxed">
                          {improvedAnswer}
                        </div>
                      </div>
                    )}

                    <Button variant="outline" className="w-full text-xs h-9 mt-2" onClick={handleNextQuestion}>
                      Next Question <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center text-center p-10 border-dashed min-h-[360px] bg-muted/20 text-muted-foreground">
                  <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1">Awaiting Your Answer</h4>
                  <p className="text-xs max-w-xs leading-relaxed">
                    Type or speak your answer on the left, then click <strong>Submit Answer</strong> to get real-time scoring, strengths, improvements, and an exemplar STAR response.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
