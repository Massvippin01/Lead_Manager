'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiRequest } from '@/lib/api';
import { Lead, LeadStats, Pagination, LeadQueryParams, LeadStatus } from '@/types';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PipelineDistributionBar } from '@/components/dashboard/PipelineDistributionBar';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { LeadDrawer } from '@/components/dashboard/LeadDrawer';
import { LeadModal, LeadFormData } from '@/components/dashboard/LeadModal';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight, Layers, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { success, error } = useToast();

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Filters & Query State
  const [queryParams, setQueryParams] = useState<LeadQueryParams>({
    search: '',
    status: undefined,
    source: undefined,
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

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setIsLoadingLeads(true);
    try {
      const query = new URLSearchParams();
      if (queryParams.search) query.append('search', queryParams.search);
      if (queryParams.status) query.append('status', queryParams.status);
      if (queryParams.source) query.append('source', queryParams.source);
      if (queryParams.sortBy) query.append('sortBy', queryParams.sortBy);
      if (queryParams.sortOrder) query.append('sortOrder', queryParams.sortOrder);
      if (queryParams.page) query.append('page', String(queryParams.page));
      if (queryParams.limit) query.append('limit', String(queryParams.limit));

      const res = await apiRequest<{
        success: boolean;
        data: { leads: Lead[]; pagination: Pagination };
      }>(`/leads?${query.toString()}`);

      setLeads(res.data.leads);
      setPagination(res.data.pagination);

      // If drawer is open, keep selected lead updated
      if (selectedLeadForDrawer) {
        const updatedSelected = res.data.leads.find((l) => l.id === selectedLeadForDrawer.id);
        if (updatedSelected) {
          setSelectedLeadForDrawer(updatedSelected);
        }
      }
    } catch (err: any) {
      error('Failed to load leads', err.message);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [user, queryParams, error, selectedLeadForDrawer]);

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
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchLeads, user]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [fetchStats, user]);

  // Handle Query Changes
  const handleQueryChange = (updates: Partial<LeadQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      search: '',
      status: undefined,
      source: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
  };

  // Quick Status Update
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await apiRequest(`/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      success('Stage Updated', `Lead moved to ${newStatus}`);
      fetchLeads();
      fetchStats();

      // Update drawer lead state if currently selected
      if (selectedLeadForDrawer && selectedLeadForDrawer.id === leadId) {
        setSelectedLeadForDrawer({ ...selectedLeadForDrawer, status: newStatus });
      }
    } catch (err: any) {
      error('Update Failed', err.message);
    }
  };

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
    return (
      <div className="py-14 max-w-4xl mx-auto">
        <div className="border border-slate-200/90 rounded-2xl bg-white p-8 sm:p-12 shadow-sm text-center">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base mx-auto mb-5 shadow-xs">
            M
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Meru Lead Manager
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Sales pipeline management application built for Meru Technosoft screening assignment.
            Capture, qualify, and convert prospects with an enterprise-grade stack.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white">
                Sign in to Demo Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs sm:text-sm">
                Create Representative Account
              </Button>
            </Link>
          </div>

          {/* Architecture Credentials Banner */}
          <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-left text-xs text-slate-600">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-900">Evaluation Demo Profile</span>
              <span className="text-[11px] font-mono bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
                Pre-seeded
              </span>
            </div>
            <p className="font-mono text-slate-700">demo@meru.com / password123</p>
          </div>
        </div>
      </div>
    );
  }

  // Initial Auth Loading
  if (isAuthLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="h-6 w-6 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Connecting to sales pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Sales Leads Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track, prioritize, and inspect prospective accounts.
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
            className="text-xs h-8"
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
        onFilterStatus={(status) => handleQueryChange({ status, page: 1 })}
      />

      {/* Pipeline Distribution Funnel Bar */}
      <PipelineDistributionBar
        stats={stats}
        activeStatus={queryParams.status}
        onSelectStatus={(status) => handleQueryChange({ status, page: 1 })}
      />

      {/* Search & Filter Toolbar */}
      <FilterBar
        queryParams={queryParams}
        onChange={handleQueryChange}
        onReset={handleResetFilters}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Leads Table */}
      <LeadsTable
        leads={leads}
        pagination={pagination}
        isLoading={isLoadingLeads}
        queryParams={queryParams}
        onPageChange={(page) => handleQueryChange({ page })}
        onLimitChange={(limit) => handleQueryChange({ limit, page: 1 })}
        onQuickStatusChange={handleStatusChange}
        onSelectLead={handleSelectLead}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Slide-over Inspector Drawer */}
      <LeadDrawer
        lead={selectedLeadForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusChange={handleStatusChange}
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
