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

  const cards: {
    title: string;
    value: number | string;
    subtext: string;
    icon: any;
    dotColor: string;
    isActive: boolean;
    onClick: () => void;
  }[] = [
    {
      title: 'Total Pipeline',
      value: stats?.total ?? 0,
      subtext: stats?.pipelineValue ? formatCurrency(stats.pipelineValue) : '$0',
      icon: Users,
      dotColor: 'bg-zinc-900',
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
      subtext: 'Lead qualification ratio',
      icon: TrendingUp,
      dotColor: 'bg-indigo-600',
      isActive: false,
      onClick: () => {},
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isInteractive = card.title !== 'Win Rate';

        return (
          <button
            key={card.title}
            type="button"
            disabled={!isInteractive}
            onClick={card.onClick}
            className={`text-left rounded-lg border p-3 transition-all duration-150 ${
              card.isActive && isInteractive
                ? 'bg-white border-zinc-900 ring-1 ring-zinc-900 shadow-2xs'
                : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/60 shadow-2xs'
            } ${!isInteractive ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-1.5">
              <span className="flex items-center space-x-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${card.dotColor}`} />
                <span className="truncate">{card.title}</span>
              </span>
              <Icon className="h-3 w-3 text-zinc-400 shrink-0" />
            </div>

            <div className="flex items-baseline space-x-1">
              {isLoading ? (
                <div className="h-6 w-12 bg-zinc-100 rounded animate-pulse my-0.5" />
              ) : (
                <span className="text-xl font-bold tracking-tight text-zinc-900 font-mono tabular-numbers">
                  {card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-medium">
              {card.subtext}
            </p>
          </button>
        );
      })}
    </div>
  );
};
