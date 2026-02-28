"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Brain, Cpu, Database, Network, Code2, Server, Globe } from "lucide-react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function generateEpochData(total = 80) {
  const rnd = (s) => (Math.sin(s * 12.9898) * 43758.5453) % 1;
  const data = [];
  for (let e = 1; e <= total; e++) {
    const t = e / total;
    const loss = Math.max(0.02, 1.4 * Math.exp(-3.2 * t) + (rnd(e) - 0.5) * 0.06);
    const acc = Math.min(0.99, 0.15 + 0.9 * (1 - Math.exp(-3.8 * t)) + (rnd(e+7) - 0.5) * 0.03);
    data.push({ epoch: e, loss: +loss.toFixed(3), acc: +acc.toFixed(3) });
  }
  return data;
}

export function TrainingVisualizer() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const fullData = useMemo(() => generateEpochData(80), []);
  const [cursor, setCursor] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    timerRef.current = window.setInterval(() => {
      setCursor(c => (c >= fullData.length ? 1 : c + 1));
    }, 120);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion, fullData.length]);

  const view = prefersReducedMotion ? fullData : fullData.slice(0, cursor);

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer>
        <LineChart data={view} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="epoch" tick={{ fontSize: 12 }} label={{ value: "epochs", position: "insideBottomRight", offset: -4, style: { fill: "var(--muted-foreground)" } }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[0, 1.5]} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 1]} />
          <Tooltip formatter={(v) => v.toFixed(3)} labelFormatter={(l) => `epoch ${l}`} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="loss" name="loss" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line yAxisId="right" type="monotone" dataKey="acc" name="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function OrbitIcon({ icon: Icon, angle, radius }) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
    >
      <div className="w-8 h-8 rounded-full bg-card border border-border grid place-items-center shadow-sm">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
    </div>
  );
}

export function TechOrbit() {
  const icons = [Brain, Cpu, Database, Network, Code2, Server, Globe];
  const radius = 62;
  return (
    <div className="relative w-44 h-44 mx-auto">
      <div className="absolute inset-0 rounded-full border border-border/60" />
      <div className="absolute inset-0 rounded-full animate-[spin_20s_linear_infinite]">
        {icons.map((I, idx) => (
          <OrbitIcon key={idx} icon={I} angle={(idx / icons.length) * 360} radius={radius} />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
          full‑stack + ai/ml
        </div>
      </div>
    </div>
  );
}

export default function AIShowcase() {
  return (
    <Card className="p-6 md:p-8 hover-elevate">
      <div className="grid md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-3 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">live • training</Badge>
            <span className="text-sm text-muted-foreground">simulated metric stream</span>
          </div>
          <h3 className="text-xl font-semibold">Hands-on AI · Training Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Loss falls as accuracy rises in a smooth, noisy curve — a quick visual nod to gradient-based learning.
          </p>
          <TrainingVisualizer />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">craft + stack</h4>
          <TechOrbit />
          <div className="flex flex-wrap gap-2">
            {["react", "javascript", "vite", "tailwind", "three.js", "node", "express", "python", "postgres"].map((t) => (
              <Badge key={t} variant="outline" className="font-mono">{t}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
