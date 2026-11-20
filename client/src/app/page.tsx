'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiRequest } from '@/lib/api';
import { Lead, LeadStats, Pagination, LeadQueryParams, LeadStatus } from '@/types';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { LeadModal, LeadFormData } from '@/components/dashboard/LeadModal';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

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

  // Modals State
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
    } catch (err: any) {
      error('Failed to load leads', err.message);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [user, queryParams, error]);

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
    }, 250);

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
  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await apiRequest(`/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      success('Status Updated', `Lead status moved to ${newStatus}`);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Update Failed', err.message);
    }
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
      success('Lead Deleted', `${leadToDelete.name} was removed from the system`);
      setIsDeleteDialogOpen(false);
      setLeadToDelete(null);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      error('Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Unauthenticated Welcome Hero
  if (!user && !isAuthLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Screening Assignment for Meru Technosoft</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Modern Lead Management & <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Sales Pipeline Intelligence
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Capture, track, qualify, and convert leads with a clean full-stack architecture powered by
          Next.js, Node.js REST API, PostgreSQL, and Shadcn UI.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-blue-500/25">
              Sign In to Demo Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Create New Account
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">End-to-End Pipeline</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Capture leads with complete verification, track acquisition sources, and transition statuses.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Secure & Isolated</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Stateless JWT authentication and PostgreSQL relational foreign keys isolate leads per user.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Instant Filters & Stats</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Real-time search, multi-column sorting, pagination, and instant pipeline conversion metrics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton while checking initial auth
  if (isAuthLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Connecting to Lead Manager API...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Sales Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor, prioritize, and convert prospective client opportunities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchLeads();
              fetchStats();
              success('Refreshed', 'Pipeline data synchronized');
            }}
            disabled={isLoadingLeads}
            className="text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button size="sm" onClick={handleOpenCreateModal} className="text-xs">
            + New Lead
          </Button>
        </div>
      </div>

      {/* KPI Stats Metric Cards */}
      <StatsCards stats={stats} isLoading={isLoadingStats} />

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
        onQuickStatusChange={handleQuickStatusChange}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
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
