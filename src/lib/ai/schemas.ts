/**
 * CareerOS AI v3 — Output Schemas
 *
 * Enforces standard premium output structures:
 * - Multi-Pass Reasoning (Intent -> Extract -> Critic -> Revise)
 * - Confidence Scores & Explainability
 * - Standard Layout (Summary, Analysis, Quick Wins, Next Steps)
 */

// ─── Standard Output Blocks ───────────────────────────────────────────

export const CONFIDENCE_BLOCK_SCHEMA = `"confidenceScore": {
    "score": <number 0-100>,
    "reason": "<detailed explanation of why the AI is or isn't confident in this assessment>"
  }`

export const MULTIPASS_REASONING_SCHEMA = `"reasoningProcess": {
    "intentDetection": "<what is the user actually trying to achieve?>",
    "contextAnalysis": "<what constraints and signals exist in the data?>",
    "criticReview": "<internal critique of the initial draft response>",
    "revisionPlan": "<how the output was adjusted to be premium and accurate>"
  }`

export const STANDARD_OUTPUT_STRUCTURE = `"summary": "<Executive summary (1-2 sentences)>",
  "deepAnalysis": "<Detailed contextual analysis>",
  "priority": "<High|Medium|Low>",
  "quickWins": ["<Immediate actionable item 1>", "<Immediate actionable item 2>"],
  "longTermPlan": ["<Strategic goal 1>", "<Strategic goal 2>"],
  "nextSteps": ["<Exact next action to take>"]`

// ─── ATS Analysis ───────────────────────────────────────────

export interface ATSAnalysisResult {
  reasoningProcess: any
  confidenceScore: { score: number; reason: string }
  summary: string
  overallScore: number
  deepAnalysis: {
    domainMatch: string
    careerProgression: string
    titleMatch: string
    skillRelationships: string[]
    keywordFrequency: { keyword: string; occurrences: number; optimal: number }[]
    synonymsDetected: string[]
    missingCriticalSkills: string[]
    clearanceAndVisaStatus: string
  }
  formatting: { atsCompatibilityScore: number; recruiterReadabilityScore: number; issues: string[] }
  impactScore: number
  leadershipScore: number
  priority: string
  quickWins: string[]
  longTermPlan: string[]
  nextSteps: string[]
}

export const ATS_SCHEMA = `{
  ${MULTIPASS_REASONING_SCHEMA},
  ${CONFIDENCE_BLOCK_SCHEMA},
  ${STANDARD_OUTPUT_STRUCTURE.split('\\n')[0]},
  "overallScore": <number 0-100>,
  "deepAnalysis": {
    "domainMatch": "<assessment of industry fit>",
    "careerProgression": "<assessment of logical growth vs job hopping>",
    "titleMatch": "<how well the past titles align with target role>",
    "skillRelationships": ["<e.g. Has React but missing Redux/Context>"],
    "keywordFrequency": [{"keyword": "string", "occurrences": "number", "optimal": "number"}],
    "synonymsDetected": ["<resume_term -> jd_term>"],
    "missingCriticalSkills": ["<skill1>"],
    "clearanceAndVisaStatus": "<assessment of matching JD legal/location requirements>"
  },
  "formatting": {
    "atsCompatibilityScore": <number 0-100>,
    "recruiterReadabilityScore": <number 0-100>,
    "issues": ["<issue1>"]
  },
  "impactScore": <number 0-100>,
  "leadershipScore": <number 0-100>,
  "priority": "<High|Medium|Low>",
  "quickWins": ["<win1>"],
  "longTermPlan": ["<plan1>"],
  "nextSteps": ["<step1>"]
}`

// ─── Resume Analysis ────────────────────────────────────────

export interface ResumeAnalysisResult {
  reasoningProcess: any
  confidenceScore: { score: number; reason: string }
  summary: string
  overallScore: number
  deepAnalysis: {
    executivePresence: { score: number; feedback: string }
    businessImpact: { score: number; feedback: string }
    ownership: { score: number; feedback: string }
    innovation: { score: number; feedback: string }
    decisionMaking: { score: number; feedback: string }
    mentorship: { score: number; feedback: string }
    technicalDepth: { score: number; feedback: string }
    communication: { score: number; feedback: string }
    roleAlignment: { score: number; feedback: string }
    futureGrowth: { score: number; feedback: string }
    industryFit: { score: number; feedback: string }
  }
  writingStyle: string
  priority: string
  quickWins: string[]
  longTermPlan: string[]
  nextSteps: string[]
}

export const RESUME_SCHEMA = `{
  ${MULTIPASS_REASONING_SCHEMA},
  ${CONFIDENCE_BLOCK_SCHEMA},
  ${STANDARD_OUTPUT_STRUCTURE.split('\\n')[0]},
  "overallScore": <number 0-100>,
  "deepAnalysis": {
    "executivePresence": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "businessImpact": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "ownership": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "innovation": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "decisionMaking": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "mentorship": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "technicalDepth": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "communication": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "roleAlignment": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "futureGrowth": { "score": <0-100>, "feedback": "<detailed explainability>" },
    "industryFit": { "score": <0-100>, "feedback": "<detailed explainability>" }
  },
  "writingStyle": "<assessment of tone and grammar>",
  "priority": "<High|Medium|Low>",
  "quickWins": ["<win1>"],
  "longTermPlan": ["<plan1>"],
  "nextSteps": ["<step1>"]
}`

// ─── Interview Questions ────────────────────────────────────

export const INTERVIEW_QUESTIONS_SCHEMA = `{
  ${MULTIPASS_REASONING_SCHEMA},
  ${CONFIDENCE_BLOCK_SCHEMA},
  "questions": [
    {
      "question": "<short 1-sentence realistic interview question>",
      "category": "<Theoretical|Practical|Technical>",
      "type": "<Theoretical|Practical|Technical>",
      "difficulty": "<easy|medium|hard>",
      "evaluationCriteria": "<what a great answer looks like in 1 sentence>"
    }
  ]
}`

// ─── Interview Feedback ─────────────────────────────────────

export const INTERVIEW_FEEDBACK_SCHEMA = `{
  ${MULTIPASS_REASONING_SCHEMA},
  ${CONFIDENCE_BLOCK_SCHEMA},
  ${STANDARD_OUTPUT_STRUCTURE.split('\\n')[0]},
  "overallScore": <number 0-100>,
  "dimensionScores": {
    "technicalAccuracy": { "score": <0-100>, "reason": "<why>" },
    "communication": { "score": <0-100>, "reason": "<why>" },
    "confidence": { "score": <0-100>, "reason": "<why>" },
    "problemSolving": { "score": <0-100>, "reason": "<why>" }
  },
  "deepAnalysis": {
    "strengths": "<what the candidate did well>",
    "weaknesses": "<specific areas for improvement>"
  },
  "recruiterNotes": "<what a recruiter would privately note>",
  "hiringProbability": "<Low|Medium|High|Very High>",
  "salaryLevel": "<entry|mid|senior|lead|principal based on answer quality>",
  "improvedAnswer": "<polished version of their answer>",
  "idealAnswer": "<what a perfect answer would look like>",
  "followUpQuestion": "<adaptive next question based on performance>",
  "priority": "<High|Medium|Low>",
  "quickWins": ["<win1>"],
  "longTermPlan": ["<plan1>"],
  "nextSteps": ["<step1>"]
}`
