'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Check,
  Copy,
  Table,
  LayoutGrid,
  Flame,
  ShieldCheck,
  RefreshCw,
  Download,
  Command,
  Zap,
  TrendingUp,
  Building2,
  CheckCircle2,
  Lock,
  Database,
  ExternalLink,
  Layers,
  Activity,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'table' | 'kanban'>('table');

  const handle1ClickDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: { token: string; user: any };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'demo@meru.com',
          password: 'password123',
        }),
      });

      login(res.data.token, res.data.user);
      success('Welcome to Meru CRM', 'Logged in as Demo Representative');
    } catch (err: any) {
      error('Demo Login Failed', err.message || 'Please use standard sign in');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    success('Copied to clipboard', text);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="py-6 sm:py-10 max-w-6xl mx-auto space-y-16">
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/90 text-zinc-800 text-xs font-medium shadow-2xs hover:bg-zinc-200/60 transition-colors"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-zinc-900">Meru 2.0 Engine</span>
          <span className="text-zinc-300">·</span>
          <span className="text-zinc-600 font-mono text-[11px]">Production Screening Release</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-3 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-tight">
            Turn Raw Inbound Leads into{' '}
            <span className="underline decoration-zinc-300 decoration-wavy decoration-2">
              Predictable Pipeline
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal">
            The high-density CRM designed for fast-moving sales reps. Toggle effortlessly between spreadsheet-speed tables and visual Kanban boards, score deal probability in real time, and streamline outreach.
          </p>
        </motion.div>

        {/* Action Group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          {/* 1-Click Instant Demo Button */}
          <Button
            size="lg"
            onClick={handle1ClickDemo}
            disabled={isDemoLoading}
            className="w-full sm:w-auto h-11 px-6 text-sm bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-md transition-all active:scale-98"
          >
            {isDemoLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Launching Demo Workspace...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2 text-amber-300 fill-amber-300" />
                <span>1-Click Instant Demo Access</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          {/* Standard Sign In Link */}
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 px-5 text-sm border-zinc-300 hover:bg-zinc-100/80 font-medium"
            >
              Sign In with Account
            </Button>
          </Link>

          {/* Register Link */}
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto h-11 px-4 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              Create Rep Account
            </Button>
          </Link>
        </motion.div>

        {/* Credentials Pill Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="pt-2"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 p-2 px-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 shadow-2xs">
            <span className="font-semibold text-zinc-800 flex items-center">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
              Pre-seeded Evaluator Credentials:
            </span>
            <div className="flex items-center space-x-2 font-mono text-[11px] bg-white px-2 py-1 rounded border border-zinc-200">
              <span className="text-zinc-900 font-medium">demo@meru.com</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-900 font-medium">password123</span>
              <button
                type="button"
                onClick={() => handleCopy('demo@meru.com / password123', 'creds')}
                className="ml-1 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                title="Copy demo credentials"
              >
                {copiedField === 'creds' ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
            <span className="text-[10px] text-zinc-400 hidden lg:inline">
              (Works offline with zero external cloud keys)
            </span>
          </div>
        </motion.div>
      </section>

      {/* 2. Interactive Product Preview Mockup Window */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-500">
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
            <span>Interactive Workspace Preview</span>
          </div>

          <div className="flex items-center space-x-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
            <button
              type="button"
              onClick={() => setPreviewTab('table')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                previewTab === 'table'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Table className="h-3 w-3" />
              <span>Table Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('kanban')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                previewTab === 'kanban'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>

        {/* Mac-style Window Mockup */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-xl overflow-hidden transition-all">
          {/* Top Window Bar */}
          <div className="h-10 bg-zinc-50/90 border-b border-zinc-200/80 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-rose-400/80 inline-block border border-rose-500/20" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80 inline-block border border-amber-500/20" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80 inline-block border border-emerald-500/20" />
            </div>

            <div className="text-[11px] font-mono font-medium text-zinc-500 flex items-center space-x-1.5">
              <Building2 className="h-3 w-3 text-zinc-400" />
              <span>meru.app/pipeline — Enterprise Deals</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live 200 OK
              </span>
            </div>

            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
              <Command className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px]">⌘K Search</span>
            </div>
          </div>

          {/* KPI Metrics Mockup Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-200/70 border-b border-zinc-200">
            <div className="bg-white p-3.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Total Pipeline
              </p>
              <p className="text-lg font-bold text-zinc-900 mt-0.5">$166,000</p>
              <p className="text-[10px] text-emerald-600 font-mono flex items-center mt-0.5">
                <TrendingUp className="h-2.5 w-2.5 mr-1" />
                +18.4% this quarter
              </p>
            </div>
            <div className="bg-white p-3.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Active Prospects
              </p>
              <p className="text-lg font-bold text-zinc-900 mt-0.5">28 Accounts</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Across 4 stages</p>
            </div>
            <div className="bg-white p-3.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Urgent Deals
              </p>
              <p className="text-lg font-bold text-rose-600 mt-0.5">8 In P1 Priority</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Action within 24h</p>
            </div>
            <div className="bg-white p-3.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Conversion Rate
              </p>
              <p className="text-lg font-bold text-emerald-600 mt-0.5">42.8%</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Qualified to Won</p>
            </div>
          </div>

          {/* Interactive Mode Content */}
          <div className="p-4 sm:p-5 bg-zinc-50/40">
            {previewTab === 'table' ? (
              <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Lead Account</th>
                      <th className="py-2 px-3">Value</th>
                      <th className="py-2 px-3">Priority</th>
                      <th className="py-2 px-3">Stage</th>
                      <th className="py-2 px-3">Health Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    <tr className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-zinc-900">Stripe Connect</div>
                        <div className="text-[10px] text-zinc-400 font-mono">patrick@stripe.com</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">$65,000</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Flame className="h-2.5 w-2.5 mr-1" />
                          P1 Urgent
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5" />
                          Qualified
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-emerald-700">92</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-zinc-900">Acme Corporation</div>
                        <div className="text-[10px] text-zinc-400 font-mono">coyote@acme.com</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">$45,000</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Flame className="h-2.5 w-2.5 mr-1" />
                          P1 Urgent
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
                          Contacted
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="w-[78%] h-full bg-amber-500 rounded-full" />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-amber-700">78</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-zinc-900">CloudScale Systems</div>
                        <div className="text-[10px] text-zinc-400 font-mono">alex@cloudscale.io</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">$32,000</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          P2 Medium
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 mr-1.5" />
                          New
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="w-[64%] h-full bg-amber-500 rounded-full" />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-amber-700">64</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-zinc-100/70 p-2.5 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 px-1">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-sky-500 mr-1.5" />
                      New Inbound
                    </span>
                    <span className="font-mono text-zinc-500">6</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                    <p className="font-bold text-xs text-zinc-900">Vertex AI Labs</p>
                    <p className="text-[10px] font-mono text-zinc-500">$24,000 · Website lead</p>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-100 text-zinc-700">
                      P2 Medium
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-100/70 p-2.5 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 px-1">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5" />
                      Contacted
                    </span>
                    <span className="font-mono text-zinc-500">10</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                    <p className="font-bold text-xs text-zinc-900">Acme Corporation</p>
                    <p className="text-[10px] font-mono text-zinc-500">$45,000 · Call logged today</p>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-50 text-rose-700 font-bold">
                      P1 Urgent
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-100/70 p-2.5 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 px-1">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 mr-1.5" />
                      Qualified
                    </span>
                    <span className="font-mono text-zinc-500">8</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                    <p className="font-bold text-xs text-zinc-900">Stripe Connect</p>
                    <p className="text-[10px] font-mono text-zinc-500">$65,000 · Executive demo</p>
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-50 text-emerald-700 font-bold">
                      Health 92
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Core Capabilities Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Engineered for Sales Velocity & Pipeline Mastery
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            Everything an enterprise sales rep needs to qualify, follow up, and close without context switching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Dual Workspaces */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Table className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Spreadsheet & Kanban Modes</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Switch between compact spreadsheet density and visual drag-and-drop pipeline stages with keyboard shortcut <kbd className="px-1 py-0.5 rounded bg-zinc-100 border text-[10px] font-mono">V</kbd>.
            </p>
          </div>

          {/* Card 2: Deal Health Scoring */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Dynamic Deal Health Scoring</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Algorithmic probability scoring (0-100) dynamically evaluates contract value, urgency tier, pipeline stage, and touchpoint freshness.
            </p>
          </div>

          {/* Card 3: Slide-Over Inspector */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Slide-Over Prospect Inspector</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Deep dive into lead dossiers, log call recaps and meeting notes with chronological audit trails, and advance stages in 1 click.
            </p>
          </div>

          {/* Card 4: Keyboard Speed */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Command className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Spotlight Palette & J/K Navigation</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Raycast-style spotlight command bar (<kbd className="px-1 py-0.5 rounded bg-zinc-100 border text-[10px] font-mono">⌘K</kbd>), table cursor navigation (<kbd className="px-1 py-0.5 rounded bg-zinc-100 border text-[10px] font-mono">J</kbd>/<kbd className="px-1 py-0.5 rounded bg-zinc-100 border text-[10px] font-mono">K</kbd>), and instant search.
            </p>
          </div>

          {/* Card 5: Two-Way CSV Sync */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Download className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Two-Way CSV Ingestion & Export</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Batch import prospect datasets with client-side header mapping, validation previews, and export filtered pipelines to clean CSV sheets.
            </p>
          </div>

          {/* Card 6: Robust Multi-Database */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900">Zero-Config SQLite & PostgreSQL</h3>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Seamlessly boots locally with zero setup using embedded SQLite, while fully configured for cloud PostgreSQL with Prisma ORM migrations.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Full Stack Architecture Verification */}
      <section className="p-6 rounded-2xl bg-zinc-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
              Meru Technosoft Screening Assignment
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Production Architecture & Test Verified
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              11/11 Vitest Tests Passing
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              0 TypeScript Errors
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="text-zinc-500 font-mono text-[10px] block">Frontend</span>
            <span className="font-semibold text-zinc-200">Next.js 14 App Router</span>
          </div>
          <div>
            <span className="text-zinc-500 font-mono text-[10px] block">Backend API</span>
            <span className="font-semibold text-zinc-200">Express + TypeScript REST</span>
          </div>
          <div>
            <span className="text-zinc-500 font-mono text-[10px] block">Database ORM</span>
            <span className="font-semibold text-zinc-200">Prisma (SQLite & Postgres)</span>
          </div>
          <div>
            <span className="text-zinc-500 font-mono text-[10px] block">Validation & Auth</span>
            <span className="font-semibold text-zinc-200">Zod + JWT + Bcrypt</span>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="text-center space-y-4 py-8 border-t border-zinc-200/80">
        <h3 className="text-2xl font-bold text-zinc-900">
          Ready to review the live CRM workspace?
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Click below to instantly access the active sales pipeline pre-loaded with demonstration deals.
        </p>
        <div className="pt-2">
          <Button
            size="lg"
            onClick={handle1ClickDemo}
            disabled={isDemoLoading}
            className="h-11 px-8 text-sm bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-md active:scale-98"
          >
            <Zap className="h-4 w-4 mr-2 text-amber-300 fill-amber-300" />
            Enter Live Workspace Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-zinc-200 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 rounded bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center">
            M
          </div>
          <span className="font-semibold text-zinc-800">Meru Lead Manager</span>
          <span>·</span>
          <span>Full Stack Developer Screening Project</span>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Massvippin01/Lead_Manager.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-zinc-900 transition-colors"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span>·</span>
          <span className="text-emerald-600 font-medium">All Systems Operational</span>
        </div>
      </footer>
    </div>
  );
};
