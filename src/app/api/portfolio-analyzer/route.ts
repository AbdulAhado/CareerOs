import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const PORTFOLIO_SYSTEM = `
You are simultaneously a Technical Recruiter, Engineering Hiring Manager, Freelance Client, and Senior Developer evaluating a developer's portfolio website.

You evaluate from four perspectives:
1. Recruiter (10-20 seconds) — Can I instantly tell who this person is, what role they want, and what they build?
2. Hiring Manager — Does the portfolio demonstrate real technical competence and project execution?
3. Potential Client — Would I trust this developer with my project?
4. Senior Developer — Is there evidence of solid architecture, code quality, and professional engineering?

CRITICAL RULES:
- Use ONLY information available from the URL and description provided. NEVER invent projects, technologies, metrics, or achievements.
- If information is missing, explicitly state what is missing and recommend what to add.
- Every recommendation must be specific and actionable with exact rewritten content where applicable.

You MUST return exactly valid JSON matching this structure:
{
  "overallScore": <number 0-100>,
  "targetRoleDetected": "<detected target role or the provided target role>",
  "firstImpression": {
    "tenSecondScore": <number 0-100>,
    "whoIsThisPerson": "<what a visitor understands about the person in 10 seconds>",
    "roleClarity": "<is the target role immediately clear?>",
    "techStackVisible": "<are core technologies visible above the fold?>",
    "valueProposition": "<is their unique value immediately communicated?>",
    "ctaPresent": "<is there a clear call-to-action?>",
    "verdict": "<1-2 sentence first-impression verdict>"
  },
  "heroAnalysis": {
    "currentHeadline": "<observed headline or 'Not visible/Generic'>",
    "currentSubheadline": "<observed subheadline or 'Not visible'>",
    "problems": ["<problem 1>", "<problem 2>"],
    "recommendedHeadline": "<specific rewritten headline using actual skills>",
    "recommendedSubheadline": "<specific rewritten subheadline>",
    "recommendedCTA": "<CTA button text>",
    "alternativeHeadlines": ["<alt 1>", "<alt 2>"]
  },
  "aboutAnalysis": {
    "currentAssessment": "<assessment of the current about section>",
    "problems": ["<problem 1>", "<problem 2>"],
    "communicatesRole": <boolean>,
    "communicatesTechStack": <boolean>,
    "communicatesExperience": <boolean>,
    "communicatesPersonality": <boolean>,
    "improvedAbout": "<rewritten about section using ONLY available information — do NOT invent>"
  },
  "projectsAnalysis": [
    {
      "name": "<project name>",
      "currentDescription": "<observed description or 'No description'>",
      "problemSolved": "<what problem does it solve?>",
      "technicalComplexity": "<LOW|MEDIUM|HIGH>",
      "technologies": ["<tech1>"],
      "hasLiveDemo": <boolean>,
      "hasGitHubLink": <boolean>,
      "hasScreenshots": <boolean>,
      "provesTargetRole": <boolean>,
      "strengths": ["<strength 1>"],
      "weaknesses": ["<weakness 1>"],
      "improvedDescription": "<Problem → Solution → Technology → Key Features → Technical Value>"
    }
  ],
  "uxAnalysis": {
    "navigation": { "score": <0-100>, "feedback": "<assessment>" },
    "mobileResponsiveness": { "score": <0-100>, "feedback": "<assessment>" },
    "visualHierarchy": { "score": <0-100>, "feedback": "<assessment>" },
    "typography": { "score": <0-100>, "feedback": "<assessment>" },
    "consistency": { "score": <0-100>, "feedback": "<assessment>" },
    "accessibility": { "score": <0-100>, "feedback": "<assessment>" },
    "ctaPlacement": { "score": <0-100>, "feedback": "<assessment>" },
    "recruiterUsability": { "score": <0-100>, "feedback": "<assessment>" }
  },
  "seoAnalysis": {
    "currentTitle": "<observed page title or 'Default/Missing'>",
    "currentMetaDescription": "<observed or 'Missing'>",
    "issues": ["<issue 1>", "<issue 2>"],
    "recommendedTitle": "<optimized SEO title>",
    "recommendedMetaDescription": "<optimized meta description>",
    "hasOpenGraph": "<Yes|No|Unknown>",
    "hasHTTPS": <boolean>,
    "hasFavicon": "<Yes|No|Unknown>"
  },
  "recruiterTest": {
    "shortlistDecision": "<YES|MAYBE|NO>",
    "reasoning": "<2-3 sentence explanation>",
    "strongestProjects": ["<project name>"],
    "weakestProjects": ["<project name>"],
    "missingEvidence": ["<what is missing>"],
    "highestImpactImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
  },
  "actionPlan": [
    {
      "priority": "<HIGH|MEDIUM|LOW>",
      "title": "<short title>",
      "problem": "<what is wrong>",
      "whyItMatters": "<recruiter/hiring manager impact>",
      "exactAction": "<specific step-by-step fix>",
      "expectedImpact": "<result>"
    }
  ],
  "scores": {
    "firstImpression": <number 0-100>,
    "roleClarity": <number 0-100>,
    "projects": <number 0-100>,
    "content": <number 0-100>,
    "uxDesign": <number 0-100>,
    "seo": <number 0-100>,
    "recruiterReadiness": <number 0-100>
  }
}
`

export async function POST(req: NextRequest) {
  try {
    const { url, description, targetRole } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "Portfolio URL is required." }, { status: 400 })
    }

    // Try to fetch the actual page content for richer analysis
    let pageContent = ""
    try {
      const pageRes = await fetch(url, {
        headers: { "User-Agent": "CareerOS-Analyzer/1.0" },
        signal: AbortSignal.timeout(8000),
      })
      if (pageRes.ok) {
        const html = await pageRes.text()
        // Extract meaningful text content from HTML (strip tags, scripts, styles)
        pageContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 4000) // Limit context size

        // Also extract meta tags
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)

        if (titleMatch || metaDescMatch || ogTitleMatch) {
          pageContent = [
            titleMatch ? `PAGE TITLE: ${titleMatch[1].trim()}` : "",
            metaDescMatch ? `META DESCRIPTION: ${metaDescMatch[1].trim()}` : "",
            ogTitleMatch ? `OG TITLE: ${ogTitleMatch[1].trim()}` : "",
            "",
            "PAGE TEXT CONTENT:",
            pageContent,
          ].filter(Boolean).join("\n")
        }
      }
    } catch {
      // If fetch fails, continue with URL-only analysis
    }

    const userPrompt = `Analyze this developer portfolio website for recruiter readiness and professional quality.

URL: ${url}
TARGET ROLE: ${targetRole || description || "Not specified — infer from portfolio content"}
${description ? `ADDITIONAL CONTEXT: ${description}` : ""}

${pageContent ? `EXTRACTED PAGE CONTENT:\n${pageContent}` : "Note: Could not fetch page content. Analyze based on URL and any provided context."}

Evaluate the portfolio from recruiter, hiring manager, client, and developer perspectives. Provide exact rewritten content for hero, about, and project descriptions based ONLY on information visible in the portfolio. Do NOT invent projects, technologies, or metrics.`

    const messages = [
      { role: "system" as const, content: MASTER_SYSTEM_PROMPT + "\n" + PORTFOLIO_SYSTEM },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "portfolio-analyzer")

    return NextResponse.json({
      overallScore: parsed?.overallScore ?? 50,
      targetRoleDetected: parsed?.targetRoleDetected ?? targetRole ?? "Not detected",
      firstImpression: parsed?.firstImpression ?? null,
      heroAnalysis: parsed?.heroAnalysis ?? null,
      aboutAnalysis: parsed?.aboutAnalysis ?? null,
      projectsAnalysis: parsed?.projectsAnalysis ?? [],
      uxAnalysis: parsed?.uxAnalysis ?? null,
      seoAnalysis: parsed?.seoAnalysis ?? null,
      recruiterTest: parsed?.recruiterTest ?? null,
      actionPlan: parsed?.actionPlan ?? [],
      scores: parsed?.scores ?? {},
    })
  } catch (error: any) {
    console.error("Portfolio analyzer error:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
