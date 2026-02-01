import OpenAI from 'openai'
import { z } from 'zod'

export type CompletionOptions = {
  model?: 'gpt-4o' | 'gpt-4o-mini'
  temperature?: number
  maxTokens?: number
}

export class OpenAIError extends Error {
  code?: string
  retryable: boolean

  constructor(message: string, code?: string, retryable = false) {
    super(message)
    this.name = 'OpenAIError'
    this.code = code
    this.retryable = retryable
  }
}

const defaultOptions: CompletionOptions = {
  model: 'gpt-4o-mini',
  temperature: 0.2,
}

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new OpenAIError('Missing OPENAI_API_KEY', 'missing_api_key', false)
  }
  return new OpenAI({ apiKey })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const isRateLimitError = (error: unknown) => {
  const err = error as { status?: number; code?: string; type?: string }
  return err?.status === 429 || err?.code === 'rate_limit' || err?.type === 'rate_limit_error'
}

const logUsage = (usage?: { prompt_tokens?: number; completion_tokens?: number }, model?: string) => {
  if (!usage) return
  const promptTokens = usage.prompt_tokens ?? 0
  const completionTokens = usage.completion_tokens ?? 0
  console.info('OpenAI usage', { model, promptTokens, completionTokens })
}

const withRetry = async <T>(operation: () => Promise<T>) => {
  const delays = [1000, 2000, 4000]
  let lastError: unknown

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (!isRateLimitError(error) || attempt === delays.length) {
        break
      }
      await sleep(delays[attempt])
    }
  }

  const err = lastError as { message?: string; code?: string }
  throw new OpenAIError(
    err?.message ?? 'OpenAI request failed',
    err?.code,
    isRateLimitError(lastError)
  )
}

export async function complete(prompt: string, options?: CompletionOptions) {
  const client = getClient()
  const { model, temperature, maxTokens } = { ...defaultOptions, ...options }

  return withRetry(async () => {
    try {
      const response = await client.chat.completions.create({
        model: model ?? 'gpt-4o-mini',
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const content = response.choices?.[0]?.message?.content ?? ''
      logUsage(response.usage, model)

      return {
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
        },
      }
    } catch (error) {
      if (isRateLimitError(error)) {
        throw error
      }
      const err = error as { message?: string; code?: string }
      throw new OpenAIError(err?.message ?? 'OpenAI request failed', err?.code, false)
    }
  })
}

export async function completeJSON<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  options?: CompletionOptions
) {
  const attempt = async () => {
    const result = await complete(prompt, options)
    try {
      const parsed = JSON.parse(result.content)
      const data = schema.parse(parsed)
      return { data, usage: result.usage }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new OpenAIError('Failed to parse JSON response', 'invalid_json', false)
      }
      const err = error as { message?: string }
      throw new OpenAIError(err?.message ?? 'Schema validation failed', 'invalid_schema', false)
    }
  }

  try {
    return await attempt()
  } catch (error) {
    if (error instanceof OpenAIError && error.code === 'invalid_json') {
      return await attempt()
    }
    throw error
  }
}

export async function stream(prompt: string, options?: CompletionOptions): Promise<AsyncIterable<string>> {
  const client = getClient()
  const { model, temperature, maxTokens } = { ...defaultOptions, ...options }

  return withRetry(async () => {
    try {
      const streamResponse = await client.chat.completions.create({
        model: model ?? 'gpt-4o-mini',
        temperature,
        max_tokens: maxTokens,
        stream: true,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      async function* iterator() {
        for await (const chunk of streamResponse) {
          const delta = chunk.choices?.[0]?.delta?.content
          if (delta) {
            yield delta
          }
        }
      }

      return iterator()
    } catch (error) {
      if (isRateLimitError(error)) {
        throw error
      }
      const err = error as { message?: string; code?: string }
      throw new OpenAIError(err?.message ?? 'OpenAI request failed', err?.code, false)
    }
  })
}
