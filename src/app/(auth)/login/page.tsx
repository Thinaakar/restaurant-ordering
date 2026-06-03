"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  RESTAURANT_EMAIL_DOMAIN,
  RESTAURANT_HOSPITALITY,
  RESTAURANT_NAME,
} from "@/lib/constants";
import {
  DEMO_SUPER_ADMIN_EMAIL,
  DEMO_SUPER_ADMIN_PASSWORD,
  verifyDemoCredentials,
} from "@/lib/demo/account";
import {
  Lock,
  Mail,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  ChefHat,
  BarChart3,
  Grid3X3,
  Zap,
  Check,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */
type View = "login" | "forgot";

/* ─────────────────────────── Helpers ───────────────────────── */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ─────────────────────────── Sub-components ────────────────── */

function InputField({
  id,
  label,
  type = "text",
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5 text-left w-full">
      <label
        htmlFor={id}
        className={cn(
          "block text-[11px] font-bold uppercase tracking-wider transition-colors duration-200",
          isFocused
            ? "text-amber-800"
            : error
              ? "text-red-650"
              : "text-stone-500",
        )}
      >
        {label}
      </label>
      <div className="relative group">
        <Icon
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 z-10",
            isFocused
              ? "text-amber-700"
              : error
                ? "text-red-450"
                : "text-stone-400",
          )}
        />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-11 pr-12 py-3 rounded-xl border text-sm bg-stone-50/50 text-stone-900 placeholder-stone-400/80",
            "transition-all duration-300 outline-none font-medium",
            error
              ? "border-red-300 ring-4 ring-red-50 focus:border-red-400 focus:ring-red-100 bg-white"
              : isFocused
                ? "border-amber-500/60 ring-4 ring-amber-50/40 bg-white shadow-[0_2px_8px_rgba(217,119,6,0.03)]"
                : "border-stone-200/80 hover:border-stone-300 bg-stone-50/30 hover:bg-stone-50/50",
          )}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors z-10"
          >
            {type === "password" ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[11px] font-medium text-red-650 animate-slide-up flex items-center gap-1.5 pl-1 pt-0.5">
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
        "relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 overflow-hidden group shadow-sm",
        disabled || loading
          ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/50"
          : "bg-stone-900 text-stone-50 hover:bg-stone-850 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_12px_rgba(28,28,28,0.06)] hover:shadow-[0_8px_20px_rgba(217,119,6,0.12)]",
      )}
    >
      {!disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}

      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-400 border-t-white" />
          <span>Synchronising...</span>
        </>
      ) : (
        <>
          <span className="relative z-10">{label}</span>
          <ArrowRight
            className={cn(
              "h-4 w-4 transition-transform duration-300 relative z-10 text-amber-400",
              !disabled && "group-hover:translate-x-0.5",
            )}
          />
        </>
      )}
    </button>
  );
}

/* ─────────────────────────── Features ────────────────────── */
const FEATURES = [
  {
    icon: ChefHat,
    title: "Kitchen Symphony",
    desc: "Coordinate preparation pacing and ticket flows with absolute precision.",
  },
  {
    icon: Grid3X3,
    title: "Floor Orchestration",
    desc: "Real-time visual table layouts, seating allocations, and cover tracking.",
  },
  {
    icon: Zap,
    title: "Table-to-Kitchen Sync",
    desc: "Direct digital orders mapped instantly from dining tables to hotpasses.",
  },
  {
    icon: BarChart3,
    title: "Hospitality Intelligence",
    desc: "Actionable summaries on cover turn rates, peak revenue hours, and speeds.",
  },
];

/* ─────────────────────────── Left Panel ────────────────────── */
function LeftPanel() {
  return (
    <div className="relative h-full min-h-[45vh] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 xl:p-16 overflow-hidden bg-stone-950">
      {/* ── Single Premium Restaurant Colorful Food Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
          className="h-full w-full object-cover select-none pointer-events-none opacity-55"
          alt="Luxury Colorful Fine Dining Gastronomy Plating"
        />
        {/* Soft, dark premium overlay blending to make white/gold letters read perfectly */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/85 via-stone-950/65 to-stone-900/80 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px] z-10" />
      </div>

      {/* ── Logo Branding (Z-Index above image) ── */}
      <div className="relative z-20 flex items-center gap-3 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
          <ChefHat className="h-5.5 w-5.5 text-amber-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-serif font-bold text-white tracking-wide leading-none">
            {RESTAURANT_NAME}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-amber-400/90 mt-1">
            Luxury Hospitality OS
          </span>
        </div>
      </div>

      {/* ── Main Hero Content ── */}
      <div className="relative z-20 my-auto py-10 max-w-xl text-left space-y-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-white/5 border border-white/10 backdrop-blur-sm">
          Premium Hospitality Release
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-white leading-[1.15] font-normal tracking-tight">
          Elevate Every <br />
          <span className="italic font-serif text-amber-300">
            Dining Experience
          </span>
          .
        </h1>
        <p className="text-stone-300 text-sm leading-relaxed max-w-md">
          Manage tables, orders, kitchen operations, billing, and restaurant
          analytics from one beautifully crafted platform.
        </p>

        {/* ── 3-4 Feature Highlights ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/10 text-amber-300">
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white tracking-wide">
                  {title}
                </h3>
                <p className="text-[11px] text-stone-300/85 leading-normal">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Simple Luxury Footer (Z-Index above image) ── */}
      <div className="relative z-20 pt-6 border-t border-white/5 text-left">
        <p className="text-[10px] text-stone-400 tracking-wide font-medium">
          Standardizing high-end operations globally · London · Paris · Tokyo ·
          New York
        </p>
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
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    return e;
  };

  const isValid = email && isValidEmail(email) && password.length >= 1;

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setGlobalError("");
    setLoading(true);
    const signIn = verifyDemoCredentials(email, password)
      ? demoLogin()
      : login(email, password);
    signIn.then((ok) => {
      setLoading(false);
      if (ok) onSuccess();
      else setGlobalError("Invalid credentials. Please try again.");
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-serif text-stone-900 font-normal mb-1 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-stone-500 font-medium">
          Sign in to access your dashboard and services
        </p>
      </div>

      {globalError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs text-red-750 shadow-sm animate-slide-up text-left">
          <AlertTriangle className="h-4 w-4 text-red-650 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Authentication Failed</p>
            <p className="text-[11px] text-red-600">{globalError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="login-email"
          label="Corporate Work Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={`you@${RESTAURANT_EMAIL_DOMAIN}`}
          icon={Mail}
          error={errors.email}
        />
        <div className="space-y-1.5">
          <InputField
            id="login-password"
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password}
            showToggle
            onToggle={() => setShowPw(!showPw)}
          />
          <div className="flex justify-end pr-1">
            <button
              type="button"
              onClick={() => onSwitch("forgot")}
              className="text-[11px] text-amber-700 hover:text-amber-850 font-bold transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="pt-2 space-y-2.5">
          <SubmitButton
            label="Sign In to Platform"
            loading={loading}
            disabled={!isValid}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setEmail(DEMO_SUPER_ADMIN_EMAIL);
              setPassword(DEMO_SUPER_ADMIN_PASSWORD);
              setErrors({});
              setGlobalError("");
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-dashed border-amber-300/80 text-amber-800 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-400/90 transition-all duration-200 disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5" />
            Demo Super Admin
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────── Forgot Password Form ──────────── */
function ForgotForm({ onSwitch }: { onSwitch: (v: View) => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid =
    email && isValidEmail(email) && newPw.length >= 8 && newPw === confirmPw;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address";
    if (!newPw) e.newPw = "New password is required";
    else if (newPw.length < 8) e.newPw = "Minimum 8 characters";
    if (!confirmPw) e.confirmPw = "Please confirm your password";
    else if (newPw !== confirmPw) e.confirmPw = "Passwords do not match";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
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
      <div className="text-center py-6 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-250 shadow-md mx-auto">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-stone-900 font-normal">
            Password updated
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
            Your telemetry key has been reset successfully. You can now access
            your restaurant console.
          </p>
        </div>
        <button
          onClick={() => onSwitch("login")}
          className="inline-flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-900 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow hover:shadow-md transition-all active:translate-y-0"
        >
          Return to Sign In
          <ArrowRight className="h-4 w-4 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/50 mb-4">
          <RefreshCw
            className="h-5 w-5 text-amber-700 animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>
        <h2 className="text-2xl font-serif text-stone-900 font-normal mb-1.5 tracking-tight">
          Reset password
        </h2>
        <p className="text-xs text-stone-500">
          Resecure your credentials to continue operations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="fp-email"
          label="Corporate Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={`you@${RESTAURANT_EMAIL_DOMAIN}`}
          icon={Mail}
          error={errors.email}
        />
        <InputField
          id="fp-newpw"
          label="New Password"
          type={showPw ? "text" : "password"}
          value={newPw}
          onChange={setNewPw}
          placeholder="Minimum 8 characters"
          icon={Lock}
          error={errors.newPw}
          showToggle
          onToggle={() => setShowPw(!showPw)}
        />
        <InputField
          id="fp-confirmpw"
          label="Confirm New Password"
          type="password"
          value={confirmPw}
          onChange={setConfirmPw}
          placeholder="Re-enter your new password"
          icon={Lock}
          error={errors.confirmPw}
        />

        <div className="pt-2">
          <SubmitButton
            label="Save & Sign In"
            loading={loading}
            disabled={!isValid}
          />
        </div>
      </form>

      <div className="pt-4 border-t border-stone-100 text-left">
        <p className="text-center text-xs text-stone-500">
          Remembered your password?{" "}
          <button
            onClick={() => onSwitch("login")}
            className="font-bold text-amber-700 hover:text-amber-800 hover:underline transition-colors"
          >
            Sign in →
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Page ──────────────────────────── */
export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState<View>("login");

  // Handle URL query parameters for view switching
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view") as View | null;
    if (viewParam && (viewParam === "login" || viewParam === "forgot")) {
      setView(viewParam);
    }
  }, []);

  // Only redirect after auth state has been resolved from localStorage
  useEffect(() => {
    if (!loading && isAuthenticated) router.push("/admin/dashboard");
  }, [isAuthenticated, loading, router]);

  // Show nothing while resolving stored session to prevent flicker
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBFA]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-600" />
      </div>
    );
  }

  const handleSuccess = () => router.push("/admin/dashboard");

  const switchView = (v: View) => {
    setView(v);
    const url = new URL(window.location.href);
    url.searchParams.set("view", v);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FCFBFA] select-none">
      {/* ── Left Side (60%) with vibrant colorful premium background image ── */}
      <div className="w-full lg:w-[60%] min-h-[45vh] lg:min-h-screen">
        <LeftPanel />
      </div>

      {/* ── Right Side (40%) with clean white layout ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-[#FCFBFA] relative min-h-screen lg:min-h-0">
        {/* Premium top accent gold/bronze bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-100 via-amber-500/70 to-amber-100" />

        {/* Ambient background soft champagne glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Mobile brand header (only shown when left panel is hidden) */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2.5 lg:hidden z-20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 shadow-md">
            <ChefHat className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-serif font-bold text-stone-900 leading-none">
              {RESTAURANT_NAME}
            </span>
            <span className="text-[7px] font-bold uppercase tracking-wider text-amber-700 mt-0.5">
              Luxury Hospitality OS
            </span>
          </div>
        </div>

        {/* Centered Glassmorphic Authentication Card */}
        <div className="w-full max-w-[420px] relative mt-12 lg:mt-0 flex flex-col justify-between min-h-[500px]">
          <div className="my-auto relative">
            <div className="absolute -inset-8 rounded-[40px] blur-3xl bg-gradient-to-r from-amber-500/3 via-transparent to-amber-500/3 -z-10 pointer-events-none" />

            {/* Centered clean white authentication card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(40,40,40,0.03)] border border-stone-200/50 p-7 sm:p-9 w-full mx-auto relative overflow-hidden transition-all duration-500 hover:shadow-[0_24px_60px_rgba(180,120,40,0.05)] hover:border-stone-200/70 hover:translate-y-[-2px]">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl -z-10 pointer-events-none" />

              <div className="transition-all duration-300">
                {view === "login" && (
                  <LoginForm onSwitch={switchView} onSuccess={handleSuccess} />
                )}
                {view === "forgot" && <ForgotForm onSwitch={switchView} />}
              </div>
            </div>
          </div>

          {/* Premium Bottom Footer Links */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-3">
              <a
                href="#"
                className="text-xs text-stone-500 hover:text-stone-850 font-medium transition-colors"
              >
                Help Desk
              </a>
              <span className="text-stone-300 hidden sm:inline">·</span>
              <a
                href="#"
                className="text-xs text-stone-500 hover:text-stone-850 font-medium transition-colors"
              >
                Corporate Privacy
              </a>
              <span className="text-stone-300 hidden sm:inline">·</span>
              <a
                href="#"
                className="text-xs text-stone-500 hover:text-stone-850 font-medium transition-colors"
              >
                Terms of Use
              </a>
            </div>
            <p className="text-center text-[10px] text-stone-400 font-medium">
              © 2026 {RESTAURANT_HOSPITALITY} · Standardizing Culinary
              Excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
