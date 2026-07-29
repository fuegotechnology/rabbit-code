/**
 * /provider command — interactive AI provider switcher for rabbit-code.
 *
 * Shows current provider, endpoint, API key status, known models,
 * and live model list from the provider's /models endpoint.
 */

import chalk from 'chalk'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import type { LocalJSXCommandCall } from '../../types/command.js'
import {
  type APIProvider,
  getAPIProvider,
  getOpenAICompatibleBaseURL,
  getProviderDisplayName,
  getProviderKeyEnvVar,
  providerRequiresApiKey,
  OPENAI_COMPATIBLE_PROVIDERS,
} from '../../utils/model/providers.js'
import {
  getProviderModels,
  type UniversalModelInfo,
} from '../../utils/model/universalModels.js'
import { fetchAvailableModels } from '../../services/api/openaiCompatibleClient.js'

// ---------------------------------------------------------------------------
// Provider table (for display — grouped by category)
// ---------------------------------------------------------------------------

interface ProviderRow {
  provider: APIProvider
  envFlag: string
  category: 'cloud' | 'local' | 'native'
}

const PROVIDER_ROWS: ProviderRow[] = [
  // Cloud
  { provider: 'openai',      envFlag: 'RABBIT_USE_OPENAI',      category: 'cloud' },
  { provider: 'gemini',      envFlag: 'RABBIT_USE_GEMINI',      category: 'cloud' },
  { provider: 'groq',        envFlag: 'RABBIT_USE_GROQ',        category: 'cloud' },
  { provider: 'mistral',     envFlag: 'RABBIT_USE_MISTRAL',     category: 'cloud' },
  { provider: 'xai',         envFlag: 'RABBIT_USE_XAI',         category: 'cloud' },
  { provider: 'deepseek',    envFlag: 'RABBIT_USE_DEEPSEEK',    category: 'cloud' },
  { provider: 'cohere',      envFlag: 'RABBIT_USE_COHERE',      category: 'cloud' },
  { provider: 'perplexity',  envFlag: 'RABBIT_USE_PERPLEXITY',  category: 'cloud' },
  { provider: 'cerebras',    envFlag: 'RABBIT_USE_CEREBRAS',    category: 'cloud' },
  { provider: 'sambanova',   envFlag: 'RABBIT_USE_SAMBANOVA',   category: 'cloud' },
  { provider: 'hyperbolic',  envFlag: 'RABBIT_USE_HYPERBOLIC',  category: 'cloud' },
  { provider: 'nvidia',      envFlag: 'RABBIT_USE_NVIDIA',      category: 'cloud' },
  { provider: 'ai21',        envFlag: 'RABBIT_USE_AI21',        category: 'cloud' },
  { provider: 'moonshot',    envFlag: 'RABBIT_USE_MOONSHOT',    category: 'cloud' },
  { provider: 'zhipu',       envFlag: 'RABBIT_USE_ZHIPU',       category: 'cloud' },
  { provider: 'stepfun',     envFlag: 'RABBIT_USE_STEPFUN',     category: 'cloud' },
  { provider: 'minimax',     envFlag: 'RABBIT_USE_MINIMAX',     category: 'cloud' },
  { provider: 'together',    envFlag: 'RABBIT_USE_TOGETHER',    category: 'cloud' },
  { provider: 'fireworks',   envFlag: 'RABBIT_USE_FIREWORKS',   category: 'cloud' },
  { provider: 'openrouter',  envFlag: 'RABBIT_USE_OPENROUTER',  category: 'cloud' },
  // Local
  { provider: 'opencode',    envFlag: 'RABBIT_USE_OPENCODE',    category: 'local' },
  { provider: 'ollama',      envFlag: 'RABBIT_USE_OLLAMA',      category: 'local' },
  { provider: 'lmstudio',    envFlag: 'RABBIT_USE_LMSTUDIO',    category: 'local' },
  { provider: 'jan',         envFlag: 'RABBIT_USE_JAN',         category: 'local' },
  { provider: 'localai',     envFlag: 'RABBIT_USE_LOCALAI',     category: 'local' },
  { provider: 'vllm',        envFlag: 'RABBIT_USE_VLLM',        category: 'local' },
  { provider: 'tgi',         envFlag: 'RABBIT_USE_TGI',         category: 'local' },
  { provider: 'xinference',  envFlag: 'RABBIT_USE_XINFERENCE',  category: 'local' },
  { provider: 'custom',      envFlag: 'RABBIT_USE_CUSTOM',      category: 'local' },
  // Anthropic-native
  { provider: 'bedrock',     envFlag: 'RABBIT_USE_BEDROCK',     category: 'native' },
  { provider: 'vertex',      envFlag: 'RABBIT_USE_VERTEX',      category: 'native' },
  { provider: 'foundry',     envFlag: 'RABBIT_USE_FOUNDRY',     category: 'native' },
]

// ---------------------------------------------------------------------------
// Status row
// ---------------------------------------------------------------------------

function ProviderStatusLine({
  current,
  row,
}: {
  current: APIProvider
  row: ProviderRow
}) {
  const active = current === row.provider
  const keyVar = getProviderKeyEnvVar(row.provider)
  const needsKey = providerRequiresApiKey(row.provider)
  const hasKey = keyVar ? !!process.env[keyVar] : !needsKey

  return (
    <Box>
      <Text color={active ? 'green' : 'gray'}>
        {active ? chalk.bold.green('▶ ') : '  '}
        {active
          ? chalk.bold.green(getProviderDisplayName(row.provider))
          : chalk.dim(getProviderDisplayName(row.provider))}
      </Text>
      {needsKey && (
        <Text color={hasKey ? 'green' : 'yellow'}>
          {' '}
          {hasKey ? chalk.green('✓') : chalk.yellow('⚠ no key')}
          {keyVar && !hasKey ? chalk.dim(` (${keyVar})`) : ''}
        </Text>
      )}
      {!needsKey && <Text color="cyan"> {chalk.cyan('(local)')}</Text>}
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function ProviderCommand({
  onDone,
  args,
}: {
  onDone: (result: string) => void
  args?: string
}) {
  const current = getAPIProvider()
  const [liveModels, setLiveModels] = useState<string[] | null>(null)
  const [liveLoading, setLiveLoading] = useState(false)

  const showProvider = (args?.trim() as APIProvider | undefined) ?? current

  useEffect(() => {
    if (OPENAI_COMPATIBLE_PROVIDERS.has(showProvider)) {
      setLiveLoading(true)
      fetchAvailableModels()
        .then(models => {
          setLiveModels(models.map(m => m.id))
          setLiveLoading(false)
        })
        .catch(() => {
          setLiveModels(null)
          setLiveLoading(false)
        })
    }
  }, [showProvider])

  const knownModels = Object.values(getProviderModels(showProvider))

  const cloudRows = PROVIDER_ROWS.filter(r => r.category === 'cloud')
  const localRows = PROVIDER_ROWS.filter(r => r.category === 'local')
  const nativeRows = PROVIDER_ROWS.filter(r => r.category === 'native')

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* Header */}
      <Text bold color="cyan">
        🐇 rabbit-code — AI Provider Configuration
      </Text>
      <Box marginTop={1}>
        <Text bold>Active: </Text>
        <Text color="green">{getProviderDisplayName(current)}</Text>
        {OPENAI_COMPATIBLE_PROVIDERS.has(current) && (
          <Text color="gray"> → {getOpenAICompatibleBaseURL()}</Text>
        )}
      </Box>

      {/* Current model */}
      {process.env.ANTHROPIC_MODEL && (
        <Box>
          <Text bold>Model:  </Text>
          <Text color="yellow">{process.env.ANTHROPIC_MODEL}</Text>
        </Box>
      )}

      {/* Provider groups */}
      <Box marginTop={1} flexDirection="column">
        <Text bold color="yellow">☁  Cloud providers:</Text>
        {cloudRows.map(row => (
          <ProviderStatusLine key={row.provider} current={current} row={row} />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold color="blue">🖥  Local / self-hosted:</Text>
        {localRows.map(row => (
          <ProviderStatusLine key={row.provider} current={current} row={row} />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold color="magenta">🔒 Anthropic-native:</Text>
        {nativeRows.map(row => (
          <ProviderStatusLine key={row.provider} current={current} row={row} />
        ))}
        <ProviderStatusLine
          current={current}
          row={{ provider: 'firstParty', envFlag: '', category: 'native' }}
        />
      </Box>

      {/* Known models for queried provider */}
      {knownModels.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>
            Known models for {getProviderDisplayName(showProvider)}:
          </Text>
          {knownModels.map((m: UniversalModelInfo) => (
            <Box key={m.id}>
              <Text color={m.isDefault ? 'green' : 'white'}>
                {m.isDefault ? '  ▶ ' : '    '}
                <Text bold={m.isDefault}>{m.displayName}</Text>
              </Text>
              <Text color="gray">
                {' '}
                ({Math.round(m.contextWindow / 1000)}k ctx
                {m.costPerMTokenInput !== undefined
                  ? ` · $${m.costPerMTokenInput}/$${m.costPerMTokenOutput} /Mtok`
                  : ' · free/local'}
                {m.supportsTools ? '' : ' · no tools'}
                {m.supportsVision ? ' · vision' : ''})
              </Text>
            </Box>
          ))}
        </Box>
      )}

      {/* Live models from API */}
      {liveLoading && (
        <Box marginTop={1}>
          <Text color="gray">Fetching live model list…</Text>
        </Box>
      )}
      {liveModels !== null && liveModels.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Live models from API ({liveModels.length}):</Text>
          {liveModels.slice(0, 20).map(id => (
            <Text key={id} color="gray">    {id}</Text>
          ))}
          {liveModels.length > 20 && (
            <Text color="gray">    … and {liveModels.length - 20} more</Text>
          )}
        </Box>
      )}

      {/* How to switch */}
      <Box marginTop={1} flexDirection="column">
        <Text bold color="yellow">Switch provider (examples):</Text>
        <Text color="gray">  source scripts/setup-provider.sh openai   gpt-4o</Text>
        <Text color="gray">  source scripts/setup-provider.sh gemini   gemini-2.5-pro</Text>
        <Text color="gray">  source scripts/setup-provider.sh deepseek deepseek-chat</Text>
        <Text color="gray">  source scripts/setup-provider.sh ollama   llama3.3</Text>
        <Text color="gray">  source scripts/setup-provider.sh opencode            # zen mode</Text>
        <Text color="gray">  source scripts/setup-provider.sh list                # all providers</Text>
        <Text color="gray">  export ANTHROPIC_MODEL=&lt;model-id&gt;              # override model</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" italic>Press any key to dismiss</Text>
      </Box>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const call: LocalJSXCommandCall = async (onDone, context) => {
  const args = context?.args?.join(' ')
  return <ProviderCommand onDone={onDone} args={args} />
}
