import { Lock } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800">CFML Auth</h1>
        </div>
      </div>
    </header>
  );
}
