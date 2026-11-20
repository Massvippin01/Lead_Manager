'use client';

import React from 'react';
import { LeadStats, LeadStatus } from '@/types';
import { Users, Flame, CheckCircle2, TrendingUp, PhoneCall, Sparkles } from 'lucide-react';

interface StatsCardsProps {
  stats: LeadStats | null;
  isLoading: boolean;
  activeStatus?: LeadStatus;
  onFilterStatus: (status?: LeadStatus) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  isLoading,
  activeStatus,
  onFilterStatus,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const cards: {
    status?: LeadStatus;
    title: string;
    value: number | string;
    subtext: string;
    icon: any;
    dotColor: string;
    isActive: boolean;
  }[] = [
    {
      status: undefined,
      title: 'Total Pipeline',
      value: stats?.total ?? 0,
      subtext: stats?.pipelineValue ? formatCurrency(stats.pipelineValue) : '$0',
      icon: Users,
      dotColor: 'bg-zinc-900',
      isActive: activeStatus === undefined,
    },
    {
      status: 'NEW',
      title: 'New Inquiries',
      value: stats?.new ?? 0,
      subtext: 'Awaiting discovery',
      icon: Sparkles,
      dotColor: 'bg-sky-500',
      isActive: activeStatus === 'NEW',
    },
    {
      status: 'CONTACTED',
      title: 'In Dialogue',
      value: stats?.contacted ?? 0,
      subtext: 'Active outreach',
      icon: PhoneCall,
      dotColor: 'bg-amber-500',
      isActive: activeStatus === 'CONTACTED',
    },
    {
      status: 'QUALIFIED',
      title: 'Qualified Deals',
      value: stats?.qualified ?? 0,
      subtext: stats?.qualifiedValue ? formatCurrency(stats.qualifiedValue) : '$0',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-600',
      isActive: activeStatus === 'QUALIFIED',
    },
    {
      status: undefined,
      title: 'P1 Hot Accounts',
      value: stats?.highPriority ?? 0,
      subtext: 'Urgent priority',
      icon: Flame,
      dotColor: 'bg-rose-500',
      isActive: false,
    },
    {
      status: undefined,
      title: 'Win Rate',
      value: stats?.conversionRate ?? '0%',
      subtext: 'Lead qualification ratio',
      icon: TrendingUp,
      dotColor: 'bg-indigo-600',
      isActive: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = card.status !== undefined || card.title === 'Total Pipeline';

        return (
          <button
            key={card.title}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onFilterStatus(card.status)}
            className={`text-left rounded-lg border p-3 transition-all duration-150 ${
              card.isActive && isClickable
                ? 'bg-white border-zinc-900 ring-1 ring-zinc-900 shadow-2xs'
                : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/60 shadow-2xs'
            } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
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
                <div className="h-6 w-10 bg-zinc-100 animate-pulse rounded my-0.5" />
              ) : (
                <span className="text-xl font-bold tracking-tight text-zinc-900 font-mono tabular-numbers">
                  {card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] font-mono text-zinc-400 mt-1 truncate">
              {card.subtext}
            </p>
          </button>
        );
      })}
    </div>
  );
};
