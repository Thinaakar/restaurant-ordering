'use client';

import React, { useState } from 'react';
import { useMenu } from '@/hooks/use-menu';
import type { MenuItem, SpiceLevel } from '@/data/types';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AdminMenuPage() {
  const { items: itemsList, loading, createItem, updateItem, deleteItem } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [targetId, setTargetId] = useState('');

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formSpice, setFormSpice] = useState<SpiceLevel>('mild');
  const [formPrep, setFormPrep] = useState('15');

  const filteredItems = itemsList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' ? item.isAvailable : !item.isAvailable);
    const matchesType = typeFilter === 'all' || (typeFilter === 'veg' ? item.isVeg : !item.isVeg);
    return matchesSearch && matchesAvailability && matchesType;
  });

  const handleToggleAvailable = (id: string, current: boolean) => {
    void updateItem(id, { isAvailable: !current });
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setTargetId('');
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormIsVeg(true);
    setFormSpice('mild');
    setFormPrep('15');
    setIsOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setIsEditing(true);
    setTargetId(item.id);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price.toString());
    setFormIsVeg(item.isVeg);
    setFormSpice(item.spiceLevel);
    setFormPrep(item.preparationTime.toString());
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this recipe from the catalog?')) {
      void deleteItem(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const payload = {
      name: formName,
      description: formDesc,
      price: parseFloat(formPrice),
      isVeg: formIsVeg,
      spiceLevel: formSpice,
      preparationTime: parseInt(formPrep, 10),
      rating: 4.5,
      orderCount: 0,
      isAvailable: true,
    };

    if (isEditing) {
      void updateItem(targetId, payload);
    } else {
      void createItem(payload);
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">Menu Manager</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Menu loaded from Firestore via /api/menu</p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 shadow-md cursor-pointer"
        >
          <span>Add New Dish</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border border-border/40 rounded-xl bg-card p-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name..."
            className="w-full rounded-lg border border-border bg-surface-2/45 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface-2/45 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-veg</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground py-16">Loading menu…</p>
      ) : filteredItems.length > 0 ? (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/20 bg-surface-1/45 text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Dish</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Spice</th>
                  <th className="px-5 py-4">Prep Time</th>
                  <th className="px-5 py-4 text-center">Available</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-2/10 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground max-w-[280px] truncate">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-foreground">{formatCurrency(item.price)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase',
                          item.isVeg ? 'text-emerald' : 'text-red-500',
                        )}
                      >
                        {item.isVeg ? 'Veg' : 'Non-veg'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.spiceLevel}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground font-semibold">{item.preparationTime} min</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center select-none">
                        <Switch
                          checked={item.isAvailable}
                          onCheckedChange={() => handleToggleAvailable(item.id, item.isAvailable)}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-border bg-card/50 text-[10px] font-bold uppercase hover:border-gold hover:text-gold transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-border bg-card/50 text-[10px] font-bold uppercase hover:border-destructive hover:text-destructive transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-2 border border-border/40 rounded-2xl bg-card/10">
          <p className="text-base text-muted-foreground font-semibold">No menu items in database yet.</p>
        </div>
      )}

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-card border border-border text-foreground max-w-md p-6 rounded-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-center font-display font-semibold text-lg">
                {isEditing ? 'Modify Recipe' : 'Create Recipe'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 my-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground">Dish Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Chicken Tikka Masala"
                  className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground">Recipe Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe flavors..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground">Preparation Duration (minutes)</label>
                <input
                  type="number"
                  required
                  value={formPrep}
                  onChange={(e) => setFormPrep(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-4">
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-2.5 bg-surface-2/20 select-none">
                  <span className="font-bold text-muted-foreground">Is Vegetarian</span>
                  <Switch checked={formIsVeg} onCheckedChange={setFormIsVeg} />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground">Spice Index</label>
                  <select
                    value={formSpice}
                    onChange={(e) => setFormSpice(e.target.value as SpiceLevel)}
                    className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                    <option value="extra-hot">Extra-hot</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="pt-4 flex flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-card/65 py-2.5 text-[11px] font-semibold uppercase hover:bg-surface-2 transition cursor-pointer text-center text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gold py-2.5 text-[11px] font-bold uppercase tracking-wider text-black gold-gradient transition duration-300 cursor-pointer shadow-md text-center"
                >
                  Save Dish
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
