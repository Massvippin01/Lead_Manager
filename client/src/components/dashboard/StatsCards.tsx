'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LeadStats } from '@/types';
import { Users, UserPlus, PhoneCall, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: LeadStats | null;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: 'Total Pipeline',
      value: stats?.total ?? 0,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      lightColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
      description: 'Active recorded leads',
    },
    {
      title: 'New Inquiries',
      value: stats?.new ?? 0,
      icon: UserPlus,
      color: 'from-sky-500 to-cyan-600',
      lightColor: 'bg-sky-50 text-sky-700 border-sky-200/60',
      description: 'Awaiting first touch',
    },
    {
      title: 'Contacted',
      value: stats?.contacted ?? 0,
      icon: PhoneCall,
      color: 'from-amber-500 to-orange-600',
      lightColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
      description: 'Conversations underway',
    },
    {
      title: 'Qualified',
      value: stats?.qualified ?? 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      description: 'Ready for deal close',
    },
    {
      title: 'Lost',
      value: stats?.lost ?? 0,
      icon: XCircle,
      color: 'from-rose-500 to-red-600',
      lightColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
      description: 'Closed without conversion',
    },
    {
      title: 'Win Rate',
      value: stats?.conversionRate ?? '0%',
      icon: TrendingUp,
      color: 'from-violet-600 to-purple-600',
      lightColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
      description: 'Qualified vs Total',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <div className={`p-1.5 rounded-lg border ${card.lightColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-1">
              {isLoading ? (
                <div className="h-7 w-12 bg-slate-200 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 truncate">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
