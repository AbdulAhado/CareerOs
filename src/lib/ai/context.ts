/**
 * CareerOS AI v3 — Context Engine
 *
 * Dynamically builds context blocks from all available user data,
 * including the centralized UserIntelligenceProfile (Memory).
 */

import type { UserIntelligenceProfile } from "./memory"

export interface AIContext extends Partial<UserIntelligenceProfile> {
  resumeText?: string
  jobDescription?: string
  skills?: string[]
  projects?: string[]
  previousMessages?: Array<{ role: string; content: string }>
  additionalContext?: string
  questionIndex?: number
  question?: string
  answer?: string
  previousAnswerScore?: number // For adaptive difficulty scaling
}

/**
 * Builds a formatted context string from all available user data.
 * Sections with no data are omitted entirely.
 */
export function buildContext(ctx: AIContext): string {
  const sections: string[] = []

  // Global Memory / Intelligence Profile
  if (ctx.targetRole) sections.push(`TARGET ROLE: ${ctx.targetRole}`)
  if (ctx.yearsOfExperience !== undefined) sections.push(`YEARS OF EXPERIENCE: ${ctx.yearsOfExperience}`)
  if (ctx.expectedSalary) sections.push(`TARGET SALARY: ${ctx.expectedSalary}`)
  if (ctx.preferredCompanies?.length) sections.push(`PREFERRED COMPANIES: ${ctx.preferredCompanies.join(", ")}`)
  
  if (ctx.technicalLevel) sections.push(`TECHNICAL LEVEL: ${ctx.technicalLevel}`)
  if (ctx.communicationLevel) sections.push(`COMMUNICATION LEVEL: ${ctx.communicationLevel}`)
  if (ctx.confidenceLevel) sections.push(`CONFIDENCE LEVEL: ${ctx.confidenceLevel}`)
  
  if (ctx.strengths?.length) sections.push(`KNOWN STRENGTHS: ${ctx.strengths.join(", ")}`)
  if (ctx.identifiedWeaknesses?.length) sections.push(`IDENTIFIED WEAKNESSES: ${ctx.identifiedWeaknesses.join(", ")}`)
  if (ctx.currentRoadmap?.length) sections.push(`CURRENT ROADMAP PROGRESS:\n${ctx.currentRoadmap.map((p, i) => `${i + 1}. ${p}`).join("\n")}`)
  
  // Cross-Feature Scores
  const scores = []
  if (ctx.atsReadinessScore !== undefined) scores.push(`ATS Score: ${ctx.atsReadinessScore}`)
  if (ctx.interviewReadinessScore !== undefined) scores.push(`Interview Readiness: ${ctx.interviewReadinessScore}`)
  if (ctx.resumeScore !== undefined) scores.push(`Resume Quality: ${ctx.resumeScore}`)
  if (scores.length > 0) sections.push(`ECOSYSTEM SCORES:\n${scores.join(" | ")}`)

  // Constraints
  if (ctx.requiresVisaSponsorship) sections.push(`REQUIRES VISA SPONSORSHIP: Yes`)
  if (ctx.securityClearance) sections.push(`SECURITY CLEARANCE: ${ctx.securityClearance}`)
  if (ctx.employmentGaps?.length) sections.push(`EMPLOYMENT GAPS:\n${ctx.employmentGaps.map(g => `${g.start} to ${g.end} - ${g.reason}`).join("\n")}`)

  // Current Interaction Context
  if (ctx.resumeText) sections.push(`RESUME:\n${ctx.resumeText}`)
  if (ctx.jobDescription) sections.push(`JOB DESCRIPTION:\n${ctx.jobDescription}`)
  
  // Interview Specific
  if (ctx.question) sections.push(`CURRENT INTERVIEW QUESTION: ${ctx.question}`)
  if (ctx.answer) sections.push(`CANDIDATE'S ANSWER: ${ctx.answer}`)
  if (ctx.previousAnswerScore !== undefined) sections.push(`PREVIOUS ANSWER SCORE: ${ctx.previousAnswerScore} (Use this for adaptive difficulty scaling)`)

  if (ctx.additionalContext) sections.push(`ADDITIONAL CONTEXT:\n${ctx.additionalContext}`)

  if (sections.length === 0) return ""

  return `\n─────────────────────────────────────\nUSER INTELLIGENCE & CONTEXT\n─────────────────────────────────────\n${sections.join("\n\n")}\n─────────────────────────────────────`
}
