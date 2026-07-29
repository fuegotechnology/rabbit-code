import type { Command } from '../../commands.js'

export const command: Command = {
  name: 'provider',
  description: 'Show and switch AI provider (OpenAI, Gemini, Groq, Mistral, Ollama, etc.)',
  isEnabled: () => true,
  isHidden: false,
  userFacingName: () => 'provider',
  async call(onDone, context) {
    const { call } = await import('./provider.js')
    return call(onDone, context)
  },
}
