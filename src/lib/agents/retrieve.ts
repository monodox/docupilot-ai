import { BaseAgent, AgentContext, AgentResult } from './base';
import { CatalogAgent } from './catalog';

export interface RetrieveInput {
  query: string;
  topK?: number;
  category?: string;
}

export interface RetrieveOutput {
  results: Array<{
    documentId: number;
    sectionTitle: string;
    content: string;
    similarity: number;
    metadata: Record<string, any>;
  }>;
  context: string;
}

export class RetrieveAgent extends BaseAgent {
  async execute(input: RetrieveInput, context: AgentContext): Promise<AgentResult<RetrieveOutput>> {
    try {
      const queryEmbedding = await this.createEmbedding(input.query);
      const vectorStore = CatalogAgent.getVectorStore();
      
      const results = vectorStore
        .map(entry => ({
          documentId: entry.documentId,
          sectionTitle: entry.sectionTitle,
          content: entry.content,
          similarity: this.cosineSimilarity(queryEmbedding, entry.embedding),
          metadata: entry.metadata
        }))
        .filter(r => !input.category || r.metadata.documentType === input.category)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, input.topK || 3);

      const contextText = results
        .map(r => `[${r.sectionTitle}]\n${r.content}`)
        .join('\n\n---\n\n');

      return {
        success: true,
        data: {
          results,
          context: contextText
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
