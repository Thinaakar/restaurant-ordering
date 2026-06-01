"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function ChartContainer({
  children,
  className,
  title,
}: ChartContainerProps) {
  return (
    <div
      className={cn("glass rounded-lg border border-border/50 p-6", className)}
    >
      {title && (
        <h3 className="text-sm font-display font-semibold mb-6 text-gold uppercase tracking-widest">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface LineChartComponentProps {
  data: any[];
  dataKey: string;
  strokeColor?: string;
  height?: number;
  name?: string;
}

export function LineChartComponent({
  data,
  dataKey,
  strokeColor = "hsl(var(--gold))",
  height = 300,
  name = "Value",
}: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke="hsl(var(--border) / 0.15)"
        />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "11px", opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "11px", opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          dx={-8}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--surface-1))",
            border: "1px solid hsl(var(--border) / 0.3)",
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
        />
        <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "12px", paddingTop: "12px" }} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface BarChartComponentProps {
  data: any[];
  dataKey: string;
  barColor?: string;
  height?: number;
  layout?: "vertical" | "horizontal";
}

export function BarChartComponent({
  data,
  dataKey,
  barColor = "hsl(var(--gold))",
  height = 300,
  layout = "vertical",
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout === "vertical" ? "horizontal" : undefined}
        margin={layout === "vertical" ? { left: 20, right: 10, top: 10, bottom: 10 } : { top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis
          type={layout === "vertical" ? "number" : "category"}
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "11px", opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          type={layout === "vertical" ? "category" : "number"}
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "11px", opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          dataKey="name"
          width={layout === "vertical" ? 100 : 40}
          dx={-8}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--surface-1))",
            border: "1px solid hsl(var(--border) / 0.3)",
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
        />
        <Bar dataKey={dataKey} fill={barColor} radius={[8, 8, 0, 0]} barSize={layout === "vertical" ? 14 : 18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface AreaChartComponentProps {
  data: any[];
  dataKey: string;
  areaColor?: string;
  lineColor?: string;
  height?: number;
}

export function AreaChartComponent({
  data,
  dataKey,
  areaColor = "hsl(var(--gold))",
  lineColor = "hsl(var(--gold))",
  height = 300,
}: AreaChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={areaColor} stopOpacity={0.2} />
            <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="hsl(var(--border) / 0.15)"
        />
        <XAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "11px", opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "11px", opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          dx={-8}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--surface-1))",
            border: "1px solid hsl(var(--border) / 0.3)",
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={1.5}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface PieChartComponentProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  height?: number;
}

export function PieChartComponent({
  data,
  dataKey,
  nameKey = "name",
  colors = [
    "hsl(var(--gold))",
    "hsl(var(--emerald))",
    "hsl(var(--ruby))",
    "hsl(var(--sapphire))",
  ],
  height = 300,
}: PieChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          innerRadius={62}
          outerRadius={78}
          paddingAngle={5}
          cornerRadius={4}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--surface-1))",
            border: "1px solid hsl(var(--border) / 0.3)",
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  isPositive?: boolean;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  change,
  isPositive = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-lg border border-border/50 p-6 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {change !== undefined && (
          <div
            className={cn(
              "text-xs font-bold uppercase tracking-widest",
              isPositive ? "text-emerald-400" : "text-ruby-400",
            )}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
