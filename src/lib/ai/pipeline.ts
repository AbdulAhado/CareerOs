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
  maxTokens: 4096,
  model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
  expectJSON: false,
}

/**
 * Feature-specific recommended settings.
 */
export const FEATURE_SETTINGS: Record<string, PipelineOptions> = {
  "career-coach": {
    temperature: 0.75,
    maxTokens: 2048,
    expectJSON: false,
  },
  "ats-analyzer": {
    temperature: 0.3,
    maxTokens: 4096,
    expectJSON: true,
  },
  "resume-analyzer": {
    temperature: 0.3,
    maxTokens: 4096,
    expectJSON: true,
  },
  "proposal-generator": {
    temperature: 0.8,
    maxTokens: 1024,
    expectJSON: false,
  },
  "interview-questions": {
    temperature: 0.6,
    maxTokens: 3072,
    expectJSON: true,
  },
  "interview-feedback": {
    temperature: 0.4,
    maxTokens: 4096,
    expectJSON: true,
  },
}

/**
 * Cleans AI response for JSON parsing.
 * Removes markdown code blocks, trims whitespace.
 */
function cleanJSONResponse(raw: string): string {
  return raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim()
}

/**
 * Validates that a string is valid JSON and returns the parsed object.
 * Throws if invalid.
 */
function parseAndValidateJSON(raw: string): any {
  const cleaned = cleanJSONResponse(raw)

  try {
    return JSON.parse(cleaned)
  } catch (firstError) {
    // Try to extract JSON from the response if it's wrapped in text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // Fall through
      }
    }
    throw new Error(`Failed to parse AI response as JSON: ${(firstError as Error).message}`)
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

  // Call the AI
  const raw = await generateAIResponse(
    messages,
    options.model,
    options.temperature,
    options.maxTokens
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
