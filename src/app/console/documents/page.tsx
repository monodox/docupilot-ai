'use client';

import { useState, useEffect } from 'react';
import { FileText, Calendar, Tag, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const result = await response.json();
      if (result.success) {
        setDocuments(result.documents);
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
        fetchDocuments();
      }
    } catch (error) {
      console.error('Failed to delete document');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">The archive. Home for every drafted, saved, or shared document, with filtering and versioning.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc: any) => (
          <div key={doc.id} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            <FileText className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Tag className="w-4 h-4" />
              <span>{doc.category || 'Uncategorized'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {doc.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/console/documents/${doc.id}/edit`)}
                  className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
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
      {documents.length === 0 && <p className="text-gray-500 text-center mt-8">No documents found</p>}
    </div>
  );
}