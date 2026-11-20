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
import { User, Mail, Lock } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
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
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      login(res.data.token, res.data.user);
      success('Account created', `Welcome, ${res.data.user.name}`);
      router.push('/');
    } catch (err: any) {
      error('Registration Error', err.message || 'Could not register user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-slate-200/90 shadow-sm bg-white">
      <CardHeader className="text-left pb-2">
        <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm mb-3">
          M
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">Create Account</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Get started with your sales leads pipeline workspace
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`pl-8 text-xs h-9 ${fieldErrors.name ? 'border-rose-400' : ''}`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Email
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
              Password (min. 6 characters)
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
            {isLoading ? 'Creating account...' : 'Create workspace account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-100 pt-3 text-xs text-slate-500">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-slate-900 hover:underline ml-1">
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};
