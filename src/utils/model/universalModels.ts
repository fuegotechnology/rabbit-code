/**
 * Universal model registry for all supported AI providers.
 *
 * This file defines well-known models for each OpenAI-compatible provider so
 * the /model picker, auto-completion, and cost tracking work out-of-the-box
 * even without fetching the provider's /models endpoint.
 *
 * Users can always specify any model string via ANTHROPIC_MODEL or --model.
 */

import type { APIProvider } from './providers.js'

export interface UniversalModelInfo {
  id: string
  displayName: string
  contextWindow: number // tokens
  maxOutputTokens: number // tokens
  /** Estimated cost per million tokens (input / output) in USD */
  costPerMTokenInput?: number
  costPerMTokenOutput?: number
  supportsTools: boolean
  supportsVision: boolean
  supportsStreaming: boolean
  /** Model family for grouping in UI */
  family?: string
  /** Whether this model supports structured outputs / JSON mode */
  supportsStructuredOutputs?: boolean
  isDefault?: boolean
}

export type ProviderModelMap = Record<string, UniversalModelInfo>

// ---------------------------------------------------------------------------
// OpenAI
// ---------------------------------------------------------------------------
export const OPENAI_MODELS: ProviderModelMap = {
  'gpt-4o': {
    id: 'gpt-4o',
    displayName: 'GPT-4o',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 2.5,
    costPerMTokenOutput: 10,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsStructuredOutputs: true,
    family: 'gpt-4o',
    isDefault: true,
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 0.15,
    costPerMTokenOutput: 0.6,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsStructuredOutputs: true,
    family: 'gpt-4o',
  },
  'o1': {
    id: 'o1',
    displayName: 'o1',
    contextWindow: 200_000,
    maxOutputTokens: 100_000,
    costPerMTokenInput: 15,
    costPerMTokenOutput: 60,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'o-series',
  },
  'o1-mini': {
    id: 'o1-mini',
    displayName: 'o1 Mini',
    contextWindow: 128_000,
    maxOutputTokens: 65_536,
    costPerMTokenInput: 1.1,
    costPerMTokenOutput: 4.4,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'o-series',
  },
  'o3': {
    id: 'o3',
    displayName: 'o3',
    contextWindow: 200_000,
    maxOutputTokens: 100_000,
    costPerMTokenInput: 10,
    costPerMTokenOutput: 40,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'o-series',
  },
  'o3-mini': {
    id: 'o3-mini',
    displayName: 'o3 Mini',
    contextWindow: 200_000,
    maxOutputTokens: 100_000,
    costPerMTokenInput: 1.1,
    costPerMTokenOutput: 4.4,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'o-series',
  },
  'o4-mini': {
    id: 'o4-mini',
    displayName: 'o4 Mini',
    contextWindow: 200_000,
    maxOutputTokens: 100_000,
    costPerMTokenInput: 1.1,
    costPerMTokenOutput: 4.4,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'o-series',
  },
  'gpt-4.1': {
    id: 'gpt-4.1',
    displayName: 'GPT-4.1',
    contextWindow: 1_047_576,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 2,
    costPerMTokenOutput: 8,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsStructuredOutputs: true,
    family: 'gpt-4',
  },
  'gpt-4.1-mini': {
    id: 'gpt-4.1-mini',
    displayName: 'GPT-4.1 Mini',
    contextWindow: 1_047_576,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 0.4,
    costPerMTokenOutput: 1.6,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    supportsStructuredOutputs: true,
    family: 'gpt-4',
  },
}

// ---------------------------------------------------------------------------
// Google Gemini
// ---------------------------------------------------------------------------
export const GEMINI_MODELS: ProviderModelMap = {
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    contextWindow: 1_048_576,
    maxOutputTokens: 65_536,
    costPerMTokenInput: 1.25,
    costPerMTokenOutput: 10,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemini-2.5',
    isDefault: true,
  },
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    contextWindow: 1_048_576,
    maxOutputTokens: 65_536,
    costPerMTokenInput: 0.15,
    costPerMTokenOutput: 0.6,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemini-2.5',
  },
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    displayName: 'Gemini 2.0 Flash',
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.1,
    costPerMTokenOutput: 0.4,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemini-2.0',
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    contextWindow: 2_097_152,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 1.25,
    costPerMTokenOutput: 5,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemini-1.5',
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.075,
    costPerMTokenOutput: 0.3,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemini-1.5',
  },
}

// ---------------------------------------------------------------------------
// Groq
// ---------------------------------------------------------------------------
export const GROQ_MODELS: ProviderModelMap = {
  'llama-3.3-70b-versatile': {
    id: 'llama-3.3-70b-versatile',
    displayName: 'Llama 3.3 70B Versatile',
    contextWindow: 128_000,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 0.59,
    costPerMTokenOutput: 0.79,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
    isDefault: true,
  },
  'llama-3.1-70b-versatile': {
    id: 'llama-3.1-70b-versatile',
    displayName: 'Llama 3.1 70B Versatile',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.59,
    costPerMTokenOutput: 0.79,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
  },
  'llama-3.1-8b-instant': {
    id: 'llama-3.1-8b-instant',
    displayName: 'Llama 3.1 8B Instant',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.05,
    costPerMTokenOutput: 0.08,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
  },
  'mixtral-8x7b-32768': {
    id: 'mixtral-8x7b-32768',
    displayName: 'Mixtral 8x7B',
    contextWindow: 32_768,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 0.24,
    costPerMTokenOutput: 0.24,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'mixtral',
  },
  'gemma2-9b-it': {
    id: 'gemma2-9b-it',
    displayName: 'Gemma 2 9B',
    contextWindow: 8_192,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.2,
    costPerMTokenOutput: 0.2,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'gemma',
  },
  'deepseek-r1-distill-llama-70b': {
    id: 'deepseek-r1-distill-llama-70b',
    displayName: 'DeepSeek R1 Distill 70B',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 0.75,
    costPerMTokenOutput: 0.99,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
}

// ---------------------------------------------------------------------------
// Mistral
// ---------------------------------------------------------------------------
export const MISTRAL_MODELS: ProviderModelMap = {
  'mistral-large-latest': {
    id: 'mistral-large-latest',
    displayName: 'Mistral Large',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 2,
    costPerMTokenOutput: 6,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'mistral-large',
    isDefault: true,
  },
  'mistral-small-latest': {
    id: 'mistral-small-latest',
    displayName: 'Mistral Small',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.2,
    costPerMTokenOutput: 0.6,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'mistral-small',
  },
  'codestral-latest': {
    id: 'codestral-latest',
    displayName: 'Codestral',
    contextWindow: 262_144,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.2,
    costPerMTokenOutput: 0.6,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'codestral',
  },
  'pixtral-large-latest': {
    id: 'pixtral-large-latest',
    displayName: 'Pixtral Large',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 2,
    costPerMTokenOutput: 6,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'pixtral',
  },
}

// ---------------------------------------------------------------------------
// xAI (Grok)
// ---------------------------------------------------------------------------
export const XAI_MODELS: ProviderModelMap = {
  'grok-3': {
    id: 'grok-3',
    displayName: 'Grok 3',
    contextWindow: 131_072,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 3,
    costPerMTokenOutput: 15,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'grok-3',
    isDefault: true,
  },
  'grok-3-mini': {
    id: 'grok-3-mini',
    displayName: 'Grok 3 Mini',
    contextWindow: 131_072,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 0.3,
    costPerMTokenOutput: 0.5,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'grok-3',
  },
  'grok-2-vision-1212': {
    id: 'grok-2-vision-1212',
    displayName: 'Grok 2 Vision',
    contextWindow: 32_768,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 2,
    costPerMTokenOutput: 10,
    supportsTools: false,
    supportsVision: true,
    supportsStreaming: true,
    family: 'grok-2',
  },
}

// ---------------------------------------------------------------------------
// Together AI
// ---------------------------------------------------------------------------
export const TOGETHER_MODELS: ProviderModelMap = {
  'meta-llama/Llama-3.3-70B-Instruct-Turbo': {
    id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    displayName: 'Llama 3.3 70B Turbo',
    contextWindow: 131_072,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 0.88,
    costPerMTokenOutput: 0.88,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
    isDefault: true,
  },
  'deepseek-ai/DeepSeek-V3': {
    id: 'deepseek-ai/DeepSeek-V3',
    displayName: 'DeepSeek V3',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 1.25,
    costPerMTokenOutput: 1.25,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
  'Qwen/QwQ-32B-Preview': {
    id: 'Qwen/QwQ-32B-Preview',
    displayName: 'QwQ 32B Preview',
    contextWindow: 32_768,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 1.2,
    costPerMTokenOutput: 1.2,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
}

// ---------------------------------------------------------------------------
// Fireworks AI
// ---------------------------------------------------------------------------
export const FIREWORKS_MODELS: ProviderModelMap = {
  'accounts/fireworks/models/llama-v3p3-70b-instruct': {
    id: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    displayName: 'Llama 3.3 70B',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.9,
    costPerMTokenOutput: 0.9,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
    isDefault: true,
  },
  'accounts/fireworks/models/deepseek-v3': {
    id: 'accounts/fireworks/models/deepseek-v3',
    displayName: 'DeepSeek V3',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.9,
    costPerMTokenOutput: 0.9,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
  'accounts/fireworks/models/qwen2p5-72b-instruct': {
    id: 'accounts/fireworks/models/qwen2p5-72b-instruct',
    displayName: 'Qwen 2.5 72B',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.9,
    costPerMTokenOutput: 0.9,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
}

// ---------------------------------------------------------------------------
// OpenRouter (curated popular models)
// ---------------------------------------------------------------------------
export const OPENROUTER_MODELS: ProviderModelMap = {
  'anthropic/claude-opus-4': {
    id: 'anthropic/claude-opus-4',
    displayName: 'Claude Opus 4 (via OpenRouter)',
    contextWindow: 200_000,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 15,
    costPerMTokenOutput: 75,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'claude',
    isDefault: true,
  },
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    displayName: 'GPT-4o (via OpenRouter)',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 2.5,
    costPerMTokenOutput: 10,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gpt-4o',
  },
  'google/gemini-2.5-pro': {
    id: 'google/gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro (via OpenRouter)',
    contextWindow: 1_048_576,
    maxOutputTokens: 65_536,
    costPerMTokenInput: 1.25,
    costPerMTokenOutput: 10,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemini',
  },
  'meta-llama/llama-3.3-70b-instruct': {
    id: 'meta-llama/llama-3.3-70b-instruct',
    displayName: 'Llama 3.3 70B (via OpenRouter)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.12,
    costPerMTokenOutput: 0.3,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
  },
  'x-ai/grok-3': {
    id: 'x-ai/grok-3',
    displayName: 'Grok 3 (via OpenRouter)',
    contextWindow: 131_072,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 3,
    costPerMTokenOutput: 15,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'grok',
  },
  'deepseek/deepseek-r1': {
    id: 'deepseek/deepseek-r1',
    displayName: 'DeepSeek R1 (via OpenRouter)',
    contextWindow: 65_536,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.5,
    costPerMTokenOutput: 2.18,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
}

// ---------------------------------------------------------------------------
// Ollama (common local models — user can always add more)
// ---------------------------------------------------------------------------
export const OLLAMA_MODELS: ProviderModelMap = {
  'llama3.3': {
    id: 'llama3.3',
    displayName: 'Llama 3.3 (local)',
    contextWindow: 128_000,
    maxOutputTokens: 32_768,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama3',
    isDefault: true,
  },
  'llama3.2': {
    id: 'llama3.2',
    displayName: 'Llama 3.2 (local)',
    contextWindow: 131_072,
    maxOutputTokens: 16_384,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama3',
  },
  'llama3.2-vision': {
    id: 'llama3.2-vision',
    displayName: 'Llama 3.2 Vision (local)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    supportsTools: false,
    supportsVision: true,
    supportsStreaming: true,
    family: 'llama3',
  },
  'qwen2.5-coder': {
    id: 'qwen2.5-coder',
    displayName: 'Qwen 2.5 Coder (local)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
  'qwen2.5:72b': {
    id: 'qwen2.5:72b',
    displayName: 'Qwen 2.5 72B (local)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
  'deepseek-r1': {
    id: 'deepseek-r1',
    displayName: 'DeepSeek R1 (local)',
    contextWindow: 65_536,
    maxOutputTokens: 8_192,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
  'mistral': {
    id: 'mistral',
    displayName: 'Mistral 7B (local)',
    contextWindow: 32_768,
    maxOutputTokens: 8_192,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'mistral',
  },
  'phi4': {
    id: 'phi4',
    displayName: 'Phi-4 (local)',
    contextWindow: 16_384,
    maxOutputTokens: 8_192,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'phi',
  },
  'gemma3': {
    id: 'gemma3',
    displayName: 'Gemma 3 (local)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    supportsTools: false,
    supportsVision: true,
    supportsStreaming: true,
    family: 'gemma',
  },
  'nomic-embed-text': {
    id: 'nomic-embed-text',
    displayName: 'Nomic Embed Text (local)',
    contextWindow: 8_192,
    maxOutputTokens: 0,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: false,
    family: 'embedding',
  },
}

// ---------------------------------------------------------------------------
// LM Studio (same well-known model IDs as Ollama typically)
// ---------------------------------------------------------------------------
export const LMSTUDIO_MODELS: ProviderModelMap = {
  'local-model': {
    id: 'local-model',
    displayName: 'Local Model (LM Studio)',
    contextWindow: 32_768,
    maxOutputTokens: 8_192,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    isDefault: true,
  },
}

// ---------------------------------------------------------------------------
// Master map: provider → model map
// ---------------------------------------------------------------------------
export const PROVIDER_MODELS: Partial<Record<APIProvider, ProviderModelMap>> = {
  openai: OPENAI_MODELS,
  gemini: GEMINI_MODELS,
  groq: GROQ_MODELS,
  mistral: MISTRAL_MODELS,
  xai: XAI_MODELS,
  together: TOGETHER_MODELS,
  fireworks: FIREWORKS_MODELS,
  openrouter: OPENROUTER_MODELS,
  ollama: OLLAMA_MODELS,
  lmstudio: LMSTUDIO_MODELS,
}

/**
 * Get well-known models for a given provider.
 * Returns an empty map for Anthropic native providers (handled by configs.ts).
 */
export function getProviderModels(provider: APIProvider): ProviderModelMap {
  return PROVIDER_MODELS[provider] ?? {}
}

/**
 * Get the default model for a provider (the one marked isDefault, or first entry).
 */
export function getDefaultModelForProvider(provider: APIProvider): string | null {
  const models = getProviderModels(provider)
  const entries = Object.values(models)
  if (entries.length === 0) return null
  return entries.find(m => m.isDefault)?.id ?? entries[0]?.id ?? null
}

/**
 * Resolve the model string to use: ANTHROPIC_MODEL env > provider default > null.
 */
export function resolveModelForProvider(provider: APIProvider): string | null {
  if (process.env.ANTHROPIC_MODEL) return process.env.ANTHROPIC_MODEL
  return getDefaultModelForProvider(provider)
}

/**
 * Get context window size for a known provider model. Falls back to 128k.
 */
export function getContextWindowForProviderModel(
  provider: APIProvider,
  modelId: string,
): number {
  const models = getProviderModels(provider)
  return models[modelId]?.contextWindow ?? 128_000
}

/**
 * Get max output tokens for a known provider model. Falls back to 8192.
 */
export function getMaxOutputTokensForProviderModel(
  provider: APIProvider,
  modelId: string,
): number {
  const models = getProviderModels(provider)
  return models[modelId]?.maxOutputTokens ?? 8_192
}

/**
 * Whether a known provider model supports tool/function calling.
 * Defaults to true for unknown models (optimistic).
 */
export function providerModelSupportsTools(
  provider: APIProvider,
  modelId: string,
): boolean {
  const models = getProviderModels(provider)
  return models[modelId]?.supportsTools ?? true
}
