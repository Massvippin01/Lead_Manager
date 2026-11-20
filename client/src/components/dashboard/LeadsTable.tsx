'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadStatus, Pagination, LeadQueryParams } from '@/types';
import { Badge } from '@/components/ui/badge';
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
  ExternalLink,
} from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  pagination: Pagination | null;
  isLoading: boolean;
  queryParams: LeadQueryParams;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onQuickStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const statusBadgeMap: Record<LeadStatus, { label: string; variant: 'new' | 'contacted' | 'qualified' | 'lost' }> = {
  NEW: { label: 'New', variant: 'new' },
  CONTACTED: { label: 'Contacted', variant: 'contacted' },
  QUALIFIED: { label: 'Qualified', variant: 'qualified' },
  LOST: { label: 'Lost', variant: 'lost' },
};

const sourceLabels: Record<string, string> = {
  WEBSITE: 'Website',
  REFERRAL: 'Referral',
  COLD_OUTREACH: 'Cold Outreach',
  LINKEDIN: 'LinkedIn',
  ADVERTISEMENT: 'Advertisement',
  EVENT: 'Event',
  OTHER: 'Other',
};

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  pagination,
  isLoading,
  queryParams,
  onPageChange,
  onLimitChange,
  onQuickStatusChange,
  onEdit,
  onDelete,
}) => {
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
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Container with horizontal scroll for responsiveness */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold text-xs tracking-wider uppercase">
              <th className="py-3.5 px-4 sm:px-6">Lead / Contact</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date Added</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-44 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-20 bg-slate-100 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="h-8 w-16 bg-slate-200 rounded ml-auto" />
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
                  <h4 className="text-base font-semibold text-slate-900">No leads found</h4>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    {queryParams.search || queryParams.status || queryParams.source
                      ? 'No leads match your current search or filter criteria. Try resetting filters.'
                      : 'You have not added any leads yet. Click "Add Lead" to capture your first prospect!'}
                  </p>
                </td>
              </tr>
            ) : (
              // Leads List with Framer Motion Row transitions
              <AnimatePresence mode="popLayout">
                {leads.map((lead) => {
                  const statusInfo = statusBadgeMap[lead.status] || {
                    label: lead.status,
                    variant: 'default',
                  };

                  return (
                    <motion.tr
                      key={lead.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="group hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Name & Contact Info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {lead.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex items-center hover:text-blue-600 transition-colors"
                            title="Send email"
                          >
                            <Mail className="h-3 w-3 mr-1 text-slate-400" />
                            {lead.email}
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center hover:text-blue-600 transition-colors"
                            title="Call phone"
                          >
                            <Phone className="h-3 w-3 mr-1 text-slate-400" />
                            {lead.phone}
                          </a>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <div className="inline-flex items-center">
                          <Building2 className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                          {lead.company}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {sourceLabels[lead.source] || lead.source}
                        </span>
                      </td>

                      {/* Status & Quick Status Changer */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              onQuickStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={`cursor-pointer appearance-none rounded-full px-3 py-1 text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                              lead.status === 'NEW'
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                : lead.status === 'CONTACTED'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : lead.status === 'QUALIFIED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Click to quickly update status"
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="LOST">Lost</option>
                          </select>
                        </div>
                      </td>

                      {/* Date Added */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="inline-flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                          {formatDate(lead.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(lead)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit Lead"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(lead)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 px-4 sm:px-6 py-3.5 gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {leads.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-800">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-semibold text-slate-800">{pagination.total}</span> leads
            </span>

            <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
              <span>Per page:</span>
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
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || isLoading}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || isLoading}
              className="h-8 px-2.5"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
