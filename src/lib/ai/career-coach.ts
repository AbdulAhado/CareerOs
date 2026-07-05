/**
 * CareerOS AI v3 — Career Coach Prompt Builder
 *
 * Implements Roadmap tracking, progress milestones, and deep
 * situational analysis based on the UserIntelligenceProfile.
 */

import { MASTER_SYSTEM_PROMPT } from "./master-system"
import { SELF_REVIEW_INSTRUCTIONS } from "./self-review"
import { buildContext, type AIContext } from "./context"

const CAREER_COACH_SYSTEM = `
─────────────────────────────────────
ROLE: CAREEROS EXECUTIVE CAREER COACH & L&D STRATEGIST
─────────────────────────────────────

You act as an elite Career Coach and Learning & Development Consultant.

─────────────────────────────────────
COACHING METHODOLOGY (V3)
─────────────────────────────────────

Instead of just answering questions, you build and track ROADMAPS.

1. INTENT & ROADMAP DETECTION
- If the user asks a specific question, answer it. But ALSO identify where they are on their broader career roadmap.
- If they don't have a roadmap, propose one.

2. STRUCTURED ROADMAPS
- Break goals into sequential, measurable milestones (e.g., React -> Node -> System Design).
- Give a "Progress Tracker" update in your response.

3. CROSS-FEATURE MEMORY
- If the ecosystem scores (ATS, Resume, Interview) are low, proactively suggest fixing those before applying to jobs.

─────────────────────────────────────
STANDARD OUTPUT FORMAT
─────────────────────────────────────
Always format your responses with a premium feel using Markdown:
- **Executive Summary:** 1 sentence TLDR.
- **Deep Analysis:** Why you are giving this specific advice.
- **Your Roadmap / Next Milestone:** Concrete steps.
- **Resources:** Specific things to study or build.
- **Next Step:** The immediate action to take today.

Remember the AI Quality Layer: No generic advice, zero fluff.
`

export function buildCareerCoachMessages(
  userMessages: Array<{ role: string; content: string }>,
  context?: Partial<AIContext>
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const systemPrompt = [
    MASTER_SYSTEM_PROMPT,
    CAREER_COACH_SYSTEM,
    SELF_REVIEW_INSTRUCTIONS,
  ].join("\n")

  const contextBlock = context ? buildContext(context as AIContext) : ""

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ]

  if (contextBlock && userMessages.length > 0) {
    const firstMsg = userMessages[0]
    messages.push({
      role: firstMsg.role as "user" | "assistant",
      content: `${contextBlock}\n\n${firstMsg.content}`,
    })
    for (let i = 1; i < userMessages.length; i++) {
      messages.push({
        role: userMessages[i].role as "user" | "assistant",
        content: userMessages[i].content,
      })
    }
  } else {
    for (const msg of userMessages) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })
    }
  }

  return messages
}
