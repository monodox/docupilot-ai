import { BaseAgent, AgentContext, AgentResult } from './base';

export interface ComposeInput {
  prompt: string;
  context?: string;
  category: string;
  template?: string;
}

export interface ComposeOutput {
  title: string;
  content: string;
  category: string;
  usedContext: boolean;
}

export class ComposeAgent extends BaseAgent {
  async execute(input: ComposeInput, context: AgentContext): Promise<AgentResult<ComposeOutput>> {
    try {
      const system = `You are a professional document composer specializing in ${input.category} documents. Create clear, accurate, and compliant documents.`;
      
      let prompt = `Create a ${input.category} document based on this request:\n\n${input.prompt}\n\n`;
      
      if (input.context) {
        prompt += `Use this relevant context from existing documents:\n\n${input.context}\n\n`;
      }
      
      if (input.template) {
        prompt += `Follow this template structure:\n\n${input.template}\n\n`;
      }
      
      prompt += `Generate a complete, professional document with:
1. Appropriate title
2. Well-structured sections
3. Clear, formal language
4. Compliance considerations

Format the response as:
TITLE: [document title]
CONTENT: [full document content]`;

      const response = await this.callOllama('gemma3', prompt, system);
      
      const titleMatch = response.match(/TITLE:\s*(.+)/);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]+)/);
      
      const title = titleMatch ? titleMatch[1].trim() : this.generateTitle(input.prompt, input.category);
      const content = contentMatch ? contentMatch[1].trim() : response;

      return {
        success: true,
        data: {
          title,
          content,
          category: input.category,
          usedContext: !!input.context
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private generateTitle(prompt: string, category: string): string {
    const words = prompt.split(' ').slice(0, 5).join(' ');
    return `${category} - ${words}`;
  }
}
