'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadPriority, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Pencil,
  Trash2,
  Clock,
  ShieldCheck,
  MessageSquare,
  PhoneCall,
  ArrowRightCircle,
  Send,
  Flame,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  DollarSign,
  Share2,
  Activity,
  User,
} from 'lucide-react';

interface LeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onPriorityChange: (leadId: string, newPriority: LeadPriority) => Promise<void>;
  onAddNote: (leadId: string, content: string, type: 'NOTE' | 'CALL') => Promise<void>;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const statusStages: { key: LeadStatus; label: string; step: number }[] = [
  { key: 'NEW', label: '1. New Inquiry', step: 1 },
  { key: 'CONTACTED', label: '2. In Dialogue', step: 2 },
  { key: 'QUALIFIED', label: '3. Qualified Deal', step: 3 },
];

export const LeadDrawer: React.FC<LeadDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onPriorityChange,
  onAddNote,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [activityType, setActivityType] = useState<'NOTE' | 'CALL'>('NOTE');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  // Compute CRM Deal Health Score (0-100) & Win Probability
  const calculateDealScore = (l: Lead) => {
    let score = 20;
    if (l.status === 'QUALIFIED') score += 40;
    else if (l.status === 'CONTACTED') score += 25;
    else if (l.status === 'NEW') score += 10;
    else if (l.status === 'LOST') return { score: 10, probability: '5%', label: 'Closed / Lost', color: 'text-zinc-500 bg-zinc-100' };

    if (l.priority === 'HIGH') score += 25;
    else if (l.priority === 'MEDIUM') score += 15;
    else score += 5;

    if (l.value >= 25000) score += 15;
    else if (l.value > 0) score += 10;

    if (l.notes && l.notes.length > 0) score += 5;

    score = Math.min(score, 99);
    if (score >= 80) return { score, probability: '85%', label: 'High Potential Deal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 50) return { score, probability: '55%', label: 'Active Pipeline Engagement', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { score, probability: '30%', label: 'Early Discovery Stage', color: 'text-sky-700 bg-sky-50 border-sky-200' };
  };

  const handleCopyCard = () => {
    if (!lead) return;
    const cardText = `Lead: ${lead.name}\nCompany: ${lead.company}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nStage: ${lead.status}\nPriority: ${lead.priority}\nValue: $${lead.value.toLocaleString()}`;
    copyToClipboard(cardText, 'card');
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !lead) return;

    setIsSubmittingNote(true);
    try {
      await onAddNote(lead.id, newNote.trim(), activityType);
      setNewNote('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const dealHealth = lead ? calculateDealScore(lead) : null;
  const currentStep = lead?.status === 'LOST' ? 0 : lead?.status === 'QUALIFIED' ? 3 : lead?.status === 'CONTACTED' ? 2 : 1;

  return (
    <AnimatePresence>
      {isOpen && lead && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-lg bg-white border-l border-zinc-200/90 shadow-2xl flex flex-col"
            >
              {/* Header Bar */}
              <div className="px-5 py-3 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/70">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500 font-semibold">
                    <span>PROSPECT</span>
                    <span className="text-zinc-300">/</span>
                    <span className="text-zinc-800 font-bold">{lead.id.substring(0, 8)}</span>
                  </div>

                  {dealHealth && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${dealHealth.color}`}>
                      Health {dealHealth.score}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="rounded p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                    title="Copy Prospect Summary"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
                    title="Close Inspector (Esc)"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Inspector Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Hero Prospect Banner */}
                <div className="flex items-start space-x-3.5 pb-2">
                  <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 ring-2 ring-zinc-200">
                    {getInitials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-lg font-bold text-zinc-900 truncate">
                        {lead.name}
                      </h3>
                      <span title="Verified prospect profile">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-medium text-zinc-600 mt-0.5">
                      <Building2 className="h-3.5 w-3.5 mr-1 text-zinc-400 shrink-0" />
                      <span className="truncate">{lead.company}</span>
                    </div>

                    {/* Metadata Tags Pill Cluster */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-mono font-semibold border border-zinc-200">
                        {lead.source}
                      </span>

                      {/* Priority Selector */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-all hover:ring-1 hover:ring-zinc-300 focus:outline-none ${
                              lead.priority === 'HIGH'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : lead.priority === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                            }`}
                            title="Click to update priority"
                          >
                            <span>
                              {lead.priority === 'HIGH'
                                ? 'P1 - High'
                                : lead.priority === 'MEDIUM'
                                ? 'P2 - Med'
                                : 'P3 - Low'}
                            </span>
                            <ChevronDown className="h-3 w-3 opacity-60" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-36">
                          <DropdownMenuLabel>Priority Ranking</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onPriorityChange(lead.id, 'HIGH')}
                            className="flex items-center justify-between text-xs font-mono text-rose-700 hover:bg-rose-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                              <span>P1 - High</span>
                            </div>
                            {lead.priority === 'HIGH' && <Check className="h-3.5 w-3.5 text-rose-700" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onPriorityChange(lead.id, 'MEDIUM')}
                            className="flex items-center justify-between text-xs font-mono text-amber-700 hover:bg-amber-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              <span>P2 - Medium</span>
                            </div>
                            {lead.priority === 'MEDIUM' && <Check className="h-3.5 w-3.5 text-amber-700" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onPriorityChange(lead.id, 'LOW')}
                            className="flex items-center justify-between text-xs font-mono text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-zinc-400" />
                              <span>P3 - Low</span>
                            </div>
                            {lead.priority === 'LOW' && <Check className="h-3.5 w-3.5 text-zinc-600" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Tactile Outreach Quick Bar */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Mail className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Send Email</span>
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Phone className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Call Direct</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    {copiedField === 'card' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-zinc-500" />
                    )}
                    <span>{copiedField === 'card' ? 'Copied' : 'Copy Card'}</span>
                  </button>
                </div>

                {/* Interactive Opportunity Financial Cards */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-50 border border-zinc-200 rounded-lg p-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                      Deal Value
                    </span>
                    <span className="text-sm font-bold text-zinc-900 font-mono tabular-numbers mt-0.5 block">
                      {lead.value > 0 ? formatCurrency(lead.value) : '$0'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                      Win Probability
                    </span>
                    <span className="text-sm font-bold text-emerald-700 font-mono tabular-numbers mt-0.5 block">
                      {dealHealth?.probability}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                      Account Score
                    </span>
                    <span className="text-sm font-bold text-zinc-900 font-mono tabular-numbers mt-0.5 block">
                      {dealHealth?.score}/100
                    </span>
                  </div>
                </div>

                {/* Visual Pipeline Stage Stepper */}
                <div className="border border-zinc-200/90 rounded-lg p-3 bg-zinc-50/60 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide font-mono flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-zinc-400" />
                      Stage Progression
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${lead.status === 'NEW'
                        ? 'bg-sky-50 text-sky-800 border border-sky-200'
                        : lead.status === 'CONTACTED'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : lead.status === 'QUALIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  {/* Connected Step Track */}
                  <div className="relative flex items-center justify-between mb-3 px-3">
                    {/* Background Progress Bar */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-zinc-200 z-0" />
                    <div
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-zinc-900 z-0 transition-all duration-300"
                      style={{
                        width:
                          currentStep === 1
                            ? '0%'
                            : currentStep === 2
                              ? '50%'
                              : currentStep === 3
                                ? '100%'
                                : '0%',
                      }}
                    />

                    {statusStages.map((stage) => {
                      const isCompleted = currentStep >= stage.step;
                      const isCurrent = lead.status === stage.key;

                      return (
                        <button
                          key={stage.key}
                          type="button"
                          onClick={() => onStatusChange(lead.id, stage.key)}
                          className="relative z-10 flex flex-col items-center group cursor-pointer"
                        >
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isCurrent
                              ? 'bg-zinc-900 text-white ring-4 ring-zinc-200 shadow-xs scale-110'
                              : isCompleted
                                ? 'bg-zinc-900 text-white'
                                : 'bg-white border-2 border-zinc-300 text-zinc-500 hover:border-zinc-500'
                              }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              stage.step
                            )}
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-semibold transition-colors ${isCurrent ? 'text-zinc-900 font-bold' : 'text-zinc-500'
                              }`}
                          >
                            {stage.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {lead.status !== 'LOST' ? (
                    <button
                      type="button"
                      onClick={() => onStatusChange(lead.id, 'LOST')}
                      className="w-full text-xs text-rose-600 hover:text-rose-700 font-medium py-1 text-center hover:bg-rose-50 rounded transition-colors"
                    >
                      Mark as Closed / Lost Opportunity
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStatusChange(lead.id, 'NEW')}
                      className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 text-center hover:bg-blue-50 rounded transition-colors"
                    >
                      Reopen Opportunity to New Inquiry
                    </button>
                  )}
                </div>

                {/* Tab Switcher: Overview vs Activity Timeline */}
                <div className="border-b border-zinc-200 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 text-xs font-semibold transition-all border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-zinc-900 text-zinc-900'
                        : 'border-transparent text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    Account Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('timeline')}
                    className={`pb-2 text-xs font-semibold transition-all border-b-2 flex items-center space-x-1.5 ${
                      activeTab === 'timeline'
                        ? 'border-zinc-900 text-zinc-900'
                        : 'border-transparent text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    <span>Timeline & Notes</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                      {lead.notes?.length || 0}
                    </span>
                  </button>
                </div>

                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    {/* Contact Information Cards */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                        Contact Information
                      </h4>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200/80 bg-white">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-zinc-400 font-medium font-mono">Email Address</p>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-xs font-semibold text-zinc-900 hover:underline truncate block"
                            >
                              {lead.email}
                            </a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(lead.email, 'email')}
                          className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors ml-2"
                          title="Copy Email"
                        >
                          {copiedField === 'email' ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200/80 bg-white">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-zinc-400 font-medium font-mono">Phone Number</p>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-xs font-semibold text-zinc-900 hover:underline truncate block font-mono"
                            >
                              {lead.phone}
                            </a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(lead.phone, 'phone')}
                          className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors ml-2"
                          title="Copy Phone"
                        >
                          {copiedField === 'phone' ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Metadata Record */}
                    <div className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/50 space-y-2 text-[11px] text-zinc-500 font-mono">
                      <div className="flex items-center justify-between">
                        <span>Lead Record ID:</span>
                        <span className="text-zinc-700 font-bold">{lead.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Created Date:</span>
                        <span className="text-zinc-700">{formatDate(lead.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Lead Acquisition Channel:</span>
                        <span className="text-zinc-700 font-semibold">{lead.source}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Activity Timeline & Interaction Logger */}
                {activeTab === 'timeline' && (
                  <div className="space-y-3">
                    {/* Add Interaction Log Box */}
                    <div className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-zinc-700 font-mono uppercase">
                          Record Activity
                        </span>

                        <div className="flex items-center border border-zinc-200 rounded p-0.5 text-[10px] bg-white">
                          <button
                            type="button"
                            onClick={() => setActivityType('NOTE')}
                            className={`px-2 py-0.5 rounded font-medium transition-colors ${
                              activityType === 'NOTE' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                          >
                            Note
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivityType('CALL')}
                            className={`px-2 py-0.5 rounded font-medium transition-colors ${
                              activityType === 'CALL' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                          >
                            Call Log
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleNoteSubmit} className="flex gap-1.5">
                        <Input
                          type="text"
                          placeholder={activityType === 'NOTE' ? 'Log internal observation or meeting note...' : 'Log phone call outcome & follow-up...'}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="text-xs h-8 flex-1 bg-white"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isSubmittingNote || !newNote.trim()}
                          className="h-8 text-xs px-3 bg-zinc-900 hover:bg-zinc-800 text-white"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Log
                        </Button>
                      </form>
                    </div>

                    {/* Timeline Feed */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                      {lead.notes && lead.notes.length > 0 ? (
                        lead.notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 shadow-2xs"
                          >
                            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400 mb-1">
                              {note.type === 'CALL' ? (
                                <span className="flex items-center text-amber-700 font-bold bg-amber-50 px-1 rounded border border-amber-200/60">
                                  <PhoneCall className="h-2.5 w-2.5 mr-1" /> Call
                                </span>
                              ) : note.type === 'STAGE_CHANGE' ? (
                                <span className="flex items-center text-blue-700 font-bold bg-blue-50 px-1 rounded border border-blue-200/60">
                                  <ArrowRightCircle className="h-2.5 w-2.5 mr-1" /> Stage
                                </span>
                              ) : (
                                <span className="flex items-center text-zinc-700 font-bold bg-zinc-100 px-1 rounded border border-zinc-200/60">
                                  <MessageSquare className="h-2.5 w-2.5 mr-1" /> Note
                                </span>
                              )}
                              <span>•</span>
                              <span>{formatDate(note.createdAt)}</span>
                            </div>
                            <p className="leading-relaxed text-zinc-800 font-medium pl-0.5">
                              {note.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-zinc-400 font-mono border border-dashed border-zinc-200 rounded-lg">
                          No timeline entries recorded yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer Actions */}
              <div className="p-3 border-t border-zinc-200/80 bg-zinc-50/70 flex items-center justify-between gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(lead)}
                  className="text-xs h-7"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>

                <div className="flex items-center space-x-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="text-xs h-7"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onEdit(lead)}
                    className="text-xs h-7 bg-zinc-900 hover:bg-zinc-800 text-white"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
