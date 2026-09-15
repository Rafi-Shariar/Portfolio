import type { ComponentType, SVGProps } from "react";
import { GithubIcon, LinkedinIcon, MailIcon } from "./social-icons";

export const SITE = {
  name: "Rafi Shariar",
  designation: "Full-Stack Developer",
  tagline:
    "I design and build fast, accessible web products end to end — from database to pixel.",
} as const;

export const TAGLINE_LINES = [
  "I design and build fast, accessible",
  "web products end to end —",
  "from database to pixel.",
] as const;

export const CONTACT_HREF = "#contact";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "github", label: "GitHub", href: "#", Icon: GithubIcon },
  { id: "linkedin", label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { id: "email", label: "Email", href: "#", Icon: MailIcon },
];
