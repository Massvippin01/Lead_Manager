'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: { user: any; token: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(res.data.token, res.data.user);
      success('Welcome back!', `Signed in as ${res.data.user.name}`);
      router.push('/');
    } catch (err: any) {
      error('Authentication Failed', err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@meru.com');
    setPassword('password123');
    setFieldErrors({});
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-slate-200">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-blue-500/25">
          <Sparkles className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900">Sign in to your account</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your credentials to access your sales leads pipeline
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Quick Demo Credentials Pill */}
        <div className="mb-5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-center justify-between">
          <div>
            <span className="font-semibold block">Need demo credentials?</span>
            <span className="text-blue-700">demo@meru.com / password123</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemoAccount}
            className="text-xs bg-white text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            Auto-fill
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-9 ${fieldErrors.email ? 'border-rose-400 focus-visible:ring-rose-500/10' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-rose-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-9 ${fieldErrors.password ? 'border-rose-400 focus-visible:ring-rose-500/10' : ''}`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-rose-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              'Authenticating...'
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline ml-1">
          Create one now
        </Link>
      </CardFooter>
    </Card>
  );
};
