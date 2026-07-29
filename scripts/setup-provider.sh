#!/usr/bin/env bash
# ============================================================
# rabbit-code — AI Provider Setup Helper
# ============================================================
# Usage (source to export env vars into your shell):
#
#   source scripts/setup-provider.sh <provider> [model]
#
# Examples:
#   source scripts/setup-provider.sh openai      gpt-4o
#   source scripts/setup-provider.sh gemini      gemini-2.5-pro
#   source scripts/setup-provider.sh groq        llama-3.3-70b-versatile
#   source scripts/setup-provider.sh mistral     mistral-large-latest
#   source scripts/setup-provider.sh xai         grok-3
#   source scripts/setup-provider.sh deepseek    deepseek-chat
#   source scripts/setup-provider.sh cohere      command-r-plus-08-2024
#   source scripts/setup-provider.sh perplexity  sonar-pro
#   source scripts/setup-provider.sh cerebras    llama-3.3-70b
#   source scripts/setup-provider.sh sambanova   Meta-Llama-3.3-70B-Instruct
#   source scripts/setup-provider.sh hyperbolic  meta-llama/Llama-3.3-70B-Instruct
#   source scripts/setup-provider.sh nvidia      meta/llama-3.3-70b-instruct
#   source scripts/setup-provider.sh ai21        jamba-1.6-large
#   source scripts/setup-provider.sh moonshot    kimi-k2
#   source scripts/setup-provider.sh opencode                    # local zen-mode
#   source scripts/setup-provider.sh together    meta-llama/Llama-3.3-70B-Instruct-Turbo
#   source scripts/setup-provider.sh fireworks   accounts/fireworks/models/llama-v3p3-70b-instruct
#   source scripts/setup-provider.sh openrouter  anthropic/claude-opus-4
#   source scripts/setup-provider.sh ollama      llama3.3      # local, free
#   source scripts/setup-provider.sh lmstudio                   # local, free
#   source scripts/setup-provider.sh jan                        # local, free
#   source scripts/setup-provider.sh localai                    # local, free
#   source scripts/setup-provider.sh vllm        served-model  # self-hosted
#   source scripts/setup-provider.sh tgi                        # self-hosted
#   source scripts/setup-provider.sh xinference                 # self-hosted
#   source scripts/setup-provider.sh bedrock
#   source scripts/setup-provider.sh vertex
#   source scripts/setup-provider.sh foundry
#   source scripts/setup-provider.sh custom      http://localhost:8000/v1 my-model
#   source scripts/setup-provider.sh reset       (back to Anthropic)
#   source scripts/setup-provider.sh list        (show all providers)
# ============================================================

PROVIDER="${1:-}"
MODEL="${2:-}"
CUSTOM_BASE_URL="${3:-}"

# --- Clear all rabbit-code + legacy claude-code provider flags ---
_reset_providers() {
  for _f in OPENAI GEMINI GROQ MISTRAL XAI TOGETHER FIREWORKS OPENROUTER \
             DEEPSEEK COHERE PERPLEXITY CEREBRAS SAMBANOVA HYPERBOLIC NVIDIA \
             AI21 MOONSHOT ZHIPU BAIDU QIANFAN STEPFUN MINIMAX OPENCODE \
             OLLAMA LMSTUDIO JAN LOCALAI VLLM TGI XINFERENCE \
             BEDROCK VERTEX FOUNDRY CUSTOM CUSTOM_PROVIDER; do
    unset "RABBIT_USE_${_f}"        2>/dev/null || true
    unset "CLAUDE_CODE_USE_${_f}"   2>/dev/null || true
  done
  unset OPENAI_BASE_URL    2>/dev/null || true
  unset ANTHROPIC_MODEL    2>/dev/null || true
}

# ---- Cloud providers -------------------------------------------------------

case "${PROVIDER}" in

  anthropic|reset|"")
    _reset_providers
    echo "✅ Provider: Anthropic (default)"
    echo "   Set ANTHROPIC_API_KEY if not already done."
    ;;

  openai)
    _reset_providers
    export RABBIT_USE_OPENAI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="gpt-4o"
    echo "✅ Provider: OpenAI | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: OPENAI_API_KEY"
    ;;

  gemini)
    _reset_providers
    export RABBIT_USE_GEMINI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="gemini-2.5-pro"
    echo "✅ Provider: Google Gemini | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: GEMINI_API_KEY (or GOOGLE_API_KEY)"
    ;;

  groq)
    _reset_providers
    export RABBIT_USE_GROQ=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="llama-3.3-70b-versatile"
    echo "✅ Provider: Groq | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: GROQ_API_KEY"
    ;;

  mistral)
    _reset_providers
    export RABBIT_USE_MISTRAL=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="mistral-large-latest"
    echo "✅ Provider: Mistral AI | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: MISTRAL_API_KEY"
    ;;

  xai|grok)
    _reset_providers
    export RABBIT_USE_XAI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="grok-3"
    echo "✅ Provider: xAI (Grok) | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: XAI_API_KEY"
    ;;

  deepseek)
    _reset_providers
    export RABBIT_USE_DEEPSEEK=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="deepseek-chat"
    echo "✅ Provider: DeepSeek | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: DEEPSEEK_API_KEY"
    echo "   Reasoning model: deepseek-reasoner"
    ;;

  cohere)
    _reset_providers
    export RABBIT_USE_COHERE=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="command-r-plus-08-2024"
    echo "✅ Provider: Cohere | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: COHERE_API_KEY"
    ;;

  perplexity)
    _reset_providers
    export RABBIT_USE_PERPLEXITY=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="sonar-pro"
    echo "✅ Provider: Perplexity | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: PERPLEXITY_API_KEY"
    echo "   Note: Perplexity models have live web search built-in."
    ;;

  cerebras)
    _reset_providers
    export RABBIT_USE_CEREBRAS=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="llama-4-scout-17b-16e-instruct"
    echo "✅ Provider: Cerebras (ultra-fast) | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: CEREBRAS_API_KEY"
    ;;

  sambanova|samba)
    _reset_providers
    export RABBIT_USE_SAMBANOVA=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="Meta-Llama-3.3-70B-Instruct"
    echo "✅ Provider: SambaNova | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: SAMBANOVA_API_KEY"
    ;;

  hyperbolic)
    _reset_providers
    export RABBIT_USE_HYPERBOLIC=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="meta-llama/Llama-3.3-70B-Instruct"
    echo "✅ Provider: Hyperbolic | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: HYPERBOLIC_API_KEY"
    ;;

  nvidia|nim)
    _reset_providers
    export RABBIT_USE_NVIDIA=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="meta/llama-3.3-70b-instruct"
    echo "✅ Provider: NVIDIA NIM | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: NVIDIA_API_KEY"
    ;;

  ai21)
    _reset_providers
    export RABBIT_USE_AI21=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="jamba-1.6-large"
    echo "✅ Provider: AI21 Labs | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: AI21_API_KEY"
    ;;

  moonshot|kimi)
    _reset_providers
    export RABBIT_USE_MOONSHOT=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="kimi-k2"
    echo "✅ Provider: Moonshot AI (Kimi) | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: MOONSHOT_API_KEY"
    ;;

  zhipu|glm)
    _reset_providers
    export RABBIT_USE_ZHIPU=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="glm-4-plus"
    echo "✅ Provider: Zhipu AI (GLM) | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: ZHIPU_API_KEY"
    ;;

  stepfun|step)
    _reset_providers
    export RABBIT_USE_STEPFUN=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="step-2-16k"
    echo "✅ Provider: StepFun | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: STEPFUN_API_KEY"
    ;;

  minimax)
    _reset_providers
    export RABBIT_USE_MINIMAX=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="MiniMax-Text-01"
    echo "✅ Provider: MiniMax | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: MINIMAX_API_KEY"
    ;;

  together)
    _reset_providers
    export RABBIT_USE_TOGETHER=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="meta-llama/Llama-3.3-70B-Instruct-Turbo"
    echo "✅ Provider: Together AI | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: TOGETHER_API_KEY"
    ;;

  fireworks)
    _reset_providers
    export RABBIT_USE_FIREWORKS=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="accounts/fireworks/models/llama-v3p3-70b-instruct"
    echo "✅ Provider: Fireworks AI | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: FIREWORKS_API_KEY"
    ;;

  openrouter)
    _reset_providers
    export RABBIT_USE_OPENROUTER=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="anthropic/claude-opus-4"
    echo "✅ Provider: OpenRouter (200+ models) | Model: ${ANTHROPIC_MODEL}"
    echo "   Requires: OPENROUTER_API_KEY"
    echo "   Browse models: https://openrouter.ai/models"
    ;;

  # ---- Local / self-hosted -------------------------------------------------

  opencode|zen)
    _reset_providers
    export RABBIT_USE_OPENCODE=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="auto"
    echo "✅ Provider: OpenCode / Zen | Model: ${ANTHROPIC_MODEL}"
    echo "   Endpoint: ${OPENCODE_HOST:-http://localhost:4000}/v1"
    echo "   Set OPENCODE_HOST to override."
    ;;

  ollama)
    _reset_providers
    export RABBIT_USE_OLLAMA=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="llama3.3"
    echo "✅ Provider: Ollama (local) | Model: ${ANTHROPIC_MODEL}"
    echo "   Start Ollama: ollama serve"
    echo "   Pull model:   ollama pull ${ANTHROPIC_MODEL}"
    echo "   Override host: export OLLAMA_HOST=http://my-server:11434"
    ;;

  lmstudio)
    _reset_providers
    export RABBIT_USE_LMSTUDIO=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: LM Studio (local)"
    echo "   Start LM Studio server on localhost:1234"
    echo "   Override host: export LMSTUDIO_HOST=http://my-server:1234"
    ;;

  jan)
    _reset_providers
    export RABBIT_USE_JAN=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: Jan.ai (local)"
    echo "   Start Jan.ai server on localhost:1337"
    echo "   Override host: export JAN_HOST=http://my-server:1337"
    ;;

  localai)
    _reset_providers
    export RABBIT_USE_LOCALAI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="gpt-4"
    echo "✅ Provider: LocalAI (local) | Model: ${ANTHROPIC_MODEL}"
    echo "   Start LocalAI server on localhost:8080"
    echo "   Override host: export LOCALAI_HOST=http://my-server:8080"
    ;;

  vllm)
    _reset_providers
    export RABBIT_USE_VLLM=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="served-model"
    echo "✅ Provider: vLLM (self-hosted) | Model: ${ANTHROPIC_MODEL}"
    echo "   Override host: export VLLM_HOST=http://my-server:8000"
    ;;

  tgi)
    _reset_providers
    export RABBIT_USE_TGI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="tgi-model"
    echo "✅ Provider: HuggingFace TGI (self-hosted)"
    echo "   Override host: export TGI_HOST=http://my-server:8080"
    ;;

  xinference)
    _reset_providers
    export RABBIT_USE_XINFERENCE=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="xinference-model"
    echo "✅ Provider: Xinference (self-hosted)"
    echo "   Override host: export XINFERENCE_HOST=http://my-server:9997"
    ;;

  # ---- Anthropic native providers ------------------------------------------

  bedrock)
    _reset_providers
    export RABBIT_USE_BEDROCK=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: AWS Bedrock"
    echo "   Configure AWS credentials (aws configure / env vars)."
    ;;

  vertex)
    _reset_providers
    export RABBIT_USE_VERTEX=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: Google Vertex AI"
    echo "   Requires: ANTHROPIC_VERTEX_PROJECT_ID + GCP credentials."
    ;;

  foundry|azure)
    _reset_providers
    export RABBIT_USE_FOUNDRY=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: Azure AI Foundry"
    echo "   Requires: ANTHROPIC_FOUNDRY_RESOURCE or ANTHROPIC_FOUNDRY_BASE_URL."
    ;;

  # ---- Custom / generic OpenAI-compatible ----------------------------------

  custom)
    _reset_providers
    export RABBIT_USE_CUSTOM=1
    if [[ -n "${MODEL}" ]]; then
      export OPENAI_BASE_URL="${MODEL}"
      [[ -n "${CUSTOM_BASE_URL}" ]] && export ANTHROPIC_MODEL="${CUSTOM_BASE_URL}"
    fi
    echo "✅ Provider: Custom OpenAI-compatible"
    echo "   OPENAI_BASE_URL=${OPENAI_BASE_URL:-(not set — please export it)}"
    echo "   Works with: vLLM, TGI, LocalAI, Xinference, LiteLLM, etc."
    ;;

  # ---- Meta commands -------------------------------------------------------

  list|--list|-l)
    cat <<'EOF'
rabbit-code provider list:

  CLOUD — major providers:
    openai         OpenAI GPT-4o, o3, GPT-4.1       OPENAI_API_KEY
    gemini         Google Gemini 2.5 Pro/Flash       GEMINI_API_KEY
    groq           Groq (ultra-fast Llama/DeepSeek)  GROQ_API_KEY
    mistral        Mistral AI                         MISTRAL_API_KEY
    xai / grok     xAI Grok-3                        XAI_API_KEY
    deepseek       DeepSeek V3 / R1                  DEEPSEEK_API_KEY
    cohere         Cohere Command-R+/A               COHERE_API_KEY
    perplexity     Perplexity Sonar (web search)     PERPLEXITY_API_KEY
    cerebras       Cerebras (ultra-fast inference)   CEREBRAS_API_KEY
    sambanova      SambaNova                         SAMBANOVA_API_KEY
    hyperbolic     Hyperbolic                        HYPERBOLIC_API_KEY
    nvidia / nim   NVIDIA NIM                        NVIDIA_API_KEY
    ai21           AI21 Jamba                        AI21_API_KEY
    moonshot/kimi  Moonshot AI (Kimi K2)             MOONSHOT_API_KEY
    zhipu / glm    Zhipu AI (GLM-4)                 ZHIPU_API_KEY
    stepfun/step   StepFun                           STEPFUN_API_KEY
    minimax        MiniMax (4M context)              MINIMAX_API_KEY
    together       Together AI (open models)         TOGETHER_API_KEY
    fireworks      Fireworks AI (open models)        FIREWORKS_API_KEY
    openrouter     OpenRouter (200+ models)          OPENROUTER_API_KEY

  LOCAL — free, no key needed:
    opencode/zen   OpenCode / Zen mode (port 4000)
    ollama         Ollama (port 11434)
    lmstudio       LM Studio (port 1234)
    jan            Jan.ai (port 1337)
    localai        LocalAI (port 8080)
    vllm           vLLM (port 8000)
    tgi            HuggingFace TGI (port 8080)
    xinference     Xinference (port 9997)

  ANTHROPIC-NATIVE:
    bedrock        AWS Bedrock
    vertex         Google Vertex AI
    foundry/azure  Azure AI Foundry

  OTHER:
    custom         Any OpenAI-compatible endpoint (OPENAI_BASE_URL)
    reset          Back to Anthropic default
EOF
    ;;

  *)
    echo "❌ Unknown provider: ${PROVIDER}"
    echo "   Run: source scripts/setup-provider.sh list"
    ;;
esac
