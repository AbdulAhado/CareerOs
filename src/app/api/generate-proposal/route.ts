import { NextRequest, NextResponse } from "next/server"
import { buildProposalMessages } from "@/lib/ai/proposal"
import { runAIPipeline } from "@/lib/ai/pipeline"

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Both resume and job description are required." }, { status: 400 })
    }

    const messages = buildProposalMessages({ resumeText, jobDescription })
    const { raw } = await runAIPipeline(messages, "proposal-generator")

    return NextResponse.json({ proposal: raw })
  } catch (error: any) {
    console.error("Proposal generation error:", error)
    return NextResponse.json({ error: "Failed to generate proposal." }, { status: 500 })
  }
}
