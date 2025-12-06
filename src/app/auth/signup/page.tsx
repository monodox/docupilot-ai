'use client';

import React, { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { UserPlus, Mail, Lock } from 'lucide-react';
import { cfApi } from '@/lib/cfapi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!acceptTerms) {
      setError('Please accept terms and conditions');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await cfApi.signup(email, password, firstName, lastName);
      if (result.success) {
        router.push('/auth/verify-email?email=' + encodeURIComponent(email));
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="space-y-4">
          <div className="flex items-center border rounded px-3 py-2">
            <UserPlus className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
              aria-label="First Name"
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <UserPlus className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
              aria-label="Last Name"
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
              aria-label="Email"
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-none focus:ring-0"
              required
              aria-label="Password"
            />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-1"
          />
          <span>
            I accept the{' '}
            <Link href="/terms" className="text-blue-500 hover:underline">
              terms and conditions
            </Link>
          </span>
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
    </form>
  );
};

export default SignupPage;