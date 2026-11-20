'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronDown,
  Building2,
  CheckCircle2,
  Sparkles,
  Command,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const handleOpenCreateModal = () => {
    window.dispatchEvent(new CustomEvent('open-create-lead'));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand & Workspace Switcher */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-zinc-800 transition-colors">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-900 tracking-tight leading-none">
                Meru CRM
              </span>
              <span className="text-[10px] text-zinc-400 font-mono leading-tight mt-0.5 hidden sm:inline">
                Lead Intelligence
              </span>
            </div>
          </Link>

          {user && (
            <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-zinc-200">
              <button
                type="button"
                onClick={handleOpenCommandPalette}
                className="flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-medium text-zinc-700 bg-zinc-100/70 hover:bg-zinc-200/60 transition-colors"
              >
                <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                <span className="font-semibold text-zinc-800">Sales Pipeline</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                Live Sync
              </span>
            </div>
          )}
        </div>

        {/* Center: Command Palette Spotlight Bar */}
        {user && (
          <div className="hidden md:flex items-center justify-center flex-1 max-w-sm mx-4">
            <button
              type="button"
              onClick={handleOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-500 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 rounded-lg transition-all cursor-pointer shadow-2xs group"
              title="Open Spotlight Command Palette (Ctrl+K or ⌘K)"
            >
              <div className="flex items-center space-x-2">
                <Search className="h-3.5 w-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                <span className="text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  Search leads or actions...
                </span>
              </div>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white rounded border border-zinc-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right: Actions & User Navigation */}
        <div className="flex items-center space-x-2.5">
          {user ? (
            <>
              {/* Quick Create Lead Primary Button */}
              <Button
                size="sm"
                onClick={handleOpenCreateModal}
                className="h-8 px-3 text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>New Lead</span>
                <kbd className="hidden lg:inline-block ml-1.5 px-1 py-0.2 text-[9px] font-mono bg-zinc-800 text-zinc-300 rounded">
                  N
                </kbd>
              </Button>

              {/* User Profile Pill & Sign Out */}
              <div className="flex items-center space-x-1.5 pl-2 border-l border-zinc-200">
                <div className="flex items-center space-x-2 text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg py-1 px-2.5">
                  <span className="h-5 w-5 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex flex-col text-left leading-tight hidden lg:flex">
                    <span className="font-bold text-zinc-800 text-[11px] max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Sales Rep
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-zinc-400 hover:text-rose-600 hover:bg-rose-50 text-xs h-8 px-2"
                  title="Sign out of account"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs h-8 bg-zinc-900 hover:bg-zinc-800 text-white">
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
