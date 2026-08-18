import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const GITHUB_SYSTEM = `
You are a senior engineering recruiter and software architect who evaluates GitHub profiles. 
Given a GitHub username and optional context about their repos/bio, you provide a realistic professional assessment.

You MUST return exactly valid JSON. No markdown, no extra text.

Respond with this exact JSON structure:
{
  "score": <number 0-100>,
  "summary": "<2-sentence executive assessment of the GitHub profile>",
  "profileStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasForImprovement": ["<area 1>", "<area 2>"],
  "recruiterPerspective": "<What a recruiter or engineering manager would think looking at this profile — 2 sentences>",
  "topLanguagesInferred": ["<language 1>", "<language 2>"],
  "portfolioBulletPoints": [
    "<Resume-ready portfolio bullet point 1>",
    "<Resume-ready portfolio bullet point 2>",
    "<Resume-ready portfolio bullet point 3>"
  ],
  "actionItems": [
    "<Specific action item 1 to improve the profile>",
    "<Specific action item 2>",
    "<Specific action item 3>"
  ]
}
`

export async function POST(req: NextRequest) {
  try {
    const { username, bio, repoCount, topRepos, languages } = await req.json()

    if (!username) {
      return NextResponse.json({ error: "GitHub username is required." }, { status: 400 })
    }

    const context = [
      `GITHUB USERNAME: ${username}`,
      bio ? `BIO: ${bio}` : "",
      repoCount ? `PUBLIC REPOS: ${repoCount}` : "",
      topRepos?.length ? `TOP REPOSITORIES: ${topRepos.join(", ")}` : "",
      languages?.length ? `LANGUAGES USED: ${languages.join(", ")}` : "",
    ].filter(Boolean).join("\n")

    const userPrompt = `Analyze this GitHub developer profile and provide a professional assessment:

${context}

If limited info is available, make realistic inferences based on the username and provide genuinely useful, actionable feedback for improving a GitHub profile for job searching.`

    const messages = [
      { role: "system" as const, content: [MASTER_SYSTEM_PROMPT, GITHUB_SYSTEM].join("\n") },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "github-analyzer")

    return NextResponse.json({
      score: parsed?.score ?? 70,
      summary: parsed?.summary ?? "Analysis complete.",
      profileStrengths: parsed?.profileStrengths ?? [],
      areasForImprovement: parsed?.areasForImprovement ?? [],
      recruiterPerspective: parsed?.recruiterPerspective ?? "",
      topLanguagesInferred: parsed?.topLanguagesInferred ?? [],
      portfolioBulletPoints: parsed?.portfolioBulletPoints ?? [],
      actionItems: parsed?.actionItems ?? [],
    })
  } catch (error: any) {
    console.error("GitHub analyzer error:", error)
    return NextResponse.json({ error: "Failed to analyze GitHub profile." }, { status: 500 })
  }
}
