import { Brain, Cpu, Database, Network, Code2, Server, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Server Component. The training curve is a plain SVG computed at build time
// and "drawn" by a looping CSS stroke animation, replacing a live recharts
// chart that re-rendered every 120 ms.

const EPOCHS = 80;
const W = 400;
const H = 200;
const PAD = { top: 10, right: 34, bottom: 26, left: 30 };

function generateEpochData(total) {
  const rnd = (s) => (Math.sin(s * 12.9898) * 43758.5453) % 1;
  const data = [];
  for (let e = 1; e <= total; e++) {
    const t = e / total;
    const loss = Math.max(0.02, 1.4 * Math.exp(-3.2 * t) + (rnd(e) - 0.5) * 0.06);
    const acc = Math.min(0.99, 0.15 + 0.9 * (1 - Math.exp(-3.8 * t)) + (rnd(e + 7) - 0.5) * 0.03);
    data.push({ epoch: e, loss, acc });
  }
  return data;
}

const data = generateEpochData(EPOCHS);
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;
const x = (epoch) => PAD.left + ((epoch - 1) / (EPOCHS - 1)) * plotW;
const yLoss = (v) => PAD.top + plotH - (v / 1.5) * plotH;
const yAcc = (v) => PAD.top + plotH - v * plotH;
const toPath = (fy, key) =>
  data.map((d, i) => `${i ? "L" : "M"}${x(d.epoch).toFixed(1)},${fy(d[key]).toFixed(1)}`).join("");

const lossPath = toPath(yLoss, "loss");
const accPath = toPath(yAcc, "acc");
const gridY = [0, 0.25, 0.5, 0.75, 1];

function TrainingChart() {
  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto text-muted-foreground"
        role="img"
        aria-label="Simulated training run: loss falls from about 1.4 to near 0 while accuracy rises to about 97% over 80 epochs"
      >
        {gridY.map((g) => (
          <line
            key={g}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yAcc(g)}
            y2={yAcc(g)}
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="3 3"
          />
        ))}
        {gridY.map((g) => (
          <g key={`t${g}`} fill="currentColor" fontSize="10">
            <text x={PAD.left - 6} y={yAcc(g) + 3} textAnchor="end">{(g * 1.5).toFixed(1)}</text>
            <text x={W - PAD.right + 6} y={yAcc(g) + 3}>{g.toFixed(2)}</text>
          </g>
        ))}
        {[1, 20, 40, 60, 80].map((e) => (
          <text key={e} x={x(e)} y={H - PAD.bottom + 14} fontSize="10" fill="currentColor" textAnchor="middle">
            {e}
          </text>
        ))}
        <text x={W - PAD.right} y={H - 2} fontSize="10" fill="currentColor" textAnchor="end">epochs</text>

        <path
          d={lossPath}
          pathLength="1"
          fill="none"
          stroke="hsl(var(--destructive))"
          strokeWidth="2"
          strokeLinejoin="round"
          className="draw-line"
        />
        <path
          d={accPath}
          pathLength="1"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinejoin="round"
          className="draw-line"
        />
      </svg>
      <figcaption className="mt-2 flex items-center justify-center gap-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-destructive" aria-hidden="true" /> loss
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-primary" aria-hidden="true" /> accuracy
        </span>
      </figcaption>
    </figure>
  );
}

function OrbitIcon({ icon: Icon, angle, radius }) {
  const rad = (angle * Math.PI) / 180;
  const ox = Math.cos(rad) * radius;
  const oy = Math.sin(rad) * radius;
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(calc(-50% + ${ox.toFixed(2)}px), calc(-50% + ${oy.toFixed(2)}px))` }}
    >
      <div className="w-8 h-8 rounded-full bg-card border border-border grid place-items-center shadow-sm">
        <Icon className="w-4 h-4 text-foreground" aria-hidden="true" />
      </div>
    </div>
  );
}

function TechOrbit() {
  const icons = [Brain, Cpu, Database, Network, Code2, Server, Globe];
  return (
    <div className="relative w-44 h-44 mx-auto" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border border-border/60" />
      <div className="absolute inset-0 rounded-full motion-safe:animate-[spin_20s_linear_infinite]">
        {icons.map((I, idx) => (
          <OrbitIcon key={idx} icon={I} angle={(idx / icons.length) * 360} radius={62} />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono whitespace-nowrap">
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
          <TrainingChart />
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
