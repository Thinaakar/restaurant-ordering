'use client';

import React, { useState } from 'react';
import {
  Building2,
  Clock,
  LayoutGrid,
  ChefHat,
  CreditCard,
  ChevronRight,
  Save,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Section IDs ─────────────────────────────────────────────────────────────
type SectionId =
  | 'restaurant-details'
  | 'business-hours'
  | 'table-configuration'
  | 'kitchen-configuration'
  | 'payment-configuration';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'restaurant-details',    label: 'Restaurant Details',    icon: Building2  },
  { id: 'business-hours',        label: 'Business Hours',        icon: Clock      },
  { id: 'table-configuration',   label: 'Table Configuration',   icon: LayoutGrid },
  { id: 'kitchen-configuration', label: 'Kitchen Configuration', icon: ChefHat   },
  { id: 'payment-configuration', label: 'Payment Configuration', icon: CreditCard },
];

// ─── Business hours ───────────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface DayHours {
  open: boolean;
  from: string;
  to: string;
}

const defaultHours = (): Record<string, DayHours> =>
  Object.fromEntries(
    DAYS.map((d) => [d, { open: d !== 'Sunday', from: '09:00', to: '22:00' }])
  );

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70 mb-6 flex items-center gap-2">
      <span className="inline-block w-4 h-px bg-gold/60" />
      {children}
    </h2>
  );
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-4">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-border/30 my-8" />;
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-foreground/80 mb-1.5">
      {children}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-muted-foreground mt-1">{children}</p>;
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/20 transition-all duration-200"
    />
  );
}

function SelectInput({
  id,
  value,
  onChange,
  options,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold/70 focus:ring-1 focus:ring-gold/20 transition-all duration-200 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'w-9 h-5 rounded-full relative shrink-0 transition-colors duration-200 cursor-pointer',
        value ? 'bg-gold' : 'bg-surface-3'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          value ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/30 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function SaveButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-gold gold-gradient px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      <Save className="h-3.5 w-3.5" />
      Save Changes
    </button>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function RestaurantDetails() {
  const [name,     setName]     = useState('Aura Fine Dining');
  const [tagline,  setTagline]  = useState('Where Every Moment is a Masterpiece');
  const [email,    setEmail]    = useState('reservations@aura-dining.com');
  const [phone,    setPhone]    = useState('+91 98765 43210');
  const [address,  setAddress]  = useState('12 Prestige Lane, Bandra West, Mumbai 400 050');
  const [isOpen,   setIsOpen]   = useState(true);

  return (
    <section id="restaurant-details">
      <SectionTitle>Restaurant Details</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <FieldLabel htmlFor="rest-name">Restaurant Name</FieldLabel>
          <TextInput id="rest-name" value={name} onChange={setName} placeholder="Your restaurant name" />
        </div>
        <div>
          <FieldLabel htmlFor="rest-tagline">Tagline</FieldLabel>
          <TextInput id="rest-tagline" value={tagline} onChange={setTagline} placeholder="A short brand slogan" />
        </div>
        <div>
          <FieldLabel htmlFor="rest-email">Contact Email</FieldLabel>
          <TextInput id="rest-email" value={email} onChange={setEmail} placeholder="hello@restaurant.com" type="email" />
        </div>
        <div>
          <FieldLabel htmlFor="rest-phone">Contact Phone</FieldLabel>
          <TextInput id="rest-phone" value={phone} onChange={setPhone} placeholder="+91 00000 00000" type="tel" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="rest-address">Street Address</FieldLabel>
          <TextInput id="rest-address" value={address} onChange={setAddress} placeholder="Full address" />
        </div>
      </div>

      <Divider />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Operational Status</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Marking closed disables self-order and new reservations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer',
            isOpen
              ? 'border-emerald bg-emerald/10 text-emerald'
              : 'border-destructive bg-destructive/10 text-destructive'
          )}
        >
          {isOpen ? '● Open & Trading' : '● Closed'}
        </button>
      </div>

      <div className="mt-8">
        <SaveButton onClick={() => alert('Restaurant details saved.')} />
      </div>
    </section>
  );
}

function BusinessHours() {
  const [hours, setHours] = useState<Record<string, DayHours>>(defaultHours);

  const update = (day: string, field: keyof DayHours, value: string | boolean) =>
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  return (
    <section id="business-hours">
      <SectionTitle>Business Hours</SectionTitle>

      <div className="divide-y divide-border/30">
        {DAYS.map((day) => {
          const h = hours[day];
          return (
            <div key={day} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className="w-24 text-xs font-semibold text-foreground shrink-0">{day}</span>

              <Toggle value={h.open} onChange={(v) => update(day, 'open', v)} />

              {h.open ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={h.from}
                    onChange={(e) => update(day, 'from', e.target.value)}
                    className="rounded-md border border-border bg-surface-2/40 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold/70 transition-all cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={h.to}
                    onChange={(e) => update(day, 'to', e.target.value)}
                    className="rounded-md border border-border bg-surface-2/40 px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold/70 transition-all cursor-pointer"
                  />
                </div>
              ) : (
                <span className="flex-1 text-xs text-muted-foreground/60 italic">Closed</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <SaveButton onClick={() => alert('Business hours saved.')} />
      </div>
    </section>
  );
}

function TableConfiguration() {
  const [totalTables, setTotalTables] = useState('6');
  const [capacity,    setCapacity]    = useState('4');
  const [prepTime,    setPrepTime]    = useState('15');
  const [autoAssign,  setAutoAssign]  = useState(true);
  const [showStatus,  setShowStatus]  = useState(true);

  return (
    <section id="table-configuration">
      <SectionTitle>Table Configuration</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
        <div>
          <FieldLabel htmlFor="total-tables">Total Tables</FieldLabel>
          <TextInput id="total-tables" value={totalTables} onChange={setTotalTables} type="number" />
          <FieldHint>Fixed floor layout count.</FieldHint>
        </div>
        <div>
          <FieldLabel htmlFor="seat-cap">Default Seat Capacity</FieldLabel>
          <TextInput id="seat-cap" value={capacity} onChange={setCapacity} type="number" />
          <FieldHint>Seats per table by default.</FieldHint>
        </div>
        <div>
          <FieldLabel htmlFor="prep-time">Default Prep Time (min)</FieldLabel>
          <TextInput id="prep-time" value={prepTime} onChange={setPrepTime} type="number" />
          <FieldHint>Kitchen base cooking time.</FieldHint>
        </div>
      </div>

      <Divider />

      <SubSectionTitle>Table Behaviour</SubSectionTitle>
      <div>
        <ToggleRow
          label="Auto-assign Tables"
          hint="Automatically suggest the next available table when a new order is created."
          value={autoAssign}
          onChange={setAutoAssign}
        />
        <ToggleRow
          label="Show Live Status Badges"
          hint="Display availability, occupied, and reserved badges on the table grid."
          value={showStatus}
          onChange={setShowStatus}
        />
      </div>

      <div className="mt-8">
        <SaveButton onClick={() => alert('Table configuration saved.')} />
      </div>
    </section>
  );
}

function KitchenConfiguration() {
  const [defaultOrderStatus, setDefaultOrderStatus] = useState('pending');
  const [queueMode,          setQueueMode]          = useState('fifo');
  const [maxQueueSize,       setMaxQueueSize]        = useState('20');
  const [alertThreshold,     setAlertThreshold]      = useState('10');
  const [defaultPrepTime,    setDefaultPrepTime]     = useState('15');
  const [starters,           setStarters]            = useState('10');
  const [mains,              setMains]               = useState('20');
  const [desserts,           setDesserts]            = useState('12');
  const [autoAccept,         setAutoAccept]          = useState(false);
  const [soundAlerts,        setSoundAlerts]         = useState(true);
  const [autoPriority,       setAutoPriority]        = useState(true);

  return (
    <section id="kitchen-configuration">
      <SectionTitle>Kitchen Configuration</SectionTitle>

      {/* Default Order Status */}
      <SubSectionTitle>Default Order Status</SubSectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <FieldLabel htmlFor="default-order-status">Incoming Order Status</FieldLabel>
          <SelectInput
            id="default-order-status"
            value={defaultOrderStatus}
            onChange={setDefaultOrderStatus}
            options={[
              { value: 'pending',    label: 'Pending – Awaiting Confirmation' },
              { value: 'confirmed',  label: 'Confirmed – Auto-accepted'       },
              { value: 'preparing',  label: 'Preparing – Immediately Active'  },
            ]}
          />
          <FieldHint>Status assigned when a new order enters the kitchen queue.</FieldHint>
        </div>
        <div>
          <FieldLabel htmlFor="queue-mode">Queue Processing Mode</FieldLabel>
          <SelectInput
            id="queue-mode"
            value={queueMode}
            onChange={setQueueMode}
            options={[
              { value: 'fifo',     label: 'FIFO – First In, First Out'     },
              { value: 'priority', label: 'Priority – Urgent items first'  },
              { value: 'table',    label: 'By Table – Group by table'      },
            ]}
          />
          <FieldHint>How the kitchen board orders and surfaces tickets.</FieldHint>
        </div>
      </div>

      <Divider />

      {/* Kitchen Queue Settings */}
      <SubSectionTitle>Kitchen Queue Settings</SubSectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-6">
        <div>
          <FieldLabel htmlFor="max-queue">Maximum Queue Size</FieldLabel>
          <TextInput
            id="max-queue"
            value={maxQueueSize}
            onChange={setMaxQueueSize}
            type="number"
            placeholder="20"
          />
          <FieldHint>Maximum active orders displayed on the kitchen board.</FieldHint>
        </div>
        <div>
          <FieldLabel htmlFor="alert-threshold">Overload Alert Threshold (min)</FieldLabel>
          <TextInput
            id="alert-threshold"
            value={alertThreshold}
            onChange={setAlertThreshold}
            type="number"
            placeholder="10"
          />
          <FieldHint>Trigger an alert when an order exceeds this wait time.</FieldHint>
        </div>
      </div>

      <div>
        <ToggleRow
          label="Auto-accept Incoming Orders"
          hint="Orders move directly to the queue without manual kitchen confirmation."
          value={autoAccept}
          onChange={setAutoAccept}
        />
        <ToggleRow
          label="Sound Alerts for New Tickets"
          hint="Play an audio notification when a new order arrives in the kitchen."
          value={soundAlerts}
          onChange={setSoundAlerts}
        />
        <ToggleRow
          label="Auto-priority for Large Orders"
          hint="Orders with more than 5 items are automatically flagged as high priority."
          value={autoPriority}
          onChange={setAutoPriority}
        />
      </div>

      <Divider />

      {/* Preparation Time Settings */}
      <SubSectionTitle>Preparation Time Settings</SubSectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <FieldLabel htmlFor="default-prep">Default Preparation Time (min)</FieldLabel>
          <TextInput
            id="default-prep"
            value={defaultPrepTime}
            onChange={setDefaultPrepTime}
            type="number"
            placeholder="15"
          />
          <FieldHint>Fallback prep time when no category override is set.</FieldHint>
        </div>
        <div />
        <div>
          <FieldLabel htmlFor="starters-prep">Starters (min)</FieldLabel>
          <TextInput
            id="starters-prep"
            value={starters}
            onChange={setStarters}
            type="number"
            placeholder="10"
          />
        </div>
        <div>
          <FieldLabel htmlFor="mains-prep">Main Course (min)</FieldLabel>
          <TextInput
            id="mains-prep"
            value={mains}
            onChange={setMains}
            type="number"
            placeholder="20"
          />
        </div>
        <div>
          <FieldLabel htmlFor="desserts-prep">Desserts (min)</FieldLabel>
          <TextInput
            id="desserts-prep"
            value={desserts}
            onChange={setDesserts}
            type="number"
            placeholder="12"
          />
        </div>
      </div>

      <div className="mt-8">
        <SaveButton onClick={() => alert('Kitchen configuration saved.')} />
      </div>
    </section>
  );
}

function PaymentConfiguration() {
  const [cashEnabled,   setCashEnabled]   = useState(true);
  const [cardEnabled,   setCardEnabled]   = useState(true);
  const [upiEnabled,    setUpiEnabled]    = useState(true);
  const [defaultStatus, setDefaultStatus] = useState('unpaid');
  const [taxPercent,    setTaxPercent]    = useState('5');
  const [serviceCharge, setServiceCharge] = useState('10');
  const [roundOff,      setRoundOff]      = useState(true);
  const [printReceipt,  setPrintReceipt]  = useState(false);

  const paymentMethods = [
    {
      id:      'cash',
      label:   'Cash',
      hint:    'Accept cash payments at the counter.',
      value:   cashEnabled,
      onChange: setCashEnabled,
    },
    {
      id:      'card',
      label:   'Card',
      hint:    'Debit and credit card payments via POS terminal.',
      value:   cardEnabled,
      onChange: setCardEnabled,
    },
    {
      id:      'upi',
      label:   'UPI',
      hint:    'Unified Payments Interface — QR-code-based digital payments.',
      value:   upiEnabled,
      onChange: setUpiEnabled,
    },
  ];

  return (
    <section id="payment-configuration">
      <SectionTitle>Payment Configuration</SectionTitle>

      {/* Accepted Payment Methods */}
      <SubSectionTitle>Accepted Payment Methods</SubSectionTitle>
      <div>
        {paymentMethods.map(({ id, label, hint, value, onChange }) => (
          <ToggleRow
            key={id}
            label={label}
            hint={hint}
            value={value}
            onChange={onChange}
          />
        ))}
      </div>

      <Divider />

      {/* Default Payment Status */}
      <SubSectionTitle>Default Payment Status</SubSectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <FieldLabel htmlFor="default-pay-status">Status on Order Completion</FieldLabel>
          <SelectInput
            id="default-pay-status"
            value={defaultStatus}
            onChange={setDefaultStatus}
            options={[
              { value: 'unpaid',   label: 'Unpaid – Awaiting cashier settlement' },
              { value: 'paid',     label: 'Paid – Automatically marked as paid'  },
              { value: 'pending',  label: 'Pending – Manual review required'     },
            ]}
          />
          <FieldHint>Applied automatically when an order is marked complete.</FieldHint>
        </div>
      </div>

      <Divider />

      {/* Tax & Charges */}
      <SubSectionTitle>Tax & Service Charge</SubSectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-6">
        <div>
          <FieldLabel htmlFor="tax-pct">GST / Tax Rate (%)</FieldLabel>
          <TextInput
            id="tax-pct"
            value={taxPercent}
            onChange={setTaxPercent}
            type="number"
            placeholder="5"
          />
          <FieldHint>Applied to all customer-facing order totals.</FieldHint>
        </div>
        <div>
          <FieldLabel htmlFor="service-charge">Service Charge (%)</FieldLabel>
          <TextInput
            id="service-charge"
            value={serviceCharge}
            onChange={setServiceCharge}
            type="number"
            placeholder="10"
          />
          <FieldHint>Optional service charge added to each bill.</FieldHint>
        </div>
      </div>

      <div>
        <ToggleRow
          label="Round Off Bill Total"
          hint="Round the final payable amount to the nearest whole number."
          value={roundOff}
          onChange={setRoundOff}
        />
        <ToggleRow
          label="Auto-print Receipt on Payment"
          hint="Automatically trigger a receipt print when payment is recorded."
          value={printReceipt}
          onChange={setPrintReceipt}
        />
      </div>

      <div className="mt-8">
        <SaveButton onClick={() => alert('Payment configuration saved.')} />
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('restaurant-details');

  const renderSection = () => {
    switch (activeSection) {
      case 'restaurant-details':    return <RestaurantDetails />;
      case 'business-hours':        return <BusinessHours />;
      case 'table-configuration':   return <TableConfiguration />;
      case 'kitchen-configuration': return <KitchenConfiguration />;
      case 'payment-configuration': return <PaymentConfiguration />;
    }
  };

  return (
    <div className="animate-fade-in">

      {/* Page Header */}
      <div className="mb-8 border-b border-border/20 pb-6">
        <h1 className="text-3xl font-display font-semibold tracking-tight uppercase">Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage restaurant configuration, kitchen workflow, and payment preferences.
        </p>
      </div>

      {/* Two-pane layout */}
      <div className="flex gap-8 min-h-[600px]">

        {/* ── Left Sidebar Nav ── */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-0.5 sticky top-0">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-left transition-all duration-200 group cursor-pointer',
                    isActive
                      ? 'bg-gold/10 text-gold'
                      : 'text-muted-foreground hover:bg-surface-2/60 hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors duration-200',
                      isActive
                        ? 'text-gold'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 text-gold shrink-0" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Vertical divider ── */}
        <div className="w-px bg-border/30 shrink-0" />

        {/* ── Right Content Panel ── */}
        <div className="flex-1 min-w-0 pb-16">
          {renderSection()}
        </div>

      </div>
    </div>
  );
}
