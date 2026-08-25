"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bot, 
  User, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Compass, 
  Zap, 
  Target, 
  Code,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from "lucide-react"

interface Message {
  role: "assistant" | "user"
  content: string
}

const STARTER_PROMPTS = [
  {
    icon: Code,
    title: "Frontend & Performance",
    prompt: "How do I become a top Frontend Engineer specializing in high-performance UI and modern web design?"
  },
  {
    icon: Target,
    title: "Career Milestones",
    prompt: "I want to transition from Mid to Senior Engineer. What specific milestones should I hit?"
  },
  {
    icon: Zap,
    title: "Interview Coaching",
    prompt: "Can you run a mock behavioral interview with me for a Full Stack Developer position?"
  },
  {
    icon: Compass,
    title: "Standout Projects",
    prompt: "What kind of complex full-stack projects stand out most to FAANG/Tier-1 engineering managers?"
  }
]

function renderFormattedText(text: string, isUser: boolean) {
  // Try parsing JSON if content looks like JSON
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  const candidate = jsonMatch ? jsonMatch[1].trim() : trimmed

  if (candidate.startsWith("{") && candidate.endsWith("}")) {
    try {
      const data = JSON.parse(candidate)
      if (data.overallMatch !== undefined || data.learningRoadmap || data.summary) {
        return (
          <div className="space-y-3 pt-1">
            {data.overallMatch !== undefined && (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  🎯 Match Score: {data.overallMatch}%
                </span>
              </div>
            )}
            {data.summary && (
              <p className="text-sm font-medium leading-relaxed">{data.summary}</p>
            )}
            {Array.isArray(data.keyHighlights) && data.keyHighlights.length > 0 && (
              <div className="space-y-1 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Highlights:</p>
                <div className="space-y-1">
                  {data.keyHighlights.map((h: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(data.learningRoadmap) && data.learningRoadmap.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> Action Roadmap:
                </p>
                <div className="space-y-2">
                  {data.learningRoadmap.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-foreground">
                        <span>{idx + 1}. {item.skill}</span>
                        <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/40">
                          {item.priority || "High"} Priority • {item.timeToLearn}
                        </span>
                      </div>
                      {item.whyItMatters && <p className="text-muted-foreground text-[11px]">{item.whyItMatters}</p>}
                      {item.practicalProject && (
                        <p className="text-[11px] text-primary font-medium">🛠️ Project: {item.practicalProject}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }
    } catch {
      // Continue standard rendering
    }
  }

  // Parse lines with markdown styling
  const lines = text.split("\n")
  return (
    <div className="space-y-1.5 leading-relaxed text-sm">
      {lines.map((line, lIdx) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return <div key={lIdx} className="h-2" />

        // Headings
        if (trimmedLine.startsWith("### ")) {
          return (
            <h3 key={lIdx} className={`text-sm font-bold pt-2 pb-0.5 ${isUser ? "text-white" : "text-primary flex items-center gap-1.5"}`}>
              {trimmedLine.replace("### ", "")}
            </h3>
          )
        }
        if (trimmedLine.startsWith("## ")) {
          return (
            <h2 key={lIdx} className={`text-base font-bold pt-2.5 pb-1 ${isUser ? "text-white" : "text-foreground"}`}>
              {trimmedLine.replace("## ", "")}
            </h2>
          )
        }

        // Bullet points
        if (trimmedLine.startsWith("• ") || trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
          const content = trimmedLine.replace(/^[•\-\*]\s*/, "")
          return (
            <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm pl-1">
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${isUser ? "bg-white" : "bg-primary"}`} />
              <span className="flex-1">{formatInline(content, isUser)}</span>
            </div>
          )
        }

        // Numbered list
        const numMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/)
        if (numMatch) {
          return (
            <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm pl-1">
              <span className={`font-bold shrink-0 text-xs mt-0.5 ${isUser ? "text-white" : "text-primary"}`}>
                {numMatch[1]}.
              </span>
              <span className="flex-1">{formatInline(numMatch[2], isUser)}</span>
            </div>
          )
        }

        return (
          <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">
            {formatInline(line, isUser)}
          </p>
        )
      })}
    </div>
  )
}

function formatInline(str: string, isUser: boolean) {
  const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
  return parts.map((part, pIdx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={pIdx} className={isUser ? "font-bold text-white" : "font-bold text-foreground"}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={pIdx} className="italic opacity-90">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={pIdx} className={`px-1.5 py-0.5 rounded text-xs font-mono ${isUser ? "bg-white/20 text-white" : "bg-muted text-primary"}`}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

export default function CareerCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! I'm your **CareerOS AI Coach**. Whether you're building a targeted technical roadmap, mastering high-performance frontend engineering, or prepping for interviews — I'm here to guide you step-by-step.\n\nWhat are you currently working on or aiming to achieve?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt || input).trim()
    if (!textToSend || isLoading) return
    
    setInput("")
    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.content }])
    } catch {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I ran into a temporary hiccup connecting to the coaching engine. Please try asking your question again." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat session refreshed! What career goals, skill gaps, or interview topics would you like to explore?"
      }
    ])
  }

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col h-[calc(100vh-5.5rem)] max-w-6xl mx-auto">
      {/* Compact Top Header */}
      <div className="flex items-center justify-between px-1 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              AI Career Coach
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetChat} 
          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer h-7 px-2"
          title="Reset conversation"
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Clear Chat
        </Button>
      </div>

      {/* Main Full-Height Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden border border-border/80 shadow-md bg-card/90 backdrop-blur-xs min-h-0 rounded-xl">
        {/* Chat Messages Viewport */}
        <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 bg-background/40">
          {/* Starter prompts */}
          {messages.length <= 1 && (
            <div className="space-y-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground text-center">
                Suggested Topics to Start:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {STARTER_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border/60 bg-card hover:bg-accent/80 hover:border-primary/40 text-left transition-all duration-150 cursor-pointer group shadow-2xs"
                  >
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg, i) => {
            const isUser = msg.role === "user"
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
                <div className={`flex gap-2.5 max-w-[92%] sm:max-w-[82%] ${isUser ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs mt-0.5 ${
                    isUser 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted border border-border/80 text-primary"
                  }`}>
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1 group min-w-0">
                    <div className={`p-3 sm:p-4 rounded-xl text-sm leading-relaxed shadow-2xs ${
                      isUser 
                        ? "bg-primary text-primary-foreground rounded-tr-xs" 
                        : "bg-card border border-border/80 text-foreground rounded-tl-xs"
                    }`}>
                      {renderFormattedText(msg.content, isUser)}
                    </div>

                    {/* Actions on Assistant messages */}
                    {!isUser && (
                      <div className="flex items-center gap-2 px-1">
                        <button
                          onClick={() => handleCopyMessage(msg.content, i)}
                          className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center bg-muted border border-border/80 text-primary">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-1.5 shadow-2xs">
                  <span className="text-xs text-muted-foreground font-medium mr-1.5">Coach is thinking</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Bar */}
        <div className="p-3 bg-card border-t border-border/80 shrink-0">
          <div className="flex gap-2 items-end max-w-4xl mx-auto">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your career roadmap, interview prep, skill gaps, or tech transitions..."
              className="min-h-[44px] max-h-32 text-xs sm:text-sm resize-none bg-background/80 border-border/80 rounded-xl focus-visible:ring-primary/40 py-2.5 px-3"
              rows={1}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
