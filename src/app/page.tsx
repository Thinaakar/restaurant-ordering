'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, Stars, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-1 via-background to-background flex flex-col justify-between overflow-hidden">
      
      {/* Background visual graphics */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1469&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />

      {/* Top Header Branding */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-semibold uppercase tracking-[0.3em] gold-text">
            Aura
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
        </div>
        <Link href="/login">
          <button className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-gold transition">
            Staff Portal
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 flex flex-col items-center text-center max-w-3xl relative z-10 my-auto space-y-8">
        
        {/* Luxury top badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 text-xs text-gold animate-fade-in">
          <Stars className="h-4 w-4 fill-current text-gold animate-pulse-glow" />
          <span className="font-semibold uppercase tracking-wider">A Culinary Masterpiece</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 animate-slide-up stagger-1">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-light tracking-tight text-foreground leading-[1.1]">
            Experience <br className="hidden sm:inline" />
            <span className="font-semibold italic font-display gold-text">Fine Dining</span> Reimagined
          </h1>
          <p className="text-sm md:text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
            Welcome to Aura. Indulge in an exquisite gastronomic journey combining traditional recipes, fresh organic ingredients, and luxury table-side operations.
          </p>
        </div>

        {/* Operations Portal - Centered */}
        <div className="w-full max-w-sm pt-6 animate-scale-in stagger-2">
          <Link href="/login" className="group">
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border/50 bg-card/45 backdrop-blur transition-all duration-300 hover:border-gold/45 hover:shadow-lg hover:shadow-gold/5 text-center h-full relative overflow-hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/20 mb-4 group-hover:scale-110 transition duration-300">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition">
                Operations Portal
              </h3>
              <p className="text-xs text-muted-foreground/75 mt-2 leading-relaxed">
                Access interactive kitchen Kanban boards, waiter queue screens, and administrative analytical dashboards.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold group-hover:translate-x-1.5 transition">
                <span>Staff Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer Details */}
      <footer className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground/60 border-t border-border/10 relative z-10">
        <p>© {new Date().getFullYear()} Aura Fine Dining & Co. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-medium">Modern Gastronomy & Operations</p>
      </footer>

    </main>
  );
}
