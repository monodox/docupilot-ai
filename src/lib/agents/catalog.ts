import { BaseAgent, AgentContext, AgentResult } from './base';

export interface CatalogInput {
  documentId: number;
  text: string;
  sections: Array<{ title: string; content: string }>;
  metadata: Record<string, any>;
}

export interface CatalogOutput {
  indexed: boolean;
  embeddingCount: number;
  vectorIds: string[];
}

interface VectorEntry {
  id: string;
  documentId: number;
  sectionTitle: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

// In-memory vector store
const vectorStore: VectorEntry[] = [];

export class CatalogAgent extends BaseAgent {
  async execute(input: CatalogInput, context: AgentContext): Promise<AgentResult<CatalogOutput>> {
    try {
      const vectorIds: string[] = [];

      for (const section of input.sections) {
        const embedding = await this.createEmbedding(section.content);
        const id = `${input.documentId}-${Date.now()}-${Math.random()}`;
        
        vectorStore.push({
          id,
          documentId: input.documentId,
          sectionTitle: section.title,
          content: section.content,
          embedding,
          metadata: input.metadata
        });

        vectorIds.push(id);
      }

      return {
        success: true,
        data: {
          indexed: true,
          embeddingCount: input.sections.length,
          vectorIds
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static getVectorStore(): VectorEntry[] {
    return vectorStore;
  }

  static clearVectorStore(): void {
    vectorStore.length = 0;
  }
}
