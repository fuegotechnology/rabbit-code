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
// DeepSeek
// ---------------------------------------------------------------------------
export const DEEPSEEK_MODELS: ProviderModelMap = {
  'deepseek-chat': {
    id: 'deepseek-chat',
    displayName: 'DeepSeek V3 (Chat)',
    contextWindow: 65_536,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.14,
    costPerMTokenOutput: 0.28,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek-v3',
    isDefault: true,
  },
  'deepseek-reasoner': {
    id: 'deepseek-reasoner',
    displayName: 'DeepSeek R1 (Reasoner)',
    contextWindow: 65_536,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 0.55,
    costPerMTokenOutput: 2.19,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek-r1',
  },
  'deepseek-coder': {
    id: 'deepseek-coder',
    displayName: 'DeepSeek Coder V2',
    contextWindow: 65_536,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.14,
    costPerMTokenOutput: 0.28,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek-coder',
  },
}

// ---------------------------------------------------------------------------
// Cohere
// ---------------------------------------------------------------------------
export const COHERE_MODELS: ProviderModelMap = {
  'command-r-plus-08-2024': {
    id: 'command-r-plus-08-2024',
    displayName: 'Command R+ (Aug 2024)',
    contextWindow: 128_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 2.5,
    costPerMTokenOutput: 10,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'command-r-plus',
    isDefault: true,
  },
  'command-r-08-2024': {
    id: 'command-r-08-2024',
    displayName: 'Command R (Aug 2024)',
    contextWindow: 128_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 0.15,
    costPerMTokenOutput: 0.6,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'command-r',
  },
  'command-a-03-2025': {
    id: 'command-a-03-2025',
    displayName: 'Command A (Mar 2025)',
    contextWindow: 256_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 2.5,
    costPerMTokenOutput: 10,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'command-a',
  },
}

// ---------------------------------------------------------------------------
// Perplexity
// ---------------------------------------------------------------------------
export const PERPLEXITY_MODELS: ProviderModelMap = {
  'sonar-pro': {
    id: 'sonar-pro',
    displayName: 'Sonar Pro (online search)',
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 3,
    costPerMTokenOutput: 15,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'sonar',
    isDefault: true,
  },
  'sonar': {
    id: 'sonar',
    displayName: 'Sonar (online search)',
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 1,
    costPerMTokenOutput: 1,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'sonar',
  },
  'sonar-reasoning-pro': {
    id: 'sonar-reasoning-pro',
    displayName: 'Sonar Reasoning Pro',
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 8,
    costPerMTokenOutput: 40,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'sonar-reasoning',
  },
  'sonar-deep-research': {
    id: 'sonar-deep-research',
    displayName: 'Sonar Deep Research',
    contextWindow: 200_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 2,
    costPerMTokenOutput: 8,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'sonar-research',
  },
}

// ---------------------------------------------------------------------------
// Cerebras (ultra-fast inference)
// ---------------------------------------------------------------------------
export const CEREBRAS_MODELS: ProviderModelMap = {
  'llama-4-scout-17b-16e-instruct': {
    id: 'llama-4-scout-17b-16e-instruct',
    displayName: 'Llama 4 Scout 17B (Cerebras)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.1,
    costPerMTokenOutput: 0.1,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'llama-4',
    isDefault: true,
  },
  'llama3.1-70b': {
    id: 'llama3.1-70b',
    displayName: 'Llama 3.1 70B (Cerebras)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.6,
    costPerMTokenOutput: 0.6,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
  },
  'llama3.1-8b': {
    id: 'llama3.1-8b',
    displayName: 'Llama 3.1 8B (Cerebras)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.1,
    costPerMTokenOutput: 0.1,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
  },
  'qwen-3-32b': {
    id: 'qwen-3-32b',
    displayName: 'Qwen 3 32B (Cerebras)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.4,
    costPerMTokenOutput: 0.4,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
}

// ---------------------------------------------------------------------------
// SambaNova
// ---------------------------------------------------------------------------
export const SAMBANOVA_MODELS: ProviderModelMap = {
  'Meta-Llama-3.3-70B-Instruct': {
    id: 'Meta-Llama-3.3-70B-Instruct',
    displayName: 'Llama 3.3 70B (SambaNova)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.6,
    costPerMTokenOutput: 1.2,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
    isDefault: true,
  },
  'DeepSeek-R1-Distill-Llama-70B': {
    id: 'DeepSeek-R1-Distill-Llama-70B',
    displayName: 'DeepSeek R1 Distill 70B (SambaNova)',
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 1.0,
    costPerMTokenOutput: 2.0,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
  'Qwen3-32B': {
    id: 'Qwen3-32B',
    displayName: 'Qwen 3 32B (SambaNova)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.4,
    costPerMTokenOutput: 0.8,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
}

// ---------------------------------------------------------------------------
// Hyperbolic
// ---------------------------------------------------------------------------
export const HYPERBOLIC_MODELS: ProviderModelMap = {
  'meta-llama/Llama-3.3-70B-Instruct': {
    id: 'meta-llama/Llama-3.3-70B-Instruct',
    displayName: 'Llama 3.3 70B (Hyperbolic)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.4,
    costPerMTokenOutput: 0.4,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
    isDefault: true,
  },
  'deepseek-ai/DeepSeek-V3': {
    id: 'deepseek-ai/DeepSeek-V3',
    displayName: 'DeepSeek V3 (Hyperbolic)',
    contextWindow: 65_536,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.5,
    costPerMTokenOutput: 0.5,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'deepseek',
  },
  'Qwen/Qwen2.5-72B-Instruct': {
    id: 'Qwen/Qwen2.5-72B-Instruct',
    displayName: 'Qwen 2.5 72B (Hyperbolic)',
    contextWindow: 131_072,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.4,
    costPerMTokenOutput: 0.4,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'qwen',
  },
}

// ---------------------------------------------------------------------------
// NVIDIA NIM
// ---------------------------------------------------------------------------
export const NVIDIA_MODELS: ProviderModelMap = {
  'meta/llama-3.3-70b-instruct': {
    id: 'meta/llama-3.3-70b-instruct',
    displayName: 'Llama 3.3 70B (NVIDIA NIM)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.77,
    costPerMTokenOutput: 0.77,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'llama-3',
    isDefault: true,
  },
  'nvidia/llama-3.1-nemotron-ultra-253b-v1': {
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1',
    displayName: 'Nemotron Ultra 253B (NVIDIA)',
    contextWindow: 128_000,
    maxOutputTokens: 32_768,
    costPerMTokenInput: 3.0,
    costPerMTokenOutput: 3.0,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'nemotron',
  },
  'mistralai/mistral-large-2-instruct': {
    id: 'mistralai/mistral-large-2-instruct',
    displayName: 'Mistral Large 2 (NVIDIA NIM)',
    contextWindow: 128_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 2.0,
    costPerMTokenOutput: 6.0,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'mistral',
  },
}

// ---------------------------------------------------------------------------
// AI21 Labs
// ---------------------------------------------------------------------------
export const AI21_MODELS: ProviderModelMap = {
  'jamba-1.6-large': {
    id: 'jamba-1.6-large',
    displayName: 'Jamba 1.6 Large',
    contextWindow: 256_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 2.0,
    costPerMTokenOutput: 8.0,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'jamba',
    isDefault: true,
  },
  'jamba-1.6-mini': {
    id: 'jamba-1.6-mini',
    displayName: 'Jamba 1.6 Mini',
    contextWindow: 256_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 0.2,
    costPerMTokenOutput: 0.4,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'jamba',
  },
}

// ---------------------------------------------------------------------------
// Moonshot AI (Kimi)
// ---------------------------------------------------------------------------
export const MOONSHOT_MODELS: ProviderModelMap = {
  'kimi-k2': {
    id: 'kimi-k2',
    displayName: 'Kimi K2',
    contextWindow: 131_072,
    maxOutputTokens: 16_384,
    costPerMTokenInput: 0.6,
    costPerMTokenOutput: 2.5,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'kimi',
    isDefault: true,
  },
  'moonshot-v1-128k': {
    id: 'moonshot-v1-128k',
    displayName: 'Moonshot v1 128k',
    contextWindow: 128_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 8.0,
    costPerMTokenOutput: 24.0,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'moonshot',
  },
}

// ---------------------------------------------------------------------------
// Zhipu AI (GLM)
// ---------------------------------------------------------------------------
export const ZHIPU_MODELS: ProviderModelMap = {
  'glm-4-plus': {
    id: 'glm-4-plus',
    displayName: 'GLM-4 Plus',
    contextWindow: 128_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 5.0,
    costPerMTokenOutput: 5.0,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'glm-4',
    isDefault: true,
  },
  'glm-4-air': {
    id: 'glm-4-air',
    displayName: 'GLM-4 Air',
    contextWindow: 128_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 1.0,
    costPerMTokenOutput: 1.0,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'glm-4',
  },
}

// ---------------------------------------------------------------------------
// StepFun
// ---------------------------------------------------------------------------
export const STEPFUN_MODELS: ProviderModelMap = {
  'step-2-16k': {
    id: 'step-2-16k',
    displayName: 'Step-2 16k',
    contextWindow: 16_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 4.8,
    costPerMTokenOutput: 16.0,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'step-2',
    isDefault: true,
  },
  'step-1-8k': {
    id: 'step-1-8k',
    displayName: 'Step-1 8k',
    contextWindow: 8_000,
    maxOutputTokens: 4_096,
    costPerMTokenInput: 1.2,
    costPerMTokenOutput: 4.0,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    family: 'step-1',
  },
}

// ---------------------------------------------------------------------------
// MiniMax
// ---------------------------------------------------------------------------
export const MINIMAX_MODELS: ProviderModelMap = {
  'MiniMax-Text-01': {
    id: 'MiniMax-Text-01',
    displayName: 'MiniMax Text-01 (4M context)',
    contextWindow: 4_096_000,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.2,
    costPerMTokenOutput: 1.1,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'minimax-text',
    isDefault: true,
  },
  'abab6.5s-chat': {
    id: 'abab6.5s-chat',
    displayName: 'ABAB 6.5S Chat',
    contextWindow: 245_760,
    maxOutputTokens: 8_192,
    costPerMTokenInput: 0.1,
    costPerMTokenOutput: 0.1,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    family: 'abab',
  },
}

// ---------------------------------------------------------------------------
// OpenCode / Zen-mode (local AI coding assistant proxy)
// ---------------------------------------------------------------------------
export const OPENCODE_MODELS: ProviderModelMap = {
  'auto': {
    id: 'auto',
    displayName: 'OpenCode Auto (routed)',
    contextWindow: 200_000,
    maxOutputTokens: 32_768,
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    family: 'opencode',
    isDefault: true,
  },
}

// ---------------------------------------------------------------------------
// Jan.ai (local)
// ---------------------------------------------------------------------------
export const JAN_MODELS: ProviderModelMap = {
  'local-model': {
    id: 'local-model',
    displayName: 'Jan Local Model',
    contextWindow: 32_768,
    maxOutputTokens: 8_192,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    isDefault: true,
  },
}

// ---------------------------------------------------------------------------
// LocalAI (self-hosted)
// ---------------------------------------------------------------------------
export const LOCALAI_MODELS: ProviderModelMap = {
  'gpt-4': {
    id: 'gpt-4',
    displayName: 'LocalAI GPT-4 (aliased)',
    contextWindow: 32_768,
    maxOutputTokens: 8_192,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    isDefault: true,
  },
}

// ---------------------------------------------------------------------------
// vLLM (self-hosted)
// ---------------------------------------------------------------------------
export const VLLM_MODELS: ProviderModelMap = {
  'served-model': {
    id: 'served-model',
    displayName: 'vLLM Served Model',
    contextWindow: 131_072,
    maxOutputTokens: 16_384,
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    isDefault: true,
  },
}

// ---------------------------------------------------------------------------
// HuggingFace TGI (self-hosted)
// ---------------------------------------------------------------------------
export const TGI_MODELS: ProviderModelMap = {
  'tgi-model': {
    id: 'tgi-model',
    displayName: 'TGI Served Model',
    contextWindow: 32_768,
    maxOutputTokens: 4_096,
    supportsTools: false,
    supportsVision: false,
    supportsStreaming: true,
    isDefault: true,
  },
}

// ---------------------------------------------------------------------------
// Xinference (self-hosted)
// ---------------------------------------------------------------------------
export const XINFERENCE_MODELS: ProviderModelMap = {
  'xinference-model': {
    id: 'xinference-model',
    displayName: 'Xinference Model',
    contextWindow: 32_768,
    maxOutputTokens: 4_096,
    supportsTools: false,
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
  deepseek: DEEPSEEK_MODELS,
  cohere: COHERE_MODELS,
  perplexity: PERPLEXITY_MODELS,
  cerebras: CEREBRAS_MODELS,
  sambanova: SAMBANOVA_MODELS,
  hyperbolic: HYPERBOLIC_MODELS,
  nvidia: NVIDIA_MODELS,
  ai21: AI21_MODELS,
  moonshot: MOONSHOT_MODELS,
  zhipu: ZHIPU_MODELS,
  stepfun: STEPFUN_MODELS,
  minimax: MINIMAX_MODELS,
  opencode: OPENCODE_MODELS,
  ollama: OLLAMA_MODELS,
  lmstudio: LMSTUDIO_MODELS,
  jan: JAN_MODELS,
  localai: LOCALAI_MODELS,
  vllm: VLLM_MODELS,
  tgi: TGI_MODELS,
  xinference: XINFERENCE_MODELS,
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
