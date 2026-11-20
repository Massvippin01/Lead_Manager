'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LeadStatus, LeadSource, LeadQueryParams } from '@/types';
import { Search, Plus, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  queryParams: LeadQueryParams;
  onChange: (updates: Partial<LeadQueryParams>) => void;
  onReset: () => void;
  onOpenCreateModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  queryParams,
  onChange,
  onReset,
  onOpenCreateModal,
}) => {
  const hasActiveFilters = Boolean(
    queryParams.search || queryParams.status || queryParams.source
  );

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search leads by name, email, or company..."
          value={queryParams.search || ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          className="pl-9 bg-slate-50/70 border-slate-200 focus:bg-white"
        />
      </div>

      {/* Filter Selects & Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={queryParams.status || ''}
            onChange={(e) =>
              onChange({
                status: (e.target.value as LeadStatus) || undefined,
                page: 1,
              })
            }
            className="h-10 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="LOST">Lost</option>
          </select>
        </div>

        {/* Source Filter */}
        <select
          value={queryParams.source || ''}
          onChange={(e) =>
            onChange({
              source: (e.target.value as LeadSource) || undefined,
              page: 1,
            })
          }
          className="h-10 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Sources</option>
          <option value="WEBSITE">Website</option>
          <option value="REFERRAL">Referral</option>
          <option value="COLD_OUTREACH">Cold Outreach</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="ADVERTISEMENT">Advertisement</option>
          <option value="EVENT">Event</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Sort Column & Direction */}
        <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50/70">
          <select
            value={queryParams.sortBy || 'createdAt'}
            onChange={(e) =>
              onChange({
                sortBy: e.target.value as any,
                page: 1,
              })
            }
            className="h-9 text-xs rounded-md bg-transparent px-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="createdAt">Date Added</option>
            <option value="name">Lead Name</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                sortOrder: queryParams.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="h-8 px-2 text-slate-600 hover:text-slate-900"
            title={`Toggle sort order (${queryParams.sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase ml-1 font-bold">
              {queryParams.sortOrder || 'desc'}
            </span>
          </Button>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-slate-900 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}

        {/* Add Lead Primary CTA */}
        <Button
          onClick={onOpenCreateModal}
          className="ml-auto shadow-md shadow-blue-500/20 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Lead
        </Button>
      </div>
    </div>
  );
};
