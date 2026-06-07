"use client";

import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MasterDataStatus } from "@/data/menu-master-data";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MasterDataRow {
  id: string;
  label: string;
  status: MasterDataStatus;
  isSystem?: boolean;
}

interface MasterDataSectionProps {
  title: string;
  description: string;
  itemLabel: string;
  items: MasterDataRow[];
  loading?: boolean;
  showVegToggle?: boolean;
  onAdd: (input: { label: string; isVeg?: boolean }) => void | Promise<unknown>;
  onUpdate: (
    id: string,
    patch: { label?: string; status?: MasterDataStatus; isVeg?: boolean },
  ) => void | Promise<unknown>;
  onDelete: (id: string) => Promise<boolean>;
}

function StatusBadge({ status }: { status: MasterDataStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        status === "active"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-muted text-muted-foreground border-border",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" ? "bg-emerald-500" : "bg-muted-foreground",
        )}
      />
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

export function MasterDataSection({
  title,
  description,
  itemLabel,
  items,
  loading,
  showVegToggle,
  onAdd,
  onUpdate,
  onDelete,
}: MasterDataSectionProps) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<MasterDataRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MasterDataRow | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [label, setLabel] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, search]);

  const openAdd = () => {
    setLabel("");
    setIsVeg(true);
    setError("");
    setModal("add");
  };

  const openEdit = (item: MasterDataRow) => {
    setEditTarget(item);
    setLabel(item.label);
    setIsVeg(true);
    setError("");
    setModal("edit");
  };

  const submitAdd = async () => {
    if (!label.trim()) {
      setError(`${itemLabel} name is required.`);
      return;
    }
    try {
      await onAdd({ label: label.trim(), isVeg: showVegToggle ? isVeg : undefined });
      setModal(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add item.");
    }
  };

  const submitEdit = async () => {
    if (!editTarget) return;
    if (!label.trim()) {
      setError(`${itemLabel} name is required.`);
      return;
    }
    try {
      await onUpdate(editTarget.id, { label: label.trim() });
      setModal(null);
      setEditTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update item.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await onDelete(deleteTarget.id);
    if (!ok) {
      setDeleteError("Cannot delete: item is system-defined or not found.");
      return;
    }
    setDeleteTarget(null);
    setDeleteError("");
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70 mb-2 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-gold/60" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${itemLabel.toLowerCase()}s...`}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Add {itemLabel}
          </button>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          {loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60">
                    {["Name", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-muted-foreground text-sm">
                        No {itemLabel.toLowerCase()}s found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{item.label}</span>
                            {item.isSystem && (
                              <span className="text-[10px] uppercase font-bold text-muted-foreground border border-border rounded px-1.5 py-0.5">
                                System
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdate(item.id, {
                                status: item.status === "active" ? "inactive" : "active",
                              })
                            }
                          >
                            <StatusBadge status={item.status} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              title="Edit"
                              className="p-1.5 rounded-lg border border-border bg-card/50 text-muted-foreground hover:border-gold hover:text-gold transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {!item.isSystem && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteError("");
                                  setDeleteTarget(item);
                                }}
                                title="Delete"
                                className="p-1.5 rounded-lg border border-border bg-card/50 text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={modal === "add"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="sm:max-w-md bg-card border border-border">
          <DialogHeader>
            <DialogTitle>Add {itemLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Name</label>
              <input
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  setError("");
                }}
                className="w-full rounded-lg border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/70"
              />
            </div>
            {showVegToggle && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Classification</label>
                <select
                  value={isVeg ? "veg" : "non-veg"}
                  onChange={(e) => setIsVeg(e.target.value === "veg")}
                  className="w-full rounded-lg border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/70 cursor-pointer"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-vegetarian</option>
                </select>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void submitAdd()}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black"
            >
              Add
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modal === "edit" && !!editTarget}
        onOpenChange={(o) => {
          if (!o) {
            setModal(null);
            setEditTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border border-border">
          <DialogHeader>
            <DialogTitle>Edit {itemLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Name</label>
              <input
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  setError("");
                }}
                disabled={editTarget?.isSystem}
                className="w-full rounded-lg border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/70 disabled:opacity-60"
              />
              {editTarget?.isSystem && (
                <p className="text-[11px] text-muted-foreground">
                  System items can only be activated or deactivated.
                </p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setModal(null);
                setEditTarget(null);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2"
            >
              Cancel
            </button>
            {!editTarget?.isSystem && (
              <button
                type="button"
                onClick={() => void submitEdit()}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black"
              >
                Save
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md bg-card border border-border">
          <DialogHeader>
            <DialogTitle>Delete {itemLabel}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove <span className="font-semibold text-foreground">{deleteTarget?.label}</span>?
            This cannot be undone.
          </p>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
