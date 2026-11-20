'use client';

import React from 'react';
import { LeadStats, LeadStatus } from '@/types';
import { Users, UserPlus, PhoneCall, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

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
      subtext: 'All recorded leads',
      icon: Users,
      dotColor: 'bg-slate-900',
      isActive: activeStatus === undefined,
    },
    {
      status: 'NEW',
      title: 'New',
      value: stats?.new ?? 0,
      subtext: 'Awaiting discovery',
      icon: UserPlus,
      dotColor: 'bg-sky-500',
      isActive: activeStatus === 'NEW',
    },
    {
      status: 'CONTACTED',
      title: 'Contacted',
      value: stats?.contacted ?? 0,
      subtext: 'In active dialogue',
      icon: PhoneCall,
      dotColor: 'bg-amber-500',
      isActive: activeStatus === 'CONTACTED',
    },
    {
      status: 'QUALIFIED',
      title: 'Qualified',
      value: stats?.qualified ?? 0,
      subtext: 'Ready for deal close',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      isActive: activeStatus === 'QUALIFIED',
    },
    {
      status: 'LOST',
      title: 'Lost',
      value: stats?.lost ?? 0,
      subtext: 'Closed uncoverted',
      icon: XCircle,
      dotColor: 'bg-rose-500',
      isActive: activeStatus === 'LOST',
    },
    {
      status: undefined,
      title: 'Win Rate',
      value: stats?.conversionRate ?? '0%',
      subtext: 'Qualified ratio',
      icon: TrendingUp,
      dotColor: 'bg-indigo-600',
      isActive: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = card.title !== 'Win Rate';

        return (
          <button
            key={card.title}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onFilterStatus(card.status)}
            className={`text-left rounded-xl border p-3.5 transition-all duration-150 ${
              card.isActive && card.title !== 'Win Rate'
                ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-sm'
                : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
            } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
              <span className="flex items-center space-x-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${card.dotColor}`} />
                <span>{card.title}</span>
              </span>
              <Icon className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <div className="flex items-baseline space-x-1">
              {isLoading ? (
                <div className="h-7 w-12 bg-slate-100 animate-pulse rounded my-0.5" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-numbers">
                  {card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {card.subtext}
            </p>
          </button>
        );
      })}
    </div>
  );
};
