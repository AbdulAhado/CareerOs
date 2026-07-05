import { NextRequest, NextResponse } from "next/server"
import { buildInterviewFeedbackMessages } from "@/lib/ai/interview"
import { runAIPipeline } from "@/lib/ai/pipeline"

export async function POST(req: NextRequest) {
  try {
    const { question, answer, targetRole } = await req.json()

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required." }, { status: 400 })
    }

    const messages = buildInterviewFeedbackMessages({
      question,
      answer,
      targetRole,
    })
    const { parsed } = await runAIPipeline(messages, "interview-feedback")

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error("Interview feedback error:", error)
    return NextResponse.json({ error: "Failed to evaluate answer." }, { status: 500 })
  }
}
