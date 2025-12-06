import { ExtractAgent } from './extract';
import { CatalogAgent } from './catalog';
import { RetrieveAgent } from './retrieve';
import { ComposeAgent } from './compose';
import { ValidateAgent } from './validate';
import { AgentContext } from './base';

export interface OrchestratorInput {
  prompt: string;
  category: string;
  userId?: number;
}

export interface OrchestratorOutput {
  title: string;
  content: string;
  category: string;
  validation: {
    approved: boolean;
    score: number;
    issues: any[];
    suggestions: string[];
  };
  metadata: {
    usedContext: boolean;
    retrievedDocs: number;
    processingTime: number;
  };
}

export class AgentOrchestrator {
  private extractAgent = new ExtractAgent();
  private catalogAgent = new CatalogAgent();
  private retrieveAgent = new RetrieveAgent();
  private composeAgent = new ComposeAgent();
  private validateAgent = new ValidateAgent();

  async generateDocument(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const startTime = Date.now();
    const context: AgentContext = { userId: input.userId };

    // Step 1: Retrieve relevant context
    const retrieveResult = await this.retrieveAgent.execute(
      { query: input.prompt, topK: 3, category: input.category },
      context
    );

    const retrievedContext = retrieveResult.success ? retrieveResult.data?.context : undefined;
    const retrievedCount = retrieveResult.success ? retrieveResult.data?.results.length || 0 : 0;

    // Step 2: Compose document with context
    const composeResult = await this.composeAgent.execute(
      {
        prompt: input.prompt,
        context: retrievedContext,
        category: input.category
      },
      context
    );

    if (!composeResult.success) {
      throw new Error(composeResult.error || 'Composition failed');
    }

    // Step 3: Validate document
    const validateResult = await this.validateAgent.execute(
      {
        title: composeResult.data!.title,
        content: composeResult.data!.content,
        category: input.category
      },
      context
    );

    if (!validateResult.success) {
      throw new Error(validateResult.error || 'Validation failed');
    }

    const processingTime = Date.now() - startTime;

    return {
      title: composeResult.data!.title,
      content: composeResult.data!.content,
      category: input.category,
      validation: {
        approved: validateResult.data!.approved,
        score: validateResult.data!.score,
        issues: validateResult.data!.issues,
        suggestions: validateResult.data!.suggestions
      },
      metadata: {
        usedContext: composeResult.data!.usedContext,
        retrievedDocs: retrievedCount,
        processingTime
      }
    };
  }

  async indexDocument(documentId: number, content: string): Promise<void> {
    const context: AgentContext = { documentId };

    // Step 1: Extract content
    const extractResult = await this.extractAgent.execute(
      { content },
      context
    );

    if (!extractResult.success) {
      throw new Error(extractResult.error || 'Extraction failed');
    }

    // Step 2: Catalog (create embeddings)
    await this.catalogAgent.execute(
      {
        documentId,
        text: extractResult.data!.text,
        sections: extractResult.data!.sections,
        metadata: extractResult.data!.metadata
      },
      context
    );
  }
}
