'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { FileText, Plus, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Create() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDraftDocuments();
  }, []);

  const fetchDraftDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const result = await response.json();
      if (result.success) {
        const drafts = result.documents.filter((doc: any) => doc.status === 'draft');
        setDocuments(drafts);
      }
    } catch (error) {
      console.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        fetchDraftDocuments();
      }
    } catch (error) {
      console.error('Failed to delete document');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create Document</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The drafting chamber. Start a new document with AI, templates, or an upload.</p>
        </div>
        <Link href="/console/create/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New
          </Button>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Draft Documents</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500">No draft documents found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc: any) => (
            <div key={doc.id} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <FileText className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Tag className="w-4 h-4" />
                <span>{doc.category || 'Uncategorized'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/console/documents/${doc.id}/edit`)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}