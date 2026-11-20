'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadStatus } from '@/types';
import { Button } from '@/components/ui/button';
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
  ExternalLink,
  Clock,
  Tag,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface LeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
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
  onEdit,
  onDelete,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !lead) return null;

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-white border-l border-slate-200/90 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Lead Inspector
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card */}
              <div className="flex items-start space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {getInitials(lead.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 truncate">
                    {lead.name}
                  </h3>
                  <div className="flex items-center text-sm font-medium text-slate-600 mt-0.5">
                    <Building2 className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                  <div className="inline-flex items-center space-x-1.5 mt-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                    <Tag className="h-3 w-3 text-slate-500" />
                    <span>Source: {lead.source.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Pipeline Stage Stepper */}
              <div className="border border-slate-200/90 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-700">
                    Current Stage
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      lead.status === 'NEW'
                        ? 'bg-sky-100 text-sky-800'
                        : lead.status === 'CONTACTED'
                        ? 'bg-amber-100 text-amber-800'
                        : lead.status === 'QUALIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>

                {/* Interactive Stage Progress Bar */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {statusStages.map((stage) => {
                    const isCurrent = lead.status === stage.key;
                    return (
                      <button
                        key={stage.key}
                        onClick={() => onStatusChange(lead.id, stage.key)}
                        className={`text-xs font-medium py-1.5 px-2 rounded-lg border text-center transition-all ${
                          isCurrent
                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
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
                    className="w-full text-xs text-rose-600 hover:text-rose-700 font-medium py-1 text-center hover:bg-rose-50 rounded transition-colors"
                  >
                    Mark as Lost Opportunity
                  </button>
                ) : (
                  <button
                    onClick={() => onStatusChange(lead.id, 'NEW')}
                    className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1 text-center hover:bg-blue-50 rounded transition-colors"
                  >
                    Reopen Lead to New
                  </button>
                )}
              </div>

              {/* Contact Details List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Verified Contact Details
                </h4>

                {/* Email Item */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">Work Email</p>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors truncate block"
                      >
                        {lead.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(lead.email, 'email')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Phone Item */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">Phone</p>
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors truncate block"
                      >
                        {lead.phone}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(lead.phone, 'phone')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2"
                    title="Copy Phone"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Metadata Record */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-400">
                    <Clock className="h-3.5 w-3.5 mr-1" /> Created
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Lead ID
                  </span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {lead.id.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(lead);
                }}
                className="text-xs"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onEdit(lead);
                  }}
                  className="text-xs"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit Details
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
