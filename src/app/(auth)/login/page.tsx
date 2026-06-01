'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Lock, Mail, AlertTriangle, Key, Eye, EyeOff,
  ChefHat, BarChart3, Grid3X3, Zap, Check,
  ArrowRight, User, Building2, RefreshCw,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────── */
type View = 'login' | 'register' | 'forgot';

/* ─────────────────────────── Helpers ───────────────────────── */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ─────────────────────────── Sub-components ────────────────── */

function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  showToggle,
  onToggle,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  error?: string;
  showToggle?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-xl border text-sm bg-white text-slate-900 placeholder-slate-400',
            'transition-all duration-200 outline-none',
            error
              ? 'border-red-300 ring-2 ring-red-100 focus:border-red-400'
              : 'border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
          )}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            {type === 'password' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({
  label,
  loading,
  disabled,
}: {
  label: string;
  loading: boolean;
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300',
        disabled || loading
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5'
      )}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

/* ─────────────────────────── Left Panel ────────────────────── */
const FEATURES = [
  {
    icon: ChefHat,
    title: 'Real-time Kitchen Tracking',
    desc: 'Live order queue with priority alerts and prep timers.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Grid3X3,
    title: 'Smart Table Management',
    desc: 'Visual floor plan with instant status updates.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Order Workflow Automation',
    desc: 'One-tap ordering from table to kitchen to bill.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Restaurant Analytics',
    desc: 'Revenue, peak hours, and table utilization reports.',
    color: 'bg-violet-50 text-violet-600',
  },
];

const PREVIEW_CARDS = [
  { label: 'Today\'s Revenue', value: '₹48,290', change: '+12.4%', positive: true },
  { label: 'Active Orders', value: '14', change: '+3', positive: true },
  { label: 'Tables Occupied', value: '4 / 6', change: '', positive: true },
];

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-amber-600/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-slate-700/20 blur-3xl pointer-events-none" />

      {/* Top brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Aura</span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            Restaurant OS
          </span>
        </div>

        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          The operating system<br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
            for fine dining.
          </span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
          Trusted by premium restaurants and hotel groups to streamline every operation — from kitchen to cashier.
        </p>
      </div>

      {/* Features list */}
      <div className="relative z-10 space-y-3 my-8">
        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
          <div
            key={title}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/8 backdrop-blur-sm hover:bg-white/8 transition-colors"
          >
            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', color)}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview cards */}
      <div className="relative z-10 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
          Live Dashboard Preview
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PREVIEW_CARDS.map((card) => (
            <div
              key={card.label}
              className="rounded-xl bg-white/6 border border-white/10 p-3 backdrop-blur-sm"
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                {card.label}
              </p>
              <p className="text-lg font-bold text-white tabular-nums">{card.value}</p>
              {card.change && (
                <p className="text-[10px] font-bold text-emerald-400 mt-0.5">{card.change}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex -space-x-1.5">
            {['👨‍🍳', '👩‍💼', '🧑‍🍽️'].map((emoji, i) => (
              <div
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 border border-slate-600 text-xs"
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            <span className="text-white font-semibold">200+ restaurants</span> trust Aura daily
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Login Form ────────────────────── */
function LoginForm({
  onSwitch,
  onSuccess,
}: {
  onSwitch: (v: View) => void;
  onSuccess: () => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    return e;
  };

  const isValid = email && password && isValidEmail(email);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setGlobalError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      setLoading(false);
      if (ok) onSuccess();
      else setGlobalError('Invalid credentials. Use: admin@restaurant.com / admin123');
    }, 900);
  };

  const autofill = () => { setEmail('admin@restaurant.com'); setPassword('admin123'); setErrors({}); setGlobalError(''); };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-1">Sign in to your restaurant dashboard</p>
      </div>

      {globalError && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField id="login-email" label="Email Address" type="email" value={email}
          onChange={setEmail} placeholder="admin@restaurant.com"
          icon={Mail} error={errors.email} />
        <InputField id="login-password" label="Password" type={showPw ? 'text' : 'password'}
          value={password} onChange={setPassword} placeholder="••••••••"
          icon={Lock} error={errors.password} showToggle onToggle={() => setShowPw(!showPw)} />

        <div className="flex justify-end">
          <button type="button" onClick={() => onSwitch('forgot')}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium hover:underline transition">
            Forgot password?
          </button>
        </div>

        <SubmitButton label="Sign In" loading={loading} disabled={!isValid} />
      </form>

      {/* Demo autofill */}
      <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="text-[11px] text-amber-700 font-semibold mb-2 flex items-center gap-1.5">
          <Key className="h-3.5 w-3.5" />
          Sandbox Mode — Mock Credentials
        </p>
        <p className="text-[11px] text-amber-600 mb-3">
          admin@restaurant.com · admin123
        </p>
        <button type="button" onClick={autofill}
          className="text-[11px] font-bold text-amber-700 border border-amber-300 bg-white px-3 py-1.5 rounded-lg hover:bg-amber-50 transition">
          Autofill Credentials
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        New to Aura?{' '}
        <button onClick={() => onSwitch('register')}
          className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition">
          Create an account
        </button>
      </p>
    </div>
  );
}

/* ─────────────────────────── Register Form ─────────────────── */
function RegisterForm({
  onSwitch,
  onSuccess,
}: {
  onSwitch: (v: View) => void;
  onSuccess: () => void;
}) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!restaurantName.trim()) e.restaurantName = 'Restaurant name is required';
    if (!email) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const isValid = name && restaurantName && email && isValidEmail(email) &&
    password.length >= 8 && password === confirm;

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const ok = register(name, restaurantName, email, password);
      setLoading(false);
      if (ok) onSuccess();
    }, 900);
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'];

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
        <p className="text-sm text-slate-500 mt-1">Set up your restaurant workspace in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField id="reg-name" label="Full Name" value={name} onChange={setName}
            placeholder="Jane Smith" icon={User} error={errors.name} />
          <InputField id="reg-restaurant" label="Restaurant Name" value={restaurantName}
            onChange={setRestaurantName} placeholder="Aura Bistro" icon={Building2}
            error={errors.restaurantName} />
        </div>

        <InputField id="reg-email" label="Email Address" type="email" value={email}
          onChange={setEmail} placeholder="jane@aurabistro.com" icon={Mail} error={errors.email} />

        <div>
          <InputField id="reg-password" label="Password"
            type={showPw ? 'text' : 'password'} value={password} onChange={setPassword}
            placeholder="Min. 8 characters" icon={Lock} error={errors.password}
            showToggle onToggle={() => setShowPw(!showPw)} />
          {password.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    strength >= i ? strengthColor[strength] : 'bg-slate-200'
                  )} />
                ))}
              </div>
              <span className={cn('text-[10px] font-bold',
                strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : 'text-emerald-600')}>
                {strengthLabel[strength]}
              </span>
            </div>
          )}
        </div>

        <InputField id="reg-confirm" label="Confirm Password"
          type={showCp ? 'text' : 'password'} value={confirm} onChange={setConfirm}
          placeholder="Re-enter password" icon={Lock} error={errors.confirm}
          showToggle onToggle={() => setShowCp(!showCp)} />

        <SubmitButton label="Create Account" loading={loading} disabled={!isValid} />
      </form>

      <p className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <button onClick={() => onSwitch('login')}
          className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition">
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ─────────────────────────── Forgot Password Form ──────────── */
function ForgotForm({ onSwitch }: { onSwitch: (v: View) => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid = email && isValidEmail(email) && newPw.length >= 8 && newPw === confirmPw;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (!newPw) e.newPw = 'New password is required';
    else if (newPw.length < 8) e.newPw = 'Minimum 8 characters';
    if (!confirmPw) e.confirmPw = 'Please confirm your password';
    else if (newPw !== confirmPw) e.confirmPw = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const ok = resetPassword(email, newPw);
      setLoading(false);
      if (ok) setSuccess(true);
    }, 900);
  };

  if (success) {
    return (
      <div className="animate-fade-in text-center py-8">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-100 mb-5">
          <Check className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset!</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
          Your password has been updated successfully. You can now sign in with your new credentials.
        </p>
        <button
          onClick={() => onSwitch('login')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-amber-600 hover:to-amber-700 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200"
        >
          <ArrowRight className="h-4 w-4" />
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 mb-4">
          <RefreshCw className="h-5 w-5 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Reset your password</h2>
        <p className="text-sm text-slate-500 mt-1">Enter your email and choose a new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField id="fp-email" label="Email Address" type="email" value={email}
          onChange={setEmail} placeholder="admin@restaurant.com" icon={Mail} error={errors.email} />
        <InputField id="fp-newpw" label="New Password"
          type={showPw ? 'text' : 'password'} value={newPw} onChange={setNewPw}
          placeholder="Min. 8 characters" icon={Lock} error={errors.newPw}
          showToggle onToggle={() => setShowPw(!showPw)} />
        <InputField id="fp-confirmpw" label="Confirm New Password"
          type="password" value={confirmPw} onChange={setConfirmPw}
          placeholder="Re-enter new password" icon={Lock} error={errors.confirmPw} />

        <SubmitButton label="Reset Password" loading={loading} disabled={!isValid} />
      </form>

      <p className="mt-5 text-center text-xs text-slate-500">
        Remember your password?{' '}
        <button onClick={() => onSwitch('login')}
          className="font-semibold text-amber-600 hover:text-amber-700 hover:underline transition">
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ─────────────────────────── Page ──────────────────────────── */
export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<View>('login');

  useEffect(() => {
    if (isAuthenticated) router.push('/admin/dashboard');
  }, [isAuthenticated, router]);

  const handleSuccess = () => router.push('/admin/dashboard');

  const switchView = (v: View) => setView(v);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ── Left panel ── */}
      <div className="w-[55%]">
        <LeftPanel />
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        {/* subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

        {/* Mobile brand (only shown when left panel hidden) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
            <ChefHat className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900">Aura</span>
        </div>

        <div className="w-full max-w-[400px]">
          {/* Tab pills */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-8">
            {(['login', 'register', 'forgot'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 capitalize',
                  view === v
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {v === 'login' ? 'Sign In' : v === 'register' ? 'Register' : 'Reset'}
              </button>
            ))}
          </div>

          {/* Form switcher */}
          {view === 'login' && <LoginForm onSwitch={switchView} onSuccess={handleSuccess} />}
          {view === 'register' && <RegisterForm onSwitch={switchView} onSuccess={handleSuccess} />}
          {view === 'forgot' && <ForgotForm onSwitch={switchView} />}

          {/* Footer */}
          <p className="mt-10 text-center text-[11px] text-slate-400">
            © 2025 Aura Restaurant OS · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
