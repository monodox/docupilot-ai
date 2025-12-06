'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cfApi } from '@/lib/cfapi';
import { Button } from '@/components/ui';

function VerifyEmailForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else if (email) {
      setStatus('success');
      setMessage('Please check your email for verification link');
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token, email]);

  const verifyEmail = async (token: string) => {
    try {
      const result = await cfApi.verifyEmail(token);
      if (result.success) {
        setStatus('success');
        setMessage('Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to verify email');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Email Verification</h1>
      
      {status === 'loading' && (
        <div className="text-center">
          <p>Verifying your email...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-center space-y-4">
          <p className="text-green-600">{message}</p>
          <Button onClick={() => router.push('/auth/login')} className="w-full">
            Go to Login
          </Button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center space-y-4">
          <p className="text-red-600">{message}</p>
          <Button onClick={() => router.push('/auth/signup')} className="w-full">
            Back to Signup
          </Button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}