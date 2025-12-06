'use client';

import { useState, useEffect } from 'react';
import { FileText, Tag, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const result = await response.json();
      if (result.success) {
        setTemplates(result.templates);
      }
    } catch (error) {
      console.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const response = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to delete template');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Templates</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">A collection of ready-made legal and compliance templates. Users can also save their own.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template: any) => (
          <div key={template.id} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Tag className="w-4 h-4" />
                <span>{template.category}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/console/templates/${template.id}/edit`)}
                  className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {templates.length === 0 && <p className="text-gray-500 text-center mt-8">No templates found</p>}
    </div>
  );
}