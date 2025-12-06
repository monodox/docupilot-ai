'use client';

import { useState } from 'react';
import Header from '@/components/console/Header';
import Sidebar from '@/components/console/Sidebar';
import { ThemeProvider } from '@/lib/theme';

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex">
          <Sidebar sidebarOpen={sidebarOpen} />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}