'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderOpen, Archive, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/console/dashboard', icon: LayoutDashboard },
  { name: 'Create', href: '/console/create', icon: FileText },
  { name: 'Templates', href: '/console/templates', icon: FolderOpen },
  { name: 'Documents', href: '/console/documents', icon: Archive },
  { name: 'Settings', href: '/console/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
      <div className="pt-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center px-2'} py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}