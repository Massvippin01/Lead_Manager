'use client';

import React from 'react';
import { LeadStats, LeadStatus } from '@/types';
import { Users, Flame, CheckCircle2, TrendingUp, PhoneCall, Sparkles } from 'lucide-react';

interface StatsCardsProps {
  stats: LeadStats | null;
  isLoading: boolean;
  activeStatus?: LeadStatus;
  activePriority?: string;
  onFilter: (updates: {
    status?: LeadStatus;
    priority?: any;
    preset?: any;
    page: number;
  }) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  isLoading,
  activeStatus,
  activePriority,
  onFilter,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const isAllActive = !activeStatus && !activePriority;

  const cards = [
    {
      title: 'Total Pipeline',
      value: stats?.total ?? 0,
      subtext: stats?.pipelineValue ? formatCurrency(stats.pipelineValue) : '$0',
      icon: Users,
      dotColor: 'bg-zinc-700',
      iconBg: 'bg-zinc-100 text-zinc-700',
      accentClass: 'border-t-[3px] border-t-zinc-800',
      activeClass: 'ring-2 ring-zinc-800 border-zinc-800 bg-white shadow-sm',
      isActive: isAllActive,
      onClick: () =>
        onFilter({
          status: undefined,
          priority: undefined,
          preset: undefined,
          page: 1,
        }),
    },
    {
      title: 'New Inquiries',
      value: stats?.new ?? 0,
      subtext: 'Awaiting discovery',
      icon: Sparkles,
      dotColor: 'bg-sky-500',
      iconBg: 'bg-sky-50 text-sky-600',
      accentClass: 'border-t-[3px] border-t-sky-500',
      activeClass: 'ring-2 ring-sky-500 border-sky-400 bg-white shadow-sm',
      isActive: activeStatus === 'NEW',
      onClick: () =>
        onFilter({
          status: activeStatus === 'NEW' ? undefined : 'NEW',
          preset: undefined,
          page: 1,
        }),
    },
    {
      title: 'In Dialogue',
      value: stats?.contacted ?? 0,
      subtext: 'Active outreach',
      icon: PhoneCall,
      dotColor: 'bg-amber-500',
      iconBg: 'bg-amber-50 text-amber-600',
      accentClass: 'border-t-[3px] border-t-amber-500',
      activeClass: 'ring-2 ring-amber-500 border-amber-400 bg-white shadow-sm',
      isActive: activeStatus === 'CONTACTED',
      onClick: () =>
        onFilter({
          status: activeStatus === 'CONTACTED' ? undefined : 'CONTACTED',
          preset: undefined,
          page: 1,
        }),
    },
    {
      title: 'Qualified Deals',
      value: stats?.qualified ?? 0,
      subtext: stats?.qualifiedValue ? formatCurrency(stats.qualifiedValue) : '$0',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
      accentClass: 'border-t-[3px] border-t-emerald-600',
      activeClass: 'ring-2 ring-emerald-600 border-emerald-500 bg-white shadow-sm',
      isActive: activeStatus === 'QUALIFIED',
      onClick: () =>
        onFilter({
          status: activeStatus === 'QUALIFIED' ? undefined : 'QUALIFIED',
          preset: undefined,
          page: 1,
        }),
    },
    {
      title: 'P1 Hot Accounts',
      value: stats?.highPriority ?? 0,
      subtext: 'Urgent priority',
      icon: Flame,
      dotColor: 'bg-rose-500',
      iconBg: 'bg-rose-50 text-rose-600',
      accentClass: 'border-t-[3px] border-t-rose-500',
      activeClass: 'ring-2 ring-rose-500 border-rose-400 bg-white shadow-sm',
      isActive: activePriority === 'HIGH',
      onClick: () =>
        onFilter({
          priority: activePriority === 'HIGH' ? undefined : 'HIGH',
          preset: activePriority === 'HIGH' ? undefined : 'P1',
          page: 1,
        }),
    },
    {
      title: 'Win Rate',
      value: stats?.conversionRate ?? '0%',
      subtext: 'Qualification ratio',
      icon: TrendingUp,
      dotColor: 'bg-indigo-600',
      iconBg: 'bg-indigo-50 text-indigo-600',
      accentClass: 'border-t-[3px] border-t-indigo-600',
      activeClass: '',
      isActive: false,
      onClick: () => {},
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isInteractive = card.title !== 'Win Rate';

        return (
          <button
            key={card.title}
            type="button"
            disabled={!isInteractive}
            onClick={card.onClick}
            className={`text-left rounded-xl border p-2.5 sm:p-3.5 transition-all duration-150 ${card.accentClass} ${
              card.isActive && isInteractive
                ? card.activeClass
                : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 shadow-2xs'
            } ${!isInteractive ? 'cursor-default' : 'cursor-pointer group'}`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5 sm:mb-2">
              <span className="flex items-center space-x-1.5 truncate">
                <span className={`h-1.5 w-1.5 rounded-full ${card.dotColor}`} />
                <span className="truncate text-[11px] sm:text-xs">{card.title}</span>
              </span>
              <div className={`p-1 rounded-md ${card.iconBg} shrink-0 transition-transform group-hover:scale-105`}>
                <Icon className="h-3 w-3" />
              </div>
            </div>

            <div className="flex items-baseline space-x-1 my-0.5 sm:my-1">
              {isLoading ? (
                <div className="h-7 w-14 bg-slate-100 rounded animate-pulse my-0.5" />
              ) : (
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-numbers">
                  {card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 truncate font-medium">
              {card.subtext}
            </p>
          </button>
        );
      })}
    </div>
  );
};
