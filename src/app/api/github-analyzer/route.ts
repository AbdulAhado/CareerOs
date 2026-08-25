import { NextRequest, NextResponse } from "next/server"
import { MASTER_SYSTEM_PROMPT } from "@/lib/ai/master-system"
import { runAIPipeline } from "@/lib/ai/pipeline"

const GITHUB_SYSTEM = `
You are a senior engineering recruiter, software architect, and developer brand strategist evaluating a GitHub profile for job-search readiness.

You evaluate from three perspectives simultaneously:
1. Technical Recruiter — scanning for role fit, stack signals, and professional presentation
2. Engineering Hiring Manager — evaluating code quality signals, project complexity, and architecture
3. Senior Developer — assessing technical depth, documentation quality, and engineering culture

CRITICAL RULES:
- Use ONLY information available in the provided data. NEVER invent repos, languages, contributions, or metrics.
- If information is missing, explicitly say what is missing and recommend what should be added.
- Every recommendation must be specific and actionable, not generic advice.

You MUST return exactly valid JSON matching this structure:
{
  "overallScore": <number 0-100>,
  "targetRoleDetected": "<detected target role from bio/repos or the provided target role>",
  "profileAnalysis": {
    "roleClarity": { "score": <0-100>, "assessment": "<Is the developer's target role immediately clear from the profile?>", "recommendation": "<specific fix>" },
    "bioQuality": { "score": <0-100>, "assessment": "<Is the bio professional, targeted, and keyword-rich?>", "recommendation": "<specific fix>" },
    "techStackVisibility": { "score": <0-100>, "assessment": "<Are relevant technologies naturally visible?>", "recommendation": "<specific fix>" },
    "portfolioLinked": { "present": <boolean>, "recommendation": "<action if missing>" },
    "linkedinLinked": { "present": <boolean>, "recommendation": "<action if missing>" },
    "profilePhotoPresent": <boolean>,
    "pinnedReposEffective": { "score": <0-100>, "assessment": "<Are the strongest repos easy to discover?>" }
  },
  "bioOptimization": {
    "currentBio": "<the current bio text or 'Not set'>",
    "problems": ["<specific problem 1>", "<specific problem 2>"],
    "recommendedBio": "<optimized bio text based on actual skills/technologies found>",
    "alternativeBios": ["<alternative bio 1>", "<alternative bio 2>"],
    "keywordsToInclude": ["<keyword 1>", "<keyword 2>", "<keyword 3>"]
  },
  "repositoryAnalysis": [
    {
      "name": "<repo name>",
      "description": "<current description or 'No description'>",
      "stars": <number>,
      "language": "<primary language>",
      "topics": ["<topic1>"],
      "strengths": ["<strength 1>"],
      "issues": ["<issue 1>"],
      "priority": "<HIGH|MEDIUM|LOW>",
      "recommendations": [
        {
          "problem": "<specific problem>",
          "whyItMatters": "<recruiter impact>",
          "exactFix": "<what to do>",
          "expectedImpact": "<result>"
        }
      ],
      "shouldPin": <boolean>,
      "improvedDescription": "<better description for this repo>"
    }
  ],
  "recruiterImpression": {
    "thirtySecondVerdict": "<What a recruiter thinks after 30 seconds on this profile — 2-3 sentences>",
    "strongSignals": ["<signal 1>", "<signal 2>"],
    "weakSignals": ["<signal 1>", "<signal 2>"],
    "missingSignals": ["<signal 1>", "<signal 2>"],
    "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>", "<improvement 5>"]
  },
  "actionPlan": [
    {
      "priority": "<HIGH|MEDIUM|LOW>",
      "title": "<short title>",
      "problem": "<what is wrong>",
      "whyItMatters": "<recruiter/hiring manager impact>",
      "exactAction": "<specific step-by-step action>",
      "expectedImpact": "<measurable improvement>"
    }
  ],
  "scores": {
    "profile": <number 0-100>,
    "repositoryQuality": <number 0-100>,
    "documentation": <number 0-100>,
    "projectRelevance": <number 0-100>,
    "technicalCredibility": <number 0-100>,
    "recruiterReadiness": <number 0-100>
  },
  "topLanguages": ["<lang1>", "<lang2>", "<lang3>"]
}
`

async function fetchGitHubProfile(username: string) {
  try {
    const headers: Record<string, string> = { "Accept": "application/vnd.github.v3+json", "User-Agent": "CareerOS-Analyzer" }
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15&type=owner`, { headers })
    ])

    if (!profileRes.ok) {
      return null
    }

    const profile = await profileRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []

    // Fetch languages for top repos
    const topRepos = Array.isArray(repos) ? repos.slice(0, 10) : []
    const reposWithLangs = await Promise.all(
      topRepos.map(async (repo: any) => {
        try {
          const langRes = await fetch(repo.languages_url, { headers })
          const languages = langRes.ok ? await langRes.json() : {}
          return { ...repo, languagesUsed: Object.keys(languages) }
        } catch {
          return { ...repo, languagesUsed: [] }
        }
      })
    )

    return { profile, repos: reposWithLangs }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { username, targetRole } = body

    if (!username) {
      return NextResponse.json({ error: "GitHub username is required." }, { status: 400 })
    }

    // Clean up username — handle full URLs
    username = username.replace(/https?:\/\/(www\.)?github\.com\//i, "").replace(/\/$/, "").trim()

    if (!username) {
      return NextResponse.json({ error: "Invalid GitHub username." }, { status: 400 })
    }

    // Fetch real GitHub data
    const githubData = await fetchGitHubProfile(username)

    let context = ""
    let stats: any = {}

    if (githubData) {
      const { profile, repos } = githubData

      stats = {
        repos: profile.public_repos ?? 0,
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
        stars: repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0),
        avatar: profile.avatar_url || null,
        profileUrl: profile.html_url || `https://github.com/${username}`,
      }

      context = [
        `GITHUB USERNAME: ${username}`,
        `FULL NAME: ${profile.name || "Not set"}`,
        `BIO: ${profile.bio || "Not set"}`,
        `LOCATION: ${profile.location || "Not set"}`,
        `COMPANY: ${profile.company || "Not set"}`,
        `BLOG/PORTFOLIO URL: ${profile.blog || "Not set"}`,
        `PUBLIC REPOS: ${profile.public_repos}`,
        `FOLLOWERS: ${profile.followers}`,
        `FOLLOWING: ${profile.following}`,
        `ACCOUNT CREATED: ${profile.created_at}`,
        `HIREABLE: ${profile.hireable ?? "Not specified"}`,
        `TWITTER: ${profile.twitter_username || "Not set"}`,
        "",
        "TOP REPOSITORIES:",
        ...repos.map((r: any, i: number) =>
          [
            `  ${i + 1}. ${r.name}`,
            `     Description: ${r.description || "No description"}`,
            `     Primary Language: ${r.language || "Not detected"}`,
            `     All Languages: ${r.languagesUsed?.join(", ") || "Unknown"}`,
            `     Stars: ${r.stargazers_count || 0} | Forks: ${r.forks_count || 0}`,
            `     Topics: ${r.topics?.join(", ") || "None"}`,
            `     Has GitHub Pages: ${r.has_pages}`,
            `     Homepage/Demo: ${r.homepage || "None"}`,
            `     Last Updated: ${r.updated_at}`,
            `     Fork: ${r.fork}`,
          ].join("\n")
        ),
      ].filter(Boolean).join("\n")
    } else {
      context = `GITHUB USERNAME: ${username}\nNote: Unable to fetch GitHub API data. Provide general advice based on the username.`
      stats = { repos: "--", stars: "--", followers: "--", avatar: null, profileUrl: `https://github.com/${username}` }
    }

    const userPrompt = `Analyze this GitHub developer profile for job-search and recruiter readiness.

TARGET ROLE: ${targetRole || "Not specified — infer from profile data"}

${context}

Provide a deeply structured, actionable professional assessment. For each repository, evaluate naming, description, documentation signals, and relevance to the target role. Identify the strongest repos to pin. Generate optimized bio text using ONLY technologies and skills actually present in the data.`

    const messages = [
      { role: "system" as const, content: [MASTER_SYSTEM_PROMPT, GITHUB_SYSTEM].join("\n") },
      { role: "user" as const, content: userPrompt }
    ]

    const { parsed } = await runAIPipeline(messages, "github-analyzer")

    return NextResponse.json({
      overallScore: parsed?.overallScore ?? 50,
      targetRoleDetected: parsed?.targetRoleDetected ?? targetRole ?? "Not detected",
      profileAnalysis: parsed?.profileAnalysis ?? null,
      bioOptimization: parsed?.bioOptimization ?? null,
      repositoryAnalysis: parsed?.repositoryAnalysis ?? [],
      recruiterImpression: parsed?.recruiterImpression ?? null,
      actionPlan: parsed?.actionPlan ?? [],
      scores: parsed?.scores ?? {},
      topLanguages: parsed?.topLanguages ?? [],
      stats,
    })
  } catch (error: any) {
    console.error("GitHub analyzer error:", error)
    return NextResponse.json({ error: "Failed to analyze GitHub profile." }, { status: 500 })
  }
}
