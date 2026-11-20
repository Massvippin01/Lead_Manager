'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadStatus, Pagination, LeadQueryParams } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
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
} from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  pagination: Pagination | null;
  isLoading: boolean;
  queryParams: LeadQueryParams;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onQuickStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
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
    badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
  },
  CONTACTED: {
    label: 'Contacted',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
  QUALIFIED: {
    label: 'Qualified',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  LOST: {
    label: 'Lost',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
};

const sourceLabels: Record<string, string> = {
  WEBSITE: 'Website',
  REFERRAL: 'Referral',
  COLD_OUTREACH: 'Cold Outreach',
  LINKEDIN: 'LinkedIn',
  ADVERTISEMENT: 'Ad Campaign',
  EVENT: 'Conference',
  OTHER: 'Direct',
};

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  pagination,
  isLoading,
  queryParams,
  onPageChange,
  onLimitChange,
  onQuickStatusChange,
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

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Prospect / Organization</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Acquisition</th>
              <th className="py-3 px-4">Pipeline Stage</th>
              <th className="py-3 px-4">Added</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-200 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-36 bg-slate-200 rounded mb-1" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-20 bg-slate-100 rounded-md" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-20 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="h-7 w-16 bg-slate-100 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <UserX className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">
                    No matching prospects
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {queryParams.search || queryParams.status || queryParams.source
                      ? 'Adjust your search queries or filter constraints above to view leads.'
                      : 'You currently have no recorded leads. Capture your first prospect now.'}
                  </p>
                </td>
              </tr>
            ) : (
              // Leads List
              leads.map((lead) => {
                const statusConfig = statusStyles[lead.status] || {
                  label: lead.status,
                  dot: 'bg-slate-400',
                  badge: 'bg-slate-100 text-slate-700 border-slate-200',
                };

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Prospect Name & Avatar */}
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block truncate">
                            {lead.name}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center truncate">
                            <Building2 className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
                            {lead.company}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info with Copy Email */}
                    <td className="py-3 px-4">
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`mailto:${lead.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-slate-700 hover:text-blue-600 truncate max-w-[180px] inline-block"
                          >
                            {lead.email}
                          </a>
                          <button
                            type="button"
                            onClick={(e) => copyEmail(e, lead.email, lead.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                            title="Copy email"
                          >
                            {copiedId === lead.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {lead.phone}
                        </div>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                        {sourceLabels[lead.source] || lead.source}
                      </span>
                    </td>

                    {/* Pipeline Stage Quick Switcher */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-flex items-center">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            onQuickStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className={`cursor-pointer appearance-none rounded-full pl-6 pr-3 py-1 text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${statusConfig.badge}`}
                          title="Click to advance pipeline stage"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="LOST">Lost</option>
                        </select>
                        <span
                          className={`absolute left-2.5 h-1.5 w-1.5 rounded-full pointer-events-none ${statusConfig.dot}`}
                        />
                      </div>
                    </td>

                    {/* Date Added */}
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap tabular-numbers">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-4 sm:px-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(lead)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800"
                          title="Edit Lead"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(lead)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectLead(lead)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800"
                          title="View Inspector"
                        >
                          <ArrowRightIcon className="h-3.5 w-3.5" />
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
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 px-4 sm:px-6 py-3 gap-3 bg-slate-50/40">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>
              Showing{' '}
              <span className="font-semibold text-slate-800 tabular-numbers">
                {leads.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-800 tabular-numbers">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-800 tabular-numbers">
                {pagination.total}
              </span>{' '}
              leads
            </span>

            <div className="flex items-center space-x-1.5 pl-3 border-l border-slate-200">
              <span>Show</span>
              <select
                value={pagination.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="h-7 text-xs rounded border border-slate-200 bg-white px-1.5 text-slate-700 font-medium focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 tabular-numbers mr-1">
              Page {pagination.page} / {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || isLoading}
              className="h-7 px-2.5 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || isLoading}
              className="h-7 px-2.5 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
