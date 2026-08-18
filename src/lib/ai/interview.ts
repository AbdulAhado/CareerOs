/**
 * CareerOS AI v3 — Interview Prompt Builders
 */

import { MASTER_SYSTEM_PROMPT } from "./master-system"
import { SELF_REVIEW_INSTRUCTIONS } from "./self-review"
import { buildContext, type AIContext } from "./context"
import { INTERVIEW_QUESTIONS_SCHEMA, INTERVIEW_FEEDBACK_SCHEMA } from "./schemas"

// ─── Questions Generator ────────────────────────────────────

const INTERVIEW_QUESTIONS_SYSTEM = `
─────────────────────────────────────
ROLE: CAREEROS EXPERT TECHNICAL INTERVIEWER
─────────────────────────────────────

You generate REAL interview questions that are actually asked at top companies (Google, Meta, Amazon, Stripe, Airbnb, Microsoft, and top startups). Draw from well-known public sources: Glassdoor interview reviews, LeetCode Discuss, InterviewBit, Blind.com posts, GitHub awesome-interview-questions repos, and popular tech YouTube channels.

─────────────────────────────────────
MANDATORY QUESTION CATEGORIES — 9 TOTAL
─────────────────────────────────────

Generate exactly 9 questions — 3 in each category:

1. "Theoretical" — Core concept/fundamentals the interviewer wants you to know cold.
   Examples: "What is the difference between JWT and session-based auth?", "How does the V8 engine execute JavaScript?", "Explain CAP theorem in distributed systems."

2. "Practical" — Real-world scenario and problem-solving questions from actual interviews.
   Examples: "How would you debug a 10x API latency spike with no logs?", "How do you roll back a bad deployment in Kubernetes without downtime?", "You need to rate-limit a public REST API — walk me through your approach."

3. "Technical" — Coding logic, algorithms, system design, and architecture depth.
   Examples: "How would you implement an LRU cache?", "Explain event delegation and its performance implications.", "Design a notification service that can scale to 1M+ users."

─────────────────────────────────────
STRICT RULES
─────────────────────────────────────
- Questions MUST be SHORT: 1 tight sentence each, max 25 words.
- Questions MUST use the exact technologies from the TECHNOLOGIES context (e.g. if React is listed, ask about React — not Angular).
- Questions MUST be realistic — actually asked in real interviews at top companies.
- Cover a mix of junior, mid, and senior level questions across the 9.
- You MUST fill out the Multi-Pass Reasoning block before generating the output.
- You MUST provide a Confidence Score.
`

export function buildInterviewQuestionsMessages(ctx: AIContext): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = [
    MASTER_SYSTEM_PROMPT,
    INTERVIEW_QUESTIONS_SYSTEM,
    SELF_REVIEW_INSTRUCTIONS,
  ].join("\n")

  const contextBlock = buildContext(ctx)

  const userPrompt = `Generate 9 realistic interview questions (3 Theoretical, 3 Practical, 3 Technical) for the given role and exact tech stack. These must be real questions asked at top companies.
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

You evaluate answers with ruthless honesty but constructive, actionable guidance.

─────────────────────────────────────
V3 EVALUATION PROTOCOL
─────────────────────────────────────

1. Calculate independent scores for Technical Accuracy, Communication, Confidence, and Problem Solving.
2. Provide a "Recruiter Note" (What would a recruiter secretly write down?).
3. Predict Salary Level based on answer maturity.
4. Generate an "Improved Answer" and an "Ideal Answer" in STAR format.
5. Generate an adaptive "Follow-Up Question" targeting a weakness in their answer.

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
