# AI Provider Support

rabbit-code supports **30+ AI providers** out of the box — every major cloud API,
local inference engine, and Chinese AI platform. All providers use a unified
OpenAI Chat Completions adapter, so tools, file editing, bash execution, and the
full agent loop work with any model.

---

## Quick Start

```bash
# Source the setup helper to configure a provider in your shell:
source scripts/setup-provider.sh <provider> [model]

# Examples
source scripts/setup-provider.sh openai       gpt-4o
source scripts/setup-provider.sh gemini       gemini-2.5-pro
source scripts/setup-provider.sh groq         llama-3.3-70b-versatile
source scripts/setup-provider.sh deepseek     deepseek-chat
source scripts/setup-provider.sh perplexity   sonar-pro
source scripts/setup-provider.sh cerebras     llama-4-scout-17b-16e-instruct
source scripts/setup-provider.sh ollama       llama3.3          # local, free
source scripts/setup-provider.sh opencode                       # zen-mode local
source scripts/setup-provider.sh openrouter   anthropic/claude-opus-4
source scripts/setup-provider.sh reset                          # back to Anthropic

# List all providers:
source scripts/setup-provider.sh list
```

---

## Provider Matrix

### ☁ Cloud Providers

| Provider | Flag | Key Env Var | Default Model |
|----------|------|-------------|---------------|
| **Anthropic** (default) | — | `ANTHROPIC_API_KEY` | claude-opus-4-6 |
| **OpenAI** | `RABBIT_USE_OPENAI=1` | `OPENAI_API_KEY` | gpt-4o |
| **Google Gemini** | `RABBIT_USE_GEMINI=1` | `GEMINI_API_KEY` | gemini-2.5-pro |
| **Groq** | `RABBIT_USE_GROQ=1` | `GROQ_API_KEY` | llama-3.3-70b-versatile |
| **Mistral AI** | `RABBIT_USE_MISTRAL=1` | `MISTRAL_API_KEY` | mistral-large-latest |
| **xAI (Grok)** | `RABBIT_USE_XAI=1` | `XAI_API_KEY` | grok-3 |
| **DeepSeek** | `RABBIT_USE_DEEPSEEK=1` | `DEEPSEEK_API_KEY` | deepseek-chat |
| **Cohere** | `RABBIT_USE_COHERE=1` | `COHERE_API_KEY` | command-r-plus-08-2024 |
| **Perplexity** | `RABBIT_USE_PERPLEXITY=1` | `PERPLEXITY_API_KEY` | sonar-pro |
| **Cerebras** | `RABBIT_USE_CEREBRAS=1` | `CEREBRAS_API_KEY` | llama-4-scout-17b-16e-instruct |
| **SambaNova** | `RABBIT_USE_SAMBANOVA=1` | `SAMBANOVA_API_KEY` | Meta-Llama-3.3-70B-Instruct |
| **Hyperbolic** | `RABBIT_USE_HYPERBOLIC=1` | `HYPERBOLIC_API_KEY` | meta-llama/Llama-3.3-70B-Instruct |
| **NVIDIA NIM** | `RABBIT_USE_NVIDIA=1` | `NVIDIA_API_KEY` | meta/llama-3.3-70b-instruct |
| **AI21 Labs** | `RABBIT_USE_AI21=1` | `AI21_API_KEY` | jamba-1.6-large |
| **Moonshot AI (Kimi)** | `RABBIT_USE_MOONSHOT=1` | `MOONSHOT_API_KEY` | kimi-k2 |
| **Zhipu AI (GLM)** | `RABBIT_USE_ZHIPU=1` | `ZHIPU_API_KEY` | glm-4-plus |
| **StepFun** | `RABBIT_USE_STEPFUN=1` | `STEPFUN_API_KEY` | step-2-16k |
| **MiniMax** | `RABBIT_USE_MINIMAX=1` | `MINIMAX_API_KEY` | MiniMax-Text-01 |
| **Together AI** | `RABBIT_USE_TOGETHER=1` | `TOGETHER_API_KEY` | Llama 3.3 70B Turbo |
| **Fireworks AI** | `RABBIT_USE_FIREWORKS=1` | `FIREWORKS_API_KEY` | llama-v3p3-70b-instruct |
| **OpenRouter** | `RABBIT_USE_OPENROUTER=1` | `OPENROUTER_API_KEY` | any model |

### 🖥 Local / Self-hosted (free, no key)

| Provider | Flag | Default Port | Notes |
|----------|------|-------------|-------|
| **OpenCode / Zen** | `RABBIT_USE_OPENCODE=1` | 4000 | zen-mode AI coding proxy |
| **Ollama** | `RABBIT_USE_OLLAMA=1` | 11434 | `ollama pull llama3.3` |
| **LM Studio** | `RABBIT_USE_LMSTUDIO=1` | 1234 | Load a model in LM Studio |
| **Jan.ai** | `RABBIT_USE_JAN=1` | 1337 | Jan desktop app |
| **LocalAI** | `RABBIT_USE_LOCALAI=1` | 8080 | Drop-in local OpenAI proxy |
| **vLLM** | `RABBIT_USE_VLLM=1` | 8000 | High-throughput GPU server |
| **HuggingFace TGI** | `RABBIT_USE_TGI=1` | 8080 | HuggingFace inference server |
| **Xinference** | `RABBIT_USE_XINFERENCE=1` | 9997 | Flexible model serving |
| **Custom endpoint** | `RABBIT_USE_CUSTOM=1` | — | `OPENAI_BASE_URL=...` |

Override any local provider's host:
```bash
export OLLAMA_HOST=http://my-server:11434
export LMSTUDIO_HOST=http://my-server:1234
export OPENCODE_HOST=http://my-server:4000
export VLLM_HOST=http://my-server:8000
# etc.
```

### 🔒 Anthropic-Native Providers

| Provider | Flag | Auth |
|----------|------|------|
| **AWS Bedrock** | `RABBIT_USE_BEDROCK=1` | AWS credentials |
| **Google Vertex AI** | `RABBIT_USE_VERTEX=1` | `ANTHROPIC_VERTEX_PROJECT_ID` + GCP creds |
| **Azure AI Foundry** | `RABBIT_USE_FOUNDRY=1` | `ANTHROPIC_FOUNDRY_RESOURCE` |

Legacy `CLAUDE_CODE_USE_*` flags are still honoured for backwards compatibility.

---

## Provider Details

### OpenAI
```bash
export OPENAI_API_KEY=sk-...
export RABBIT_USE_OPENAI=1
export ANTHROPIC_MODEL=gpt-4o    # optional
```
Models: `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`, `o1`, `o1-mini`, `o3`, `o3-mini`, `o4-mini`

---

### Google Gemini
```bash
export GEMINI_API_KEY=AIza...
export RABBIT_USE_GEMINI=1
export ANTHROPIC_MODEL=gemini-2.5-pro   # optional
```
Models: `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`

> Uses the OpenAI-compatible endpoint at `generativelanguage.googleapis.com/v1beta/openai`.

---

### Groq
```bash
export GROQ_API_KEY=gsk_...
export RABBIT_USE_GROQ=1
export ANTHROPIC_MODEL=llama-3.3-70b-versatile
```
Models: `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`, `deepseek-r1-distill-llama-70b`

---

### DeepSeek
```bash
export DEEPSEEK_API_KEY=sk-...
export RABBIT_USE_DEEPSEEK=1
export ANTHROPIC_MODEL=deepseek-chat      # V3 — best for coding
# or: export ANTHROPIC_MODEL=deepseek-reasoner  # R1 — chain-of-thought
```
Models: `deepseek-chat` (V3), `deepseek-reasoner` (R1), `deepseek-coder`

---

### Cohere
```bash
export COHERE_API_KEY=...
export RABBIT_USE_COHERE=1
export ANTHROPIC_MODEL=command-r-plus-08-2024
```
Models: `command-r-plus-08-2024`, `command-r-08-2024`, `command-a-03-2025`

> Uses Cohere's OpenAI-compatible endpoint at `api.cohere.com/compatibility/v1`.

---

### Perplexity (online search)
```bash
export PERPLEXITY_API_KEY=pplx-...
export RABBIT_USE_PERPLEXITY=1
export ANTHROPIC_MODEL=sonar-pro
```
Models: `sonar-pro`, `sonar`, `sonar-reasoning-pro`, `sonar-deep-research`

> All Perplexity models have live web search built-in — great for research tasks.

---

### Cerebras (ultra-fast)
```bash
export CEREBRAS_API_KEY=...
export RABBIT_USE_CEREBRAS=1
export ANTHROPIC_MODEL=llama-4-scout-17b-16e-instruct
```
Models: `llama-4-scout-17b-16e-instruct`, `llama3.1-70b`, `llama3.1-8b`, `qwen-3-32b`

---

### SambaNova
```bash
export SAMBANOVA_API_KEY=...
export RABBIT_USE_SAMBANOVA=1
export ANTHROPIC_MODEL=Meta-Llama-3.3-70B-Instruct
```
Models: `Meta-Llama-3.3-70B-Instruct`, `DeepSeek-R1-Distill-Llama-70B`, `Qwen3-32B`

---

### NVIDIA NIM
```bash
export NVIDIA_API_KEY=nvapi-...
export RABBIT_USE_NVIDIA=1
export ANTHROPIC_MODEL=meta/llama-3.3-70b-instruct
# optionally override base URL for on-prem NIM:
export NVIDIA_BASE_URL=http://my-nim-server:8000/v1
```

---

### Moonshot AI (Kimi)
```bash
export MOONSHOT_API_KEY=...
export RABBIT_USE_MOONSHOT=1
export ANTHROPIC_MODEL=kimi-k2
```
Models: `kimi-k2`, `moonshot-v1-128k`

---

### MiniMax (4M context)
```bash
export MINIMAX_API_KEY=...
export RABBIT_USE_MINIMAX=1
export ANTHROPIC_MODEL=MiniMax-Text-01    # 4,000,000 token context!
```

---

### OpenCode / Zen Mode
```bash
export RABBIT_USE_OPENCODE=1
# optionally: export OPENCODE_HOST=http://localhost:4000
export ANTHROPIC_MODEL=auto   # or any model your OpenCode server supports
```
OpenCode acts as a local AI coding proxy. Set `OPENCODE_HOST` if it runs on
a non-default port or remote host.

---

### OpenRouter (200+ models)
```bash
export OPENROUTER_API_KEY=sk-or-...
export RABBIT_USE_OPENROUTER=1
export ANTHROPIC_MODEL=anthropic/claude-opus-4
```
Popular models: `anthropic/claude-opus-4`, `openai/gpt-4o`, `google/gemini-2.5-pro`,
`meta-llama/llama-3.3-70b-instruct`, `x-ai/grok-3`, `deepseek/deepseek-r1`

Browse all at [openrouter.ai/models](https://openrouter.ai/models).

---

### Ollama (local, free)
```bash
# No key needed. Start Ollama first:
ollama serve
ollama pull llama3.3

export RABBIT_USE_OLLAMA=1
export ANTHROPIC_MODEL=llama3.3
```
Override host: `export OLLAMA_HOST=http://my-server:11434`

Well-known models: `llama3.3`, `llama3.2`, `qwen2.5-coder`, `deepseek-r1`, `mistral`, `phi4`, `gemma3`

---

### vLLM (self-hosted GPU)
```bash
# Start vLLM: python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-3.3-70B-Instruct

export RABBIT_USE_VLLM=1
export ANTHROPIC_MODEL=meta-llama/Llama-3.3-70B-Instruct
export VLLM_HOST=http://localhost:8000   # optional
```

---

### Custom OpenAI-compatible endpoint
```bash
export RABBIT_USE_CUSTOM=1
export OPENAI_BASE_URL=http://localhost:8000/v1
export OPENAI_API_KEY=my-optional-key
export ANTHROPIC_MODEL=my-model-name
```
Works with: vLLM, TGI, LocalAI, Xinference, LiteLLM, Jan, Tabby, etc.

---

## Universal Model Override

Regardless of provider:
```bash
export ANTHROPIC_MODEL=<any-model-id>
```

---

## In-Session Commands

```bash
/provider           # show current provider + all providers status
/provider ollama    # show Ollama models + live API list
/model              # switch model within current provider
```

---

## Architecture

| File | Role |
|------|------|
| `src/utils/model/providers.ts` | Provider detection, base URL + API key resolution, 30+ providers |
| `src/utils/model/universalModels.ts` | Model catalog for all providers (context, cost, capabilities) |
| `src/services/api/openaiCompatibleClient.ts` | Anthropic↔OpenAI message/tool format conversion + streaming |
| `src/services/api/openaiQueryBridge.ts` | Generator bridge feeding Anthropic-format events to query.ts |
| `src/services/api/client.ts` | `getAnthropicClient()` routing |
| `scripts/setup-provider.sh` | Shell helper — `source` to configure any provider |
| `src/commands/provider/` | `/provider` slash command |
