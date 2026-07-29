/**
 * OpenAI-compatible client adapter for rabbit-code.
 *
 * This module provides a unified client that speaks the OpenAI Chat Completions
 * API format and is used by all non-Anthropic providers:
 *   OpenAI · Gemini · Ollama · Groq · Mistral · xAI · Together · Fireworks
 *   OpenRouter · LM Studio · Custom
 *
 * It translates Anthropic SDK message/tool formats to/from OpenAI format so the
 * rest of the codebase (QueryEngine, query.ts, claude.ts) can remain unchanged.
 */

import { randomUUID } from 'crypto'
import {
  getOpenAICompatibleApiKey,
  getOpenAICompatibleBaseURL,
  getProviderDisplayName,
  type APIProvider,
} from '../../utils/model/providers.js'
import { logForDebugging } from '../../utils/debug.js'
import { logError } from '../../utils/log.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | OpenAIContentPart[] | null
  name?: string
  tool_calls?: OpenAIToolCall[]
  tool_call_id?: string
}

export interface OpenAIContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string; detail?: 'auto' | 'low' | 'high' }
}

export interface OpenAIToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface OpenAITool {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters?: Record<string, unknown>
    strict?: boolean
  }
}

export interface OpenAIChatCompletionChunk {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string | null
      tool_calls?: Array<{
        index: number
        id?: string
        type?: 'function'
        function?: { name?: string; arguments?: string }
      }>
    }
    finish_reason: string | null
    logprobs: null
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenAIChatCompletion {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: Array<{
    index: number
    message: OpenAIMessage
    finish_reason: string
    logprobs: null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenAIStreamOptions {
  model: string
  messages: OpenAIMessage[]
  tools?: OpenAITool[]
  tool_choice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } }
  max_tokens?: number
  temperature?: number
  top_p?: number
  stream: true
  stream_options?: { include_usage?: boolean }
  system?: string // Some providers honour a top-level system field
  stop?: string[]
}

// ---------------------------------------------------------------------------
// Anthropic → OpenAI conversion helpers
// ---------------------------------------------------------------------------

/**
 * Convert an Anthropic-style content block array to an OpenAI content array.
 * Text-only messages are flattened to a plain string for broader compatibility.
 */
export function anthropicContentToOpenAI(
  content: unknown,
): string | OpenAIContentPart[] {
  if (typeof content === 'string') return content

  if (!Array.isArray(content)) return String(content)

  const parts: OpenAIContentPart[] = []
  for (const block of content as Array<Record<string, unknown>>) {
    if (block.type === 'text') {
      parts.push({ type: 'text', text: block.text as string })
    } else if (block.type === 'image') {
      const src = block.source as Record<string, unknown>
      if (src.type === 'base64') {
        parts.push({
          type: 'image_url',
          image_url: {
            url: `data:${src.media_type};base64,${src.data}`,
            detail: 'auto',
          },
        })
      } else if (src.type === 'url') {
        parts.push({
          type: 'image_url',
          image_url: { url: src.url as string, detail: 'auto' },
        })
      }
    } else if (block.type === 'thinking' || block.type === 'redacted_thinking') {
      // Encode thinking blocks as plain text (most providers ignore them gracefully)
      if (block.thinking) {
        parts.push({ type: 'text', text: `<thinking>${block.thinking}</thinking>` })
      }
    }
    // tool_use and tool_result blocks are handled separately in message conversion
  }

  return parts.length === 1 && parts[0]?.type === 'text'
    ? (parts[0].text ?? '')
    : parts
}

/**
 * Convert Anthropic-format messages to OpenAI-format messages.
 * Handles tool calls, tool results, images, and system prompts.
 */
export function anthropicMessagesToOpenAI(
  messages: Array<Record<string, unknown>>,
  systemPrompt?: string[],
): OpenAIMessage[] {
  const result: OpenAIMessage[] = []

  // Prepend system prompt if provided
  if (systemPrompt && systemPrompt.length > 0) {
    result.push({
      role: 'system',
      content: systemPrompt.join('\n\n'),
    })
  }

  for (const msg of messages) {
    const role = msg.role as string
    const content = msg.content

    if (role === 'user') {
      if (Array.isArray(content)) {
        // Check if user message contains tool_result blocks
        const toolResults = (content as Array<Record<string, unknown>>).filter(
          b => b.type === 'tool_result',
        )
        const otherBlocks = (content as Array<Record<string, unknown>>).filter(
          b => b.type !== 'tool_result',
        )

        // Emit tool result messages first
        for (const tr of toolResults) {
          const trContent = tr.content
          let toolContent: string
          if (Array.isArray(trContent)) {
            toolContent = (trContent as Array<Record<string, unknown>>)
              .filter(b => b.type === 'text')
              .map(b => b.text as string)
              .join('\n')
          } else if (typeof trContent === 'string') {
            toolContent = trContent
          } else {
            toolContent = JSON.stringify(trContent)
          }

          result.push({
            role: 'tool',
            tool_call_id: tr.tool_use_id as string,
            content: toolContent,
          })
        }

        // Emit remaining user content if any
        if (otherBlocks.length > 0) {
          result.push({
            role: 'user',
            content: anthropicContentToOpenAI(otherBlocks),
          })
        }
      } else {
        result.push({
          role: 'user',
          content: anthropicContentToOpenAI(content),
        })
      }
    } else if (role === 'assistant') {
      const msgContent = (msg.message as Record<string, unknown>)?.content ?? content

      if (Array.isArray(msgContent)) {
        const textBlocks = (msgContent as Array<Record<string, unknown>>).filter(
          b => b.type === 'text' || b.type === 'thinking' || b.type === 'redacted_thinking',
        )
        const toolUseBlocks = (msgContent as Array<Record<string, unknown>>).filter(
          b => b.type === 'tool_use',
        )

        const toolCalls: OpenAIToolCall[] = toolUseBlocks.map(tu => ({
          id: (tu.id as string) || randomUUID(),
          type: 'function' as const,
          function: {
            name: tu.name as string,
            arguments:
              typeof tu.input === 'string'
                ? tu.input
                : JSON.stringify(tu.input ?? {}),
          },
        }))

        const textContent = textBlocks
          .filter(b => b.type === 'text')
          .map(b => b.text as string)
          .join('')

        const assistantMsg: OpenAIMessage = {
          role: 'assistant',
          content: textContent || null,
        }
        if (toolCalls.length > 0) {
          assistantMsg.tool_calls = toolCalls
        }
        result.push(assistantMsg)
      } else {
        result.push({
          role: 'assistant',
          content: anthropicContentToOpenAI(msgContent),
        })
      }
    }
  }

  return result
}

/**
 * Convert Anthropic tool definitions to OpenAI format.
 */
export function anthropicToolsToOpenAI(
  tools: Array<Record<string, unknown>>,
): OpenAITool[] {
  return tools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name as string,
      description: tool.description as string | undefined,
      parameters: (tool.input_schema as Record<string, unknown>) ?? {
        type: 'object',
        properties: {},
      },
    },
  }))
}

// ---------------------------------------------------------------------------
// OpenAI → Anthropic conversion helpers
// ---------------------------------------------------------------------------

/**
 * Convert an OpenAI streaming chunk to an Anthropic-style stream event.
 * Returns null for chunks that have no useful content.
 */
export function openAIChunkToAnthropicEvent(
  chunk: OpenAIChatCompletionChunk,
  toolCallAccumulator: Map<number, { id: string; name: string; args: string }>,
): Array<Record<string, unknown>> {
  const events: Array<Record<string, unknown>> = []
  const choice = chunk.choices[0]
  if (!choice) return events

  const delta = choice.delta

  // Text content delta
  if (delta.content) {
    events.push({
      type: 'content_block_delta',
      index: 0,
      delta: { type: 'text_delta', text: delta.content },
    })
  }

  // Tool call deltas
  if (delta.tool_calls) {
    for (const tcDelta of delta.tool_calls) {
      const idx = tcDelta.index ?? 0

      if (!toolCallAccumulator.has(idx)) {
        // New tool call starting
        toolCallAccumulator.set(idx, {
          id: tcDelta.id ?? randomUUID(),
          name: tcDelta.function?.name ?? '',
          args: '',
        })
        // Emit tool_use block start
        events.push({
          type: 'content_block_start',
          index: idx + 1, // offset by 1 (index 0 = text)
          content_block: {
            type: 'tool_use',
            id: tcDelta.id ?? randomUUID(),
            name: tcDelta.function?.name ?? '',
            input: {},
          },
        })
      }

      const acc = toolCallAccumulator.get(idx)!
      if (tcDelta.function?.name && !acc.name) {
        acc.name = tcDelta.function.name
      }
      if (tcDelta.function?.arguments) {
        acc.args += tcDelta.function.arguments
        events.push({
          type: 'content_block_delta',
          index: idx + 1,
          delta: {
            type: 'input_json_delta',
            partial_json: tcDelta.function.arguments,
          },
        })
      }
    }
  }

  // Finish reason mapping
  if (choice.finish_reason) {
    // Close open tool call blocks
    for (const [idx] of toolCallAccumulator) {
      events.push({
        type: 'content_block_stop',
        index: idx + 1,
      })
    }

    const stopReason =
      choice.finish_reason === 'tool_calls'
        ? 'tool_use'
        : choice.finish_reason === 'length'
          ? 'max_tokens'
          : 'end_turn'

    events.push({
      type: 'message_delta',
      delta: { stop_reason: stopReason, stop_sequence: null },
      usage: chunk.usage
        ? {
            output_tokens: chunk.usage.completion_tokens,
          }
        : undefined,
    })
    events.push({ type: 'message_stop' })
  }

  return events
}

// ---------------------------------------------------------------------------
// Streaming fetch wrapper
// ---------------------------------------------------------------------------

export interface StreamingRequestOptions {
  model: string
  messages: OpenAIMessage[]
  tools?: OpenAITool[]
  maxTokens?: number
  temperature?: number
  signal?: AbortSignal
  extraHeaders?: Record<string, string>
}

/**
 * Send a streaming chat completion request to an OpenAI-compatible endpoint
 * and return an async generator of raw SSE data strings.
 */
export async function* streamOpenAICompatible(
  opts: StreamingRequestOptions,
): AsyncGenerator<string, void, unknown> {
  const baseUrl = getOpenAICompatibleBaseURL()
  const apiKey = getOpenAICompatibleApiKey()
  const provider = getProviderDisplayName()

  const url = `${baseUrl}/chat/completions`

  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: opts.maxTokens ?? 8192,
  }

  if (opts.temperature !== undefined) {
    body.temperature = opts.temperature
  }

  if (opts.tools && opts.tools.length > 0) {
    body.tools = opts.tools
    body.tool_choice = 'auto'
  }

  logForDebugging(
    `[OpenAI-compat] ${provider} → POST ${url} model=${opts.model} tools=${opts.tools?.length ?? 0}`,
  )

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
    ...opts.extraHeaders,
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  // OpenRouter requires an extra header
  if (process.env.OPENROUTER_APP_NAME) {
    headers['X-Title'] = process.env.OPENROUTER_APP_NAME
  }
  if (process.env.OPENROUTER_HTTP_REFERER) {
    headers['HTTP-Referer'] = process.env.OPENROUTER_HTTP_REFERER
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: opts.signal,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`[${provider}] Network error: ${msg}`)
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '(no body)')
    throw new Error(
      `[${provider}] HTTP ${response.status} ${response.statusText}: ${errorText}`,
    )
  }

  if (!response.body) {
    throw new Error(`[${provider}] Response has no body`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Emit complete SSE lines
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? '' // Keep incomplete last line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          yield line.slice(6).trim()
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
      const remaining = buffer.startsWith('data: ')
        ? buffer.slice(6).trim()
        : buffer.trim()
      if (remaining) yield remaining
    }
  } finally {
    reader.releaseLock()
  }
}

// ---------------------------------------------------------------------------
// Non-streaming request
// ---------------------------------------------------------------------------

export async function fetchOpenAICompatible(
  opts: Omit<StreamingRequestOptions, 'signal'> & { signal?: AbortSignal },
): Promise<OpenAIChatCompletion> {
  const baseUrl = getOpenAICompatibleBaseURL()
  const apiKey = getOpenAICompatibleApiKey()
  const provider = getProviderDisplayName()

  const url = `${baseUrl}/chat/completions`

  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    stream: false,
    max_tokens: opts.maxTokens ?? 8192,
  }

  if (opts.temperature !== undefined) {
    body.temperature = opts.temperature
  }

  if (opts.tools && opts.tools.length > 0) {
    body.tools = opts.tools
    body.tool_choice = 'auto'
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...opts.extraHeaders,
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: opts.signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '(no body)')
    throw new Error(
      `[${provider}] HTTP ${response.status} ${response.statusText}: ${errorText}`,
    )
  }

  return response.json() as Promise<OpenAIChatCompletion>
}

// ---------------------------------------------------------------------------
// Available models list
// ---------------------------------------------------------------------------

export interface OpenAIModelInfo {
  id: string
  created?: number
  owned_by?: string
}

/**
 * Fetch available models from the provider's /models endpoint.
 * Returns an empty array if the endpoint is not available.
 */
export async function fetchAvailableModels(
  signal?: AbortSignal,
): Promise<OpenAIModelInfo[]> {
  const baseUrl = getOpenAICompatibleBaseURL()
  const apiKey = getOpenAICompatibleApiKey()

  const headers: Record<string, string> = {}
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

  try {
    const res = await fetch(`${baseUrl}/models`, {
      headers,
      signal,
    })
    if (!res.ok) return []
    const data = (await res.json()) as { data?: OpenAIModelInfo[] }
    return data.data ?? []
  } catch {
    return []
  }
}
