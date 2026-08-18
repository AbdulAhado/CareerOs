"use client"

import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Target,
  ChevronRight,
  CheckCircle2,
  FileCheck2,
  Bot,
  Code,
  TrendingUp,
  Star,
  Check,
  ArrowUpRight,
  Search,
  Download,
  PenTool,
  MessageSquare,
  BarChart3,
  FileText,
  Users,
  Copy,
  Sliders,
  Layers,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d11] text-zinc-100 selection:bg-primary/30 selection:text-white overflow-x-hidden">

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute top-[800px] -left-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute top-[1800px] right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ─── NAVBAR ─── */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-white/10 bg-[#0d0d11]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Logo className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white">CareerOS</span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-primary -mt-1">
              AI Command Center
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/resume-builder" className="hover:text-white transition-colors flex items-center gap-1.5 text-zinc-200">
            Resume Builder
            <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-semibold">Core</span>
          </Link>
          <a href="#ats-scanner" className="hover:text-white transition-colors">ATS Analyzer</a>
          <a href="#proposals" className="hover:text-white transition-colors">Proposal AI</a>
          <a href="#interview-coach" className="hover:text-white transition-colors">Interview Coach</a>
          <a href="#templates" className="hover:text-white transition-colors">Templates</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5 text-sm font-medium">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-5 text-sm font-semibold transition-all hover:scale-[1.02]">
              Start Free
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HERO SECTION — Nexora Layout (Left Text, Right Floating UI)      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full pt-12 pb-20 lg:pt-20 lg:pb-32 relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* LEFT — Text Content */}
              <div className="lg:col-span-6 space-y-7">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-primary font-semibold">New:</span>
                  <span>CareerOS 2.0 AI Engine is live</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
                  The Executive Command Center for your{" "}
                  <span className="text-primary">Career</span>
                </h1>

                {/* Subtitle */}
                <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                  Transform your job search with data-driven AI. Build ATS-optimized resumes, analyze job description matches, generate tailored proposals, and master interviews.
                </p>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                  <Link href="/resume-builder">
                    <Button size="lg" className="w-full sm:w-auto h-13 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2">
                      Start Building Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-13 px-7 text-base font-semibold border-white/15 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 rounded-xl backdrop-blur-md">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Trust Checklist */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Free Resume Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Instant ATS Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Export PDF & DOCX</span>
                  </div>
                </div>
              </div>

              {/* RIGHT — Floating Nexora-Style Dashboard Mockup */}
              <div className="lg:col-span-6 relative lg:pl-4">

                {/* Main Dashboard Panel */}
                <div className="relative rounded-3xl border border-white/15 bg-zinc-950/90 p-5 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(220,38,38,0.12)] backdrop-blur-xl">

                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs text-zinc-500 font-mono ml-2">careeros.app/dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400">
                        <Search className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="hidden sm:inline">Search AI tools...</span>
                      </div>
                      <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                        OS
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content Grid */}
                  <div className="flex gap-4">

                    {/* Mini Left Nav */}
                    <div className="hidden sm:flex flex-col gap-1 w-36 shrink-0 p-2 rounded-xl bg-zinc-900/60 border border-white/5 text-xs text-zinc-400">
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Core Tools</div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium">
                        <PenTool className="h-3.5 w-3.5" /> Builder
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400">
                        <FileCheck2 className="h-3.5 w-3.5" /> ATS Match
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400">
                        <Sparkles className="h-3.5 w-3.5" /> Proposals
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400">
                        <Bot className="h-3.5 w-3.5" /> AI Coach
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400">
                        <Code className="h-3.5 w-3.5" /> GitHub
                      </div>
                    </div>

                    {/* Main Workspace Area */}
                    <div className="flex-1 space-y-3.5 min-w-0">

                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-bold text-white">Career Intelligence Overview</h3>
                          <p className="text-[11px] text-zinc-400">Target Role: Senior Software Engineer</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                          Active Optimization
                        </Badge>
                      </div>

                      {/* Stat Metric Cards */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                          <div className="text-[10px] font-medium text-zinc-300">Resume Score</div>
                          <div className="text-xl font-bold text-white mt-0.5">94%</div>
                          <div className="text-[9px] text-emerald-400 font-medium flex items-center gap-0.5 mt-0.5">
                            <ArrowUpRight className="h-2.5 w-2.5" /> +18% increase
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10">
                          <div className="text-[10px] font-medium text-zinc-400">ATS Match</div>
                          <div className="text-xl font-bold text-white mt-0.5">88%</div>
                          <div className="text-[9px] text-emerald-400 font-medium mt-0.5">Passes top filters</div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10">
                          <div className="text-[10px] font-medium text-zinc-400">Applications</div>
                          <div className="text-xl font-bold text-white mt-0.5">12</div>
                          <div className="text-[9px] text-zinc-400 font-medium mt-0.5">3 interviews set</div>
                        </div>
                      </div>

                      {/* Activity List */}
                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs">
                        <div className="text-[11px] font-semibold text-zinc-300">Recent Insights</div>
                        <div className="space-y-1.5 text-[10px]">
                          <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              Resume ATS Score verified at 94%
                            </span>
                            <span className="text-zinc-500">2h ago</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3 text-primary" />
                              Proposal generated for Stripe Senior role
                            </span>
                            <span className="text-zinc-500">5h ago</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Top Right */}
                <div className="hidden sm:flex absolute -top-5 -right-4 z-20 items-center gap-3 p-3 pr-4 rounded-2xl bg-zinc-900/95 border border-white/15 backdrop-blur-xl shadow-2xl animate-float-slow">
                  <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">AI Career Coach</div>
                    <div className="text-[10px] text-zinc-400">Live STAR interview feedback</div>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="hidden sm:flex absolute -bottom-5 -left-4 z-20 items-center gap-3 p-3 pr-4 rounded-2xl bg-zinc-900/95 border border-white/15 backdrop-blur-xl shadow-2xl animate-float-reverse">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">ATS Keyword Match 96%</div>
                    <div className="text-[10px] text-emerald-400">Ready for top tech firms</div>
                  </div>
                </div>

                {/* Floating Badge 3: Bottom Right Rating */}
                <div className="hidden md:flex absolute -bottom-6 right-6 z-20 items-center gap-2.5 p-2.5 pr-3.5 rounded-2xl bg-zinc-900/95 border border-white/15 backdrop-blur-xl shadow-2xl">
                  <div className="flex -space-x-1.5">
                    <div className="h-7 w-7 rounded-full ring-2 ring-zinc-900 bg-primary flex items-center justify-center text-[9px] font-bold text-white">AK</div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-zinc-900 bg-purple-600 flex items-center justify-center text-[9px] font-bold text-white">SL</div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-zinc-900 bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">MR</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
                      <Star className="h-3 w-3 fill-amber-400" />
                      4.9/5
                    </div>
                    <div className="text-[9px] text-zinc-400">From 10,000+ candidates</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* DEDICATED FEATURE SHOWCASE (Scroll-down features with visual mockups) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="w-full py-20 lg:py-32 bg-[#09090d] border-t border-white/10 relative">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-14 space-y-28">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Comprehensive Career Suite
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Engineered for maximum recruiter callbacks
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg">
                Every tool is purposefully built with cutting-edge AI to eliminate friction, beat screening filters, and showcase your best achievements.
              </p>
            </div>

            {/* FEATURE 1: SMART RESUME BUILDER (CORE) */}
            <div id="resume-builder" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  <PenTool className="h-3.5 w-3.5" /> Core Flagship Feature
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Smart AI Resume Builder with Instant Live Previews
                </h3>
                <p className="text-zinc-400 text-base leading-relaxed">
                  Build pixel-perfect, ATS-compliant resumes with real-time AI action verb rephrasing, multiple professional templates, and seamless section management.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-zinc-300"><strong>AI Action Verb Enhancer:</strong> Rephrases bullet points into quantified, metric-driven statements.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-zinc-300"><strong>Multiple Professional Templates:</strong> Switch effortlessly between Modern, Tech, Executive, and Minimalist.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-zinc-300"><strong>1-Click Export:</strong> Download PDF & DOCX with pixel-perfect formatting preserved.</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link href="/resume-builder">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-6 font-semibold shadow-lg shadow-primary/20 flex items-center gap-2">
                      Launch Resume Builder <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual Mockup */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl border border-white/15 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>Live Resume Editor & Template Styler</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Autosaved</span>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 bg-white/5 text-zinc-200">
                        <Download className="h-3 w-3 mr-1" /> PDF
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3 p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 text-xs">
                      <div className="font-semibold text-white flex items-center justify-between">
                        <span>Work Experience</span>
                        <Badge variant="secondary" className="text-[10px]">AI Active</Badge>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/10 space-y-1.5">
                        <div className="text-[10px] text-zinc-400 font-medium">Position</div>
                        <div className="text-xs text-white font-semibold">Senior Frontend Architect • Stripe</div>
                        <div className="text-[10px] text-zinc-400 mt-2 font-medium">AI Optimization</div>
                        <div className="p-2 rounded bg-primary/10 border border-primary/20 text-[11px] text-zinc-200 leading-snug">
                          ✨ "Engineered design system adopted by 140+ developers, decreasing release cycles by 35%."
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white text-zinc-900 shadow-lg border border-zinc-200 text-left">
                      <div className="border-b border-zinc-200 pb-2">
                        <div className="text-sm font-bold text-zinc-950">Taylor Vance</div>
                        <div className="text-[10px] text-primary font-semibold">Staff Software Engineer</div>
                      </div>
                      <div className="mt-2 space-y-2 text-[9px]">
                        <div>
                          <div className="font-bold text-zinc-800 uppercase tracking-wider text-[8px]">Summary</div>
                          <p className="text-zinc-600 leading-tight mt-0.5">High-impact engineer with 7+ years designing reactive frontends and distributed systems.</p>
                        </div>
                        <div>
                          <div className="font-bold text-zinc-800 uppercase tracking-wider text-[8px]">Skills</div>
                          <p className="text-zinc-700 font-medium">React, TypeScript, Next.js, Node, GraphQL, AWS, Docker</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURE 2: ATS MATCH ANALYZER */}
            <div id="ats-scanner" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="relative rounded-3xl border border-white/15 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                      <FileCheck2 className="h-4 w-4 text-emerald-400" />
                      <span>ATS Keyword Scanner vs Job Description</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      94% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3 p-4 rounded-xl bg-zinc-900/70 border border-white/5">
                      <div className="text-xs font-semibold text-white">Score Breakdown</div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                            <span>Keyword Density</span>
                            <span className="text-emerald-400 font-bold">96%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                            <span>Hard Skills Alignment</span>
                            <span className="text-emerald-400 font-bold">92%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 rounded-xl bg-zinc-900/70 border border-white/5 text-xs">
                      <div>
                        <div className="text-[11px] font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Matched Keywords (14)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["TypeScript", "Next.js", "GraphQL", "Tailwind", "CI/CD", "Docker"].map((k) => (
                            <span key={k} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <div className="text-[11px] font-bold text-amber-400 mb-1.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Missing Recommended (2)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Kubernetes", "Microfrontends"].map((k) => (
                            <span key={k} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                              + Add {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                  <Target className="h-3.5 w-3.5" /> High-Accuracy ATS Matcher
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Beat Automated ATS Filtering Algorithms
                </h3>
                <p className="text-zinc-400 text-base leading-relaxed">
                  Compare your resume against any target job description to pinpoint missing required skills and guarantee you pass keyword screening filters.
                </p>
                <div className="pt-2">
                  <Link href="/ats-analyzer">
                    <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-xl px-6 py-6 font-semibold flex items-center gap-2">
                      Scan Your Resume <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* FEATURE 3: AI PROPOSAL GENERATOR */}
            <div id="proposals" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5" /> AI Proposal Engine
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Generate Tailor-Made Proposals in Seconds
                </h3>
                <p className="text-zinc-400 text-base leading-relaxed">
                  Upload your resume and paste any target job description. Our AI generates a concise, hyper-targeted pitch highlighting your exact relevance.
                </p>
                <div className="pt-2">
                  <Link href="/proposal-generator">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-6 font-semibold shadow-lg shadow-primary/20 flex items-center gap-2">
                      Generate a Proposal <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative rounded-3xl border border-white/15 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>AI Generated Outreach Proposal</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-zinc-300 hover:text-white">
                      <Copy className="h-3 w-3 mr-1" /> Copy to Clipboard
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-3 text-xs text-zinc-300 leading-relaxed">
                    <p className="font-semibold text-white">
                      Subject: Senior Full-Stack Engineer — Scaling High-Throughput Architectures for Stripe
                    </p>
                    <p>Dear Hiring Team,</p>
                    <p>
                      Having led architecture scaling microservices handling <span className="text-primary font-medium">12M+ daily requests with 99.99% uptime</span>, I am confident in directly accelerating your reliability roadmap.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURE 4: AI MOCK INTERVIEW COACH */}
            <div id="interview-coach" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="relative rounded-3xl border border-white/15 bg-zinc-950/80 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                      <span>Live STAR Interview Simulation</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">
                      STAR Score: 9.2/10
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 font-bold text-xs">
                        AI
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-zinc-300">CareerOS Executive Coach</div>
                        <p className="text-zinc-300 leading-relaxed">
                          "Tell me about a high-stakes technical disagreement you had with a teammate and how you resolved it."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                  <Bot className="h-3.5 w-3.5" /> Interactive AI Mock Interviews
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Master Behavioral & Technical Questions with Instant Feedback
                </h3>
                <p className="text-zinc-400 text-base leading-relaxed">
                  Practice with role-specific AI interview coaches to get STAR technique evaluations in real-time.
                </p>
                <div className="pt-2">
                  <Link href="/interview-coach">
                    <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-xl px-6 py-6 font-semibold flex items-center gap-2">
                      Start Mock Session <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* FEATURE 5 & 6: GITHUB ANALYZER & SKILL ROADMAP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-zinc-950 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Code className="h-6 w-6" />
                </div>
                <h4 className="text-2xl font-bold text-white">GitHub Impact Analyzer</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Turn raw commits into recruiter-friendly portfolio bullet points with repo scoring and code quality insights.
                </p>
                <Link href="/github-analyzer" className="block">
                  <Button variant="ghost" className="w-full justify-between text-zinc-300 hover:text-white hover:bg-white/5">
                    Scan GitHub Profile <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-zinc-950 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h4 className="text-2xl font-bold text-white">Skill Gap & Career Roadmap</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Uncover missing skills and personalized learning milestones required for target senior positions.
                </p>
                <Link href="/skill-gap" className="block">
                  <Button variant="ghost" className="w-full justify-between text-zinc-300 hover:text-white hover:bg-white/5">
                    View Career Roadmap <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* TEMPLATES SHOWCASE */}
        <section id="templates" className="w-full py-24 bg-[#0d0d11] border-t border-white/10 relative">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-14 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Layers className="h-3.5 w-3.5" />
                ATS-Optimized Designs
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Battle-tested templates recruiters love
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Modern Executive", desc: "Best for Software & Tech Roles" },
                { name: "Minimalist Classic", desc: "Best for Corporate & Finance" },
                { name: "Tech Architecture", desc: "Best for DevOps & Leads" },
              ].map((t) => (
                <div key={t.name} className="group rounded-3xl border border-white/15 bg-zinc-950 p-5 space-y-4 hover:border-primary/50 transition-all hover:shadow-2xl">
                  <div className="h-64 rounded-2xl bg-white p-4 text-zinc-900 overflow-hidden relative shadow-inner">
                    <div className="h-2 w-16 bg-primary rounded mb-2" />
                    <div className="text-xs font-bold">{t.name}</div>
                    <div className="text-[9px] text-zinc-500 border-b pb-1 mb-2">Clean typography with skills section</div>
                    <div className="space-y-1.5 text-[8px] text-zinc-600">
                      <div className="h-2 bg-zinc-200 rounded w-full" />
                      <div className="h-2 bg-zinc-200 rounded w-4/5" />
                      <div className="h-2 bg-zinc-200 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-zinc-400">{t.desc}</p>
                    </div>
                    <Link href="/resume-builder">
                      <Button size="sm" className="bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-xl text-xs">
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full py-24 bg-gradient-to-b from-[#0d0d11] to-[#08080b] border-t border-white/10 relative overflow-hidden">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <div className="relative rounded-3xl border border-white/15 bg-gradient-to-r from-primary/20 via-purple-900/20 to-rose-900/20 p-8 sm:p-14 text-center space-y-6 overflow-hidden backdrop-blur-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
                <Award className="h-4 w-4 text-amber-400" />
                Land 3x More Interviews
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
                Ready to accelerate your career trajectory?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/resume-builder">
                  <Button size="lg" className="h-13 px-9 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xl shadow-primary/25">
                    Build Your Resume Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 py-12 bg-[#08080b]">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Logo className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-white">CareerOS</span>
            <span className="text-xs text-zinc-500">© {new Date().getFullYear()} CareerOS AI. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <Link href="/resume-builder" className="hover:text-white transition-colors">Resume Builder</Link>
            <Link href="/ats-analyzer" className="hover:text-white transition-colors">ATS Analyzer</Link>
            <Link href="/proposal-generator" className="hover:text-white transition-colors">Proposal Generator</Link>
            <Link href="/interview-coach" className="hover:text-white transition-colors">Interview Coach</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
