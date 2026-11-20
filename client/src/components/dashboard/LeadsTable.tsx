'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, LeadStatus, Pagination, LeadQueryParams } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Mail,
  Building2,
  Calendar,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserX,
  Copy,
  Check,
  ChevronRight as ArrowRightIcon,
  CheckSquare,
  Square,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Command,
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
  onSortChange: (column: string) => void;
  onResetFilters: () => void;
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
  onSortChange,
  onResetFilters,
  onQuickStatusChange,
  onBulkStatusChange,
  onBulkDelete,
  onSelectLead,
  onEdit,
  onDelete,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Power user J/K keyboard navigation
  useEffect(() => {
    const handleTableKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev === null ? 0 : Math.min(leads.length - 1, prev + 1)));
      } else if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev === null ? 0 : Math.max(0, prev - 1)));
      } else if (e.key === 'Enter') {
        if (focusedIndex !== null && leads[focusedIndex]) {
          e.preventDefault();
          onSelectLead(leads[focusedIndex]);
        }
      } else if (e.key === 'x' || e.key === 'X') {
        if (focusedIndex !== null && leads[focusedIndex]) {
          e.preventDefault();
          onToggleSelectLead(leads[focusedIndex].id);
        }
      } else if (e.key === 'e' || e.key === 'E') {
        if (focusedIndex !== null && leads[focusedIndex]) {
          e.preventDefault();
          onEdit(leads[focusedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleTableKeys);
    return () => window.removeEventListener('keydown', handleTableKeys);
  }, [focusedIndex, leads, onSelectLead, onToggleSelectLead, onEdit]);

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

  // Compute CRM Deal Health Score (0-100)
  const getDealScore = (l: Lead) => {
    let score = 20;
    if (l.status === 'QUALIFIED') score += 40;
    else if (l.status === 'CONTACTED') score += 25;
    else if (l.status === 'NEW') score += 10;
    else if (l.status === 'LOST') return 10;

    if (l.priority === 'HIGH') score += 25;
    else if (l.priority === 'MEDIUM') score += 15;
    else score += 5;

    if (l.value >= 25000) score += 15;
    else if (l.value > 0) score += 10;

    return Math.min(score, 99);
  };

  const currentPageIds = leads.map((l) => l.id);
  const allSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedLeadIds.includes(id));
  const someSelected =
    currentPageIds.some((id) => selectedLeadIds.includes(id)) && !allSelected;
  const isCompact = density === 'compact';

  const hasActiveFilters = Boolean(
    queryParams.search ||
    queryParams.status ||
    queryParams.priority ||
    queryParams.source ||
    queryParams.preset
  );

  const renderSortIndicator = (columnKey: string) => {
    if (queryParams.sortBy !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40 group-hover/col:opacity-100 transition-opacity" />;
    }
    return queryParams.sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1 text-zinc-900 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-zinc-900 font-bold" />
    );
  };

  return (
    <div className="relative space-y-2">
      <div className="bg-white border border-zinc-200/90 rounded-lg shadow-2xs overflow-hidden">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/80 text-zinc-500 font-semibold text-[11px] uppercase tracking-wider select-none">
                {/* Checkbox */}
                <th className="py-2.5 px-3 w-8 text-center">
                  <button
                    type="button"
                    onClick={onToggleSelectAll}
                    className="text-zinc-400 hover:text-zinc-800 transition-colors"
                    title={allSelected ? 'Deselect all on this page' : 'Select all on this page'}
                  >
                    {allSelected ? (
                      <CheckSquare className="h-3.5 w-3.5 text-zinc-900" />
                    ) : someSelected ? (
                      <div className="h-3.5 w-3.5 border border-zinc-900 bg-zinc-900 rounded-xs flex items-center justify-center text-white text-[9px] font-bold">
                        -
                      </div>
                    ) : (
                      <Square className="h-3.5 w-3.5" />
                    )}
                  </button>
                </th>

                {/* Priority Sort */}
                <th
                  onClick={() => onSortChange('priority')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-zinc-100/70 transition-colors group/col"
                >
                  <div className="flex items-center">
                    <span>Priority</span>
                    {renderSortIndicator('priority')}
                  </div>
                </th>

                {/* Prospect Name Sort */}
                <th
                  onClick={() => onSortChange('name')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-zinc-100/70 transition-colors group/col"
                >
                  <div className="flex items-center">
                    <span>Prospect</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>

                {/* Company Sort */}
                <th
                  onClick={() => onSortChange('company')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-zinc-100/70 transition-colors group/col"
                >
                  <div className="flex items-center">
                    <span>Company</span>
                    {renderSortIndicator('company')}
                  </div>
                </th>

                <th className="py-2.5 px-3">Contact</th>

                {/* Deal Value Sort */}
                <th
                  onClick={() => onSortChange('value')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-zinc-100/70 transition-colors group/col"
                >
                  <div className="flex items-center">
                    <span>Deal Value</span>
                    {renderSortIndicator('value')}
                  </div>
                </th>

                {/* Deal Score */}
                <th className="py-2.5 px-3">
                  <span title="Calculated CRM conversion probability">Score</span>
                </th>

                <th className="py-2.5 px-3">Channel</th>

                {/* Status Sort */}
                <th
                  onClick={() => onSortChange('status')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-zinc-100/70 transition-colors group/col"
                >
                  <div className="flex items-center">
                    <span>Pipeline Stage</span>
                    {renderSortIndicator('status')}
                  </div>
                </th>

                {/* Date Sort */}
                <th
                  onClick={() => onSortChange('createdAt')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-zinc-100/70 transition-colors group/col"
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {renderSortIndicator('createdAt')}
                  </div>
                </th>

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
                      <div className="h-4 w-12 bg-zinc-100 rounded" />
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
                  <td colSpan={11} className="py-14 text-center">
                    <div className="mx-auto h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2.5">
                      <UserX className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900">
                      No matching prospects found
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      {hasActiveFilters
                        ? 'Try clearing active search criteria, status stages, or preset filters.'
                        : 'No leads in pipeline. Create or import your first prospect to get started.'}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="mt-3.5 text-xs h-7 text-zinc-700 hover:text-zinc-900 border-zinc-300"
                      >
                        <RotateCcw className="h-3 w-3 mr-1.5" />
                        Reset All Filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                // Leads Rows
                leads.map((lead, index) => {
                  const statusConfig = statusStyles[lead.status] || {
                    label: lead.status,
                    dot: 'bg-zinc-400',
                    badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
                  };
                  const prioConfig = priorityBadges[lead.priority] || priorityBadges.MEDIUM;
                  const isSelected = selectedLeadIds.includes(lead.id);
                  const isKeyboardFocused = focusedIndex === index;
                  const score = getDealScore(lead);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setFocusedIndex(index);
                        onSelectLead(lead);
                      }}
                      className={`group cursor-pointer transition-colors ${isKeyboardFocused
                        ? 'bg-zinc-100/90 ring-1 ring-inset ring-zinc-900'
                        : isSelected
                          ? 'bg-zinc-100/70'
                          : 'hover:bg-zinc-50/70'
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

                      {/* Deal Health Score */}
                      <td className={`${isCompact ? 'py-1.5' : 'py-2.5'} px-3 font-mono text-[11px] tabular-numbers`}>
                        <span
                          className={`inline-flex items-center space-x-1 px-1.5 py-0.2 rounded font-semibold ${score >= 80
                            ? 'text-emerald-700 bg-emerald-50'
                            : score >= 50
                              ? 'text-amber-700 bg-amber-50'
                              : 'text-zinc-500 bg-zinc-100'
                            }`}
                          title={`Deal Health: ${score}/100`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${score >= 80
                              ? 'bg-emerald-500'
                              : score >= 50
                                ? 'bg-amber-500'
                                : 'bg-zinc-400'
                              }`}
                          />
                          <span>{score}</span>
                        </span>
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
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={`inline-flex items-center gap-1.5 rounded-full pl-2 pr-2 py-0.5 text-[11px] font-semibold border transition-all hover:ring-1 hover:ring-zinc-400 focus:outline-none ${statusConfig.badge}`}
                              title="Click to advance stage"
                            >
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusConfig.dot}`} />
                              <span>{statusConfig.label}</span>
                              <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-0.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-36">
                            <DropdownMenuLabel>Pipeline Stage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(
                              [
                                { value: 'NEW', label: 'New', dot: 'bg-sky-500' },
                                { value: 'CONTACTED', label: 'Contacted', dot: 'bg-amber-500' },
                                { value: 'QUALIFIED', label: 'Qualified', dot: 'bg-emerald-600' },
                                { value: 'LOST', label: 'Lost', dot: 'bg-zinc-400' },
                              ] as const
                            ).map((st) => (
                              <DropdownMenuItem
                                key={st.value}
                                onClick={() => onQuickStatusChange(lead.id, st.value)}
                                className="flex items-center justify-between text-xs cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                                  <span>{st.label}</span>
                                </div>
                                {lead.status === st.value && (
                                  <Check className="h-3.5 w-3.5 text-zinc-900" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                            title="Edit Lead (E)"
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
                            title="Open Drawer (Enter)"
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

              <div className="flex items-center space-x-1.5 pl-2 border-l border-zinc-200">
                <span className="text-zinc-500">Rows:</span>
                <Select
                  value={String(pagination.limit)}
                  onValueChange={(val) => onLimitChange(Number(val))}
                >
                  <SelectTrigger className="h-6 w-[62px] px-2 text-xs font-mono font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end" className="min-w-[62px]">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Tactile Power-User Shortcut Hints Bar */}
      <div className="hidden sm:flex items-center justify-between px-2 text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center space-x-3">
          <span><kbd className="px-1 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">J</kbd> / <kbd className="px-1 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">K</kbd> Navigate</span>
          <span><kbd className="px-1 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">↵</kbd> Inspect</span>
          <span><kbd className="px-1 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">X</kbd> Select</span>
          <span><kbd className="px-1 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">E</kbd> Edit</span>
          <span><kbd className="px-1 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-600">⌘K</kbd> Commands</span>
        </div>
        <span className="text-zinc-400">Superhuman-style navigation enabled</span>
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
