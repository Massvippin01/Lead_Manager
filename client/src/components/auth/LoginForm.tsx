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
import { Mail, Lock, ArrowRight } from 'lucide-react';

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
      errs.email = 'Enter a valid email address';
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
      success('Signed in', `Welcome back, ${res.data.user.name}`);
      router.push('/');
    } catch (err: any) {
      error('Authentication Error', err.message || 'Invalid email or password');
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
    <Card className="w-full max-w-sm border-slate-200/90 shadow-sm bg-white">
      <CardHeader className="text-left pb-2">
        <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm mb-3">
          M
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">Sign In</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Access your sales leads pipeline workspace
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Quick Demo Credentials Pill */}
        <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
          <div>
            <span className="font-semibold block text-[11px] text-slate-500">Demo Credentials</span>
            <span className="font-mono text-[11px] text-slate-800">demo@meru.com / password123</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-8 text-xs h-9 ${fieldErrors.email ? 'border-rose-400' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-8 text-xs h-9 ${fieldErrors.password ? 'border-rose-400' : ''}`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in to workspace'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 pt-3 text-xs text-slate-500">
        Need an account?{' '}
        <Link href="/register" className="font-semibold text-slate-900 hover:underline ml-1">
          Create account
        </Link>
      </CardFooter>
    </Card>
  );
};
