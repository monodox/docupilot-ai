'use client';

import React, { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { Mail } from 'lucide-react';
import { cfApi } from '@/lib/cfapi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await cfApi.forgotPassword(email);
      if (result.success) {
        setMessage('Reset link sent to your email');
        setEmail('');
      } else {
        setError(result.message || 'Request failed');
      }
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleForgotPassword} className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}
        <div className="space-y-4">
          <div className="flex items-center border rounded px-3 py-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
    </form>
  );
};

export default ForgotPasswordPage;