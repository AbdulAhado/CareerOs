import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const LINKEDIN_SYSTEM = `
You are a LinkedIn Profile Optimization Specialist, Technical Recruiter, and Personal Branding Strategist.

You analyze LinkedIn profiles from TWO perspectives simultaneously:
1. LinkedIn Search/Discoverability — Will recruiters FIND this profile when searching for the target role?
2. Recruiter/Hiring Manager Conversion — Once found, will the profile CONVINCE them to reach out?

The combined objective is: DISCOVERABILITY + RELEVANCE + PROFESSIONAL POSITIONING + RECRUITER CONVERSION

CRITICAL RULES:
- Use ONLY information provided by the user. NEVER fabricate experience, companies, metrics, achievements, certifications, or technologies.
- If information is missing, explicitly say it is missing and recommend what the user should add.
- Do NOT keyword-stuff. Keywords must be naturally incorporated and truthful.
- Do NOT guarantee LinkedIn ranking — the exact algorithm is not public.
- Instead, evaluate whether the profile naturally contains relevant keywords and role positioning.

You MUST return exactly valid JSON matching this structure:
{
  "overallScore": <number 0-100>,
  "targetRole": "<the target role>",
  "summary": "<2-sentence executive assessment>",

  "headlineAnalysis": {
    "currentHeadlineScore": <number 0-100>,
    "problems": ["<specific problem 1>", "<specific problem 2>"],
    "targetRoleVisible": <boolean>,
    "techKeywordsPresent": <boolean>,
    "isGeneric": <boolean>,
    "recommendedHeadline": "<optimized headline using actual skills>",
    "alternativeHeadlines": ["<alt 1>", "<alt 2>", "<alt 3>"],
    "whyItMatters": "<why headline optimization matters for recruiters>"
  },

  "aboutAnalysis": {
    "currentScore": <number 0-100>,
    "problems": ["<problem 1>", "<problem 2>"],
    "missingInformation": ["<what should be added>"],
    "openingLinesEffective": <boolean>,
    "containsKeywords": <boolean>,
    "containsCTA": <boolean>,
    "communicatesRole": <boolean>,
    "communicatesStack": <boolean>,
    "shortVersion": "<concise optimized About (80-120 words) using ONLY real data>",
    "detailedVersion": "<comprehensive optimized About (180-250 words) using ONLY real data>"
  },

  "experienceAnalysis": [
    {
      "title": "<job title or project role>",
      "currentDescription": "<current description or 'Not provided'>",
      "currentScore": <number 0-100>,
      "problems": ["<problem 1>"],
      "improvedDescription": "<rewritten using Action + Technology + Problem + Result pattern — only from real data>",
      "keywordsToInclude": ["<keyword 1>", "<keyword 2>"]
    }
  ],

  "skillsAnalysis": {
    "primarySkills": ["<most important skills for target role>"],
    "secondarySkills": ["<supporting skills>"],
    "supportingSkills": ["<nice-to-have skills>"],
    "missingSkills": ["<skills found in resume/github/portfolio but missing from LinkedIn>"],
    "irrelevantSkills": ["<skills that don't help for target role>"],
    "skillsToPinToTop": ["<top 3 skills to pin on profile>"]
  },

  "featuredAnalysis": {
    "currentStatus": "<assessment of current featured section or 'Not provided'>",
    "recommendations": [
      {
        "item": "<what to feature>",
        "reason": "<why it demonstrates credibility>",
        "priority": "<HIGH|MEDIUM|LOW>"
      }
    ]
  },

  "recruiterSimulation": {
    "tenSecondUnderstanding": "<what a recruiter understands in 10 seconds>",
    "perceivedRole": "<what role the recruiter thinks this person targets>",
    "techStackClarity": "<are technologies clear?>",
    "evidenceOfSkills": "<what evidence proves their abilities?>",
    "whatMakesInterested": "<what stands out positively>",
    "whatCausesHesitation": "<what raises concerns>",
    "shortlistDecision": "<YES|MAYBE|NO>",
    "shortlistReasoning": "<2-3 sentence explanation>",
    "recruiterStrengths": ["<strength 1>", "<strength 2>"],
    "recruiterConcerns": ["<concern 1>", "<concern 2>"],
    "missingEvidence": ["<missing 1>", "<missing 2>"],
    "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>", "<improvement 5>"]
  },

  "searchDiscoverability": {
    "score": <number 0-100>,
    "primaryRoleKeywords": ["<keyword 1>", "<keyword 2>"],
    "technologyKeywords": ["<keyword 1>", "<keyword 2>"],
    "secondaryKeywords": ["<keyword 1>", "<keyword 2>"],
    "keywordPlacement": {
      "headline": ["<keywords that should appear in headline>"],
      "about": ["<keywords that should appear in about>"],
      "experience": ["<keywords that should appear in experience>"],
      "skills": ["<keywords that should appear in skills>"]
    }
  },

  "profileCompleteness": {
    "score": <number 0-100>,
    "sections": {
      "profilePhoto": "<COMPLETE|MISSING|UNKNOWN>",
      "banner": "<COMPLETE|MISSING|UNKNOWN>",
      "headline": "<COMPLETE|NEEDS_IMPROVEMENT|MISSING>",
      "about": "<COMPLETE|NEEDS_IMPROVEMENT|MISSING>",
      "experience": "<COMPLETE|NEEDS_IMPROVEMENT|MISSING>",
      "education": "<COMPLETE|MISSING|UNKNOWN>",
      "skills": "<COMPLETE|NEEDS_IMPROVEMENT|MISSING>",
      "featured": "<COMPLETE|MISSING|UNKNOWN>",
      "projects": "<COMPLETE|MISSING|UNKNOWN>",
      "certifications": "<COMPLETE|MISSING|UNKNOWN>",
      "recommendations": "<COMPLETE|MISSING|UNKNOWN>",
      "contactInfo": "<COMPLETE|MISSING|UNKNOWN>",
      "portfolioLink": "<COMPLETE|MISSING|UNKNOWN>",
      "githubLink": "<COMPLETE|MISSING|UNKNOWN>"
    }
  },

  "actionPlan": [
    {
      "priority": "<HIGH|MEDIUM|LOW>",
      "title": "<short title>",
      "problem": "<what is wrong>",
      "whyItMatters": "<recruiter/visibility impact>",
      "exactAction": "<specific action to take>",
      "expectedImpact": "<measurable improvement>"
    }
  ],

  "scores": {
    "discoverability": <number 0-100>,
    "headline": <number 0-100>,
    "about": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>,
    "featured": <number 0-100>,
    "completeness": <number 0-100>,
    "recruiterReadiness": <number 0-100>
  }
}
`

export async function POST(req: NextRequest) {
  try {
    const {
      currentHeadline,
      currentAbout,
      targetRole,
      skills,
      experience,
      education,
      certifications,
      featured,
      portfolioUrl,
      githubUrl,
      yearsExperience,
    } = await req.json()

    if (!targetRole && !currentHeadline) {
      return NextResponse.json({ error: "Target role or current headline is required." }, { status: 400 })
    }

    const userPrompt = `Analyze and optimize this LinkedIn profile for recruiter discoverability and conversion.

TARGET ROLE: ${targetRole || "Not specified"}
CURRENT HEADLINE: ${currentHeadline || "Not provided"}
CURRENT ABOUT SECTION: ${currentAbout || "Not provided"}
CURRENT SKILLS: ${skills || "Not listed"}
YEARS OF EXPERIENCE: ${yearsExperience || "Not specified"}
EXPERIENCE / WORK HISTORY: ${experience || "Not provided"}
EDUCATION: ${education || "Not provided"}
CERTIFICATIONS: ${certifications || "Not provided"}
FEATURED SECTION: ${featured || "Not provided"}
PORTFOLIO URL: ${portfolioUrl || "Not provided"}
GITHUB URL: ${githubUrl || "Not provided"}

Provide deeply structured analysis covering:
1. Headline optimization with specific alternatives
2. About section rewrite (short + detailed versions) using ONLY provided information
3. Experience description improvements using Action + Technology + Problem + Result pattern
4. Skills categorization and gap analysis
5. Featured section recommendations
6. Full recruiter simulation (10-second test + shortlist decision)
7. Search discoverability keyword analysis and placement mapping
8. Profile completeness assessment

NEVER fabricate experience, metrics, companies, or achievements. If data is missing, explicitly state what is missing.`

    const messages = [
      { role: "system" as const, content: [MASTER_SYSTEM_PROMPT, LINKEDIN_SYSTEM].join("\n") },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "linkedin-optimizer")

    return NextResponse.json({
      overallScore: parsed?.overallScore ?? 50,
      targetRole: parsed?.targetRole ?? targetRole ?? "Not specified",
      summary: parsed?.summary ?? "Profile analysis complete.",
      headlineAnalysis: parsed?.headlineAnalysis ?? null,
      aboutAnalysis: parsed?.aboutAnalysis ?? null,
      experienceAnalysis: parsed?.experienceAnalysis ?? [],
      skillsAnalysis: parsed?.skillsAnalysis ?? null,
      featuredAnalysis: parsed?.featuredAnalysis ?? null,
      recruiterSimulation: parsed?.recruiterSimulation ?? null,
      searchDiscoverability: parsed?.searchDiscoverability ?? null,
      profileCompleteness: parsed?.profileCompleteness ?? null,
      actionPlan: parsed?.actionPlan ?? [],
      scores: parsed?.scores ?? {},
    })
  } catch (error: any) {
    console.error("LinkedIn optimizer error:", error)
    return NextResponse.json({ error: "Failed to optimize LinkedIn profile." }, { status: 500 })
  }
}
