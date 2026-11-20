'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadStatus, Pagination, LeadQueryParams } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Building2,
  Calendar,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserX,
  Copy,
  Check,
  ChevronRight as ArrowRightIcon,
  CheckSquare,
  Square,
} from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  pagination: Pagination | null;
  isLoading: boolean;
  density: 'comfortable' | 'compact';
  queryParams: LeadQueryParams;
  selectedLeadIds: string[];
  onToggleSelectLead: (leadId: string) => void;
  onToggleSelectAll: () => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onQuickStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onBulkStatusChange: (newStatus: LeadStatus) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onSelectLead: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const statusStyles: Record<
  LeadStatus,
  { label: string; dot: string; badge: string }
> = {
  NEW: {
    label: 'New',
    dot: 'bg-sky-500',
    badge: 'bg-zinc-50 text-zinc-700 border-zinc-200/80',
  },
  CONTACTED: {
    label: 'Contacted',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50/70 text-amber-800 border-amber-200/60',
  },
  QUALIFIED: {
    label: 'Qualified',
    dot: 'bg-emerald-600',
    badge: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/60',
  },
  LOST: {
    label: 'Lost',
    dot: 'bg-zinc-400',
    badge: 'bg-zinc-100 text-zinc-600 border-zinc-200/80',
  },
};

const priorityBadges: Record<string, { label: string; dot: string; text: string }> = {
  HIGH: { label: 'P1', dot: 'bg-rose-600', text: 'text-rose-700' },
  MEDIUM: { label: 'P2', dot: 'bg-amber-500', text: 'text-amber-700' },
  LOW: { label: 'P3', dot: 'bg-zinc-400', text: 'text-zinc-600' },
};

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  pagination,
  isLoading,
  density,
  queryParams,
  selectedLeadIds,
  onToggleSelectLead,
  onToggleSelectAll,
  onPageChange,
  onLimitChange,
  onQuickStatusChange,
  onBulkStatusChange,
  onBulkDelete,
  onSelectLead,
  onEdit,
  onDelete,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEmail = (e: React.MouseEvent, email: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
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

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const allSelected = leads.length > 0 && selectedLeadIds.length === leads.length;
  const isCompact = density === 'compact';

  return (
    <div className="relative">
      <div className="bg-white border border-zinc-200/90 rounded-lg shadow-2xs overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/80 text-zinc-500 font-semibold text-[11px] uppercase tracking-wider">
                {/* Checkbox */}
                <th className="py-2.5 px-3 w-8 text-center">
                  <button
                    type="button"
                    onClick={onToggleSelectAll}
                    className="text-zinc-400 hover:text-zinc-800 transition-colors"
                  >
                    {allSelected ? (
                      <CheckSquare className="h-3.5 w-3.5 text-zinc-900" />
                    ) : (
                      <Square className="h-3.5 w-3.5" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Prospect</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Deal Value</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Pipeline Stage</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3 px-3 text-center">
                      <div className="h-3.5 w-3.5 bg-zinc-200 rounded mx-auto" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-8 bg-zinc-200 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-28 bg-zinc-200 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-24 bg-zinc-100 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-32 bg-zinc-100 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-16 bg-zinc-100 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-16 bg-zinc-100 rounded" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-5 w-20 bg-zinc-200 rounded-full" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 w-14 bg-zinc-100 rounded" />
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <div className="h-6 w-12 bg-zinc-100 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={10} className="py-14 text-center">
                    <div className="mx-auto h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2.5">
                      <UserX className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900">
                      No matching prospects
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5 max-w-sm mx-auto">
                      {queryParams.search || queryParams.status || queryParams.priority || queryParams.source
                        ? 'Try clearing active filters or presets to view leads.'
                        : 'No leads in pipeline. Create or import your first prospect.'}
                    </p>
                  </td>
                </tr>
              ) : (
                // Leads Rows
                leads.map((lead) => {
                  const statusConfig = statusStyles[lead.status] || {
                    label: lead.status,
                    dot: 'bg-zinc-400',
                    badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
                  };
                  const prioConfig = priorityBadges[lead.priority] || priorityBadges.MEDIUM;
                  const isSelected = selectedLeadIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className={`group cursor-pointer transition-colors ${
                        isSelected ? 'bg-zinc-100/70' : 'hover:bg-zinc-50/70'
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 text-center`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelectLead(lead.id);
                        }}
                      >
                        <button
                          type="button"
                          className="text-zinc-400 hover:text-zinc-800 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-3.5 w-3.5 text-zinc-900" />
                          ) : (
                            <Square className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>

                      {/* Priority */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 whitespace-nowrap`}>
                        <span className={`inline-flex items-center space-x-1 text-[11px] font-mono font-bold ${prioConfig.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${prioConfig.dot}`} />
                          <span>{prioConfig.label}</span>
                        </span>
                      </td>

                      {/* Prospect Name & Optional Avatar */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3`}>
                        <div className="flex items-center space-x-2">
                          {!isCompact && (
                            <div className="h-6 w-6 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              {getInitials(lead.name)}
                            </div>
                          )}
                          <span className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                            {lead.name}
                          </span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 font-medium text-zinc-700 truncate`}>
                        {lead.company}
                      </td>

                      {/* Contact Info */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3`}>
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-zinc-700 hover:text-zinc-900 truncate max-w-[160px]"
                          >
                            {lead.email}
                          </a>
                          <button
                            type="button"
                            onClick={(e) => copyEmail(e, lead.email, lead.id)}
                            className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded"
                            title="Copy email"
                          >
                            {copiedId === lead.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Deal Value */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 font-mono tabular-numbers font-medium text-zinc-800`}>
                        {lead.value > 0 ? (
                          formatCurrency(lead.value)
                        ) : (
                          <span className="text-zinc-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Source Channel */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3`}>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-600 bg-zinc-100 border border-zinc-200/60">
                          {lead.source}
                        </span>
                      </td>

                      {/* Pipeline Stage Quick Switcher */}
                      <td
                        className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-flex items-center">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              onQuickStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={`cursor-pointer appearance-none rounded-full pl-5 pr-2.5 py-0.5 text-[11px] font-semibold border transition-all focus:outline-none focus:ring-1 focus:ring-zinc-900 ${statusConfig.badge}`}
                            title="Click to advance stage"
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="LOST">Lost</option>
                          </select>
                          <span
                            className={`absolute left-2 h-1.5 w-1.5 rounded-full pointer-events-none ${statusConfig.dot}`}
                          />
                        </div>
                      </td>

                      {/* Date Added */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 font-mono text-[11px] text-zinc-500 whitespace-nowrap tabular-numbers`}>
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Actions */}
                      <td
                        className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 sm:px-4 text-right whitespace-nowrap`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(lead)}
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-900"
                            title="Edit Lead"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(lead)}
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-rose-600"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectLead(lead)}
                            className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-900"
                            title="Open Drawer"
                          >
                            <ArrowRightIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-200/80 px-3 sm:px-4 py-2 gap-2 bg-zinc-50/50">
            <div className="flex items-center space-x-3 text-xs text-zinc-500 font-mono">
              <span>
                Showing{' '}
                <span className="font-bold text-zinc-800 tabular-numbers">
                  {leads.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-bold text-zinc-800 tabular-numbers">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-bold text-zinc-800 tabular-numbers">
                  {pagination.total}
                </span>
              </span>

              <div className="flex items-center space-x-1 pl-2 border-l border-zinc-200">
                <span>Rows:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="h-6 text-xs rounded border border-zinc-200 bg-white px-1 text-zinc-700 font-medium focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-xs text-zinc-400 tabular-numbers mr-1">
                {pagination.page} / {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev || isLoading}
                className="h-6 px-2 text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-0.5" />
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNext || isLoading}
                className="h-6 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Dock */}
      <AnimatePresence>
        {selectedLeadIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-3 text-xs border border-zinc-800"
          >
            <span className="font-semibold text-zinc-200 pr-2 border-r border-zinc-700 font-mono text-[11px]">
              {selectedLeadIds.length} selected
            </span>

            <div className="flex items-center space-x-1.5">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onBulkStatusChange('CONTACTED')}
                className="h-6 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-none px-2"
              >
                Mark Contacted
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => onBulkStatusChange('QUALIFIED')}
                className="h-6 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-none px-2"
              >
                Mark Qualified
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={onBulkDelete}
                className="h-6 text-[11px] bg-rose-600 hover:bg-rose-700 text-white border-none px-2"
              >
                Delete
              </Button>
            </div>

            <button
              type="button"
              onClick={onToggleSelectAll}
              className="text-zinc-400 hover:text-white pl-2 text-xs font-semibold"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
