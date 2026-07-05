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

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("ATS analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze. Please try again." }, { status: 500 })
  }
}
