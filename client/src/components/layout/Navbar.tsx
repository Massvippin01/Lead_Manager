'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Building2, LogOut, Plus, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Workspace Indicator */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              M
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Meru Lead Manager
            </span>
          </Link>

          {user && (
            <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Sales Workspace</span>
            </div>
          )}
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-full py-1 px-3">
                <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-slate-800">{user.name}</span>
                <span className="text-slate-400">({user.email})</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs h-8 px-2.5"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
