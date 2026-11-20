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
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-900 tracking-tight">
            Pipeline Distribution
          </span>
          <span className="text-xs text-slate-500 ml-2">
            ({stats.total} total leads recorded)
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <button
            onClick={() => onSelectStatus(activeStatus === 'NEW' ? undefined : 'NEW')}
            className={`flex items-center space-x-1.5 transition-colors ${
              activeStatus === 'NEW' ? 'font-bold text-sky-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>New: {stats.new} ({newPct.toFixed(0)}%)</span>
          </button>

          <button
            onClick={() => onSelectStatus(activeStatus === 'CONTACTED' ? undefined : 'CONTACTED')}
            className={`flex items-center space-x-1.5 transition-colors ${
              activeStatus === 'CONTACTED' ? 'font-bold text-amber-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Contacted: {stats.contacted} ({contactedPct.toFixed(0)}%)</span>
          </button>

          <button
            onClick={() => onSelectStatus(activeStatus === 'QUALIFIED' ? undefined : 'QUALIFIED')}
            className={`flex items-center space-x-1.5 transition-colors ${
              activeStatus === 'QUALIFIED' ? 'font-bold text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Qualified: {stats.qualified} ({qualifiedPct.toFixed(0)}%)</span>
          </button>

          <button
            onClick={() => onSelectStatus(activeStatus === 'LOST' ? undefined : 'LOST')}
            className={`flex items-center space-x-1.5 transition-colors ${
              activeStatus === 'LOST' ? 'font-bold text-rose-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Lost: {stats.lost} ({lostPct.toFixed(0)}%)</span>
          </button>
        </div>
      </div>

      {/* Progress segmented bar */}
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {newPct > 0 && (
          <div
            style={{ width: `${newPct}%` }}
            className="bg-sky-500 hover:brightness-110 transition-all cursor-pointer"
            title={`New: ${stats.new} (${newPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'NEW' ? undefined : 'NEW')}
          />
        )}
        {contactedPct > 0 && (
          <div
            style={{ width: `${contactedPct}%` }}
            className="bg-amber-500 hover:brightness-110 transition-all cursor-pointer"
            title={`Contacted: ${stats.contacted} (${contactedPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'CONTACTED' ? undefined : 'CONTACTED')}
          />
        )}
        {qualifiedPct > 0 && (
          <div
            style={{ width: `${qualifiedPct}%` }}
            className="bg-emerald-500 hover:brightness-110 transition-all cursor-pointer"
            title={`Qualified: ${stats.qualified} (${qualifiedPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'QUALIFIED' ? undefined : 'QUALIFIED')}
          />
        )}
        {lostPct > 0 && (
          <div
            style={{ width: `${lostPct}%` }}
            className="bg-rose-500 hover:brightness-110 transition-all cursor-pointer"
            title={`Lost: ${stats.lost} (${lostPct.toFixed(1)}%)`}
            onClick={() => onSelectStatus(activeStatus === 'LOST' ? undefined : 'LOST')}
          />
        )}
      </div>
    </div>
  );
};
