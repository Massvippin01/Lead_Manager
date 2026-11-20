'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadPriority, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Check,
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

const statusStages: { key: LeadStatus; label: string }[] = [
  { key: 'NEW', label: '1. New' },
  { key: 'CONTACTED', label: '2. Contacted' },
  { key: 'QUALIFIED', label: '3. Qualified' },
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
          className="fixed inset-0 bg-zinc-950/30 backdrop-blur-2xs transition-opacity"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="w-screen max-w-md bg-white border-l border-zinc-200/90 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Prospect Inspector
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Profile Card (Monochrome Solid) */}
              <div className="flex items-start space-x-3.5">
                <div className="h-11 w-11 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(lead.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-zinc-900 truncate">
                    {lead.name}
                  </h3>
                  <div className="flex items-center text-xs font-medium text-zinc-600 mt-0.5">
                    <Building2 className="h-3 w-3 mr-1 text-zinc-400" />
                    <span className="truncate">{lead.company}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 mt-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-mono border border-zinc-200">
                      {lead.source}
                    </span>

                    {lead.value > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-900 text-[10px] font-mono font-bold border border-zinc-200 tabular-numbers">
                        {formatCurrency(lead.value)}
                      </span>
                    )}

                    {/* Priority Indicator & Selector */}
                    <select
                      value={lead.priority}
                      onChange={(e) => onPriorityChange(lead.id, e.target.value as LeadPriority)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-zinc-200 bg-white text-zinc-800 cursor-pointer focus:outline-none"
                    >
                      <option value="HIGH">P1 - High</option>
                      <option value="MEDIUM">P2 - Medium</option>
                      <option value="LOW">P3 - Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pipeline Stage Progression */}
              <div className="border border-zinc-200/90 rounded-lg p-3 bg-zinc-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide font-mono">
                    Pipeline Stage
                  </span>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      lead.status === 'NEW'
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

                <div className="grid grid-cols-3 gap-1 mb-2">
                  {statusStages.map((stage) => {
                    const isCurrent = lead.status === stage.key;
                    return (
                      <button
                        key={stage.key}
                        onClick={() => onStatusChange(lead.id, stage.key)}
                        className={`text-xs font-medium py-1 px-1.5 rounded border text-center transition-all ${
                          isCurrent
                            ? 'bg-zinc-900 border-zinc-900 text-white font-semibold shadow-2xs'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>

                {lead.status !== 'LOST' ? (
                  <button
                    onClick={() => onStatusChange(lead.id, 'LOST')}
                    className="w-full text-xs text-rose-600 hover:text-rose-700 font-medium py-0.5 text-center hover:bg-rose-50 rounded transition-colors"
                  >
                    Mark as Lost Opportunity
                  </button>
                ) : (
                  <button
                    onClick={() => onStatusChange(lead.id, 'NEW')}
                    className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-0.5 text-center hover:bg-blue-50 rounded transition-colors"
                  >
                    Reopen to New Inquiry
                  </button>
                )}
              </div>

              {/* Verified Contact Details */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Contact Information
                </h4>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200/80 bg-white">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-400 font-medium font-mono">Email</p>
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
                      <p className="text-[10px] text-zinc-400 font-medium font-mono">Phone</p>
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

              {/* Interaction Timeline & Logging */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                    Activity & Audit Log ({lead.notes?.length || 0})
                  </h4>

                  {/* Note vs Call Switcher */}
                  <div className="flex items-center border border-zinc-200 rounded p-0.5 text-[10px] bg-zinc-50">
                    <button
                      type="button"
                      onClick={() => setActivityType('NOTE')}
                      className={`px-1.5 py-0.5 rounded font-medium ${
                        activityType === 'NOTE' ? 'bg-white text-zinc-900 font-bold shadow-2xs' : 'text-zinc-500'
                      }`}
                    >
                      Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivityType('CALL')}
                      className={`px-1.5 py-0.5 rounded font-medium ${
                        activityType === 'CALL' ? 'bg-white text-zinc-900 font-bold shadow-2xs' : 'text-zinc-500'
                      }`}
                    >
                      Call
                    </button>
                  </div>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleNoteSubmit} className="flex gap-1.5">
                  <Input
                    type="text"
                    placeholder={activityType === 'NOTE' ? 'Log an account note...' : 'Log a call summary...'}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-xs h-7 flex-1"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingNote || !newNote.trim()}
                    className="h-7 text-xs px-2.5"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Log
                  </Button>
                </form>

                {/* Timeline Feed */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                  {lead.notes && lead.notes.length > 0 ? (
                    lead.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700"
                      >
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400 mb-1">
                          {note.type === 'CALL' ? (
                            <span className="flex items-center text-amber-700 font-semibold">
                              <PhoneCall className="h-3 w-3 mr-1" /> Call Log
                            </span>
                          ) : note.type === 'STAGE_CHANGE' ? (
                            <span className="flex items-center text-blue-700 font-semibold">
                              <ArrowRightCircle className="h-3 w-3 mr-1" /> Audit Event
                            </span>
                          ) : (
                            <span className="flex items-center text-zinc-600 font-semibold">
                              <MessageSquare className="h-3 w-3 mr-1" /> Note
                            </span>
                          )}
                          <span>•</span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="leading-relaxed text-zinc-800">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic py-2">
                      No interactions recorded yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Metadata Record */}
              <div className="border-t border-zinc-100 pt-2.5 space-y-1.5 text-[11px] text-zinc-400 font-mono">
                <div className="flex items-center justify-between">
                  <span>Created:</span>
                  <span className="text-zinc-600">{formatDate(lead.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ID:</span>
                  <span className="text-zinc-600">{lead.id.substring(0, 8)}...</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
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
                  Edit
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
