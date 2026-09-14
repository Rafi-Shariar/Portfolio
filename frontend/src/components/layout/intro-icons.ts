import type { LucideIcon } from "lucide-react";
import {
  Binary,
  Braces,
  Cloud,
  Code2,
  Command,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Rocket,
  Server,
  Terminal,
} from "lucide-react";

export type IntroDirection = "top" | "right" | "bottom" | "left";

export type IntroIconConfig = {
  id: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  from: IntroDirection;
  color: string;
  mobileHidden?: boolean;
};

export const NEON = {
  orange: "oklch(0.70 0.19 45)",
  cyan: "oklch(0.80 0.15 200)",
  violet: "oklch(0.68 0.20 300)",
  pink: "oklch(0.72 0.22 350)",
  lime: "oklch(0.85 0.19 130)",
} as const;

export const INTRO_ICONS: IntroIconConfig[] = [
  {
    id: "braces",
    Icon: Braces,
    x: 12,
    y: 26,
    from: "left",
    color: NEON.orange,
  },
  {
    id: "code",
    Icon: Code2,
    x: 30,
    y: 18,
    from: "top",
    color: NEON.cyan,
    mobileHidden: true,
  },
  { id: "cpu", Icon: Cpu, x: 70, y: 20, from: "top", color: NEON.violet },
  {
    id: "terminal",
    Icon: Terminal,
    x: 88,
    y: 28,
    from: "right",
    color: NEON.lime,
    mobileHidden: true,
  },
  { id: "git", Icon: GitBranch, x: 8, y: 54, from: "left", color: NEON.pink },
  {
    id: "database",
    Icon: Database,
    x: 92,
    y: 50,
    from: "right",
    color: NEON.orange,
  },
  {
    id: "layers",
    Icon: Layers,
    x: 22,
    y: 40,
    from: "left",
    color: NEON.cyan,
    mobileHidden: true,
  },
  {
    id: "server",
    Icon: Server,
    x: 78,
    y: 42,
    from: "right",
    color: NEON.violet,
    mobileHidden: true,
  },
  {
    id: "binary",
    Icon: Binary,
    x: 14,
    y: 80,
    from: "bottom",
    color: NEON.lime,
  },
  { id: "cloud", Icon: Cloud, x: 34, y: 88, from: "bottom", color: NEON.pink },
  {
    id: "command",
    Icon: Command,
    x: 66,
    y: 86,
    from: "bottom",
    color: NEON.orange,
  },
  {
    id: "rocket",
    Icon: Rocket,
    x: 86,
    y: 78,
    from: "bottom",
    color: NEON.cyan,
  },
];
