/**
 * CareerOS AI v3 — Ecosystem Memory
 *
 * The UserIntelligenceProfile serves as the centralized state for the AI Ecosystem.
 * Every feature writes to and reads from this profile so the AI remembers context
 * across the entire platform.
 */

export interface UserIntelligenceProfile {
  // Core Identity
  targetRole?: string
  yearsOfExperience?: number
  expectedSalary?: string
  preferredCompanies?: string[]

  // AI Assessments (Populated by various analyzers)
  technicalLevel?: "Entry" | "Mid" | "Senior" | "Lead" | "Principal"
  communicationLevel?: "Needs Work" | "Good" | "Excellent"
  confidenceLevel?: "Low" | "Medium" | "High"

  // Cross-Feature Scores
  atsReadinessScore?: number
  interviewReadinessScore?: number
  resumeScore?: number
  linkedinScore?: number
  portfolioScore?: number

  // Career State
  strengths?: string[]
  identifiedWeaknesses?: string[]
  currentRoadmap?: string[] // e.g., ["Learn React", "Build Portfolio", "Apply to FAANG"]

  // Specific Constraints
  requiresVisaSponsorship?: boolean
  securityClearance?: string
  locationPreference?: string[]
  employmentGaps?: Array<{ start: string; end: string; reason: string }>
}
