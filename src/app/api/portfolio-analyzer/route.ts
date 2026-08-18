import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const PORTFOLIO_SYSTEM = `
You are a senior UI/UX designer and tech recruiter evaluating personal developer portfolios.

Analyze the given portfolio URL / details and provide objective, actionable feedback.

You MUST return exactly valid JSON. No markdown, no extra text.

Respond with this exact JSON structure:
{
  "score": <number 0-100>,
  "metrics": {
    "ux": <number 0-100>,
    "performance": <number 0-100>,
    "accessibility": <number 0-100>,
    "content": <number 0-100>
  },
  "feedback": [
    "<Specific observation 1 about typography, visual balance, or structure>",
    "<Specific observation 2 about mobile responsiveness or hierarchy>",
    "<Specific observation 3 about recruiter clarity and project presentation>"
  ],
  "recommendations": [
    "<Specific improvement action 1 with concrete design/code advice>",
    "<Specific improvement action 2>",
    "<Specific improvement action 3>",
    "<Specific improvement action 4>"
  ]
}
`

export async function POST(req: NextRequest) {
  try {
    const { url, description } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "Portfolio URL is required." }, { status: 400 })
    }

    const userPrompt = `Analyze this portfolio:
URL: ${url}
${description ? `ADDITIONAL DETAILS: ${description}` : ""}

Evaluate visual design, recruiter appeal, project layout, performance signals, and accessibility.`

    const messages = [
      { role: "system" as const, content: MASTER_SYSTEM_PROMPT + "\n" + PORTFOLIO_SYSTEM },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "portfolio-analyzer")

    return NextResponse.json({
      score: parsed?.score ?? 75,
      metrics: parsed?.metrics ?? { ux: 80, performance: 70, accessibility: 85, content: 75 },
      feedback: parsed?.feedback ?? [],
      recommendations: parsed?.recommendations ?? []
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
