/**
 * CareerOS AI v3 — Interview Prompt Builders
 *
 * Implements Adaptive Difficulty Scaling based on Ecosystem Memory
 * (Previous Answer Scores).
 */

import { MASTER_SYSTEM_PROMPT } from "./master-system"
import { SELF_REVIEW_INSTRUCTIONS } from "./self-review"
import { buildContext, type AIContext } from "./context"
import { INTERVIEW_QUESTIONS_SCHEMA, INTERVIEW_FEEDBACK_SCHEMA } from "./schemas"

// ─── Questions Generator ────────────────────────────────────

const INTERVIEW_QUESTIONS_SYSTEM = `
─────────────────────────────────────
ROLE: CAREEROS ADAPTIVE INTERVIEWER
─────────────────────────────────────

You conduct mock interviews that dynamically scale in difficulty.

─────────────────────────────────────
V3 ADAPTIVE SCALING
─────────────────────────────────────

Check the Context for "PREVIOUS ANSWER SCORE" (if available).
- If the user scored > 85: Ramp up the difficulty. Ask a complex system design or edge-case question.
- If the user scored < 50: Ramp down the difficulty. Ask a foundational or strictly behavioral question to build confidence.
- If no previous score exists: Start at a medium difficulty baseline based on their Target Role.

─────────────────────────────────────
STRICT RULES
─────────────────────────────────────
- Return exactly 1 highly targeted question (or a small set if requested).
- You MUST fill out the Multi-Pass Reasoning block before generating the final output.
- You MUST provide a Confidence Score.
`

export function buildInterviewQuestionsMessages(ctx: AIContext): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = [
    MASTER_SYSTEM_PROMPT,
    INTERVIEW_QUESTIONS_SYSTEM,
    SELF_REVIEW_INSTRUCTIONS,
  ].join("\n")

  const contextBlock = buildContext(ctx)

  const userPrompt = `Generate the next adaptive interview question.
${contextBlock}

─────────────────────────────────────
OUTPUT FORMAT
─────────────────────────────────────

Return ONLY valid JSON matching this exact schema:

${INTERVIEW_QUESTIONS_SCHEMA}`

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]
}

// ─── Feedback Evaluator ─────────────────────────────────────

const INTERVIEW_FEEDBACK_SYSTEM = `
─────────────────────────────────────
ROLE: CAREEROS INTERVIEW FEEDBACK ENGINE
─────────────────────────────────────

You evaluate answers with ruthless honesty but constructive guidance.

─────────────────────────────────────
V3 EVALUATION PROTOCOL
─────────────────────────────────────

1. Calculate independent scores for Technical Accuracy, Communication, Confidence, and Problem Solving.
2. Provide a "Recruiter Note" (What would a recruiter secretly write down?).
3. Predict Salary Level based on answer maturity.
4. Generate an "Improved Answer" and an "Ideal Answer".
5. Generate an adaptive "Follow-Up Question" specifically targeting a weakness in their current answer.

─────────────────────────────────────
STRICT RULES
─────────────────────────────────────
- Return ONLY valid JSON matching the schema.
- You MUST fill out the Multi-Pass Reasoning block.
- You MUST provide a Confidence Score.
`

export function buildInterviewFeedbackMessages(ctx: AIContext): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = [
    MASTER_SYSTEM_PROMPT,
    INTERVIEW_FEEDBACK_SYSTEM,
    SELF_REVIEW_INSTRUCTIONS,
  ].join("\n")

  const contextBlock = buildContext(ctx)

  const userPrompt = `Evaluate this interview answer.
${contextBlock}

─────────────────────────────────────
OUTPUT FORMAT
─────────────────────────────────────

Return ONLY valid JSON matching this exact schema:

${INTERVIEW_FEEDBACK_SCHEMA}`

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]
}
