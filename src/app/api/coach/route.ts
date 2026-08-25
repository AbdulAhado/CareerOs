import { NextRequest, NextResponse } from "next/server"
import { buildCareerCoachMessages } from "@/lib/ai/career-coach"
import { runAIPipeline } from "@/lib/ai/pipeline"

function formatJsonToMarkdown(data: any): string {
  if (!data || typeof data !== "object") return ""

  // Skill Gap or Career Assessment JSON format
  if (data.overallMatch !== undefined || data.learningRoadmap || data.missingCriticalSkills || data.summary) {
    const parts: string[] = []

    if (data.overallMatch !== undefined) {
      parts.push(`🎯 **Target Role Match: ${data.overallMatch}%**`)
    }

    if (data.summary) {
      parts.push(`${data.summary}`)
    }

    if (Array.isArray(data.keyHighlights) && data.keyHighlights.length > 0) {
      const highlights = data.keyHighlights.map((h: string) => `• **${h}**`).join("\n")
      parts.push(`### 🔍 Key Takeaways:\n${highlights}`)
    }

    if (Array.isArray(data.currentSkillsFound) && data.currentSkillsFound.length > 0) {
      parts.push(`✅ **Skills You Already Have:** ${data.currentSkillsFound.join(", ")}`)
    }

    if (Array.isArray(data.missingCriticalSkills) && data.missingCriticalSkills.length > 0) {
      parts.push(`⚠️ **Critical Skills to Bridge:** ${data.missingCriticalSkills.join(", ")}`)
    }

    if (Array.isArray(data.learningRoadmap) && data.learningRoadmap.length > 0) {
      const roadmapItems = data.learningRoadmap.map((item: any, i: number) => {
        let block = `${i + 1}. **${item.skill}** [${item.priority || "High"} Priority • ${item.timeToLearn || "2-3 weeks"}]`
        if (item.whyItMatters) block += `\n   • *Why:* ${item.whyItMatters}`
        if (item.practicalProject) block += `\n   • *Practical Project:* ${item.practicalProject}`
        if (Array.isArray(item.resources) && item.resources.length > 0) {
          block += `\n   • *Top Resources:* ${item.resources.join(", ")}`
        }
        return block
      }).join("\n\n")
      parts.push(`### 📚 Step-by-Step Action Roadmap:\n${roadmapItems}`)
    }

    if (Array.isArray(data.quickWins) && data.quickWins.length > 0) {
      const wins = data.quickWins.map((w: string) => `• ${w}`).join("\n")
      parts.push(`### ⚡ Quick Wins for This Week:\n${wins}`)
    }

    return parts.join("\n\n")
  }

  return ""
}

function sanitizeCoachResponse(text: string): string {
  if (!text) return ""

  let cleaned = text

  // 1. Remove <think> tags
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "")

  // 2. Remove internal reasoning / process artifacts
  cleaned = cleaned.replace(/reasoningProcess\s*\{[\s\S]*?\}\s*(?=Confidence Score:|\*\*Executive Summary:|\n\n|$)/gi, "")
  cleaned = cleaned.replace(/\{\s*"Intent Detection"[\s\S]*?\}/gi, "")
  cleaned = cleaned.replace(/Confidence Score:\s*\d+%\s*(Why:.*?\n)?/gi, "")

  cleaned = cleaned.trim()

  // 3. Search for ANY JSON object within the text (with or without ```json codeblocks)
  // Check if string contains { ... }
  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidateJson = cleaned.slice(firstBrace, lastBrace + 1)
    try {
      const parsed = JSON.parse(candidateJson)
      const formatted = formatJsonToMarkdown(parsed)
      if (formatted) {
        // If there was text before or after the JSON, preserve it if helpful
        const preText = cleaned.slice(0, firstBrace).replace(/```(?:json)?\s*$/i, "").trim()
        const postText = cleaned.slice(lastBrace + 1).replace(/^```\s*/i, "").trim()
        
        return [preText, formatted, postText].filter(Boolean).join("\n\n")
      }
    } catch {
      // If parsing fails, clean code block markers and return
    }
  }

  return cleaned
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 })
    }

    // Sanitize any previous assistant messages so LLM doesn't see JSON in its context
    const cleanHistory = messages.map((m: any) => ({
      role: m.role,
      content: sanitizeCoachResponse(m.content || "")
    }))

    const aiMessages = buildCareerCoachMessages(cleanHistory, context)
    const { raw } = await runAIPipeline(aiMessages, "career-coach")

    const sanitized = sanitizeCoachResponse(raw || "")

    return NextResponse.json({ content: sanitized })
  } catch (error: any) {
    console.error("Career coach error:", error)
    return NextResponse.json({ error: "Failed to get response. Please try again." }, { status: 500 })
  }
}
