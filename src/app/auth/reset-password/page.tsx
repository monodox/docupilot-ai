'use client';

import React, { useState, Suspense } from 'react';
import { Input, Button } from '@/components/ui';
import { Lock } from 'lucide-react';
import { cfApi } from '@/lib/cfapi';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await cfApi.resetPassword(token || '', password);
      if (result.success) {
        router.push('/auth/login');
      } else {
        setError(result.message || 'Reset failed');
      }
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="space-y-4">
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
    </form>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}