/**
 * /provider command — interactive AI provider switcher.
 *
 * Lets users switch between Anthropic, OpenAI, Gemini, Groq, Mistral,
 * xAI, Ollama, Together, Fireworks, OpenRouter, LM Studio, and custom
 * OpenAI-compatible endpoints without restarting Claude Code.
 */

import chalk from 'chalk'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import type { CommandResultDisplay } from '../../commands.js'
import type { LocalJSXCommandCall } from '../../types/command.js'
import {
  type APIProvider,
  getAPIProvider,
  getOpenAICompatibleBaseURL,
  getProviderDisplayName,
  OPENAI_COMPATIBLE_PROVIDERS,
} from '../../utils/model/providers.js'
import {
  getProviderModels,
  getDefaultModelForProvider,
  type UniversalModelInfo,
} from '../../utils/model/universalModels.js'
import { fetchAvailableModels } from '../../services/api/openaiCompatibleClient.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProviderOption {
  provider: APIProvider
  envVar: string
  label: string
  description: string
  requiresKey: boolean
  keyEnvVar?: string
}

// ---------------------------------------------------------------------------
// Provider options (ordered: cloud → local)
// ---------------------------------------------------------------------------

const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    provider: 'firstParty',
    envVar: '', // default
    label: 'Anthropic (default)',
    description: 'Claude Opus/Sonnet/Haiku via api.anthropic.com',
    requiresKey: true,
    keyEnvVar: 'ANTHROPIC_API_KEY',
  },
  {
    provider: 'openai',
    envVar: 'CLAUDE_CODE_USE_OPENAI',
    label: 'OpenAI',
    description: 'GPT-4o, o3, GPT-4.1 via api.openai.com',
    requiresKey: true,
    keyEnvVar: 'OPENAI_API_KEY',
  },
  {
    provider: 'gemini',
    envVar: 'CLAUDE_CODE_USE_GEMINI',
    label: 'Google Gemini',
    description: 'Gemini 2.5 Pro/Flash via generativelanguage.googleapis.com',
    requiresKey: true,
    keyEnvVar: 'GEMINI_API_KEY',
  },
  {
    provider: 'groq',
    envVar: 'CLAUDE_CODE_USE_GROQ',
    label: 'Groq',
    description: 'Llama 3.3, Mixtral, DeepSeek via api.groq.com (ultra-fast)',
    requiresKey: true,
    keyEnvVar: 'GROQ_API_KEY',
  },
  {
    provider: 'mistral',
    envVar: 'CLAUDE_CODE_USE_MISTRAL',
    label: 'Mistral AI',
    description: 'Mistral Large, Codestral, Pixtral via api.mistral.ai',
    requiresKey: true,
    keyEnvVar: 'MISTRAL_API_KEY',
  },
  {
    provider: 'xai',
    envVar: 'CLAUDE_CODE_USE_XAI',
    label: 'xAI (Grok)',
    description: 'Grok-3 via api.x.ai',
    requiresKey: true,
    keyEnvVar: 'XAI_API_KEY',
  },
  {
    provider: 'together',
    envVar: 'CLAUDE_CODE_USE_TOGETHER',
    label: 'Together AI',
    description: 'Open models via api.together.xyz',
    requiresKey: true,
    keyEnvVar: 'TOGETHER_API_KEY',
  },
  {
    provider: 'fireworks',
    envVar: 'CLAUDE_CODE_USE_FIREWORKS',
    label: 'Fireworks AI',
    description: 'Open models via api.fireworks.ai',
    requiresKey: true,
    keyEnvVar: 'FIREWORKS_API_KEY',
  },
  {
    provider: 'openrouter',
    envVar: 'CLAUDE_CODE_USE_OPENROUTER',
    label: 'OpenRouter',
    description: '200+ models via openrouter.ai (Claude, GPT, Gemini, Llama…)',
    requiresKey: true,
    keyEnvVar: 'OPENROUTER_API_KEY',
  },
  {
    provider: 'bedrock',
    envVar: 'CLAUDE_CODE_USE_BEDROCK',
    label: 'AWS Bedrock',
    description: 'Claude models via AWS Bedrock (requires AWS credentials)',
    requiresKey: false,
  },
  {
    provider: 'vertex',
    envVar: 'CLAUDE_CODE_USE_VERTEX',
    label: 'Google Vertex AI',
    description: 'Claude models via GCP Vertex (requires ANTHROPIC_VERTEX_PROJECT_ID)',
    requiresKey: false,
  },
  {
    provider: 'foundry',
    envVar: 'CLAUDE_CODE_USE_FOUNDRY',
    label: 'Azure AI Foundry',
    description: 'Claude models via Azure AI Foundry (requires ANTHROPIC_FOUNDRY_RESOURCE)',
    requiresKey: false,
  },
  {
    provider: 'ollama',
    envVar: 'CLAUDE_CODE_USE_OLLAMA',
    label: 'Ollama (local)',
    description: 'Local models via Ollama at localhost:11434',
    requiresKey: false,
  },
  {
    provider: 'lmstudio',
    envVar: 'CLAUDE_CODE_USE_LMSTUDIO',
    label: 'LM Studio (local)',
    description: 'Local models via LM Studio at localhost:1234',
    requiresKey: false,
  },
  {
    provider: 'custom',
    envVar: 'CLAUDE_CODE_USE_CUSTOM_PROVIDER',
    label: 'Custom (OpenAI-compatible)',
    description: 'Any OpenAI-compatible endpoint via OPENAI_BASE_URL',
    requiresKey: false,
  },
]

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function ProviderStatusLine({ provider, opt }: {
  provider: APIProvider
  opt: ProviderOption
}) {
  const active = provider === opt.provider
  const keyPresent = opt.requiresKey && opt.keyEnvVar
    ? !!process.env[opt.keyEnvVar]
    : true

  return (
    <Box>
      <Text color={active ? 'green' : 'white'}>
        {active ? chalk.bold('▶ ') : '  '}
        {chalk.bold(opt.label)}
      </Text>
      {opt.requiresKey && (
        <Text color={keyPresent ? 'green' : 'yellow'}>
          {' '}
          {keyPresent ? '✓' : '⚠ no key'}
        </Text>
      )}
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ProviderCommandProps {
  onDone: (result: string, options?: CommandResultDisplay) => void
  args?: string
}

function ProviderCommand({ onDone, args }: ProviderCommandProps) {
  const currentProvider = getAPIProvider()
  const [liveModels, setLiveModels] = useState<string[] | null>(null)

  // If a provider was explicitly passed as argument, show its status
  const requestedProvider = args?.trim() as APIProvider | undefined

  useEffect(() => {
    if (
      requestedProvider &&
      OPENAI_COMPATIBLE_PROVIDERS.has(requestedProvider)
    ) {
      // Try to fetch live models from the provider
      fetchAvailableModels()
        .then(models => setLiveModels(models.map(m => m.id)))
        .catch(() => setLiveModels(null))
    }
  }, [requestedProvider])

  const models = requestedProvider
    ? Object.values(getProviderModels(requestedProvider))
    : []

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text bold color="cyan">
        🔌 AI Provider Configuration
      </Text>
      <Text color="gray">Current: {chalk.bold(getProviderDisplayName(currentProvider))}</Text>

      {OPENAI_COMPATIBLE_PROVIDERS.has(currentProvider) && (
        <Text color="gray">
          Endpoint: {getOpenAICompatibleBaseURL()}
        </Text>
      )}

      <Box marginTop={1} flexDirection="column">
        <Text bold>Available Providers:</Text>
        {PROVIDER_OPTIONS.map(opt => (
          <ProviderStatusLine key={opt.provider} provider={currentProvider} opt={opt} />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold color="yellow">How to switch providers:</Text>
        <Text color="gray">Set environment variables before starting claude:</Text>
        <Box marginTop={1} flexDirection="column">
          {PROVIDER_OPTIONS.filter(o => o.envVar).map(opt => (
            <Box key={opt.provider} flexDirection="column" marginBottom={1}>
              <Text color="cyan"># {opt.label}</Text>
              {opt.requiresKey && opt.keyEnvVar && (
                <Text>export {opt.keyEnvVar}=your-api-key</Text>
              )}
              {opt.envVar && (
                <Text>export {opt.envVar}=1</Text>
              )}
              {opt.provider === 'openai' && (
                <Text color="gray">  # optionally: export ANTHROPIC_MODEL=gpt-4o</Text>
              )}
              {opt.provider === 'ollama' && (
                <Text color="gray">  # optionally: export ANTHROPIC_MODEL=llama3.3</Text>
              )}
              {opt.provider === 'custom' && (
                <Text color="gray">  # required: export OPENAI_BASE_URL=http://localhost:8000/v1</Text>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {models.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Known models for {getProviderDisplayName(requestedProvider)}:</Text>
          {models.map((m: UniversalModelInfo) => (
            <Box key={m.id}>
              <Text color={m.isDefault ? 'green' : 'white'}>
                {m.isDefault ? '  ▶ ' : '    '}
                {m.displayName}
              </Text>
              <Text color="gray">
                {' '}({m.contextWindow / 1000}k ctx
                {m.costPerMTokenInput !== undefined
                  ? ` · $${m.costPerMTokenInput}/$${m.costPerMTokenOutput} per Mtok`
                  : ' · free/local'})
              </Text>
            </Box>
          ))}
        </Box>
      )}

      {liveModels !== null && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Live models from API ({liveModels.length}):</Text>
          {liveModels.slice(0, 15).map(id => (
            <Text key={id} color="gray">    {id}</Text>
          ))}
          {liveModels.length > 15 && (
            <Text color="gray">    … and {liveModels.length - 15} more</Text>
          )}
        </Box>
      )}

      <Box marginTop={1}>
        <Text color="gray" italic>
          Press any key to dismiss
        </Text>
      </Box>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Command export
// ---------------------------------------------------------------------------

export const call: LocalJSXCommandCall = async (onDone, context) => {
  const args = context?.args?.join(' ')
  return <ProviderCommand onDone={onDone} args={args} />
}
