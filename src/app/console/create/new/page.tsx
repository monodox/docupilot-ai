'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewDocument() {
  const [formData, setFormData] = useState({ title: '', category: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

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
        
        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        
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
