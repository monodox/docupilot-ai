'use client';

import { useState, useEffect } from 'react';
import { cfApi } from '@/lib/cfapi';
import { User, Settings as SettingsIcon, Server } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useTheme } from '@/lib/theme';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [cfConfig, setCfConfig] = useState({ serverUrl: '', timeout: '30' });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.firstName) {
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile');
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        setMessage('Profile updated successfully');
      } else {
        setMessage(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setPasswordMessage('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profileData.email, currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      const result = await response.json();
      if (result.success) {
        setPasswordMessage('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage(result.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordMessage('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'app', name: 'App Settings', icon: SettingsIcon },
    { id: 'coldfusion', name: 'ColdFusion Config', icon: Server },
  ];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-gray-600 mb-8">Simple configuration: profile, team roles, org details. Just enough gears to keep things running smoothly.</p>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            <Button onClick={saveProfile} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</Button>
            
            <hr className="my-8 border-gray-200 dark:border-gray-700" />
            
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
              {passwordMessage && <p className={`text-sm ${passwordMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage}</p>}
              <Button onClick={changePassword} disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</Button>
            </div>
          </div>
        )}

        {activeTab === 'app' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Application Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Enable email notifications
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Auto-save documents
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  Dark mode
                </label>
              </div>
            </div>
            <Button>Save Settings</Button>
          </div>
        )}

        {activeTab === 'coldfusion' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">ColdFusion Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Server URL</label>
                <Input
                  value={cfConfig.serverUrl}
                  onChange={(e) => setCfConfig({...cfConfig, serverUrl: e.target.value})}
                  placeholder="http://localhost:8500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Connection Timeout (seconds)</label>
                <Input
                  type="number"
                  value={cfConfig.timeout}
                  onChange={(e) => setCfConfig({...cfConfig, timeout: e.target.value})}
                  placeholder="30"
                />
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Changes to ColdFusion configuration require application restart.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button>Test Connection</Button>
              <Button>Save Configuration</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}