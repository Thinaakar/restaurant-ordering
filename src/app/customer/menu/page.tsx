'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { useMenu } from '@/hooks/use-menu';
import type { MenuItem, SpiceLevel } from '@/data/types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import {
  Search,
  Flame,
  Leaf,
  Plus,
  Info,
  Clock,
  Star,
  ShoppingCart,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
// Standard Dialog from @/components/ui/dialog is imported below

import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogFooter as ShadcnDialogFooter,
} from '@/components/ui/dialog';

// Professional food photography mapping with premium Unsplash images
// Curated high-quality restaurant-style food photography
const getFoodImage = (name: string) => {
  const lowercaseName = name.toLowerCase();

  // Premium Unsplash photo IDs - modern, professional restaurant food photography
  const imageMap: Record<string, string> = {
    // Starters - Grilled & Crispy items
    'paneer tikka': '1599487488170-d11ec9c172f0',      // Grilled paneer with vegetables
    'chicken 65': '1555939594-58d7cb561c1d',          // Crispy fried chicken
    'spring rolls': '1542519227-4d7e0f6f1f4e',        // Crispy rolls
    'fish amritsari': '1519708227418-c8fd9a32b7a2',   // Battered fried fish
    'hara bhara': '1585518459031-7f745f0e1f4d',       // Green vegetable patties
    
    // Curries & Main Course - Rich, creamy gravies
    'butter chicken': '1645112411341-3c8dbb5e0b1f',   // Creamy chicken curry
    'paneer butter': '1543352634-2c19c7300c00',       // Cottage cheese curry
    'mutton rogan': '1546069901-ba9599a7e63c',        // Lamb curry
    'dal makhani': '1595521885411-cd4628902d4a',      // Black lentils
    'prawn masala': '1519046904884-53103b34b206',     // Prawn curry
    'palak paneer': '1546069901-ba9599a7e63c',        // Spinach and cheese
    
    // Biryani & Rice - Aromatic rice dishes
    'biryani': '1633945274405-b6c80a20379c',          // Fragrant biryani
    'jeera rice': '1546069901-ba9599a7e63c',          // Cumin rice
    
    // Breads - Tandoori baked items
    'naan': '1601303584126-269c2d17c76a',             // Traditional naan
    'roti': '1586190936292-a3a7e4941f0a',            // Whole wheat roti
    'cheese naan': '1601303584126-269c2d17c76a',      // Cheese naan
    
    // Beverages
    'lassi': '1570197788417-0e93323c93bd',            // Yogurt drink
    'chai': '1561336313-0bd5e0b27ec8',                // Spiced tea
    'lime soda': '1599599810694-e5ead3db0fec',        // Fresh drink
    'coffee': '1517668712202-51db33e62f28',           // Iced coffee
    
    // Desserts - Sweet treats
    'gulab jamun': '1589119908995-c6837fa14848',      // Milk dumplings
    'rasmalai': '1578985545062-20fbd112522f',         // Cheese patties
    'kulfi': '1563805042-7684c019e0cb',               // Indian ice cream
    'brownie': '1606308604912-d4ac00c69752',          // Chocolate brownie
  };

  const entry = Object.entries(imageMap).find(([key]) => lowercaseName.includes(key));
  const photoId = entry ? entry[1] : '1546069901-ba9599a7e63c';

  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
};

// Use global formatCurrency which now formats in dollars
// No need for separate USD formatter anymore

export default function MenuBrowsingPage() {
  const router = useRouter();
  const { tableId, addItem, items: cartItems, subtotal, itemCount } = useCart();

  // Route back to select table if not chosen
  useEffect(() => {
    if (!tableId) {
      router.push('/customer');
    }
  }, [tableId, router]);

  const { items: menuItems } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Customization Dialog State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Filtering Logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;

    return matchesSearch && matchesVeg && item.isAvailable;
  });

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setQuantity(1);
    setNotes('');
  };

  const handleAddToCart = () => {
    if (customizingItem) {
      addItem(customizingItem, quantity, notes);
      setCustomizingItem(null);
    }
  };

  const getSpiceColor = (spice: SpiceLevel) => {
    switch (spice) {
      case 'mild':
        return 'text-emerald-400';
      case 'medium':
        return 'text-amber-500';
      case 'hot':
        return 'text-orange-500';
      case 'extra-hot':
        return 'text-red-500 animate-pulse';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative pb-24 max-w-6xl mx-auto space-y-8">

      {/* Table Welcome Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/20 pb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">Our Exquisite Menu</h1>
          <p className="text-sm text-muted-foreground mt-1">Crafted with authentic hand-selected spices</p>
        </div>

        {/* Veg-only filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full rounded-lg border border-border bg-card/65 pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Veg-only toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={cn(
              "px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none",
              vegOnly
                ? "border-emerald/40 bg-emerald/10 text-emerald"
                : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-gold/30"
            )}
          >
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/45 px-4 py-3 text-xs text-muted-foreground">`r`n        <span className="font-bold uppercase tracking-wider">Showing all available food items</span>`r`n        <span>{filteredItems.length} dishes</span>`r`n      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-scale-in">
          {filteredItems.map((item) => {
            const hasInCart = cartItems.find((ci) => ci.menuItem.id === item.id);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-6 shadow-md transition-all duration-500 hover:border-gold/40 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.1)]"
              >
                {/* Information Body - Premium Typography */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-display font-bold text-foreground text-lg leading-tight group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Cost & Add CTA */}
                <div className="mt-5 pt-4 border-t border-border/10 flex items-center justify-between bg-gradient-to-r from-card/30 to-transparent">
                  <span className="text-2xl font-display font-bold text-gold">
                    {formatCurrency(item.price)}
                  </span>

                  <button
                    onClick={() => handleOpenCustomize(item)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer shadow-sm",
                      hasInCart
                        ? "bg-gold border-gold text-black hover:shadow-md"
                        : "border-border/60 hover:border-gold hover:text-gold hover:bg-gold/5 bg-surface-2/50 text-foreground"
                    )}
                  >
                    <Plus className={cn("h-5 w-5", hasInCart && "stroke-[3px]")} />
                  </button>
                </div>

                {/* Cart Quantity Indicator Badge */}
                {hasInCart && (
                  <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black border-2 border-card animate-scale-in shadow-lg">
                    {hasInCart.quantity}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-2 border border-border/40 rounded-2xl bg-card/10">
          <p className="text-base text-muted-foreground font-semibold">No culinary dishes matched your filters.</p>
          <p className="text-xs text-muted-foreground/60">Try searching for other keywords or clearing your Veg-only state.</p>
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 w-auto md:min-w-[450px] animate-slide-up">
          <div className="flex items-center justify-between gap-6 rounded-full border border-gold/45 bg-surface-1/95 px-6 py-4 shadow-xl backdrop-blur-md glow-gold">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/20">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Your Order</p>
                <p className="text-sm font-bold text-foreground">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} <span className="text-border mx-1">|</span> {formatCurrency(subtotal)}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/customer/cart')}
              className="flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 cursor-pointer shadow-md"
            >
              <span>Review Order</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Customization Details Dialog */}
      {customizingItem && (
        <ShadcnDialog open={!!customizingItem} onOpenChange={(open) => !open && setCustomizingItem(null)}>
          <ShadcnDialogContent className="bg-card/95 backdrop-blur-xl border border-border/50 text-foreground max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl">
            <div className="relative h-56 w-full">
              <Image
                src={getFoodImage(customizingItem.name)}
                alt={customizingItem.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 448px"
                priority={true}
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 224'%3E%3Crect fill='%23374151' width='400' height='224'/%3E%3C/svg%3E"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>

            <div className="p-6 space-y-6">
              <ShadcnDialogHeader>
                <ShadcnDialogTitle className="text-center font-display font-semibold text-xl">
                  Add {customizingItem.name}
                </ShadcnDialogTitle>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {customizingItem.description}
                </p>
              </ShadcnDialogHeader>

              <div className="space-y-6">
                {/* Quantity selectors */}
                <div className="flex items-center justify-between border-y border-border/40 py-3.5">
                  <span className="text-sm font-semibold">Select Quantity</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-foreground font-semibold hover:border-gold hover:text-gold transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-base font-bold w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-foreground font-semibold hover:border-gold hover:text-gold transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Special chef notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-gold" />
                    <span>Special Cooking Instructions</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Less spicy, make it extra dry, allergy warnings..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-surface-2/45 p-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                  />
                </div>
              </div>

              <ShadcnDialogFooter className="flex flex-row justify-between gap-3 mt-2">
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="flex-1 rounded-lg border border-border bg-card/65 py-3 text-xs font-semibold uppercase hover:bg-surface-2 transition cursor-pointer text-center text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-102 transition duration-300 cursor-pointer shadow-md text-center"
                >
                  Add {formatCurrency(customizingItem.price * quantity)}
                </button>
              </ShadcnDialogFooter>
            </div>
          </ShadcnDialogContent>
        </ShadcnDialog>
      )}

    </div>
  );
}
