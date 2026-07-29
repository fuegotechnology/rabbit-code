import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { isEnvTruthy } from '../envUtils.js'

/**
 * Supported API providers.
 *
 * | Provider       | Env var                              | Notes                                          |
 * |----------------|--------------------------------------|------------------------------------------------|
 * | firstParty     | (default)                            | Anthropic direct API                           |
 * | bedrock        | CLAUDE_CODE_USE_BEDROCK=1            | AWS Bedrock                                    |
 * | vertex         | CLAUDE_CODE_USE_VERTEX=1             | GCP Vertex AI                                  |
 * | foundry        | CLAUDE_CODE_USE_FOUNDRY=1            | Azure AI Foundry                               |
 * | openai         | CLAUDE_CODE_USE_OPENAI=1             | OpenAI / any OpenAI-compatible endpoint        |
 * | gemini         | CLAUDE_CODE_USE_GEMINI=1             | Google Gemini direct API                       |
 * | ollama         | CLAUDE_CODE_USE_OLLAMA=1             | Local Ollama instance                          |
 * | groq           | CLAUDE_CODE_USE_GROQ=1               | Groq fast inference                            |
 * | mistral        | CLAUDE_CODE_USE_MISTRAL=1            | Mistral AI                                     |
 * | xai            | CLAUDE_CODE_USE_XAI=1                | xAI (Grok)                                     |
 * | together        | CLAUDE_CODE_USE_TOGETHER=1           | Together AI                                    |
 * | fireworks       | CLAUDE_CODE_USE_FIREWORKS=1          | Fireworks AI                                   |
 * | openrouter      | CLAUDE_CODE_USE_OPENROUTER=1         | OpenRouter (multi-model proxy)                 |
 * | lmstudio        | CLAUDE_CODE_USE_LMSTUDIO=1           | LM Studio local server                         |
 * | custom          | CLAUDE_CODE_USE_CUSTOM_PROVIDER=1    | Custom OpenAI-compat base URL via OPENAI_BASE_URL |
 */
export type APIProvider =
  | 'firstParty'
  | 'bedrock'
  | 'vertex'
  | 'foundry'
  | 'openai'
  | 'gemini'
  | 'ollama'
  | 'groq'
  | 'mistral'
  | 'xai'
  | 'together'
  | 'fireworks'
  | 'openrouter'
  | 'lmstudio'
  | 'custom'

/**
 * OpenAI-compatible providers that use the chat completions API format.
 * These all go through the unified openaiCompatibleClient adapter.
 */
export const OPENAI_COMPATIBLE_PROVIDERS: ReadonlySet<APIProvider> = new Set([
  'openai',
  'gemini',
  'ollama',
  'groq',
  'mistral',
  'xai',
  'together',
  'fireworks',
  'openrouter',
  'lmstudio',
  'custom',
])

export function isOpenAICompatibleProvider(provider: APIProvider): boolean {
  return OPENAI_COMPATIBLE_PROVIDERS.has(provider)
}

export function getAPIProvider(): APIProvider {
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)) return 'bedrock'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)) return 'vertex'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)) return 'foundry'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_OPENAI)) return 'openai'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_GEMINI)) return 'gemini'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_OLLAMA)) return 'ollama'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_GROQ)) return 'groq'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_MISTRAL)) return 'mistral'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_XAI)) return 'xai'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_TOGETHER)) return 'together'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_FIREWORKS)) return 'fireworks'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_OPENROUTER)) return 'openrouter'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_LMSTUDIO)) return 'lmstudio'
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_CUSTOM_PROVIDER)) return 'custom'
  return 'firstParty'
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}

/**
 * Resolve the base URL for the current OpenAI-compatible provider.
 * OPENAI_BASE_URL always overrides provider-specific defaults.
 */
export function getOpenAICompatibleBaseURL(): string {
  // User-supplied override always wins
  if (process.env.OPENAI_BASE_URL) {
    return process.env.OPENAI_BASE_URL.replace(/\/$/, '')
  }

  const provider = getAPIProvider()
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1'
    case 'gemini':
      return 'https://generativelanguage.googleapis.com/v1beta/openai'
    case 'ollama':
      return (
        (process.env.OLLAMA_HOST
          ? process.env.OLLAMA_HOST.replace(/\/$/, '')
          : 'http://localhost:11434') + '/v1'
      )
    case 'groq':
      return 'https://api.groq.com/openai/v1'
    case 'mistral':
      return 'https://api.mistral.ai/v1'
    case 'xai':
      return 'https://api.x.ai/v1'
    case 'together':
      return 'https://api.together.xyz/v1'
    case 'fireworks':
      return 'https://api.fireworks.ai/inference/v1'
    case 'openrouter':
      return 'https://openrouter.ai/api/v1'
    case 'lmstudio':
      return (
        (process.env.LMSTUDIO_HOST
          ? process.env.LMSTUDIO_HOST.replace(/\/$/, '')
          : 'http://localhost:1234') + '/v1'
      )
    case 'custom':
      return process.env.OPENAI_BASE_URL ?? 'http://localhost:8000/v1'
    default:
      return 'https://api.openai.com/v1'
  }
}

/**
 * Resolve the API key for the current OpenAI-compatible provider.
 * Providers that don't need a key (Ollama, LM Studio) return an empty string.
 */
export function getOpenAICompatibleApiKey(): string {
  // OPENAI_API_KEY is the universal override
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY
  }

  const provider = getAPIProvider()
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY ?? ''
    case 'gemini':
      return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? ''
    case 'ollama':
      return process.env.OLLAMA_API_KEY ?? 'ollama' // Ollama accepts any key
    case 'groq':
      return process.env.GROQ_API_KEY ?? ''
    case 'mistral':
      return process.env.MISTRAL_API_KEY ?? ''
    case 'xai':
      return process.env.XAI_API_KEY ?? ''
    case 'together':
      return process.env.TOGETHER_API_KEY ?? ''
    case 'fireworks':
      return process.env.FIREWORKS_API_KEY ?? ''
    case 'openrouter':
      return process.env.OPENROUTER_API_KEY ?? ''
    case 'lmstudio':
      return process.env.LMSTUDIO_API_KEY ?? 'lm-studio' // LM Studio accepts any key
    case 'custom':
      return process.env.CUSTOM_PROVIDER_API_KEY ?? process.env.OPENAI_API_KEY ?? ''
    default:
      return ''
  }
}

/**
 * Human-readable name for the current provider (used in UI / error messages).
 */
export function getProviderDisplayName(provider?: APIProvider): string {
  const p = provider ?? getAPIProvider()
  const names: Record<APIProvider, string> = {
    firstParty: 'Anthropic',
    bedrock: 'AWS Bedrock',
    vertex: 'Google Vertex AI',
    foundry: 'Azure AI Foundry',
    openai: 'OpenAI',
    gemini: 'Google Gemini',
    ollama: 'Ollama (local)',
    groq: 'Groq',
    mistral: 'Mistral AI',
    xai: 'xAI (Grok)',
    together: 'Together AI',
    fireworks: 'Fireworks AI',
    openrouter: 'OpenRouter',
    lmstudio: 'LM Studio (local)',
    custom: 'Custom Provider',
  }
  return names[p] ?? p
}

/**
 * Check if ANTHROPIC_BASE_URL is a first-party Anthropic API URL.
 * Returns true if not set (default API) or points to api.anthropic.com
 * (or api-staging.anthropic.com for ant users).
 */
export function isFirstPartyAnthropicBaseUrl(): boolean {
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (!baseUrl) {
    return true
  }
  try {
    const host = new URL(baseUrl).host
    const allowedHosts = ['api.anthropic.com']
    if (process.env.USER_TYPE === 'ant') {
      allowedHosts.push('api-staging.anthropic.com')
    }
    return allowedHosts.includes(host)
  } catch {
    return false
  }
}
