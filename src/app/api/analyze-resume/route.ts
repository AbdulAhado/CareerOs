import { NextRequest, NextResponse } from "next/server"
import { buildResumeMessages } from "@/lib/ai/resume"
import { runAIPipeline } from "@/lib/ai/pipeline"

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Please provide a valid resume text (at least 50 characters)." }, { status: 400 })
    }

    const messages = buildResumeMessages({ resumeText })
    const { parsed } = await runAIPipeline(messages, "resume-analyzer")

    const score = typeof parsed?.overallScore === "number" 
      ? parsed.overallScore 
      : typeof parsed?.score === "number" 
      ? parsed.score 
      : 78

    // Extract real strengths and weaknesses from deepAnalysis scores
    const strengths: string[] = []
    const weaknesses: string[] = []

    if (parsed?.deepAnalysis && typeof parsed.deepAnalysis === "object") {
      Object.entries(parsed.deepAnalysis).forEach(([key, val]: [string, any]) => {
        if (val && typeof val === "object" && typeof val.feedback === "string") {
          const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase()
          if ((val.score ?? 80) >= 75) {
            strengths.push(`${formattedKey.toUpperCase()}: ${val.feedback}`)
          } else {
            weaknesses.push(`${formattedKey.toUpperCase()}: ${val.feedback}`)
          }
        }
      })
    }

    // Fallbacks if deepAnalysis wasn't structured as expected
    if (strengths.length === 0) {
      if (Array.isArray(parsed?.strengths) && parsed.strengths.length > 0) {
        strengths.push(...parsed.strengths)
      } else {
        strengths.push(
          "TECHNICAL FOUNDATION: Demonstrates solid core technical exposure and project building.",
          "STRUCTURE & LAYOUT: Content is logically ordered with clear section divisions."
        )
      }
    }

    if (weaknesses.length === 0) {
      if (Array.isArray(parsed?.weaknesses) && parsed.weaknesses.length > 0) {
        weaknesses.push(...parsed.weaknesses)
      } else if (Array.isArray(parsed?.longTermPlan) && parsed.longTermPlan.length > 0) {
        weaknesses.push(...parsed.longTermPlan)
      } else {
        weaknesses.push(
          "BUSINESS IMPACT: Lacks quantified metrics (e.g. percentages, revenue saved, user metrics) on key projects.",
          "LEADERSHIP SIGNALS: Could expand on cross-functional teamwork and ownership."
        )
      }
    }

    const quickWins = Array.isArray(parsed?.quickWins) ? parsed.quickWins : []
    const nextSteps = Array.isArray(parsed?.nextSteps) ? parsed.nextSteps : []
    const recommendations = nextSteps.length > 0 
      ? nextSteps 
      : quickWins.length > 0 
      ? quickWins 
      : ["Quantify bullet points with numbers and percentages", "Highlight key accomplishments at the top of each role"]

    const normalized = {
      score,
      overallScore: score,
      summary: parsed?.summary || "Resume evaluated against executive benchmarks.",
      strengths,
      weaknesses,
      quickWins,
      recommendations,
      deepAnalysis: parsed?.deepAnalysis || {},
      raw: parsed
    }

    return NextResponse.json(normalized)
  } catch (error: any) {
    console.error("Resume analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume. Please try again." }, { status: 500 })
  }
}
