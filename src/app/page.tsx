"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, Zap, ChevronRight } from "lucide-react"
import { Logo } from "@/components/logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Logo className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">CareerOS</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full py-24 lg:py-32 xl:py-48 flex items-center justify-center bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-10">
            <div className="space-y-6 max-w-4xl">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span className="text-primary font-semibold mr-2">New:</span> AI Proposal Generator is live
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                The Executive Command Center for your <span className="text-primary">Career</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Transform your career trajectory with data-driven insights. Automatically optimize your resume, conquer ATS systems, and prepare for interviews with state-of-the-art AI.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20">
                  Start Optimizing for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need to land the offer</h2>
              <p className="text-muted-foreground max-w-[800px] md:text-lg">
                Stop guessing. Our suite of AI tools provides exact, actionable feedback to make you the most competitive candidate in the room.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">ATS Match Analyzer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload your resume against any job description to instantly see your exact keyword match score and discover missing required skills.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Resume Builder</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Build and edit your resume using our professional templates, featuring real-time AI suggestions for powerful action verbs.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interview Coach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Practice with dynamic mock interviews. Receive immediate, comprehensive feedback based on the STAR method to polish your answers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-background border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 max-w-[600px] mx-auto bg-primary/5 rounded-3xl p-10 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 -mr-8 -mt-8 opacity-10">
                <Logo className="w-48 h-48" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Ready to take control?</h2>
              <p className="text-muted-foreground">
                Join thousands of professionals optimizing their careers with data-driven AI.
              </p>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto mt-4">
                  Create your free account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-8 bg-background">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">CareerOS</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} CareerOS AI Team. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
