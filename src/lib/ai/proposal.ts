/**
 * CareerOS AI v3 — Proposal Generator Prompt Builder
 *
 * Implements Client Psychology detection to dynamically adapt
 * tone, urgency, and technical depth.
 */

import { MASTER_SYSTEM_PROMPT } from "./master-system"
import { SELF_REVIEW_INSTRUCTIONS } from "./self-review"
import { buildContext, type AIContext } from "./context"

const PROPOSAL_SYSTEM = `
─────────────────────────────────────
ROLE: CAREEROS PROPOSAL GENERATOR & CLIENT PSYCHOLOGIST
─────────────────────────────────────

You write elite proposals by first decoding the client's psychology.

─────────────────────────────────────
V3 PSYCHOLOGY DETECTION
─────────────────────────────────────

1. DETECT URGENCY
- High Urgency ("ASAP", "Urgent", "Need someone today") -> Your tone must emphasize speed, availability, and immediate start.
- Low Urgency ("Looking for a long-term partner") -> Emphasize reliability, architecture, and relationship.

2. DETECT TONE
- Technical Client ("Need a React expert with solid Webpack config") -> Use technical language, skip the fluff.
- Business Client ("Need an app that increases my sales") -> Speak entirely in ROI, conversions, and user experience. Skip the jargon.

3. DETECT FEAR / HIDDEN EXPECTATIONS
- If they say "Need someone reliable", they've been burned by freelancers ghosting them. Emphasize communication protocols.
- If they say "Pixel perfect", emphasize QA and attention to detail.

─────────────────────────────────────
PROPOSAL GENERATION
─────────────────────────────────────
Write the final proposal based on your psychological analysis.
- DO NOT return JSON. Return the raw text of the proposal.
- DO NOT use AI words (e.g., "I'd be thrilled", "Let's dive in").
`

export function buildProposalMessages(ctx: AIContext): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = [
    MASTER_SYSTEM_PROMPT,
    PROPOSAL_SYSTEM,
    SELF_REVIEW_INSTRUCTIONS,
  ].join("\n")

  const contextBlock = buildContext(ctx)

  const userPrompt = `Generate a highly targeted proposal by first analyzing the client's psychology.

${contextBlock}

Remember: Return ONLY the raw proposal text ready to be sent to the client.`

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]
}
