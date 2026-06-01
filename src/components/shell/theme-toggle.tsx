'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'group relative inline-flex h-10 w-[4.6rem] shrink-0 items-center rounded-full border border-border/70 bg-card/70 p-1 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 hover:border-gold/70 hover:shadow-lg hover:shadow-gold/10 focus-visible:ring-2 focus-visible:ring-ring/50',
        'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-gold/15 before:via-transparent before:to-sapphire/15 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
        className
      )}
    >
      <span className="sr-only">{isDark ? 'Dark mode enabled' : 'Light mode enabled'}</span>
      <span className="relative z-10 flex w-full items-center justify-between px-1 text-muted-foreground">
        <Sun
          className={cn(
            'h-4 w-4 transition-all duration-300',
            !isDark ? 'scale-110 text-gold drop-shadow' : 'scale-90 opacity-55'
          )}
        />
        <Moon
          className={cn(
            'h-4 w-4 transition-all duration-300',
            isDark ? 'scale-110 text-gold drop-shadow' : 'scale-90 opacity-55'
          )}
        />
      </span>
      <span
        className={cn(
          'absolute top-1 z-0 h-8 w-8 rounded-full border border-white/20 bg-background shadow-md shadow-black/10 transition-all duration-300 ease-out',
          'after:absolute after:inset-1 after:rounded-full after:bg-gradient-to-br after:from-gold/35 after:to-transparent after:opacity-70',
          isDark ? 'translate-x-[2.1rem] bg-surface-2 shadow-gold/10' : 'translate-x-0 bg-white',
          !mounted && 'transition-none'
        )}
      />
    </button>
  );
}
