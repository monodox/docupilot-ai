// Base Agent Interface
export interface AgentContext {
  userId?: number;
  documentId?: number;
  metadata?: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export abstract class BaseAgent {
  protected ollamaUrl = 'http://localhost:11434';

  protected async callOllama(model: string, prompt: string, system?: string): Promise<string> {
    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        system,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
    const data = await response.json();
    return data.response;
  }

  protected async createEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.ollamaUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'embeddinggemma',
        prompt: text
      })
    });

    if (!response.ok) throw new Error(`Embedding error: ${response.statusText}`);
    const data = await response.json();
    return data.embedding;
  }

  abstract execute(input: any, context: AgentContext): Promise<AgentResult>;
}
