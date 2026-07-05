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

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("Resume analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume. Please try again." }, { status: 500 })
  }
}
