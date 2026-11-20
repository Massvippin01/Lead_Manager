'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lead, LeadStatus } from '@/types';
import { Building2, Mail, Phone, DollarSign, ChevronRight, ChevronLeft, ArrowRight, Clock } from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}

const columns: {
  status: LeadStatus;
  title: string;
  dotColor: string;
  badgeBg: string;
  prevStatus?: LeadStatus;
  nextStatus?: LeadStatus;
}[] = [
  {
    status: 'NEW',
    title: 'New Inquiries',
    dotColor: 'bg-sky-500',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    nextStatus: 'CONTACTED',
  },
  {
    status: 'CONTACTED',
    title: 'In Contact',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    prevStatus: 'NEW',
    nextStatus: 'QUALIFIED',
  },
  {
    status: 'QUALIFIED',
    title: 'Qualified Deals',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    prevStatus: 'CONTACTED',
    nextStatus: 'LOST',
  },
  {
    status: 'LOST',
    title: 'Closed / Lost',
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    prevStatus: 'QUALIFIED',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  isLoading,
  onSelectLead,
  onStatusChange,
}) => {
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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.status} className="bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 animate-pulse min-h-[400px]">
            <div className="h-5 w-28 bg-slate-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-28 bg-white rounded-lg border border-slate-200" />
              <div className="h-28 bg-white rounded-lg border border-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const columnLeads = leads.filter((l) => l.status === col.status);
        const columnTotalValue = columnLeads.reduce((acc, l) => acc + (l.value || 0), 0);

        return (
          <div
            key={col.status}
            className="bg-slate-100/60 border border-slate-200/90 rounded-xl p-3 flex flex-col max-h-[calc(100vh-14rem)] overflow-hidden"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3 px-1">
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                <span className="font-bold text-xs text-slate-800 tracking-tight">
                  {col.title}
                </span>
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 tabular-numbers">
                  {columnLeads.length}
                </span>
              </div>

              <span className="text-[11px] font-bold text-slate-600 tabular-numbers">
                {formatCurrency(columnTotalValue)}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {columnLeads.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  No prospects in this stage
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onSelectLead(lead)}
                    className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                  >
                    {/* Top Row: Prospect & Value */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate flex items-center mt-0.5">
                            <Building2 className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
                            {lead.company}
                          </p>
                        </div>
                      </div>

                      {lead.value > 0 && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.5 tabular-numbers shrink-0">
                          {formatCurrency(lead.value)}
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Source & Move Stage Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                        {lead.source}
                      </span>

                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        {col.prevStatus && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(lead.id, col.prevStatus!)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title={`Move back to ${col.prevStatus}`}
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {col.nextStatus && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(lead.id, col.nextStatus!)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title={`Advance to ${col.nextStatus}`}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
