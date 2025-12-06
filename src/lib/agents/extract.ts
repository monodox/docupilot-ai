import { BaseAgent, AgentContext, AgentResult } from './base';

export interface ExtractInput {
  content: string;
  filename?: string;
  mimeType?: string;
}

export interface ExtractOutput {
  text: string;
  sections: Array<{ title: string; content: string }>;
  metadata: {
    wordCount: number;
    language: string;
    documentType: string;
  };
}

export class ExtractAgent extends BaseAgent {
  async execute(input: ExtractInput, context: AgentContext): Promise<AgentResult<ExtractOutput>> {
    try {
      const system = 'Extract and structure document content. Identify sections, clean text, and extract metadata.';
      const prompt = `Analyze this document and extract structured information:

Content: ${input.content}

Provide:
1. Clean text (remove formatting artifacts)
2. Sections with titles
3. Document type (legal, hr, compliance, etc.)
4. Language

Format as JSON.`;

      const response = await this.callOllama('gemma3', prompt, system);
      
      const sections = this.extractSections(input.content);
      const wordCount = input.content.split(/\s+/).length;

      return {
        success: true,
        data: {
          text: input.content,
          sections,
          metadata: {
            wordCount,
            language: 'en',
            documentType: this.detectDocumentType(input.content)
          }
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private extractSections(content: string): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = [];
    const lines = content.split('\n');
    let currentSection = { title: 'Introduction', content: '' };

    for (const line of lines) {
      if (line.match(/^#{1,3}\s+/) || line.match(/^[A-Z][^.!?]*:$/)) {
        if (currentSection.content) sections.push(currentSection);
        currentSection = { title: line.replace(/^#+\s+/, '').replace(/:$/, ''), content: '' };
      } else {
        currentSection.content += line + '\n';
      }
    }
    if (currentSection.content) sections.push(currentSection);
    return sections;
  }

  private detectDocumentType(content: string): string {
    const lower = content.toLowerCase();
    if (lower.includes('agreement') || lower.includes('contract')) return 'legal';
    if (lower.includes('employee') || lower.includes('policy')) return 'hr';
    if (lower.includes('compliance') || lower.includes('regulation')) return 'compliance';
    return 'general';
  }
}
