'use client';

import { useState, useEffect, useRef } from 'react';
import { LogOut, Menu, X, Scale, Circle, User } from 'lucide-react';
import { cfApi } from '@/lib/cfapi';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Check every 5 seconds
    
    const handleOnline = () => checkConnection();
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkConnection = async () => {
    try {
      const result = await cfApi.testConnection();
      setIsConnected(result.success);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    window.location.href = '/auth/login';
  };

  const handleProfile = () => {
    setShowDropdown(false);
    router.push('/console/settings');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} py-4 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
          <div className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center px-2'}`}>
            <Scale className="w-5 h-5 text-blue-600 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">DocuPilot AI</span>}
          </div>
        </div>
        <div className="flex-1 px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center gap-2"
                title={isConnected ? 'Connected to ColdFusion Server' : 'Disconnected from ColdFusion Server'}
              >
                <Circle className={`w-3 h-3 ${isConnected ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'}`} />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button
                      onClick={handleProfile}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}