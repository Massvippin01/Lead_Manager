'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const handleOpenCreateModal = () => {
    window.dispatchEvent(new CustomEvent('open-create-lead'));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 flex items-center justify-between">
        {/* Brand & Workspace Indicator */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-md bg-zinc-900 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
              M
            </div>
            <span className="text-xs font-bold text-zinc-900 tracking-tight">
              Meru CRM
            </span>
          </Link>

          {user && (
            <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-zinc-200 text-xs text-zinc-500 font-mono">
              <span className="text-zinc-300">/</span>
              <span className="font-semibold text-zinc-800">Sales Pipeline</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-sans">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                Live Sync
              </span>
            </div>
          )}
        </div>

        {/* Global Command Center & Actions */}
        <div className="flex items-center space-x-2.5">
          {user ? (
            <>
              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={handleOpenCommandPalette}
                className="hidden md:flex items-center space-x-2 px-2.5 py-1 text-xs text-zinc-500 bg-zinc-100/80 hover:bg-zinc-200/70 border border-zinc-200 rounded-md transition-all cursor-pointer font-medium"
                title="Command Palette (Ctrl+K or ⌘K)"
              >
                <Search className="h-3 w-3 text-zinc-400" />
                <span>Commands & search...</span>
                <kbd className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono text-zinc-500 bg-white rounded border border-zinc-200 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Quick Create Lead Button in Navbar */}
              <Button
                size="sm"
                onClick={handleOpenCreateModal}
                className="hidden sm:inline-flex h-7 px-2.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Lead
              </Button>

              {/* User Profile Pill */}
              <div className="flex items-center space-x-2 pl-2 sm:border-l sm:border-zinc-200">
                <div className="flex items-center space-x-1.5 text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md py-0.5 px-2">
                  <span className="h-4 w-4 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[9px]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold text-zinc-800 max-w-[100px] truncate hidden lg:inline">
                    {user.name}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-zinc-400 hover:text-rose-600 hover:bg-rose-50 text-xs h-7 px-2"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs h-7 bg-zinc-900 hover:bg-zinc-800 text-white">
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
