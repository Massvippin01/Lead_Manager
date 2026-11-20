'use client';

import React from 'react';
import { LeadStats, LeadStatus } from '@/types';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';

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
    badgeColor: string;
  }[] = [
    {
      status: 'NEW',
      label: 'New Inquiries',
      count: stats.new,
      pct: newPct,
      dotColor: 'bg-sky-500',
      barColor: 'bg-sky-500',
      badgeColor: 'text-sky-800 bg-sky-50',
    },
    {
      status: 'CONTACTED',
      label: 'In Dialogue',
      count: stats.contacted,
      pct: contactedPct,
      dotColor: 'bg-amber-500',
      barColor: 'bg-amber-500',
      badgeColor: 'text-amber-800 bg-amber-50',
    },
    {
      status: 'QUALIFIED',
      label: 'Qualified Deals',
      count: stats.qualified,
      pct: qualifiedPct,
      dotColor: 'bg-emerald-600',
      barColor: 'bg-emerald-600',
      badgeColor: 'text-emerald-800 bg-emerald-50',
    },
    {
      status: 'LOST',
      label: 'Closed / Lost',
      count: stats.lost,
      pct: lostPct,
      dotColor: 'bg-zinc-400',
      barColor: 'bg-zinc-400',
      badgeColor: 'text-zinc-700 bg-zinc-100',
    },
  ];

  return (
    <div className="bg-white border border-zinc-200/90 rounded-lg p-3 shadow-2xs mb-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-zinc-900 tracking-tight flex items-center">
            Pipeline Funnel Distribution
          </span>
          <span className="text-xs font-mono text-zinc-400">
            ({stats.total} total accounts · {formatCurrency(stats.pipelineValue || 0)})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {stages.map((stage) => {
            const isSelected = activeStatus === stage.status;
            return (
              <button
                key={stage.status}
                type="button"
                onClick={() => onSelectStatus(isSelected ? undefined : stage.status)}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-xs transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-bold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                }`}
                title={`Filter by ${stage.label}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : stage.dotColor}`}
                />
                <span>
                  {stage.label}: {stage.count}{' '}
                  <span className={isSelected ? 'text-zinc-300' : 'text-zinc-400'}>
                    ({stage.pct.toFixed(0)}%)
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-segment Interactive Funnel Bar */}
      <div className="h-2.5 w-full bg-zinc-100 rounded-sm overflow-hidden flex cursor-pointer">
        {stages.map((stage) => {
          if (stage.pct <= 0) return null;
          const isSelected = activeStatus === stage.status;
          return (
            <div
              key={stage.status}
              style={{ width: `${stage.pct}%` }}
              onClick={() => onSelectStatus(isSelected ? undefined : stage.status)}
              className={`${stage.barColor} transition-all duration-150 hover:opacity-80 relative group ${
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
