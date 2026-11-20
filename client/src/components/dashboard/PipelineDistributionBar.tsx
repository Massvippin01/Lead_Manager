'use client';

import React from 'react';
import { LeadStats, LeadStatus } from '@/types';

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

  return (
    <div className="bg-white border border-zinc-200/90 rounded-lg p-3 shadow-2xs mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-zinc-900 tracking-tight">
            Pipeline Distribution
          </span>
          <span className="text-xs font-mono text-zinc-400">
            ({stats.total} accounts)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <button
            onClick={() => onSelectStatus(activeStatus === 'NEW' ? undefined : 'NEW')}
            className={`flex items-center space-x-1 transition-colors ${
              activeStatus === 'NEW' ? 'font-bold text-zinc-900 underline' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>New: {stats.new} ({newPct.toFixed(0)}%)</span>
          </button>

          <button
            onClick={() => onSelectStatus(activeStatus === 'CONTACTED' ? undefined : 'CONTACTED')}
            className={`flex items-center space-x-1 transition-colors ${
              activeStatus === 'CONTACTED' ? 'font-bold text-zinc-900 underline' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>Contacted: {stats.contacted} ({contactedPct.toFixed(0)}%)</span>
          </button>

          <button
            onClick={() => onSelectStatus(activeStatus === 'QUALIFIED' ? undefined : 'QUALIFIED')}
            className={`flex items-center space-x-1 transition-colors ${
              activeStatus === 'QUALIFIED' ? 'font-bold text-zinc-900 underline' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Qualified: {stats.qualified} ({qualifiedPct.toFixed(0)}%)</span>
          </button>

          <button
            onClick={() => onSelectStatus(activeStatus === 'LOST' ? undefined : 'LOST')}
            className={`flex items-center space-x-1 transition-colors ${
              activeStatus === 'LOST' ? 'font-bold text-zinc-900 underline' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            <span>Lost: {stats.lost} ({lostPct.toFixed(0)}%)</span>
          </button>
        </div>
      </div>

      {/* Progress segmented bar */}
      <div className="h-2 w-full bg-zinc-100 rounded-sm overflow-hidden flex">
        {newPct > 0 && (
          <div
            style={{ width: `${newPct}%` }}
            className="bg-sky-500 hover:opacity-90 transition-all cursor-pointer"
            title={`New: ${stats.new} (${newPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'NEW' ? undefined : 'NEW')}
          />
        )}
        {contactedPct > 0 && (
          <div
            style={{ width: `${contactedPct}%` }}
            className="bg-amber-500 hover:opacity-90 transition-all cursor-pointer"
            title={`Contacted: ${stats.contacted} (${contactedPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'CONTACTED' ? undefined : 'CONTACTED')}
          />
        )}
        {qualifiedPct > 0 && (
          <div
            style={{ width: `${qualifiedPct}%` }}
            className="bg-emerald-600 hover:opacity-90 transition-all cursor-pointer"
            title={`Qualified: ${stats.qualified} (${qualifiedPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'QUALIFIED' ? undefined : 'QUALIFIED')}
          />
        )}
        {lostPct > 0 && (
          <div
            style={{ width: `${lostPct}%` }}
            className="bg-zinc-400 hover:opacity-90 transition-all cursor-pointer"
            title={`Lost: ${stats.lost} (${lostPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'LOST' ? undefined : 'LOST')}
          />
        )}
      </div>
    </div>
  );
};
