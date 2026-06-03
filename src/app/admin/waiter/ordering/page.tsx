'use client';

import React, { useState, useCallback } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { useTables } from '@/hooks/use-tables';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { OrderItem } from '@/data/types';
import { TableSelection } from './_components/table-selection';
import { MenuBrowser } from './_components/menu-browser';
import { CartSidebar } from './_components/cart-sidebar';
import { ActiveOrders } from './_components/active-orders';
import { OrderConfirmationModal } from './_components/order-confirmation-modal';
import {
  Grid3X3,
  UtensilsCrossed,
  ShoppingCart,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react';

type WorkflowStep = 'tables' | 'menu' | 'active-orders';

export default function OrderEntryPage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('tables');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const { items, tableId, tableNumber, clearCart, selectTable } = useCart();
  const { placeOrder, orders } = useOrders();
  const { occupyTable } = useTables();
  const { addToast } = useToast();

  const handleTableSelect = useCallback(
    (selectedTableId: string, selectedTableNumber: number) => {
      selectTable(selectedTableId, selectedTableNumber);
      // Mark table occupied with a temporary placeholder
      occupyTable(selectedTableId, 'pending-order');
      addToast({
        title: 'Table Assigned',
        description: `Table ${selectedTableNumber} is now assigned to you.`,
        type: 'success',
      });
      setCurrentStep('menu');
    },
    [selectTable, occupyTable, addToast]
  );

  const handlePlaceOrder = useCallback(() => {
    if (!tableId || !tableNumber || items.length === 0) return;

    const orderItems: OrderItem[] = items.map((ci) => ({
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      price: ci.menuItem.price,
      quantity: ci.quantity,
      specialInstructions: ci.specialInstructions,
    }));

    void placeOrder(tableId, tableNumber, orderItems).then((orderId) => {
    setLastOrderId(orderId);
    clearCart();
    setIsCartOpen(false);
    setShowConfirmation(true);

    addToast({
      title: 'Order Placed Successfully!',
      description: `Order ${orderId} sent to kitchen for Table ${tableNumber}.`,
      type: 'success',
      duration: 5000,
    });
    });
  }, [tableId, tableNumber, items, placeOrder, clearCart, addToast]);

  const handleConfirmationClose = useCallback(() => {
    setShowConfirmation(false);
    setLastOrderId(null);
    setCurrentStep('tables');
  }, []);

  const handleViewActiveOrders = useCallback(() => {
    setShowConfirmation(false);
    setCurrentStep('active-orders');
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== 'completed'
  );

  const steps = [
    { key: 'tables' as const, label: 'Select Table', icon: Grid3X3 },
    { key: 'menu' as const, label: 'Order Menu', icon: UtensilsCrossed },
    { key: 'active-orders' as const, label: 'Active Orders', icon: ClipboardList },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient shadow-lg">
              <UtensilsCrossed className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold gold-text tracking-wide">
                Orders
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select a table, browse the menu, and send orders to the kitchen
              </p>
            </div>
          </div>
        </div>

        {/* Cart FAB for mobile */}
        {currentStep === 'menu' && items.length > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 gold-gradient text-black font-bold px-5 py-3.5 rounded-full shadow-2xl animate-scale-in"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{items.length} items</span>
          </button>
        )}
      </div>

      {/* Step Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm w-fit">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.key;
          const isAccessible =
            step.key === 'tables' ||
            step.key === 'active-orders' ||
            (step.key === 'menu' && tableId);

          return (
            <button
              key={step.key}
              onClick={() => isAccessible && setCurrentStep(step.key)}
              disabled={!isAccessible}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gold/15 text-gold shadow-sm border border-gold/30'
                  : isAccessible
                    ? 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                    : 'text-muted-foreground/40 cursor-not-allowed'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{step.label}</span>
              {step.key === 'active-orders' && activeOrders.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-bold">
                  {activeOrders.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Assigned Table Info Bar */}
      {tableId && tableNumber && currentStep === 'menu' && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-gold/5 border border-gold/20 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
              <Grid3X3 className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-bold text-gold">Table {tableNumber}</p>
              <p className="text-[10px] text-muted-foreground">Currently Assigned</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep('tables')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg border border-border hover:border-foreground/20"
            >
              <ArrowLeft className="h-3 w-3" />
              Change Table
            </button>
            {items.length > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-black gold-gradient px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Cart ({items.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="relative min-h-[60vh]">
        {currentStep === 'tables' && (
          <div className="animate-fade-in">
            <TableSelection onTableSelect={handleTableSelect} />
          </div>
        )}

        {currentStep === 'menu' && (
          <div className="animate-fade-in flex gap-6">
            <div className="flex-1 min-w-0">
              <MenuBrowser />
            </div>
            {/* Desktop Cart Sidebar */}
            <div className="hidden lg:block w-[380px] shrink-0">
              <CartSidebar
                onPlaceOrder={handlePlaceOrder}
                isPanel
              />
            </div>
          </div>
        )}

        {currentStep === 'active-orders' && (
          <div className="animate-fade-in">
            <ActiveOrders />
          </div>
        )}
      </div>

      {/* Mobile/Tablet Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md animate-slide-in-left">
            <CartSidebar
              onPlaceOrder={handlePlaceOrder}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showConfirmation && lastOrderId && (
        <OrderConfirmationModal
          orderId={lastOrderId}
          tableNumber={tableNumber!}
          onClose={handleConfirmationClose}
          onViewOrders={handleViewActiveOrders}
        />
      )}
    </div>
  );
}
