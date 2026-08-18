import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const SKILL_GAP_SYSTEM = `
You are an expert Career Skills Intelligence Analyst. You analyze skill gaps between a candidate's current profile and their target role.

You MUST return exactly valid JSON. No markdown, no extra text.

Respond with this exact JSON structure:
{
  "overallMatch": <number 0-100>,
  "summary": "<2-sentence executive summary of the gap analysis>",
  "currentSkillsFound": ["<skill1>", "<skill2>"],
  "missingCriticalSkills": ["<skill1>", "<skill2>"],
  "learningRoadmap": [
    {
      "skill": "<skill name>",
      "priority": "<High|Medium|Low>",
      "timeToLearn": "<e.g. 1 week, 2-3 weeks>",
      "whyItMatters": "<1 sentence explaining why this is important for the target role>",
      "resources": ["<resource 1>", "<resource 2>"]
    }
  ],
  "quickWins": ["<immediate action 1>", "<immediate action 2>"],
  "longTermPlan": ["<strategic goal 1>", "<strategic goal 2>"]
}
`

export async function POST(req: NextRequest) {
  try {
    const { targetRole, currentSkills, experienceLevel } = await req.json()

    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required." }, { status: 400 })
    }

    const userPrompt = `Analyze the skill gap for the following:

TARGET ROLE: ${targetRole}
CURRENT SKILLS: ${currentSkills || "Not specified — analyze based on common profiles for this target role"}
EXPERIENCE LEVEL: ${experienceLevel || "Mid-Level"}

Generate a precise, actionable skill gap analysis with a personalized learning roadmap. Focus on the most in-demand skills for ${targetRole} in today's job market.`

    const messages = [
      { role: "system" as const, content: [MASTER_SYSTEM_PROMPT, SKILL_GAP_SYSTEM].join("\n") },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed, raw } = await runAIPipeline(messages, "skill-gap")

    if (parsed && typeof parsed.overallMatch === "number") {
      return NextResponse.json(parsed)
    }

    // Fallback parse attempt
    return NextResponse.json({
      overallMatch: parsed?.overallMatch ?? 65,
      summary: parsed?.summary ?? raw ?? "Analysis complete.",
      currentSkillsFound: parsed?.currentSkillsFound ?? [],
      missingCriticalSkills: parsed?.missingCriticalSkills ?? [],
      learningRoadmap: parsed?.learningRoadmap ?? [],
      quickWins: parsed?.quickWins ?? [],
      longTermPlan: parsed?.longTermPlan ?? [],
    })
  } catch (error: any) {
    console.error("Skill gap error:", error)
    return NextResponse.json({ error: "Failed to analyze skill gap." }, { status: 500 })
  }
}
