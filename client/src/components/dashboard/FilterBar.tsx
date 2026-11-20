'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LeadStatus, LeadSource, LeadQueryParams } from '@/types';
import { Search, Plus, Filter, RotateCcw, ArrowUpDown, X } from 'lucide-react';

interface FilterBarProps {
  queryParams: LeadQueryParams;
  onChange: (updates: Partial<LeadQueryParams>) => void;
  onReset: () => void;
  onOpenCreateModal: () => void;
}

const statusTabs: { key?: LeadStatus; label: string }[] = [
  { key: undefined, label: 'All Leads' },
  { key: 'NEW', label: 'New' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'QUALIFIED', label: 'Qualified' },
  { key: 'LOST', label: 'Lost' },
];

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
    <div className="space-y-3 mb-6">
      {/* Segmented Pipeline Stage Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-1">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {statusTabs.map((tab) => {
            const isActive = queryParams.status === tab.key;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onChange({ status: tab.key, page: 1 })}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Create Lead Primary Action */}
        <Button
          onClick={onOpenCreateModal}
          size="sm"
          className="text-xs h-9 bg-slate-900 hover:bg-slate-800 text-white shadow-sm shrink-0"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Lead
        </Button>
      </div>

      {/* Main Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={queryParams.search || ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            className="pl-9 h-9 text-xs sm:text-sm bg-slate-50/70 border-slate-200 focus:bg-white focus-visible:ring-1 focus-visible:ring-slate-900"
          />
          {queryParams.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Source Filter */}
          <select
            value={queryParams.source || ''}
            onChange={(e) =>
              onChange({
                source: (e.target.value as LeadSource) || undefined,
                page: 1,
              })
            }
            className="h-9 text-xs rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="">All Acquisition Sources</option>
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
              className="h-7 text-xs rounded-md bg-transparent px-2 text-slate-700 font-medium focus:outline-none"
            >
              <option value="createdAt">Date Added</option>
              <option value="name">Lead Name</option>
              <option value="company">Company</option>
              <option value="status">Status</option>
            </select>
            <button
              type="button"
              onClick={() =>
                onChange({
                  sortOrder: queryParams.sortOrder === 'asc' ? 'desc' : 'asc',
                })
              }
              className="h-7 px-2 text-slate-600 hover:text-slate-900 flex items-center text-xs font-semibold rounded hover:bg-slate-200/60"
              title={`Toggle sort order (${queryParams.sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              {queryParams.sortOrder?.toUpperCase() || 'DESC'}
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate-500 hover:text-slate-900 text-xs h-9 px-2.5"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 px-1">
          <span className="font-medium text-slate-400">Active Filters:</span>
          {queryParams.status && (
            <span className="inline-flex items-center bg-slate-100 text-slate-800 rounded-md px-2 py-0.5 font-medium border border-slate-200">
              Status: {queryParams.status}
              <button
                onClick={() => onChange({ status: undefined, page: 1 })}
                className="ml-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {queryParams.source && (
            <span className="inline-flex items-center bg-slate-100 text-slate-800 rounded-md px-2 py-0.5 font-medium border border-slate-200">
              Source: {queryParams.source}
              <button
                onClick={() => onChange({ source: undefined, page: 1 })}
                className="ml-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {queryParams.search && (
            <span className="inline-flex items-center bg-slate-100 text-slate-800 rounded-md px-2 py-0.5 font-medium border border-slate-200">
              Search: &quot;{queryParams.search}&quot;
              <button
                onClick={() => onChange({ search: '', page: 1 })}
                className="ml-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
