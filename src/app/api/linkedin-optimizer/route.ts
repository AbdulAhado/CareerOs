import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const LINKEDIN_SYSTEM = `
You are a LinkedIn optimization expert and personal branding specialist. You help professionals dramatically increase recruiter visibility and inbound messages.

You MUST return exactly valid JSON. No markdown, no extra text.

Respond with this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "summary": "<2-sentence assessment of the profile's current state and main opportunity>",
  "headlineSuggestions": [
    "<Optimized LinkedIn headline option 1 — keyword-rich, role-specific>",
    "<Optimized LinkedIn headline option 2 — achievement-led>",
    "<Optimized LinkedIn headline option 3 — personality + specialty>"
  ],
  "aboutSectionOptimized": "<A fully rewritten About section (150-200 words) that opens with a hook, highlights unique value, and ends with a CTA>",
  "aboutFeedback": "<2-sentence critique of what is wrong with typical About sections for this profile type>",
  "skillsToAdd": ["<skill 1>", "<skill 2>", "<skill 3>", "<skill 4>", "<skill 5>"],
  "actionItems": [
    "<Specific LinkedIn profile action item 1>",
    "<Specific action item 2>",
    "<Specific action item 3>",
    "<Specific action item 4>"
  ],
  "recruiterVisibilityTips": ["<Tip 1 to boost search ranking>", "<Tip 2>"]
}
`

export async function POST(req: NextRequest) {
  try {
    const { currentHeadline, currentAbout, targetRole, skills, yearsExperience } = await req.json()

    if (!targetRole && !currentHeadline) {
      return NextResponse.json({ error: "Target role or current headline is required." }, { status: 400 })
    }

    const userPrompt = `Optimize this LinkedIn profile:

TARGET ROLE: ${targetRole || "Not specified"}
CURRENT HEADLINE: ${currentHeadline || "Not provided"}
CURRENT ABOUT SECTION: ${currentAbout || "Not provided"}
CURRENT SKILLS: ${skills || "Not listed"}
YEARS OF EXPERIENCE: ${yearsExperience || "Not specified"}

Generate optimized headlines, a rewritten About section, missing skills to add, and actionable improvements to maximize LinkedIn search visibility and recruiter engagement.`

    const messages = [
      { role: "system" as const, content: [MASTER_SYSTEM_PROMPT, LINKEDIN_SYSTEM].join("\n") },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "linkedin-optimizer")

    return NextResponse.json({
      overallScore: parsed?.overallScore ?? 60,
      summary: parsed?.summary ?? "Profile analysis complete.",
      headlineSuggestions: parsed?.headlineSuggestions ?? [],
      aboutSectionOptimized: parsed?.aboutSectionOptimized ?? "",
      aboutFeedback: parsed?.aboutFeedback ?? "",
      skillsToAdd: parsed?.skillsToAdd ?? [],
      actionItems: parsed?.actionItems ?? [],
      recruiterVisibilityTips: parsed?.recruiterVisibilityTips ?? [],
    })
  } catch (error: any) {
    console.error("LinkedIn optimizer error:", error)
    return NextResponse.json({ error: "Failed to optimize LinkedIn profile." }, { status: 500 })
  }
}
