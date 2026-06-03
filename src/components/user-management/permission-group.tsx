'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PermissionModuleGroup } from '@/data/permission-modules';

interface PermissionGroupProps {
  module: PermissionModuleGroup;
  selected: string[];
  onChange: (keys: string[], checked: boolean) => void;
  readOnly?: boolean;
  defaultExpanded?: boolean;
}

export function PermissionGroup({
  module,
  selected,
  onChange,
  readOnly = false,
  defaultExpanded = false,
}: PermissionGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const moduleKeys = module.permissions.map((p) => p.key);
  const allSelected = moduleKeys.every((k) => selected.includes(k));
  const someSelected = moduleKeys.some((k) => selected.includes(k));

  const toggleModule = () => {
    if (readOnly) return;
    onChange(moduleKeys, !allSelected);
  };

  const togglePermission = (key: string) => {
    if (readOnly) return;
    onChange([key], !selected.includes(key));
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden transition-all duration-200">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/30">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <label className="flex flex-1 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            onChange={toggleModule}
            disabled={readOnly}
            className="h-4 w-4 rounded border-border text-gold focus:ring-gold/30 disabled:opacity-50"
          />
          <span className="text-sm font-semibold text-foreground">{module.label}</span>
        </label>
        <span className="text-[11px] font-medium text-muted-foreground">
          {moduleKeys.filter((k) => selected.includes(k)).length}/{moduleKeys.length}
        </span>
      </div>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 border-t border-border/40 px-4 py-3 pl-12">
            {module.permissions.map((perm) => (
              <label
                key={perm.key}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-muted/40'
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(perm.key)}
                  onChange={() => togglePermission(perm.key)}
                  disabled={readOnly}
                  className="h-4 w-4 rounded border-border text-gold focus:ring-gold/30 disabled:opacity-50"
                />
                <span className="text-muted-foreground">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
