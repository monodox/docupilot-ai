import { BaseAgent, AgentContext, AgentResult } from './base';

export interface ValidateInput {
  title: string;
  content: string;
  category: string;
}

export interface ValidateOutput {
  approved: boolean;
  score: number;
  issues: Array<{
    type: 'quality' | 'compliance' | 'security' | 'pii';
    severity: 'low' | 'medium' | 'high';
    message: string;
  }>;
  suggestions: string[];
}

export class ValidateAgent extends BaseAgent {
  async execute(input: ValidateInput, context: AgentContext): Promise<AgentResult<ValidateOutput>> {
    try {
      const system = 'You are a document validation expert. Check quality, compliance, security, and detect PII.';
      
      const prompt = `Validate this ${input.category} document:

TITLE: ${input.title}
CONTENT: ${input.content}

Check for:
1. Quality issues (clarity, structure, completeness)
2. Compliance problems (legal requirements, regulations)
3. Security risks (sensitive data exposure)
4. PII detection (names, emails, phone numbers, addresses)

Provide:
- Overall score (0-100)
- List of issues with severity
- Suggestions for improvement
- Approval recommendation

Format as JSON.`;

      const response = await this.callOllama('gemma3', prompt, system);
      
      const issues = this.detectIssues(input.content);
      const score = this.calculateScore(input.content, issues);
      const approved = score >= 70 && !issues.some(i => i.severity === 'high');

      return {
        success: true,
        data: {
          approved,
          score,
          issues,
          suggestions: this.generateSuggestions(issues)
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private detectIssues(content: string): Array<{ type: any; severity: any; message: string }> {
    const issues: Array<{ type: any; severity: any; message: string }> = [];
    
    // PII detection
    if (content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)) {
      issues.push({ type: 'pii', severity: 'high', message: 'Email addresses detected' });
    }
    if (content.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)) {
      issues.push({ type: 'pii', severity: 'high', message: 'Phone numbers detected' });
    }
    if (content.match(/\b\d{3}-\d{2}-\d{4}\b/)) {
      issues.push({ type: 'pii', severity: 'high', message: 'SSN pattern detected' });
    }
    
    // Quality checks
    if (content.length < 100) {
      issues.push({ type: 'quality', severity: 'medium', message: 'Document too short' });
    }
    if (!content.match(/[.!?]\s/g) || content.match(/[.!?]\s/g).length < 3) {
      issues.push({ type: 'quality', severity: 'low', message: 'Limited sentence structure' });
    }
    
    // Security checks
    if (content.toLowerCase().includes('password') || content.toLowerCase().includes('secret')) {
      issues.push({ type: 'security', severity: 'medium', message: 'Sensitive keywords detected' });
    }
    
    return issues;
  }

  private calculateScore(content: string, issues: Array<{ severity: string }>): number {
    let score = 100;
    issues.forEach(issue => {
      if (issue.severity === 'high') score -= 20;
      else if (issue.severity === 'medium') score -= 10;
      else score -= 5;
    });
    return Math.max(0, score);
  }

  private generateSuggestions(issues: Array<{ type: string; message: string }>): string[] {
    const suggestions: string[] = [];
    if (issues.some(i => i.type === 'pii')) {
      suggestions.push('Remove or redact personally identifiable information');
    }
    if (issues.some(i => i.type === 'quality')) {
      suggestions.push('Expand content with more details and structure');
    }
    if (issues.some(i => i.type === 'security')) {
      suggestions.push('Review and remove sensitive information');
    }
    return suggestions;
  }
}
