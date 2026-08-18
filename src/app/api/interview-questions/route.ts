import { NextRequest, NextResponse } from "next/server"
import { buildInterviewQuestionsMessages } from "@/lib/ai/interview"
import { runAIPipeline } from "@/lib/ai/pipeline"

export async function POST(req: NextRequest) {
  try {
    const { targetRole, technologies, experienceLevel, resumeText, skills, projects } = await req.json()

    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required." }, { status: 400 })
    }

    // Build a rich additional context string that includes technologies & experience
    const techContext = technologies?.length
      ? `TECHNOLOGIES: ${Array.isArray(technologies) ? technologies.join(", ") : technologies}`
      : ""
    const levelContext = experienceLevel ? `EXPERIENCE LEVEL: ${experienceLevel}` : ""
    const additionalContext = [techContext, levelContext].filter(Boolean).join("\n")

    const messages = buildInterviewQuestionsMessages({
      targetRole,
      resumeText,
      skills: skills ? (Array.isArray(skills) ? skills : [skills]) : undefined,
      projects: projects ? (Array.isArray(projects) ? projects : [projects]) : undefined,
      additionalContext: additionalContext || undefined,
    })
    const { parsed } = await runAIPipeline(messages, "interview-questions")

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("Interview questions error:", error)
    return NextResponse.json({ error: "Failed to generate questions." }, { status: 500 })
  }
}
