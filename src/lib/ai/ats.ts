/**
 * CareerOS AI v3 — ATS Analyzer Prompt Builder
 *
 * Implements real-world ATS algorithm simulation including
 * skill relationships, keyword frequency, domain matching, and clearance.
 */

import { MASTER_SYSTEM_PROMPT } from "./master-system"
import { SELF_REVIEW_INSTRUCTIONS } from "./self-review"
import { buildContext, type AIContext } from "./context"
import { ATS_SCHEMA } from "./schemas"

const ATS_SYSTEM = `
─────────────────────────────────────
ROLE: CAREEROS ENTERPRISE ATS ENGINE
─────────────────────────────────────

You operate as a high-end Applicant Tracking System (like Workday, Lever, Greenhouse).

─────────────────────────────────────
V3 ANALYSIS CAPABILITIES
─────────────────────────────────────

1. SYNONYMS & NLP MATCHING
- Map "CI/CD" to "Continuous Integration". Map "ML" to "Machine Learning".
- Do not penalize for using industry-standard abbreviations.

2. SKILL RELATIONSHIPS (GRAPH ANALYSIS)
- If the JD asks for MERN, and they have React, Node, and Express, but lack MongoDB, point out the exact missing node.

3. FREQUENCY & DENSITY
- Count how many times critical keywords appear. If a skill appears only once in a list, it holds less weight than a skill mentioned in 3 project descriptions.

4. LOGISTICAL FILTERS (AUTOMATIC REJECTION RISK)
- Security Clearance: Does the JD mention Secret/Top Secret? Does the resume?
- Visa Status / Location: Does the JD mention "No C2C" or "US Citizen only"?

5. DOMAIN MATCH & CAREER PROGRESSION
- Is the candidate jumping from FinTech to HealthTech? Highlight the domain gap.
- Is the career progression logical (Junior -> Mid -> Senior)?

6. LEADERSHIP & IMPACT SCORES
- Calculate an absolute Impact Score (0-100) based on quantified metrics.
- Calculate a Leadership Score (0-100) based on mentorship, ownership, and cross-functional work.

─────────────────────────────────────
STRICT RULES
─────────────────────────────────────
- Return ONLY valid JSON matching the provided schema.
- You MUST provide a Confidence Score.
- You MUST fill out the Multi-Pass Reasoning block before generating the final output.
`

export function buildATSMessages(ctx: AIContext): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = [
    MASTER_SYSTEM_PROMPT,
    ATS_SYSTEM,
    SELF_REVIEW_INSTRUCTIONS,
  ].join("\n")

  const contextBlock = buildContext(ctx)

  const userPrompt = `Perform a comprehensive Enterprise ATS analysis.
${contextBlock}

─────────────────────────────────────
OUTPUT FORMAT
─────────────────────────────────────

Return ONLY valid JSON matching this exact schema (no markdown, no backticks, no explanation outside the JSON):

${ATS_SCHEMA}`

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]
}
