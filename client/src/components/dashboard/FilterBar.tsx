'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadStatus, LeadPriority, LeadSource, LeadQueryParams } from '@/types';
import {
  Search,
  Plus,
  RotateCcw,
  ArrowUpDown,
  X,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Upload,
  Keyboard,
  Flame,
  DollarSign,
  Zap,
  Target,
  AlignJustify,
  Rows,
} from 'lucide-react';

interface FilterBarProps {
  queryParams: LeadQueryParams;
  viewMode: 'table' | 'kanban';
  density: 'comfortable' | 'compact';
  onChange: (updates: Partial<LeadQueryParams>) => void;
  onReset: () => void;
  onViewModeChange: (mode: 'table' | 'kanban') => void;
  onDensityChange: (density: 'comfortable' | 'compact') => void;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onOpenShortcutsDialog: () => void;
  onExportCsv: () => void;
}

const presets: {
  key?: 'ALL' | 'P1' | 'HIGH_VALUE' | 'NEEDS_TOUCH' | 'CLOSING';
  label: string;
  icon: any;
}[] = [
    { key: undefined, label: 'All', icon: null },
    { key: 'P1', label: 'P1 Urgent', icon: Flame },
    { key: 'HIGH_VALUE', label: 'Value >$25k', icon: DollarSign },
    { key: 'NEEDS_TOUCH', label: 'Needs First Touch', icon: Zap },
    { key: 'CLOSING', label: 'Deal Closing', icon: Target },
  ];

export const FilterBar: React.FC<FilterBarProps> = ({
  queryParams,
  viewMode,
  density,
  onChange,
  onReset,
  onViewModeChange,
  onDensityChange,
  onOpenCreateModal,
  onOpenImportModal,
  onOpenShortcutsDialog,
  onExportCsv,
}) => {
  const hasActiveFilters = Boolean(
    queryParams.search ||
    queryParams.status ||
    queryParams.priority ||
    queryParams.source ||
    queryParams.preset
  );

  const isAllPresetActive =
    !queryParams.preset &&
    !queryParams.status &&
    !queryParams.priority &&
    !queryParams.source;

  const handleSelectPreset = (key?: 'ALL' | 'P1' | 'HIGH_VALUE' | 'NEEDS_TOUCH' | 'CLOSING') => {
    if (!key || key === 'ALL') {
      onChange({
        preset: undefined,
        status: undefined,
        priority: undefined,
        source: undefined,
        page: 1,
      });
    } else if (key === 'P1') {
      onChange({
        preset: 'P1',
        priority: 'HIGH',
        status: undefined,
        page: 1,
      });
    } else if (key === 'HIGH_VALUE') {
      onChange({
        preset: 'HIGH_VALUE',
        page: 1,
      });
    } else if (key === 'NEEDS_TOUCH') {
      onChange({
        preset: 'NEEDS_TOUCH',
        status: 'NEW',
        priority: undefined,
        page: 1,
      });
    } else if (key === 'CLOSING') {
      onChange({
        preset: 'CLOSING',
        status: 'QUALIFIED',
        priority: undefined,
        page: 1,
      });
    }
  };

  return (
    <div className="space-y-2.5 mb-5">
      {/* Row 1: Linear-style View Presets & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-zinc-200/90 pb-2">
        {/* Preset Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Views:
          </span>
          {presets.map((p) => {
            const Icon = p.icon;
            const isActive = p.key === undefined ? isAllPresetActive : queryParams.preset === p.key;

            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPreset(p.key)}
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${isActive
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-zinc-200/50'
                  }`}
              >
                {Icon && <Icon className="h-3 w-3" />}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Controls, Actions & Modals */}
        <div className="flex items-center space-x-1.5 shrink-0 self-end md:self-auto">
          {/* Density Toggle (only active in table view) */}
          {viewMode === 'table' && (
            <div className="flex items-center border border-zinc-200 rounded-md p-0.5 bg-zinc-50">
              <button
                type="button"
                onClick={() => onDensityChange('comfortable')}
                className={`p-1 rounded text-xs transition-all ${density === 'comfortable' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                title="Comfortable row density"
              >
                <Rows className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDensityChange('compact')}
                className={`p-1 rounded text-xs transition-all ${density === 'compact' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                title="Compact spreadsheet density"
              >
                <AlignJustify className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Table / Kanban View Toggle */}
          <div className="flex items-center border border-zinc-200 rounded-md p-0.5 bg-zinc-50">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              title="Table View (V)"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${viewMode === 'kanban' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              title="Kanban Board View (V)"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          {/* Shortcuts Guide Button */}
          <button
            type="button"
            onClick={onOpenShortcutsDialog}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="h-3.5 w-3.5" />
          </button>

          {/* CSV Import */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenImportModal}
            className="text-xs h-7 text-zinc-700 hover:text-zinc-900"
            title="Import CSV"
          >
            <Upload className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Import</span>
          </Button>

          {/* CSV Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="text-xs h-7 text-zinc-700 hover:text-zinc-900"
            title="Export CSV"
          >
            <Download className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Create Lead Primary Action */}
          <Button
            onClick={onOpenCreateModal}
            size="sm"
            className="text-xs h-7 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Row 2: Search, Custom Select Dropdowns & Sort */}
      <div className="bg-white border border-zinc-200/90 rounded-lg p-2 shadow-xs flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            id="global-lead-search-input"
            type="text"
            placeholder="Search leads (Press / or Ctrl+K)..."
            value={queryParams.search || ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            className="pl-8 pr-7 h-7 text-xs bg-zinc-50/70 border-zinc-200 focus:bg-white focus-visible:ring-1 focus-visible:ring-zinc-900"
          />
          {queryParams.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '', page: 1 })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Custom Radix Select Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Status Filter Dropdown */}
          <div className="w-[125px]">
            <Select
              value={queryParams.status || 'ALL'}
              onValueChange={(val) =>
                onChange({
                  status: val === 'ALL' ? undefined : (val as LeadStatus),
                  preset: undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-7 text-xs bg-zinc-50/70 border-zinc-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="NEW">
                  <span className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>New</span>
                  </span>
                </SelectItem>
                <SelectItem value="CONTACTED">
                  <span className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Contacted</span>
                  </span>
                </SelectItem>
                <SelectItem value="QUALIFIED">
                  <span className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>Qualified</span>
                  </span>
                </SelectItem>
                <SelectItem value="LOST">
                  <span className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    <span>Lost</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter Dropdown */}
          <div className="w-[120px]">
            <Select
              value={queryParams.priority || 'ALL'}
              onValueChange={(val) =>
                onChange({
                  priority: val === 'ALL' ? undefined : (val as LeadPriority),
                  preset: undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-7 text-xs bg-zinc-50/70 border-zinc-200">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="HIGH">
                  <span className="flex items-center space-x-1.5 text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                    <span>P1 - High</span>
                  </span>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <span className="flex items-center space-x-1.5 text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>P2 - Medium</span>
                  </span>
                </SelectItem>
                <SelectItem value="LOW">
                  <span className="flex items-center space-x-1.5 text-zinc-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    <span>P3 - Low</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Filter Dropdown */}
          <div className="w-[125px]">
            <Select
              value={queryParams.source || 'ALL'}
              onValueChange={(val) =>
                onChange({
                  source: val === 'ALL' ? undefined : (val as LeadSource),
                  preset: undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-7 text-xs bg-zinc-50/70 border-zinc-200">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sources</SelectItem>
                <SelectItem value="WEBSITE">Website</SelectItem>
                <SelectItem value="REFERRAL">Referral</SelectItem>
                <SelectItem value="COLD_OUTREACH">Cold Outreach</SelectItem>
                <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                <SelectItem value="ADVERTISEMENT">Ad Campaign</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Column & Direction */}
          <div className="flex items-center space-x-1 border border-zinc-200 rounded p-0.5 bg-zinc-50/70">
            <div className="w-[95px]">
              <Select
                value={queryParams.sortBy || 'createdAt'}
                onValueChange={(val) =>
                  onChange({
                    sortBy: val as any,
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="h-6 text-[11px] border-0 bg-transparent shadow-none px-1.5">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="value">Value ($)</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={() =>
                onChange({
                  sortOrder: queryParams.sortOrder === 'asc' ? 'desc' : 'asc',
                })
              }
              className="h-6 px-1.5 text-zinc-600 hover:text-zinc-900 flex items-center text-[10px] font-semibold rounded hover:bg-zinc-200/60 transition-colors"
              title={`Toggle sort order (${queryParams.sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
            >
              <ArrowUpDown className="h-2.5 w-2.5 mr-0.5" />
              {queryParams.sortOrder?.toUpperCase() || 'DESC'}
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-zinc-500 hover:text-zinc-900 text-xs h-7 px-2"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
