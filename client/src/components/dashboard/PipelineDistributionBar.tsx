'use client';

import React from 'react';
import { LeadStats, LeadStatus } from '@/types';
import { ArrowRight, Sparkles, Filter, BarChart3 } from 'lucide-react';

interface PipelineDistributionBarProps {
  stats: LeadStats | null;
  activeStatus?: LeadStatus;
  onSelectStatus: (status?: LeadStatus) => void;
}

export const PipelineDistributionBar: React.FC<PipelineDistributionBarProps> = ({
  stats,
  activeStatus,
  onSelectStatus,
}) => {
  if (!stats || stats.total === 0) return null;

  const newPct = (stats.new / stats.total) * 100;
  const contactedPct = (stats.contacted / stats.total) * 100;
  const qualifiedPct = (stats.qualified / stats.total) * 100;
  const lostPct = (stats.lost / stats.total) * 100;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const stages: {
    status: LeadStatus;
    label: string;
    count: number;
    pct: number;
    dotColor: string;
    barColor: string;
  }[] = [
    {
      status: 'NEW',
      label: 'New Inquiries',
      count: stats.new,
      pct: newPct,
      dotColor: 'bg-sky-500',
      barColor: 'bg-sky-500',
    },
    {
      status: 'CONTACTED',
      label: 'In Dialogue',
      count: stats.contacted,
      pct: contactedPct,
      dotColor: 'bg-amber-500',
      barColor: 'bg-amber-500',
    },
    {
      status: 'QUALIFIED',
      label: 'Qualified Deals',
      count: stats.qualified,
      pct: qualifiedPct,
      dotColor: 'bg-emerald-600',
      barColor: 'bg-emerald-600',
    },
    {
      status: 'LOST',
      label: 'Closed / Lost',
      count: stats.lost,
      pct: lostPct,
      dotColor: 'bg-slate-400',
      barColor: 'bg-slate-400',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm mb-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-slate-100 text-slate-700">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Pipeline Funnel Distribution
          </span>
          <span className="text-xs font-mono text-slate-400">
            ({stats.total} total accounts · {formatCurrency(stats.pipelineValue || 0)})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {stages.map((stage) => {
            const isSelected = activeStatus === stage.status;
            return (
              <button
                key={stage.status}
                type="button"
                onClick={() => onSelectStatus(isSelected ? undefined : stage.status)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
                }`}
                title={`Filter by ${stage.label}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : stage.dotColor}`}
                />
                <span className="font-sans font-medium">{stage.label}:</span>
                <span className="font-bold">{stage.count}</span>
                <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                  ({stage.pct.toFixed(0)}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-segment Interactive Funnel Bar with gaps and rounded edges */}
      <div className="h-3.5 w-full bg-slate-100/90 rounded-lg overflow-hidden flex gap-0.5 p-0.5 cursor-pointer">
        {stages.map((stage) => {
          if (stage.pct <= 0) return null;
          const isSelected = activeStatus === stage.status;
          return (
            <div
              key={stage.status}
              style={{ width: `${stage.pct}%` }}
              onClick={() => onSelectStatus(isSelected ? undefined : stage.status)}
              className={`${stage.barColor} h-full rounded-sm transition-all duration-200 hover:opacity-85 hover:scale-y-105 ${
                activeStatus && !isSelected ? 'opacity-30' : 'opacity-100'
              }`}
              title={`${stage.label}: ${stage.count} (${stage.pct.toFixed(1)}%) - Click to filter`}
            />
          );
        })}
      </div>
    </div>
  );
};
