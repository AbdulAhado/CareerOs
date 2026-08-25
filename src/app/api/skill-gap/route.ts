import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const SKILL_GAP_SYSTEM = `
You are an expert Career Skills Intelligence Analyst. You analyze skill gaps with extreme precision and brevity.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use \`\`\`json or \`\`\`.
- Do NOT include explanations before or after the JSON.
- Do NOT include SVG, HTML, XML, or any markup.
- Your response must start with { and end with }.
- Keep all text ultra-concise, bite-sized, and skimmable.
- "summary": Exactly ONE crisp sentence (maximum 15-20 words).
- "keyHighlights": Array of 3 short bullet points (5-8 words each).
- "whyItMatters": Maximum 10-12 words.
- "quickWins": Direct, 1-line practical action items.

You MUST respond with this exact JSON structure:
{
  "overallMatch": <number 0-100>,
  "summary": "<1 short punchy verdict sentence>",
  "keyHighlights": ["<short takeaway 1>", "<short takeaway 2>", "<short takeaway 3>"],
  "currentSkillsFound": ["<skill1>", "<skill2>"],
  "missingCriticalSkills": ["<skill1>", "<skill2>"],
  "learningRoadmap": [
    {
      "skill": "<Short Skill Name>",
      "priority": "High" | "Medium" | "Low",
      "timeToLearn": "<e.g. 2 weeks>",
      "whyItMatters": "<max 10-12 words>",
      "practicalProject": "<1 short project to build, e.g. Build REST API with PostgreSQL>",
      "resources": ["<Resource 1>", "<Resource 2>"]
    }
  ],
  "quickWins": ["<1-line practical action 1>", "<1-line practical action 2>", "<1-line practical action 3>"]
}
`

export async function POST(req: NextRequest) {
  try {
    const { targetRole, currentSkills, experienceLevel } = await req.json()

    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required." }, { status: 400 })
    }

    const userPrompt = `Analyze the skill gap for:
TARGET ROLE: ${targetRole}
CURRENT SKILLS: ${currentSkills || "Not specified"}
EXPERIENCE LEVEL: ${experienceLevel || "Mid-Level"}

Return ONLY the raw JSON object. No explanations, no markdown fences.`

    const messages = [
      { role: "system" as const, content: [MASTER_SYSTEM_PROMPT, SKILL_GAP_SYSTEM].join("\n") },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "skill-gap", { expectJSON: true })

    if (parsed && typeof parsed.overallMatch === "number") {
      return NextResponse.json(parsed)
    }

    // Fallback if parsing was partial
    return NextResponse.json({
      overallMatch: parsed?.overallMatch ?? 70,
      summary: typeof parsed?.summary === "string" && !parsed.summary.includes("{") 
        ? parsed.summary 
        : "Skill gap evaluation complete against target role standards.",
      keyHighlights: Array.isArray(parsed?.keyHighlights) ? parsed.keyHighlights : [
        "Strong foundation in core technical stack",
        "Targeted gaps in architecture and tooling",
        "Fast-track roadmap ready to execute"
      ],
      currentSkillsFound: Array.isArray(parsed?.currentSkillsFound) ? parsed.currentSkillsFound : [],
      missingCriticalSkills: Array.isArray(parsed?.missingCriticalSkills) ? parsed.missingCriticalSkills : [],
      learningRoadmap: Array.isArray(parsed?.learningRoadmap) ? parsed.learningRoadmap : [],
      quickWins: Array.isArray(parsed?.quickWins) ? parsed.quickWins : []
    })
  } catch (error: any) {
    console.error("Skill gap error:", error)
    return NextResponse.json({ error: "Failed to analyze skill gap." }, { status: 500 })
  }
}
