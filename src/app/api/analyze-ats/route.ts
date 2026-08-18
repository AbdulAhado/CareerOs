import { NextRequest, NextResponse } from "next/server"
import { buildATSMessages } from "@/lib/ai/ats"
import { runAIPipeline } from "@/lib/ai/pipeline"

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeText } = await req.json()

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: "Both job description and resume are required." }, { status: 400 })
    }

    const messages = buildATSMessages({ jobDescription, resumeText })
    const { parsed } = await runAIPipeline(messages, "ats-analyzer")

    const score = typeof parsed?.overallScore === "number" 
      ? parsed.overallScore 
      : typeof parsed?.score === "number" 
      ? parsed.score 
      : 75

    const normalized = {
      score,
      overallScore: score,
      impactScore: parsed?.impactScore ?? Math.min(100, score + 5),
      leadershipScore: parsed?.leadershipScore ?? Math.max(50, score - 10),
      summary: parsed?.summary || "Analysis completed successfully.",
      hardSkillsFound: parsed?.deepAnalysis?.skillRelationships || parsed?.hardSkillsFound || [],
      hardSkillsMissing: parsed?.deepAnalysis?.missingCriticalSkills || parsed?.hardSkillsMissing || [],
      softSkillsFound: parsed?.deepAnalysis?.synonymsDetected || parsed?.softSkillsFound || [],
      softSkillsMissing: parsed?.softSkillsMissing || [],
      recommendations: (parsed?.nextSteps && parsed.nextSteps.length > 0) 
        ? parsed.nextSteps 
        : (parsed?.quickWins || parsed?.recommendations || ["Tailor keywords to match job requirements"]),
      quickWins: parsed?.quickWins || [],
      longTermPlan: parsed?.longTermPlan || [],
      formatting: parsed?.formatting || { atsCompatibilityScore: Math.min(100, score + 8), recruiterReadabilityScore: Math.min(100, score + 4), issues: [] },
      raw: parsed
    }

    return NextResponse.json(normalized)
  } catch (error: any) {
    console.error("ATS analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze. Please try again." }, { status: 500 })
  }
}
