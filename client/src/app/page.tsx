'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiRequest } from '@/lib/api';
import { Lead, LeadStats, Pagination, LeadQueryParams, LeadStatus, LeadPriority } from '@/types';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PipelineDistributionBar } from '@/components/dashboard/PipelineDistributionBar';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { LeadDrawer } from '@/components/dashboard/LeadDrawer';
import { LeadModal, LeadFormData } from '@/components/dashboard/LeadModal';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { CsvImportModal } from '@/components/dashboard/CsvImportModal';
import { KeyboardShortcutsDialog } from '@/components/dashboard/KeyboardShortcutsDialog';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { LandingPage } from '@/components/landing/LandingPage';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { success, error } = useToast();

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // View Mode: Table vs Kanban
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Table Density: Comfortable vs Compact
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Bulk Selection State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Filters & Query State
  const [queryParams, setQueryParams] = useState<LeadQueryParams>({
    search: '',
    status: undefined,
    priority: undefined,
    source: undefined,
    preset: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  // Drawer & Modals State
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dialogs State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Ref for actions called via custom events
  const handleExportCsvRef = useRef<() => void>(() => {});

  // Fetch Leads (Stable callback - does NOT depend on selectedLeadForDrawer to prevent loops)
  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setIsLoadingLeads(true);
    try {
      const query = new URLSearchParams();
      if (queryParams.search) query.append('search', queryParams.search);
      // In Kanban view, fetch across all stages so board columns aren't blank
      if (viewMode !== 'kanban' && queryParams.status) {
        query.append('status', queryParams.status);
      }
      if (queryParams.priority) query.append('priority', queryParams.priority);
      if (queryParams.source) query.append('source', queryParams.source);
      if (queryParams.preset) query.append('preset', queryParams.preset);
      if (queryParams.sortBy) query.append('sortBy', queryParams.sortBy);
      if (queryParams.sortOrder) query.append('sortOrder', queryParams.sortOrder);

      // In Kanban view, fetch page 1 with up to 100 leads to populate columns
      if (viewMode === 'kanban') {
        query.append('page', '1');
        query.append('limit', '100');
      } else {
        if (queryParams.page) query.append('page', String(queryParams.page));
        if (queryParams.limit) query.append('limit', String(queryParams.limit));
      }

      const res = await apiRequest<{
        success: boolean;
        data: { leads: Lead[]; pagination: Pagination };
      }>(`/leads?${query.toString()}`);

      setLeads(res.data.leads);
      setPagination(res.data.pagination);

      // Safely sync selected lead in drawer using functional updater without retriggering fetchLeads
      setSelectedLeadForDrawer((prev) => {
        if (!prev) return null;
        const fresh = res.data.leads.find((l) => l.id === prev.id);
        if (!fresh) return prev;
        if (
          fresh.status === prev.status &&
          fresh.priority === prev.priority &&
          fresh.value === prev.value &&
          fresh.name === prev.name &&
          fresh.email === prev.email &&
          fresh.phone === prev.phone &&
          fresh.company === prev.company &&
          fresh.source === prev.source &&
          fresh.notes?.length === prev.notes?.length
        ) {
          return prev;
        }
        return fresh;
      });
    } catch (err: any) {
      error('Failed to load leads', err.message);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [user, queryParams, viewMode, error]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!user) return;
    setIsLoadingStats(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        data: { stats: LeadStats };
      }>('/leads/stats');
      setStats(res.data.stats);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, [user]);

  // Debounced Search & Filter Triggers
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      fetchLeads();
    }, 180);

    return () => clearTimeout(timer);
  }, [fetchLeads, user]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [fetchStats, user]);

  // Global Keyboard Shortcuts & Navbar Custom Events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Cmd+K or Ctrl+K) works everywhere
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Ignore if typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleOpenCreateModal();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setViewMode((prev) => (prev === 'table' ? 'kanban' : 'table'));
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    const onOpenPalette = () => setIsCommandPaletteOpen(true);
    const onOpenCreate = () => handleOpenCreateModal();
    const onSwitchView = (e: Event) => {
      const ce = e as CustomEvent<'table' | 'kanban'>;
      if (ce.detail) {
        setViewMode(ce.detail);
      } else {
        setViewMode((prev) => (prev === 'table' ? 'kanban' : 'table'));
      }
    };
    const onSwitchPipeline = (e: Event) => {
      const ce = e as CustomEvent<'saas' | 'inbound' | 'partnerships'>;
      const pipe = ce.detail;
      if (pipe === 'inbound') {
        setQueryParams((prev) => ({
          ...prev,
          source: 'WEBSITE',
          preset: undefined,
          page: 1,
        }));
        success('Product-Led Inbound', 'Filtered by Website acquisition channel');
      } else if (pipe === 'partnerships') {
        setQueryParams((prev) => ({
          ...prev,
          source: 'REFERRAL',
          preset: undefined,
          page: 1,
        }));
        success('Strategic Partnerships', 'Filtered by Partner Referrals');
      } else {
        setQueryParams((prev) => ({
          ...prev,
          source: undefined,
          preset: undefined,
          page: 1,
        }));
        success('Enterprise SaaS Pipeline', 'Showing all prospective accounts');
      }
    };
    const onTriggerSync = () => {
      fetchLeads();
      fetchStats();
      success('Synchronized', 'Pipeline data refreshed');
    };
    const onTriggerExport = () => {
      handleExportCsvRef.current();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', onOpenPalette);
    window.addEventListener('open-create-lead', onOpenCreate);
    window.addEventListener('switch-view-mode', onSwitchView);
    window.addEventListener('switch-pipeline', onSwitchPipeline);
    window.addEventListener('trigger-sync', onTriggerSync);
    window.addEventListener('trigger-export-csv', onTriggerExport);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', onOpenPalette);
      window.removeEventListener('open-create-lead', onOpenCreate);
      window.removeEventListener('switch-view-mode', onSwitchView);
      window.removeEventListener('switch-pipeline', onSwitchPipeline);
      window.removeEventListener('trigger-sync', onTriggerSync);
      window.removeEventListener('trigger-export-csv', onTriggerExport);
    };
  }, [fetchLeads, fetchStats, success]);

  // Handle Query Changes
  const handleQueryChange = (updates: Partial<LeadQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setQueryParams((prev) => ({
      search: '',
      status: undefined,
      priority: undefined,
      source: undefined,
      preset: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: prev.limit || 10,
    }));
    setSelectedLeadIds([]);
  };

  const handleSortChange = (column: string) => {
    setQueryParams((prev) => {
      if (prev.sortBy === column) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
          page: 1,
        };
      }
      return {
        ...prev,
        sortBy: column as any,
        sortOrder: 'desc',
        page: 1,
      };
    });
  };

  // Status Change
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await apiRequest(`/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      const isFilteredOut = queryParams.status && queryParams.status !== newStatus;
      if (isFilteredOut) {
        success('Stage Updated', `Moved to ${newStatus}. (Filtered out of active view)`);
      } else {
        success('Stage Updated', `Lead moved to ${newStatus}`);
      }

      fetchLeads();
      fetchStats();

      if (selectedLeadForDrawer && selectedLeadForDrawer.id === leadId) {
        setSelectedLeadForDrawer({ ...selectedLeadForDrawer, status: newStatus });
      }
    } catch (err: any) {
      error('Update Failed', err.message);
    }
  };

  // Priority Change
  const handlePriorityChange = async (leadId: string, newPriority: LeadPriority) => {
    try {
      await apiRequest(`/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ priority: newPriority }),
      });
      success('Priority Updated', `Set to ${newPriority}`);
      fetchLeads();
      fetchStats();

      if (selectedLeadForDrawer && selectedLeadForDrawer.id === leadId) {
        setSelectedLeadForDrawer({ ...selectedLeadForDrawer, priority: newPriority });
      }
    } catch (err: any) {
      error('Priority Update Failed', err.message);
    }
  };

  // Bulk Selection Handlers (Per-page sync)
  const handleToggleSelectLead = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = leads.map((l) => l.id);
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedLeadIds.includes(id));
    if (allPageSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleBulkStatusChange = async (newStatus: LeadStatus) => {
    if (selectedLeadIds.length === 0) return;
    try {
      await apiRequest('/leads/bulk-status', {
        method: 'PATCH',
        body: JSON.stringify({ ids: selectedLeadIds, status: newStatus }),
      });
      success('Bulk Updated', `Moved ${selectedLeadIds.length} leads to ${newStatus}`);
      setSelectedLeadIds([]);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Bulk Update Failed', err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} leads?`)) return;

    try {
      await apiRequest('/leads/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedLeadIds }),
      });
      success('Bulk Deleted', `Deleted ${selectedLeadIds.length} leads`);
      setSelectedLeadIds([]);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Bulk Delete Failed', err.message);
    }
  };

  // Add Note Handler
  const handleAddNote = async (leadId: string, content: string, type: 'NOTE' | 'CALL' = 'NOTE') => {
    try {
      const res = await apiRequest<{ success: boolean; data: { note: any } }>(
        `/leads/${leadId}/notes`,
        {
          method: 'POST',
          body: JSON.stringify({ content, type }),
        }
      );
      success(type === 'CALL' ? 'Call Logged' : 'Note Added', 'Interaction logged to timeline');
      fetchLeads();

      if (selectedLeadForDrawer && selectedLeadForDrawer.id === leadId) {
        setSelectedLeadForDrawer({
          ...selectedLeadForDrawer,
          notes: [res.data.note, ...(selectedLeadForDrawer.notes || [])],
        });
      }
    } catch (err: any) {
      error('Note Failed', err.message);
    }
  };

  // Import Leads Handler
  const handleImportLeads = async (importedLeads: any[]) => {
    try {
      const res = await apiRequest<{ success: boolean; data: { count: number; leads: Lead[] } }>(
        '/leads/import',
        {
          method: 'POST',
          body: JSON.stringify({ leads: importedLeads }),
        }
      );
      success('Import Successful', `Imported ${res.data.count} leads to your pipeline`);
      setIsImportModalOpen(false);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Import Failed', err.message);
      throw err;
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (leads.length === 0) {
      error('No data to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Deal Value', 'Priority', 'Source', 'Status', 'Date Added'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      `"${l.phone}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      l.value || 0,
      l.priority || 'MEDIUM',
      l.source,
      l.status,
      new Date(l.createdAt).toISOString().split('T')[0],
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `meru_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Export Successful', `Exported ${leads.length} leads to CSV`);
  };
  handleExportCsvRef.current = handleExportCsv;

  // Drawer Handler
  const handleSelectLead = (lead: Lead) => {
    setSelectedLeadForDrawer(lead);
    setIsDrawerOpen(true);
  };

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleSubmitLeadForm = async (formData: LeadFormData) => {
    try {
      if (leadToEdit) {
        await apiRequest(`/leads/${leadToEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        success('Lead Updated', `${formData.name} was successfully updated`);
      } else {
        await apiRequest('/leads', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        success('Lead Created', `${formData.name} was added to your pipeline`);
      }
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Operation Failed', err.message);
      throw err;
    }
  };

  // Delete Handlers
  const handleOpenDeleteDialog = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/leads/${leadToDelete.id}`, {
        method: 'DELETE',
      });
      success('Lead Deleted', `${leadToDelete.name} was removed`);
      setIsDeleteDialogOpen(false);
      setLeadToDelete(null);

      if (selectedLeadForDrawer && selectedLeadForDrawer.id === leadToDelete.id) {
        setIsDrawerOpen(false);
        setSelectedLeadForDrawer(null);
      }

      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Unauthenticated Workspace Gateway
  if (!user && !isAuthLoading) {
    return <LandingPage />;
  }

  // Initial Auth Loading
  if (isAuthLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="h-6 w-6 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
        <p className="text-xs text-zinc-500 font-medium">Connecting to sales pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Sales Pipeline
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Capture, qualify, and convert prospective accounts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchLeads();
              fetchStats();
              success('Synchronized', 'Pipeline data refreshed');
            }}
            disabled={isLoadingLeads}
            className="text-xs h-8 text-zinc-700"
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        </div>
      </div>

      {/* KPI Stats Metric Cards */}
      <StatsCards
        stats={stats}
        isLoading={isLoadingStats}
        activeStatus={queryParams.status}
        activePriority={queryParams.priority}
        onFilter={(updates) => handleQueryChange(updates)}
      />

      {/* Pipeline Distribution Funnel Bar */}
      <PipelineDistributionBar
        stats={stats}
        activeStatus={queryParams.status}
        onSelectStatus={(status) => handleQueryChange({ status, preset: undefined, page: 1 })}
      />

      {/* Search, View Presets, Density Toggle, CSV & Actions Toolbar */}
      <FilterBar
        queryParams={queryParams}
        viewMode={viewMode}
        density={density}
        onChange={handleQueryChange}
        onReset={handleResetFilters}
        onViewModeChange={setViewMode}
        onDensityChange={setDensity}
        onOpenCreateModal={handleOpenCreateModal}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenShortcutsDialog={() => setIsShortcutsOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Table View vs Kanban Board View */}
      {viewMode === 'table' ? (
        <LeadsTable
          leads={leads}
          pagination={pagination}
          isLoading={isLoadingLeads}
          density={density}
          queryParams={queryParams}
          selectedLeadIds={selectedLeadIds}
          onToggleSelectLead={handleToggleSelectLead}
          onToggleSelectAll={handleToggleSelectAll}
          onPageChange={(page) => handleQueryChange({ page })}
          onLimitChange={(limit) => handleQueryChange({ limit, page: 1 })}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
          onQuickStatusChange={handleStatusChange}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkDelete={handleBulkDelete}
          onSelectLead={handleSelectLead}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      ) : (
        <KanbanBoard
          leads={leads}
          isLoading={isLoadingLeads}
          onSelectLead={handleSelectLead}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Slide-over Inspector Drawer */}
      <LeadDrawer
        lead={selectedLeadForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onAddNote={handleAddNote}
        onEdit={(lead) => {
          setIsDrawerOpen(false);
          handleOpenEditModal(lead);
        }}
        onDelete={(lead) => {
          handleOpenDeleteDialog(lead);
        }}
      />

      {/* Create / Edit Modal Dialog */}
      <LeadModal
        isOpen={isModalOpen}
        leadToEdit={leadToEdit}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitLeadForm}
      />

      {/* Raycast-style Spotlight Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        leads={leads}
        onSelectLead={handleSelectLead}
        onOpenCreateModal={handleOpenCreateModal}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'table' ? 'kanban' : 'table'))}
        onToggleDensity={() => setDensity((prev) => (prev === 'comfortable' ? 'compact' : 'comfortable'))}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportCsv={handleExportCsv}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onFilterPreset={(preset) => handleQueryChange({ preset, page: 1 })}
        onLogout={logout}
      />

      {/* CSV Batch Import Modal Dialog */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLeads}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Delete Confirmation Step Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        lead={leadToDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
