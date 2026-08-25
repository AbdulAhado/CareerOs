/**
 * CareerOS AI v2 — AI Execution Pipeline
 *
 * Central orchestrator that all API routes call.
 * Handles: prompt assembly → AI call → output cleaning → JSON validation.
 */

import { generateAIResponse } from "../openrouter"

export interface PipelineOptions {
  /** Temperature for response generation (0.0 - 1.0). Lower = more deterministic. */
  temperature?: number
  /** Maximum tokens in the response */
  maxTokens?: number
  /** Model to use (defaults to OPENROUTER_MODEL or google/gemini-2.5-flash) */
  model?: string
  /** Whether the response should be parsed as JSON */
  expectJSON?: boolean
}

const DEFAULT_OPTIONS: PipelineOptions = {
  temperature: 0.7,
  maxTokens: 2048,
  model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
  expectJSON: false,
}

/**
 * Feature-specific recommended settings.
 */
export const FEATURE_SETTINGS: Record<string, PipelineOptions> = {
  "career-coach": {
    temperature: 0.7,
    maxTokens: 1500,
    expectJSON: false,
  },
  "skill-gap": {
    temperature: 0.2,
    maxTokens: 2500,
    expectJSON: true,
  },
  "ats-analyzer": {
    temperature: 0.3,
    maxTokens: 2500,
    expectJSON: true,
  },
  "resume-analyzer": {
    temperature: 0.3,
    maxTokens: 2500,
    expectJSON: true,
  },
  "proposal-generator": {
    temperature: 0.8,
    maxTokens: 1024,
    expectJSON: false,
  },
  "interview-questions": {
    temperature: 0.6,
    maxTokens: 2048,
    expectJSON: true,
  },
  "interview-feedback": {
    temperature: 0.4,
    maxTokens: 2048,
    expectJSON: true,
  },
  "github-analyzer": {
    temperature: 0.3,
    maxTokens: 4096,
    expectJSON: true,
  },
  "portfolio-analyzer": {
    temperature: 0.3,
    maxTokens: 4096,
    expectJSON: true,
  },
  "linkedin-optimizer": {
    temperature: 0.3,
    maxTokens: 4096,
    expectJSON: true,
  },
}

/**
 * Cleans AI response for JSON parsing.
 * Removes XML/HTML, markdown code blocks, <think> tags, and isolates the JSON object.
 */
function cleanJSONResponse(raw: string): string {
  let cleaned = raw.trim()

  // Remove <think>...</think> tags if present
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "")

  // Remove SVG, HTML, or XML tags if any
  cleaned = cleaned.replace(/<svg[\s\S]*?<\/svg>/gi, "")
  cleaned = cleaned.replace(/<\/?(?:svg|html|xml|div|p|body)[^>]*>/gi, "")

  // Remove markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "")
  cleaned = cleaned.replace(/```\s*$/i, "")
  cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "")

  // Find actual JSON object bounds
  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1)
  }

  return cleaned.trim()
}

/**
 * Repairs incomplete or truncated JSON string by closing unclosed quotes, brackets, and braces.
 * Triggered when max_tokens or network cutoff truncates the response.
 */
function repairTruncatedJSON(jsonStr: string): string {
  let str = jsonStr.trim()

  // Extract from first opening brace if there's pre-text
  const startIdx = str.indexOf("{")
  if (startIdx > 0) {
    str = str.slice(startIdx)
  }

  let inString = false
  let escaped = false
  let openBraces = 0
  let openBrackets = 0

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === "\\") {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (!inString) {
      if (char === "{") openBraces++
      if (char === "}") openBraces = Math.max(0, openBraces - 1)
      if (char === "[") openBrackets++
      if (char === "]") openBrackets = Math.max(0, openBrackets - 1)
    }
  }

  // If response ended inside an unclosed string literal, close it
  if (inString) {
    str += '"'
  }

  // Remove trailing commas or incomplete key/colon fragments before closing brackets
  str = str
    .replace(/,\s*$/, "")
    .replace(/,\s*"[^"]*"\s*:\s*$/, "")
    .replace(/,\s*"[^"]*"$/, "")

  // Close all unclosed array and object brackets
  for (let i = 0; i < openBrackets; i++) {
    str += "]"
  }
  for (let i = 0; i < openBraces; i++) {
    str += "}"
  }

  return str
}

/**
 * Validates that a string is valid JSON and returns the parsed object.
 * Automatically repairs truncated JSON if maxTokens was reached.
 */
function parseAndValidateJSON(raw: string): any {
  const cleaned = cleanJSONResponse(raw)

  // 1. Try standard JSON parsing on cleaned text
  try {
    return JSON.parse(cleaned)
  } catch (firstError) {
    // 2. Try regex extraction of JSON object block
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // Fall through to repair
      }
    }

    // 3. Attempt automatic JSON repair for truncated strings
    try {
      const repaired = repairTruncatedJSON(cleaned)
      const parsedRepaired = JSON.parse(repaired)
      console.warn("[AI Pipeline] Successfully repaired truncated JSON response.")
      return parsedRepaired
    } catch (repairError) {
      console.error("[AI Pipeline] Repair failed:", (repairError as Error).message)
      throw new Error(`Failed to parse AI response as JSON: ${(firstError as Error).message}`)
    }
  }
}

/**
 * Runs the full AI pipeline.
 *
 * Pipeline: messages → AI call → clean → validate → return
 */
export async function runAIPipeline(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  featureKey: string,
  overrides?: Partial<PipelineOptions>
): Promise<{ raw: string; parsed?: any }> {
  const featureDefaults = FEATURE_SETTINGS[featureKey] || {}
  const options = { ...DEFAULT_OPTIONS, ...featureDefaults, ...overrides }

  // Call the AI with response_format json_object if expectJSON is true
  const raw = await generateAIResponse(
    messages as any,
    options.model,
    options.temperature,
    options.maxTokens,
    options.expectJSON ? { type: "json_object" } : undefined
  )

  if (!raw || raw.trim().length === 0) {
    throw new Error("AI returned an empty response")
  }

  // If JSON is expected, parse and validate
  if (options.expectJSON) {
    const parsed = parseAndValidateJSON(raw)
    return { raw, parsed }
  }

  return { raw: raw.trim() }
}
