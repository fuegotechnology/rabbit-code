# AI Provider Support

rabbit-code supports **15 AI providers** out of the box — from Anthropic's first-party API
to every major cloud provider and local inference engine. All providers use a unified
configuration interface via environment variables.

---

## Quick Start

```bash
# Clone and enter the repo
git clone https://github.com/fuegotechnology/rabbit-code
cd rabbit-code

# Choose your provider (source to export env vars into your shell)
source scripts/setup-provider.sh openai      gpt-4o
source scripts/setup-provider.sh gemini      gemini-2.5-pro
source scripts/setup-provider.sh groq        llama-3.3-70b-versatile
source scripts/setup-provider.sh mistral     mistral-large-latest
source scripts/setup-provider.sh xai         grok-3
source scripts/setup-provider.sh ollama      llama3.3      # no key needed
source scripts/setup-provider.sh lmstudio                  # no key needed
source scripts/setup-provider.sh openrouter  anthropic/claude-opus-4
source scripts/setup-provider.sh reset                     # back to Anthropic

# Run
bun run src/entrypoints/cli.tsx
```

---

## All Providers

### Anthropic (default)

| Env Var | Description |
|---------|-------------|
| `ANTHROPIC_API_KEY` | Required. Your Anthropic API key |
| `ANTHROPIC_MODEL` | Optional override (e.g. `claude-sonnet-4-6`) |

No provider flag needed — this is the default.

---

### OpenAI

```bash
export OPENAI_API_KEY=sk-...
export CLAUDE_CODE_USE_OPENAI=1
export ANTHROPIC_MODEL=gpt-4o   # optional, defaults to gpt-4o
```

**Supported models:** `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`, `o1`, `o1-mini`, `o3`, `o3-mini`, `o4-mini`

---

### Google Gemini

```bash
export GEMINI_API_KEY=AIza...
export CLAUDE_CODE_USE_GEMINI=1
export ANTHROPIC_MODEL=gemini-2.5-pro   # optional
```

**Supported models:** `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`

> Uses the OpenAI-compatible endpoint at `generativelanguage.googleapis.com/v1beta/openai`.

---

### Groq (ultra-fast inference)

```bash
export GROQ_API_KEY=gsk_...
export CLAUDE_CODE_USE_GROQ=1
export ANTHROPIC_MODEL=llama-3.3-70b-versatile   # optional
```

**Supported models:** `llama-3.3-70b-versatile`, `llama-3.1-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`, `gemma2-9b-it`, `deepseek-r1-distill-llama-70b`

---

### Mistral AI

```bash
export MISTRAL_API_KEY=...
export CLAUDE_CODE_USE_MISTRAL=1
export ANTHROPIC_MODEL=mistral-large-latest   # optional
```

**Supported models:** `mistral-large-latest`, `mistral-small-latest`, `codestral-latest`, `pixtral-large-latest`

---

### xAI (Grok)

```bash
export XAI_API_KEY=xai-...
export CLAUDE_CODE_USE_XAI=1
export ANTHROPIC_MODEL=grok-3   # optional
```

**Supported models:** `grok-3`, `grok-3-mini`, `grok-2-vision-1212`

---

### Together AI

```bash
export TOGETHER_API_KEY=...
export CLAUDE_CODE_USE_TOGETHER=1
export ANTHROPIC_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo   # optional
```

**Supported models:** Llama 3.3 70B, DeepSeek V3, QwQ 32B, and 100+ open models

---

### Fireworks AI

```bash
export FIREWORKS_API_KEY=fw_...
export CLAUDE_CODE_USE_FIREWORKS=1
export ANTHROPIC_MODEL=accounts/fireworks/models/llama-v3p3-70b-instruct   # optional
```

---

### OpenRouter (200+ models)

```bash
export OPENROUTER_API_KEY=sk-or-...
export CLAUDE_CODE_USE_OPENROUTER=1
export ANTHROPIC_MODEL=anthropic/claude-opus-4   # any OpenRouter model ID
```

**Popular models via OpenRouter:**
- `anthropic/claude-opus-4` — Claude Opus 4
- `openai/gpt-4o` — GPT-4o
- `google/gemini-2.5-pro` — Gemini 2.5 Pro
- `meta-llama/llama-3.3-70b-instruct` — Llama 3.3 70B
- `x-ai/grok-3` — Grok 3
- `deepseek/deepseek-r1` — DeepSeek R1

Browse all models at [openrouter.ai/models](https://openrouter.ai/models).

---

### Ollama (local, free)

```bash
# No API key needed. Start Ollama first:
ollama serve
ollama pull llama3.3   # or any model

export CLAUDE_CODE_USE_OLLAMA=1
export ANTHROPIC_MODEL=llama3.3   # optional, defaults to llama3.3
```

**Supported models (pre-configured):** `llama3.3`, `llama3.2`, `llama3.2-vision`, `qwen2.5-coder`, `qwen2.5:72b`, `deepseek-r1`, `mistral`, `phi4`, `gemma3`

> Override the host with `OLLAMA_HOST=http://my-server:11434`.

---

### LM Studio (local, free)

```bash
# No API key needed. Start the LM Studio server (port 1234 by default).

export CLAUDE_CODE_USE_LMSTUDIO=1
export ANTHROPIC_MODEL=your-loaded-model   # whatever model you loaded in LM Studio
```

> Override the host with `LMSTUDIO_HOST=http://my-server:1234`.

---

### Custom OpenAI-compatible endpoint

```bash
export CLAUDE_CODE_USE_CUSTOM_PROVIDER=1
export OPENAI_BASE_URL=http://localhost:8000/v1
export OPENAI_API_KEY=my-key   # if required
export ANTHROPIC_MODEL=my-model-name
```

Works with vLLM, TGI, LocalAI, Xinference, LiteLLM, etc.

---

### AWS Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
# AWS credentials via standard methods (env, ~/.aws/credentials, IAM role)
# Optionally: export AWS_REGION=us-east-1
```

---

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export ANTHROPIC_VERTEX_PROJECT_ID=my-gcp-project
# GCP credentials via standard methods (ADC, service account, etc.)
```

---

### Azure AI Foundry

```bash
export CLAUDE_CODE_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=my-resource   # or ANTHROPIC_FOUNDRY_BASE_URL
export ANTHROPIC_FOUNDRY_API_KEY=...            # or use Azure AD auth
```

---

## Universal Model Override

Regardless of provider, you can always override the model with:

```bash
export ANTHROPIC_MODEL=<any-model-id>
```

For Anthropic native providers (bedrock/vertex/foundry) you can also use the
`modelOverrides` field in `settings.json`.

---

## In-Session Provider Info

Run the `/provider` command inside claude to see:
- Current provider and endpoint
- API key status
- List of known models for the current provider
- Live models from the API (if available)

---

## Architecture

The provider system is implemented across three files:

| File | Role |
|------|------|
| `src/utils/model/providers.ts` | Provider detection, base URL, API key resolution |
| `src/utils/model/universalModels.ts` | Model catalog for all providers |
| `src/services/api/openaiCompatibleClient.ts` | Anthropic↔OpenAI message format conversion + streaming |
| `src/services/api/openaiQueryBridge.ts` | Generator bridge that feeds Anthropic-format events back to query.ts |
| `src/services/api/client.ts` | `getAnthropicClient()` — routes to the right SDK or compat client |
| `scripts/setup-provider.sh` | Shell helper for env-var switching |
| `src/commands/provider/` | `/provider` slash command |
