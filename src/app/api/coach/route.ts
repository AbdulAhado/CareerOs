import { NextRequest, NextResponse } from "next/server"
import { buildCareerCoachMessages } from "@/lib/ai/career-coach"
import { runAIPipeline } from "@/lib/ai/pipeline"

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 })
    }

    const aiMessages = buildCareerCoachMessages(messages, context)
    const { raw } = await runAIPipeline(aiMessages, "career-coach")

    return NextResponse.json({ content: raw })
  } catch (error: any) {
    console.error("Career coach error:", error)
    return NextResponse.json({ error: "Failed to get response. Please try again." }, { status: 500 })
  }
}
