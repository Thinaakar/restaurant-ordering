'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  isPositive?: boolean;
  icon?: React.ReactNode;
  color?: 'gold' | 'emerald' | 'blue' | 'amber' | 'ruby';
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive,
  icon,
  color = 'gold',
  className,
}: StatCardProps) {
  const colorClasses = {
    gold: 'border-gold/20 text-gold bg-gold/10',
    emerald: 'border-emerald/20 text-emerald bg-emerald/10',
    blue: 'border-blue-500/20 text-blue-400 bg-blue-500/10',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/10',
    ruby: 'border-ruby/20 text-ruby bg-ruby/10',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md hover:shadow-gold/5',
        className
      )}
    >
      {/* Top gradient line */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', colorClasses[color])} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground tabular-nums">{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg border', colorClasses[color])}>
          {icon || <div className="h-5 w-5" />}
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-ruby" />
          )}
          <span className={cn('text-xs font-bold uppercase', isPositive ? 'text-emerald' : 'text-ruby')}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-[10px] text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
