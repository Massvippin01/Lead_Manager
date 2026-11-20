'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lead, LeadStatus } from '@/types';
import { Building2, ChevronRight, ChevronLeft } from 'lucide-react';

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
  prevStatus?: LeadStatus;
  nextStatus?: LeadStatus;
}[] = [
  {
    status: 'NEW',
    title: 'New Inquiries',
    dotColor: 'bg-sky-500',
    nextStatus: 'CONTACTED',
  },
  {
    status: 'CONTACTED',
    title: 'In Dialogue',
    dotColor: 'bg-amber-500',
    prevStatus: 'NEW',
    nextStatus: 'QUALIFIED',
  },
  {
    status: 'QUALIFIED',
    title: 'Qualified Deals',
    dotColor: 'bg-emerald-600',
    prevStatus: 'CONTACTED',
    nextStatus: 'LOST',
  },
  {
    status: 'LOST',
    title: 'Closed / Lost',
    dotColor: 'bg-zinc-400',
    prevStatus: 'QUALIFIED',
  },
];

const priorityBadges: Record<string, { label: string; dot: string; text: string }> = {
  HIGH: { label: 'P1', dot: 'bg-rose-600', text: 'text-rose-700 bg-rose-50 border-rose-200/60' },
  MEDIUM: { label: 'P2', dot: 'bg-amber-500', text: 'text-amber-700 bg-amber-50 border-amber-200/60' },
  LOW: { label: 'P3', dot: 'bg-zinc-400', text: 'text-zinc-600 bg-zinc-100 border-zinc-200/60' },
};

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => (
          <div key={col.status} className="bg-zinc-100/60 rounded-lg p-3 border border-zinc-200 animate-pulse min-h-[380px]">
            <div className="h-4 w-24 bg-zinc-200 rounded mb-3" />
            <div className="space-y-2">
              <div className="h-24 bg-white rounded-md border border-zinc-200" />
              <div className="h-24 bg-white rounded-md border border-zinc-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
      {columns.map((col) => {
        const columnLeads = leads.filter((l) => l.status === col.status);
        const columnTotalValue = columnLeads.reduce((acc, l) => acc + (l.value || 0), 0);

        return (
          <div
            key={col.status}
            className="bg-zinc-50 border border-zinc-200/90 rounded-lg p-2.5 flex flex-col min-h-[420px] max-h-[calc(100vh-14rem)] overflow-hidden shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 mb-2 px-1">
              <div className="flex items-center space-x-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${col.dotColor}`} />
                <span className="font-bold text-xs text-zinc-900 tracking-tight">
                  {col.title}
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700 tabular-numbers">
                  {columnLeads.length}
                </span>
              </div>

              <span className="text-[11px] font-mono font-medium text-zinc-500 tabular-numbers">
                {formatCurrency(columnTotalValue)}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {columnLeads.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400 font-mono border border-dashed border-zinc-200 rounded-md">
                  No prospects in this stage
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const prio = priorityBadges[lead.priority] || priorityBadges.MEDIUM;
                  return (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.12 }}
                      onClick={() => onSelectLead(lead)}
                      className="bg-white rounded-lg p-3 border border-zinc-200/80 shadow-2xs hover:border-zinc-400 transition-all cursor-pointer group"
                    >
                      {/* Top Row: Prospect & Priority */}
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className="h-6 w-6 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            {getInitials(lead.name)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-blue-600 transition-colors">
                              {lead.name}
                            </h4>
                            <p className="text-[11px] text-zinc-500 truncate flex items-center mt-0.5">
                              <Building2 className="h-2.5 w-2.5 mr-1 text-zinc-400 shrink-0" />
                              {lead.company}
                            </p>
                          </div>
                        </div>

                        <span className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${prio.text}`}>
                          <span className={`h-1 w-1 rounded-full ${prio.dot}`} />
                          <span>{prio.label}</span>
                        </span>
                      </div>

                      {/* Middle: Deal Value */}
                      {lead.value > 0 && (
                        <div className="my-1.5 text-xs font-mono font-semibold text-zinc-900 tabular-numbers">
                          {formatCurrency(lead.value)}
                        </div>
                      )}

                      {/* Bottom Row: Source & Move Stage Controls */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 text-[10px] text-zinc-400">
                        <span className="font-mono text-zinc-500">
                          {lead.source}
                        </span>

                        <div
                          className="flex items-center space-x-0.5"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {col.prevStatus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(lead.id, col.prevStatus!);
                              }}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                              title={`Move back to ${col.prevStatus}`}
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                          )}
                          {col.nextStatus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(lead.id, col.nextStatus!);
                              }}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                              title={`Advance to ${col.nextStatus}`}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
