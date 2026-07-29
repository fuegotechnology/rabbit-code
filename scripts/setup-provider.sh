#!/usr/bin/env bash
# ============================================================
# rabbit-code / claude-code — AI Provider Setup Helper
# ============================================================
# Usage:
#   source scripts/setup-provider.sh openai   gpt-4o
#   source scripts/setup-provider.sh gemini   gemini-2.5-pro
#   source scripts/setup-provider.sh groq     llama-3.3-70b-versatile
#   source scripts/setup-provider.sh mistral  mistral-large-latest
#   source scripts/setup-provider.sh xai      grok-3
#   source scripts/setup-provider.sh ollama   llama3.3
#   source scripts/setup-provider.sh lmstudio
#   source scripts/setup-provider.sh openrouter anthropic/claude-opus-4
#   source scripts/setup-provider.sh together  meta-llama/Llama-3.3-70B-Instruct-Turbo
#   source scripts/setup-provider.sh fireworks accounts/fireworks/models/llama-v3p3-70b-instruct
#   source scripts/setup-provider.sh custom    http://localhost:8000/v1 my-model
#   source scripts/setup-provider.sh bedrock
#   source scripts/setup-provider.sh vertex
#   source scripts/setup-provider.sh reset   (back to Anthropic)
# ============================================================

set -euo pipefail

PROVIDER="${1:-}"
MODEL="${2:-}"
CUSTOM_BASE_URL="${3:-}"

# --- Reset all provider flags ---
_reset_providers() {
  unset CLAUDE_CODE_USE_OPENAI    2>/dev/null || true
  unset CLAUDE_CODE_USE_GEMINI    2>/dev/null || true
  unset CLAUDE_CODE_USE_OLLAMA    2>/dev/null || true
  unset CLAUDE_CODE_USE_GROQ      2>/dev/null || true
  unset CLAUDE_CODE_USE_MISTRAL   2>/dev/null || true
  unset CLAUDE_CODE_USE_XAI       2>/dev/null || true
  unset CLAUDE_CODE_USE_TOGETHER  2>/dev/null || true
  unset CLAUDE_CODE_USE_FIREWORKS 2>/dev/null || true
  unset CLAUDE_CODE_USE_OPENROUTER 2>/dev/null || true
  unset CLAUDE_CODE_USE_LMSTUDIO  2>/dev/null || true
  unset CLAUDE_CODE_USE_CUSTOM_PROVIDER 2>/dev/null || true
  unset CLAUDE_CODE_USE_BEDROCK   2>/dev/null || true
  unset CLAUDE_CODE_USE_VERTEX    2>/dev/null || true
  unset CLAUDE_CODE_USE_FOUNDRY   2>/dev/null || true
  unset OPENAI_BASE_URL           2>/dev/null || true
  unset ANTHROPIC_MODEL           2>/dev/null || true
}

case "${PROVIDER}" in

  openai)
    _reset_providers
    export CLAUDE_CODE_USE_OPENAI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="gpt-4o"
    echo "✅ Provider: OpenAI | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure OPENAI_API_KEY is set."
    ;;

  gemini)
    _reset_providers
    export CLAUDE_CODE_USE_GEMINI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="gemini-2.5-pro"
    echo "✅ Provider: Google Gemini | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure GEMINI_API_KEY (or GOOGLE_API_KEY) is set."
    ;;

  groq)
    _reset_providers
    export CLAUDE_CODE_USE_GROQ=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="llama-3.3-70b-versatile"
    echo "✅ Provider: Groq | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure GROQ_API_KEY is set."
    ;;

  mistral)
    _reset_providers
    export CLAUDE_CODE_USE_MISTRAL=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="mistral-large-latest"
    echo "✅ Provider: Mistral AI | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure MISTRAL_API_KEY is set."
    ;;

  xai|grok)
    _reset_providers
    export CLAUDE_CODE_USE_XAI=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="grok-3"
    echo "✅ Provider: xAI (Grok) | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure XAI_API_KEY is set."
    ;;

  together)
    _reset_providers
    export CLAUDE_CODE_USE_TOGETHER=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="meta-llama/Llama-3.3-70B-Instruct-Turbo"
    echo "✅ Provider: Together AI | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure TOGETHER_API_KEY is set."
    ;;

  fireworks)
    _reset_providers
    export CLAUDE_CODE_USE_FIREWORKS=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="accounts/fireworks/models/llama-v3p3-70b-instruct"
    echo "✅ Provider: Fireworks AI | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure FIREWORKS_API_KEY is set."
    ;;

  openrouter)
    _reset_providers
    export CLAUDE_CODE_USE_OPENROUTER=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="anthropic/claude-opus-4"
    echo "✅ Provider: OpenRouter | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure OPENROUTER_API_KEY is set."
    ;;

  ollama)
    _reset_providers
    export CLAUDE_CODE_USE_OLLAMA=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}" || export ANTHROPIC_MODEL="llama3.3"
    echo "✅ Provider: Ollama (local) | Model: ${ANTHROPIC_MODEL}"
    echo "   Make sure Ollama is running: ollama serve"
    echo "   Pull model if needed:        ollama pull ${ANTHROPIC_MODEL}"
    ;;

  lmstudio)
    _reset_providers
    export CLAUDE_CODE_USE_LMSTUDIO=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: LM Studio (local)"
    echo "   Make sure LM Studio server is running on localhost:1234"
    ;;

  custom)
    _reset_providers
    export CLAUDE_CODE_USE_CUSTOM_PROVIDER=1
    if [[ -n "${MODEL}" ]]; then
      export OPENAI_BASE_URL="${MODEL}"   # positional: 2nd arg = base URL for custom
      [[ -n "${CUSTOM_BASE_URL}" ]] && export ANTHROPIC_MODEL="${CUSTOM_BASE_URL}"
    fi
    echo "✅ Provider: Custom OpenAI-compatible"
    echo "   OPENAI_BASE_URL=${OPENAI_BASE_URL:-not set — please export it}"
    ;;

  bedrock)
    _reset_providers
    export CLAUDE_CODE_USE_BEDROCK=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: AWS Bedrock"
    echo "   Make sure AWS credentials are configured (aws configure / env vars)."
    ;;

  vertex)
    _reset_providers
    export CLAUDE_CODE_USE_VERTEX=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: Google Vertex AI"
    echo "   Make sure ANTHROPIC_VERTEX_PROJECT_ID is set and GCP credentials are configured."
    ;;

  foundry|azure)
    _reset_providers
    export CLAUDE_CODE_USE_FOUNDRY=1
    [[ -n "${MODEL}" ]] && export ANTHROPIC_MODEL="${MODEL}"
    echo "✅ Provider: Azure AI Foundry"
    echo "   Make sure ANTHROPIC_FOUNDRY_RESOURCE or ANTHROPIC_FOUNDRY_BASE_URL is set."
    ;;

  reset|anthropic|"")
    _reset_providers
    echo "✅ Provider: Anthropic (default)"
    echo "   Make sure ANTHROPIC_API_KEY is set."
    ;;

  list|--list|-l)
    cat <<'EOF'
Available providers:
  openai      — OpenAI GPT-4o, o3, GPT-4.1
  gemini      — Google Gemini 2.5 Pro/Flash
  groq        — Groq (ultra-fast Llama, Mixtral, DeepSeek)
  mistral     — Mistral AI (Large, Codestral, Pixtral)
  xai         — xAI Grok-3
  together    — Together AI (open models)
  fireworks   — Fireworks AI (open models)
  openrouter  — OpenRouter (200+ models)
  ollama      — Ollama (local models)
  lmstudio    — LM Studio (local models)
  custom      — Any OpenAI-compatible endpoint
  bedrock     — AWS Bedrock
  vertex      — Google Vertex AI
  foundry     — Azure AI Foundry
  reset       — Back to Anthropic (default)
EOF
    ;;

  *)
    echo "❌ Unknown provider: ${PROVIDER}"
    echo "   Run: source scripts/setup-provider.sh list"
    ;;

esac
