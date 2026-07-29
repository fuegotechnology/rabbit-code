/**
 * OpenAI Query Bridge
 *
 * This module bridges the Anthropic-style query pipeline with OpenAI-compatible
 * provider APIs. It intercepts the model call, converts messages/tools to the
 * OpenAI Chat Completions format, streams the response, and converts it back
 * to Anthropic-style stream events so `query.ts` and `claude.ts` work unchanged.
 *
 * Usage: call `isOpenAIBridgeActive()` before the normal Anthropic SDK call,
 * and if true, yield* from `openAIBridgeQuery(...)` instead.
 */

import { randomUUID } from 'crypto'
import {
  getAPIProvider,
  isOpenAICompatibleProvider,
} from '../../utils/model/providers.js'
import {
  anthropicMessagesToOpenAI,
  anthropicToolsToOpenAI,
  streamOpenAICompatible,
  openAIChunkToAnthropicEvent,
  type OpenAIChatCompletionChunk,
} from './openaiCompatibleClient.js'
import { logForDebugging } from '../../utils/debug.js'
import { logError } from '../../utils/log.js'

// ---------------------------------------------------------------------------
// Guard
// ---------------------------------------------------------------------------

export function isOpenAIBridgeActive(): boolean {
  return isOpenAICompatibleProvider(getAPIProvider())
}

// ---------------------------------------------------------------------------
// Types mirroring what claude.ts expects
// ---------------------------------------------------------------------------

export interface BridgeQueryParams {
  model: string
  messages: Array<Record<string, unknown>>
  systemPrompt?: string[]
  tools?: Array<Record<string, unknown>>
  maxTokens?: number
  temperature?: number
  signal?: AbortSignal
}

export interface BridgeRawEvent {
  type: string
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Core bridge generator
// ---------------------------------------------------------------------------

/**
 * Stream a query through an OpenAI-compatible provider and yield Anthropic-style
 * raw stream events. This can be plugged in wherever the Anthropic SDK streaming
 * call is made in `claude.ts`.
 */
export async function* openAIBridgeQuery(
  params: BridgeQueryParams,
): AsyncGenerator<BridgeRawEvent, void, unknown> {
  const {
    model,
    messages,
    systemPrompt,
    tools = [],
    maxTokens = 8192,
    temperature,
    signal,
  } = params

  logForDebugging(
    `[OpenAI Bridge] model=${model} msgs=${messages.length} tools=${tools.length}`,
  )

  // Convert messages & tools
  const openAIMessages = anthropicMessagesToOpenAI(
    messages,
    systemPrompt,
  )
  const openAITools = tools.length > 0 ? anthropicToolsToOpenAI(tools) : undefined

  // Emit message_start
  const msgId = `msg_${randomUUID().replace(/-/g, '')}`
  yield {
    type: 'message_start',
    message: {
      id: msgId,
      type: 'message',
      role: 'assistant',
      content: [],
      model,
      stop_reason: null,
      stop_sequence: null,
      usage: { input_tokens: 0, output_tokens: 0 },
    },
  }

  // Emit text block start
  yield {
    type: 'content_block_start',
    index: 0,
    content_block: { type: 'text', text: '' },
  }

  // Accumulate tool calls across chunks
  const toolCallAccumulator = new Map<
    number,
    { id: string; name: string; args: string }
  >()

  let inputTokens = 0
  let outputTokens = 0
  let stopReason = 'end_turn'

  try {
    for await (const rawData of streamOpenAICompatible({
      model,
      messages: openAIMessages,
      tools: openAITools,
      maxTokens,
      temperature,
      signal,
    })) {
      if (!rawData || rawData === '[DONE]') continue

      let chunk: OpenAIChatCompletionChunk
      try {
        chunk = JSON.parse(rawData) as OpenAIChatCompletionChunk
      } catch {
        // Malformed chunk — skip
        continue
      }

      // Track usage if included in chunk
      if (chunk.usage) {
        inputTokens = chunk.usage.prompt_tokens
        outputTokens = chunk.usage.completion_tokens
      }

      // Convert to Anthropic events and yield
      const events = openAIChunkToAnthropicEvent(chunk, toolCallAccumulator)
      for (const event of events) {
        // Extract stop_reason from message_delta
        if (
          event.type === 'message_delta' &&
          (event.delta as Record<string, unknown>)?.stop_reason
        ) {
          stopReason = (event.delta as Record<string, unknown>).stop_reason as string
        }
        yield event as BridgeRawEvent
      }
    }
  } catch (err) {
    logError(err as Error)
    // Emit an error text block so the user sees the failure
    const errMsg = err instanceof Error ? err.message : String(err)
    yield {
      type: 'content_block_delta',
      index: 0,
      delta: { type: 'text_delta', text: `\n[Provider Error] ${errMsg}` },
    }
  }

  // Emit final usage summary
  yield {
    type: 'message_delta',
    delta: { stop_reason: stopReason, stop_sequence: null },
    usage: { output_tokens: outputTokens },
  }

  // Emit content_block_stop for text block if no tool calls occurred
  if (toolCallAccumulator.size === 0) {
    yield { type: 'content_block_stop', index: 0 }
  }

  yield { type: 'message_stop' }

  logForDebugging(
    `[OpenAI Bridge] done stop_reason=${stopReason} in=${inputTokens} out=${outputTokens}`,
  )
}

// ---------------------------------------------------------------------------
// Non-streaming helper (for Haiku-style one-shot queries)
// ---------------------------------------------------------------------------

export async function openAIBridgeQueryOnce(
  params: BridgeQueryParams,
): Promise<{ text: string; stopReason: string; inputTokens: number; outputTokens: number }> {
  const { fetchOpenAICompatible } = await import('./openaiCompatibleClient.js')
  const {
    model,
    messages,
    systemPrompt,
    tools = [],
    maxTokens = 4096,
    temperature,
    signal,
  } = params

  const openAIMessages = anthropicMessagesToOpenAI(messages, systemPrompt)
  const openAITools = tools.length > 0 ? anthropicToolsToOpenAI(tools) : undefined

  const completion = await fetchOpenAICompatible({
    model,
    messages: openAIMessages,
    tools: openAITools,
    maxTokens,
    temperature,
    signal,
  })

  const choice = completion.choices[0]
  const text = (choice?.message?.content as string | null) ?? ''
  const stopReason =
    choice?.finish_reason === 'tool_calls'
      ? 'tool_use'
      : choice?.finish_reason === 'length'
        ? 'max_tokens'
        : 'end_turn'

  return {
    text,
    stopReason,
    inputTokens: completion.usage?.prompt_tokens ?? 0,
    outputTokens: completion.usage?.completion_tokens ?? 0,
  }
}
