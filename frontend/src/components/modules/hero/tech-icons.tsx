import type { LucideIcon } from "lucide-react";
import { Webhook } from "lucide-react";
import type { SVGProps } from "react";
import {
  siAxios,
  siCss,
  siExpress,
  siFirebase,
  siGit,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siNextdotjs,
  siNodedotjs,
  siPrisma,
  siReact,
  siReactquery,
  siRedux,
  siTailwindcss,
  siTypescript,
  siZod,
} from "simple-icons";

export type TechItem = {
  id: string;
  label: string;
  color: string;
  path?: string;
  Icon?: LucideIcon;
};

export const TECH_STACK: TechItem[] = [
  {
    id: "next",
    label: "Next.js",
    color: `#${siNextdotjs.hex}`,
    path: siNextdotjs.path,
  },
  {
    id: "react",
    label: "React.js",
    color: `#${siReact.hex}`,
    path: siReact.path,
  },
  {
    id: "typescript",
    label: "TypeScript",
    color: `#${siTypescript.hex}`,
    path: siTypescript.path,
  },
  {
    id: "javascript",
    label: "JavaScript",
    color: `#${siJavascript.hex}`,
    path: siJavascript.path,
  },
  { id: "html", label: "HTML5", color: `#${siHtml5.hex}`, path: siHtml5.path },
  { id: "css", label: "CSS3", color: `#${siCss.hex}`, path: siCss.path },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    color: `#${siTailwindcss.hex}`,
    path: siTailwindcss.path,
  },
  {
    id: "node",
    label: "Node.js",
    color: `#${siNodedotjs.hex}`,
    path: siNodedotjs.path,
  },
  {
    id: "express",
    label: "Express.js",
    color: `#${siExpress.hex}`,
    path: siExpress.path,
  },
  { id: "rest", label: "REST API", color: "#EA580C", Icon: Webhook },
  {
    id: "firebase",
    label: "Firebase",
    color: `#${siFirebase.hex}`,
    path: siFirebase.path,
  },
  {
    id: "jwt",
    label: "JWT",
    color: `#${siJsonwebtokens.hex}`,
    path: siJsonwebtokens.path,
  },
  { id: "git", label: "Git", color: `#${siGit.hex}`, path: siGit.path },
  { id: "axios", label: "Axios", color: `#${siAxios.hex}`, path: siAxios.path },
  {
    id: "prisma",
    label: "Prisma",
    color: `#${siPrisma.hex}`,
    path: siPrisma.path,
  },
  {
    id: "tanstack",
    label: "TanStack Query",
    color: `#${siReactquery.hex}`,
    path: siReactquery.path,
  },
  { id: "redux", label: "Redux", color: `#${siRedux.hex}`, path: siRedux.path },
  { id: "zod", label: "Zod", color: `#${siZod.hex}`, path: siZod.path },
];

export function TechLogo({
  item,
  ...props
}: { item: TechItem } & SVGProps<SVGSVGElement>) {
  if (item.Icon) {
    const { Icon } = item;
    return <Icon aria-hidden="true" focusable="false" {...props} />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={item.path} />
    </svg>
  );
}
