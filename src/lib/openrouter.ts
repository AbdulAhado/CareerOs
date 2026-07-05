import OpenAI from "openai"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  // Graceful fallback for build time
  console.warn("Please add your OPENROUTER_API_KEY to .env.local")
}

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY || "dummy-key-for-build",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "CareerOS",
  }
})

/**
 * Generate completion from OpenRouter with configurable parameters.
 */
export async function generateAIResponse(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = "google/gemini-2.5-flash-pro",
  temperature: number = 0.7,
  maxTokens: number = 4096
) {
  try {
    const completion = await openrouter.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    })
    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("OpenRouter API Error:", error)
    throw new Error("Failed to generate AI response")
  }
}
