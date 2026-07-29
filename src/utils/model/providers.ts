import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { isEnvTruthy } from '../envUtils.js'

/**
 * Supported API providers in rabbit-code.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ CLOUD / ANTHROPIC-NATIVE                                                │
 * │  firstParty    (default)                Anthropic direct API            │
 * │  bedrock       RABBIT_USE_BEDROCK=1     AWS Bedrock                     │
 * │  vertex        RABBIT_USE_VERTEX=1      GCP Vertex AI                   │
 * │  foundry       RABBIT_USE_FOUNDRY=1     Azure AI Foundry                │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ FREE TIERS — no credit card required (★ = completely free / no key)     │
 * │  gemini        RABBIT_USE_GEMINI=1      Gemini 2.5 Pro free ★           │
 * │  groq          RABBIT_USE_GROQ=1        Groq free tier (14.4k req/day)  │
 * │  mistral       RABBIT_USE_MISTRAL=1     Mistral free tier (1B tok/mo)   │
 * │  cerebras      RABBIT_USE_CEREBRAS=1    Cerebras free (1M tok/day)      │
 * │  deepseek      RABBIT_USE_DEEPSEEK=1    DeepSeek free (5M tok free)     │
 * │  cohere        RABBIT_USE_COHERE=1      Cohere free tier                │
 * │  nvidia        RABBIT_USE_NVIDIA=1      NVIDIA NIM free tier            │
 * │  githubmodels  RABBIT_USE_GITHUBMODELS=1 GitHub Models (GITHUB_TOKEN)   │
 * │  huggingface   RABBIT_USE_HUGGINGFACE=1 HuggingFace Inference (HF_TOKEN)│
 * │  cloudflare    RABBIT_USE_CLOUDFLARE=1  Cloudflare Workers AI ★         │
 * │  pollinations  RABBIT_USE_POLLINATIONS=1 Pollinations AI ★ (no key!)    │
 * │  siliconflow   RABBIT_USE_SILICONFLOW=1 SiliconFlow (free tier)         │
 * │  llm7          RABBIT_USE_LLM7=1        LLM7.io ★ (no key, unlimited)   │
 * │  modelscope    RABBIT_USE_MODELSCOPE=1  ModelScope (Alibaba, free tier) │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ OPENAI-COMPATIBLE — major cloud                                         │
 * │  openai        RABBIT_USE_OPENAI=1      OpenAI (GPT-4o, o3, o4…)       │
 * │  xai           RABBIT_USE_XAI=1         xAI Grok-3                      │
 * │  together      RABBIT_USE_TOGETHER=1    Together AI                     │
 * │  fireworks     RABBIT_USE_FIREWORKS=1   Fireworks AI                    │
 * │  openrouter    RABBIT_USE_OPENROUTER=1  OpenRouter (200+ models)        │
 * │  perplexity    RABBIT_USE_PERPLEXITY=1  Perplexity (online search AI)   │
 * │  sambanova     RABBIT_USE_SAMBANOVA=1   SambaNova (fast Llama / DeepSeek)│
 * │  hyperbolic    RABBIT_USE_HYPERBOLIC=1  Hyperbolic (cheap GPU models)   │
 * │  ai21          RABBIT_USE_AI21=1        AI21 Jamba                      │
 * │  moonshot      RABBIT_USE_MOONSHOT=1    Moonshot AI (Kimi)              │
 * │  zhipu         RABBIT_USE_ZHIPU=1       Zhipu AI (GLM)                  │
 * │  baidu         RABBIT_USE_BAIDU=1       Baidu ERNIE                     │
 * │  qianfan       RABBIT_USE_QIANFAN=1     Baidu Qianfan                   │
 * │  stepfun       RABBIT_USE_STEPFUN=1     StepFun (Step)                  │
 * │  minimax       RABBIT_USE_MINIMAX=1     MiniMax                         │
 * │  opencode      RABBIT_USE_OPENCODE=1    OpenCode (zen-mode local/cloud) │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ LOCAL / SELF-HOSTED                                                     │
 * │  ollama        RABBIT_USE_OLLAMA=1      Ollama local server ★           │
 * │  lmstudio      RABBIT_USE_LMSTUDIO=1    LM Studio local server ★        │
 * │  jan           RABBIT_USE_JAN=1         Jan.ai local server ★           │
 * │  localai       RABBIT_USE_LOCALAI=1     LocalAI self-hosted ★           │
 * │  vllm          RABBIT_USE_VLLM=1        vLLM self-hosted ★              │
 * │  tgi           RABBIT_USE_TGI=1         HuggingFace TGI self-hosted ★   │
 * │  xinference    RABBIT_USE_XINFERENCE=1  Xinference ★                    │
 * │  custom        RABBIT_USE_CUSTOM=1      Any OpenAI-compat (OPENAI_BASE_URL) │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Legacy aliases (backwards-compat with CLAUDE_CODE_USE_* prefix) are also
 * honoured — see getAPIProvider() below.
 */
export type APIProvider =
  // Anthropic-native
  | 'firstParty'
  | 'bedrock'
  | 'vertex'
  | 'foundry'
  // Free-tier cloud (no credit card for basic use)
  | 'gemini'       // Google AI Studio — free, no CC
  | 'groq'         // Groq free tier — no CC
  | 'mistral'      // Mistral free tier — no CC
  | 'cerebras'     // Cerebras free — no CC
  | 'deepseek'     // DeepSeek free 5M tokens — no CC
  | 'cohere'       // Cohere free tier — no CC
  | 'nvidia'       // NVIDIA NIM free tier — no CC (phone verify)
  | 'githubmodels' // GitHub Models — free with GitHub account (GITHUB_TOKEN)
  | 'huggingface'  // HuggingFace Inference — free $0.10/mo credits (HF_TOKEN)
  | 'cloudflare'   // Cloudflare Workers AI — 10K neurons/day free, no CC
  | 'pollinations' // Pollinations AI — completely free, no key required!
  | 'siliconflow'  // SiliconFlow — generous free tier, registration
  | 'llm7'         // LLM7.io — completely free, no key required!
  | 'modelscope'   // ModelScope (Alibaba) — free tier, registration
  // Paid cloud
  | 'openai'
  | 'xai'
  | 'together'
  | 'fireworks'
  | 'openrouter'
  | 'perplexity'
  | 'sambanova'
  | 'hyperbolic'
  | 'ai21'
  | 'moonshot'
  | 'zhipu'
  | 'baidu'
  | 'qianfan'
  | 'stepfun'
  | 'minimax'
  | 'opencode'
  // Local / self-hosted (free)
  | 'ollama'
  | 'lmstudio'
  | 'jan'
  | 'localai'
  | 'vllm'
  | 'tgi'
  | 'xinference'
  | 'custom'

/**
 * OpenAI-compatible providers that use the Chat Completions API format.
 * These all go through the unified openaiCompatibleClient adapter.
 */
export const OPENAI_COMPATIBLE_PROVIDERS: ReadonlySet<APIProvider> = new Set([
  // Free-tier
  'gemini',
  'groq',
  'mistral',
  'cerebras',
  'deepseek',
  'cohere',
  'nvidia',
  'githubmodels',
  'huggingface',
  'cloudflare',
  'pollinations',
  'siliconflow',
  'llm7',
  'modelscope',
  // Paid cloud
  'openai',
  'xai',
  'together',
  'fireworks',
  'openrouter',
  'perplexity',
  'sambanova',
  'hyperbolic',
  'ai21',
  'moonshot',
  'zhipu',
  'baidu',
  'qianfan',
  'stepfun',
  'minimax',
  'opencode',
  // Local
  'ollama',
  'lmstudio',
  'jan',
  'localai',
  'vllm',
  'tgi',
  'xinference',
  'custom',
])

/**
 * Providers that are free (no credit card required, no billing).
 * Some require a free account/key, some need nothing at all.
 */
export const FREE_PROVIDERS: ReadonlySet<APIProvider> = new Set([
  // Cloud — truly free tier, no CC
  'gemini',        // Google AI Studio — free API key
  'groq',          // Groq — free API key
  'mistral',       // Mistral — free API key
  'cerebras',      // Cerebras — free API key
  'deepseek',      // DeepSeek — free 5M tokens
  'cohere',        // Cohere — free API key
  'nvidia',        // NVIDIA NIM — free tier (phone verify)
  'githubmodels',  // GitHub Models — free GITHUB_TOKEN
  'huggingface',   // HuggingFace — free HF_TOKEN
  // Cloud — no key needed at all!
  'cloudflare',    // Cloudflare Workers AI (with account, 10k neurons/day)
  'pollinations',  // Pollinations AI — totally anonymous, no key
  'llm7',          // LLM7.io — totally anonymous, no key
  // Free with registration
  'siliconflow',   // SiliconFlow — generous free tier
  'modelscope',    // ModelScope — free tier
  // Local (always free)
  'ollama',
  'lmstudio',
  'jan',
  'localai',
  'vllm',
  'tgi',
  'xinference',
])

export function isOpenAICompatibleProvider(provider: APIProvider): boolean {
  return OPENAI_COMPATIBLE_PROVIDERS.has(provider)
}

/** Helper — checks both the new RABBIT_USE_* and legacy CLAUDE_CODE_USE_* flags */
function useFlag(name: string): boolean {
  return (
    isEnvTruthy(process.env[`RABBIT_USE_${name}`]) ||
    isEnvTruthy(process.env[`CLAUDE_CODE_USE_${name}`])
  )
}

export function getAPIProvider(): APIProvider {
  // Anthropic-native
  if (useFlag('BEDROCK'))    return 'bedrock'
  if (useFlag('VERTEX'))     return 'vertex'
  if (useFlag('FOUNDRY'))    return 'foundry'
  // Free-tier cloud
  if (useFlag('GEMINI'))        return 'gemini'
  if (useFlag('GROQ'))          return 'groq'
  if (useFlag('MISTRAL'))       return 'mistral'
  if (useFlag('CEREBRAS'))      return 'cerebras'
  if (useFlag('DEEPSEEK'))      return 'deepseek'
  if (useFlag('COHERE'))        return 'cohere'
  if (useFlag('NVIDIA'))        return 'nvidia'
  if (useFlag('GITHUBMODELS') || isEnvTruthy(process.env.GITHUB_MODELS)) return 'githubmodels'
  if (useFlag('HUGGINGFACE') || isEnvTruthy(process.env.HF_INFERENCE))   return 'huggingface'
  if (useFlag('CLOUDFLARE'))    return 'cloudflare'
  if (useFlag('POLLINATIONS'))  return 'pollinations'
  if (useFlag('SILICONFLOW'))   return 'siliconflow'
  if (useFlag('LLM7'))          return 'llm7'
  if (useFlag('MODELSCOPE'))    return 'modelscope'
  // Paid cloud
  if (useFlag('OPENAI'))        return 'openai'
  if (useFlag('XAI'))           return 'xai'
  if (useFlag('TOGETHER'))      return 'together'
  if (useFlag('FIREWORKS'))     return 'fireworks'
  if (useFlag('OPENROUTER'))    return 'openrouter'
  if (useFlag('PERPLEXITY'))    return 'perplexity'
  if (useFlag('SAMBANOVA'))     return 'sambanova'
  if (useFlag('HYPERBOLIC'))    return 'hyperbolic'
  if (useFlag('AI21'))          return 'ai21'
  if (useFlag('MOONSHOT'))      return 'moonshot'
  if (useFlag('ZHIPU'))         return 'zhipu'
  if (useFlag('BAIDU'))         return 'baidu'
  if (useFlag('QIANFAN'))       return 'qianfan'
  if (useFlag('STEPFUN'))       return 'stepfun'
  if (useFlag('MINIMAX'))       return 'minimax'
  if (useFlag('OPENCODE'))      return 'opencode'
  // Local
  if (useFlag('OLLAMA'))     return 'ollama'
  if (useFlag('LMSTUDIO'))   return 'lmstudio'
  if (useFlag('JAN'))        return 'jan'
  if (useFlag('LOCALAI'))    return 'localai'
  if (useFlag('VLLM'))       return 'vllm'
  if (useFlag('TGI'))        return 'tgi'
  if (useFlag('XINFERENCE')) return 'xinference'
  // Custom / legacy
  if (useFlag('CUSTOM_PROVIDER') || useFlag('CUSTOM')) return 'custom'
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
  if (process.env.OPENAI_BASE_URL) {
    return process.env.OPENAI_BASE_URL.replace(/\/$/, '')
  }

  const provider = getAPIProvider()
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1'
    case 'gemini':
      return 'https://generativelanguage.googleapis.com/v1beta/openai'
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
    case 'deepseek':
      return 'https://api.deepseek.com/v1'
    case 'cohere':
      return 'https://api.cohere.com/compatibility/v1'
    case 'perplexity':
      return 'https://api.perplexity.ai'
    case 'cerebras':
      return 'https://api.cerebras.ai/v1'
    case 'sambanova':
      return 'https://api.sambanova.ai/v1'
    case 'hyperbolic':
      return 'https://api.hyperbolic.xyz/v1'
    case 'nvidia':
      return process.env.NVIDIA_BASE_URL ?? 'https://integrate.api.nvidia.com/v1'
    case 'ai21':
      return 'https://api.ai21.com/studio/v1'
    case 'moonshot':
      return 'https://api.moonshot.cn/v1'
    case 'zhipu':
      return 'https://open.bigmodel.cn/api/paas/v4'
    case 'baidu':
      return 'https://qianfan.baidubce.com/v2'
    case 'qianfan':
      return 'https://qianfan.baidubce.com/v2'
    case 'stepfun':
      return 'https://api.stepfun.com/v1'
    case 'minimax':
      return 'https://api.minimax.chat/v1'
    // Free providers
    case 'githubmodels':
      return 'https://models.github.ai/inference'
    case 'huggingface':
      return 'https://router.huggingface.co/v1'
    case 'cloudflare': {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? ''
      return accountId
        ? `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`
        : 'https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/ai/v1'
    }
    case 'pollinations':
      return 'https://text.pollinations.ai/openai'
    case 'siliconflow':
      return 'https://api.siliconflow.cn/v1'
    case 'llm7':
      return 'https://api.llm7.io/v1'
    case 'modelscope':
      return 'https://api-inference.modelscope.cn/v1'
    case 'opencode': {
      // OpenCode / Zen mode cloud endpoint or local proxy
      const host = process.env.OPENCODE_HOST ?? 'https://opencode.ai/zen'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'ollama': {
      const host = process.env.OLLAMA_HOST ?? 'http://localhost:11434'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'lmstudio': {
      const host = process.env.LMSTUDIO_HOST ?? 'http://localhost:1234'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'jan': {
      const host = process.env.JAN_HOST ?? 'http://localhost:1337'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'localai': {
      const host = process.env.LOCALAI_HOST ?? 'http://localhost:8080'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'vllm': {
      const host = process.env.VLLM_HOST ?? 'http://localhost:8000'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'tgi': {
      const host = process.env.TGI_HOST ?? 'http://localhost:8080'
      return `${host.replace(/\/$/, '')}/v1`
    }
    case 'xinference': {
      const host = process.env.XINFERENCE_HOST ?? 'http://localhost:9997'
      return `${host.replace(/\/$/, '')}/v1`
    }
    default:
      return process.env.OPENAI_BASE_URL ?? 'http://localhost:8000/v1'
  }
}

/**
 * Resolve the API key for the current OpenAI-compatible provider.
 */
export function getOpenAICompatibleApiKey(): string {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY

  const provider = getAPIProvider()
  switch (provider) {
    case 'openai':       return process.env.OPENAI_API_KEY ?? ''
    case 'gemini':       return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? ''
    case 'groq':         return process.env.GROQ_API_KEY ?? ''
    case 'mistral':      return process.env.MISTRAL_API_KEY ?? ''
    case 'xai':          return process.env.XAI_API_KEY ?? ''
    case 'together':     return process.env.TOGETHER_API_KEY ?? ''
    case 'fireworks':    return process.env.FIREWORKS_API_KEY ?? ''
    case 'openrouter':   return process.env.OPENROUTER_API_KEY ?? ''
    case 'deepseek':     return process.env.DEEPSEEK_API_KEY ?? ''
    case 'cohere':       return process.env.COHERE_API_KEY ?? ''
    case 'perplexity':   return process.env.PERPLEXITY_API_KEY ?? ''
    case 'cerebras':     return process.env.CEREBRAS_API_KEY ?? ''
    case 'sambanova':    return process.env.SAMBANOVA_API_KEY ?? ''
    case 'hyperbolic':   return process.env.HYPERBOLIC_API_KEY ?? ''
    case 'nvidia':       return process.env.NVIDIA_API_KEY ?? ''
    case 'ai21':         return process.env.AI21_API_KEY ?? ''
    case 'moonshot':     return process.env.MOONSHOT_API_KEY ?? ''
    case 'zhipu':        return process.env.ZHIPU_API_KEY ?? ''
    case 'baidu':        return process.env.BAIDU_API_KEY ?? process.env.QIANFAN_API_KEY ?? ''
    case 'qianfan':      return process.env.QIANFAN_API_KEY ?? process.env.BAIDU_API_KEY ?? ''
    case 'stepfun':      return process.env.STEPFUN_API_KEY ?? ''
    case 'minimax':      return process.env.MINIMAX_API_KEY ?? ''
    // Free providers
    case 'githubmodels': return process.env.GITHUB_TOKEN ?? process.env.GITHUB_MODELS_TOKEN ?? ''
    case 'huggingface':  return process.env.HF_TOKEN ?? process.env.HUGGINGFACE_HUB_TOKEN ?? ''
    case 'cloudflare':   return process.env.CLOUDFLARE_API_TOKEN ?? process.env.CF_API_TOKEN ?? ''
    case 'pollinations': return process.env.POLLINATIONS_API_KEY ?? ''   // no key needed for free models
    case 'siliconflow':  return process.env.SILICONFLOW_API_KEY ?? ''
    case 'llm7':         return process.env.LLM7_API_KEY ?? 'no-key-needed' // keyless
    case 'modelscope':   return process.env.MODELSCOPE_API_KEY ?? process.env.DASHSCOPE_API_KEY ?? ''
    case 'opencode':     return process.env.OPENCODE_API_KEY ?? ''
    case 'ollama':       return process.env.OLLAMA_API_KEY ?? 'ollama'
    case 'lmstudio':     return process.env.LMSTUDIO_API_KEY ?? 'lm-studio'
    case 'jan':          return process.env.JAN_API_KEY ?? 'jan'
    case 'localai':      return process.env.LOCALAI_API_KEY ?? 'localai'
    case 'vllm':         return process.env.VLLM_API_KEY ?? 'vllm'
    case 'tgi':          return process.env.TGI_API_KEY ?? ''
    case 'xinference':   return process.env.XINFERENCE_API_KEY ?? ''
    case 'custom':       return process.env.CUSTOM_PROVIDER_API_KEY ?? ''
    default:             return ''
  }
}

/**
 * Human-readable display name for a provider.
 */
export function getProviderDisplayName(provider?: APIProvider): string {
  const p = provider ?? getAPIProvider()
  const names: Record<APIProvider, string> = {
    firstParty:  'Anthropic',
    bedrock:     'AWS Bedrock',
    vertex:      'Google Vertex AI',
    foundry:     'Azure AI Foundry',
    openai:      'OpenAI',
    gemini:      'Google Gemini',
    groq:        'Groq',
    mistral:     'Mistral AI',
    xai:         'xAI (Grok)',
    together:    'Together AI',
    fireworks:   'Fireworks AI',
    openrouter:  'OpenRouter',
    deepseek:    'DeepSeek',
    cohere:      'Cohere',
    perplexity:  'Perplexity',
    cerebras:    'Cerebras',
    sambanova:   'SambaNova',
    hyperbolic:  'Hyperbolic',
    nvidia:      'NVIDIA NIM',
    ai21:        'AI21 Labs',
    moonshot:    'Moonshot AI (Kimi)',
    zhipu:       'Zhipu AI (GLM)',
    baidu:       'Baidu ERNIE',
    qianfan:     'Baidu Qianfan',
    stepfun:     'StepFun',
    minimax:     'MiniMax',
    githubmodels:'GitHub Models (free)',
    huggingface: 'HuggingFace Inference (free)',
    cloudflare:  'Cloudflare Workers AI (free)',
    pollinations:'Pollinations AI (free, no key!)',
    siliconflow: 'SiliconFlow (free tier)',
    llm7:        'LLM7.io (free, no key!)',
    modelscope:  'ModelScope / Alibaba (free tier)',
    opencode:    'OpenCode / Zen',
    ollama:      'Ollama (local)',
    lmstudio:    'LM Studio (local)',
    jan:         'Jan.ai (local)',
    localai:     'LocalAI (local)',
    vllm:        'vLLM (local)',
    tgi:         'HuggingFace TGI (local)',
    xinference:  'Xinference (local)',
    custom:      'Custom Provider',
  }
  return names[p] ?? p
}

/**
 * Whether the current provider requires an API key.
 * Local providers don't.
 */
/** Providers that work without any API key at all (truly keyless). */
export const KEYLESS_PROVIDERS: ReadonlySet<APIProvider> = new Set<APIProvider>([
  'pollinations',  // no key, ever
  'llm7',          // no key, ever
  'ollama',
  'lmstudio',
  'jan',
  'localai',
  'vllm',
  'tgi',
  'xinference',
])

export function providerRequiresApiKey(provider?: APIProvider): boolean {
  const p = provider ?? getAPIProvider()
  return !KEYLESS_PROVIDERS.has(p)
}

/**
 * The env-var name for the provider's API key (for display in /provider).
 */
export function getProviderKeyEnvVar(provider?: APIProvider): string | null {
  const p = provider ?? getAPIProvider()
  const keyVars: Partial<Record<APIProvider, string>> = {
    firstParty:  'ANTHROPIC_API_KEY',
    openai:      'OPENAI_API_KEY',
    gemini:      'GEMINI_API_KEY',
    groq:        'GROQ_API_KEY',
    mistral:     'MISTRAL_API_KEY',
    xai:         'XAI_API_KEY',
    together:    'TOGETHER_API_KEY',
    fireworks:   'FIREWORKS_API_KEY',
    openrouter:  'OPENROUTER_API_KEY',
    deepseek:    'DEEPSEEK_API_KEY',
    cohere:      'COHERE_API_KEY',
    perplexity:  'PERPLEXITY_API_KEY',
    cerebras:    'CEREBRAS_API_KEY',
    sambanova:   'SAMBANOVA_API_KEY',
    hyperbolic:  'HYPERBOLIC_API_KEY',
    nvidia:      'NVIDIA_API_KEY',
    ai21:        'AI21_API_KEY',
    moonshot:     'MOONSHOT_API_KEY',
    zhipu:        'ZHIPU_API_KEY',
    baidu:        'BAIDU_API_KEY',
    qianfan:      'QIANFAN_API_KEY',
    stepfun:      'STEPFUN_API_KEY',
    minimax:      'MINIMAX_API_KEY',
    githubmodels: 'GITHUB_TOKEN',
    huggingface:  'HF_TOKEN',
    cloudflare:   'CLOUDFLARE_API_TOKEN',
    siliconflow:  'SILICONFLOW_API_KEY',
    modelscope:   'MODELSCOPE_API_KEY',
  }
  return keyVars[p] ?? null
}

/**
 * Check if ANTHROPIC_BASE_URL is a first-party Anthropic API URL.
 */
export function isFirstPartyAnthropicBaseUrl(): boolean {
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (!baseUrl) return true
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
