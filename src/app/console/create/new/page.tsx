'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NewDocument() {
  const [formData, setFormData] = useState({ title: '', category: '', content: '' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [validation, setValidation] = useState<any>(null);
  const router = useRouter();

  const generateWithAI = async () => {
    if (!aiPrompt || !formData.category) {
      setMessage('Please enter a prompt and select a category');
      return;
    }
    setAiLoading(true);
    setMessage('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/agents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, category: formData.category, userId: user.id })
      });
      const result = await response.json();
      if (result.title && result.content) {
        setFormData({...formData, title: result.title, content: result.content});
        setValidation(result.validation);
        setMessage(`Generated successfully! Score: ${result.validation.score}/100 - ${result.validation.approved ? 'Approved' : 'Needs Review'}`);
      } else {
        setMessage(result.error || 'AI generation failed');
      }
    } catch (error) {
      setMessage('Error generating content with AI');
    } finally {
      setAiLoading(false);
    }
  };

  const createDocument = async () => {
    if (!formData.title) {
      setMessage('Title is required');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id })
      });
      const result = await response.json();
      if (result.success) {
        router.push('/console/create');
      } else {
        setMessage(result.message || 'Failed to create document');
      }
    } catch (error) {
      setMessage('Error creating document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      
      <h1 className="text-3xl font-bold mb-6">Create New Document</h1>
      
      <div className="max-w-3xl space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Document Generator
          </h3>
          <div className="space-y-3">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe what you want to create (e.g., 'Create an NDA for software development')"
              className="w-full"
            />
            <Button 
              onClick={generateWithAI} 
              disabled={aiLoading || !formData.category}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {aiLoading ? 'Generating with AI...' : 'Generate with AI'}
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Document Details</h3>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter document title"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Select category</option>
            <option value="Legal">Legal</option>
            <option value="HR">HR</option>
            <option value="Compliance">Compliance</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Enter document content"
            className="w-full p-3 border rounded-lg min-h-64 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        {message && <p className={`text-sm ${message.includes('success') || message.includes('Generated') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        
        {validation && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border rounded-lg">
            <h4 className="font-semibold mb-2">Validation Report</h4>
            <p className="text-sm mb-2">Score: {validation.score}/100 - Status: {validation.approved ? '✅ Approved' : '⚠️ Needs Review'}</p>
            {validation.issues.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium">Issues:</p>
                <ul className="text-sm list-disc list-inside">
                  {validation.issues.map((issue: any, i: number) => (
                    <li key={i} className={issue.severity === 'high' ? 'text-red-600' : issue.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'}>
                      [{issue.type}] {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {validation.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium">Suggestions:</p>
                <ul className="text-sm list-disc list-inside">
                  {validation.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-3">
          <Button onClick={createDocument} disabled={loading}>
            {loading ? 'Creating...' : 'Create Document'}
          </Button>
          <Button onClick={() => router.back()} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
