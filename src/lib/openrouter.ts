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
 * Automatically retries with reduced max_tokens if OpenRouter throws a 402 credit/token limit error.
 */
export async function generateAIResponse(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
  temperature: number = 0.7,
  maxTokens: number = 2048,
  responseFormat?: { type: "json_object" }
) {
  const requestCompletion = async (tokens: number) => {
    const payload: any = {
      model,
      messages,
      temperature,
      max_tokens: tokens,
    }
    if (responseFormat) {
      payload.response_format = responseFormat
    }
    return await openrouter.chat.completions.create(payload)
  }

  try {
    const completion = await requestCompletion(maxTokens)
    return completion.choices[0]?.message?.content || ""
  } catch (error: any) {
    const errorMsg = error?.message || error?.error?.message || String(error)
    const is402 =
      error?.status === 402 ||
      error?.code === 402 ||
      errorMsg.includes("402") ||
      errorMsg.toLowerCase().includes("credits") ||
      errorMsg.toLowerCase().includes("max_tokens")

    if (is402) {
      // Check if OpenRouter specified how many tokens we can afford (e.g. "can only afford 2234")
      const affordMatch = errorMsg.match(/can only afford (\d+)/i)
      let retryTokens: number | null = null

      if (affordMatch && affordMatch[1]) {
        const afford = parseInt(affordMatch[1], 10)
        retryTokens = Math.max(100, Math.floor(afford * 0.95))
      } else if (maxTokens > 500) {
        retryTokens = Math.max(250, Math.floor(maxTokens / 2))
      }

      if (retryTokens && retryTokens < maxTokens) {
        console.warn(
          `[OpenRouter 402] Balance limit reached for ${maxTokens} max_tokens. Retrying automatically with ${retryTokens} tokens...`
        )
        try {
          const retryCompletion = await requestCompletion(retryTokens)
          return retryCompletion.choices[0]?.message?.content || ""
        } catch (retryError: any) {
          const retryMsg = retryError?.message || String(retryError)
          console.error("[OpenRouter Retry Failed]:", retryMsg)
        }
      }
    }

    console.error("OpenRouter API Error:", errorMsg)
    throw new Error(
      is402
        ? `OpenRouter credit limit reached: ${errorMsg}`
        : "Failed to generate AI response"
    )
  }
}
